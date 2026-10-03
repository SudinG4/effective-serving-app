const API = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5001';
export async function profileRequest(body) {
  const response = await fetch(`${API}/api/auth/profile`, {
    method: body ? 'PATCH' : 'GET',
    headers: { Authorization: `Bearer ${localStorage.getItem('wbc-access-token') || ''}`, 'Content-Type': 'application/json' },
    ...(body ? { body: JSON.stringify(body) } : {}), cache: 'no-store'
  });
  const data = await response.json();
  if (!response.ok) throw new Error(data.message || 'Unable to load account. Please log in again.');
  return data.user;
}
