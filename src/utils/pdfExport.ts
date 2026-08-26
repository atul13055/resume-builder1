import jsPDF from 'jspdf';
import { toPng } from 'html-to-image';
import { PaperSize } from '../types/resume';
import { getPageSizeConfig, applyPrintPageSize } from '../data/pageSizeData';

export interface PdfExportOptions {
  singlePage?: boolean; // Default true: scales and fits the entire resume onto a single page
  paperSize?: PaperSize;
}

export async function exportToPdf(
  resumeElementId: string,
  filename: string,
  options?: PdfExportOptions
): Promise<void> {
  const element = document.getElementById(resumeElementId);
  if (!element) {
    throw new Error('Resume element not found for PDF export.');
  }

  const singlePage = options?.singlePage ?? true;
  const paperSize = options?.paperSize || 'a4';
  const pageConfig = getPageSizeConfig(paperSize);

  // Render DOM element to high-res PNG without oklch color parsing errors
  const imgData = await toPng(element, {
    quality: 0.98,
    pixelRatio: 2,
    backgroundColor: '#ffffff',
    cacheBust: true,
  });

  const img = new Image();
  img.src = imgData;
  await new Promise((resolve, reject) => {
    img.onload = () => resolve(true);
    img.onerror = (e) => reject(e);
  });

  // Initialize jsPDF with exact paper format (preset name or [widthMm, heightMm])
  const doc = new jsPDF({
    orientation: 'p',
    unit: 'mm',
    format: pageConfig.jsPdfFormat,
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();

  if (singlePage) {
    // Fill 100% page width to eliminate left/right white space margins
    const renderWidth = pageWidth;
    const calcHeight = (img.naturalHeight * pageWidth) / img.naturalWidth;
    // Scale smoothly if height exceeds page height, keeping full width alignment
    const finalHeight = calcHeight > pageHeight ? pageHeight : calcHeight;

    doc.addImage(imgData, 'PNG', 0, 0, renderWidth, finalHeight, undefined, 'FAST');
  } else {
    // Multi-page document slicing
    const imgWidth = pageWidth;
    const imgHeight = (img.naturalHeight * pageWidth) / img.naturalWidth;
    let heightLeft = imgHeight;
    let position = 0;

    // First page
    doc.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight, undefined, 'FAST');
    heightLeft -= pageHeight;

    // Subsequent pages
    while (heightLeft > 2) {
      position = heightLeft - imgHeight;
      doc.addPage();
      doc.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight, undefined, 'FAST');
      heightLeft -= pageHeight;
    }
  }

  doc.save(`${filename || 'Resume'}.pdf`);
}

export function triggerPrintDialog(paperSize: PaperSize = 'a4'): void {
  applyPrintPageSize(paperSize);
  window.print();
}

export function exportToPlainText(resume: any): void {
  const p = resume.personalInfo || {};
  let txt = `${p.fullName || 'RESUME'}\n`;
  if (p.title) txt += `${p.title}\n`;
  txt += `${[p.email, p.phone, p.location, p.linkedin, p.website].filter(Boolean).join(' | ')}\n\n`;

  if (resume.summary) {
    txt += `--- PROFESSIONAL SUMMARY ---\n${resume.summary}\n\n`;
  }

  if (resume.experience?.length) {
    txt += `--- WORK EXPERIENCE ---\n`;
    resume.experience.forEach((exp: any) => {
      txt += `${exp.role} | ${exp.company} (${exp.startDate} - ${exp.current ? 'Present' : exp.endDate})\n`;
      (exp.bullets || []).forEach((b: string) => {
        if (b.trim()) txt += `• ${b}\n`;
      });
      txt += `\n`;
    });
  }

  if (resume.skills?.length) {
    txt += `--- SKILLS ---\n`;
    txt += resume.skills.map((s: any) => s.name).join(', ') + '\n\n';
  }

  if (resume.education?.length) {
    txt += `--- EDUCATION ---\n`;
    resume.education.forEach((edu: any) => {
      txt += `${edu.degree} in ${edu.field} - ${edu.school} (${edu.startDate} - ${edu.endDate})\n`;
      (edu.bullets || []).forEach((b: string) => {
        if (b.trim()) txt += `• ${b}\n`;
      });
      txt += `\n`;
    });
  }

  const blob = new Blob([txt], { type: 'text/plain;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${(p.fullName || 'Resume').replace(/\s+/g, '_')}_Resume.txt`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
