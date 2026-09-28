const API = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5001';

export async function reportRequest(path) {
  const response = await fetch(`${API}/api/reports${path}`, {
    headers: { Authorization: `Bearer ${localStorage.getItem('wbc-access-token') || ''}` },
    cache: 'no-store'
  });
  if (response.status === 401) {
    localStorage.removeItem('wbc-user');
    localStorage.removeItem('wbc-access-token');
    window.location.assign('/login');
    throw new Error('Your session expired. Please log in again.');
  }
  if (!response.ok) {
    const data = await response.json().catch(() => ({}));
    throw new Error(data.message || 'Unable to load report. Please try again.');
  }
  return response;
}

export async function downloadStoredReport(assessmentId) {
  const response = await reportRequest(`/${encodeURIComponent(assessmentId)}/download`);
  const blob = await response.blob();
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `wellbeing-report-${assessmentId}.html`;
  document.body.appendChild(link);
  link.click();
  link.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
