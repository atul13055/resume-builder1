import React, { useState, useEffect, useRef, useMemo } from 'react';
import { SkillItem } from '../../types/resume';
import {
  Tag,
  Plus,
  Trash2,
  Sparkles,
  GripVertical,
  Briefcase,
  ChevronDown,
  Check,
  Zap,
  Search,
  CheckCircle2,
  Layers,
} from 'lucide-react';
import {
  ROLE_SKILL_PROFILES,
  RoleSkillProfile,
  RoleSkill,
  detectRoleProfile,
  getSkillAutoSuggestions,
} from '../../data/roleSkillsData';

interface SkillsFormProps {
  skills: SkillItem[];
  onChange: (skills: SkillItem[]) => void;
  userTitle?: string;
  experienceRoles?: string[];
}

export const SkillsForm: React.FC<SkillsFormProps> = ({
  skills,
  onChange,
  userTitle = '',
  experienceRoles = [],
}) => {
  // Detect role based on title & experience
  const detectedProfile = useMemo(
    () => detectRoleProfile(userTitle, experienceRoles),
    [userTitle, experienceRoles]
  );

  const [selectedRoleId, setSelectedRoleId] = useState<string>(detectedProfile.id);

  // Sync if detectedProfile changes and user hasn't explicitly customized yet
  useEffect(() => {
    setSelectedRoleId(detectedProfile.id);
  }, [detectedProfile.id]);

  const activeRoleProfile: RoleSkillProfile = useMemo(() => {
    return ROLE_SKILL_PROFILES.find((p) => p.id === selectedRoleId) || detectedProfile;
  }, [selectedRoleId, detectedProfile]);

  const [newSkillName, setNewSkillName] = useState('');
  const [newSkillCategory, setNewSkillCategory] = useState<
    'Technical' | 'Soft Skills' | 'Tools & Platforms' | 'Languages' | 'Other'
  >('Technical');

  const [isInputFocused, setIsInputFocused] = useState(false);
  const [selectedSuggestionIdx, setSelectedSuggestionIdx] = useState<number>(-1);
  const [activeCategoryFilter, setActiveCategoryFilter] = useState<string>('all');

  const [draggedSkillIdx, setDraggedSkillIdx] = useState<number | null>(null);
  const [dragOverSkillIdx, setDragOverSkillIdx] = useState<number | null>(null);

  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Get dynamic auto-suggestions based on current input and active role
  const suggestions: RoleSkill[] = useMemo(() => {
    return getSkillAutoSuggestions({
      query: newSkillName,
      roleProfileId: activeRoleProfile.id,
      existingSkillNames: skills.map((s) => s.name),
      limit: 7,
    });
  }, [newSkillName, activeRoleProfile.id, skills]);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsInputFocused(false);
        setSelectedSuggestionIdx(-1);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const addSkill = (name?: string, category?: SkillItem['category']) => {
    const skillToAdd = (name || newSkillName).trim();
    if (!skillToAdd) return;

    // Prevent duplicate entries
    if (skills.some((s) => s.name.toLowerCase() === skillToAdd.toLowerCase())) {
      setNewSkillName('');
      setSelectedSuggestionIdx(-1);
      return;
    }

    // Auto-detect best category if not provided
    let finalCategory = category || newSkillCategory;
    if (!category) {
      const match = activeRoleProfile.skills.find(
        (s) => s.name.toLowerCase() === skillToAdd.toLowerCase()
      );
      if (match) {
        finalCategory = match.category;
      }
    }

    const newItem: SkillItem = {
      id: `skill-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      name: skillToAdd,
      category: finalCategory || 'Technical',
      level: 'Advanced',
    };

    onChange([...skills, newItem]);
    setNewSkillName('');
    setSelectedSuggestionIdx(-1);
    inputRef.current?.focus();
  };

  const addMultipleSkills = (skillsToAdd: RoleSkill[]) => {
    const existingSet = new Set(skills.map((s) => s.name.toLowerCase()));
    const newItems: SkillItem[] = [];

    skillsToAdd.forEach((sk) => {
      if (!existingSet.has(sk.name.toLowerCase())) {
        newItems.push({
          id: `skill-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
          name: sk.name,
          category: sk.category,
          level: 'Advanced',
        });
        existingSet.add(sk.name.toLowerCase());
      }
    });

    if (newItems.length > 0) {
      onChange([...skills, ...newItems]);
    }
  };

  const removeSkill = (id: string) => {
    onChange(skills.filter((s) => s.id !== id));
  };

  const updateSkill = (id: string, updated: Partial<SkillItem>) => {
    onChange(skills.map((s) => (s.id === id ? { ...s, ...updated } : s)));
  };

  const moveSkill = (fromIndex: number, toIndex: number) => {
    if (fromIndex === toIndex || toIndex < 0 || toIndex >= skills.length) return;
    const items = [...skills];
    const [moved] = items.splice(fromIndex, 1);
    items.splice(toIndex, 0, moved);
    onChange(items);
  };

  // Keyboard navigation for suggestions
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (suggestions.length > 0 && isInputFocused) {
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSelectedSuggestionIdx((prev) => (prev < suggestions.length - 1 ? prev + 1 : 0));
        return;
      }
      if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelectedSuggestionIdx((prev) => (prev > 0 ? prev - 1 : suggestions.length - 1));
        return;
      }
      if (e.key === 'Enter') {
        e.preventDefault();
        if (selectedSuggestionIdx >= 0 && selectedSuggestionIdx < suggestions.length) {
          const item = suggestions[selectedSuggestionIdx];
          addSkill(item.name, item.category);
        } else {
          addSkill();
        }
        return;
      }
      if (e.key === 'Escape') {
        setIsInputFocused(false);
        setSelectedSuggestionIdx(-1);
        return;
      }
    } else if (e.key === 'Enter') {
      e.preventDefault();
      addSkill();
    }
  };

  // Unadded role-specific skills for recommendation chips
  const unaddedRoleSkills = useMemo(() => {
    const existingSet = new Set(skills.map((s) => s.name.toLowerCase()));
    return activeRoleProfile.skills.filter((s) => !existingSet.has(s.name.toLowerCase()));
  }, [activeRoleProfile, skills]);

  const filteredRecommendedSkills = useMemo(() => {
    if (activeCategoryFilter === 'all') return unaddedRoleSkills;
    return unaddedRoleSkills.filter((s) => s.category.toLowerCase().includes(activeCategoryFilter.toLowerCase()));
  }, [unaddedRoleSkills, activeCategoryFilter]);

  const getCategoryBadgeClass = (category?: string) => {
    switch (category) {
      case 'Languages':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'Tools & Platforms':
        return 'bg-purple-50 text-purple-700 border-purple-200';
      case 'Soft Skills':
        return 'bg-amber-50 text-amber-800 border-amber-200';
      case 'Technical':
      default:
        return 'bg-blue-50 text-blue-700 border-blue-200';
    }
  };

  return (
    <div className="space-y-4">
      {/* Header & Role Detection Bar */}
      <div className="border-b border-slate-200 pb-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Tag className="w-4 h-4 text-blue-600" /> Skills & Technical Proficiencies
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Drag pills to prioritize. Includes intelligent role-based auto-suggestions (8–20 optimal).
            </p>
          </div>

          {/* Role Profile Switcher */}
          <div className="flex items-center gap-1.5 self-start sm:self-auto bg-slate-100/90 p-1 rounded-lg border border-slate-200">
            <Briefcase className="w-3.5 h-3.5 text-slate-500 ml-1 flex-shrink-0" />
            <span className="text-[11px] font-semibold text-slate-600 hidden sm:inline">Role Preset:</span>
            <div className="relative">
              <select
                id="role-preset-select"
                value={selectedRoleId}
                onChange={(e) => setSelectedRoleId(e.target.value)}
                className="text-xs font-semibold text-blue-700 bg-white border border-slate-200 hover:border-blue-400 rounded-md px-2 py-1 pr-6 outline-none cursor-pointer shadow-2xs transition-colors"
                title="Select target profession for tailored skill suggestions"
              >
                {ROLE_SKILL_PROFILES.map((profile) => (
                  <option key={profile.id} value={profile.id}>
                    {profile.name}
                  </option>
                ))}
              </select>
              <ChevronDown className="w-3 h-3 text-slate-400 absolute right-1.5 top-2 pointer-events-none" />
            </div>
          </div>
        </div>

        {/* Role contextual badge */}
        <div className="mt-2 flex items-center gap-1.5 text-[11px] text-slate-500 bg-blue-50/60 border border-blue-100 px-2.5 py-1 rounded-md">
          <Zap className="w-3 h-3 text-blue-600 flex-shrink-0" />
          <span>
            Target Role: <strong className="text-slate-800">{activeRoleProfile.name}</strong>
            {userTitle && detectedProfile.id === selectedRoleId && (
              <span className="text-slate-400 ml-1 font-normal">(Auto-matched from "{userTitle}")</span>
            )}
          </span>
        </div>
      </div>

      {/* Add Skill Input with Auto-Suggestion Popover */}
      <div ref={containerRef} className="relative space-y-1">
        <label className="block text-xs font-semibold text-slate-700">Add New Skill</label>
        
        <div className="flex gap-2 flex-wrap sm:flex-nowrap items-start">
          <div className="relative flex-1">
            <div className="relative flex items-center">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 pointer-events-none" />
              <input
                ref={inputRef}
                id="skill-auto-suggest-input"
                type="text"
                value={newSkillName}
                onChange={(e) => {
                  setNewSkillName(e.target.value);
                  setSelectedSuggestionIdx(-1);
                  if (!isInputFocused) setIsInputFocused(true);
                }}
                onFocus={() => setIsInputFocused(true)}
                onKeyDown={handleKeyDown}
                placeholder={`Type or search ${activeRoleProfile.name} skills...`}
                className="w-full pl-8.5 pr-3 py-2 text-xs rounded-lg border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none text-slate-800 bg-white shadow-2xs transition-all"
                autoComplete="off"
              />
            </div>

            {/* Auto-suggestions Dropdown */}
            {isInputFocused && suggestions.length > 0 && (
              <div
                id="skills-suggestions-dropdown"
                className="absolute z-30 left-0 right-0 mt-1 bg-white border border-slate-200 rounded-xl shadow-lg overflow-hidden animate-in fade-in slide-in-from-top-1 duration-150"
              >
                <div className="px-3 py-1.5 bg-slate-50 border-b border-slate-100 flex items-center justify-between text-[10px] text-slate-500 font-semibold">
                  <span className="flex items-center gap-1">
                    <Sparkles className="w-3 h-3 text-amber-500" />
                    {newSkillName.trim()
                      ? `Suggested matching skills`
                      : `Top in-demand for ${activeRoleProfile.name}`}
                  </span>
                  <span className="text-slate-400">↑↓ to navigate • Enter to add</span>
                </div>

                <div className="max-h-56 overflow-y-auto divide-y divide-slate-50 p-1">
                  {suggestions.map((item, idx) => {
                    const isSelected = selectedSuggestionIdx === idx;
                    const isCurrentRoleSkill = activeRoleProfile.skills.some(
                      (s) => s.name.toLowerCase() === item.name.toLowerCase()
                    );

                    return (
                      <button
                        key={item.name}
                        type="button"
                        onMouseEnter={() => setSelectedSuggestionIdx(idx)}
                        onClick={() => {
                          addSkill(item.name, item.category);
                        }}
                        className={`w-full px-3 py-2 text-left rounded-lg text-xs flex items-center justify-between gap-2 transition-colors cursor-pointer ${
                          isSelected
                            ? 'bg-blue-50 text-blue-900 font-semibold'
                            : 'hover:bg-slate-50 text-slate-800'
                        }`}
                      >
                        <div className="flex items-center gap-2 min-w-0">
                          <Plus className={`w-3.5 h-3.5 flex-shrink-0 ${isSelected ? 'text-blue-600' : 'text-slate-400'}`} />
                          <span className="truncate">{item.name}</span>
                          {isCurrentRoleSkill && (
                            <span className="text-[9px] font-bold px-1.5 py-0.2 bg-blue-100/80 text-blue-700 rounded">
                              Recommended
                            </span>
                          )}
                        </div>

                        <span
                          className={`text-[10px] font-medium px-2 py-0.5 rounded border ${getCategoryBadgeClass(
                            item.category
                          )}`}
                        >
                          {item.category}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          <select
            value={newSkillCategory}
            onChange={(e) => setNewSkillCategory(e.target.value as any)}
            className="px-2.5 py-2 text-xs rounded-lg border border-slate-200 bg-white text-slate-700 outline-none hover:border-slate-300 transition-colors cursor-pointer"
            title="Skill Category"
          >
            <option value="Technical">Technical</option>
            <option value="Tools & Platforms">Tools & Platforms</option>
            <option value="Soft Skills">Soft Skills</option>
            <option value="Languages">Languages</option>
            <option value="Other">Other</option>
          </select>

          <button
            type="button"
            onClick={() => addSkill()}
            className="px-3.5 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors flex items-center gap-1 cursor-pointer flex-shrink-0 shadow-2xs"
          >
            <Plus className="w-3.5 h-3.5" /> Add
          </button>
        </div>
      </div>

      {/* Role-Based Recommendation Hub */}
      <div className="space-y-2 bg-gradient-to-b from-slate-50 to-white p-3.5 rounded-xl border border-slate-200/90 shadow-2xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1.5 pb-2 border-b border-slate-200/60">
          <div className="flex items-center gap-1.5">
            <Sparkles className="w-4 h-4 text-amber-500 flex-shrink-0" />
            <span className="text-xs font-bold text-slate-800">
              Recommended Skills for {activeRoleProfile.name}
            </span>
            <span className="text-[10px] text-slate-400 font-medium">
              ({unaddedRoleSkills.length} available)
            </span>
          </div>

          {unaddedRoleSkills.length > 0 && (
            <button
              type="button"
              onClick={() => addMultipleSkills(unaddedRoleSkills.slice(0, 8))}
              className="text-[11px] font-semibold text-blue-600 hover:text-blue-800 bg-blue-50/80 hover:bg-blue-100/80 px-2.5 py-1 rounded-lg border border-blue-200 transition-colors flex items-center gap-1 cursor-pointer self-start sm:self-auto"
            >
              <Zap className="w-3 h-3 text-blue-600" />
              + Add Top 8 Recommended
            </button>
          )}
        </div>

        {/* Category Filters */}
        <div className="flex items-center gap-1 overflow-x-auto pb-1 scrollbar-none text-[11px]">
          {['all', 'technical', 'tools', 'soft skills', 'languages'].map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setActiveCategoryFilter(cat)}
              className={`px-2 py-0.5 rounded-md capitalize font-medium transition-colors cursor-pointer ${
                activeCategoryFilter === cat
                  ? 'bg-slate-800 text-white shadow-2xs'
                  : 'text-slate-600 hover:bg-slate-200/70'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Skill Suggestion Pills */}
        {filteredRecommendedSkills.length === 0 ? (
          <div className="flex items-center gap-2 text-xs text-emerald-700 bg-emerald-50/70 border border-emerald-200 px-3 py-2 rounded-lg">
            <CheckCircle2 className="w-4 h-4 flex-shrink-0 text-emerald-600" />
            <span>All recommended skills in this category have been added to your resume!</span>
          </div>
        ) : (
          <div className="flex flex-wrap gap-1.5 pt-1">
            {filteredRecommendedSkills.slice(0, 14).map((skill) => (
              <button
                key={skill.name}
                type="button"
                onClick={() => addSkill(skill.name, skill.category)}
                className={`text-[11px] font-medium px-2.5 py-1 rounded-lg border transition-all flex items-center gap-1.5 cursor-pointer shadow-2xs hover:scale-[1.02] active:scale-95 ${getCategoryBadgeClass(
                  skill.category
                )}`}
                title={`Click to add "${skill.name}" (${skill.category})`}
              >
                <Plus className="w-3 h-3 opacity-60" />
                <span>{skill.name}</span>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Active Skills List with Drag and Drop Reordering */}
      <div className="space-y-2 pt-1">
        <div className="flex justify-between items-center text-xs text-slate-600">
          <div className="flex items-center gap-1.5">
            <Layers className="w-3.5 h-3.5 text-slate-500" />
            <span className="font-bold text-slate-800">Current Resume Skills ({skills.length}):</span>
          </div>
          <span className="text-[11px] text-slate-400">Drag to reorder • Click text to edit</span>
        </div>

        {skills.length === 0 ? (
          <div className="border border-dashed border-slate-200 rounded-xl p-6 text-center text-slate-400 space-y-1">
            <Tag className="w-6 h-6 mx-auto text-slate-300" />
            <p className="text-xs font-semibold text-slate-500">No skills added yet.</p>
            <p className="text-[11px] text-slate-400">
              Type in the box above or click any of the role recommendations to get started.
            </p>
          </div>
        ) : (
          <div className="flex flex-wrap gap-2">
            {skills.map((skill, sIdx) => {
              const isDragging = draggedSkillIdx === sIdx;
              const isDragOver = dragOverSkillIdx === sIdx;

              return (
                <div
                  key={skill.id}
                  draggable
                  onDragStart={(e) => {
                    e.dataTransfer.setData('text/plain', sIdx.toString());
                    e.dataTransfer.effectAllowed = 'move';
                    setDraggedSkillIdx(sIdx);
                  }}
                  onDragOver={(e) => {
                    e.preventDefault();
                    e.dataTransfer.dropEffect = 'move';
                    if (dragOverSkillIdx !== sIdx) setDragOverSkillIdx(sIdx);
                  }}
                  onDragLeave={() => {
                    if (dragOverSkillIdx === sIdx) setDragOverSkillIdx(null);
                  }}
                  onDrop={(e) => {
                    e.preventDefault();
                    if (draggedSkillIdx !== null && draggedSkillIdx !== sIdx) {
                      moveSkill(draggedSkillIdx, sIdx);
                    }
                    setDraggedSkillIdx(null);
                    setDragOverSkillIdx(null);
                  }}
                  onDragEnd={() => {
                    setDraggedSkillIdx(null);
                    setDragOverSkillIdx(null);
                  }}
                  className={`group flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-white border text-slate-800 text-xs shadow-2xs transition-all ${
                    isDragging
                      ? 'opacity-40 scale-95 border-dashed border-blue-400 bg-blue-50/50'
                      : isDragOver
                      ? 'border-blue-500 ring-2 ring-blue-500/30 bg-blue-50/40 shadow-xs'
                      : 'border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <div
                    className="cursor-grab active:cursor-grabbing text-slate-300 group-hover:text-slate-500 p-0.5 -ml-0.5 rounded transition-colors"
                    title="Drag to reorder skill"
                  >
                    <GripVertical className="w-3 h-3" />
                  </div>

                  <input
                    type="text"
                    value={skill.name}
                    onChange={(e) => updateSkill(skill.id, { name: e.target.value })}
                    className="bg-transparent outline-none text-xs font-semibold text-slate-800 min-w-[60px]"
                  />

                  <select
                    value={skill.category || 'Technical'}
                    onChange={(e) => updateSkill(skill.id, { category: e.target.value as any })}
                    className="text-[10px] text-slate-500 hover:text-slate-700 bg-slate-50 border border-slate-200 px-1 py-0.5 rounded outline-none cursor-pointer"
                  >
                    <option value="Technical">Tech</option>
                    <option value="Tools & Platforms">Tools</option>
                    <option value="Languages">Lang</option>
                    <option value="Soft Skills">Soft</option>
                    <option value="Other">Other</option>
                  </select>

                  <button
                    type="button"
                    onClick={() => removeSkill(skill.id)}
                    className="text-slate-400 hover:text-rose-600 p-0.5 rounded transition-colors cursor-pointer ml-0.5"
                    title="Remove skill"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
