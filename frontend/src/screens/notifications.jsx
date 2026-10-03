import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { Bell, FileText, UserRound } from 'lucide-react';

const API = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5001';

export default function Notifications() {
  const [open, setOpen] = useState(false);
  const [events, setEvents] = useState([]);
  const [error, setError] = useState('');
  const [warning, setWarning] = useState('');
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);
  const [retry, setRetry] = useState(0);
  const container = useRef(null);
  useEffect(() => {
    if (!open) return;
    let active = true;
    setLoading(true); setError('');
    fetch(`${API}/api/notifications?page=${page}`, {
      headers: { Authorization: `Bearer ${localStorage.getItem('wbc-access-token') || ''}` }, cache: 'no-store'
    }).then(async response => {
      const data = await response.json();
      if (!response.ok) throw new Error(response.status === 401 ? 'Your session expired. Please log in again.' : data.message || 'Unable to load notifications.');
      return data;
    }).then(data => {
      if (!active) return;
      setEvents(data.notifications);
      setWarning(data.warning || '');
      setHasMore(data.hasMore);
    }).catch(err => { if (active) setError(err.message); }).finally(() => { if (active) setLoading(false); });
    const outside = event => { if (!container.current?.contains(event.target)) setOpen(false); };
    const escape = event => { if (event.key === 'Escape') { setOpen(false); container.current?.querySelector('button')?.focus(); } };
    document.addEventListener('pointerdown', outside); document.addEventListener('keydown', escape);
    return () => { active = false; document.removeEventListener('pointerdown', outside); document.removeEventListener('keydown', escape); };
  }, [open, page, retry]);
  return <div className="notification-container" ref={container}>
    <button aria-label="Notifications" aria-expanded={open} aria-controls="notifications" onClick={() => { setPage(1); setOpen(value => !value); }}><Bell /></button>
    {open && <section id="notifications" className="notification-dropdown" aria-label="Recent notifications">
      <h2>Notifications</h2>
      <p className="notification-caption">Account joins and report submissions · newest first</p>
      {warning && <p className="notification-caption" role="status">{warning}</p>}
      {loading ? <p role="status">Loading…</p> : error ? <div><p role="alert">{error}</p><button onClick={() => setRetry(n => n + 1)}>Try again</button></div> : <>
        {!events.length && <p>No notifications yet.</p>}
        {events.map(event => <div className="notification-event" key={event.id}>
          {event.kind === 'account' ? <UserRound size={18} /> : <FileText size={18} />}
          <div><span>{event.name} {event.kind === 'account' ? 'joined WellBeingCheck' : 'submitted an assessment report'}</span><time dateTime={event.occurred_at}>{new Date(event.occurred_at).toLocaleString(undefined, { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit', second: '2-digit', timeZoneName: 'short' })}</time></div>
        </div>)}
        {(page > 1 || hasMore) && <div className="notification-pagination"><button disabled={page === 1} onClick={() => setPage(n => n - 1)}>Newer</button><span>Page {page}</span><button disabled={!hasMore} onClick={() => setPage(n => n + 1)}>Older</button></div>}
      </>}
      <Link to="/reports">View all reports</Link>
    </section>}
  </div>;
}
