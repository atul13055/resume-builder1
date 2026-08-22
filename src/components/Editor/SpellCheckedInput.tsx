import React, { useState, useEffect, useRef, useId } from 'react';
import { findTyposInText, replaceTypoInText, TypoMatch, fixAllTyposInText } from '../../utils/spellChecker';
import { useSpellCheck } from './SpellCheckContext';
import { AlertCircle, Check, Plus, EyeOff, Sparkles, ChevronRight } from 'lucide-react';

interface SpellCheckedInputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange'> {
  value: string;
  onChange: (value: string) => void;
  containerClassName?: string;
  inputClassName?: string;
  leftIcon?: React.ReactNode;
}

export const SpellCheckedInput: React.FC<SpellCheckedInputProps> = ({
  value,
  onChange,
  containerClassName = '',
  inputClassName = '',
  leftIcon,
  id,
  placeholder,
  type = 'text',
  disabled,
  ...props
}) => {
  const generatedId = useId();
  const fieldId = id || generatedId;
  const { isEnabled, addToDictionary, ignoreWord, customDictionary, reportFieldTypos, unregisterField } = useSpellCheck();

  const [typos, setTypos] = useState<TypoMatch[]>([]);
  const [selectedTypo, setSelectedTypo] = useState<TypoMatch | null>(null);
  const [showPopover, setShowPopover] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Scan text for typos whenever value, enabled state, or custom dictionary changes
  useEffect(() => {
    if (!isEnabled || disabled || !value || type === 'password' || type === 'email' || type === 'url') {
      setTypos([]);
      reportFieldTypos(fieldId, 0);
      return;
    }

    const detected = findTyposInText(value);
    setTypos(detected);
    reportFieldTypos(fieldId, detected.length);
  }, [value, isEnabled, disabled, type, customDictionary, fieldId]);

  useEffect(() => {
    return () => {
      unregisterField(fieldId);
    };
  }, [fieldId]);

  // Close popover when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setShowPopover(false);
        setSelectedTypo(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleApplyCorrection = (typo: TypoMatch, correction: string) => {
    const updated = replaceTypoInText(value, typo, correction);
    onChange(updated);
    setShowPopover(false);
    setSelectedTypo(null);
  };

  const handleFixAll = () => {
    const fixed = fixAllTyposInText(value, typos);
    onChange(fixed);
    setShowPopover(false);
    setSelectedTypo(null);
  };

  const handleIgnore = (word: string) => {
    ignoreWord(word);
    setShowPopover(false);
    setSelectedTypo(null);
  };

  const handleAddToDict = (word: string) => {
    addToDictionary(word);
    setShowPopover(false);
    setSelectedTypo(null);
  };

  const hasTypos = isEnabled && typos.length > 0;

  return (
    <div ref={containerRef} className={`relative ${containerClassName}`}>
      <div className="relative flex items-center">
        {leftIcon && (
          <div className="absolute left-3 pointer-events-none text-slate-400">
            {leftIcon}
          </div>
        )}

        <input
          id={fieldId}
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          disabled={disabled}
          className={`w-full text-xs rounded-lg border outline-none transition-all text-slate-800 ${
            leftIcon ? 'pl-8' : 'pl-3'
          } ${hasTypos ? 'pr-8 border-amber-300 focus:border-amber-500 focus:ring-2 focus:ring-amber-100 bg-amber-50/10' : 'pr-3 border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 bg-white'} ${inputClassName}`}
          {...props}
        />

        {/* Real-time typo indicator pill/badge */}
        {hasTypos && (
          <button
            type="button"
            onClick={() => {
              setSelectedTypo(typos[0]);
              setShowPopover((prev) => !prev);
            }}
            className="absolute right-2 px-1.5 py-0.5 rounded flex items-center gap-1 bg-amber-100/80 hover:bg-amber-200 text-amber-800 text-[10px] font-semibold transition-colors cursor-pointer"
            title={`${typos.length} spelling suggestion${typos.length > 1 ? 's' : ''} available`}
          >
            <AlertCircle className="w-3 h-3 text-amber-600 animate-pulse" />
            <span>{typos.length}</span>
          </button>
        )}
      </div>

      {/* Real-time Spell Correction Popover */}
      {showPopover && hasTypos && (
        <div className="absolute left-0 right-0 top-full mt-1.5 z-40 bg-white rounded-xl shadow-xl border border-slate-200 p-2.5 space-y-2 text-xs animate-in fade-in zoom-in-95 duration-100">
          <div className="flex items-center justify-between border-b border-slate-100 pb-1.5">
            <span className="font-bold text-slate-800 flex items-center gap-1 text-[11px]">
              <Sparkles className="w-3 h-3 text-amber-500" />
              Spelling Suggestions ({typos.length})
            </span>
            {typos.length > 1 && (
              <button
                type="button"
                onClick={handleFixAll}
                className="text-[10px] font-semibold text-blue-600 hover:text-blue-700 bg-blue-50 hover:bg-blue-100 px-2 py-0.5 rounded cursor-pointer transition-colors"
              >
                Fix All ({typos.length})
              </button>
            )}
          </div>

          {/* List of typos in this field */}
          <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
            {typos.map((typo, idx) => (
              <div key={`${typo.word}-${idx}`} className="p-1.5 rounded-lg bg-slate-50 border border-slate-100 space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold text-rose-600 line-through decoration-rose-400">
                    {typo.originalWord}
                  </span>
                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => handleIgnore(typo.word)}
                      className="text-[10px] text-slate-500 hover:text-slate-800 px-1 py-0.5 rounded hover:bg-slate-200 transition-colors cursor-pointer"
                      title="Ignore for this session"
                    >
                      Ignore
                    </button>
                    <button
                      type="button"
                      onClick={() => handleAddToDict(typo.word)}
                      className="text-[10px] text-slate-500 hover:text-blue-600 px-1 py-0.5 rounded hover:bg-blue-50 transition-colors flex items-center gap-0.5 cursor-pointer"
                      title="Add to custom dictionary"
                    >
                      <Plus className="w-2.5 h-2.5" /> Dict
                    </button>
                  </div>
                </div>

                {/* Suggestions Pills */}
                {typo.suggestions.length > 0 ? (
                  <div className="flex flex-wrap gap-1">
                    {typo.suggestions.map((suggestion) => (
                      <button
                        key={suggestion}
                        type="button"
                        onClick={() => handleApplyCorrection(typo, suggestion)}
                        className="px-2 py-0.5 rounded-md bg-emerald-50 hover:bg-emerald-100 text-emerald-700 font-semibold text-[11px] border border-emerald-200 transition-colors flex items-center gap-1 cursor-pointer"
                      >
                        <Check className="w-2.5 h-2.5 text-emerald-600" />
                        <span>{suggestion}</span>
                      </button>
                    ))}
                  </div>
                ) : (
                  <span className="text-[10px] text-slate-400 italic">No direct suggestions</span>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
