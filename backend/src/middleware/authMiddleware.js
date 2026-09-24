import { createClient } from '@supabase/supabase-js';

export async function requireAuth(req, res, next) {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required.'
      });
    }

    const accessToken = authHeader.substring(7);

    const supabaseUrl = process.env.SUPABASE_URL;
    const supabaseAnonKey = process.env.SUPABASE_ANON_KEY;

    if (!supabaseUrl || !supabaseAnonKey) {
      return res.status(500).json({
        success: false,
        message: 'Supabase configuration is missing.'
      });
    }

    const userSupabase = createClient(
      supabaseUrl,
      supabaseAnonKey,
      {
        global: {
          headers: {
            Authorization: `Bearer ${accessToken}`
          }
        }
      }
    );

    const {
      data: { user },
      error
    } = await userSupabase.auth.getUser(accessToken);

    console.log('AUTH CHECK:', {
      error: error?.message,
      userId: user?.id
    });

    if (error || !user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid or expired session.'
      });
    }

    req.user = user;
    req.supabase = userSupabase;

    next();
  } catch (error) {
    console.error(
      'Authentication middleware error:',
      error
    );

    return res.status(500).json({
      success: false,
      message: 'Unable to verify authentication.'
    });
  }
}