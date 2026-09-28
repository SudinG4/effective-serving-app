import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Logo } from '../components';
import { downloadStoredReport, reportRequest } from '../reportApi';

export default function Reports() {
  const [page, setPage] = useState(1);
  const [data, setData] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [downloading, setDownloading] = useState(null);
  const [retry, setRetry] = useState(0);
  useEffect(() => {
    let active = true;
    setLoading(true);
    setError('');
    reportRequest(`?page=${page}`).then(r => r.json()).then(result => {
      if (active) setData(result);
    }).catch(err => { if (active) setError(err.message); })
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, [page, retry]);
  async function download(id) {
    setDownloading(id);
    setError('');
    try { await downloadStoredReport(id); }
    catch (err) { setError(err.message); }
    finally { setDownloading(null); }
  }
  return <>
    <header className="results-header"><div className="shell nav"><Logo /><Link className="button secondary small" to="/dashboard">Dashboard</Link></div></header>
    <main className="results shell">
      <h1>{data?.role === 'admin' ? 'All assessment reports' : 'My assessment reports'}</h1>
      <p>{data?.role === 'admin' ? 'Administrator access: review and download reports for all users.' : 'Your saved assessment reports, available whenever you need them.'}</p>
      <p>Download a report to view its chart, feedback and support contacts. Open the downloaded file and choose Print → Save as PDF for a PDF copy.</p>
      {error && <div role="alert"><p className="form-error">{error}</p><button className="button secondary" onClick={() => setRetry(n => n + 1)}>Try again</button></div>}
      {loading ? <p role="status">Loading reports…</p> : data && <>
        {!data.reports.length && <p>No reports yet. <Link to="/quiz">Take an assessment</Link> to create your first report.</p>}
        <div className="report-list">{data.reports.map(report => <article className="report-card" key={report.id}>
          <div><h2>{new Date(report.completed_at).toLocaleDateString('en-AU')}</h2>
            <p>{report.user_details.firstName} {report.user_details.lastName}</p>
            {data.role === 'admin' && <p>{report.user_details.email}</p>}
            <p><strong>{report.total_score} / 108</strong> · {report.risk_level}</p>
          </div>
          <button className="button" disabled={!!downloading} onClick={() => download(report.assessment_id)}>{downloading === report.assessment_id ? 'Downloading…' : 'Download report'}</button>
        </article>)}</div>
        <div className="results-actions"><button className="button secondary" disabled={page === 1} onClick={() => setPage(n => n - 1)}>Previous</button><span>Page {page}</span><button className="button secondary" disabled={!data.hasMore} onClick={() => setPage(n => n + 1)}>Next</button></div>
      </>}
    </main>
  </>;
}
