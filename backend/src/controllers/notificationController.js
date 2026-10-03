import { createClient } from '@supabase/supabase-js';


// Only the server can enumerate Auth accounts. Never expose this key to the browser.
function notificationDatabase() {
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!key) throw Object.assign(new Error('Missing backend service key'), { code: 'NOTIFICATIONS_CONFIGURATION' });
  return createClient(process.env.SUPABASE_URL, key, {
    auth: { persistSession: false, autoRefreshToken: false, detectSessionInUrl: false }
  });
}

async function databaseUsers(req, client) {
  const users = [];
  for (let page = 1; ; page++) {
    const { data, error } = await client.auth.admin.listUsers({ page, perPage: 1000 });
    if (error) throw error;
    users.push(...data.users);
    if (data.users.length < 1000) break;
  }
  return { users };
}

export function createNotificationHandler(loadUsers = databaseUsers, makeDatabase = notificationDatabase) {
  return async function listNotifications(req, res) {
    const page = Math.min(1000, Math.max(1, Number.parseInt(req.query.page, 10) || 1));
    const needed = page * 20 + 1;
    try {
      const database = makeDatabase(req);
      const [accounts, reports] = await Promise.all([
        loadUsers(req, database),
        (async () => {
          const rows = [];
          // Fetch enough from each source before merging, even with PostgREST's row limit.
          for (let offset = 0; offset < needed; offset += 1000) {
            let query = database.from('reports').select('id,user_id,created_at');
            const end = Math.min(offset + 999, needed - 1);
            const { data, error } = await query.order('created_at', { ascending: false }).order('id', { ascending: false }).range(offset, end);
            if (error) throw error;
            rows.push(...data);
            if (data.length < end - offset + 1) break;
          }
          return rows;
        })()
      ]);
      const accountNames = new Map(accounts.users.map(user => [user.id, [user.user_metadata?.first_name, user.user_metadata?.last_name].filter(Boolean).join(' ') || 'A user']));
      const events = [
        ...accounts.users.map(user => ({ id: `account:${user.id}`, kind: 'account', name: [user.user_metadata?.first_name, user.user_metadata?.last_name].filter(Boolean).join(' ') || 'A user', occurred_at: user.created_at })),
        ...reports.map(report => ({ id: `report:${report.id}`, kind: 'report', name: accountNames.get(report.user_id) || 'A user', occurred_at: report.created_at }))
      ].sort((a, b) => new Date(b.occurred_at) - new Date(a.occurred_at) || b.id.localeCompare(a.id));
      res.set('Cache-Control', 'no-store');
      return res.json({ success: true, notifications: events.slice((page - 1) * 20, page * 20), hasMore: events.length > page * 20, page, ...(accounts.warning ? { warning: accounts.warning } : {}) });
    } catch (error) {
      console.error('Notification database query failed:', { code: error?.code, message: error?.message });
      if (error?.code === 'NOTIFICATIONS_CONFIGURATION') return res.status(503).json({ success: false, message: 'Shared notifications are not configured yet. Ask the site owner to configure the backend service key.' });
      return res.status(503).json({ success: false, message: 'Unable to read account or report notifications from the database. Please try again.' });
    }
  };
}
export const listNotifications = createNotificationHandler();


