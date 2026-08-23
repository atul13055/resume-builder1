import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ResumeData, ThemeConfig } from '../../types/resume';
import { PersonalInfoForm } from './PersonalInfoForm';
import { SummaryForm } from './SummaryForm';
import { ExperienceForm } from './ExperienceForm';
import { SkillsForm } from './SkillsForm';
import { EducationForm } from './EducationForm';
import { ProjectsForm } from './ProjectsForm';
import { CertificationsForm } from './CertificationsForm';
import { SectionOrderManager } from './SectionOrderManager';
import { SpellCheckToolbar } from './SpellCheckToolbar';
import {
  User,
  FileText,
  Briefcase,
  Tag,
  GraduationCap,
  FolderGit2,
  Award,
  Sparkles,
  Sliders,
  Undo2,
  Redo2,
  Eye,
  EyeOff,
  Layers,
} from 'lucide-react';

interface ResumeEditorProps {
  resume: ResumeData;
  theme: ThemeConfig;
  canUndo?: boolean;
  canRedo?: boolean;
  undoCount?: number;
  maxHistory?: number;
  onUndo?: () => void;
  onRedo?: () => void;
  onChange: (resume: ResumeData) => void;
  onChangeTheme?: (theme: ThemeConfig) => void;
  onOpenTailorModal: () => void;
  onOpenAtsModal: () => void;
  onOpenCustomization: () => void;
  onOpenLinkedInModal?: () => void;
}

type TabType = 'personal' | 'summary' | 'experience' | 'skills' | 'education' | 'projects' | 'certifications' | 'sections';

export const ResumeEditor: React.FC<ResumeEditorProps> = ({
  resume,
  theme,
  canUndo = false,
  canRedo = false,
  undoCount = 0,
  maxHistory = 10,
  onUndo,
  onRedo,
  onChange,
  onChangeTheme,
  onOpenTailorModal,
  onOpenAtsModal,
  onOpenCustomization,
  onOpenLinkedInModal,
}) => {
  const [activeTab, setActiveTab] = useState<TabType>('experience');

  const hiddenSections = theme.hiddenSections || [];

  const toggleSectionVisibility = (sectionKey: string, e?: React.MouseEvent) => {
    if (e) {
      e.stopPropagation();
    }
    if (!onChangeTheme) return;
    const isCurrentlyHidden = hiddenSections.includes(sectionKey);
    const newHidden = isCurrentlyHidden
      ? hiddenSections.filter((id) => id !== sectionKey)
      : [...hiddenSections, sectionKey];
    onChangeTheme({
      ...theme,
      hiddenSections: newHidden,
    });
  };

  const tabs: {
    id: TabType;
    label: string;
    icon: React.ComponentType<{ className?: string }>;
    count?: number;
    sectionKey?: string;
  }[] = [
    { id: 'personal', label: 'Contact', icon: User },
    { id: 'summary', label: 'Summary', icon: FileText, sectionKey: 'summary' },
    { id: 'experience', label: 'Experience', icon: Briefcase, count: resume.experience?.length || 0, sectionKey: 'experience' },
    { id: 'skills', label: 'Skills', icon: Tag, count: resume.skills?.length || 0, sectionKey: 'skills' },
    { id: 'education', label: 'Education', icon: GraduationCap, count: resume.education?.length || 0, sectionKey: 'education' },
    { id: 'projects', label: 'Projects', icon: FolderGit2, count: resume.projects?.length || 0, sectionKey: 'projects' },
    { id: 'certifications', label: 'Certs & Lang', icon: Award, count: (resume.certifications?.length || 0) + (resume.languages?.length || 0), sectionKey: 'certifications' },
    { id: 'sections', label: 'Reorder / Hide', icon: Layers },
  ];

  const currentTabIsHidden =
    activeTab !== 'personal' &&
    activeTab !== 'sections' &&
    tabs.find((t) => t.id === activeTab)?.sectionKey &&
    hiddenSections.includes(tabs.find((t) => t.id === activeTab)!.sectionKey!);

  const activeSectionKey = tabs.find((t) => t.id === activeTab)?.sectionKey;

  return (
    <div className="flex flex-col h-full bg-white">
      {/* Editor Header Navigation Tabs */}
      <div className="border-b border-slate-200 bg-slate-50/70 px-3 pt-2.5 flex items-center justify-between gap-2 flex-wrap">
        <div className="flex items-center gap-1 overflow-x-auto pb-2 scrollbar-none max-w-full">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            const isSecHidden = tab.sectionKey ? hiddenSections.includes(tab.sectionKey) : false;

            return (
              <div key={tab.id} className="relative flex items-center">
                <button
                  id={`tab-${tab.id}`}
                  onClick={() => setActiveTab(tab.id)}
                  className={`group flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                    isActive
                      ? 'bg-white text-blue-600 shadow-xs border border-slate-200'
                      : isSecHidden
                      ? 'text-slate-400 hover:text-slate-600 hover:bg-slate-100/70 opacity-75'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-blue-600' : isSecHidden ? 'text-slate-300' : 'text-slate-400'}`} />
                  <span className={isSecHidden ? 'line-through decoration-slate-300' : ''}>{tab.label}</span>
                  {typeof tab.count === 'number' && tab.count > 0 && (
                    <span
                      className={`text-[10px] font-bold px-1.5 py-0.2 rounded-full ${
                        isActive
                          ? 'bg-blue-100 text-blue-700'
                          : isSecHidden
                          ? 'bg-slate-100 text-slate-400'
                          : 'bg-slate-200 text-slate-600'
                      }`}
                    >
                      {tab.count}
                    </span>
                  )}

                  {/* Inline quick visibility toggle icon */}
                  {tab.sectionKey && onChangeTheme && (
                    <span
                      onClick={(e) => toggleSectionVisibility(tab.sectionKey!, e)}
                      title={isSecHidden ? `Show ${tab.label} section on resume preview` : `Hide ${tab.label} section from resume preview`}
                      className={`ml-0.5 p-0.5 rounded hover:bg-slate-200 transition-colors ${
                        isSecHidden ? 'text-amber-500 hover:text-amber-600' : 'text-slate-300 hover:text-slate-600'
                      }`}
                    >
                      {isSecHidden ? (
                        <EyeOff className="w-3 h-3 text-amber-500" />
                      ) : (
                        <Eye className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                      )}
                    </span>
                  )}
                </button>
              </div>
            );
          })}
        </div>

        {/* Right tools: Undo/Redo & Styles */}
        <div className="flex items-center gap-1.5 mb-2">
          {/* Undo/Redo group */}
          <div className="flex items-center bg-white rounded-lg p-0.5 border border-slate-200 shadow-2xs">
            <button
              id="editor-undo-btn"
              onClick={onUndo}
              disabled={!canUndo}
              className="flex items-center gap-1 px-2 py-1 rounded text-xs font-semibold text-slate-700 hover:text-blue-600 hover:bg-slate-50 disabled:opacity-35 disabled:cursor-not-allowed disabled:hover:bg-transparent transition-all cursor-pointer"
              title={`Undo last edit (Ctrl+Z / ⌘Z) — ${undoCount}/${maxHistory} edits in history`}
            >
              <Undo2 className="w-3.5 h-3.5 text-blue-600" />
              <span className="hidden sm:inline">Undo</span>
              {undoCount > 0 && (
                <span className="text-[10px] font-mono font-bold px-1 bg-blue-50 text-blue-700 border border-blue-200 rounded">
                  {undoCount}
                </span>
              )}
            </button>

            <button
              id="editor-redo-btn"
              onClick={onRedo}
              disabled={!canRedo}
              className="p-1 rounded text-xs font-semibold text-slate-500 hover:text-blue-600 hover:bg-slate-50 disabled:opacity-35 disabled:cursor-not-allowed disabled:hover:bg-transparent transition-all cursor-pointer"
              title="Redo edit (Ctrl+Shift+Z / ⌘Shift+Z)"
            >
              <Redo2 className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Action button for styles */}
          <button
            id="editor-customization-btn"
            onClick={onOpenCustomization}
            className="flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold bg-white border border-slate-200 text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer shadow-2xs"
            title="Customize Theme, Layout & Section Visibility"
          >
            <Sliders className="w-3.5 h-3.5 text-slate-500" />
            <span>Styles</span>
          </button>
        </div>
      </div>

      {/* Real-time Spell Check Toolbar */}
      <SpellCheckToolbar />

      {/* Hidden Section Notice Banner if currently active tab is hidden */}
      {currentTabIsHidden && activeSectionKey && onChangeTheme && (
        <div className="mx-4 sm:mx-6 mt-4 p-3 bg-amber-50 border border-amber-200 rounded-xl flex items-center justify-between gap-3 text-amber-800 text-xs animate-in fade-in">
          <div className="flex items-center gap-2">
            <EyeOff className="w-4 h-4 text-amber-600 shrink-0" />
            <span>
              <strong>This section is currently hidden</strong> and will not appear on the resume preview or export.
            </span>
          </div>
          <button
            onClick={() => toggleSectionVisibility(activeSectionKey)}
            className="px-2.5 py-1 bg-white border border-amber-300 text-amber-900 hover:bg-amber-100 rounded-lg font-semibold text-xs transition-colors shrink-0 cursor-pointer shadow-2xs"
          >
            Unhide Section
          </button>
        </div>
      )}

      {/* Main Tab Content Area */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-6">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.18, ease: 'easeOut' }}
            className="space-y-6"
          >
            {activeTab === 'personal' && (
              <PersonalInfoForm
                data={resume.personalInfo}
                onChange={(personalInfo) => onChange({ ...resume, personalInfo })}
                onOpenLinkedInModal={onOpenLinkedInModal}
              />
            )}

            {activeTab === 'summary' && (
              <SummaryForm
                summary={resume.summary}
                resumeData={resume}
                onChange={(summary) => onChange({ ...resume, summary })}
              />
            )}

            {activeTab === 'experience' && (
              <ExperienceForm
                experience={resume.experience}
                onChange={(experience) => onChange({ ...resume, experience })}
              />
            )}

            {activeTab === 'skills' && (
              <SkillsForm
                skills={resume.skills}
                onChange={(skills) => onChange({ ...resume, skills })}
                userTitle={resume.personalInfo?.title}
                experienceRoles={resume.experience?.map((e) => e.role) || []}
              />
            )}

            {activeTab === 'education' && (
              <EducationForm
                education={resume.education}
                onChange={(education) => onChange({ ...resume, education })}
              />
            )}

            {activeTab === 'projects' && (
              <ProjectsForm
                projects={resume.projects}
                onChange={(projects) => onChange({ ...resume, projects })}
              />
            )}

            {activeTab === 'certifications' && (
              <CertificationsForm
                certifications={resume.certifications}
                languages={resume.languages}
                onCertificationsChange={(certifications) => onChange({ ...resume, certifications })}
                onLanguagesChange={(languages) => onChange({ ...resume, languages })}
              />
            )}

            {activeTab === 'sections' && onChangeTheme && (
              <div className="space-y-4">
                <SectionOrderManager
                  resume={resume}
                  theme={theme}
                  onChangeTheme={onChangeTheme}
                  onNavigateToTab={(tabKey) => setActiveTab(tabKey)}
                />
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
};
