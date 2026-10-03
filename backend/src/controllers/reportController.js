import { renderReportPdf } from '../utils/reportPdf.js';

export const isAdmin = user => user?.app_metadata?.role === 'admin';
export function reportQuery(req) {
  const database = isAdmin(req.user) ? req.reportSupabase || req.supabase : req.supabase;
  const query = database.from('reports').select('*');
  return isAdmin(req.user) ? query : query.eq('user_id', req.user.id);
}

export async function listReports(req, res) {
  const page = Math.max(1, Number.parseInt(req.query.page, 10) || 1);
  try {
    const { data, error } = await reportQuery(req).order('completed_at', { ascending: false }).order('id').range((page - 1) * 20, page * 20);
    if (error) throw error;
    res.set('Cache-Control', 'no-store');
    return res.json({ success: true, role: isAdmin(req.user) ? 'admin' : 'user', reports: data.slice(0, 20), hasMore: data.length > 20, page });
  } catch {
    return res.status(503).json({ success: false, message: 'Unable to load reports. Please try again or contact the administrator.' });
  }
}

export async function downloadReport(req, res) {
  const id = req.params.id;
  if (!/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id)) {
    return res.status(400).json({ success: false, message: 'Invalid assessment ID.' });
  }
  try {
    const { data, error } = await reportQuery(req).eq('assessment_id', id).maybeSingle();
    if (error) throw error;
    if (!data) return res.status(404).json({ success: false, message: 'Report not found.' });
    const pdf = await renderReportPdf(data);
    res.set({ 'Cache-Control': 'no-store', 'X-Content-Type-Options': 'nosniff', 'Content-Disposition': `attachment; filename="wellbeing-report-${id}.pdf"` });
    return res.type('application/pdf').send(pdf);
  } catch {
    return res.status(503).json({ success: false, message: 'Unable to download report. Please try again or contact the administrator.' });
  }
}
