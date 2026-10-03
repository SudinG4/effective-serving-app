import { createClient } from '@supabase/supabase-js';

export function createServerDatabase() {
  if (!process.env.SUPABASE_SERVICE_ROLE_KEY) return null;
  return createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY, {
    auth: { persistSession: false, autoRefreshToken: false, detectSessionInUrl: false }
  });
}

export async function resolveAccountRole(user, serverDatabase) {
  if (serverDatabase) {
    const { data, error } = await serverDatabase.from('profiles').select('role').eq('id', user.id).maybeSingle();
    // Projects without profiles can continue using protected Auth metadata.
    if (error && !['PGRST205', '42P01'].includes(error.code)) throw error;
    if (data) return data.role === 'admin' ? 'admin' : 'user';
  }
  return user.app_metadata?.role === 'admin' ? 'admin' : 'user';
}
