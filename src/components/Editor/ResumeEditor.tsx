import React, { useState } from 'react';
import { ResumeData, ThemeConfig } from '../../types/resume';
import { PersonalInfoForm } from './PersonalInfoForm';
import { SummaryForm } from './SummaryForm';
import { ExperienceForm } from './ExperienceForm';
import { SkillsForm } from './SkillsForm';
import { EducationForm } from './EducationForm';
import { ProjectsForm } from './ProjectsForm';
import { CertificationsForm } from './CertificationsForm';
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
  onOpenTailorModal: () => void;
  onOpenAtsModal: () => void;
  onOpenCustomization: () => void;
  onOpenLinkedInModal?: () => void;
}

type TabType = 'personal' | 'summary' | 'experience' | 'skills' | 'education' | 'projects' | 'certifications';

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
  onOpenTailorModal,
  onOpenAtsModal,
  onOpenCustomization,
  onOpenLinkedInModal,
}) => {
  const [activeTab, setActiveTab] = useState<TabType>('experience');

  const tabs: { id: TabType; label: string; icon: React.ComponentType<{ className?: string }>; count?: number }[] = [
    { id: 'personal', label: 'Contact', icon: User },
    { id: 'summary', label: 'Summary', icon: FileText },
    { id: 'experience', label: 'Experience', icon: Briefcase, count: resume.experience?.length || 0 },
    { id: 'skills', label: 'Skills', icon: Tag, count: resume.skills?.length || 0 },
    { id: 'education', label: 'Education', icon: GraduationCap, count: resume.education?.length || 0 },
    { id: 'projects', label: 'Projects', icon: FolderGit2, count: resume.projects?.length || 0 },
    { id: 'certifications', label: 'Certs & Lang', icon: Award, count: (resume.certifications?.length || 0) + (resume.languages?.length || 0) },
  ];

  return (
    <div className="flex flex-col h-full bg-white">
      {/* Editor Header Navigation Tabs */}
      <div className="border-b border-slate-200 bg-slate-50/70 px-3 pt-2.5 flex items-center justify-between gap-2 flex-wrap">
        <div className="flex items-center gap-1 overflow-x-auto pb-2 scrollbar-none max-w-full">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;

            return (
              <button
                key={tab.id}
                id={`tab-${tab.id}`}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                  isActive
                    ? 'bg-white text-blue-600 shadow-xs border border-slate-200'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-blue-600' : 'text-slate-400'}`} />
                <span>{tab.label}</span>
                {typeof tab.count === 'number' && tab.count > 0 && (
                  <span
                    className={`text-[10px] font-bold px-1.5 py-0.2 rounded-full ${
                      isActive ? 'bg-blue-100 text-blue-700' : 'bg-slate-200 text-slate-600'
                    }`}
                  >
                    {tab.count}
                  </span>
                )}
              </button>
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
            title="Customize Theme & Layout"
          >
            <Sliders className="w-3.5 h-3.5 text-slate-500" />
            <span>Styles</span>
          </button>
        </div>
      </div>

      {/* Real-time Spell Check Toolbar */}
      <SpellCheckToolbar />

      {/* Main Tab Content Area */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
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
      </div>
    </div>
  );
};
