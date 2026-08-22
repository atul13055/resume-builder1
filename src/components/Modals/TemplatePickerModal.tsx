import React from 'react';
import { ResumeTemplateType, ThemeConfig } from '../../types/resume';
import { X, Check, Layout, Sparkles, Star } from 'lucide-react';

interface TemplatePickerModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentTemplate: ResumeTemplateType;
  onSelectTemplate: (template: ResumeTemplateType) => void;
}

interface TemplateMeta {
  id: ResumeTemplateType;
  name: string;
  badge: string;
  atsRating: string;
  bestFor: string;
  previewClass: string;
  previewBg: string;
  description: string;
}

const TEMPLATES: TemplateMeta[] = [
  {
    id: 'modern',
    name: 'Modern Executive',
    badge: 'Popular',
    atsRating: '99% ATS Friendly',
    bestFor: 'Software Engineers, Tech Leads, Product Managers',
    previewClass: 'border-t-4 border-slate-900',
    previewBg: 'bg-gradient-to-b from-slate-100 to-white',
    description: 'Clean top accent banner with balanced single-column flow, high impact bullet spacing and metadata headers.',
  },
  {
    id: 'minimal',
    name: 'Clean Minimalist',
    badge: 'Classic ATS',
    atsRating: '100% ATS Friendly',
    bestFor: 'Finance, Consulting, General Corporate',
    previewClass: 'border-l-4 border-slate-700',
    previewBg: 'bg-white',
    description: 'Stripped-back ultra-clean typography with prominent horizontal rules. 100% parseable by all legacy and modern ATS engines.',
  },
  {
    id: 'creative',
    name: 'Creative Split (2-Col)',
    badge: 'Design & Visual',
    atsRating: '95% ATS Friendly',
    bestFor: 'Designers, Marketing, Creative Directors',
    previewClass: 'border-r-4 border-blue-600',
    previewBg: 'bg-slate-50',
    description: 'Distinctive left sidebar for contact & skills with an expansive right column for deep project & work experience narratives.',
  },
  {
    id: 'academic',
    name: 'Ivy Academic / CV',
    badge: 'Formal Serif',
    atsRating: '98% ATS Friendly',
    bestFor: 'Researchers, Professors, Data Scientists, Legal',
    previewClass: 'border-t-2 border-b-2 border-stone-800',
    previewBg: 'bg-stone-50',
    description: 'Centered formal layout pairing Georgia serif with detailed education, publications, research, and appointment appointments.',
  },
  {
    id: 'compact',
    name: 'Compact High-Density',
    badge: 'Dense 1-Page',
    atsRating: '97% ATS Friendly',
    bestFor: 'Senior professionals fitting 10+ years onto 1 page',
    previewClass: 'border-2 border-slate-400',
    previewBg: 'bg-white',
    description: 'Smart 12-column grid layout maximizing every millimeter of printable page space without sacrificing readability.',
  },
];

export const TemplatePickerModal: React.FC<TemplatePickerModalProps> = ({
  isOpen,
  onClose,
  currentTemplate,
  onSelectTemplate,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden border border-slate-200">
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-blue-600 text-white flex items-center justify-center font-bold">
              <Layout className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900">Choose a Resume Template</h2>
              <p className="text-xs text-slate-500">
                All templates are engineered to comply with Fortune 500 ATS parser guidelines.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-slate-400 hover:text-slate-700 rounded-lg transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body: Gallery */}
        <div className="flex-1 overflow-y-auto p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {TEMPLATES.map((tmpl) => {
              const isSelected = currentTemplate === tmpl.id;

              return (
                <div
                  key={tmpl.id}
                  onClick={() => {
                    onSelectTemplate(tmpl.id);
                  }}
                  className={`group relative p-4 rounded-2xl border-2 transition-all cursor-pointer flex flex-col justify-between ${
                    isSelected
                      ? 'border-blue-600 bg-blue-50/20 shadow-md ring-2 ring-blue-600/20'
                      : 'border-slate-200 bg-white hover:border-slate-300 hover:shadow-xs'
                  }`}
                >
                  {/* Selected Indicator Badge */}
                  {isSelected && (
                    <div className="absolute top-3 right-3 w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center shadow-xs">
                      <Check className="w-4 h-4" />
                    </div>
                  )}

                  <div>
                    {/* Mock Mini Document Preview */}
                    <div
                      className={`w-full h-32 rounded-lg border border-slate-200 p-3 mb-3 flex flex-col justify-between ${tmpl.previewBg} ${tmpl.previewClass}`}
                    >
                      <div className="space-y-1">
                        <div className="h-2.5 w-1/2 bg-slate-800 rounded-xs" />
                        <div className="h-1.5 w-1/3 bg-slate-400 rounded-xs" />
                      </div>
                      <div className="space-y-1.5">
                        <div className="h-1.5 w-full bg-slate-300 rounded-xs" />
                        <div className="h-1.5 w-4/5 bg-slate-200 rounded-xs" />
                        <div className="h-1.5 w-3/4 bg-slate-200 rounded-xs" />
                      </div>
                      <div className="flex justify-between items-center pt-1 border-t border-slate-200">
                        <div className="h-1 w-1/4 bg-slate-400 rounded-xs" />
                        <div className="h-1 w-1/4 bg-slate-300 rounded-xs" />
                      </div>
                    </div>

                    <div className="flex items-center justify-between gap-1 mb-1">
                      <h3 className="text-sm font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                        {tmpl.name}
                      </h3>
                      <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-slate-100 text-slate-700">
                        {tmpl.badge}
                      </span>
                    </div>

                    <p className="text-[11px] text-slate-600 leading-relaxed mb-3">
                      {tmpl.description}
                    </p>
                  </div>

                  <div className="pt-2 border-t border-slate-100 space-y-1">
                    <div className="flex items-center justify-between text-[10px]">
                      <span className="font-semibold text-emerald-600">{tmpl.atsRating}</span>
                    </div>
                    <p className="text-[10px] text-slate-500 truncate">
                      Best: {tmpl.bestFor}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3.5 border-t border-slate-200 bg-slate-50 flex items-center justify-between">
          <span className="text-xs text-slate-500">
            Switching templates instantly preserves all your resume information and styling.
          </span>
          <button
            onClick={onClose}
            className="px-5 py-1.5 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors cursor-pointer shadow-xs"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
