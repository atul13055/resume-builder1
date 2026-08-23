import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ResumeData } from '../../types/resume';
import { X, Sparkles, Copy, Check, Download, Loader2, FileText } from 'lucide-react';

interface AICoverLetterModalProps {
  isOpen: boolean;
  onClose: () => void;
  resume: ResumeData;
}

export const AICoverLetterModal: React.FC<AICoverLetterModalProps> = ({
  isOpen,
  onClose,
  resume,
}) => {
  const [jobDescription, setJobDescription] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [jobTitle, setJobTitle] = useState(resume?.personalInfo?.title || '');
  const [hiringManager, setHiringManager] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [coverLetter, setCoverLetter] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGenerate = async () => {
    try {
      setIsGenerating(true);
      setError(null);

      const res = await fetch('/api/ai/cover-letter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          resumeData: resume,
          companyName: companyName.trim() || 'Hiring Team',
          jobTitle: jobTitle.trim() || resume?.personalInfo?.title || 'Professional',
          jobDescription: jobDescription.trim() || undefined,
          hiringManager: hiringManager.trim() || undefined,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Failed to draft cover letter.');
      }

      const data = await res.json();
      setCoverLetter(data.coverLetter);
    } catch (err: any) {
      setError(err.message || 'AI Cover Letter generation failed.');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCopy = () => {
    if (!coverLetter) return;
    navigator.clipboard.writeText(coverLetter);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadTxt = () => {
    if (!coverLetter) return;
    const blob = new Blob([coverLetter], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${resume?.personalInfo?.fullName || 'Candidate'}_Cover_Letter.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          key="cover-letter-backdrop"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.18 }}
          onClick={(e) => {
            if (e.target === e.currentTarget) onClose();
          }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs"
        >
          <motion.div
            key="cover-letter-card"
            initial={{ opacity: 0, scale: 0.95, y: 14 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 8 }}
            transition={{ type: 'spring', damping: 26, stiffness: 350 }}
            className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl max-h-[90vh] flex flex-col overflow-hidden border border-slate-200"
          >
            {/* Header */}
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-indigo-600 text-white flex items-center justify-center font-bold">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900">AI Tailored Cover Letter Generator</h2>
              <p className="text-xs text-slate-500">
                Craft a tailored, compelling cover letter grounded in your actual career achievements.
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

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Company Name</label>
              <input
                type="text"
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                placeholder="e.g. OpenAI / Stripe / Google"
                className="w-full px-3 py-1.5 text-xs rounded-lg border border-slate-200 focus:border-indigo-500 outline-none text-slate-800"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Target Position</label>
              <input
                type="text"
                value={jobTitle}
                onChange={(e) => setJobTitle(e.target.value)}
                placeholder="Senior Full Stack Engineer"
                className="w-full px-3 py-1.5 text-xs rounded-lg border border-slate-200 focus:border-indigo-500 outline-none text-slate-800"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Hiring Manager (Optional)</label>
              <input
                type="text"
                value={hiringManager}
                onChange={(e) => setHiringManager(e.target.value)}
                placeholder="e.g. Sarah Connor / Engineering Lead"
                className="w-full px-3 py-1.5 text-xs rounded-lg border border-slate-200 focus:border-indigo-500 outline-none text-slate-800"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Job Description / Key Requirements (Optional for deeper tailoring)
            </label>
            <textarea
              rows={3}
              value={jobDescription}
              onChange={(e) => setJobDescription(e.target.value)}
              placeholder="Paste job details to tailor narrative specifically to what the recruiter is looking for..."
              className="w-full p-2.5 text-xs rounded-lg border border-slate-200 focus:border-indigo-500 outline-none text-slate-800"
            />
          </div>

          <div className="flex justify-between items-center">
            {error && <span className="text-xs text-rose-600">{error}</span>}
            <button
              onClick={handleGenerate}
              disabled={isGenerating}
              className="ml-auto px-4 py-2 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl transition-all shadow-xs flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
            >
              {isGenerating ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Sparkles className="w-3.5 h-3.5" />}
              <span>{isGenerating ? 'Writing Cover Letter...' : 'Generate Letter with AI'}</span>
            </button>
          </div>

          {/* Generated Cover Letter output */}
          {coverLetter && (
            <div className="space-y-2 pt-3 border-t border-slate-200">
              <div className="flex justify-between items-center">
                <span className="text-xs font-bold text-slate-800">Generated Cover Letter</span>
                <div className="flex items-center gap-2">
                  <button
                    onClick={handleCopy}
                    className="flex items-center gap-1 px-2.5 py-1 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors cursor-pointer"
                  >
                    {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copied ? 'Copied!' : 'Copy Text'}</span>
                  </button>
                  <button
                    onClick={handleDownloadTxt}
                    className="flex items-center gap-1 px-2.5 py-1 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors cursor-pointer"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Download (.txt)</span>
                  </button>
                </div>
              </div>

              <textarea
                rows={12}
                value={coverLetter}
                onChange={(e) => setCoverLetter(e.target.value)}
                className="w-full p-4 text-xs leading-relaxed font-sans bg-slate-50 border border-slate-200 rounded-xl outline-none text-slate-800"
              />
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-slate-200 bg-slate-50 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-1.5 text-xs font-bold text-slate-600 hover:text-slate-900 cursor-pointer"
          >
            Close
          </button>
        </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
