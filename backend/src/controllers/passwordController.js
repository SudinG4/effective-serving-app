import { createClient } from '@supabase/supabase-js';

// Recovery sessions must never be shared between requests/users.
export function createPasswordHandlers(makeClient = () => createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY,
  { auth: { persistSession: false, autoRefreshToken: false, detectSessionInUrl: false } }
)) {
  return {
    async forgotPassword(req, res) {
      const email = req.body?.email;
      if (typeof email !== 'string' || !/^\S+@\S+\.\S+$/.test(email.trim())) {
        return res.status(400).json({ success: false, message: 'Please enter a valid email address.' });
      }
      try {
        const redirectTo = new URL('/reset-password', process.env.FRONTEND_URL || 'http://localhost:5173').href;
        const { error } = await makeClient().auth.resetPasswordForEmail(email.trim().toLowerCase(), { redirectTo });
        if (error && (error.status === 429 || error.status >= 500)) {
          return res.status(error.status === 429 ? 429 : 503).json({ success: false, message: 'Unable to send a reset email right now. Please try again later.' });
        }
        // Do not disclose whether this address has an account.
        return res.json({ success: true, message: 'If an account exists for this email, you will receive a password reset link. Check your inbox and spam folder.' });
      } catch {
        return res.status(503).json({ success: false, message: 'Unable to send a reset email right now. Please try again later.' });
      }
    },
    async resetPassword(req, res) {
      const { password, accessToken, refreshToken } = req.body || {};
      if (typeof password !== 'string' || password.length < 6) {
        return res.status(400).json({ success: false, message: 'Password must contain at least 6 characters.' });
      }
      if (typeof accessToken !== 'string' || !accessToken || typeof refreshToken !== 'string' || !refreshToken) {
        return res.status(401).json({ success: false, message: 'This reset link is invalid or expired. Please request a new one.' });
      }
      try {
        const client = makeClient();
        const { error: sessionError } = await client.auth.setSession({ access_token: accessToken, refresh_token: refreshToken });
        if (sessionError) {
          return res.status(401).json({ success: false, message: 'This reset link is invalid or expired. Please request a new one.' });
        }
        const { error } = await client.auth.updateUser({ password });
        if (error) {
          return res.status(400).json({ success: false, message: error.message });
        }
        await client.auth.signOut({ scope: 'global' });
        return res.json({ success: true, message: 'Your password has been updated. You can now log in with your new password.' });
      } catch {
        return res.status(503).json({ success: false, message: 'Unable to reset your password. Please try again.' });
      }
    }
  };
}

export const { forgotPassword, resetPassword } = createPasswordHandlers();
