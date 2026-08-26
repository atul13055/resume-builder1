import React, { useState, useEffect, useMemo } from 'react';
import { ResumeData, ThemeConfig, ResumeTemplateType } from './types/resume';
import { SAMPLE_RESUMES, DEFAULT_THEME, EMPTY_RESUME } from './data/sampleResumes';
import { calculateATSScore } from './utils/atsScorer';
import { useResumeHistory } from './hooks/useResumeHistory';
import { useAuth } from './context/AuthContext';
import { Navbar } from './components/Navbar';
import { HomePage } from './components/Home/HomePage';
import { ResumeEditor } from './components/Editor/ResumeEditor';
import { ResumePreview } from './components/Preview/ResumePreview';
import { ATSScoreModal } from './components/Modals/ATSScoreModal';
import { AITailorModal } from './components/Modals/AITailorModal';
import { AICoverLetterModal } from './components/Modals/AICoverLetterModal';
import { TemplatePickerModal } from './components/Modals/TemplatePickerModal';
import { CustomizationDrawer } from './components/Modals/CustomizationDrawer';
import { ExportModal } from './components/Modals/ExportModal';
import { LinkedInImportModal } from './components/Modals/LinkedInImportModal';
import { AuthModal } from './components/Modals/AuthModal';
import { CloudResumesModal } from './components/Modals/CloudResumesModal';
import { Edit3, Eye, Sparkles, CheckCircle2 } from 'lucide-react';

const STORAGE_KEY_RESUME = 'resumebuilder_saved_resume_v1';
const STORAGE_KEY_THEME = 'resumebuilder_saved_theme_v1';
const STORAGE_KEY_VIEW = 'resumebuilder_active_view_v1';

export default function App() {
  const { user } = useAuth();

  // Current view: 'home' | 'builder'
  const [currentView, setCurrentView] = useState<'home' | 'builder'>('home');

  // Compute initial resume from localStorage or default to Software Engineer sample
  const initialResume = useMemo<ResumeData>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_RESUME);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed?.personalInfo?.fullName !== undefined) {
          return parsed;
        }
        if (parsed?.data?.personalInfo?.fullName !== undefined) {
          return parsed.data;
        }
      }
    } catch (e) {
      console.error('Failed to load saved resume from storage:', e);
    }
    return SAMPLE_RESUMES.softwareEngineer.data;
  }, []);

  // State-based Stack Undo & Redo History management (last 10 edits)
  const {
    resume,
    setResume,
    undo,
    redo,
    canUndo,
    canRedo,
    undoCount,
    redoCount,
    maxHistory,
  } = useResumeHistory(initialResume);

  // Active Cloud document ID (if loaded from Firestore)
  const [activeCloudResumeId, setActiveCloudResumeId] = useState<string | null>(null);

  // Initialize theme
  const [theme, setTheme] = useState<ThemeConfig>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_THEME);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed?.template) {
          return parsed;
        }
      }
    } catch (e) {
      console.error('Failed to load saved theme from storage:', e);
    }
    return DEFAULT_THEME;
  });

  // Active view on mobile screens: 'editor' | 'preview'
  const [mobileTab, setMobileTab] = useState<'editor' | 'preview'>('editor');

  // Modals state
  const [isAtsModalOpen, setIsAtsModalOpen] = useState(false);
  const [isTailorModalOpen, setIsTailorModalOpen] = useState(false);
  const [isCoverLetterModalOpen, setIsCoverLetterModalOpen] = useState(false);
  const [isTemplateModalOpen, setIsTemplateModalOpen] = useState(false);
  const [isCustomizationOpen, setIsCustomizationOpen] = useState(false);
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);
  const [isLinkedInModalOpen, setIsLinkedInModalOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authModalMode, setAuthModalMode] = useState<'signin' | 'signup'>('signin');
  const [authModalCustomMessage, setAuthModalCustomMessage] = useState<string | undefined>(undefined);
  const [pendingAuthAction, setPendingAuthAction] = useState<(() => void) | null>(null);
  const [isCloudResumesModalOpen, setIsCloudResumesModalOpen] = useState(false);

  // Helper to require authentication before proceeding with builder or actions
  const requireAuth = (action: () => void, customMessage?: string) => {
    if (user) {
      action();
    } else {
      setPendingAuthAction(() => action);
      setAuthModalMode('signin');
      setAuthModalCustomMessage(customMessage || 'Please sign in or create an account to start building and saving your resume.');
      setIsAuthModalOpen(true);
    }
  };

  // Auto-save to localStorage
  useEffect(() => {
    try {
      if (resume?.personalInfo) {
        localStorage.setItem(STORAGE_KEY_RESUME, JSON.stringify(resume));
      }
    } catch (e) {
      console.error('Auto-save resume error:', e);
    }
  }, [resume]);

  useEffect(() => {
    try {
      if (theme?.template) {
        localStorage.setItem(STORAGE_KEY_THEME, JSON.stringify(theme));
      }
    } catch (e) {
      console.error('Auto-save theme error:', e);
    }
  }, [theme]);

  // Reactive ATS Score calculation
  const atsAnalysis = useMemo(() => {
    return calculateATSScore(resume || SAMPLE_RESUMES.softwareEngineer.data);
  }, [resume]);

  // Handlers
  const handleLoadSample = (sampleKey: keyof typeof SAMPLE_RESUMES) => {
    const chosen = SAMPLE_RESUMES[sampleKey];
    if (chosen?.data) {
      setResume(chosen.data, { immediate: true });
      setActiveCloudResumeId(null);
      if (chosen.recommendedTheme) {
        setTheme((prev) => ({
          ...prev,
          ...chosen.recommendedTheme,
        }));
      }
    }
  };

  const handleReset = () => {
    if (window.confirm('Are you sure you want to clear all fields and start with a blank resume?')) {
      setResume(EMPTY_RESUME, { immediate: true });
      setActiveCloudResumeId(null);
    }
  };

  const handleApplyTailoredResume = (tailoredResume: ResumeData) => {
    setResume(tailoredResume, { immediate: true });
  };

  const handleApplyLinkedInResume = (importedResume: ResumeData, mode: 'replace' | 'merge') => {
    if (mode === 'replace') {
      setResume(importedResume, { immediate: true });
      setActiveCloudResumeId(null);
    } else {
      // Merge with existing resume
      setResume((prev) => ({
        ...prev,
        personalInfo: {
          ...prev.personalInfo,
          ...importedResume.personalInfo,
        },
        summary: importedResume.summary || prev.summary,
        experience: [...(importedResume.experience || []), ...(prev.experience || [])],
        education: [...(importedResume.education || []), ...(prev.education || [])],
        skills: [...(importedResume.skills || []), ...(prev.skills || [])],
        projects: [...(importedResume.projects || []), ...(prev.projects || [])],
        certifications: [...(importedResume.certifications || []), ...(prev.certifications || [])],
        languages: [...(importedResume.languages || []), ...(prev.languages || [])],
      }), { immediate: true });
    }
  };

  const handleLoadCloudResume = (loadedResume: ResumeData, loadedTheme?: ThemeConfig, cloudId?: string) => {
    setResume(loadedResume, { immediate: true });
    if (loadedTheme) {
      setTheme(loadedTheme);
    }
    if (cloudId) {
      setActiveCloudResumeId(cloudId);
    }
  };

  const handleSelectTemplate = (template: ResumeTemplateType) => {
    setTheme((prev) => ({ ...prev, template }));
  };

  const handleOpenAuth = (mode: 'signin' | 'signup' = 'signin') => {
    setAuthModalMode(mode);
    setIsAuthModalOpen(true);
  };

  return (
    <div className={currentView === 'home' ? "min-h-screen bg-slate-950 font-sans text-slate-800" : "flex flex-col h-screen w-screen overflow-hidden bg-slate-950 font-sans text-slate-800"}>
      {currentView === 'home' ? (
        <HomePage
          onLaunchBuilder={() => setCurrentView('builder')}
          onSelectTemplate={(tpl) => {
            handleSelectTemplate(tpl);
            setCurrentView('builder');
          }}
          onLoadSample={(sampleKey) => {
            handleLoadSample(sampleKey);
            setCurrentView('builder');
          }}
          onOpenLinkedInModal={() => setIsLinkedInModalOpen(true)}
          onOpenAuthModal={() => handleOpenAuth('signin')}
          onOpenCloudResumesModal={() => setIsCloudResumesModalOpen(true)}
        />
      ) : (
        <>
          {/* Top Navbar with Undo/Redo & Home Navigation */}
          <Navbar
            resume={resume}
            theme={theme}
            atsScore={atsAnalysis.overallScore}
            canUndo={canUndo}
            canRedo={canRedo}
            undoCount={undoCount}
            redoCount={redoCount}
            maxHistory={maxHistory}
            activeCloudResumeId={activeCloudResumeId}
            onUndo={undo}
            onRedo={redo}
            onGoHome={() => setCurrentView('home')}
            onOpenAtsModal={() => setIsAtsModalOpen(true)}
            onOpenTailorModal={() => setIsTailorModalOpen(true)}
            onOpenCoverLetterModal={() => setIsCoverLetterModalOpen(true)}
            onOpenTemplateModal={() => setIsTemplateModalOpen(true)}
            onOpenCustomization={() => setIsCustomizationOpen(true)}
            onOpenExportModal={() => setIsExportModalOpen(true)}
            onOpenLinkedInModal={() => setIsLinkedInModalOpen(true)}
            onOpenAuthModal={() => handleOpenAuth('signin')}
            onOpenCloudResumesModal={() => setIsCloudResumesModalOpen(true)}
            onLoadSample={handleLoadSample}
            onReset={handleReset}
          />

          {/* Mobile Tab Switcher (<lg screens) */}
          <div className="lg:hidden bg-slate-800 border-b border-slate-700 px-4 py-2 flex items-center justify-center gap-3">
            <button
              onClick={() => setMobileTab('editor')}
              className={`flex items-center gap-1.5 px-4 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                mobileTab === 'editor'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
              }`}
            >
              <Edit3 className="w-3.5 h-3.5" />
              <span>Editor Form</span>
            </button>

            <button
              onClick={() => setMobileTab('preview')}
              className={`flex items-center gap-1.5 px-4 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                mobileTab === 'preview'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
              }`}
            >
              <Eye className="w-3.5 h-3.5" />
              <span>Live Preview</span>
              <span className="text-[10px] px-1.5 py-0.2 bg-emerald-500 text-white rounded-full font-bold">
                {atsAnalysis.overallScore}%
              </span>
            </button>
          </div>

          {/* Main Split-Screen Workspace */}
          <div className="flex-1 flex overflow-hidden bg-slate-100">
            {/* Left Column: Rich Form Editor with Undo/Redo */}
            <div
              id="editor-container"
              className={`w-full lg:w-[48%] xl:w-[45%] h-full overflow-hidden border-r border-slate-200 ${
                mobileTab === 'editor' ? 'block' : 'hidden lg:block'
              }`}
            >
              <ResumeEditor
                resume={resume}
                theme={theme}
                canUndo={canUndo}
                canRedo={canRedo}
                undoCount={undoCount}
                maxHistory={maxHistory}
                onUndo={undo}
                onRedo={redo}
                onChange={setResume}
                onChangeTheme={setTheme}
                onOpenTailorModal={() => setIsTailorModalOpen(true)}
                onOpenAtsModal={() => setIsAtsModalOpen(true)}
                onOpenCustomization={() => setIsCustomizationOpen(true)}
                onOpenLinkedInModal={() => setIsLinkedInModalOpen(true)}
              />
            </div>

            {/* Right Column: Live Real-Time Interactive Canvas Preview */}
            <div
              id="resume-preview-container"
              className={`flex-1 h-full overflow-hidden ${
                mobileTab === 'preview' ? 'block' : 'hidden lg:block'
              }`}
            >
              <ResumePreview
                resume={resume}
                theme={theme}
                atsScore={atsAnalysis.overallScore}
                onOpenAtsModal={() => setIsAtsModalOpen(true)}
                onOpenTailorModal={() => setIsTailorModalOpen(true)}
                onChangeTheme={setTheme}
              />
            </div>
          </div>
        </>
      )}

      {/* Modals & Drawers */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => {
          setIsAuthModalOpen(false);
          setPendingAuthAction(null);
          setAuthModalCustomMessage(undefined);
        }}
        initialMode={authModalMode}
        customMessage={authModalCustomMessage}
        onSuccess={() => {
          if (pendingAuthAction) {
            pendingAuthAction();
            setPendingAuthAction(null);
          }
        }}
      />

      <CloudResumesModal
        isOpen={isCloudResumesModalOpen}
        onClose={() => setIsCloudResumesModalOpen(false)}
        currentResume={resume}
        currentTheme={theme}
        currentAtsScore={atsAnalysis.overallScore}
        activeCloudResumeId={activeCloudResumeId}
        onLoadResume={handleLoadCloudResume}
        onSetActiveCloudResumeId={setActiveCloudResumeId}
        onOpenAuthModal={() => handleOpenAuth('signin')}
      />

      <LinkedInImportModal
        isOpen={isLinkedInModalOpen}
        onClose={() => setIsLinkedInModalOpen(false)}
        onApplyResume={handleApplyLinkedInResume}
      />

      <ATSScoreModal
        isOpen={isAtsModalOpen}
        onClose={() => setIsAtsModalOpen(false)}
        resume={resume}
        liveAtsResult={atsAnalysis}
        onUpdateResume={setResume}
        onOpenTailorModal={() => {
          setIsAtsModalOpen(false);
          setIsTailorModalOpen(true);
        }}
      />

      <AITailorModal
        isOpen={isTailorModalOpen}
        onClose={() => setIsTailorModalOpen(false)}
        resume={resume}
        onApplyTailoring={handleApplyTailoredResume}
      />

      <AICoverLetterModal
        isOpen={isCoverLetterModalOpen}
        onClose={() => setIsCoverLetterModalOpen(false)}
        resume={resume}
      />

      <TemplatePickerModal
        isOpen={isTemplateModalOpen}
        onClose={() => setIsTemplateModalOpen(false)}
        currentTemplate={theme.template}
        onSelectTemplate={handleSelectTemplate}
      />

      <CustomizationDrawer
        isOpen={isCustomizationOpen}
        onClose={() => setIsCustomizationOpen(false)}
        theme={theme}
        onChangeTheme={setTheme}
        onOpenTemplateModal={() => setIsTemplateModalOpen(true)}
      />

      <ExportModal
        isOpen={isExportModalOpen}
        onClose={() => setIsExportModalOpen(false)}
        resume={resume}
        theme={theme}
        onChangeTheme={setTheme}
        onImportResume={setResume}
      />
    </div>
  );
}

