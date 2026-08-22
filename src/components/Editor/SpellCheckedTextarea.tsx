import React, { useState, useEffect, useRef, useId } from 'react';
import { findTyposInText, replaceTypoInText, TypoMatch, fixAllTyposInText } from '../../utils/spellChecker';
import { useSpellCheck } from './SpellCheckContext';
import { AlertCircle, Check, Plus, Sparkles, CheckCheck } from 'lucide-react';

interface SpellCheckedTextareaProps extends Omit<React.TextareaHTMLAttributes<HTMLTextAreaElement>, 'onChange'> {
  value: string;
  onChange: (value: string) => void;
  containerClassName?: string;
  textareaClassName?: string;
  showInlineChips?: boolean;
}

export const SpellCheckedTextarea: React.FC<SpellCheckedTextareaProps> = ({
  value,
  onChange,
  containerClassName = '',
  textareaClassName = '',
  showInlineChips = true,
  id,
  placeholder,
  rows = 3,
  disabled,
  ...props
}) => {
  const generatedId = useId();
  const fieldId = id || generatedId;
  const { isEnabled, addToDictionary, ignoreWord, customDictionary, reportFieldTypos, unregisterField } = useSpellCheck();

  const [typos, setTypos] = useState<TypoMatch[]>([]);
  const [activeTypoIdx, setActiveTypoIdx] = useState<number | null>(null);

  // Scan text for typos whenever value, enabled state, or custom dictionary changes
  useEffect(() => {
    if (!isEnabled || disabled || !value) {
      setTypos([]);
      reportFieldTypos(fieldId, 0);
      return;
    }

    const detected = findTyposInText(value);
    setTypos(detected);
    reportFieldTypos(fieldId, detected.length);
  }, [value, isEnabled, disabled, customDictionary, fieldId]);

  useEffect(() => {
    return () => {
      unregisterField(fieldId);
    };
  }, [fieldId]);

  const handleApplyCorrection = (typo: TypoMatch, correction: string) => {
    const updated = replaceTypoInText(value, typo, correction);
    onChange(updated);
    setActiveTypoIdx(null);
  };

  const handleFixAll = () => {
    const fixed = fixAllTyposInText(value, typos);
    onChange(fixed);
    setActiveTypoIdx(null);
  };

  const handleIgnore = (word: string) => {
    ignoreWord(word);
    setActiveTypoIdx(null);
  };

  const handleAddToDict = (word: string) => {
    addToDictionary(word);
    setActiveTypoIdx(null);
  };

  const hasTypos = isEnabled && typos.length > 0;

  return (
    <div className={`space-y-1.5 ${containerClassName}`}>
      <div className="relative">
        <textarea
          id={fieldId}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          rows={rows}
          disabled={disabled}
          className={`w-full px-3 py-2 text-xs rounded-lg border outline-none transition-all text-slate-800 resize-y ${
            hasTypos
              ? 'border-amber-300 focus:border-amber-500 focus:ring-2 focus:ring-amber-100 bg-amber-50/15'
              : 'border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 bg-white'
          } ${textareaClassName}`}
          {...props}
        />

        {/* Floating badge top-right for quick count */}
        {hasTypos && (
          <div className="absolute right-2.5 top-2.5 flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-amber-100/90 text-amber-800 text-[10px] font-semibold border border-amber-200/70 shadow-2xs pointer-events-none">
            <AlertCircle className="w-3 h-3 text-amber-600 animate-pulse" />
            <span>{typos.length} typo{typos.length > 1 ? 's' : ''}</span>
          </div>
        )}
      </div>

      {/* Real-time interactive correction bar underneath the textarea */}
      {showInlineChips && hasTypos && (
        <div className="p-2.5 rounded-lg bg-amber-50/70 border border-amber-200/80 space-y-2 text-xs">
          <div className="flex items-center justify-between gap-2 flex-wrap">
            <div className="flex items-center gap-1.5 text-amber-900 font-semibold text-[11px]">
              <Sparkles className="w-3.5 h-3.5 text-amber-600" />
              <span>Real-time Corrections:</span>
            </div>

            {typos.length > 1 && (
              <button
                type="button"
                onClick={handleFixAll}
                className="flex items-center gap-1 px-2 py-0.5 text-[11px] font-bold text-emerald-700 bg-emerald-100/90 hover:bg-emerald-200 rounded-md transition-colors cursor-pointer border border-emerald-300/60"
              >
                <CheckCheck className="w-3 h-3 text-emerald-600" />
                <span>Fix All ({typos.length})</span>
              </button>
            )}
          </div>

          <div className="flex flex-wrap gap-1.5">
            {typos.map((typo, idx) => {
              const isOpen = activeTypoIdx === idx;
              const topSuggestion = typo.suggestions[0];

              return (
                <div key={`${typo.word}-${idx}`} className="relative inline-flex items-center">
                  <div className="inline-flex items-center gap-1 bg-white border border-amber-200 rounded-md px-2 py-1 shadow-2xs">
                    <span className="text-[11px] font-bold text-rose-600 line-through decoration-rose-400">
                      {typo.originalWord}
                    </span>

                    {topSuggestion && (
                      <button
                        type="button"
                        onClick={() => handleApplyCorrection(typo, topSuggestion)}
                        className="flex items-center gap-0.5 px-1.5 py-0.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 font-semibold rounded text-[11px] border border-emerald-200 transition-colors cursor-pointer ml-1"
                        title={`Replace with "${topSuggestion}"`}
                      >
                        <Check className="w-2.5 h-2.5 text-emerald-600" />
                        <span>{topSuggestion}</span>
                      </button>
                    )}

                    {/* More suggestions / dictionary dropdown toggle */}
                    <button
                      type="button"
                      onClick={() => setActiveTypoIdx(isOpen ? null : idx)}
                      className="text-[10px] text-slate-400 hover:text-slate-700 px-1 py-0.5 rounded hover:bg-slate-100 cursor-pointer ml-0.5"
                      title="More options"
                    >
                      •••
                    </button>
                  </div>

                  {/* Expanded suggestions / action menu */}
                  {isOpen && (
                    <div className="absolute left-0 top-full mt-1 z-30 bg-white rounded-lg shadow-lg border border-slate-200 p-2 min-w-44 space-y-1.5 text-xs animate-in fade-in zoom-in-95">
                      <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                        Suggestions:
                      </div>
                      {typo.suggestions.map((sug) => (
                        <button
                          key={sug}
                          type="button"
                          onClick={() => handleApplyCorrection(typo, sug)}
                          className="w-full text-left px-2 py-1 rounded hover:bg-emerald-50 text-emerald-700 font-semibold text-[11px] flex items-center justify-between cursor-pointer"
                        >
                          <span>{sug}</span>
                          <Check className="w-3 h-3 text-emerald-600" />
                        </button>
                      ))}

                      <div className="border-t border-slate-100 pt-1.5 flex items-center justify-between gap-1 text-[10px]">
                        <button
                          type="button"
                          onClick={() => handleIgnore(typo.word)}
                          className="text-slate-600 hover:text-slate-900 px-1.5 py-0.5 rounded hover:bg-slate-100 cursor-pointer"
                        >
                          Ignore
                        </button>
                        <button
                          type="button"
                          onClick={() => handleAddToDict(typo.word)}
                          className="text-blue-600 hover:text-blue-800 px-1.5 py-0.5 rounded hover:bg-blue-50 cursor-pointer font-semibold flex items-center gap-0.5"
                        >
                          <Plus className="w-2.5 h-2.5" /> Add to Dict
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
