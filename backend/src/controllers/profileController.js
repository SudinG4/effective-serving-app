export function getProfile(req, res) {
  res.set('Cache-Control', 'no-store');
  return res.json({ success: true, user: req.user });
}

export async function updateProfile(req, res) {
  const { firstName, lastName, password } = req.body || {};
  if (typeof firstName !== 'string' || !firstName.trim() || typeof lastName !== 'string' || !lastName.trim()) {
    return res.status(400).json({ success: false, message: 'First and last name are required.' });
  }
  if (password !== undefined && (typeof password !== 'string' || password.length < 6)) {
    return res.status(400).json({ success: false, message: 'Password must contain at least 6 characters.' });
  }
  try {
    const response = await fetch(`${process.env.SUPABASE_URL}/auth/v1/user`, {
      method: 'PUT',
      headers: { apikey: process.env.SUPABASE_ANON_KEY, Authorization: req.headers.authorization, 'Content-Type': 'application/json' },
      body: JSON.stringify({ data: { ...req.user.user_metadata, first_name: firstName.trim(), last_name: lastName.trim() }, ...(password === undefined ? {} : { password }) })
    });
    const user = await response.json();
    if (!response.ok) return res.status(400).json({ success: false, message: user.msg || user.message || 'Unable to update account.' });
    res.set('Cache-Control', 'no-store');
    return res.json({ success: true, user });
  } catch {
    return res.status(503).json({ success: false, message: 'Unable to update account. Please try again.' });
  }
}
