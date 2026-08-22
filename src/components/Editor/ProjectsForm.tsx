import React, { useState } from 'react';
import { ProjectItem } from '../../types/resume';
import { FolderGit2, Plus, Trash2, GripVertical, ChevronUp, ChevronDown } from 'lucide-react';
import { SpellCheckedInput } from './SpellCheckedInput';

interface ProjectsFormProps {
  projects: ProjectItem[];
  onChange: (projects: ProjectItem[]) => void;
}

export const ProjectsForm: React.FC<ProjectsFormProps> = ({ projects, onChange }) => {
  const [draggedProjIdx, setDraggedProjIdx] = useState<number | null>(null);
  const [dragOverProjIdx, setDragOverProjIdx] = useState<number | null>(null);

  const [draggedBulletKey, setDraggedBulletKey] = useState<string | null>(null);
  const [dragOverBulletKey, setDragOverBulletKey] = useState<string | null>(null);

  const addProject = () => {
    const newItem: ProjectItem = {
      id: `proj-${Date.now()}`,
      name: '',
      role: '',
      link: '',
      github: '',
      techStack: ['TypeScript', 'React'],
      bullets: ['Developed [key feature] that handled [X] requests/sec with [Y]% reliability.'],
    };
    onChange([...projects, newItem]);
  };

  const updateProject = (id: string, updated: Partial<ProjectItem>) => {
    onChange(projects.map((p) => (p.id === id ? { ...p, ...updated } : p)));
  };

  const removeProject = (id: string) => {
    onChange(projects.filter((p) => p.id !== id));
  };

  const moveProject = (fromIndex: number, toIndex: number) => {
    if (fromIndex === toIndex || toIndex < 0 || toIndex >= projects.length) return;
    const items = [...projects];
    const [moved] = items.splice(fromIndex, 1);
    items.splice(toIndex, 0, moved);
    onChange(items);
  };

  const updateBullet = (projId: string, bIdx: number, val: string) => {
    const proj = projects.find((p) => p.id === projId);
    if (!proj) return;
    const bullets = [...proj.bullets];
    bullets[bIdx] = val;
    updateProject(projId, { bullets });
  };

  const addBullet = (projId: string) => {
    const proj = projects.find((p) => p.id === projId);
    if (!proj) return;
    updateProject(projId, { bullets: [...proj.bullets, ''] });
  };

  const removeBullet = (projId: string, bIdx: number) => {
    const proj = projects.find((p) => p.id === projId);
    if (!proj) return;
    updateProject(projId, { bullets: proj.bullets.filter((_, i) => i !== bIdx) });
  };

  const moveBullet = (projId: string, fromIndex: number, toIndex: number) => {
    const proj = projects.find((p) => p.id === projId);
    if (!proj || fromIndex === toIndex || toIndex < 0 || toIndex >= proj.bullets.length) return;
    const bullets = [...proj.bullets];
    const [moved] = bullets.splice(fromIndex, 1);
    bullets.splice(toIndex, 0, moved);
    updateProject(projId, { bullets });
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center border-b border-slate-200 pb-3">
        <div>
          <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
            <FolderGit2 className="w-4 h-4 text-blue-600" /> Key Projects & Portfolio
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Drag to reorder projects. Highlight impactful open-source contributions, web applications, or tools.
          </p>
        </div>
        <button
          id="add-project-btn"
          type="button"
          onClick={addProject}
          className="flex items-center gap-1 px-3 py-1.5 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors shadow-xs cursor-pointer"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Add Project</span>
        </button>
      </div>

      {projects.length === 0 ? (
        <div className="text-center py-6 border-2 border-dashed border-slate-200 rounded-xl bg-slate-50/50">
          <FolderGit2 className="w-8 h-8 text-slate-300 mx-auto mb-1.5" />
          <p className="text-xs text-slate-500">No projects added yet.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {projects.map((proj, idx) => {
            const isDragging = draggedProjIdx === idx;
            const isDragOver = dragOverProjIdx === idx;

            return (
              <div
                key={proj.id}
                id={`proj-card-${proj.id}`}
                draggable
                onDragStart={(e) => {
                  e.dataTransfer.setData('text/plain', idx.toString());
                  e.dataTransfer.effectAllowed = 'move';
                  setDraggedProjIdx(idx);
                }}
                onDragOver={(e) => {
                  e.preventDefault();
                  e.dataTransfer.dropEffect = 'move';
                  if (dragOverProjIdx !== idx) setDragOverProjIdx(idx);
                }}
                onDragLeave={() => {
                  if (dragOverProjIdx === idx) setDragOverProjIdx(null);
                }}
                onDrop={(e) => {
                  e.preventDefault();
                  if (draggedProjIdx !== null && draggedProjIdx !== idx) {
                    moveProject(draggedProjIdx, idx);
                  }
                  setDraggedProjIdx(null);
                  setDragOverProjIdx(null);
                }}
                onDragEnd={() => {
                  setDraggedProjIdx(null);
                  setDragOverProjIdx(null);
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
                      title="Drag to reorder project"
                    >
                      <GripVertical className="w-4 h-4" />
                    </div>
                    <span className="text-xs font-bold text-slate-800">
                      {proj.name ? proj.name : `Project #${idx + 1}`}
                    </span>
                  </div>

                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => moveProject(idx, idx - 1)}
                      disabled={idx === 0}
                      className="p-1 text-slate-400 hover:text-slate-700 disabled:opacity-20 rounded transition-colors cursor-pointer"
                      title="Move up"
                    >
                      <ChevronUp className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => moveProject(idx, idx + 1)}
                      disabled={idx === projects.length - 1}
                      className="p-1 text-slate-400 hover:text-slate-700 disabled:opacity-20 rounded transition-colors cursor-pointer"
                      title="Move down"
                    >
                      <ChevronDown className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => removeProject(proj.id)}
                      className="text-xs text-rose-500 hover:text-rose-700 flex items-center gap-1 cursor-pointer ml-1 p-1"
                      title="Remove project"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Project Name</label>
                    <SpellCheckedInput
                      value={proj.name}
                      onChange={(val) => updateProject(proj.id, { name: val })}
                      placeholder="HyperScale Queue Engine"
                      inputClassName="py-1.5"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Live URL / Demo</label>
                    <input
                      type="text"
                      value={proj.link || ''}
                      onChange={(e) => updateProject(proj.id, { link: e.target.value })}
                      placeholder="https://myproject.dev"
                      className="w-full px-3 py-1.5 text-xs rounded-lg border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none text-slate-800"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Tech Stack (comma separated)
                    </label>
                    <input
                      type="text"
                      value={proj.techStack?.join(', ') || ''}
                      onChange={(e) =>
                        updateProject(proj.id, {
                          techStack: e.target.value.split(',').map((t) => t.trim()).filter(Boolean),
                        })
                      }
                      placeholder="Go, Redis, Docker, gRPC, TypeScript"
                      className="w-full px-3 py-1.5 text-xs rounded-lg border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none text-slate-800"
                    />
                  </div>
                </div>

                {/* Project Bullets */}
                <div className="space-y-2 pt-1 border-t border-slate-100">
                  <label className="block text-xs font-semibold text-slate-700">Project Highlights & Impact</label>
                  {proj.bullets.map((bullet, bIdx) => {
                    const bulletKey = `${proj.id}-${bIdx}`;
                    const isDraggingB = draggedBulletKey === bulletKey;
                    const isDragOverB = dragOverBulletKey === bulletKey;

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
                          if (draggedBulletKey && draggedBulletKey.startsWith(proj.id)) {
                            const fromIdx = parseInt(draggedBulletKey.split('-')[1], 10);
                            moveBullet(proj.id, fromIdx, bIdx);
                          }
                          setDraggedBulletKey(null);
                          setDragOverBulletKey(null);
                        }}
                        onDragEnd={() => {
                          setDraggedBulletKey(null);
                          setDragOverBulletKey(null);
                        }}
                        className={`flex items-center gap-1.5 p-1 rounded-lg transition-all ${
                          isDraggingB
                            ? 'opacity-40 bg-blue-50 border border-dashed border-blue-400'
                            : isDragOverB
                            ? 'bg-blue-50/70 border border-blue-400'
                            : ''
                        }`}
                      >
                        <div
                          className="cursor-grab active:cursor-grabbing text-slate-400 hover:text-blue-600 p-0.5 rounded"
                          title="Drag to reorder bullet"
                        >
                          <GripVertical className="w-3.5 h-3.5" />
                        </div>
                        <div className="flex-1">
                          <SpellCheckedInput
                            value={bullet}
                            onChange={(val) => updateBullet(proj.id, bIdx, val)}
                            placeholder="Engineered [X] resulting in [Y]% throughput gain..."
                            inputClassName="py-1.5"
                          />
                        </div>
                        <div className="flex flex-col gap-0.5">
                          <button
                            type="button"
                            onClick={() => moveBullet(proj.id, bIdx, bIdx - 1)}
                            disabled={bIdx === 0}
                            className="p-0.5 text-slate-400 hover:text-slate-700 disabled:opacity-20 rounded"
                            title="Move up"
                          >
                            <ChevronUp className="w-3 h-3" />
                          </button>
                          <button
                            type="button"
                            onClick={() => moveBullet(proj.id, bIdx, bIdx + 1)}
                            disabled={bIdx === proj.bullets.length - 1}
                            className="p-0.5 text-slate-400 hover:text-slate-700 disabled:opacity-20 rounded"
                            title="Move down"
                          >
                            <ChevronDown className="w-3 h-3" />
                          </button>
                        </div>
                        <button
                          type="button"
                          onClick={() => removeBullet(proj.id, bIdx)}
                          className="p-1.5 text-slate-400 hover:text-rose-600 cursor-pointer"
                          title="Remove bullet"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    );
                  })}

                  <button
                    type="button"
                    onClick={() => addBullet(proj.id)}
                    className="text-xs font-semibold text-blue-600 hover:text-blue-800 flex items-center gap-1 cursor-pointer pt-1"
                  >
                    <Plus className="w-3.5 h-3.5" /> Add Project Bullet
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

