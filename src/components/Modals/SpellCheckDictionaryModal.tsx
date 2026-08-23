import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useSpellCheck } from '../Editor/SpellCheckContext';
import { BookOpen, Plus, Trash2, X, Check, Search, ShieldCheck } from 'lucide-react';

interface SpellCheckDictionaryModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SpellCheckDictionaryModal: React.FC<SpellCheckDictionaryModalProps> = ({
  isOpen,
  onClose,
}) => {
  const { customDictionary, addToDictionary, removeFromDictionary } = useSpellCheck();
  const [newWord, setNewWord] = useState('');
  const [searchFilter, setSearchFilter] = useState('');
  const [addedFeedback, setAddedFeedback] = useState(false);

  const handleAdd = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const clean = newWord.trim();
    if (!clean) return;

    addToDictionary(clean);
    setNewWord('');
    setAddedFeedback(true);
    setTimeout(() => setAddedFeedback(false), 2000);
  };

  const filteredWords = customDictionary.filter((w) =>
    w.toLowerCase().includes(searchFilter.toLowerCase().trim())
  );

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          key="dictionary-modal-backdrop"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.18 }}
          onClick={(e) => {
            if (e.target === e.currentTarget) onClose();
          }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs"
        >
          <motion.div
            key="dictionary-modal-card"
            initial={{ opacity: 0, scale: 0.95, y: 14 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 8 }}
            transition={{ type: 'spring', damping: 26, stiffness: 350 }}
            className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-md overflow-hidden flex flex-col max-h-[85vh]"
          >
            {/* Header */}
        <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/70">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-blue-100 flex items-center justify-center text-blue-600">
              <BookOpen className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900">Custom Word Dictionary</h3>
              <p className="text-xs text-slate-500">
                Words and acronyms you add will never be flagged as typos.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 space-y-4 overflow-y-auto flex-1">
          {/* Add Word Form */}
          <form onSubmit={handleAdd} className="space-y-2">
            <label className="block text-xs font-semibold text-slate-700">Add New Word or Acronym</label>
            <div className="flex gap-2">
              <input
                type="text"
                value={newWord}
                onChange={(e) => setNewWord(e.target.value)}
                placeholder="e.g. Microfrontend, Kubernetes, FinTech"
                className="flex-1 px-3 py-2 text-xs rounded-xl border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none text-slate-800"
              />
              <button
                type="submit"
                disabled={!newWord.trim()}
                className="px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-semibold text-xs flex items-center gap-1 transition-colors cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add</span>
              </button>
            </div>
            {addedFeedback && (
              <p className="text-[11px] text-emerald-600 flex items-center gap-1 font-medium">
                <Check className="w-3 h-3" /> Word added to your dictionary!
              </p>
            )}
          </form>

          {/* Search & List */}
          <div className="space-y-2 pt-2 border-t border-slate-100">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-700">
                Saved Words ({customDictionary.length})
              </span>
              {customDictionary.length > 5 && (
                <div className="relative w-36">
                  <Search className="w-3 h-3 text-slate-400 absolute left-2 top-2" />
                  <input
                    type="text"
                    value={searchFilter}
                    onChange={(e) => setSearchFilter(e.target.value)}
                    placeholder="Search..."
                    className="w-full pl-6 pr-2 py-1 text-[11px] rounded-lg border border-slate-200 outline-none"
                  />
                </div>
              )}
            </div>

            {customDictionary.length === 0 ? (
              <div className="text-center py-8 px-4 bg-slate-50 rounded-xl border border-dashed border-slate-200">
                <ShieldCheck className="w-8 h-8 text-slate-300 mx-auto mb-1.5" />
                <p className="text-xs text-slate-500 font-medium">No custom words yet.</p>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  Click &quot;Add to Dict&quot; on any flagged word in the editor to save it here.
                </p>
              </div>
            ) : filteredWords.length === 0 ? (
              <div className="text-center py-4 text-xs text-slate-400">
                No matching words found.
              </div>
            ) : (
              <div className="flex flex-wrap gap-1.5 max-h-48 overflow-y-auto p-2 bg-slate-50 rounded-xl border border-slate-100">
                {filteredWords.map((word) => (
                  <span
                    key={word}
                    className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white border border-slate-200 text-xs font-medium text-slate-700 shadow-2xs group"
                  >
                    <span>{word}</span>
                    <button
                      type="button"
                      onClick={() => removeFromDictionary(word)}
                      className="text-slate-300 group-hover:text-rose-500 transition-colors cursor-pointer"
                      title="Remove from dictionary"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="px-5 py-3 border-t border-slate-100 bg-slate-50 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-1.5 rounded-xl bg-white border border-slate-200 hover:bg-slate-100 text-slate-700 font-semibold text-xs transition-colors cursor-pointer"
          >
            Done
          </button>
        </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
