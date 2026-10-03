import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { BottomNav, Logo } from '../components';
import { profileRequest } from '../accountApi';

export default function Account() {
  const [user, setUser] = useState(null);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [error, setError] = useState('');
  const [status, setStatus] = useState('');
  const [saving, setSaving] = useState(false);
  const [retry, setRetry] = useState(0);
  useEffect(() => {
    let active = true;
    setError('');
    profileRequest().then(profile => {
      if (!active) return;
      setUser(profile); setFirstName(profile.user_metadata?.first_name || ''); setLastName(profile.user_metadata?.last_name || '');
    }).catch(err => { if (active) setError(err.message); });
    return () => { active = false; };
  }, [retry]);
  async function save(event) {
    event.preventDefault(); setError(''); setStatus('');
    if (password !== confirm) { setError('Passwords do not match.'); return; }
    setSaving(true);
    try {
      const profile = await profileRequest({ firstName, lastName, ...(password ? { password } : {}) });
      setUser(profile);
      localStorage.setItem('wbc-user', JSON.stringify({ id: profile.id, firstName: profile.user_metadata.first_name, lastName: profile.user_metadata.last_name, email: profile.email, phone: profile.user_metadata.phone || '' }));
      setPassword(''); setConfirm(''); setStatus('Your account has been updated.');
    } catch (err) { setError(err.message); }
    finally { setSaving(false); }
  }
  return <>
    <header className="results-header"><div className="shell nav"><Logo /><Link to="/dashboard" className="button secondary small">Dashboard</Link></div></header>
    <main className="shell account-page"><form className="auth-card" onSubmit={save}>
      <h1>Account settings</h1><p>View your information and update your name or password.</p>
      {error && <p className="form-error" role="alert">{error}</p>}
      {status && <p role="status">{status}</p>}
      {!user ? error ? <button type="button" className="button" onClick={() => setRetry(n => n + 1)}>Try again</button> : <p role="status">Loading account…</p> : <>
        <p><strong>Email:</strong> {user.email}</p>
        <p><strong>Phone:</strong> {user.user_metadata?.phone || 'Not provided'}</p>
        <p><strong>Joined:</strong> {new Date(user.created_at).toLocaleDateString()}</p>
        <label>First name<input required value={firstName} onChange={e => setFirstName(e.target.value)} autoComplete="given-name" /></label>
        <label>Last name<input required value={lastName} onChange={e => setLastName(e.target.value)} autoComplete="family-name" /></label>
        <label>New password<input type="password" minLength={6} value={password} onChange={e => setPassword(e.target.value)} autoComplete="new-password" /></label>
        <p>Leave blank to keep your current password. Use at least 6 characters.</p>
        <label>Confirm new password<input type="password" value={confirm} onChange={e => setConfirm(e.target.value)} autoComplete="new-password" required={!!password} /></label>
        <button className="button full" disabled={saving}>{saving ? 'Saving…' : 'Save changes'}</button>
      </>}
    </form></main><BottomNav />
  </>;
}
