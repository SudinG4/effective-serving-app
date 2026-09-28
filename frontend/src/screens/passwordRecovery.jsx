import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { HeartPulse } from 'lucide-react';
import { Logo } from '../components';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5001';
const invalidLink = 'This reset link is invalid or expired. Please request a new one.';

function RecoveryForm({ reset = false }) {
  const [recovery] = useState(() => {
    const params = new URLSearchParams(window.location.hash.slice(1));
    return params.get('type') === 'recovery' && !params.has('error') ? {
      accessToken: params.get('access_token'), refreshToken: params.get('refresh_token')
    } : null;
  });
  const validLink = !!(recovery?.accessToken && recovery?.refreshToken);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [status, setStatus] = useState('');
  const [expired, setExpired] = useState(false);

  useEffect(() => {
    if (reset) window.history.replaceState(window.history.state, '', window.location.pathname);
  }, [reset]);

  async function submit(event) {
    event.preventDefault();
    if (loading) return;
    setError('');
    if (reset && password !== confirm) {
      setError('Passwords do not match.');
      return;
    }
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/${reset ? 'reset-password' : 'forgot-password'}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(reset ? { ...recovery, password } : { email: email.trim() })
      });
      const data = await response.json();
      if (!response.ok || !data.success) {
        if (reset && response.status === 401) setExpired(true);
        throw new Error(data.message || 'Something went wrong. Please try again.');
      }
      if (reset) {
        localStorage.removeItem('wbc-user');
        localStorage.removeItem('wbc-access-token');
        localStorage.removeItem('wbc-account');
        setPassword('');
        setConfirm('');
      }
      setStatus(data.message);
    } catch (err) {
      setError(err instanceof TypeError ? 'Unable to connect. Please try again.' : err.message);
    } finally {
      setLoading(false);
    }
  }

  return <div className="auth-page">
    <header className="auth-header"><Logo /></header>
    <main className="auth-main">
      <form className="auth-card" onSubmit={submit}>
        <span className="auth-icon"><HeartPulse /></span>
        <h1>{reset ? 'Set a new password' : 'Forgot your password?'}</h1>
        <p>{reset ? 'Choose a new password for your account.' : 'Enter your email and we’ll send you a password reset link.'}</p>
        {reset && (!validLink || expired) ? <p className="form-error" role="alert">{invalidLink}</p> : !status && <>
          {reset ? <>
            <label>New password<input type="password" autoComplete="new-password" required minLength={6} value={password} onChange={e => setPassword(e.target.value)} disabled={loading} /></label>
            <label>Confirm new password<input type="password" autoComplete="new-password" required minLength={6} value={confirm} onChange={e => setConfirm(e.target.value)} disabled={loading} /></label>
            <p className="prototype">Use at least 6 characters.</p>
          </> : <label>Email<input type="email" autoComplete="email" required value={email} onChange={e => setEmail(e.target.value)} placeholder="you@example.com" disabled={loading} /></label>}
          <button className="button full" type="submit" disabled={loading}>{loading ? 'Please wait…' : reset ? 'Update password' : 'Send reset link'}</button>
        </>}
        {error && !expired && <p className="form-error" role="alert">{error}</p>}
        {status && <p className="prototype" role="status">{status}</p>}
        {reset && (!validLink || expired) && <p className="switch"><Link to="/forgot-password">Request a new reset link</Link></p>}
        <p className="switch"><Link to="/login">Back to log in</Link></p>
      </form>
    </main>
  </div>;
}

export function ForgotPassword() { return <RecoveryForm />; }
export function ResetPassword() { return <RecoveryForm reset />; }
