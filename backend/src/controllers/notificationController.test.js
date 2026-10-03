import test from 'node:test';
import assert from 'node:assert/strict';
import { createNotificationHandler, listNotifications } from './notificationController.js';
function response() {
  return { code: 200, headers: {}, set(name, value) { this.headers[name] = value; }, status(code) { this.code = code; return this; }, json(body) { this.body = body; return this; } };
}
function request(reports = [], admin = false, page = 1) {
  const calls = [];
  const query = { eq(...args) { calls.push(args); return this; }, order() { return this; }, range(start, end) { return Promise.resolve({ data: reports.slice(start, end + 1), error: null }); } };
  return { query: { page }, user: { id: 'owner', created_at: '2020-01-01T08:00:00Z', user_metadata: { first_name: 'Owner', role: 'admin' }, app_metadata: admin ? { role: 'admin' } : {} }, supabase: { from(table) { assert.equal(table, 'reports'); return { select() { return query; } }; } }, calls };
}
test('ordinary users can see shared events with historical timestamps', async () => {
  const req = request([{ id: 'r1', created_at: '2021-01-01T12:34:56Z', user_id: 'owner' }]);
  const res = response();
  await createNotificationHandler(async () => ({ users: [req.user] }), req => req.supabase)(req, res);
  assert.deepEqual(req.calls, []);
  assert.deepEqual(res.body.notifications.map(e => e.kind), ['report', 'account']);
  assert.equal(res.body.notifications[1].occurred_at, req.user.created_at);
  assert.equal(res.body.notifications[0].occurred_at, '2021-01-01T12:34:56Z');
  assert.equal(res.headers['Cache-Control'], 'no-store');
});
test('ordinary users see other account joins and report history across older pages', async () => {
  const reports = Array.from({ length: 25 }, (_, i) => ({ id: `r${i}`, created_at: new Date(Date.UTC(2026, 0, 26 - i)).toISOString() }));
  const handler = createNotificationHandler(async () => ({ users: [{ id: 'other', created_at: '2026-02-01T00:00:00Z' }] }), req => req.supabase);
  const first = response(); const second = response();
  const req = request(reports, false);
  await handler(req, first);
  await handler(request(reports, false, 2), second);
  assert.equal(req.calls.length, 0);
  assert.equal(first.body.notifications[0].id, 'account:other');
  assert.equal(first.body.notifications.length, 20);
  assert.equal(first.body.hasMore, true);
  assert.equal(second.body.notifications.length, 6);
  assert.equal(second.body.hasMore, false);
  assert.equal(new Set([...first.body.notifications, ...second.body.notifications].map(e => e.id)).size, 26);
});
test('database failures do not disclose internal details', async () => {
  const res = response();
  await createNotificationHandler(async () => { throw new Error('private details'); }, req => req.supabase)(request(), res);
  assert.equal(res.code, 503);
  assert.ok(!res.body.message.includes('private details'));
});
test('invalid page defaults to one', async () => {
  const res = response(); await createNotificationHandler(async () => ({ users: [] }), req => req.supabase)(request([], false, -5), res);
  assert.equal(res.body.page, 1);
});


