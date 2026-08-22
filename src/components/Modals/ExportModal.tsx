import React, { useState } from 'react';
import { ResumeData, ThemeConfig, PaperSize } from '../../types/resume';
import { exportToPdf, triggerPrintDialog } from '../../utils/pdfExport';
import { exportToDocx } from '../../utils/docxExport';
import { PAGE_SIZE_LIST, getPageSizeConfig } from '../../data/pageSizeData';
import {
  X,
  Download,
  FileText,
  Printer,
  Copy,
  Check,
  Code2,
  Upload,
  FileDown,
  Loader2,
  Layers,
} from 'lucide-react';

interface ExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  resume: ResumeData;
  theme: ThemeConfig;
  onChangeTheme?: (theme: ThemeConfig) => void;
  onImportResume: (imported: ResumeData) => void;
}

export const ExportModal: React.FC<ExportModalProps> = ({
  isOpen,
  onClose,
  resume,
  theme,
  onChangeTheme,
  onImportResume,
}) => {
  const [isExportingPdf, setIsExportingPdf] = useState(false);
  const [isExportingDocx, setIsExportingDocx] = useState(false);
  const [singlePageFit, setSinglePageFit] = useState(true);
  const [copiedPlainText, setCopiedPlainText] = useState(false);
  const [copiedJson, setCopiedJson] = useState(false);

  if (!isOpen) return null;

  const activePaperSize: PaperSize = theme.paperSize || 'a4';
  const pageConfig = getPageSizeConfig(activePaperSize);
  const fileName = `${resume?.personalInfo?.fullName?.replace(/\s+/g, '_') || 'Resume'}_Resume`;

  const handleSelectPaperSize = (size: PaperSize) => {
    if (onChangeTheme) {
      onChangeTheme({
        ...theme,
        paperSize: size,
      });
    }
  };

  const handlePdfDownload = async () => {
    try {
      setIsExportingPdf(true);
      await exportToPdf('resume-printable-content', fileName, {
        singlePage: singlePageFit,
        paperSize: activePaperSize,
      });
      onClose();
    } catch (err) {
      console.error(err);
      triggerPrintDialog(activePaperSize);
    } finally {
      setIsExportingPdf(false);
    }
  };

  const handleDocxDownload = async () => {
    try {
      setIsExportingDocx(true);
      await exportToDocx(resume, theme);
      onClose();
    } catch (err) {
      console.error('Docx export failed:', err);
    } finally {
      setIsExportingDocx(false);
    }
  };

  const handlePrint = () => {
    triggerPrintDialog(activePaperSize);
    onClose();
  };

  const getPlainTextResume = (): string => {
    const p = resume?.personalInfo || {
      fullName: '',
      title: '',
      email: '',
      phone: '',
      location: '',
      website: '',
      linkedin: '',
      github: '',
    };
    let txt = `${p.fullName?.toUpperCase() || 'RESUME'}\n`;
    if (p.title) txt += `${p.title}\n`;
    txt += `${[p.email, p.phone, p.location, p.linkedin, p.github, p.website].filter(Boolean).join(' | ')}\n\n`;

    if (resume.summary) {
      txt += `PROFESSIONAL SUMMARY\n--------------------\n${resume.summary}\n\n`;
    }

    if (resume.experience?.length) {
      txt += `WORK EXPERIENCE\n---------------\n`;
      resume.experience.forEach((exp) => {
        txt += `${exp.role} - ${exp.company} (${exp.startDate} - ${exp.current ? 'Present' : exp.endDate})\n`;
        if (exp.location) txt += `Location: ${exp.location}\n`;
        exp.bullets?.forEach((b) => {
          if (b.trim()) txt += `• ${b}\n`;
        });
        txt += '\n';
      });
    }

    if (resume.skills?.length) {
      txt += `SKILLS\n------\n${resume.skills.map((s) => s.name).join(', ')}\n\n`;
    }

    if (resume.education?.length) {
      txt += `EDUCATION\n---------\n`;
      resume.education.forEach((edu) => {
        txt += `${edu.degree} in ${edu.field}, ${edu.school} (${edu.startDate} - ${edu.endDate})\n`;
      });
      txt += '\n';
    }

    if (resume.projects?.length) {
      txt += `PROJECTS\n--------\n`;
      resume.projects.forEach((proj) => {
        txt += `${proj.name} ${proj.link ? `(${proj.link})` : ''}\n`;
        proj.bullets?.forEach((b) => {
          if (b.trim()) txt += `• ${b}\n`;
        });
        txt += '\n';
      });
    }

    return txt;
  };

  const handleCopyPlainText = () => {
    navigator.clipboard.writeText(getPlainTextResume());
    setCopiedPlainText(true);
    setTimeout(() => setCopiedPlainText(false), 2000);
  };

  const handleDownloadJson = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(resume, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `${fileName}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const handleImportJsonFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const parsed = JSON.parse(event.target?.result as string);
        if (parsed.personalInfo) {
          onImportResume(parsed);
          onClose();
        }
      } catch (err) {
        alert('Invalid resume JSON file structure.');
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden border border-slate-200">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-slate-900 text-white flex items-center justify-center font-bold">
              <Download className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900">Export & Download Options</h2>
              <p className="text-xs text-slate-500">
                Generate high-resolution PDF, editable Word (.docx), or print format in your chosen paper standard.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-slate-400 hover:text-slate-700 rounded-lg transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-5">
          {/* Target Page Size Selector Bar */}
          <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5 text-xs font-bold text-slate-800 uppercase tracking-wider">
                <Layers className="w-3.5 h-3.5 text-blue-600" />
                <span>Export Paper Format</span>
              </div>
              <span className="text-[11px] font-bold text-blue-600 font-mono">
                {pageConfig.dimensionsMetric} ({pageConfig.dimensionsImperial})
              </span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {PAGE_SIZE_LIST.map((opt) => {
                const isSelected = opt.id === activePaperSize;
                return (
                  <button
                    key={opt.id}
                    id={`export-pagesize-${opt.id}`}
                    onClick={() => handleSelectPaperSize(opt.id)}
                    className={`py-2 px-2 rounded-lg text-center border transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-blue-600 text-white border-blue-600 shadow-xs ring-1 ring-blue-600/30'
                        : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    <div className="text-xs font-bold">{opt.shortLabel}</div>
                    <div className={`text-[10px] font-mono ${isSelected ? 'text-blue-100' : 'text-slate-500'}`}>
                      {opt.widthMm}×{opt.heightMm}mm
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* PDF Option */}
            <div className="p-4 rounded-2xl border-2 border-slate-200 hover:border-slate-800 transition-all flex flex-col justify-between space-y-3 bg-white shadow-2xs">
              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <div className="w-10 h-10 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center mb-2">
                    <FileDown className="w-5 h-5" />
                  </div>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-900 text-white tracking-wide uppercase">
                    {pageConfig.shortLabel} • {singlePageFit ? '1 PAGE FIT' : 'MULTI-PAGE'}
                  </span>
                </div>
                <h3 className="text-sm font-bold text-slate-900">Download PDF</h3>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Pixel-perfect high resolution PDF scaled cleanly to {pageConfig.name} ({pageConfig.dimensionsMetric}).
                </p>

                {/* Single Page Toggle */}
                <label className="flex items-center gap-2 pt-2 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={singlePageFit}
                    onChange={(e) => setSinglePageFit(e.target.checked)}
                    className="w-3.5 h-3.5 rounded text-blue-600 focus:ring-blue-500 border-slate-300"
                  />
                  <span className="text-xs font-semibold text-slate-700">
                    Fit proportionally on 1 page (Recommended)
                  </span>
                </label>
              </div>
              <button
                id="modal-pdf-download-btn"
                onClick={handlePdfDownload}
                disabled={isExportingPdf}
                className="w-full py-2.5 text-xs font-bold text-white bg-slate-900 hover:bg-slate-800 rounded-xl transition-colors flex items-center justify-center gap-1.5 cursor-pointer shadow-xs disabled:opacity-50"
              >
                {isExportingPdf ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Download className="w-3.5 h-3.5" />}
                <span>{isExportingPdf ? 'Rendering PDF...' : `Download .PDF (${pageConfig.shortLabel})`}</span>
              </button>
            </div>

            {/* DOCX Word Option */}
            <div className="p-4 rounded-2xl border-2 border-slate-200 hover:border-blue-600 transition-all flex flex-col justify-between space-y-3 bg-white shadow-2xs">
              <div className="space-y-1">
                <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center mb-2">
                  <FileText className="w-5 h-5" />
                </div>
                <h3 className="text-sm font-bold text-slate-900">Microsoft Word (.DOCX)</h3>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Native Word document formatted in {pageConfig.name} with styled headings, real bullet points, and ATS margins.
                </p>
              </div>
              <button
                id="modal-docx-download-btn"
                onClick={handleDocxDownload}
                disabled={isExportingDocx}
                className="w-full py-2.5 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-xl transition-colors flex items-center justify-center gap-1.5 cursor-pointer shadow-xs disabled:opacity-50"
              >
                {isExportingDocx ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Download className="w-3.5 h-3.5" />}
                <span>{isExportingDocx ? 'Generating Word...' : `Download .DOCX (${pageConfig.shortLabel})`}</span>
              </button>
            </div>

            {/* Print Dialog Option */}
            <div className="p-4 rounded-2xl border border-slate-200 bg-slate-50 flex flex-col justify-between space-y-3">
              <div className="space-y-1">
                <div className="w-10 h-10 rounded-xl bg-slate-200 text-slate-700 flex items-center justify-center mb-2">
                  <Printer className="w-5 h-5" />
                </div>
                <h3 className="text-sm font-bold text-slate-900">Vector Print / System Save</h3>
                <p className="text-xs text-slate-500 leading-relaxed">
                  High-fidelity browser print engine configured for {pageConfig.name}.
                </p>
              </div>
              <button
                id="modal-print-btn"
                onClick={handlePrint}
                className="w-full py-2.5 text-xs font-bold text-slate-700 bg-white hover:bg-slate-100 border border-slate-300 rounded-xl transition-colors flex items-center justify-center gap-1.5 cursor-pointer shadow-2xs"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Open Print Dialog ({pageConfig.shortLabel})</span>
              </button>
            </div>

            {/* Plain Text ATS Option */}
            <div className="p-4 rounded-2xl border border-slate-200 bg-slate-50 flex flex-col justify-between space-y-3">
              <div className="space-y-1">
                <div className="w-10 h-10 rounded-xl bg-slate-200 text-slate-700 flex items-center justify-center mb-2">
                  <Copy className="w-5 h-5" />
                </div>
                <h3 className="text-sm font-bold text-slate-900">Plain Text (ASCII ATS)</h3>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Copy clean, unformatted text for legacy job portals, Workday, or Taleo.
                </p>
              </div>
              <button
                id="modal-copy-plain-text-btn"
                onClick={handleCopyPlainText}
                className="w-full py-2.5 text-xs font-bold text-slate-700 bg-white hover:bg-slate-100 border border-slate-300 rounded-xl transition-colors flex items-center justify-center gap-1.5 cursor-pointer shadow-2xs"
              >
                {copiedPlainText ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedPlainText ? 'Copied to Clipboard!' : 'Copy Plain Text'}</span>
              </button>
            </div>
          </div>

          {/* Backup / Restore JSON */}
          <div className="pt-3 border-t border-slate-200 flex items-center justify-between flex-wrap gap-2 text-xs">
            <div className="flex items-center gap-1.5 text-slate-500">
              <Code2 className="w-4 h-4 text-slate-400" />
              <span>Developer & Backup Data (JSON)</span>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={handleDownloadJson}
                className="px-3 py-1.5 text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg font-medium transition-colors cursor-pointer"
              >
                Export JSON
              </button>
              <label className="px-3 py-1.5 text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-lg font-semibold transition-colors cursor-pointer flex items-center gap-1">
                <Upload className="w-3.5 h-3.5" />
                <span>Import JSON</span>
                <input
                  type="file"
                  accept=".json"
                  onChange={handleImportJsonFile}
                  className="hidden"
                />
              </label>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-slate-200 bg-slate-50 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-bold text-slate-700 hover:bg-slate-200 rounded-xl transition-colors cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
