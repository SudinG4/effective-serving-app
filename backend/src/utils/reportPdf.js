import { PDFDocument } from 'pdfkit';

const maxima = { 'Emotional Health': 24, 'Stress & Anxiety': 24, 'Sleep & Energy': 20, 'Social Connection': 20, 'Daily Functioning': 20 };
const ink = '#173f3b';
const muted = '#526965';

export function renderReportPdf(report) {
  return new Promise((resolve, reject) => {
    const doc = new PDFDocument({ size: 'A4', margin: 48, bufferPages: true,
      info: { Title: 'Personal wellbeing report', Author: 'WellBeingCheck' } });
    const chunks = [];
    doc.on('data', chunk => chunks.push(chunk));
    doc.on('error', reject);
    doc.on('end', () => resolve(Buffer.concat(chunks)));
    const width = doc.page.width - 96;
    const paragraph = text => {
      doc.font('Helvetica').fontSize(10).fillColor(muted).text(String(text), 48, doc.y, { width, lineGap: 4 });
      doc.moveDown(.6);
    };
    const heading = text => {
      if (doc.y > 700) doc.addPage();
      doc.moveDown(.4).font('Helvetica-Bold').fontSize(15).fillColor(ink).text(text, 48, doc.y, { width });
      doc.moveDown(.5);
    };
    const date = value => {
      const parsed = new Date(value);
      return Number.isNaN(parsed.getTime()) ? 'Not provided' : `${parsed.toLocaleString('en-AU', { timeZone: 'UTC' })} UTC`;
    };
    const person = report.user_details || {};
    doc.font('Helvetica-Bold').fontSize(11).fillColor(ink).text('WELLBEINGCHECK');
    doc.moveDown().fontSize(25).text('Personal wellbeing report', { width });
    doc.moveDown(.4);
    paragraph(`Assessment completed: ${date(report.completed_at || report.created_at)}`);
    paragraph(`Report ${report.id} | Version ${report.version || 1}`);
    heading('User details');
    paragraph(`Name: ${[person.firstName, person.lastName].filter(Boolean).join(' ') || 'Not provided'}`);
    paragraph(`Email: ${person.email || 'Not provided'}`);
    paragraph(`Phone: ${person.phone || 'Not provided'}`);
    heading('Screening summary');
    doc.font('Helvetica-Bold').fontSize(28).fillColor(ink).text(`${report.total_score} / 108`, { width });
    doc.moveDown(.2);
    paragraph(`Screening category: ${report.risk_level}`);
    if (doc.y > 410) doc.addPage();
    heading('Score chart and breakdown');
    paragraph('Higher scores indicate more reported concerns. Percentages show points out of each domain maximum, not a probability of illness.');
    for (const [name, max] of Object.entries(maxima)) {
      if (doc.y > 700) doc.addPage();
      const score = Number(report.domain_scores?.[name]) || 0;
      const percent = Math.max(0, Math.min(100, score / max * 100));
      const y = doc.y;
      doc.font('Helvetica-Bold').fontSize(10).fillColor(ink).text(name, 48, y, { width: 270 });
      doc.font('Helvetica').text(`${score} / ${max} (${Math.round(percent)}%)`, 350, y, { width: width - 302, align: 'right' });
      doc.roundedRect(48, y + 19, width, 9, 4).fill('#e3ece7');
      if (percent > 0) doc.roundedRect(48, y + 19, width * percent / 100, 9, 4).fill('#28745b');
      doc.y = y + 43;
    }
    paragraph('Categories: 0-35 No Risk; 36-70 Borderline; 71-108 At Risk. These are app-defined screening categories, not clinical diagnoses. "No Risk" does not rule out a concern.');
    doc.addPage();
    doc.font('Helvetica-Bold').fontSize(11).fillColor(ink).text('WELLBEINGCHECK');
    heading('Feedback and next steps');
    paragraph(report.total_score <= 35
      ? 'Your responses fall in the lower range of this screening. Continue checking in with yourself and maintaining habits that support your wellbeing.'
      : report.total_score <= 70
        ? 'Your responses suggest some areas may need attention. Consider discussing your concerns with someone you trust or a qualified health professional.'
        : 'Your responses suggest additional support may be helpful. Consider contacting a qualified health professional soon.');
    paragraph('Reflect on the domains with the highest percentage scores and how they affect your day.');
    paragraph('Consider sharing this report with a GP or qualified mental health professional, especially if concerns persist or affect daily life.');
    paragraph('Reach out to someone you trust for support. Seek help whenever you need it, regardless of your score.');
    heading('Help and contact information');
    paragraph('Australia: If life is in immediate danger, call 000. Outside Australia, contact your local emergency service.');
    paragraph('Lifeline crisis support: 13 11 14\nhttps://www.lifeline.org.au/get-help/national-services/lifeline-crisis-support');
    paragraph('Beyond Blue support: 1300 22 4636\nhttps://www.beyondblue.org.au/get-support');
    paragraph('These contacts serve Australia. If you live elsewhere, use a local health provider or crisis support service.');
    heading('About this report');
    paragraph('Private health information. Share only with people you choose. This report reflects self-reported assessment responses and is not a medical diagnosis. Profile details are captured when the report is created.');
    paragraph(`Generated: ${date(report.generated_at || report.created_at)}`);
    const pages = doc.bufferedPageRange();
    for (let i = 0; i < pages.count; i++) {
      doc.switchToPage(i);
      doc.page.margins.bottom = 0;
      doc.font('Helvetica').fontSize(8).fillColor(muted).text(`Private | WellBeingCheck | Page ${i + 1} of ${pages.count}`, 48, doc.page.height - 30, { width, align: 'center', lineBreak: false });
    }
    doc.end();
  });
}
