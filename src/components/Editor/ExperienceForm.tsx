import React, { useState } from 'react';
import { ExperienceItem } from '../../types/resume';
import { Briefcase, Plus, Trash2, Sparkles, Loader2, Check, ChevronDown, ChevronUp, GripVertical } from 'lucide-react';
import { SpellCheckedInput } from './SpellCheckedInput';
import { SpellCheckedTextarea } from './SpellCheckedTextarea';

interface ExperienceFormProps {
  experience: ExperienceItem[];
  onChange: (experience: ExperienceItem[]) => void;
}

export const ExperienceForm: React.FC<ExperienceFormProps> = ({ experience, onChange }) => {
  const [expandedId, setExpandedId] = useState<string | null>(experience[0]?.id || null);
  const [draggedExpIdx, setDraggedExpIdx] = useState<number | null>(null);
  const [dragOverExpIdx, setDragOverExpIdx] = useState<number | null>(null);

  const [draggedBulletKey, setDraggedBulletKey] = useState<string | null>(null);
  const [dragOverBulletKey, setDragOverBulletKey] = useState<string | null>(null);

  const [optimizingBulletKey, setOptimizingBulletKey] = useState<string | null>(null);
  const [aiSuggestions, setAiSuggestions] = useState<{
    bulletKey: string;
    improved: string;
    alternatives: string[];
    keyChanges: string[];
  } | null>(null);
  const [isOptimizing, setIsOptimizing] = useState(false);
  const [bulletStyle, setBulletStyle] = useState('metric-focused');

  const addExperience = () => {
    const newId = `exp-${Date.now()}`;
    const newItem: ExperienceItem = {
      id: newId,
      company: '',
      role: '',
      location: '',
      startDate: '',
      endDate: '',
      current: true,
      bullets: ['Spearheaded [initiative] that increased [metric] by [X]%, resulting in [business outcome].'],
    };
    onChange([newItem, ...experience]);
    setExpandedId(newId);
  };

  const updateExperience = (id: string, updated: Partial<ExperienceItem>) => {
    onChange(
      experience.map((item) => (item.id === id ? { ...item, ...updated } : item))
    );
  };

  const removeExperience = (id: string) => {
    onChange(experience.filter((item) => item.id !== id));
  };

  const moveExperience = (fromIndex: number, toIndex: number) => {
    if (fromIndex === toIndex || toIndex < 0 || toIndex >= experience.length) return;
    const items = [...experience];
    const [moved] = items.splice(fromIndex, 1);
    items.splice(toIndex, 0, moved);
    onChange(items);
  };

  const addBullet = (expId: string) => {
    const item = experience.find((e) => e.id === expId);
    if (!item) return;
    const bullets = [...item.bullets, ''];
    updateExperience(expId, { bullets });
  };

  const updateBullet = (expId: string, index: number, value: string) => {
    const item = experience.find((e) => e.id === expId);
    if (!item) return;
    const bullets = [...item.bullets];
    bullets[index] = value;
    updateExperience(expId, { bullets });
  };

  const removeBullet = (expId: string, index: number) => {
    const item = experience.find((e) => e.id === expId);
    if (!item) return;
    const bullets = item.bullets.filter((_, i) => i !== index);
    updateExperience(expId, { bullets });
  };

  const moveBullet = (expId: string, fromIndex: number, toIndex: number) => {
    const item = experience.find((e) => e.id === expId);
    if (!item || fromIndex === toIndex || toIndex < 0 || toIndex >= item.bullets.length) return;
    const bullets = [...item.bullets];
    const [moved] = bullets.splice(fromIndex, 1);
    bullets.splice(toIndex, 0, moved);
    updateExperience(expId, { bullets });
  };

  const handleOptimizeBullet = async (exp: ExperienceItem, bulletIndex: number) => {
    const bullet = exp.bullets[bulletIndex];
    if (!bullet?.trim()) return;

    const bulletKey = `${exp.id}-${bulletIndex}`;
    setOptimizingBulletKey(bulletKey);
    setIsOptimizing(true);

    try {
      const res = await fetch('/api/ai/improve-bullet', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          bullet,
          role: exp.role,
          company: exp.company,
          style: bulletStyle,
        }),
      });

      if (!res.ok) throw new Error('Failed to optimize bullet.');
      const data = await res.json();
      setAiSuggestions({
        bulletKey,
        improved: data.improved,
        alternatives: data.alternatives || [],
        keyChanges: data.keyChanges || [],
      });
    } catch (err) {
      console.error(err);
    } finally {
      setIsOptimizing(false);
    }
  };

  const applyOptimizedBullet = (expId: string, bulletIndex: number, text: string) => {
    updateBullet(expId, bulletIndex, text);
    setAiSuggestions(null);
    setOptimizingBulletKey(null);
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center border-b border-slate-200 pb-3">
        <div>
          <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
            <Briefcase className="w-4 h-4 text-blue-600" /> Work Experience
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Drag to reorder positions or use arrow keys. Describe career history with quantified achievements.
          </p>
        </div>
        <button
          id="add-experience-btn"
          type="button"
          onClick={addExperience}
          className="flex items-center gap-1 px-3 py-1.5 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors shadow-xs cursor-pointer"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Add Role</span>
        </button>
      </div>

      {experience.length === 0 ? (
        <div className="text-center py-8 border-2 border-dashed border-slate-200 rounded-xl bg-slate-50/50">
          <Briefcase className="w-8 h-8 text-slate-300 mx-auto mb-2" />
          <p className="text-xs font-medium text-slate-600">No work experience added yet.</p>
          <button
            onClick={addExperience}
            className="mt-2 text-xs font-bold text-blue-600 hover:text-blue-800 cursor-pointer"
          >
            + Add your first position
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          {experience.map((exp, index) => {
            const isExpanded = expandedId === exp.id;
            const isDragging = draggedExpIdx === index;
            const isDragOver = dragOverExpIdx === index;

            return (
              <div
                key={exp.id}
                id={`exp-card-${exp.id}`}
                draggable
                onDragStart={(e) => {
                  e.dataTransfer.setData('text/plain', index.toString());
                  e.dataTransfer.effectAllowed = 'move';
                  setDraggedExpIdx(index);
                }}
                onDragOver={(e) => {
                  e.preventDefault();
                  e.dataTransfer.dropEffect = 'move';
                  if (dragOverExpIdx !== index) setDragOverExpIdx(index);
                }}
                onDragLeave={() => {
                  if (dragOverExpIdx === index) setDragOverExpIdx(null);
                }}
                onDrop={(e) => {
                  e.preventDefault();
                  if (draggedExpIdx !== null && draggedExpIdx !== index) {
                    moveExperience(draggedExpIdx, index);
                  }
                  setDraggedExpIdx(null);
                  setDragOverExpIdx(null);
                }}
                onDragEnd={() => {
                  setDraggedExpIdx(null);
                  setDragOverExpIdx(null);
                }}
                className={`border rounded-xl transition-all ${
                  isDragging
                    ? 'opacity-40 scale-[0.99] border-dashed border-blue-400 bg-blue-50/50'
                    : isDragOver
                    ? 'border-blue-500 ring-2 ring-blue-500/30 bg-blue-50/40 shadow-sm'
                    : isExpanded
                    ? 'border-blue-200 bg-white shadow-xs'
                    : 'border-slate-200 bg-slate-50/60 hover:bg-slate-50'
                }`}
              >
                {/* Header Row */}
                <div className="p-3 flex items-center justify-between gap-2 select-none">
                  {/* Left: Drag Handle, Number, Title */}
                  <div
                    onClick={() => setExpandedId(isExpanded ? null : exp.id)}
                    className="flex items-center gap-2.5 min-w-0 flex-1 cursor-pointer"
                  >
                    <div
                      className="cursor-grab active:cursor-grabbing text-slate-400 hover:text-blue-600 p-0.5 -ml-1 rounded transition-colors"
                      title="Drag to reorder position"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <GripVertical className="w-4 h-4" />
                    </div>

                    <span className="w-5 h-5 rounded-full bg-slate-200 text-slate-700 text-[11px] font-bold flex items-center justify-center flex-shrink-0">
                      {index + 1}
                    </span>
                    <div className="truncate">
                      <span className="text-xs font-bold text-slate-900">
                        {exp.role || 'New Role'}
                      </span>
                      <span className="text-xs text-slate-500 font-medium">
                        {' '}at {exp.company || 'Company'}
                      </span>
                    </div>
                  </div>

                  {/* Right: Date, Up/Down, Expand Chevron */}
                  <div className="flex items-center gap-1.5 flex-shrink-0">
                    <span className="text-[11px] font-medium text-slate-400 hidden sm:inline">
                      {exp.startDate || 'Date'} – {exp.current ? 'Present' : exp.endDate || 'End'}
                    </span>

                    {/* Move Up/Down buttons */}
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        moveExperience(index, index - 1);
                      }}
                      disabled={index === 0}
                      className="p-1 text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 disabled:opacity-20 rounded transition-colors cursor-pointer"
                      title="Move up"
                    >
                      <ChevronUp className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        moveExperience(index, index + 1);
                      }}
                      disabled={index === experience.length - 1}
                      className="p-1 text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 disabled:opacity-20 rounded transition-colors cursor-pointer"
                      title="Move down"
                    >
                      <ChevronDown className="w-3.5 h-3.5" />
                    </button>

                    <div
                      onClick={() => setExpandedId(isExpanded ? null : exp.id)}
                      className="p-1 text-slate-400 hover:text-slate-700 cursor-pointer"
                    >
                      {isExpanded ? (
                        <ChevronUp className="w-4 h-4" />
                      ) : (
                        <ChevronDown className="w-4 h-4" />
                      )}
                    </div>
                  </div>
                </div>

                {/* Expanded Form Fields */}
                {isExpanded && (
                  <div className="p-4 pt-1 border-t border-slate-100 space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1">Job Title</label>
                        <SpellCheckedInput
                          value={exp.role}
                          onChange={(val) => updateExperience(exp.id, { role: val })}
                          placeholder="Senior Staff Software Engineer"
                          inputClassName="py-1.5"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1">Company</label>
                        <SpellCheckedInput
                          value={exp.company}
                          onChange={(val) => updateExperience(exp.id, { company: val })}
                          placeholder="Stripe"
                          inputClassName="py-1.5"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1">Location</label>
                        <SpellCheckedInput
                          value={exp.location}
                          onChange={(val) => updateExperience(exp.id, { location: val })}
                          placeholder="San Francisco, CA / Remote"
                          inputClassName="py-1.5"
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <label className="block text-xs font-semibold text-slate-700 mb-1">Start Date</label>
                          <input
                            type="text"
                            value={exp.startDate}
                            onChange={(e) => updateExperience(exp.id, { startDate: e.target.value })}
                            placeholder="2021-04"
                            className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none text-slate-800"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-semibold text-slate-700 mb-1">
                            {exp.current ? 'Present' : 'End Date'}
                          </label>
                          <input
                            type="text"
                            disabled={exp.current}
                            value={exp.current ? 'Present' : exp.endDate}
                            onChange={(e) => updateExperience(exp.id, { endDate: e.target.value })}
                            placeholder="2023-08"
                            className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none disabled:bg-slate-100 text-slate-800"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        id={`current-${exp.id}`}
                        checked={exp.current}
                        onChange={(e) => updateExperience(exp.id, { current: e.target.checked })}
                        className="rounded border-slate-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                      />
                      <label htmlFor={`current-${exp.id}`} className="text-xs text-slate-600 font-medium cursor-pointer">
                        I currently work in this role
                      </label>
                    </div>

                    {/* Bullet Points Section */}
                    <div className="space-y-2 pt-2 border-t border-slate-100">
                      <div className="flex justify-between items-center">
                        <label className="text-xs font-bold text-slate-800">
                          Accomplishments & Impact Bullets (XYZ Formula)
                        </label>
                        <span className="text-[10px] text-slate-500">
                          Drag grip to reorder bullets
                        </span>
                      </div>

                      <div className="space-y-2">
                        {exp.bullets.map((bullet, bIdx) => {
                          const bulletKey = `${exp.id}-${bIdx}`;
                          const isCurOptimizing = isOptimizing && optimizingBulletKey === bulletKey;
                          const hasSuggestion = aiSuggestions?.bulletKey === bulletKey;
                          const isDraggingBullet = draggedBulletKey === bulletKey;
                          const isDragOverBullet = dragOverBulletKey === bulletKey;

                          return (
                            <div
                              key={bIdx}
                              draggable
                              onDragStart={(e) => {
                                e.stopPropagation();
                                e.dataTransfer.setData('text/plain', bIdx.toString());
                                e.dataTransfer.effectAllowed = 'move';
                                setDraggedBulletKey(bulletKey);
                              }}
                              onDragOver={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                if (dragOverBulletKey !== bulletKey) setDragOverBulletKey(bulletKey);
                              }}
                              onDragLeave={(e) => {
                                e.stopPropagation();
                                if (dragOverBulletKey === bulletKey) setDragOverBulletKey(null);
                              }}
                              onDrop={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                if (draggedBulletKey && draggedBulletKey.startsWith(exp.id)) {
                                  const fromIdx = parseInt(draggedBulletKey.split('-')[1], 10);
                                  moveBullet(exp.id, fromIdx, bIdx);
                                }
                                setDraggedBulletKey(null);
                                setDragOverBulletKey(null);
                              }}
                              onDragEnd={() => {
                                setDraggedBulletKey(null);
                                setDragOverBulletKey(null);
                              }}
                              className={`space-y-2 p-1 rounded-lg transition-all ${
                                isDraggingBullet
                                  ? 'opacity-40 bg-blue-50 border border-dashed border-blue-400'
                                  : isDragOverBullet
                                  ? 'bg-blue-50/70 border border-blue-400'
                                  : ''
                              }`}
                            >
                              <div className="flex items-start gap-1.5">
                                {/* Bullet Drag Handle */}
                                <div
                                  className="cursor-grab active:cursor-grabbing text-slate-400 hover:text-blue-600 mt-2 p-0.5 rounded"
                                  title="Drag to reorder bullet"
                                >
                                  <GripVertical className="w-3.5 h-3.5" />
                                </div>

                                <div className="flex-1 relative">
                                  <SpellCheckedTextarea
                                    rows={2}
                                    value={bullet}
                                    onChange={(val) => updateBullet(exp.id, bIdx, val)}
                                    placeholder="Accomplished [X], as measured by [Y], by doing [Z]..."
                                    textareaClassName="p-2 leading-relaxed"
                                  />
                                </div>

                                {/* Up / Down small buttons */}
                                <div className="flex flex-col gap-0.5 flex-shrink-0 pt-1">
                                  <button
                                    type="button"
                                    onClick={() => moveBullet(exp.id, bIdx, bIdx - 1)}
                                    disabled={bIdx === 0}
                                    className="p-1 text-slate-400 hover:text-slate-700 disabled:opacity-20 rounded"
                                    title="Move bullet up"
                                  >
                                    <ChevronUp className="w-3 h-3" />
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => moveBullet(exp.id, bIdx, bIdx + 1)}
                                    disabled={bIdx === exp.bullets.length - 1}
                                    className="p-1 text-slate-400 hover:text-slate-700 disabled:opacity-20 rounded"
                                    title="Move bullet down"
                                  >
                                    <ChevronDown className="w-3 h-3" />
                                  </button>
                                </div>

                                {/* AI Optimize Bullet Button */}
                                <button
                                  type="button"
                                  onClick={() => handleOptimizeBullet(exp, bIdx)}
                                  disabled={isCurOptimizing || !bullet.trim()}
                                  title="Rewrite with Google X-Y-Z formula using AI"
                                  className="p-2 bg-indigo-50 text-indigo-700 hover:bg-indigo-100 border border-indigo-200 rounded-lg transition-colors cursor-pointer flex-shrink-0 disabled:opacity-40"
                                >
                                  {isCurOptimizing ? (
                                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                                  ) : (
                                    <Sparkles className="w-3.5 h-3.5" />
                                  )}
                                </button>

                                {/* Delete Bullet Button */}
                                <button
                                  type="button"
                                  onClick={() => removeBullet(exp.id, bIdx)}
                                  className="p-2 text-slate-400 hover:text-rose-600 rounded-lg transition-colors cursor-pointer flex-shrink-0"
                                  title="Delete bullet"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </div>

                              {/* AI Suggestion Box for this bullet */}
                              {hasSuggestion && aiSuggestions && (
                                <div className="ml-6 p-3 bg-indigo-50/80 border border-indigo-200 rounded-lg space-y-2 text-xs">
                                  <div className="flex justify-between items-center">
                                    <span className="font-bold text-indigo-900 text-[11px] flex items-center gap-1">
                                      <Sparkles className="w-3 h-3 text-indigo-600" /> AI Quantified Bullet
                                    </span>
                                    <button
                                      onClick={() => setAiSuggestions(null)}
                                      className="text-slate-400 hover:text-slate-700 text-xs cursor-pointer"
                                    >
                                      Dismiss
                                    </button>
                                  </div>

                                  <div className="bg-white p-2 rounded border border-indigo-100 flex justify-between items-start gap-2">
                                    <p className="text-slate-800 text-xs leading-normal flex-1">{aiSuggestions.improved}</p>
                                    <button
                                      onClick={() => applyOptimizedBullet(exp.id, bIdx, aiSuggestions.improved)}
                                      className="px-2 py-0.5 bg-indigo-600 text-white font-bold rounded text-[11px] hover:bg-indigo-700 cursor-pointer flex items-center gap-1 flex-shrink-0"
                                    >
                                      <Check className="w-3 h-3" /> Apply
                                    </button>
                                  </div>

                                  {aiSuggestions.alternatives?.map((alt, aIdx) => (
                                    <div key={aIdx} className="bg-white/80 p-2 rounded border border-slate-200 flex justify-between items-start gap-2">
                                      <p className="text-slate-700 text-xs leading-normal flex-1">{alt}</p>
                                      <button
                                        onClick={() => applyOptimizedBullet(exp.id, bIdx, alt)}
                                        className="text-[11px] font-semibold text-indigo-600 hover:text-indigo-800 px-1.5 py-0.5 rounded cursor-pointer"
                                      >
                                        Use
                                      </button>
                                    </div>
                                  ))}
                                </div>
                              )}
                            </div>
                          );
                        })}

                        <button
                          type="button"
                          onClick={() => addBullet(exp.id)}
                          className="text-xs font-semibold text-blue-600 hover:text-blue-800 flex items-center gap-1 pt-1 cursor-pointer"
                        >
                          <Plus className="w-3.5 h-3.5" /> Add another accomplishment bullet
                        </button>
                      </div>
                    </div>

                    {/* Delete Role Button */}
                    <div className="flex justify-end pt-2 border-t border-slate-100">
                      <button
                        type="button"
                        onClick={() => removeExperience(exp.id)}
                        className="text-xs font-semibold text-rose-600 hover:text-rose-800 flex items-center gap-1 cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" /> Remove this position
                      </button>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

