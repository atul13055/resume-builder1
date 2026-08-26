import React, { useState } from 'react';
import { ResumeData, ThemeConfig, PaperSize } from '../../types/resume';
import { ModernTemplate } from './templates/ModernTemplate';
import { MinimalTemplate } from './templates/MinimalTemplate';
import { CreativeTemplate } from './templates/CreativeTemplate';
import { AcademicTemplate } from './templates/AcademicTemplate';
import { CompactTemplate } from './templates/CompactTemplate';
import { ExecutiveTemplate } from './templates/ExecutiveTemplate';
import { TechTemplate } from './templates/TechTemplate';
import { ElegantTemplate } from './templates/ElegantTemplate';
import { NordicTemplate } from './templates/NordicTemplate';
import { SplitTemplate } from './templates/SplitTemplate';
import { InfographicTemplate } from './templates/InfographicTemplate';
import {
  ZoomIn,
  ZoomOut,
  RotateCcw,
  FileText,
  Printer,
  Download,
  Sparkles,
  CheckCircle2,
  Maximize2,
  ChevronDown,
  Layers,
  Type,
} from 'lucide-react';
import { exportToPdf, triggerPrintDialog } from '../../utils/pdfExport';
import { exportToDocx } from '../../utils/docxExport';
import { PAGE_SIZE_OPTIONS, PAGE_SIZE_LIST, getPageSizeConfig } from '../../data/pageSizeData';

interface ResumePreviewProps {
  resume: ResumeData;
  theme: ThemeConfig;
  atsScore: number;
  onOpenAtsModal: () => void;
  onOpenTailorModal: () => void;
  onChangeTheme?: (theme: ThemeConfig) => void;
}

export const ResumePreview: React.FC<ResumePreviewProps> = ({
  resume,
  theme,
  atsScore,
  onOpenAtsModal,
  onOpenTailorModal,
  onChangeTheme,
}) => {
  const [zoom, setZoom] = useState<number>(0.92);
  const [isExportingPdf, setIsExportingPdf] = useState(false);
  const [isExportingDocx, setIsExportingDocx] = useState(false);
  const [showPageSizeDropdown, setShowPageSizeDropdown] = useState(false);
  const [showFontDropdown, setShowFontDropdown] = useState(false);
  const [showFontSizeDropdown, setShowFontSizeDropdown] = useState(false);

  const activePaperSize: PaperSize = theme.paperSize || 'a4';
  const pageConfig = getPageSizeConfig(activePaperSize);

  const handleZoomIn = () => setZoom((prev) => Math.min(1.4, prev + 0.1));
  const handleZoomOut = () => setZoom((prev) => Math.max(0.5, prev - 0.1));
  const handleResetZoom = () => setZoom(0.92);

  const handleSelectPaperSize = (size: PaperSize) => {
    if (onChangeTheme) {
      onChangeTheme({
        ...theme,
        paperSize: size,
      });
    }
    setShowPageSizeDropdown(false);
  };

  const handlePdfDownload = async () => {
    try {
      setIsExportingPdf(true);
      await exportToPdf(
        'resume-printable-content',
        `${resume?.personalInfo?.fullName || 'Resume'}_Resume`,
        {
          singlePage: true,
          paperSize: activePaperSize,
        }
      );
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
    } catch (err) {
      console.error('Docx export failed:', err);
    } finally {
      setIsExportingDocx(false);
    }
  };

  const renderTemplate = () => {
    switch (theme.template) {
      case 'minimal':
        return <MinimalTemplate resume={resume} theme={theme} />;
      case 'creative':
        return <CreativeTemplate resume={resume} theme={theme} />;
      case 'academic':
        return <AcademicTemplate resume={resume} theme={theme} />;
      case 'compact':
        return <CompactTemplate resume={resume} theme={theme} />;
      case 'executive':
        return <ExecutiveTemplate resume={resume} theme={theme} />;
      case 'tech':
        return <TechTemplate resume={resume} theme={theme} />;
      case 'elegant':
        return <ElegantTemplate resume={resume} theme={theme} />;
      case 'nordic':
        return <NordicTemplate resume={resume} theme={theme} />;
      case 'split':
        return <SplitTemplate resume={resume} theme={theme} />;
      case 'infographic':
        return <InfographicTemplate resume={resume} theme={theme} />;
      case 'modern':
      default:
        return <ModernTemplate resume={resume} theme={theme} />;
    }
  };

  // Score color badge
  const getScoreBadgeColor = () => {
    if (atsScore >= 85) return 'bg-emerald-50 text-emerald-700 border-emerald-300';
    if (atsScore >= 70) return 'bg-blue-50 text-blue-700 border-blue-300';
    if (atsScore >= 50) return 'bg-amber-50 text-amber-700 border-amber-300';
    return 'bg-rose-50 text-rose-700 border-rose-300';
  };

  return (
    <div className="flex flex-col h-full bg-slate-100/80 border-l border-slate-200 select-none">
      {/* Preview Toolbar */}
      <div className="bg-white px-3 py-2 border-b border-slate-200 flex items-center justify-between gap-2 flex-wrap z-10">
        {/* Left: ATS Pill & Tailor Trigger & Page Size Selector */}
        <div className="flex items-center gap-2 flex-wrap">
          <button
            id="ats-score-pill-btn"
            onClick={onOpenAtsModal}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold border transition-all hover:shadow-xs cursor-pointer ${getScoreBadgeColor()}`}
            title="Click to view full ATS breakdown"
          >
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>ATS: {atsScore}/100</span>
          </button>

          <button
            id="ai-tailor-quick-btn"
            onClick={onOpenTailorModal}
            className="flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-indigo-50 text-indigo-700 border border-indigo-200 hover:bg-indigo-100 transition-colors cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
            <span>AI Tailor</span>
          </button>

          {/* Dedicated Page Size Selector Dropdown & Quick Badges */}
          <div className="relative">
            <button
              id="preview-page-size-selector-btn"
              onClick={() => {
                setShowPageSizeDropdown(!showPageSizeDropdown);
                setShowFontDropdown(false);
                setShowFontSizeDropdown(false);
              }}
              className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-bold bg-slate-50 hover:bg-slate-100 text-slate-800 border border-slate-300 hover:border-slate-400 transition-all cursor-pointer shadow-2xs"
              title="Change Resume Page Size (A4, Letter, Legal, Executive)"
            >
              <Layers className="w-3.5 h-3.5 text-blue-600" />
              <span className="font-semibold text-slate-500">Page:</span>
              <span className="text-blue-700 font-extrabold">{pageConfig.shortLabel}</span>
              <span className="text-[10px] text-slate-400 font-mono hidden sm:inline">
                ({pageConfig.dimensionsMetric})
              </span>
              <ChevronDown className="w-3 h-3 text-slate-400 ml-0.5" />
            </button>

            {showPageSizeDropdown && (
              <div className="absolute top-full left-0 mt-1.5 w-72 bg-white rounded-xl shadow-2xl border border-slate-200 py-1.5 z-50 text-xs animate-in fade-in-50 zoom-in-95 duration-150">
                <div className="px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-slate-400 border-b border-slate-100 flex items-center justify-between">
                  <span>Select Resume Paper Format</span>
                  <span className="text-[9px] text-blue-600 font-semibold">Live & Export Ready</span>
                </div>
                <div className="p-1 space-y-1">
                  {PAGE_SIZE_LIST.map((opt) => {
                    const isSelected = opt.id === activePaperSize;
                    return (
                      <button
                        key={opt.id}
                        id={`page-size-opt-${opt.id}`}
                        onClick={() => handleSelectPaperSize(opt.id)}
                        className={`w-full p-2 rounded-lg text-left transition-all flex items-start justify-between cursor-pointer ${
                          isSelected
                            ? 'bg-blue-50 border border-blue-200 text-blue-900'
                            : 'hover:bg-slate-50 text-slate-700 border border-transparent'
                        }`}
                      >
                        <div>
                          <div className="flex items-center gap-1.5">
                            <span className="font-bold text-xs">{opt.name}</span>
                            {isSelected && (
                              <span className="px-1.5 py-0.2 rounded text-[9px] font-bold bg-blue-600 text-white">
                                Active
                              </span>
                            )}
                          </div>
                          <div className="text-[11px] text-slate-500 font-mono mt-0.5">
                            {opt.dimensionsMetric} • {opt.dimensionsImperial}
                          </div>
                          <div className="text-[10px] text-slate-400 mt-0.5">{opt.description}</div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* Quick Font Family Dropdown */}
          <div className="relative">
            <button
              id="preview-font-family-btn"
              onClick={() => {
                setShowFontDropdown(!showFontDropdown);
                setShowPageSizeDropdown(false);
                setShowFontSizeDropdown(false);
              }}
              className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-bold bg-slate-50 hover:bg-slate-100 text-slate-800 border border-slate-300 hover:border-slate-400 transition-all cursor-pointer shadow-2xs"
              title="Change Resume Font Style (Sans, Serif, Monospace)"
            >
              <Type className="w-3.5 h-3.5 text-purple-600" />
              <span className="font-semibold text-slate-500">Font:</span>
              <span className="text-purple-700 font-extrabold capitalize">{theme.fontPairing || 'sans'}</span>
              <ChevronDown className="w-3 h-3 text-slate-400 ml-0.5" />
            </button>

            {showFontDropdown && (
              <div className="absolute top-full left-0 mt-1.5 w-52 bg-white rounded-xl shadow-2xl border border-slate-200 py-1.5 z-50 text-xs animate-in fade-in-50 zoom-in-95 duration-150">
                <div className="px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-slate-400 border-b border-slate-100">
                  Select Font Style
                </div>
                <div className="p-1 space-y-1">
                  {[
                    { id: 'sans', name: 'Sans-Serif', desc: 'Inter / Modern Clean' },
                    { id: 'serif', name: 'Serif', desc: 'Georgia / Classic Formal' },
                    { id: 'mono', name: 'Monospace', desc: 'JetBrains / Code Style' },
                  ].map((f) => (
                    <button
                      key={f.id}
                      onClick={() => {
                        if (onChangeTheme) onChangeTheme({ ...theme, fontPairing: f.id as any });
                        setShowFontDropdown(false);
                      }}
                      className={`w-full p-2 rounded-lg text-left transition-all cursor-pointer ${
                        theme.fontPairing === f.id
                          ? 'bg-purple-50 border border-purple-200 text-purple-900 font-bold'
                          : 'hover:bg-slate-50 text-slate-700'
                      }`}
                    >
                      <div className="text-xs font-bold">{f.name}</div>
                      <div className="text-[10px] text-slate-400">{f.desc}</div>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Quick Font Size Selector */}
          <div className="relative">
            <button
              id="preview-font-size-btn"
              onClick={() => {
                setShowFontSizeDropdown(!showFontSizeDropdown);
                setShowFontDropdown(false);
                setShowPageSizeDropdown(false);
              }}
              className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-bold bg-slate-50 hover:bg-slate-100 text-slate-800 border border-slate-300 hover:border-slate-400 transition-all cursor-pointer shadow-2xs"
              title="Adjust Resume Text Size (Small, Medium, Large)"
            >
              <span className="font-mono text-xs text-amber-600 font-black">A±</span>
              <span className="font-semibold text-slate-500">Size:</span>
              <span className="text-amber-700 font-extrabold uppercase">
                {theme.fontSize === 'sm' ? 'Small' : theme.fontSize === 'lg' ? 'Large' : 'Medium'}
              </span>
              <ChevronDown className="w-3 h-3 text-slate-400 ml-0.5" />
            </button>

            {showFontSizeDropdown && (
              <div className="absolute top-full left-0 mt-1.5 w-52 bg-white rounded-xl shadow-2xl border border-slate-200 py-1.5 z-50 text-xs animate-in fade-in-50 zoom-in-95 duration-150">
                <div className="px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-slate-400 border-b border-slate-100">
                  Select Text Size Scale
                </div>
                <div className="p-1 space-y-1">
                  {[
                    { id: 'sm', label: 'Small (Compact)', sizeDesc: 'Fits maximum text per page' },
                    { id: 'md', label: 'Medium (Standard)', sizeDesc: 'Balanced ATS standard' },
                    { id: 'lg', label: 'Large (Expanded)', sizeDesc: 'High readability font size' },
                  ].map((s) => (
                    <button
                      key={s.id}
                      onClick={() => {
                        if (onChangeTheme) onChangeTheme({ ...theme, fontSize: s.id as any });
                        setShowFontSizeDropdown(false);
                      }}
                      className={`w-full p-2 rounded-lg text-left transition-all cursor-pointer ${
                        theme.fontSize === s.id
                          ? 'bg-amber-50 border border-amber-200 text-amber-900 font-bold'
                          : 'hover:bg-slate-50 text-slate-700'
                      }`}
                    >
                      <div className="text-xs font-bold">{s.label}</div>
                      <div className="text-[10px] text-slate-400">{s.sizeDesc}</div>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right: Zoom & Quick Export Actions */}
        <div className="flex items-center gap-1.5">
          {/* Zoom controls */}
          <div className="flex items-center bg-slate-100 rounded-lg p-0.5 border border-slate-200 mr-1 text-xs">
            <button
              id="zoom-out-btn"
              onClick={handleZoomOut}
              className="p-1 text-slate-600 hover:text-slate-900 hover:bg-white rounded transition-colors cursor-pointer"
              title="Zoom out"
            >
              <ZoomOut className="w-3.5 h-3.5" />
            </button>
            <span className="px-1.5 font-mono text-[11px] font-medium text-slate-600 min-w-[36px] text-center">
              {Math.round(zoom * 100)}%
            </span>
            <button
              id="zoom-in-btn"
              onClick={handleZoomIn}
              className="p-1 text-slate-600 hover:text-slate-900 hover:bg-white rounded transition-colors cursor-pointer"
              title="Zoom in"
            >
              <ZoomIn className="w-3.5 h-3.5" />
            </button>
            <button
              id="zoom-reset-btn"
              onClick={handleResetZoom}
              className="p-1 text-slate-400 hover:text-slate-700 hover:bg-white rounded transition-colors cursor-pointer ml-0.5"
              title="Reset Zoom"
            >
              <RotateCcw className="w-3 h-3" />
            </button>
          </div>

          {/* Quick PDF button */}
          <button
            id="quick-pdf-btn"
            onClick={handlePdfDownload}
            disabled={isExportingPdf}
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-semibold bg-slate-900 text-white hover:bg-slate-800 disabled:opacity-50 transition-colors cursor-pointer shadow-xs"
            title={`Export High-Res PDF in ${pageConfig.shortLabel} format`}
          >
            <Download className="w-3.5 h-3.5" />
            <span>{isExportingPdf ? 'Exporting...' : `PDF (${pageConfig.shortLabel})`}</span>
          </button>

          {/* Quick DOCX button */}
          <button
            id="quick-docx-btn"
            onClick={handleDocxDownload}
            disabled={isExportingDocx}
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-semibold bg-white text-slate-700 border border-slate-300 hover:bg-slate-50 disabled:opacity-50 transition-colors cursor-pointer shadow-xs"
            title={`Export Word .docx in ${pageConfig.shortLabel} format`}
          >
            <FileText className="w-3.5 h-3.5 text-blue-600" />
            <span>{isExportingDocx ? 'Exporting...' : 'Word'}</span>
          </button>

          {/* Print button */}
          <button
            id="quick-print-btn"
            onClick={() => triggerPrintDialog(activePaperSize)}
            className="p-1.5 text-slate-600 hover:text-slate-900 hover:bg-slate-100 border border-slate-200 rounded-lg transition-colors cursor-pointer"
            title={`Print or Save as PDF in ${pageConfig.shortLabel} standard`}
          >
            <Printer className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Interactive Canvas Stage */}
      <div className="flex-1 overflow-auto p-4 sm:p-8 flex flex-col items-center justify-start">
        {/* Page standard indicator pill above canvas */}
        <div className="mb-2 flex items-center gap-2 text-[11px] text-slate-500 font-medium bg-white/80 backdrop-blur-xs px-3 py-1 rounded-full border border-slate-200/80 shadow-2xs">
          <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
          <span>Page Format: <strong className="text-slate-800">{pageConfig.name}</strong></span>
          <span className="text-slate-400">•</span>
          <span className="font-mono text-slate-600">{pageConfig.dimensionsMetric} ({pageConfig.dimensionsImperial})</span>
          <span className="text-slate-400">•</span>
          <span className="text-blue-600 font-semibold">{pageConfig.regionBadge}</span>
        </div>

        {/* Dynamic Paper Sheet Box with precise physical dimensions */}
        <div
          id="resume-canvas-sheet"
          className="transition-transform duration-150 origin-top shadow-xl ring-1 ring-slate-900/10 bg-white rounded-xs relative"
          style={{
            transform: `scale(${zoom})`,
            width: pageConfig.widthCss,
            minHeight: pageConfig.minHeightCss,
            maxWidth: '100%',
          }}
        >
          {renderTemplate()}
        </div>
      </div>
    </div>
  );
};
