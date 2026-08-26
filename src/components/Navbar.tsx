import React, { useState, useMemo, useRef, useEffect } from 'react';
import { ResumeData, ThemeConfig, ResumeTemplateType } from '../types/resume';
import { useAuth } from '../context/AuthContext';
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
  Check,
  Circle,
  AlertCircle,
  HelpCircle,
  Cloud,
  User,
  LogOut,
  LogIn,
  UserPlus,
  FolderOpen,
} from 'lucide-react';
import { SAMPLE_RESUMES } from '../data/sampleResumes';
import { calculateResumeCompleteness } from '../utils/completenessCalculator';

interface NavbarProps {
  resume: ResumeData;
  theme: ThemeConfig;
  atsScore: number;
  lastSavedTime?: string;
  isSaving?: boolean;
  canUndo?: boolean;
  canRedo?: boolean;
  undoCount?: number;
  redoCount?: number;
  maxHistory?: number;
  activeCloudResumeId?: string | null;
  onUndo?: () => void;
  onRedo?: () => void;
  onGoHome?: () => void;
  onOpenAtsModal: () => void;
  onOpenTailorModal: () => void;
  onOpenCoverLetterModal: () => void;
  onOpenTemplateModal: () => void;
  onOpenCustomization: () => void;
  onOpenExportModal: () => void;
  onOpenLinkedInModal: () => void;
  onOpenAuthModal: () => void;
  onOpenCloudResumesModal: () => void;
  onLoadSample: (sampleKey: keyof typeof SAMPLE_RESUMES) => void;
  onReset: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  resume,
  theme,
  atsScore,
  lastSavedTime = 'Just now',
  isSaving = false,
  canUndo = false,
  canRedo = false,
  undoCount = 0,
  redoCount = 0,
  maxHistory = 10,
  activeCloudResumeId,
  onUndo,
  onRedo,
  onGoHome,
  onOpenAtsModal,
  onOpenTailorModal,
  onOpenCoverLetterModal,
  onOpenTemplateModal,
  onOpenCustomization,
  onOpenExportModal,
  onOpenLinkedInModal,
  onOpenAuthModal,
  onOpenCloudResumesModal,
  onLoadSample,
  onReset,
}) => {
  const { user, logout } = useAuth();
  const [showSamplesDropdown, setShowSamplesDropdown] = React.useState(false);
  const [showCompletenessDropdown, setShowCompletenessDropdown] = React.useState(false);
  const [showUserDropdown, setShowUserDropdown] = React.useState(false);
  const completenessRef = useRef<HTMLDivElement>(null);
  const userDropdownRef = useRef<HTMLDivElement>(null);

  // Calculate live completeness
  const completeness = useMemo(() => calculateResumeCompleteness(resume), [resume]);

  // Click outside listener
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (completenessRef.current && !completenessRef.current.contains(event.target as Node)) {
        setShowCompletenessDropdown(false);
      }
      if (userDropdownRef.current && !userDropdownRef.current.contains(event.target as Node)) {
        setShowUserDropdown(false);
      }
    }
    if (showCompletenessDropdown || showUserDropdown) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showCompletenessDropdown, showUserDropdown]);


  return (
    <header className="bg-slate-900 text-white border-b border-slate-800 px-4 py-2.5 flex items-center justify-between gap-3 flex-wrap select-none z-20">
      {/* Brand & App Title with Home Navigation */}
      <div className="flex items-center gap-3">
        <button
          onClick={onGoHome}
          className="flex items-center gap-2.5 hover:opacity-90 transition-opacity text-left cursor-pointer group"
          title="Go to Home & About Page"
        >
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-500 flex items-center justify-center shadow-xs group-hover:scale-105 transition-transform">
            <FileText className="w-4 h-4 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-sm font-black tracking-tight text-white group-hover:text-blue-300 transition-colors">ResumeBuilder</h1>
              <span className="text-[10px] font-bold px-1.5 py-0.2 bg-blue-500/20 text-blue-300 border border-blue-400/30 rounded-md">
                PRO ATS
              </span>
            </div>
            <p className="text-[10px] text-slate-400 font-medium">
              By Atul Yadav <span className="text-slate-500">(Full Stack RoR Dev)</span>
            </p>
          </div>
        </button>

        {onGoHome && (
          <button
            onClick={onGoHome}
            className="hidden sm:flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700/80 transition-colors cursor-pointer ml-1"
          >
            <span>Home</span>
          </button>
        )}
      </div>

      {/* Center Tool Actions */}
      <div className="flex items-center gap-1.5 flex-wrap">
        {/* Completeness Progress Bar Indicator */}
        <div ref={completenessRef} className="relative">
          <button
            id="nav-completeness-btn"
            onClick={() => setShowCompletenessDropdown(!showCompletenessDropdown)}
            className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg bg-slate-800/90 hover:bg-slate-800 border border-slate-700/90 hover:border-slate-600 transition-all cursor-pointer group"
            title="Click to view section completeness details"
          >
            <div className="flex flex-col items-start gap-1">
              <div className="flex items-center justify-between w-24 sm:w-28 text-[10px]">
                <span className="font-semibold text-slate-300 group-hover:text-white transition-colors">
                  Completeness
                </span>
                <span
                  className={`font-mono font-bold ${
                    completeness.percentage === 100
                      ? 'text-emerald-400'
                      : completeness.percentage >= 70
                      ? 'text-blue-400'
                      : 'text-amber-400'
                  }`}
                >
                  {completeness.percentage}%
                </span>
              </div>
              {/* Progress Bar Track */}
              <div className="w-24 sm:w-28 h-1.5 bg-slate-700 rounded-full overflow-hidden">
                <div
                  className={`h-full transition-all duration-500 rounded-full ${
                    completeness.percentage === 100
                      ? 'bg-emerald-500'
                      : completeness.percentage >= 70
                      ? 'bg-gradient-to-r from-blue-500 to-indigo-500'
                      : 'bg-gradient-to-r from-amber-500 to-orange-500'
                  }`}
                  style={{ width: `${completeness.percentage}%` }}
                />
              </div>
            </div>
            <ChevronDown
              className={`w-3 h-3 text-slate-400 group-hover:text-slate-200 transition-transform ${
                showCompletenessDropdown ? 'rotate-180 text-blue-400' : ''
              }`}
            />
          </button>

          {/* Completeness Details Popover */}
          {showCompletenessDropdown && (
            <div className="absolute top-full left-0 mt-2 w-72 sm:w-80 bg-slate-900 border border-slate-700 rounded-xl shadow-2xl p-3.5 z-50 text-xs text-slate-200">
              <div className="flex items-center justify-between border-b border-slate-800 pb-2.5 mb-2.5">
                <div>
                  <h4 className="font-bold text-white text-xs flex items-center gap-1.5">
                    <span>Resume Completeness</span>
                    <span
                      className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                        completeness.percentage === 100
                          ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                          : 'bg-blue-500/20 text-blue-300 border border-blue-500/30'
                      }`}
                    >
                      {completeness.completedCount}/{completeness.totalCount} Sections Ready
                    </span>
                  </h4>
                  <p className="text-[10px] text-slate-400 mt-0.5">
                    {completeness.percentage === 100
                      ? 'All primary sections are fully populated!'
                      : 'Fill all sections to maximize interview callbacks.'}
                  </p>
                </div>
                <div className="text-right">
                  <span className="text-lg font-black text-white font-mono">{completeness.percentage}%</span>
                </div>
              </div>

              {/* Checklist breakdown */}
              <div className="space-y-1.5 max-h-56 overflow-y-auto pr-1">
                {completeness.items.map((item) => (
                  <div
                    key={item.id}
                    className={`flex items-start gap-2 p-1.5 rounded-lg text-[11px] transition-colors ${
                      item.isComplete ? 'bg-slate-800/40 text-slate-300' : 'bg-amber-950/20 text-amber-200/90 border border-amber-800/30'
                    }`}
                  >
                    {item.isComplete ? (
                      <div className="w-4 h-4 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0 mt-0.5">
                        <Check className="w-2.5 h-2.5 stroke-[3]" />
                      </div>
                    ) : (
                      <div className="w-4 h-4 rounded-full bg-amber-500/20 text-amber-400 flex items-center justify-center shrink-0 mt-0.5">
                        <Circle className="w-2.5 h-2.5 stroke-[2]" />
                      </div>
                    )}
                    <div className="flex-1">
                      <div className="flex items-center justify-between font-medium">
                        <span className={item.isComplete ? 'text-slate-200' : 'text-amber-100 font-semibold'}>
                          {item.name}
                        </span>
                        <span className="text-[9px] text-slate-500 font-mono">+{item.weight}%</span>
                      </div>
                      {!item.isComplete && (
                        <p className="text-[10px] text-amber-300/80 mt-0.5">
                          👉 {item.hint}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {completeness.nextSuggestedAction && (
                <div className="mt-2.5 pt-2 border-t border-slate-800 flex items-center gap-1.5 text-[10px] text-slate-400">
                  <AlertCircle className="w-3.5 h-3.5 text-blue-400 shrink-0" />
                  <span>Next Step: {completeness.nextSuggestedAction}</span>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Auto-Save LocalStorage Status Pill */}
        <div
          id="nav-autosave-status-pill"
          className="hidden sm:flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-slate-800/90 hover:bg-slate-800 border border-slate-700/90 text-xs text-slate-300 transition-all cursor-pointer select-none"
          title={`Real-Time Auto-Save is active. All resume changes are automatically saved to LocalStorage (${lastSavedTime}). Click to manually save.`}
          onClick={() => {
            try {
              localStorage.setItem('resumebuilder_saved_resume_v1', JSON.stringify(resume));
              alert(`✅ Resume manually saved to LocalStorage at ${lastSavedTime}!`);
            } catch (e) {
              console.error(e);
            }
          }}
        >
          {isSaving ? (
            <div className="w-2 h-2 rounded-full bg-amber-400 animate-ping shrink-0" />
          ) : (
            <div className="w-2 h-2 rounded-full bg-emerald-400 shadow-xs shadow-emerald-400/50 shrink-0" />
          )}
          <span className="font-semibold text-slate-200 text-[11px]">
            {isSaving ? 'Saving...' : 'Auto-Saved'}
          </span>
          <span className="text-[9.5px] text-slate-400 font-mono">({lastSavedTime})</span>
        </div>

        {/* LinkedIn Import Button */}
        <button
          id="nav-import-linkedin-btn"
          onClick={onOpenLinkedInModal}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold bg-blue-600/90 hover:bg-blue-600 text-white border border-blue-500/40 transition-all shadow-xs cursor-pointer"
        >
          <Linkedin className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Import LinkedIn</span>
        </button>

        {/* Sample Resumes Dropdown */}
        <div className="relative">
          <button
            onClick={() => setShowSamplesDropdown(!showSamplesDropdown)}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-colors cursor-pointer"
          >
            <BookOpen className="w-3.5 h-3.5 text-slate-400" />
            <span className="hidden sm:inline">Samples</span>
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
          className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-colors cursor-pointer hidden md:flex"
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
          className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-colors cursor-pointer hidden lg:flex"
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
        {/* User Auth Profile Dropdown (Only if logged in) */}
        {user && (
          <div className="relative" ref={userDropdownRef}>
            <button
              onClick={() => setShowUserDropdown(!showUserDropdown)}
              className="flex items-center gap-2 pl-1.5 pr-2 py-1 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-lg text-xs font-semibold text-white transition-all cursor-pointer"
              title="Account Menu"
            >
              {user.photoURL ? (
                <img
                  src={user.photoURL}
                  alt={user.displayName || 'User'}
                  className="w-5 h-5 rounded-full object-cover border border-blue-400"
                  referrerPolicy="no-referrer"
                />
              ) : (
                <div className="w-5 h-5 rounded-full bg-blue-600 text-white font-bold text-[10px] flex items-center justify-center">
                  {(user.displayName || user.email || 'U')[0].toUpperCase()}
                </div>
              )}
              <span className="max-w-[90px] truncate hidden md:inline">
                {user.displayName || user.email?.split('@')[0]}
              </span>
              <ChevronDown className="w-3 h-3 text-slate-400" />
            </button>

            {/* User Profile Dropdown */}
            {showUserDropdown && (
              <div className="absolute right-0 mt-2 w-56 bg-white text-slate-800 rounded-xl shadow-2xl border border-slate-200 py-2 z-50 animate-in fade-in zoom-in-95">
                <div className="px-3.5 py-2 border-b border-slate-100">
                  <p className="text-xs font-bold text-slate-900 truncate">
                    {user.displayName || 'User'}
                  </p>
                  <p className="text-[11px] text-slate-500 truncate">{user.email}</p>
                </div>

                <div className="py-1">
                  <button
                    onClick={() => {
                      setShowUserDropdown(false);
                      onOpenCloudResumesModal();
                    }}
                    className="w-full px-3.5 py-2 text-left text-xs text-slate-700 hover:bg-slate-50 flex items-center gap-2 font-medium cursor-pointer"
                  >
                    <FolderOpen className="w-4 h-4 text-blue-600" />
                    <span>My Cloud Resumes</span>
                  </button>

                  <button
                    onClick={() => {
                      setShowUserDropdown(false);
                      onOpenCustomization();
                    }}
                    className="w-full px-3.5 py-2 text-left text-xs text-slate-700 hover:bg-slate-50 flex items-center gap-2 font-medium cursor-pointer"
                  >
                    <Sliders className="w-4 h-4 text-slate-500" />
                    <span>Theme & Layout</span>
                  </button>
                </div>

                <div className="border-t border-slate-100 pt-1 mt-1">
                  <button
                    onClick={async () => {
                      setShowUserDropdown(false);
                      await logout();
                    }}
                    className="w-full px-3.5 py-2 text-left text-xs text-rose-600 hover:bg-rose-50 flex items-center gap-2 font-semibold cursor-pointer"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Sign Out</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

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
          className="flex items-center gap-1.5 px-4 py-1.5 rounded-lg text-xs font-bold bg-white text-slate-900 hover:bg-slate-100 transition-all cursor-pointer shadow-xs"
        >
          <Download className="w-3.5 h-3.5" />
          <span>Export</span>
        </button>
      </div>
    </header>
  );
};
