import React from 'react';
import { ResumeData, ThemeConfig, ResumeTemplateType } from '../types/resume';
import {
  FileText,
  Sparkles,
  CheckCircle2,
  Sliders,
  Download,
  Layout,
  BookOpen,
  RotateCcw,
  Mail,
  ChevronDown,
  Linkedin,
  Undo2,
  Redo2,
} from 'lucide-react';
import { SAMPLE_RESUMES } from '../data/sampleResumes';

interface NavbarProps {
  resume: ResumeData;
  theme: ThemeConfig;
  atsScore: number;
  canUndo?: boolean;
  canRedo?: boolean;
  undoCount?: number;
  redoCount?: number;
  maxHistory?: number;
  onUndo?: () => void;
  onRedo?: () => void;
  onOpenAtsModal: () => void;
  onOpenTailorModal: () => void;
  onOpenCoverLetterModal: () => void;
  onOpenTemplateModal: () => void;
  onOpenCustomization: () => void;
  onOpenExportModal: () => void;
  onOpenLinkedInModal: () => void;
  onLoadSample: (sampleKey: keyof typeof SAMPLE_RESUMES) => void;
  onReset: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  resume,
  theme,
  atsScore,
  canUndo = false,
  canRedo = false,
  undoCount = 0,
  redoCount = 0,
  maxHistory = 10,
  onUndo,
  onRedo,
  onOpenAtsModal,
  onOpenTailorModal,
  onOpenCoverLetterModal,
  onOpenTemplateModal,
  onOpenCustomization,
  onOpenExportModal,
  onOpenLinkedInModal,
  onLoadSample,
  onReset,
}) => {
  const [showSamplesDropdown, setShowSamplesDropdown] = React.useState(false);

  return (
    <header className="bg-slate-900 text-white border-b border-slate-800 px-4 py-2.5 flex items-center justify-between gap-3 flex-wrap select-none z-20">
      {/* Brand & App Title */}
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-500 flex items-center justify-center shadow-xs">
          <FileText className="w-4 h-4 text-white" />
        </div>
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-sm font-black tracking-tight text-white">ResumeBuilder</h1>
            <span className="text-[10px] font-bold px-1.5 py-0.2 bg-blue-500/20 text-blue-300 border border-blue-400/30 rounded-md">
              PRO ATS
            </span>
          </div>
          <p className="text-[10px] text-slate-400 font-medium">
            AI-Powered Career & Resume Studio
          </p>
        </div>
      </div>

      {/* Center Tool Actions */}
      <div className="flex items-center gap-1.5 flex-wrap">
        {/* LinkedIn Import Button */}
        <button
          id="nav-import-linkedin-btn"
          onClick={onOpenLinkedInModal}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold bg-blue-600/90 hover:bg-blue-600 text-white border border-blue-500/40 transition-all shadow-xs cursor-pointer"
        >
          <Linkedin className="w-3.5 h-3.5" />
          <span>Import LinkedIn</span>
        </button>

        {/* Sample Resumes Dropdown */}
        <div className="relative">
          <button
            onClick={() => setShowSamplesDropdown(!showSamplesDropdown)}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-colors cursor-pointer"
          >
            <BookOpen className="w-3.5 h-3.5 text-slate-400" />
            <span>Templates / Samples</span>
            <ChevronDown className="w-3 h-3 text-slate-400" />
          </button>

          {showSamplesDropdown && (
            <div className="absolute top-full left-0 mt-1.5 w-56 bg-white text-slate-900 rounded-xl shadow-xl border border-slate-200 py-1 z-50 text-xs">
              <div className="px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-slate-400 border-b border-slate-100">
                Load Sample Data
              </div>
              <button
                onClick={() => {
                  onLoadSample('softwareEngineer');
                  setShowSamplesDropdown(false);
                }}
                className="w-full px-3 py-2 text-left hover:bg-slate-50 flex flex-col cursor-pointer"
              >
                <span className="font-bold text-slate-800">Software Engineer (Senior)</span>
                <span className="text-[10px] text-slate-500">Tech & Cloud Architecture</span>
              </button>
              <button
                onClick={() => {
                  onLoadSample('productManager');
                  setShowSamplesDropdown(false);
                }}
                className="w-full px-3 py-2 text-left hover:bg-slate-50 flex flex-col cursor-pointer"
              >
                <span className="font-bold text-slate-800">Lead Product Manager</span>
                <span className="text-[10px] text-slate-500">Product Strategy & Growth</span>
              </button>
              <button
                onClick={() => {
                  onLoadSample('marketingLead');
                  setShowSamplesDropdown(false);
                }}
                className="w-full px-3 py-2 text-left hover:bg-slate-50 flex flex-col cursor-pointer"
              >
                <span className="font-bold text-slate-800">Director of Marketing</span>
                <span className="text-[10px] text-slate-500">Brand, Acquisition & GTM</span>
              </button>
              <div className="border-t border-slate-100 mt-1 pt-1">
                <button
                  onClick={() => {
                    onReset();
                    setShowSamplesDropdown(false);
                  }}
                  className="w-full px-3 py-1.5 text-left text-rose-600 hover:bg-rose-50 flex items-center gap-1.5 font-semibold cursor-pointer"
                >
                  <RotateCcw className="w-3 h-3" /> Clear to Blank Resume
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Change Template Gallery */}
        <button
          id="nav-template-gallery-btn"
          onClick={onOpenTemplateModal}
          className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-colors cursor-pointer"
        >
          <Layout className="w-3.5 h-3.5 text-blue-400" />
          <span className="capitalize">{theme.template} Style</span>
        </button>

        {/* AI Tailor Tool */}
        <button
          id="nav-ai-tailor-btn"
          onClick={onOpenTailorModal}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-500 hover:to-blue-500 text-white transition-all shadow-xs cursor-pointer"
        >
          <Sparkles className="w-3.5 h-3.5 text-amber-300" />
          <span>AI Job Tailor</span>
        </button>

        {/* Cover letter button */}
        <button
          id="nav-cover-letter-btn"
          onClick={onOpenCoverLetterModal}
          className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-colors cursor-pointer hidden md:flex"
        >
          <Mail className="w-3.5 h-3.5 text-indigo-400" />
          <span>Cover Letter</span>
        </button>

        {/* Undo & Redo Stack Controls */}
        <div className="flex items-center bg-slate-800/80 rounded-lg p-0.5 border border-slate-700/80 gap-0.5 ml-1">
          <button
            id="nav-undo-btn"
            onClick={onUndo}
            disabled={!canUndo}
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-md text-xs font-bold transition-all disabled:opacity-35 disabled:hover:bg-transparent disabled:cursor-not-allowed text-slate-200 hover:text-white hover:bg-slate-700 cursor-pointer"
            title={`Undo last edit (Ctrl+Z / ⌘Z) — ${undoCount}/${maxHistory} edits stored in stack`}
          >
            <Undo2 className="w-3.5 h-3.5 text-blue-400" />
            <span className="hidden sm:inline">Undo</span>
            {undoCount > 0 && (
              <span className="px-1.5 py-0.2 text-[10px] font-mono font-black bg-blue-500/30 text-blue-300 border border-blue-400/40 rounded-full">
                {undoCount}
              </span>
            )}
          </button>

          <button
            id="nav-redo-btn"
            onClick={onRedo}
            disabled={!canRedo}
            className="p-1.5 rounded-md text-xs font-bold transition-all disabled:opacity-35 disabled:hover:bg-transparent disabled:cursor-not-allowed text-slate-300 hover:text-white hover:bg-slate-700 cursor-pointer"
            title="Redo edit (Ctrl+Shift+Z / ⌘Shift+Z)"
          >
            <Redo2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Right Action Controls: ATS Badge & Export */}
      <div className="flex items-center gap-2">
        {/* ATS Score quick pill */}
        <button
          id="nav-ats-score-btn"
          onClick={onOpenAtsModal}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
            atsScore >= 85
              ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 hover:bg-emerald-500/30'
              : atsScore >= 70
              ? 'bg-blue-500/20 text-blue-300 border border-blue-500/40 hover:bg-blue-500/30'
              : 'bg-amber-500/20 text-amber-300 border border-amber-500/40 hover:bg-amber-500/30'
          }`}
          title="Click to view ATS Score and Keyword breakdown"
        >
          <CheckCircle2 className="w-3.5 h-3.5" />
          <span>ATS: {atsScore}%</span>
        </button>

        {/* Customization Drawer */}
        <button
          id="nav-styles-btn"
          onClick={onOpenCustomization}
          className="p-2 text-slate-300 hover:text-white hover:bg-slate-800 border border-slate-700 rounded-lg transition-colors cursor-pointer"
          title="Theme, Colors & Fonts"
        >
          <Sliders className="w-4 h-4" />
        </button>

        {/* Export / Download CTA */}
        <button
          id="nav-export-modal-btn"
          onClick={onOpenExportModal}
          className="flex items-center gap-1.5 px-4 py-1.5 rounded-lg text-xs font-bold bg-white text-slate-900 hover:bg-slate-100 transition-all cursor-pointer shadow-sm"
        >
          <Download className="w-3.5 h-3.5" />
          <span>Export</span>
        </button>
      </div>
    </header>
  );
};
