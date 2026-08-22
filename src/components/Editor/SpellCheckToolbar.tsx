import React, { useState } from 'react';
import { useSpellCheck } from './SpellCheckContext';
import { SpellCheckDictionaryModal } from '../Modals/SpellCheckDictionaryModal';
import { CheckCircle2, AlertCircle, BookOpen, ToggleLeft, ToggleRight, Sparkles } from 'lucide-react';

export const SpellCheckToolbar: React.FC = () => {
  const { isEnabled, toggleEnabled, activeTyposCount, customDictionary } = useSpellCheck();
  const [isDictModalOpen, setIsDictModalOpen] = useState(false);

  return (
    <>
      <div className="flex items-center justify-between px-3 py-1.5 bg-slate-50 border-b border-slate-200/80 text-xs">
        {/* Left: Status Indicator */}
        <div className="flex items-center gap-2">
          {isEnabled ? (
            activeTyposCount > 0 ? (
              <div className="flex items-center gap-1.5 text-amber-700 bg-amber-100/70 border border-amber-300/80 px-2 py-0.5 rounded-full font-semibold text-[11px] animate-pulse">
                <AlertCircle className="w-3 h-3 text-amber-600" />
                <span>{activeTyposCount} typo{activeTyposCount > 1 ? 's' : ''} detected</span>
              </div>
            ) : (
              <div className="flex items-center gap-1.5 text-emerald-700 bg-emerald-100/70 border border-emerald-300/80 px-2 py-0.5 rounded-full font-semibold text-[11px]">
                <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                <span>Real-time Spell Check active (0 typos)</span>
              </div>
            )
          ) : (
            <div className="flex items-center gap-1.5 text-slate-500 font-medium text-[11px]">
              <span>Spell Check paused</span>
            </div>
          )}
        </div>

        {/* Right: Controls & Dictionary */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setIsDictModalOpen(true)}
            className="flex items-center gap-1 text-[11px] text-slate-600 hover:text-blue-600 px-2 py-0.5 rounded-md hover:bg-slate-200/60 transition-colors cursor-pointer font-medium"
            title="Manage custom dictionary words"
          >
            <BookOpen className="w-3 h-3 text-slate-400" />
            <span>Dictionary ({customDictionary.length})</span>
          </button>

          <div className="h-3 w-px bg-slate-300 mx-0.5" />

          {/* Toggle Button */}
          <button
            type="button"
            onClick={toggleEnabled}
            className={`flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-md transition-colors cursor-pointer ${
              isEnabled
                ? 'text-blue-700 hover:bg-blue-50'
                : 'text-slate-500 hover:bg-slate-200/60'
            }`}
            title={isEnabled ? 'Disable real-time spell checking' : 'Enable real-time spell checking'}
          >
            {isEnabled ? (
              <>
                <ToggleRight className="w-4 h-4 text-blue-600" />
                <span>Spell Check ON</span>
              </>
            ) : (
              <>
                <ToggleLeft className="w-4 h-4 text-slate-400" />
                <span>Spell Check OFF</span>
              </>
            )}
          </button>
        </div>
      </div>

      <SpellCheckDictionaryModal
        isOpen={isDictModalOpen}
        onClose={() => setIsDictModalOpen(false)}
      />
    </>
  );
};
