import React, { useState } from 'react';
import { EducationItem } from '../../types/resume';
import { GraduationCap, Plus, Trash2, GripVertical, ChevronUp, ChevronDown } from 'lucide-react';
import { SpellCheckedInput } from './SpellCheckedInput';

interface EducationFormProps {
  education: EducationItem[];
  onChange: (education: EducationItem[]) => void;
}

export const EducationForm: React.FC<EducationFormProps> = ({ education, onChange }) => {
  const [draggedIdx, setDraggedIdx] = useState<number | null>(null);
  const [dragOverIdx, setDragOverIdx] = useState<number | null>(null);

  const addEducation = () => {
    const newItem: EducationItem = {
      id: `edu-${Date.now()}`,
      school: '',
      degree: '',
      field: '',
      location: '',
      startDate: '',
      endDate: '',
      gpa: '',
      bullets: [],
    };
    onChange([...education, newItem]);
  };

  const updateEducation = (id: string, updated: Partial<EducationItem>) => {
    onChange(education.map((item) => (item.id === id ? { ...item, ...updated } : item)));
  };

  const removeEducation = (id: string) => {
    onChange(education.filter((item) => item.id !== id));
  };

  const moveEducation = (fromIndex: number, toIndex: number) => {
    if (fromIndex === toIndex || toIndex < 0 || toIndex >= education.length) return;
    const items = [...education];
    const [moved] = items.splice(fromIndex, 1);
    items.splice(toIndex, 0, moved);
    onChange(items);
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center border-b border-slate-200 pb-3">
        <div>
          <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
            <GraduationCap className="w-4 h-4 text-blue-600" /> Education & Credentials
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Drag to reorder entries. Degrees, academic institutions, graduation dates, and honors.
          </p>
        </div>
        <button
          id="add-education-btn"
          type="button"
          onClick={addEducation}
          className="flex items-center gap-1 px-3 py-1.5 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors shadow-xs cursor-pointer"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Add Education</span>
        </button>
      </div>

      {education.length === 0 ? (
        <div className="text-center py-6 border-2 border-dashed border-slate-200 rounded-xl bg-slate-50/50">
          <GraduationCap className="w-8 h-8 text-slate-300 mx-auto mb-1.5" />
          <p className="text-xs text-slate-500">No education entries yet.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {education.map((edu, idx) => {
            const isDragging = draggedIdx === idx;
            const isDragOver = dragOverIdx === idx;

            return (
              <div
                key={edu.id}
                id={`edu-card-${edu.id}`}
                draggable
                onDragStart={(e) => {
                  e.dataTransfer.setData('text/plain', idx.toString());
                  e.dataTransfer.effectAllowed = 'move';
                  setDraggedIdx(idx);
                }}
                onDragOver={(e) => {
                  e.preventDefault();
                  e.dataTransfer.dropEffect = 'move';
                  if (dragOverIdx !== idx) setDragOverIdx(idx);
                }}
                onDragLeave={() => {
                  if (dragOverIdx === idx) setDragOverIdx(null);
                }}
                onDrop={(e) => {
                  e.preventDefault();
                  if (draggedIdx !== null && draggedIdx !== idx) {
                    moveEducation(draggedIdx, idx);
                  }
                  setDraggedIdx(null);
                  setDragOverIdx(null);
                }}
                onDragEnd={() => {
                  setDraggedIdx(null);
                  setDragOverIdx(null);
                }}
                className={`p-4 bg-white border rounded-xl space-y-3 shadow-2xs transition-all ${
                  isDragging
                    ? 'opacity-40 scale-[0.99] border-dashed border-blue-400 bg-blue-50/50'
                    : isDragOver
                    ? 'border-blue-500 ring-2 ring-blue-500/30 bg-blue-50/40 shadow-sm'
                    : 'border-slate-200 hover:border-slate-300'
                }`}
              >
                <div className="flex justify-between items-center border-b border-slate-100 pb-2">
                  <div className="flex items-center gap-2">
                    <div
                      className="cursor-grab active:cursor-grabbing text-slate-400 hover:text-blue-600 p-0.5 -ml-1 rounded transition-colors"
                      title="Drag to reorder education"
                    >
                      <GripVertical className="w-4 h-4" />
                    </div>
                    <span className="text-xs font-bold text-slate-800">
                      {edu.degree || edu.school ? `${edu.degree || 'Degree'} at ${edu.school || 'School'}` : `Degree #${idx + 1}`}
                    </span>
                  </div>

                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => moveEducation(idx, idx - 1)}
                      disabled={idx === 0}
                      className="p-1 text-slate-400 hover:text-slate-700 disabled:opacity-20 rounded transition-colors cursor-pointer"
                      title="Move up"
                    >
                      <ChevronUp className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => moveEducation(idx, idx + 1)}
                      disabled={idx === education.length - 1}
                      className="p-1 text-slate-400 hover:text-slate-700 disabled:opacity-20 rounded transition-colors cursor-pointer"
                      title="Move down"
                    >
                      <ChevronDown className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => removeEducation(edu.id)}
                      className="text-xs text-rose-500 hover:text-rose-700 flex items-center gap-1 cursor-pointer ml-1 p-1"
                      title="Remove education"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">School / University</label>
                    <SpellCheckedInput
                      value={edu.school}
                      onChange={(val) => updateEducation(edu.id, { school: val })}
                      placeholder="University of California, Berkeley"
                      inputClassName="py-1.5"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Degree Type</label>
                    <SpellCheckedInput
                      value={edu.degree}
                      onChange={(val) => updateEducation(edu.id, { degree: val })}
                      placeholder="Bachelor of Science"
                      inputClassName="py-1.5"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Field of Study</label>
                    <SpellCheckedInput
                      value={edu.field}
                      onChange={(val) => updateEducation(edu.id, { field: val })}
                      placeholder="Computer Science & Engineering"
                      inputClassName="py-1.5"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Location</label>
                    <SpellCheckedInput
                      value={edu.location}
                      onChange={(val) => updateEducation(edu.id, { location: val })}
                      placeholder="Berkeley, CA"
                      inputClassName="py-1.5"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Graduation Date (or Range)</label>
                    <input
                      type="text"
                      value={edu.endDate}
                      onChange={(e) => updateEducation(edu.id, { endDate: e.target.value })}
                      placeholder="2017-05 (or 2013 - 2017)"
                      className="w-full px-3 py-1.5 text-xs rounded-lg border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none text-slate-800"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">GPA / Honors (Optional)</label>
                    <SpellCheckedInput
                      value={edu.gpa || ''}
                      onChange={(val) => updateEducation(edu.id, { gpa: val })}
                      placeholder="3.88 / 4.0 (Magna Cum Laude)"
                      inputClassName="py-1.5"
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

