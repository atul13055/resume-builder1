import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ResumeData, AITailorResult, ExperienceItem } from '../../types/resume';
import {
  X,
  Sparkles,
  ArrowRight,
  Check,
  Loader2,
  FileText,
  Briefcase,
  Tag,
  TrendingUp,
  RefreshCw,
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface AITailorModalProps {
  isOpen: boolean;
  onClose: () => void;
  resume: ResumeData;
  onApplyTailoring: (tailoredResume: ResumeData) => void;
}

export const AITailorModal: React.FC<AITailorModalProps> = ({
  isOpen,
  onClose,
  resume,
  onApplyTailoring,
}) => {
  const [jobDescription, setJobDescription] = useState('');
  const [isTailoring, setIsTailoring] = useState(false);
  const [tailorResult, setTailorResult] = useState<AITailorResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Selected toggles for what to apply
  const [applySummary, setApplySummary] = useState(true);
  const [applyBullets, setApplyBullets] = useState(true);
  const [applySkills, setApplySkills] = useState(true);

  const handleTailor = async () => {
    if (!jobDescription.trim()) {
      setError('Please paste a job description first.');
      return;
    }

    try {
      setIsTailoring(true);
      setError(null);

      const res = await fetch('/api/ai/tailor', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          resumeData: resume,
          jobDescription: jobDescription.trim(),
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Failed to tailor resume.');
      }

      const data = await res.json();
      setTailorResult(data);

      confetti({
        particleCount: 40,
        spread: 50,
        origin: { y: 0.7 },
      });
    } catch (err: any) {
      setError(err.message || 'AI Tailoring failed.');
    } finally {
      setIsTailoring(false);
    }
  };

  const handleApplyToResume = () => {
    if (!tailorResult) return;

    const updatedResume: ResumeData = { ...resume };

    if (applySummary && tailorResult.tailoredSummary) {
      updatedResume.summary = tailorResult.tailoredSummary;
      if (tailorResult.tailoredHeadline) {
        updatedResume.personalInfo = {
          ...updatedResume.personalInfo,
          title: tailorResult.tailoredHeadline,
        };
      }
    }

    if (applyBullets && tailorResult.tailoredExperiences?.length) {
      updatedResume.experience = updatedResume.experience.map((exp, idx) => {
        const tailored = tailorResult.tailoredExperiences[idx];
        if (tailored && tailored.tailoredBullets?.length) {
          return {
            ...exp,
            bullets: tailored.tailoredBullets,
          };
        }
        return exp;
      });
    }

    if (applySkills && tailorResult.recommendedSkillsToAdd?.length) {
      const existingNames = new Set(updatedResume.skills.map((s) => s.name.toLowerCase()));
      const newSkills = tailorResult.recommendedSkillsToAdd
        .filter((s) => !existingNames.has(s.toLowerCase()))
        .map((s) => ({
          id: `skill-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
          name: s,
          category: 'Technical' as const,
          level: 'Advanced' as const,
        }));

      updatedResume.skills = [...updatedResume.skills, ...newSkills];
    }

    onApplyTailoring(updatedResume);
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          key="tailor-modal-backdrop"
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
            key="tailor-modal-card"
            initial={{ opacity: 0, scale: 0.95, y: 14 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 8 }}
            transition={{ type: 'spring', damping: 26, stiffness: 350 }}
            className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden border border-slate-200"
          >
            {/* Modal Header */}
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-gradient-to-r from-indigo-50 to-blue-50">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-indigo-600 text-white flex items-center justify-center font-bold shadow-xs">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900">AI Job Tailoring Assistant</h2>
              <p className="text-xs text-slate-600">
                Align summary, bullet points, and skills to target job descriptions for 90%+ ATS matches.
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

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Step 1: Input Job Description */}
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <label className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                1. Paste Target Job Description / Posting
              </label>
              <span className="text-[11px] text-slate-500">
                Include responsibilities, required qualifications & stack
              </span>
            </div>

            <textarea
              rows={4}
              value={jobDescription}
              onChange={(e) => setJobDescription(e.target.value)}
              placeholder="Paste job posting text here (e.g. 'We are seeking a Senior Full-Stack Engineer with 5+ years building scalable React & Go microservices, experience with AWS ECS, distributed systems, and CI/CD...')"
              className="w-full p-3 text-xs rounded-xl border border-slate-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 outline-none transition-all text-slate-800"
            />

            <div className="flex justify-between items-center">
              {error ? <span className="text-xs text-rose-600">{error}</span> : <div />}
              <button
                id="run-tailor-btn"
                onClick={handleTailor}
                disabled={isTailoring || !jobDescription.trim()}
                className="px-4 py-2 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 rounded-xl transition-all shadow-xs flex items-center gap-1.5 cursor-pointer ml-auto"
              >
                {isTailoring ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Sparkles className="w-3.5 h-3.5" />}
                <span>{isTailoring ? 'Analyzing & Rewriting...' : 'Tailor My Resume with AI'}</span>
              </button>
            </div>
          </div>

          {/* Step 2: Tailoring Results Diff & Recommendations */}
          {tailorResult && (
            <div className="space-y-6 pt-4 border-t border-slate-200">
              {/* Match Boost Score Card */}
              <div className="p-4 bg-gradient-to-r from-emerald-500/10 via-indigo-500/10 to-blue-500/10 border border-indigo-200 rounded-2xl flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <div className="text-center">
                      <span className="text-[10px] text-slate-500 font-bold uppercase">Before</span>
                      <p className="text-lg font-mono font-bold text-slate-600">
                        {tailorResult.matchScoreBefore}%
                      </p>
                    </div>
                    <ArrowRight className="w-4 h-4 text-slate-400" />
                    <div className="text-center">
                      <span className="text-[10px] text-emerald-700 font-bold uppercase">Tailored</span>
                      <p className="text-xl font-mono font-black text-emerald-600">
                        {tailorResult.matchScoreAfter}%
                      </p>
                    </div>
                  </div>
                  <div className="h-8 w-px bg-slate-300 hidden sm:block" />
                  <div>
                    <h4 className="text-xs font-bold text-slate-900">
                      Target Role Match: {tailorResult.jobTitleMatch || 'Target Role'}
                    </h4>
                    <p className="text-[11px] text-slate-600">
                      Embedded {tailorResult.topKeywordsEmbedded?.length || 5} core job keywords with quantifiable metrics.
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <label className="flex items-center gap-1.5 text-xs font-semibold text-slate-700 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={applySummary}
                      onChange={(e) => setApplySummary(e.target.checked)}
                      className="rounded text-indigo-600"
                    />
                    Summary
                  </label>
                  <label className="flex items-center gap-1.5 text-xs font-semibold text-slate-700 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={applyBullets}
                      onChange={(e) => setApplyBullets(e.target.checked)}
                      className="rounded text-indigo-600"
                    />
                    Bullets
                  </label>
                  <label className="flex items-center gap-1.5 text-xs font-semibold text-slate-700 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={applySkills}
                      onChange={(e) => setApplySkills(e.target.checked)}
                      className="rounded text-indigo-600"
                    />
                    Skills
                  </label>
                </div>
              </div>

              {/* Tailored Professional Summary Diff */}
              <div className="space-y-2">
                <span className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                  <FileText className="w-4 h-4 text-indigo-600" /> Tailored Professional Summary
                </span>
                <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded">
                      Tailored Version
                    </span>
                  </div>
                  <p className="text-xs text-slate-800 leading-relaxed font-medium">
                    {tailorResult.tailoredSummary}
                  </p>
                </div>
              </div>

              {/* Tailored Experience Bullets Diff */}
              {tailorResult.tailoredExperiences?.length > 0 && (
                <div className="space-y-3">
                  <span className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                    <Briefcase className="w-4 h-4 text-indigo-600" /> Tailored Experience Bullets (XYZ Formula)
                  </span>
                  <div className="space-y-3">
                    {tailorResult.tailoredExperiences.map((exp, idx) => (
                      <div key={idx} className="p-3.5 bg-white border border-slate-200 rounded-xl space-y-2 shadow-2xs">
                        <div className="flex justify-between items-center border-b border-slate-100 pb-1.5">
                          <span className="text-xs font-bold text-slate-900">
                            {exp.role} at {exp.company}
                          </span>
                          {exp.enhancementReason && (
                            <span className="text-[10px] text-slate-500 italic">
                              {exp.enhancementReason}
                            </span>
                          )}
                        </div>
                        <ul className="list-disc list-outside pl-4 space-y-1 text-xs text-slate-800">
                          {exp.tailoredBullets.map((b, bIdx) => (
                            <li key={bIdx} className="leading-snug">{b}</li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Recommended Skills to Add */}
              {tailorResult.recommendedSkillsToAdd?.length > 0 && (
                <div className="space-y-2">
                  <span className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                    <Tag className="w-4 h-4 text-indigo-600" /> Recommended High-Match Skills to Add
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {tailorResult.recommendedSkillsToAdd.map((s, idx) => (
                      <span
                        key={idx}
                        className="px-2.5 py-1 text-xs font-semibold bg-indigo-50 text-indigo-800 border border-indigo-200 rounded-lg"
                      >
                        + {s}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-3.5 border-t border-slate-200 bg-slate-50 flex items-center justify-between">
          <button
            onClick={onClose}
            className="px-4 py-1.5 text-xs font-bold text-slate-600 hover:text-slate-900 cursor-pointer"
          >
            Cancel
          </button>

          {tailorResult && (
            <button
              id="apply-tailor-btn"
              onClick={handleApplyToResume}
              className="px-5 py-2 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl transition-all shadow-xs flex items-center gap-1.5 cursor-pointer"
            >
              <Check className="w-4 h-4" />
              <span>Apply Tailored Content to Resume</span>
            </button>
          )}
        </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
