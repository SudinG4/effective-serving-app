import { PDFDocument } from 'pdfkit';

const maxima = { 'Emotional Health': 24, 'Stress & Anxiety': 24, 'Sleep & Energy': 20, 'Social Connection': 20, 'Daily Functioning': 20 };
const palette = { ink: '#173f3b', muted: '#61736d', mint: '#eaf4ee', line: '#dce7e0', gold: '#eac98b', paper: '#fafbf8' };

export function renderReportPdf(report) {
  return new Promise((resolve, reject) => {
    const doc = new PDFDocument({ size: 'A4', margin: 44, bufferPages: true,
      info: { Title: 'Personal wellbeing report', Author: 'WellBeingCheck' } });
    const chunks = [];
    doc.on('data', chunk => chunks.push(chunk));
    doc.on('error', reject);
    doc.on('end', () => resolve(Buffer.concat(chunks)));
    const width = doc.page.width - 88;
    const text = (value, x, y, size = 10, color = palette.ink, options = {}) => {
      doc.font(options.bold ? 'Helvetica-Bold' : 'Helvetica').fontSize(size).fillColor(color)
        .text(String(value), x, y, { width, lineGap: 3, ...options });
    };
    const measure = (value, size, availableWidth, bold = false) => doc.font(bold ? 'Helvetica-Bold' : 'Helvetica').fontSize(size).heightOfString(String(value), { width: availableWidth, lineGap: 3 });
    const card = (y, height, fill = palette.mint) => doc.roundedRect(44, y, width, height, 12).fill(fill);
    const date = value => {
      const parsed = new Date(value);
      return Number.isNaN(parsed.getTime()) ? 'Not provided' : `${parsed.toLocaleString('en-AU', { timeZone: 'UTC', day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })} UTC`;
    };
    const hero = (title, subtitle) => {
      doc.rect(0, 0, doc.page.width, 165).fill(palette.ink);
      doc.save().rect(0, 0, doc.page.width, 165).clip();
      doc.circle(doc.page.width - 28, 116, 89).lineWidth(1).stroke('#35615a');
      doc.circle(doc.page.width - 28, 116, 63).lineWidth(1).stroke('#35615a').restore();
      text('WELLBEINGCHECK', 44, 28, 10, palette.gold, { bold: true, characterSpacing: 1.5 });
      text('PRIVATE REPORT', doc.page.width - 177, 28, 8, '#d8e8de', { width: 133, align: 'right', characterSpacing: 1 });
      text(title, 44, 60, 29, '#ffffff', { bold: true, width: width - 65, lineGap: 1 });
      text(subtitle, 44, 137, 8.5, '#d8e8de');
    };
    const ensure = (y, height) => {
      if (y + height <= 760) return y;
      doc.addPage();
      text('WELLBEINGCHECK / REPORT', 44, 30, 9, palette.ink, { bold: true, characterSpacing: 1 });
      return 65;
    };
    const heading = (title, y, caption) => {
      y = ensure(y, 55);
      text(title, 44, y, 16, palette.ink, { bold: true });
      if (caption) text(caption, 44, y + 26, 9, palette.muted);
      return y + (caption ? 55 : 34);
    };
    const person = report.user_details || {};
    const name = [person.firstName, person.lastName].filter(Boolean).join(' ') || 'Not provided';
    const email = person.email || 'Not provided';
    const phone = person.phone || 'Not provided';
    const nameHeight = measure(name, 18, width - 40, true);
    const contactHeight = Math.max(measure(email, 10, width - 190), measure(phone, 10, 125));
    hero('Personal wellbeing\nreport', `COMPLETED ${date(report.completed_at || report.created_at)}`);
    let y = 186;
    const detailsHeight = 74 + nameHeight + contactHeight;
    y = ensure(y, detailsHeight);
    card(y, detailsHeight, palette.paper);
    text('PREPARED FOR', 64, y + 16, 8, palette.muted, { bold: true, characterSpacing: 1 });
    text(name, 64, y + 32, 18, palette.ink, { bold: true, width: width - 40 });
    const contactY = y + 45 + nameHeight;
    text('EMAIL', 64, contactY, 7.5, palette.muted, { bold: true, width: width - 190 });
    text(email, 64, contactY + 15, 10, palette.ink, { width: width - 190 });
    text('PHONE', 44 + width - 145, contactY, 7.5, palette.muted, { bold: true, width: 125 });
    text(phone, 44 + width - 145, contactY + 15, 10, palette.ink, { width: 125 });
    y += detailsHeight + 16;
    y = ensure(y, 108);
    const risk = report.total_score <= 35 ? { color: '#28745b', tint: '#eaf4ee' } : report.total_score <= 70 ? { color: '#966221', tint: '#fbf0dc' } : { color: '#aa4d3c', tint: '#faeae4' };
    card(y, 108, risk.tint);
    text('YOUR SCREENING SCORE', 64, y + 17, 8, palette.muted, { bold: true, characterSpacing: .8 });
    text(report.total_score, 64, y + 37, 39, palette.ink, { bold: true, width: 100 });
    text('/ 108', 139, y + 57, 13, palette.muted, { width: 65 });
    text('SCREENING CATEGORY', 256, y + 23, 8, palette.muted, { bold: true, width: width - 230 });
    text(report.risk_level, 256, y + 43, 21, risk.color, { bold: true, width: width - 230 });
    text('A starting point for reflection and support.', 256, y + 76, 8.5, palette.muted, { width: width - 230 });
    y += 132;
    y = heading('Your wellbeing across five domains', y, 'Points out of each domain maximum. Higher scores indicate more reported concerns.');
    for (const [index, [domain, max]] of Object.entries(maxima).entries()) {
      y = ensure(y, 43);
      const score = Number(report.domain_scores?.[domain]) || 0;
      const percent = Math.max(0, Math.min(100, score / max * 100));
      text(domain, 44, y, 10, palette.ink, { bold: true, width: 270 });
      text(`${score} / ${max}   |   ${Math.round(percent)}%`, 350, y, 9, palette.muted, { width: width - 306, align: 'right' });
      doc.roundedRect(44, y + 20, width, 7, 3).fill(palette.line);
      if (percent > 0) doc.roundedRect(44, y + 20, Math.max(7, width * percent / 100), 7, 3).fill(index % 2 ? '#558f79' : '#28745b');
      y += 41;
    }
    y = ensure(y + 2, 40);
    text('0-35 No Risk  /  36-70 Borderline  /  71-108 At Risk', 44, y, 8, palette.muted, { bold: true });
    text('App-defined screening categories, not clinical diagnoses. Percentages are not a probability of illness. "No Risk" does not rule out a concern.', 44, y + 18, 8, palette.muted);

    doc.addPage();
    hero('Understanding\nyour results', 'REFLECTION, NEXT STEPS & CONTACTS');
    const feedback = report.total_score <= 35
      ? 'Your responses fall in the lower range of this screening. Continue checking in with yourself and maintaining habits that support your wellbeing.'
      : report.total_score <= 70
        ? 'Your responses suggest some areas may need attention. Consider discussing your concerns with someone you trust or a qualified health professional.'
        : 'Your responses suggest additional support may be helpful. Consider contacting a qualified health professional soon.';
    y = heading('What your score suggests', 186);
    const feedbackHeight = measure(feedback, 10, width - 40) + 32;
    card(y, feedbackHeight);
    text(feedback, 64, y + 16, 10, palette.ink, { width: width - 40 });
    y += feedbackHeight + 21;
    const steps = [
      ['Reflect on your patterns', 'Notice the domains with the highest percentage scores and how they affect your day.'],
      ['Talk with someone', 'Consider sharing this report with a GP or qualified mental health professional, especially if concerns persist or affect daily life.'],
      ['Stay connected', 'Reach out to someone you trust. Seek help whenever you need it, regardless of your score.']
    ];
    for (const [index, [title, description]] of steps.entries()) {
      const stepHeight = measure(description, 9, width - 46) + 27;
      y = ensure(y, stepHeight);
      doc.circle(57, y + 12, 12).fill(palette.mint);
      text(index + 1, 45, y + 7, 9, palette.ink, { bold: true, width: 24, align: 'center' });
      text(title, 88, y, 10, palette.ink, { bold: true, width: width - 46 });
      text(description, 88, y + 18, 9, palette.muted, { width: width - 46 });
      y += stepHeight;
    }
    y = heading('Contacts & support', y + 9);
    y = ensure(y, 103);
    card(y, 103, palette.ink);
    text('CIHE Australia | Pacific Highway', 64, y + 16, 12, '#ffffff', { bold: true, width: width - 40 });
    text('116 Pacific Hwy, North Sydney NSW 2060', 64, y + 40, 10, '#d8e8de', { width: width - 40 });
    text('sudingiri4@gmail.com', 64, y + 64, 10, palette.gold, { width: width - 40, link: 'mailto:sudingiri4@gmail.com', underline: true });
    y += 119;
    y = ensure(y, 103);
    text('Emergency & crisis support', 44, y, 10, palette.ink, { bold: true });
    text('Immediate danger in Australia: 000. Elsewhere, call your local emergency service.', 44, y + 20, 9, palette.muted);
    text('Lifeline: 13 11 14', 44, y + 45, 9, palette.ink, { link: 'https://www.lifeline.org.au/get-help/national-services/lifeline-crisis-support', underline: true });
    text('Beyond Blue: 1300 22 4636', 44, y + 63, 9, palette.ink, { link: 'https://www.beyondblue.org.au/get-support', underline: true });
    text('These contacts serve Australia. Elsewhere, use a local health provider or crisis service.', 44, y + 82, 8, palette.muted);
    y = ensure(y + 113, 45);
    text('This report reflects self-reported responses and is not a medical diagnosis. Profile details are captured when the report is created. Share only with people you choose.', 44, y, 8, palette.muted);
    text(`Generated ${date(report.generated_at || report.created_at)}`, 44, y + 33, 7.5, palette.muted);

    const pages = doc.bufferedPageRange();
    for (let i = 0; i < pages.count; i++) {
      doc.switchToPage(i);
      doc.page.margins.bottom = 0;
      const footerY = doc.page.height - 40;
      doc.moveTo(44, footerY - 9).lineTo(44 + width, footerY - 9).lineWidth(.5).stroke(palette.line);
      text(`PRIVATE  /  Report ${report.id}  /  v${report.version || 1}`, 44, footerY, 7, palette.muted, { width: width - 80, lineBreak: false });
      text(`${i + 1} / ${pages.count}`, 44 + width - 60, footerY, 8, palette.muted, { width: 60, align: 'right', lineBreak: false });
    }
    doc.end();
  });
}
