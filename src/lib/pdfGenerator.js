// src/lib/pdfGenerator.js
import jsPDF from 'jspdf';

export async function generateReportPDF(reportData) {
  if (!reportData) throw new Error('No report data available to generate PDF');

  const doc = new jsPDF({
    orientation: 'p',
    unit: 'mm',
    format: 'a4',
  });

  const domain = reportData.domain || 'Website';
  let y = 20;

  // Header Banner - Rebranded to CheckYourWeb
  doc.setFillColor(15, 23, 42); // slate-900
  doc.rect(0, 0, 210, 36, 'F');

  doc.setTextColor(255, 255, 255);
  doc.setFontSize(15);
  doc.setFont('helvetica', 'bold');
  doc.text('CheckYourWeb - Executive 7-Perspective Audit', 14, 14);

  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(148, 163, 184);
  doc.text(`Target: https://${domain} | Date: ${new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}`, 14, 22);
  doc.text(`Identified Theme: "${reportData.stats?.derivedMainKeyword}" | Visibility: ${reportData.stats?.visibilityStatus}`, 14, 29);

  y = 44;

  // 3-Device Speed Benchmarks Card
  doc.setFillColor(248, 250, 252);
  doc.roundedRect(14, y, 182, 22, 2, 2, 'F');
  doc.setFontSize(8.5);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(15, 23, 42);
  doc.text(`Desktop Speed: ${reportData.stats?.desktopSeconds}s (${reportData.stats?.desktopScore}/100)`, 18, y + 7);
  doc.text(`Tablet Speed: ${reportData.stats?.tabletSeconds}s (${reportData.stats?.tabletScore}/100)`, 18, y + 14);
  doc.text(`Mobile Speed (4G): ${reportData.stats?.mobileSeconds}s (${reportData.stats?.mobileScore}/100)`, 105, y + 7);
  doc.text(`SEO Health Score: ${reportData.seoView?.score || 80}/100`, 105, y + 14);
  y += 28;

  // Executive Owner FAQs
  doc.setFillColor(30, 41, 59);
  doc.rect(14, y - 4, 182, 7, 'F');
  doc.setFontSize(9);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(255, 255, 255);
  doc.text('EXECUTIVE FAQ - PLAIN ENGLISH OWNER ANSWERS', 16, y + 1);
  y += 9;

  (reportData.ownerFaqs || []).slice(0, 3).forEach((faq) => {
    if (y > 260) { doc.addPage(); y = 20; }
    doc.setFontSize(8);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(15, 23, 42);
    const splitQ = doc.splitTextToSize(`Q: ${faq.q}`, 178);
    doc.text(splitQ, 16, y);
    y += (splitQ.length * 4) + 1;

    doc.setFont('helvetica', 'normal');
    doc.setTextColor(71, 85, 105);
    const splitA = doc.splitTextToSize(`Ans: ${faq.a}`, 178);
    doc.text(splitA, 16, y);
    y += (splitA.length * 3.8) + 3;
  });

  y += 4;

  const sections = [
    { title: '1. Google View (Search Engine Optimization Signals)', items: reportData.googleView?.checklist || [] },
    { title: '2. Visitor View (First 5-Second Experience & Clarity)', items: reportData.visitorView?.checklist || [] },
    { title: '3. AI Bot View (LLM Comprehension & Entity Mapping)', items: reportData.aiBotView?.checklist || [] },
    { title: `4. SEO View (Technical Foundation - Score: ${reportData.seoView?.score || 80}/100)`, items: reportData.seoView?.checklist || [] },
    { title: '5. AEO View (Answer Engine Optimization)', items: reportData.aeoView?.checklist || [] },
    { title: '6. Business View (Commercial Conversion & Trust)', items: reportData.businessView?.checklist || [] },
  ];

  sections.forEach((sec) => {
    if (y > 250) {
      doc.addPage();
      y = 20;
    }

    doc.setFillColor(241, 245, 249);
    doc.rect(14, y - 4, 182, 7, 'F');
    doc.setFontSize(9);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(30, 41, 59);
    doc.text(`${sec.title} (${sec.items.length} Tasks)`, 16, y + 1);
    y += 9;

    if (sec.items.length === 0) {
      doc.setFontSize(8);
      doc.setFont('helvetica', 'italic');
      doc.setTextColor(22, 101, 52);
      doc.text('  ✓ No critical bottlenecks detected for this perspective.', 16, y);
      y += 7;
    } else {
      sec.items.forEach((item, idx) => {
        if (y > 262) {
          doc.addPage();
          y = 20;
        }

        doc.setFontSize(8);
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(185, 28, 28);
        doc.text(`[${idx + 1}] [${item.team}] Task: ${item.keyword}`, 16, y);
        y += 4;

        doc.setFont('helvetica', 'normal');
        doc.setTextColor(30, 41, 59);
        const splitProblem = doc.splitTextToSize(`Issue: ${item.problem}`, 175);
        doc.text(splitProblem, 16, y);
        y += (splitProblem.length * 3.8) + 1;

        doc.setTextColor(30, 64, 175);
        const splitSolution = doc.splitTextToSize(`Fix: ${item.solution}`, 175);
        doc.text(splitSolution, 16, y);
        y += (splitSolution.length * 3.8) + 3;
      });
    }

    y += 3;
  });

  const cleanDomain = domain.replace(/[^a-zA-Z0-9]/g, '_');
  doc.save(`CheckYourWeb_${cleanDomain}_Audit.pdf`);
}