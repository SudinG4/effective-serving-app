import test from 'node:test';
import assert from 'node:assert/strict';
import { listReports, downloadReport, isAdmin } from './reportController.js';
import { renderReport } from '../utils/reportRenderer.js';

const id = '00000000-0000-4000-8000-000000000001';
const report = { id, assessment_id: id, user_id: 'owner', version: 1, total_score: 54, risk_level: 'Borderline',
  completed_at: '2026-09-28T10:00:00Z', generated_at: '2026-09-28T10:00:01Z',
  user_details: { firstName: 'Sample', lastName: 'User', email: 'sample@example.com', phone: 'Not provided' },
  domain_scores: { 'Emotional Health': 12, 'Stress & Anxiety': 12, 'Sleep & Energy': 10, 'Social Connection': 10, 'Daily Functioning': 10 } };
function response() {
  return { code: 200, headers: {}, status(code) { this.code = code; return this; }, json(data) { this.body = data; return this; },
    set(key, value) { Object.assign(this.headers, typeof key === 'object' ? key : { [key]: value }); return this; },
    type(value) { this.contentType = value; return this; }, send(data) { this.body = data; return this; } };
}
function request(user, rows = [report]) {
  const filters = [];
  const query = { select() { return this; }, eq(key, value) { filters.push([key, value]); return this; }, order() { return this; },
    async range(start, end) { return { data: rows.filter(row => filters.every(([k,v]) => row[k] === v)).slice(start, end + 1) }; },
    async maybeSingle() { return { data: rows.find(row => filters.every(([k,v]) => row[k] === v)) || null }; } };
  return { user, params: { id }, query: {}, supabase: { from(name) { assert.equal(name, 'reports'); return query; } } };
}
test('ordinary users only list their own reports; user metadata cannot grant admin', async () => {
  for (const user of [{ id: 'other' }, { id: 'other', user_metadata: { role: 'admin' } }]) {
    const res = response();
    await listReports(request(user), res);
    assert.deepEqual(res.body.reports, []);
    assert.equal(res.body.role, 'user');
    assert.equal(isAdmin(user), false);
  }
});
test('owner can download; another user receives 404', async () => {
  for (const [userId, code] of [['owner', 200], ['other', 404]]) {
    const res = response(); await downloadReport(request({ id: userId }), res);
    assert.equal(res.code, code);
    if (code === 200) { assert.match(res.body, /Score chart and breakdown/); assert.equal(res.headers['Cache-Control'], 'no-store'); }
  }
});
test('protected admin role can list and download all reports', async () => {
  const user = { id: 'admin', app_metadata: { role: 'admin' } };
  const res = response(); await listReports(request(user), res);
  assert.equal(res.body.role, 'admin'); assert.equal(res.body.reports.length, 1);
  const download = response(); await downloadReport(request(user), download);
  assert.equal(download.code, 200);
});
test('pagination exposes at most 20 reports with next-page indication', async () => {
  const res = response(); await listReports(request({ id: 'owner' }, Array(21).fill(report)), res);
  assert.equal(res.body.reports.length, 20); assert.equal(res.body.hasMore, true);
});
test('malformed IDs are rejected before database access', async () => {
  const req = request({ id: 'owner' }); req.params.id = '../secret';
  const res = response(); await downloadReport(req, res); assert.equal(res.code, 400);
});
test('database failures do not disclose database information', async () => {
  const req = request({ id: 'owner' }); req.supabase.from = () => { throw new Error('private database details'); };
  const res = response(); await listReports(req, res); assert.equal(res.code, 503); assert.doesNotMatch(JSON.stringify(res.body), /private database/);
});
test('report includes details, scores, chart, feedback and support with escaped user input', () => {
  const html = renderReport({ ...report, user_details: { ...report.user_details, firstName: '<script>alert(1)</script>' } });
  assert.doesNotMatch(html, /<script>/);
  for (const text of ['&lt;script&gt;', '54 / 108', '12 / 24', '50%', 'Feedback and next steps', '13 11 14', '1300 22 4636', 'sample@example.com', '@media print']) assert.ok(html.includes(text), text);
});

export { report as sampleReport };
