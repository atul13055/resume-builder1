import React, { useState } from 'react';
import { CertificationItem, LanguageItem } from '../../types/resume';
import { Award, Plus, Trash2, Languages, GripVertical, ChevronUp, ChevronDown } from 'lucide-react';
import { SpellCheckedInput } from './SpellCheckedInput';

interface CertificationsFormProps {
  certifications: CertificationItem[];
  languages: LanguageItem[];
  onCertificationsChange: (certifications: CertificationItem[]) => void;
  onLanguagesChange: (languages: LanguageItem[]) => void;
}

export const CertificationsForm: React.FC<CertificationsFormProps> = ({
  certifications,
  languages,
  onCertificationsChange,
  onLanguagesChange,
}) => {
  const [draggedCertIdx, setDraggedCertIdx] = useState<number | null>(null);
  const [dragOverCertIdx, setDragOverCertIdx] = useState<number | null>(null);

  const [draggedLangIdx, setDraggedLangIdx] = useState<number | null>(null);
  const [dragOverLangIdx, setDragOverLangIdx] = useState<number | null>(null);

  // Certification handlers
  const addCert = () => {
    const newCert: CertificationItem = {
      id: `cert-${Date.now()}`,
      name: '',
      issuer: '',
      issueDate: '',
      credentialId: '',
    };
    onCertificationsChange([...certifications, newCert]);
  };

  const updateCert = (id: string, updated: Partial<CertificationItem>) => {
    onCertificationsChange(
      certifications.map((c) => (c.id === id ? { ...c, ...updated } : c))
    );
  };

  const removeCert = (id: string) => {
    onCertificationsChange(certifications.filter((c) => c.id !== id));
  };

  const moveCert = (fromIndex: number, toIndex: number) => {
    if (fromIndex === toIndex || toIndex < 0 || toIndex >= certifications.length) return;
    const items = [...certifications];
    const [moved] = items.splice(fromIndex, 1);
    items.splice(toIndex, 0, moved);
    onCertificationsChange(items);
  };

  // Language handlers
  const addLang = () => {
    const newLang: LanguageItem = {
      id: `lang-${Date.now()}`,
      language: '',
      proficiency: 'Fluent',
    };
    onLanguagesChange([...languages, newLang]);
  };

  const updateLang = (id: string, updated: Partial<LanguageItem>) => {
    onLanguagesChange(languages.map((l) => (l.id === id ? { ...l, ...updated } : l)));
  };

  const removeLang = (id: string) => {
    onLanguagesChange(languages.filter((l) => l.id !== id));
  };

  const moveLang = (fromIndex: number, toIndex: number) => {
    if (fromIndex === toIndex || toIndex < 0 || toIndex >= languages.length) return;
    const items = [...languages];
    const [moved] = items.splice(fromIndex, 1);
    items.splice(toIndex, 0, moved);
    onLanguagesChange(items);
  };

  return (
    <div className="space-y-6">
      {/* Certifications Section */}
      <div className="space-y-4">
        <div className="flex justify-between items-center border-b border-slate-200 pb-3">
          <div>
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Award className="w-4 h-4 text-blue-600" /> Certifications & Licenses
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Drag to reorder certifications (AWS, GCP, PMP, Scrum, etc.).
            </p>
          </div>
          <button
            id="add-cert-btn"
            type="button"
            onClick={addCert}
            className="flex items-center gap-1 px-3 py-1.5 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors shadow-xs cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Certificate</span>
          </button>
        </div>

        {certifications.length === 0 ? (
          <p className="text-xs text-slate-400 italic py-2">No certifications added.</p>
        ) : (
          <div className="space-y-3">
            {certifications.map((cert, idx) => {
              const isDragging = draggedCertIdx === idx;
              const isDragOver = dragOverCertIdx === idx;

              return (
                <div
                  key={cert.id}
                  id={`cert-card-${cert.id}`}
                  draggable
                  onDragStart={(e) => {
                    e.dataTransfer.setData('text/plain', idx.toString());
                    e.dataTransfer.effectAllowed = 'move';
                    setDraggedCertIdx(idx);
                  }}
                  onDragOver={(e) => {
                    e.preventDefault();
                    e.dataTransfer.dropEffect = 'move';
                    if (dragOverCertIdx !== idx) setDragOverCertIdx(idx);
                  }}
                  onDragLeave={() => {
                    if (dragOverCertIdx === idx) setDragOverCertIdx(null);
                  }}
                  onDrop={(e) => {
                    e.preventDefault();
                    if (draggedCertIdx !== null && draggedCertIdx !== idx) {
                      moveCert(draggedCertIdx, idx);
                    }
                    setDraggedCertIdx(null);
                    setDragOverCertIdx(null);
                  }}
                  onDragEnd={() => {
                    setDraggedCertIdx(null);
                    setDragOverCertIdx(null);
                  }}
                  className={`p-3 bg-white border rounded-xl space-y-2 transition-all ${
                    isDragging
                      ? 'opacity-40 scale-[0.99] border-dashed border-blue-400 bg-blue-50/50'
                      : isDragOver
                      ? 'border-blue-500 ring-2 ring-blue-500/30 bg-blue-50/40 shadow-xs'
                      : 'border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <div
                        className="cursor-grab active:cursor-grabbing text-slate-400 hover:text-blue-600 p-0.5 -ml-1 rounded transition-colors"
                        title="Drag to reorder certification"
                      >
                        <GripVertical className="w-4 h-4" />
                      </div>
                      <span className="text-xs font-bold text-slate-800">
                        {cert.name ? cert.name : `Certificate #${idx + 1}`}
                      </span>
                    </div>

                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        onClick={() => moveCert(idx, idx - 1)}
                        disabled={idx === 0}
                        className="p-1 text-slate-400 hover:text-slate-700 disabled:opacity-20 rounded transition-colors cursor-pointer"
                        title="Move up"
                      >
                        <ChevronUp className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => moveCert(idx, idx + 1)}
                        disabled={idx === certifications.length - 1}
                        className="p-1 text-slate-400 hover:text-slate-700 disabled:opacity-20 rounded transition-colors cursor-pointer"
                        title="Move down"
                      >
                        <ChevronDown className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => removeCert(cert.id)}
                        className="text-slate-400 hover:text-rose-600 p-1 cursor-pointer ml-1"
                        title="Remove certification"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                    <div className="sm:col-span-2">
                      <SpellCheckedInput
                        value={cert.name}
                        onChange={(val) => updateCert(cert.id, { name: val })}
                        placeholder="AWS Certified Solutions Architect – Professional"
                        inputClassName="py-1.5"
                      />
                    </div>
                    <div>
                      <SpellCheckedInput
                        value={cert.issuer}
                        onChange={(val) => updateCert(cert.id, { issuer: val })}
                        placeholder="Amazon Web Services"
                        inputClassName="py-1.5"
                      />
                    </div>
                    <div>
                      <input
                        type="text"
                        value={cert.issueDate}
                        onChange={(e) => updateCert(cert.id, { issueDate: e.target.value })}
                        placeholder="Issue Date (e.g. 2023-04)"
                        className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none text-slate-800"
                      />
                    </div>
                    <div className="sm:col-span-2">
                      <input
                        type="text"
                        value={cert.credentialId || ''}
                        onChange={(e) => updateCert(cert.id, { credentialId: e.target.value })}
                        placeholder="Credential ID / Verification URL (Optional)"
                        className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none text-slate-800"
                      />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Languages Section */}
      <div className="space-y-4 pt-4 border-t border-slate-200">
        <div className="flex justify-between items-center border-b border-slate-200 pb-3">
          <div>
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Languages className="w-4 h-4 text-blue-600" /> Languages
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">Drag to prioritize languages.</p>
          </div>
          <button
            id="add-lang-btn"
            type="button"
            onClick={addLang}
            className="flex items-center gap-1 px-3 py-1.5 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors shadow-xs cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Language</span>
          </button>
        </div>

        {languages.length === 0 ? (
          <p className="text-xs text-slate-400 italic py-2">No languages added.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {languages.map((lang, lIdx) => {
              const isDraggingL = draggedLangIdx === lIdx;
              const isDragOverL = dragOverLangIdx === lIdx;

              return (
                <div
                  key={lang.id}
                  draggable
                  onDragStart={(e) => {
                    e.dataTransfer.setData('text/plain', lIdx.toString());
                    e.dataTransfer.effectAllowed = 'move';
                    setDraggedLangIdx(lIdx);
                  }}
                  onDragOver={(e) => {
                    e.preventDefault();
                    e.dataTransfer.dropEffect = 'move';
                    if (dragOverLangIdx !== lIdx) setDragOverLangIdx(lIdx);
                  }}
                  onDragLeave={() => {
                    if (dragOverLangIdx === lIdx) setDragOverLangIdx(null);
                  }}
                  onDrop={(e) => {
                    e.preventDefault();
                    if (draggedLangIdx !== null && draggedLangIdx !== lIdx) {
                      moveLang(draggedLangIdx, lIdx);
                    }
                    setDraggedLangIdx(null);
                    setDragOverLangIdx(null);
                  }}
                  onDragEnd={() => {
                    setDraggedLangIdx(null);
                    setDragOverLangIdx(null);
                  }}
                  className={`flex items-center gap-2 p-2 bg-white border rounded-lg transition-all ${
                    isDraggingL
                      ? 'opacity-40 scale-95 border-dashed border-blue-400 bg-blue-50/50'
                      : isDragOverL
                      ? 'border-blue-500 ring-2 ring-blue-500/30 bg-blue-50/40'
                      : 'border-slate-200'
                  }`}
                >
                  <div
                    className="cursor-grab active:cursor-grabbing text-slate-400 hover:text-blue-600 p-0.5 rounded transition-colors"
                    title="Drag to reorder language"
                  >
                    <GripVertical className="w-3.5 h-3.5" />
                  </div>
                  <div className="flex-1">
                    <SpellCheckedInput
                      value={lang.language}
                      onChange={(val) => updateLang(lang.id, { language: val })}
                      placeholder="English, Spanish, French..."
                      inputClassName="py-1"
                    />
                  </div>
                  <select
                    value={lang.proficiency}
                    onChange={(e) => updateLang(lang.id, { proficiency: e.target.value as any })}
                    className="text-xs px-2 py-1 border border-slate-200 rounded bg-slate-50 text-slate-700 outline-none"
                  >
                    <option value="Native">Native</option>
                    <option value="Fluent">Fluent</option>
                    <option value="Proficient">Proficient</option>
                    <option value="Working">Working</option>
                    <option value="Basic">Basic</option>
                  </select>
                  <button
                    type="button"
                    onClick={() => removeLang(lang.id)}
                    className="text-slate-400 hover:text-rose-600 p-1 cursor-pointer"
                    title="Remove language"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
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

