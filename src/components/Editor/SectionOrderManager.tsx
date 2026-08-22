import React, { useState } from 'react';
import { ResumeData, ThemeConfig } from '../../types/resume';
import {
  GripVertical,
  ChevronUp,
  ChevronDown,
  Eye,
  EyeOff,
  Briefcase,
  GraduationCap,
  Tag,
  FolderGit2,
  Award,
  FileText,
  Languages,
  RotateCcw,
  Sparkles,
  ArrowRight,
  CheckCircle2,
} from 'lucide-react';

export interface SectionDefinition {
  id: string;
  label: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  itemCount: number;
  tabKey: 'summary' | 'experience' | 'skills' | 'education' | 'projects' | 'certifications' | 'personal';
}

interface SectionOrderManagerProps {
  resume: ResumeData;
  theme: ThemeConfig;
  onChangeTheme: (theme: ThemeConfig) => void;
  onNavigateToTab: (tab: any) => void;
}

const ALL_SECTION_DEFS: Record<string, Omit<SectionDefinition, 'itemCount'>> = {
  summary: {
    id: 'summary',
    label: 'Professional Summary',
    description: 'Executive bio and career highlights statement',
    icon: FileText,
    tabKey: 'summary',
  },
  experience: {
    id: 'experience',
    label: 'Work Experience',
    description: 'Employment history, roles, responsibilities, and achievements',
    icon: Briefcase,
    tabKey: 'experience',
  },
  skills: {
    id: 'skills',
    label: 'Skills & Expertise',
    description: 'Core competencies, technical stacks, tools, and frameworks',
    icon: Tag,
    tabKey: 'skills',
  },
  projects: {
    id: 'projects',
    label: 'Key Projects',
    description: 'Open source, portfolio, and significant engineering initiatives',
    icon: FolderGit2,
    tabKey: 'projects',
  },
  education: {
    id: 'education',
    label: 'Education & Degrees',
    description: 'Academic background, universities, degrees, and honors',
    icon: GraduationCap,
    tabKey: 'education',
  },
  certifications: {
    id: 'certifications',
    label: 'Certifications',
    description: 'Industry credentials, licenses, and verified certificates',
    icon: Award,
    tabKey: 'certifications',
  },
  languages: {
    id: 'languages',
    label: 'Languages',
    description: 'Spoken and written language proficiencies',
    icon: Languages,
    tabKey: 'certifications',
  },
};

const DEFAULT_SECTION_ORDER = [
  'summary',
  'experience',
  'skills',
  'projects',
  'education',
  'certifications',
  'languages',
];

export const SectionOrderManager: React.FC<SectionOrderManagerProps> = ({
  resume,
  theme,
  onChangeTheme,
  onNavigateToTab,
}) => {
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);

  const currentOrder = theme.sectionOrder && theme.sectionOrder.length > 0
    ? theme.sectionOrder.filter((id) => ALL_SECTION_DEFS[id])
    : DEFAULT_SECTION_ORDER;

  // Ensure all known sections are represented
  const completeOrder = [
    ...currentOrder,
    ...DEFAULT_SECTION_ORDER.filter((id) => !currentOrder.includes(id)),
  ];

  const hiddenSections = theme.hiddenSections || [];

  const getItemCount = (id: string): number => {
    switch (id) {
      case 'summary':
        return resume.summary?.trim() ? 1 : 0;
      case 'experience':
        return resume.experience?.length || 0;
      case 'skills':
        return resume.skills?.length || 0;
      case 'projects':
        return resume.projects?.length || 0;
      case 'education':
        return resume.education?.length || 0;
      case 'certifications':
        return resume.certifications?.length || 0;
      case 'languages':
        return resume.languages?.length || 0;
      default:
        return 0;
    }
  };

  const moveSection = (fromIndex: number, toIndex: number) => {
    if (fromIndex === toIndex || toIndex < 0 || toIndex >= completeOrder.length) return;
    const newOrder = [...completeOrder];
    const [movedItem] = newOrder.splice(fromIndex, 1);
    newOrder.splice(toIndex, 0, movedItem);
    onChangeTheme({
      ...theme,
      sectionOrder: newOrder,
    });
  };

  const toggleVisibility = (sectionId: string) => {
    const isHidden = hiddenSections.includes(sectionId);
    const newHidden = isHidden
      ? hiddenSections.filter((id) => id !== sectionId)
      : [...hiddenSections, sectionId];
    onChangeTheme({
      ...theme,
      hiddenSections: newHidden,
    });
  };

  const applyPreset = (presetOrder: string[]) => {
    onChangeTheme({
      ...theme,
      sectionOrder: presetOrder,
    });
  };

  return (
    <div className="space-y-5 animate-in fade-in duration-200">
      {/* Header Info */}
      <div className="p-4 bg-gradient-to-r from-blue-50/70 via-indigo-50/40 to-slate-50 border border-blue-100/80 rounded-2xl">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-blue-600" />
              Customize Resume Structure
            </h3>
            <p className="text-xs text-slate-600 mt-1 leading-relaxed">
              Drag and drop any section to rearrange how they appear on your resume. You can also hide optional sections or choose from industry presets below.
            </p>
          </div>
        </div>

        {/* Quick Presets */}
        <div className="mt-3.5 pt-3 border-t border-blue-200/50 flex items-center gap-1.5 flex-wrap">
          <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mr-1">
            Presets:
          </span>
          <button
            type="button"
            id="preset-standard-btn"
            onClick={() =>
              applyPreset(['summary', 'experience', 'skills', 'projects', 'education', 'certifications', 'languages'])
            }
            className="px-2.5 py-1 text-xs font-semibold rounded-lg bg-white border border-slate-200 text-slate-700 hover:bg-blue-50 hover:text-blue-700 hover:border-blue-200 transition-colors shadow-2xs cursor-pointer"
          >
            Experience First (Standard)
          </button>
          <button
            type="button"
            id="preset-academic-btn"
            onClick={() =>
              applyPreset(['summary', 'education', 'experience', 'projects', 'skills', 'certifications', 'languages'])
            }
            className="px-2.5 py-1 text-xs font-semibold rounded-lg bg-white border border-slate-200 text-slate-700 hover:bg-blue-50 hover:text-blue-700 hover:border-blue-200 transition-colors shadow-2xs cursor-pointer"
          >
            Education First (New Grads)
          </button>
          <button
            type="button"
            id="preset-skills-btn"
            onClick={() =>
              applyPreset(['summary', 'skills', 'projects', 'experience', 'education', 'certifications', 'languages'])
            }
            className="px-2.5 py-1 text-xs font-semibold rounded-lg bg-white border border-slate-200 text-slate-700 hover:bg-blue-50 hover:text-blue-700 hover:border-blue-200 transition-colors shadow-2xs cursor-pointer"
          >
            Skills & Projects First
          </button>
          <button
            type="button"
            id="preset-reset-btn"
            onClick={() => applyPreset(DEFAULT_SECTION_ORDER)}
            className="px-2 py-1 text-xs font-semibold rounded-lg text-slate-500 hover:text-slate-800 hover:bg-slate-200/60 transition-colors cursor-pointer flex items-center gap-1 ml-auto"
            title="Reset to default order"
          >
            <RotateCcw className="w-3 h-3" />
            <span>Reset</span>
          </button>
        </div>
      </div>

      {/* Drag & Drop Reorderable List */}
      <div className="space-y-2.5" id="reorderable-sections-list">
        {completeOrder.map((sectionId, index) => {
          const def = ALL_SECTION_DEFS[sectionId];
          if (!def) return null;

          const Icon = def.icon;
          const count = getItemCount(sectionId);
          const isHidden = hiddenSections.includes(sectionId);
          const isDragging = draggedIndex === index;
          const isDragOver = dragOverIndex === index;

          return (
            <div
              key={sectionId}
              id={`reorder-item-${sectionId}`}
              draggable
              onDragStart={(e) => {
                e.dataTransfer.setData('text/plain', index.toString());
                e.dataTransfer.effectAllowed = 'move';
                setDraggedIndex(index);
              }}
              onDragOver={(e) => {
                e.preventDefault();
                e.dataTransfer.dropEffect = 'move';
                if (dragOverIndex !== index) {
                  setDragOverIndex(index);
                }
              }}
              onDragLeave={() => {
                if (dragOverIndex === index) {
                  setDragOverIndex(null);
                }
              }}
              onDrop={(e) => {
                e.preventDefault();
                if (draggedIndex !== null && draggedIndex !== index) {
                  moveSection(draggedIndex, index);
                }
                setDraggedIndex(null);
                setDragOverIndex(null);
              }}
              onDragEnd={() => {
                setDraggedIndex(null);
                setDragOverIndex(null);
              }}
              className={`group relative flex items-center justify-between p-3 rounded-xl border transition-all select-none ${
                isDragging
                  ? 'opacity-40 scale-[0.98] border-dashed border-blue-400 bg-blue-50/50 shadow-inner'
                  : isDragOver
                  ? 'border-blue-500 ring-2 ring-blue-500/30 bg-blue-50/60 shadow-md scale-[1.01]'
                  : isHidden
                  ? 'border-slate-200 bg-slate-50/70 opacity-60 hover:opacity-90'
                  : 'border-slate-200 bg-white hover:border-slate-300 hover:shadow-xs'
              }`}
            >
              {/* Left Side: Drag Handle, Number, Icon & Label */}
              <div className="flex items-center gap-3 min-w-0 flex-1">
                {/* Drag Handle */}
                <div
                  className="cursor-grab active:cursor-grabbing text-slate-400 hover:text-blue-600 p-1 -ml-1 rounded transition-colors"
                  title="Drag to reorder"
                >
                  <GripVertical className="w-4 h-4" />
                </div>

                {/* Section Index Badge */}
                <span className="w-5 h-5 rounded-full bg-slate-100 text-slate-600 text-[10px] font-mono font-bold flex items-center justify-center flex-shrink-0">
                  {index + 1}
                </span>

                {/* Section Icon & Title */}
                <div className="flex items-center gap-2.5 min-w-0">
                  <div
                    className={`w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 ${
                      isHidden ? 'bg-slate-100 text-slate-400' : 'bg-blue-50 text-blue-600'
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5" />
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span
                        className={`text-xs font-bold truncate ${
                          isHidden ? 'text-slate-500 line-through' : 'text-slate-900'
                        }`}
                      >
                        {def.label}
                      </span>
                      {count > 0 && !isHidden && (
                        <span className="text-[10px] font-semibold px-1.5 py-0.2 rounded-full bg-slate-100 text-slate-600">
                          {sectionId === 'summary'
                            ? 'Filled'
                            : `${count} ${count === 1 ? 'item' : 'items'}`}
                        </span>
                      )}
                      {count === 0 && !isHidden && (
                        <span className="text-[10px] text-amber-600 font-medium bg-amber-50 px-1.5 py-0.2 rounded">
                          Empty
                        </span>
                      )}
                    </div>
                    <p className="text-[11px] text-slate-400 truncate hidden sm:block">
                      {def.description}
                    </p>
                  </div>
                </div>
              </div>

              {/* Right Side: Actions (Up/Down arrows, Visibility toggle, Edit link) */}
              <div className="flex items-center gap-1 ml-2 flex-shrink-0">
                {/* Move Up */}
                <button
                  type="button"
                  onClick={() => moveSection(index, index - 1)}
                  disabled={index === 0}
                  className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 disabled:opacity-20 disabled:hover:bg-transparent rounded-lg transition-colors cursor-pointer"
                  title="Move section up"
                >
                  <ChevronUp className="w-3.5 h-3.5" />
                </button>

                {/* Move Down */}
                <button
                  type="button"
                  onClick={() => moveSection(index, index + 1)}
                  disabled={index === completeOrder.length - 1}
                  className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 disabled:opacity-20 disabled:hover:bg-transparent rounded-lg transition-colors cursor-pointer"
                  title="Move section down"
                >
                  <ChevronDown className="w-3.5 h-3.5" />
                </button>

                {/* Visibility Toggle */}
                <button
                  type="button"
                  id={`toggle-visibility-${sectionId}`}
                  onClick={() => toggleVisibility(sectionId)}
                  className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                    isHidden
                      ? 'text-amber-600 bg-amber-50 hover:bg-amber-100'
                      : 'text-slate-400 hover:text-slate-700 hover:bg-slate-100'
                  }`}
                  title={isHidden ? 'Click to show section on resume' : 'Click to hide section on resume'}
                >
                  {isHidden ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                </button>

                {/* Direct Jump to Form Edit */}
                <button
                  type="button"
                  onClick={() => onNavigateToTab(def.tabKey)}
                  className="hidden sm:flex items-center gap-1 px-2.5 py-1 text-xs font-semibold text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-lg transition-colors cursor-pointer ml-1"
                  title={`Edit ${def.label}`}
                >
                  <span>Edit</span>
                  <ArrowRight className="w-3 h-3" />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Footer Pro Tip */}
      <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-between text-xs text-slate-600">
        <div className="flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
          <span>Section changes apply instantly to the Live Preview & PDF export.</span>
        </div>
      </div>
    </div>
  );
};
