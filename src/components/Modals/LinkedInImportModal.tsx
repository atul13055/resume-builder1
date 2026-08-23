import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ResumeData } from '../../types/resume';
import {
  Linkedin,
  Sparkles,
  X,
  CheckCircle2,
  AlertCircle,
  Loader2,
  FileText,
  User,
  Briefcase,
  GraduationCap,
  Tag,
  ArrowRight,
  RefreshCw,
  ExternalLink,
  ClipboardPaste,
} from 'lucide-react';

interface LinkedInImportModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApplyResume: (importedResume: ResumeData, mode: 'replace' | 'merge') => void;
}

export const LinkedInImportModal: React.FC<LinkedInImportModalProps> = ({
  isOpen,
  onClose,
  onApplyResume,
}) => {
  const [activeTab, setActiveTab] = useState<'url' | 'text'>('url');
  const [linkedinUrl, setLinkedinUrl] = useState('https://www.linkedin.com/in/alexander-wright-dev');
  const [rawText, setRawText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [step, setStep] = useState<'input' | 'preview'>('input');
  const [parsedData, setParsedData] = useState<ResumeData | null>(null);
  const [importMode, setImportMode] = useState<'replace' | 'merge'>('replace');

  const handleStartImport = async () => {
    setError(null);

    if (activeTab === 'url' && !linkedinUrl.trim()) {
      setError('Please enter a valid LinkedIn profile URL (e.g. linkedin.com/in/username).');
      return;
    }

    if (activeTab === 'text' && !rawText.trim()) {
      setError('Please paste your LinkedIn profile text or bio summary.');
      return;
    }

    try {
      setIsLoading(true);

      const response = await fetch('/api/ai/import-linkedin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          linkedinUrl: activeTab === 'url' ? linkedinUrl.trim() : undefined,
          rawContent: activeTab === 'text' ? rawText.trim() : undefined,
        }),
      });

      if (!response.ok) {
        const errData = await response.json().catch(() => ({}));
        throw new Error(errData.error || 'Failed to import and parse LinkedIn profile.');
      }

      const data: ResumeData = await response.json();
      setParsedData(data);
      setStep('preview');
    } catch (err: any) {
      console.error('LinkedIn parse error:', err);
      setError(err.message || 'An unexpected error occurred while parsing the profile.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleApply = () => {
    if (!parsedData) return;
    onApplyResume(parsedData, importMode);
    onClose();
    // Reset modal state
    setStep('input');
    setParsedData(null);
  };

  const handleTrySampleProfile = (handle: string, role: string) => {
    setLinkedinUrl(`https://www.linkedin.com/in/${handle}`);
    setActiveTab('url');
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          key="linkedin-modal-backdrop"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.18 }}
          onClick={(e) => {
            if (e.target === e.currentTarget) onClose();
          }}
          className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4"
        >
          <motion.div
            key="linkedin-modal-card"
            initial={{ opacity: 0, scale: 0.95, y: 14 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 8 }}
            transition={{ type: 'spring', damping: 26, stiffness: 350 }}
            className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl border border-slate-200 flex flex-col max-h-[90vh] overflow-hidden"
          >
            {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/80">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center shadow-xs">
              <Linkedin className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold text-slate-900">Import from LinkedIn</h2>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-100 text-blue-700 flex items-center gap-1">
                  <Sparkles className="w-2.5 h-2.5" /> AI Parser
                </span>
              </div>
              <p className="text-xs text-slate-500">
                Extract work history, education, skills, and summary automatically to pre-fill your resume
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-200/50 rounded-lg transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-5">
          {step === 'input' ? (
            <>
              {/* Tab Selector */}
              <div className="flex p-1 bg-slate-100 rounded-xl max-w-sm">
                <button
                  onClick={() => setActiveTab('url')}
                  className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                    activeTab === 'url'
                      ? 'bg-white text-blue-600 shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <Linkedin className="w-3.5 h-3.5" />
                  <span>Profile URL</span>
                </button>
                <button
                  onClick={() => setActiveTab('text')}
                  className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                    activeTab === 'text'
                      ? 'bg-white text-blue-600 shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <ClipboardPaste className="w-3.5 h-3.5" />
                  <span>Paste Text / Bio</span>
                </button>
              </div>

              {/* URL Input Form */}
              {activeTab === 'url' ? (
                <div className="space-y-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">
                      Public LinkedIn Profile Link
                    </label>
                    <div className="relative">
                      <Linkedin className="w-4 h-4 text-blue-600 absolute left-3.5 top-3 pointer-events-none" />
                      <input
                        id="input-linkedin-url"
                        type="text"
                        value={linkedinUrl}
                        onChange={(e) => setLinkedinUrl(e.target.value)}
                        placeholder="https://www.linkedin.com/in/username"
                        className="w-full pl-10 pr-3 py-2.5 text-xs rounded-xl border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition-all text-slate-800 font-medium"
                      />
                    </div>
                    <p className="text-[11px] text-slate-500 mt-1">
                      Works with any public LinkedIn profile URL. Gemini extracts and converts career milestones into action-oriented bullet points.
                    </p>
                  </div>

                  {/* Sample profile quick links */}
                  <div className="pt-2">
                    <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1.5">
                      Quick Try Samples:
                    </span>
                    <div className="flex flex-wrap gap-2">
                      <button
                        type="button"
                        onClick={() => handleTrySampleProfile('alexander-wright-dev', 'Software Engineer')}
                        className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold transition-colors cursor-pointer"
                      >
                        Software Engineer
                      </button>
                      <button
                        type="button"
                        onClick={() => handleTrySampleProfile('sarah-chen-product', 'Product Leader')}
                        className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold transition-colors cursor-pointer"
                      >
                        Product Manager
                      </button>
                      <button
                        type="button"
                        onClick={() => handleTrySampleProfile('elena-rostova-growth', 'Growth & Marketing')}
                        className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold transition-colors cursor-pointer"
                      >
                        Marketing Director
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="space-y-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">
                      Paste Profile Content, About Section or Work Experience
                    </label>
                    <textarea
                      id="input-linkedin-raw-text"
                      rows={6}
                      value={rawText}
                      onChange={(e) => setRawText(e.target.value)}
                      placeholder="Paste your LinkedIn 'About', 'Experience', 'Education', or full profile export text here..."
                      className="w-full p-3 text-xs rounded-xl border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition-all text-slate-800 leading-relaxed font-mono resize-none"
                    />
                    <p className="text-[11px] text-slate-500 mt-1">
                      Gemini will structure unformatted text into clean categories, calculate dates, and format achievements.
                    </p>
                  </div>
                </div>
              )}

              {/* Error Message */}
              {error && (
                <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold">Import Notice: </span>
                    <span>{error}</span>
                  </div>
                </div>
              )}

              {/* Feature Highlights */}
              <div className="grid grid-cols-3 gap-3 pt-2">
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 text-center">
                  <Briefcase className="w-4 h-4 text-blue-600 mx-auto mb-1" />
                  <span className="text-[11px] font-bold text-slate-800 block">Work History</span>
                  <span className="text-[10px] text-slate-500">Auto-bullet metrics</span>
                </div>
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 text-center">
                  <Tag className="w-4 h-4 text-emerald-600 mx-auto mb-1" />
                  <span className="text-[11px] font-bold text-slate-800 block">Skills Matrix</span>
                  <span className="text-[10px] text-slate-500">Categorized keywords</span>
                </div>
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 text-center">
                  <GraduationCap className="w-4 h-4 text-purple-600 mx-auto mb-1" />
                  <span className="text-[11px] font-bold text-slate-800 block">Degrees & Certs</span>
                  <span className="text-[10px] text-slate-500">Standardized ATS</span>
                </div>
              </div>
            </>
          ) : (
            /* Preview Parsed Data Step */
            parsedData && (
              <div className="space-y-4">
                <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-900 flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                    <div>
                      <h4 className="text-xs font-bold">Profile Parsed Successfully!</h4>
                      <p className="text-[11px] text-emerald-700">
                        Review the extracted details below before applying to your resume.
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => setStep('input')}
                    className="text-xs font-bold text-emerald-800 hover:underline flex items-center gap-1 cursor-pointer"
                  >
                    <RefreshCw className="w-3 h-3" /> Re-parse
                  </button>
                </div>

                {/* Candidate Overview Card */}
                <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/60 space-y-2">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-sm font-black text-slate-900">
                        {parsedData.personalInfo?.fullName || 'Candidate Name'}
                      </h3>
                      <p className="text-xs font-semibold text-blue-600">
                        {parsedData.personalInfo?.title || 'Professional Title'}
                      </p>
                    </div>
                    <span className="text-xs text-slate-500 font-medium">
                      {parsedData.personalInfo?.location}
                    </span>
                  </div>

                  {parsedData.summary && (
                    <p className="text-xs text-slate-600 leading-relaxed italic border-t border-slate-200/60 pt-2">
                      "{parsedData.summary}"
                    </p>
                  )}
                </div>

                {/* Extracted Stats */}
                <div className="grid grid-cols-3 gap-2 text-center text-xs">
                  <div className="p-2.5 bg-white border border-slate-200 rounded-lg">
                    <span className="font-bold text-slate-900 block">
                      {parsedData.experience?.length || 0}
                    </span>
                    <span className="text-[10px] text-slate-500">Experiences</span>
                  </div>
                  <div className="p-2.5 bg-white border border-slate-200 rounded-lg">
                    <span className="font-bold text-slate-900 block">
                      {parsedData.education?.length || 0}
                    </span>
                    <span className="text-[10px] text-slate-500">Educations</span>
                  </div>
                  <div className="p-2.5 bg-white border border-slate-200 rounded-lg">
                    <span className="font-bold text-slate-900 block">
                      {parsedData.skills?.length || 0}
                    </span>
                    <span className="text-[10px] text-slate-500">Skills</span>
                  </div>
                </div>

                {/* Work Experience Sample list */}
                {parsedData.experience && parsedData.experience.length > 0 && (
                  <div className="space-y-2">
                    <h5 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                      Extracted Experience Roles:
                    </h5>
                    <div className="space-y-1.5 max-h-36 overflow-y-auto pr-1">
                      {parsedData.experience.map((exp, idx) => (
                        <div
                          key={exp.id || idx}
                          className="p-2 bg-white rounded-lg border border-slate-200 text-xs flex items-center justify-between"
                        >
                          <div>
                            <span className="font-bold text-slate-800">{exp.role}</span>
                            <span className="text-slate-500"> at {exp.company}</span>
                          </div>
                          <span className="text-[10px] text-slate-400 font-medium">
                            {exp.startDate} - {exp.current ? 'Present' : exp.endDate}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Skills tags preview */}
                {parsedData.skills && parsedData.skills.length > 0 && (
                  <div className="space-y-1.5">
                    <h5 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                      Extracted Skills:
                    </h5>
                    <div className="flex flex-wrap gap-1.5">
                      {parsedData.skills.slice(0, 10).map((skill, idx) => (
                        <span
                          key={skill.id || idx}
                          className="text-[11px] font-semibold px-2 py-0.5 bg-slate-100 text-slate-700 rounded-md border border-slate-200"
                        >
                          {skill.name}
                        </span>
                      ))}
                      {parsedData.skills.length > 10 && (
                        <span className="text-[10px] font-bold text-slate-400 px-1 py-0.5">
                          +{parsedData.skills.length - 10} more
                        </span>
                      )}
                    </div>
                  </div>
                )}

                {/* Import Mode Radio Choice */}
                <div className="pt-2 border-t border-slate-100 flex items-center gap-4 text-xs">
                  <span className="font-bold text-slate-700">Apply Method:</span>
                  <label className="flex items-center gap-1.5 cursor-pointer">
                    <input
                      type="radio"
                      name="importMode"
                      checked={importMode === 'replace'}
                      onChange={() => setImportMode('replace')}
                      className="text-blue-600"
                    />
                    <span className="font-semibold text-slate-800">Replace Entire Resume</span>
                  </label>
                  <label className="flex items-center gap-1.5 cursor-pointer">
                    <input
                      type="radio"
                      name="importMode"
                      checked={importMode === 'merge'}
                      onChange={() => setImportMode('merge')}
                      className="text-blue-600"
                    />
                    <span className="font-semibold text-slate-800">Merge with Existing</span>
                  </label>
                </div>
              </div>
            )
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-3.5 border-t border-slate-100 bg-slate-50 flex items-center justify-between">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-bold text-slate-600 hover:text-slate-900 transition-colors cursor-pointer"
          >
            Cancel
          </button>

          {step === 'input' ? (
            <button
              id="btn-parse-linkedin"
              onClick={handleStartImport}
              disabled={isLoading}
              className="px-5 py-2 rounded-xl text-xs font-bold text-white bg-blue-600 hover:bg-blue-500 transition-all flex items-center gap-2 shadow-xs cursor-pointer disabled:opacity-50"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>Parsing Profile with Gemini...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                  <span>Fetch & AI Parse</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </>
              )}
            </button>
          ) : (
            <button
              id="btn-apply-linkedin-data"
              onClick={handleApply}
              className="px-5 py-2 rounded-xl text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-500 transition-all flex items-center gap-1.5 shadow-xs cursor-pointer"
            >
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Apply to Resume Editor</span>
            </button>
          )}
        </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
