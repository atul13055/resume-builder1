import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ThemeConfig, ResumeTemplateType, PaperSize } from '../../types/resume';
import { COLOR_PALETTES } from '../../data/sampleResumes';
import { PAGE_SIZE_LIST } from '../../data/pageSizeData';
import { X, Sliders, Palette, Type, MoveVertical, FileText, Eye, Check, Layers } from 'lucide-react';

interface CustomizationDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  theme: ThemeConfig;
  onChangeTheme: (theme: ThemeConfig) => void;
  onOpenTemplateModal: () => void;
}

export const CustomizationDrawer: React.FC<CustomizationDrawerProps> = ({
  isOpen,
  onClose,
  theme,
  onChangeTheme,
  onOpenTemplateModal,
}) => {
  const fontOptions: { id: ThemeConfig['fontPairing']; label: string; preview: string }[] = [
    { id: 'sans', label: 'Inter / Modern Sans', preview: 'Clean & Contemporary' },
    { id: 'serif', label: 'Merriweather / Classic Serif', preview: 'Traditional & Formal' },
    { id: 'mono', label: 'JetBrains / Technical Mono', preview: 'Technical & Engineering' },
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            key="customization-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
            className="fixed inset-0 z-40 bg-slate-950/40 backdrop-blur-2xs"
          />

          {/* Drawer Panel */}
          <motion.div
            key="customization-panel"
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 28, stiffness: 300 }}
            className="fixed inset-y-0 right-0 z-50 w-full max-w-md bg-white shadow-2xl border-l border-slate-200 flex flex-col"
          >
            {/* Drawer Header */}
      <div className="px-5 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
        <div className="flex items-center gap-2">
          <Sliders className="w-4 h-4 text-blue-600" />
          <h2 className="text-sm font-bold text-slate-900">Design & Layout Styles</h2>
        </div>
        <button
          onClick={onClose}
          className="p-1 text-slate-400 hover:text-slate-700 rounded-lg transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Drawer Body */}
      <div className="flex-1 overflow-y-auto p-5 space-y-6">
        {/* Template Selector Quick Card */}
        <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-between">
          <div>
            <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">Active Template</span>
            <h4 className="text-xs font-bold text-slate-900 capitalize">{theme.template} Template</h4>
          </div>
          <button
            onClick={onOpenTemplateModal}
            className="px-3 py-1.5 text-xs font-bold text-blue-600 bg-white border border-blue-200 hover:bg-blue-50 rounded-lg transition-colors cursor-pointer shadow-2xs"
          >
            Change Template
          </button>
        </div>

        {/* Color Palettes */}
        <div className="space-y-2.5">
          <label className="text-xs font-bold text-slate-800 flex items-center gap-1.5 uppercase tracking-wider">
            <Palette className="w-3.5 h-3.5 text-blue-600" /> Accent Color Palette
          </label>
          <div className="grid grid-cols-2 gap-2">
            {COLOR_PALETTES.map((palette) => {
              const isSelected = theme.primaryColor === palette.primary;

              return (
                <button
                  key={palette.name}
                  onClick={() =>
                    onChangeTheme({
                      ...theme,
                      primaryColor: palette.primary,
                      accentColor: palette.accent,
                    })
                  }
                  className={`p-2 rounded-xl border text-left flex items-center gap-2 transition-all cursor-pointer ${
                    isSelected
                      ? 'border-blue-600 bg-blue-50/40 ring-1 ring-blue-600/30'
                      : 'border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <div className="flex -space-x-1">
                    <span
                      className="w-4 h-4 rounded-full border border-white shadow-xs"
                      style={{ backgroundColor: palette.primary }}
                    />
                    <span
                      className="w-4 h-4 rounded-full border border-white shadow-xs"
                      style={{ backgroundColor: palette.accent }}
                    />
                  </div>
                  <span className="text-xs font-medium text-slate-700 truncate">{palette.name}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Font Pairings */}
        <div className="space-y-2.5">
          <label className="text-xs font-bold text-slate-800 flex items-center gap-1.5 uppercase tracking-wider">
            <Type className="w-3.5 h-3.5 text-blue-600" /> Font Typography
          </label>
          <div className="space-y-2">
            {fontOptions.map((font) => (
              <button
                key={font.id}
                onClick={() => onChangeTheme({ ...theme, fontPairing: font.id })}
                className={`w-full p-2.5 rounded-xl border text-left flex items-center justify-between transition-all cursor-pointer ${
                  theme.fontPairing === font.id
                    ? 'border-blue-600 bg-blue-50/30 ring-1 ring-blue-600/20'
                    : 'border-slate-200 hover:border-slate-300'
                }`}
              >
                <div>
                  <p className="text-xs font-bold text-slate-900">{font.label}</p>
                  <p className="text-[11px] text-slate-500">{font.preview}</p>
                </div>
                {theme.fontPairing === font.id && <Check className="w-4 h-4 text-blue-600" />}
              </button>
            ))}
          </div>
        </div>

        {/* Font Size & Spacing Scaling */}
        <div className="space-y-4 pt-2 border-t border-slate-200">
          <div>
            <div className="flex justify-between items-center mb-1.5">
              <label className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                Font Size Scale
              </label>
              <span className="text-xs font-mono font-medium text-slate-500 uppercase">
                {theme.fontSize}
              </span>
            </div>
            <div className="grid grid-cols-3 gap-2">
              {(['sm', 'md', 'lg'] as const).map((size) => (
                <button
                  key={size}
                  onClick={() => onChangeTheme({ ...theme, fontSize: size })}
                  className={`py-1.5 text-xs font-bold rounded-lg border uppercase transition-all cursor-pointer ${
                    theme.fontSize === size
                      ? 'bg-slate-900 text-white border-slate-900 shadow-xs'
                      : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  {size === 'sm' ? 'Compact' : size === 'md' ? 'Regular' : 'Large'}
                </button>
              ))}
            </div>
          </div>

          <div>
            <div className="flex justify-between items-center mb-1.5">
              <label className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                Line & Section Spacing
              </label>
              <span className="text-xs font-mono font-medium text-slate-500 uppercase">
                {theme.spacing}
              </span>
            </div>
            <div className="grid grid-cols-3 gap-2">
              {(['compact', 'normal', 'spacious'] as const).map((sp) => (
                <button
                  key={sp}
                  onClick={() => onChangeTheme({ ...theme, spacing: sp })}
                  className={`py-1.5 text-xs font-bold rounded-lg border capitalize transition-all cursor-pointer ${
                    theme.spacing === sp
                      ? 'bg-slate-900 text-white border-slate-900 shadow-xs'
                      : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  {sp}
                </button>
              ))}
            </div>
          </div>

          <div>
            <div className="flex justify-between items-center mb-1.5">
              <label className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                <Layers className="w-3.5 h-3.5 text-blue-600" />
                Paper Format & Page Standard
              </label>
              <span className="text-[11px] font-bold text-blue-600 uppercase">
                {PAGE_SIZE_LIST.find((p) => p.id === (theme.paperSize || 'a4'))?.shortLabel || 'A4'}
              </span>
            </div>
            <div className="grid grid-cols-1 gap-2">
              {PAGE_SIZE_LIST.map((opt) => {
                const isSelected = (theme.paperSize || 'a4') === opt.id;
                return (
                  <button
                    key={opt.id}
                    onClick={() => onChangeTheme({ ...theme, paperSize: opt.id })}
                    className={`p-2.5 rounded-xl border text-left flex items-start justify-between transition-all cursor-pointer ${
                      isSelected
                        ? 'border-blue-600 bg-blue-50/40 ring-1 ring-blue-600/30'
                        : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                    }`}
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-slate-900">{opt.name}</span>
                        <span
                          className={`text-[9px] px-1.5 py-0.2 rounded font-semibold ${
                            isSelected
                              ? 'bg-blue-600 text-white'
                              : 'bg-slate-100 text-slate-600 border border-slate-200'
                          }`}
                        >
                          {opt.regionBadge}
                        </span>
                      </div>
                      <p className="text-[11px] font-mono text-slate-500 mt-0.5">
                        {opt.dimensionsMetric} ({opt.dimensionsImperial})
                      </p>
                      <p className="text-[10px] text-slate-400 mt-0.5">{opt.description}</p>
                    </div>
                    {isSelected && <Check className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Section Visibility Toggles */}
        <div className="space-y-2.5 pt-2 border-t border-slate-200">
          <div className="flex items-center justify-between">
            <label className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
              <Eye className="w-3.5 h-3.5 text-blue-600" />
              Resume Section Visibility
            </label>
            <span className="text-[10px] text-slate-400 font-medium">Toggle preview visibility</span>
          </div>
          <div className="space-y-1.5">
            {[
              { id: 'summary', label: 'Professional Summary' },
              { id: 'experience', label: 'Work Experience' },
              { id: 'skills', label: 'Skills & Expertise' },
              { id: 'projects', label: 'Key Projects' },
              { id: 'education', label: 'Education & Degrees' },
              { id: 'certifications', label: 'Certifications' },
              { id: 'languages', label: 'Languages' },
            ].map((section) => {
              const isHidden = (theme.hiddenSections || []).includes(section.id);
              return (
                <label
                  key={section.id}
                  className={`flex items-center justify-between p-2 rounded-lg border transition-all cursor-pointer ${
                    isHidden
                      ? 'bg-slate-50 border-slate-200 text-slate-400 opacity-80'
                      : 'bg-white border-slate-200 text-slate-700 hover:border-slate-300 shadow-2xs'
                  }`}
                >
                  <span className={`text-xs font-medium ${isHidden ? 'line-through' : ''}`}>
                    {section.label}
                  </span>
                  <input
                    type="checkbox"
                    checked={!isHidden}
                    onChange={(e) => {
                      const shouldBeVisible = e.target.checked;
                      const currentHidden = theme.hiddenSections || [];
                      const updatedHidden = shouldBeVisible
                        ? currentHidden.filter((id) => id !== section.id)
                        : [...currentHidden, section.id];
                      onChangeTheme({ ...theme, hiddenSections: updatedHidden });
                    }}
                    className="rounded text-blue-600"
                  />
                </label>
              );
            })}
          </div>
        </div>

        {/* Display Toggles */}
        <div className="space-y-2.5 pt-2 border-t border-slate-200">
          <label className="text-xs font-bold text-slate-800 uppercase tracking-wider">
            Visual Elements
          </label>
          <div className="space-y-2">
            <label className="flex items-center justify-between p-2 rounded-lg bg-slate-50 border border-slate-200 cursor-pointer">
              <span className="text-xs font-medium text-slate-700">Display Contact Icons</span>
              <input
                type="checkbox"
                checked={theme.showIcons}
                onChange={(e) => onChangeTheme({ ...theme, showIcons: e.target.checked })}
                className="rounded text-blue-600"
              />
            </label>
            <label className="flex items-center justify-between p-2 rounded-lg bg-slate-50 border border-slate-200 cursor-pointer">
              <span className="text-xs font-medium text-slate-700">Display Profile Photo (If Supported)</span>
              <input
                type="checkbox"
                checked={theme.showPhoto}
                onChange={(e) => onChangeTheme({ ...theme, showPhoto: e.target.checked })}
                className="rounded text-blue-600"
              />
            </label>
          </div>
        </div>
      </div>

      {/* Drawer Footer */}
      <div className="p-4 border-t border-slate-200 bg-slate-50 flex justify-end">
        <button
          onClick={onClose}
          className="w-full py-2 text-xs font-bold text-white bg-slate-900 hover:bg-slate-800 rounded-xl transition-colors cursor-pointer"
        >
          Apply Styles & Close
        </button>
      </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
