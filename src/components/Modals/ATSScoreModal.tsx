import React, { useState, useMemo } from 'react';
import { ResumeData, ATSAnalysisResult, SkillItem } from '../../types/resume';
import {
  extractAndAnalyzeKeywords,
  ExtractedKeyword,
  highlightMatchedText,
} from '../../utils/keywordExtractor';
import {
  X,
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  Zap,
  Target,
  FileSearch,
  Loader2,
  Check,
  Plus,
  Copy,
  Search,
  Layers,
  ArrowRight,
  Eye,
  Briefcase,
  BookOpen,
  Code2,
  User,
  Info,
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface ATSScoreModalProps {
  isOpen: boolean;
  onClose: () => void;
  resume: ResumeData;
  liveAtsResult: ATSAnalysisResult;
  onOpenTailorModal: () => void;
  onUpdateResume?: (updated: ResumeData) => void;
}

const SAMPLE_JOB_DESCRIPTIONS: { label: string; role: string; jd: string }[] = [
  {
    label: 'Senior Full-Stack Engineer',
    role: 'Full Stack Engineer',
    jd: `We are looking for a Senior Full-Stack Engineer to build scalable microservices and responsive web applications.
Requirements:
- 5+ years of experience with TypeScript, React, Node.js, and modern CSS/Tailwind.
- Proven experience architecting microservices architecture with Docker, Kubernetes, and AWS (Lambda, S3, RDS).
- Strong proficiency with PostgreSQL, Redis caching, and GraphQL / RESTful APIs.
- Experience with automated CI/CD pipelines, Jest unit testing, and end-to-end testing with Cypress.
- Solid understanding of system design, performance optimization, agile/scrum methodologies, and cross-functional team collaboration.`,
  },
  {
    label: 'Frontend / React Specialist',
    role: 'Senior Frontend Engineer',
    jd: `Seeking a passionate Senior Frontend Engineer to lead user experience design and UI architecture.
Key Qualifications:
- Expert in TypeScript, React, Next.js, and state management (Redux / Zustand).
- Deep experience with responsive design, web accessibility (WCAG 2.1 compliance), and performance optimization.
- Proficiency in unit testing with Jest, React Testing Library, and Figma design handoff.
- Familiarity with CI/CD, Git version control, and client-side telemetry/analytics.`,
  },
  {
    label: 'DevOps & Cloud Engineer',
    role: 'DevOps / Cloud Architect',
    jd: `Seeking a Cloud Platform Engineer to automate cloud infrastructure and deployment pipelines.
Responsibilities:
- Build and maintain Infrastructure as Code using Terraform and Ansible on AWS / GCP.
- Manage Docker containers and production Kubernetes clusters with automated monitoring.
- Build resilient CI/CD pipelines with GitHub Actions, Jenkins, and automated security scans.
- Experience with Linux administration, Python scripting, PostgreSQL database optimization, and distributed systems reliability.`,
  },
];

export const ATSScoreModal: React.FC<ATSScoreModalProps> = ({
  isOpen,
  onClose,
  resume,
  liveAtsResult,
  onOpenTailorModal,
  onUpdateResume,
}) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'keywords' | 'highlightView'>('keywords');
  const [jobDescription, setJobDescription] = useState('');
  const [isAnalyzingAi, setIsAnalyzingAi] = useState(false);
  const [aiReport, setAiReport] = useState<ATSAnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Keyword Inspector State
  const [selectedMissingKeyword, setSelectedMissingKeyword] = useState<ExtractedKeyword | null>(null);
  const [keywordFilter, setKeywordFilter] = useState<'all' | 'missing' | 'matched'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [copiedTerm, setCopiedTerm] = useState<string | null>(null);
  const [addedSkillAlert, setAddedSkillAlert] = useState<string | null>(null);
  const [highlightAllPlacements, setHighlightAllPlacements] = useState(true);

  if (!isOpen) return null;

  // Real-time local keyword extraction & matching against resume
  const keywordAnalysis = useMemo(() => {
    return extractAndAnalyzeKeywords(jobDescription, resume);
  }, [jobDescription, resume]);

  const currentReport = aiReport || liveAtsResult;
  const score = currentReport.overallScore;

  const handleRunAiAudit = async () => {
    try {
      setIsAnalyzingAi(true);
      setError(null);

      const res = await fetch('/api/ai/score-ats', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          resumeData: resume,
          jobDescription: jobDescription.trim() || undefined,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Failed to complete AI ATS audit.');
      }

      const data = await res.json();
      setAiReport(data);

      if (data.overallScore >= 80) {
        confetti({
          particleCount: 50,
          spread: 60,
          origin: { y: 0.6 },
        });
      }
    } catch (err: any) {
      setError(err.message || 'AI ATS Audit failed.');
    } finally {
      setIsAnalyzingAi(false);
    }
  };

  const handleCopyPhrase = (phrase: string, term: string) => {
    navigator.clipboard.writeText(phrase);
    setCopiedTerm(term);
    setTimeout(() => setCopiedTerm(null), 2000);
  };

  const handleAddMissingSkillToResume = (keyword: ExtractedKeyword) => {
    if (!onUpdateResume) return;

    // Check if skill already exists
    const exists = (resume.skills || []).some(
      (s) => s.name.toLowerCase() === keyword.term.toLowerCase()
    );

    if (exists) {
      setAddedSkillAlert(`"${keyword.term}" is already in your skills list.`);
      setTimeout(() => setAddedSkillAlert(null), 2500);
      return;
    }

    const newSkill: SkillItem = {
      id: `skill-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      name: keyword.term,
      category: keyword.category === 'Leadership & Soft Skills' ? 'Soft Skills' : 'Technical',
      level: 'Advanced',
    };

    const updatedSkills = [...(resume.skills || []), newSkill];
    onUpdateResume({
      ...resume,
      skills: updatedSkills,
    });

    setAddedSkillAlert(`Added "${keyword.term}" to your resume skills!`);
    setTimeout(() => setAddedSkillAlert(null), 3000);
  };

  const handleInsertBulletToExperience = (keyword: ExtractedKeyword) => {
    if (!onUpdateResume || !resume.experience || resume.experience.length === 0) return;

    const firstExp = resume.experience[0];
    const updatedBullets = [keyword.suggestedPhrase, ...(firstExp.bullets || [])];

    const updatedExperience = resume.experience.map((exp, idx) =>
      idx === 0 ? { ...exp, bullets: updatedBullets } : exp
    );

    onUpdateResume({
      ...resume,
      experience: updatedExperience,
    });

    setAddedSkillAlert(`Inserted tailored accomplishment into ${firstExp.company} experience!`);
    setTimeout(() => setAddedSkillAlert(null), 3000);
  };

  // Filtered keywords for inspector
  const filteredKeywords = useMemo(() => {
    let list = keywordAnalysis.keywords;
    if (keywordFilter === 'missing') list = keywordAnalysis.missingKeywords;
    if (keywordFilter === 'matched') list = keywordAnalysis.matchedKeywords;

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      list = list.filter(
        (k) =>
          k.term.toLowerCase().includes(q) ||
          k.category.toLowerCase().includes(q) ||
          k.suggestedPhrase.toLowerCase().includes(q)
      );
    }
    return list;
  }, [keywordAnalysis, keywordFilter, searchQuery]);

  // List of all matched term strings for highlighting in resume text
  const matchedTermStrings = useMemo(() => {
    return keywordAnalysis.matchedKeywords.map((k) => k.term);
  }, [keywordAnalysis.matchedKeywords]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[92vh] flex flex-col overflow-hidden border border-slate-200">
        {/* Header */}
        <div className="px-5 py-3.5 border-b border-slate-200 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-blue-600 text-white flex items-center justify-center font-bold shadow-xs">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold text-slate-900">ATS Score & Keyword Match Inspector</h2>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-100 text-blue-800 border border-blue-200">
                  Live Scanner
                </span>
              </div>
              <p className="text-xs text-slate-500">
                Identify missing keywords, check recruiter match rates, and highlight keyword density across your resume.
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

        {/* Tab Navigation */}
        <div className="px-5 py-2 bg-slate-100 border-b border-slate-200 flex items-center justify-between gap-2 overflow-x-auto">
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setActiveTab('keywords')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                activeTab === 'keywords'
                  ? 'bg-white text-blue-700 shadow-2xs border border-slate-200'
                  : 'text-slate-600 hover:bg-slate-200/70'
              }`}
            >
              <Target className="w-3.5 h-3.5 text-blue-600" />
              <span>Missing Keywords Inspector</span>
              {keywordAnalysis.missingCount > 0 && (
                <span className="px-1.5 py-0.2 rounded-full text-[10px] font-bold bg-rose-100 text-rose-700 border border-rose-200">
                  {keywordAnalysis.missingCount} Missing
                </span>
              )}
            </button>

            <button
              onClick={() => setActiveTab('highlightView')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                activeTab === 'highlightView'
                  ? 'bg-white text-blue-700 shadow-2xs border border-slate-200'
                  : 'text-slate-600 hover:bg-slate-200/70'
              }`}
            >
              <Eye className="w-3.5 h-3.5 text-emerald-600" />
              <span>Resume Text Highlighter</span>
              {keywordAnalysis.matchedCount > 0 && (
                <span className="px-1.5 py-0.2 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-700 border border-emerald-200">
                  {keywordAnalysis.matchedCount} Matched
                </span>
              )}
            </button>

            <button
              onClick={() => setActiveTab('overview')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                activeTab === 'overview'
                  ? 'bg-white text-blue-700 shadow-2xs border border-slate-200'
                  : 'text-slate-600 hover:bg-slate-200/70'
              }`}
            >
              <Layers className="w-3.5 h-3.5 text-indigo-600" />
              <span>Full ATS Audit & Score</span>
            </button>
          </div>

          {addedSkillAlert && (
            <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-lg animate-in fade-in">
              <Check className="w-3.5 h-3.5" />
              <span>{addedSkillAlert}</span>
            </div>
          )}
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-5 space-y-5">
          {/* Job Description Paste Box (Always Accessible at Top for fast testing) */}
          <div className="p-4 bg-indigo-50/50 border border-indigo-100 rounded-2xl space-y-3">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <div className="flex items-center gap-1.5">
                <Target className="w-4 h-4 text-indigo-600" />
                <span className="text-xs font-bold text-indigo-950">
                  Target Job Description (JD)
                </span>
                <span className="text-[11px] text-slate-500 font-normal">
                  — Paste JD to scan matching & missing keywords in real-time
                </span>
              </div>

              {/* Sample JDs Quick Loader */}
              <div className="flex items-center gap-1">
                <span className="text-[10px] uppercase font-bold text-indigo-500 mr-1">Sample JDs:</span>
                {SAMPLE_JOB_DESCRIPTIONS.map((s, idx) => (
                  <button
                    key={idx}
                    onClick={() => setJobDescription(s.jd)}
                    className="text-[11px] font-semibold px-2 py-0.5 bg-white text-indigo-700 border border-indigo-200 hover:bg-indigo-50 rounded-md transition-colors cursor-pointer"
                  >
                    {s.label}
                  </button>
                ))}
              </div>
            </div>

            <textarea
              rows={3}
              value={jobDescription}
              onChange={(e) => setJobDescription(e.target.value)}
              placeholder="Paste any job description here (e.g. Senior Frontend Engineer with TypeScript, React, Docker, Kubernetes, CI/CD, PostgreSQL, System Design)..."
              className="w-full p-2.5 text-xs bg-white rounded-xl border border-indigo-200 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-400 outline-none text-slate-800 font-sans leading-relaxed"
            />

            {/* Quick Match Stats Bar */}
            <div className="flex items-center justify-between flex-wrap gap-3 pt-1 text-xs">
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1.5">
                  <span className="font-bold text-slate-700">Keyword Match Rate:</span>
                  <span
                    className={`font-mono font-black text-xs px-2 py-0.5 rounded-md ${
                      keywordAnalysis.matchPercentage >= 75
                        ? 'bg-emerald-100 text-emerald-800'
                        : keywordAnalysis.matchPercentage >= 50
                        ? 'bg-blue-100 text-blue-800'
                        : 'bg-rose-100 text-rose-800'
                    }`}
                  >
                    {jobDescription ? `${keywordAnalysis.matchPercentage}%` : 'Paste JD to calculate'}
                  </span>
                </div>

                {jobDescription && (
                  <div className="flex items-center gap-2 text-[11px]">
                    <span className="text-emerald-700 font-semibold flex items-center gap-1">
                      <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block" />
                      {keywordAnalysis.matchedCount} Found
                    </span>
                    <span className="text-rose-700 font-semibold flex items-center gap-1">
                      <span className="w-2 h-2 rounded-full bg-rose-500 inline-block" />
                      {keywordAnalysis.missingCount} Missing
                    </span>
                  </div>
                )}
              </div>

              <button
                onClick={handleRunAiAudit}
                disabled={isAnalyzingAi || !jobDescription}
                className="px-3 py-1 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg transition-all flex items-center gap-1.5 cursor-pointer shadow-xs disabled:opacity-50"
              >
                {isAnalyzingAi ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Sparkles className="w-3.5 h-3.5" />}
                <span>{isAnalyzingAi ? 'Analyzing...' : 'Deep AI ATS Audit'}</span>
              </button>
            </div>
          </div>

          {/* TAB 1: MISSING KEYWORDS INSPECTOR */}
          {activeTab === 'keywords' && (
            <div className="space-y-4">
              {/* Filter and Search toolbar */}
              <div className="flex items-center justify-between flex-wrap gap-2.5">
                <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl border border-slate-200">
                  <button
                    onClick={() => setKeywordFilter('all')}
                    className={`px-2.5 py-1 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                      keywordFilter === 'all'
                        ? 'bg-white text-slate-900 shadow-2xs'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    All ({keywordAnalysis.totalJdKeywords})
                  </button>
                  <button
                    onClick={() => setKeywordFilter('missing')}
                    className={`px-2.5 py-1 text-xs font-bold rounded-lg transition-all cursor-pointer flex items-center gap-1 ${
                      keywordFilter === 'missing'
                        ? 'bg-rose-600 text-white shadow-2xs'
                        : 'text-rose-700 hover:bg-rose-50'
                    }`}
                  >
                    <AlertTriangle className="w-3 h-3" />
                    Missing Only ({keywordAnalysis.missingCount})
                  </button>
                  <button
                    onClick={() => setKeywordFilter('matched')}
                    className={`px-2.5 py-1 text-xs font-bold rounded-lg transition-all cursor-pointer flex items-center gap-1 ${
                      keywordFilter === 'matched'
                        ? 'bg-emerald-600 text-white shadow-2xs'
                        : 'text-emerald-700 hover:bg-emerald-50'
                    }`}
                  >
                    <Check className="w-3 h-3" />
                    Matched Only ({keywordAnalysis.matchedCount})
                  </button>
                </div>

                <div className="relative">
                  <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 transform -translate-y-1/2" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search keywords..."
                    className="pl-8 pr-3 py-1 text-xs rounded-lg border border-slate-200 bg-white text-slate-800 focus:border-blue-500 outline-none w-48"
                  />
                </div>
              </div>

              {!jobDescription ? (
                <div className="p-8 text-center bg-slate-50 border border-slate-200 rounded-2xl space-y-2">
                  <FileSearch className="w-8 h-8 text-slate-400 mx-auto" />
                  <h3 className="text-sm font-bold text-slate-800">No Job Description Entered Yet</h3>
                  <p className="text-xs text-slate-500 max-w-md mx-auto">
                    Paste a job description or select one of the sample presets above to extract missing technical keywords and view highlight suggestions.
                  </p>
                </div>
              ) : filteredKeywords.length === 0 ? (
                <div className="p-8 text-center bg-slate-50 border border-slate-200 rounded-2xl">
                  <p className="text-xs text-slate-500">No keywords found matching current filter/search.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {filteredKeywords.map((kw, i) => {
                    const isSelected = selectedMissingKeyword?.term === kw.term;
                    return (
                      <div
                        key={i}
                        className={`p-3.5 rounded-xl border transition-all flex flex-col justify-between space-y-2.5 ${
                          kw.isMatched
                            ? 'bg-emerald-50/40 border-emerald-200 hover:border-emerald-300'
                            : isSelected
                            ? 'bg-rose-50/70 border-rose-400 ring-2 ring-rose-400/30 shadow-xs'
                            : 'bg-white border-slate-200 hover:border-slate-300 hover:shadow-2xs'
                        }`}
                      >
                        {/* Keyword Header */}
                        <div>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <span className="text-xs font-bold text-slate-900">{kw.term}</span>
                              <span
                                className={`text-[9px] font-bold px-1.5 py-0.2 rounded ${
                                  kw.isMatched
                                    ? 'bg-emerald-100 text-emerald-800'
                                    : 'bg-rose-100 text-rose-800'
                                }`}
                              >
                                {kw.isMatched ? 'MATCHED IN RESUME' : 'MISSING FROM RESUME'}
                              </span>
                            </div>

                            <span className="text-[10px] text-slate-400 font-mono">
                              {kw.countInJd}x in JD
                            </span>
                          </div>

                          <div className="flex items-center gap-1.5 mt-1">
                            <span className="text-[10px] px-1.5 py-0.2 bg-slate-100 text-slate-600 rounded">
                              {kw.category}
                            </span>
                            <span className="text-[10px] text-slate-400">
                              Priority: <strong className={kw.importance === 'High' ? 'text-rose-600' : 'text-slate-600'}>{kw.importance}</strong>
                            </span>
                          </div>

                          {/* Where it appears if matched */}
                          {kw.isMatched && kw.occurrencesInResume.length > 0 && (
                            <div className="mt-2 text-[11px] text-emerald-900 bg-emerald-100/60 p-2 rounded-lg space-y-0.5">
                              <div className="font-semibold text-[10px] text-emerald-800 uppercase">
                                Found in: {kw.occurrencesInResume.map((o) => o.section).join(', ')}
                              </div>
                              <p className="italic text-emerald-950 line-clamp-2">
                                "{kw.occurrencesInResume[0].snippet}"
                              </p>
                            </div>
                          )}

                          {/* Missing Keyword Tailored Suggestion */}
                          {!kw.isMatched && (
                            <div className="mt-2 text-[11px] bg-slate-50 border border-slate-200 p-2 rounded-lg space-y-1">
                              <div className="flex items-center justify-between text-[10px] text-slate-500 font-semibold uppercase">
                                <span>Suggested Resume Context:</span>
                                <span>Target: {kw.suggestedPlacementSection}</span>
                              </div>
                              <p className="text-slate-800 font-medium leading-relaxed">
                                "{kw.suggestedPhrase}"
                              </p>
                            </div>
                          )}
                        </div>

                        {/* Action buttons for missing keywords */}
                        {!kw.isMatched && (
                          <div className="flex items-center gap-1.5 pt-1 border-t border-slate-100">
                            <button
                              onClick={() => handleAddMissingSkillToResume(kw)}
                              className="px-2.5 py-1 text-[11px] font-bold text-blue-700 bg-blue-50 hover:bg-blue-100 rounded-md transition-colors flex items-center gap-1 cursor-pointer"
                              title="Add to Skills section in resume"
                            >
                              <Plus className="w-3 h-3" />
                              <span>Add to Skills</span>
                            </button>

                            <button
                              onClick={() => handleInsertBulletToExperience(kw)}
                              className="px-2 py-1 text-[11px] font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-md transition-colors flex items-center gap-1 cursor-pointer"
                              title="Insert accomplishment bullet into latest work experience"
                            >
                              <Briefcase className="w-3 h-3 text-slate-500" />
                              <span>Insert Accomplishment</span>
                            </button>

                            <button
                              onClick={() => handleCopyPhrase(kw.suggestedPhrase, kw.term)}
                              className="p-1 text-slate-400 hover:text-slate-700 rounded-md transition-colors cursor-pointer ml-auto"
                              title="Copy suggested phrase to clipboard"
                            >
                              {copiedTerm === kw.term ? (
                                <Check className="w-3.5 h-3.5 text-emerald-600" />
                              ) : (
                                <Copy className="w-3.5 h-3.5" />
                              )}
                            </button>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* TAB 2: RESUME TEXT HIGHLIGHTER VIEW */}
          {activeTab === 'highlightView' && (
            <div className="space-y-4">
              <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-between flex-wrap gap-2 text-xs">
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-1.5">
                    <span className="w-3 h-3 rounded-full bg-emerald-400 border border-emerald-600 inline-block" />
                    <span className="font-semibold text-slate-700">Green Highlight:</span>
                    <span className="text-slate-500">Matched JD Keywords ({keywordAnalysis.matchedCount})</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="w-3 h-3 rounded-full bg-amber-300 border border-amber-500 inline-block" />
                    <span className="font-semibold text-slate-700">Amber Callout:</span>
                    <span className="text-slate-500">Recommended Placement for Missing Terms</span>
                  </div>
                </div>

                <label className="flex items-center gap-1.5 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={highlightAllPlacements}
                    onChange={(e) => setHighlightAllPlacements(e.target.checked)}
                    className="w-3.5 h-3.5 rounded text-blue-600"
                  />
                  <span className="text-xs font-semibold text-slate-700">
                    Show Placement Opportunities
                  </span>
                </label>
              </div>

              {/* Formatted Resume Document with Highlights */}
              <div className="p-6 bg-white border border-slate-200 rounded-2xl shadow-xs space-y-5 text-slate-900 font-sans">
                {/* Header */}
                <div className="border-b border-slate-200 pb-4">
                  <h1 className="text-lg font-black tracking-tight text-slate-900">
                    {resume.personalInfo?.fullName || 'Candidate Name'}
                  </h1>
                  <p className="text-xs font-bold text-blue-600 mt-0.5">
                    {resume.personalInfo?.title || 'Professional Title'}
                  </p>
                  <p className="text-[11px] text-slate-500 mt-1">
                    {[
                      resume.personalInfo?.email,
                      resume.personalInfo?.phone,
                      resume.personalInfo?.location,
                      resume.personalInfo?.linkedin,
                    ]
                      .filter(Boolean)
                      .join(' • ')}
                  </p>
                </div>

                {/* Summary Section */}
                {resume.summary && (
                  <div className="space-y-1.5">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800 border-b border-slate-100 pb-1">
                      Professional Summary
                    </h3>
                    <p className="text-xs text-slate-700 leading-relaxed">
                      {highlightMatchedText(resume.summary, matchedTermStrings).map((seg, idx) =>
                        seg.isMatch ? (
                          <mark
                            key={idx}
                            className="bg-emerald-100 text-emerald-900 font-semibold px-1 py-0.5 rounded border border-emerald-300/80 shadow-2xs mx-0.5"
                            title={`Matched Keyword from Job Description: ${seg.text}`}
                          >
                            {seg.text}
                          </mark>
                        ) : (
                          <span key={idx}>{seg.text}</span>
                        )
                      )}
                    </p>
                  </div>
                )}

                {/* Work Experience Section */}
                {resume.experience && resume.experience.length > 0 && (
                  <div className="space-y-3">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800 border-b border-slate-100 pb-1 flex items-center justify-between">
                      <span>Work Experience</span>
                      <span className="text-[10px] font-normal text-slate-400">
                        {resume.experience.length} Roles
                      </span>
                    </h3>

                    {resume.experience.map((exp, idx) => (
                      <div key={idx} className="space-y-1.5">
                        <div className="flex justify-between items-baseline">
                          <div>
                            <span className="text-xs font-bold text-slate-900">{exp.role}</span>
                            <span className="text-xs text-slate-500 font-normal"> — {exp.company}</span>
                          </div>
                          <span className="text-[11px] font-mono text-slate-400">
                            {exp.startDate} - {exp.current ? 'Present' : exp.endDate}
                          </span>
                        </div>

                        <ul className="list-disc list-outside pl-4 text-xs text-slate-700 space-y-1">
                          {(exp.bullets || []).map((b, bIdx) => (
                            <li key={bIdx} className="leading-relaxed">
                              {highlightMatchedText(b, matchedTermStrings).map((seg, sIdx) =>
                                seg.isMatch ? (
                                  <mark
                                    key={sIdx}
                                    className="bg-emerald-100 text-emerald-900 font-semibold px-1 py-0.5 rounded border border-emerald-300/80 shadow-2xs mx-0.5"
                                    title={`Matched Keyword: ${seg.text}`}
                                  >
                                    {seg.text}
                                  </mark>
                                ) : (
                                  <span key={sIdx}>{seg.text}</span>
                                )
                              )}
                            </li>
                          ))}
                        </ul>

                        {/* Suggested Insertion Spot for Top Missing Keywords */}
                        {highlightAllPlacements && idx === 0 && keywordAnalysis.missingKeywords.length > 0 && (
                          <div className="mt-2 p-2.5 bg-amber-50/80 border border-dashed border-amber-300 rounded-xl space-y-1 text-xs">
                            <div className="flex items-center justify-between">
                              <span className="font-bold text-amber-900 flex items-center gap-1">
                                <Zap className="w-3.5 h-3.5 text-amber-600" />
                                Recommended Missing Keyword Insertion Slot:
                              </span>
                              <button
                                onClick={() => handleInsertBulletToExperience(keywordAnalysis.missingKeywords[0])}
                                className="text-[10px] font-bold text-blue-700 bg-white border border-blue-200 hover:bg-blue-50 px-2 py-0.5 rounded cursor-pointer"
                              >
                                + Insert Bullet
                              </button>
                            </div>
                            <p className="text-amber-950 italic text-[11px]">
                              "{keywordAnalysis.missingKeywords[0].suggestedPhrase}"
                            </p>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}

                {/* Skills Section with Matching Badges */}
                {resume.skills && resume.skills.length > 0 && (
                  <div className="space-y-2">
                    <div className="flex items-center justify-between border-b border-slate-100 pb-1">
                      <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800">
                        Skills & Competencies
                      </h3>
                      <span className="text-[10px] text-slate-500">
                        {resume.skills.length} skills listed
                      </span>
                    </div>

                    <div className="flex flex-wrap gap-1.5">
                      {resume.skills.map((skill, idx) => {
                        const isMatch = keywordAnalysis.matchedKeywords.some(
                          (m) =>
                            skill.name.toLowerCase().includes(m.normalizedTerm) ||
                            m.normalizedTerm.includes(skill.name.toLowerCase())
                        );

                        return (
                          <span
                            key={idx}
                            className={`px-2.5 py-1 text-xs font-semibold rounded-lg border transition-all ${
                              isMatch
                                ? 'bg-emerald-100/80 text-emerald-900 border-emerald-300 shadow-2xs font-bold'
                                : 'bg-slate-50 text-slate-700 border-slate-200'
                            }`}
                          >
                            {isMatch && <Check className="w-3 h-3 text-emerald-600 inline mr-1 -mt-0.5" />}
                            {skill.name}
                          </span>
                        );
                      })}

                      {/* Missing skills quick add chips */}
                      {highlightAllPlacements &&
                        keywordAnalysis.missingKeywords.slice(0, 5).map((mkw, idx) => (
                          <button
                            key={`missing-${idx}`}
                            onClick={() => handleAddMissingSkillToResume(mkw)}
                            className="px-2 py-1 text-xs font-bold rounded-lg border border-dashed border-rose-300 bg-rose-50/60 text-rose-700 hover:bg-rose-100 transition-colors flex items-center gap-1 cursor-pointer"
                            title={`Click to add missing keyword "${mkw.term}" into your resume skills`}
                          >
                            <Plus className="w-3 h-3" />
                            <span>Add {mkw.term}</span>
                          </button>
                        ))}
                    </div>
                  </div>
                )}

                {/* Projects Section */}
                {resume.projects && resume.projects.length > 0 && (
                  <div className="space-y-2">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800 border-b border-slate-100 pb-1">
                      Projects
                    </h3>
                    {resume.projects.map((proj, idx) => (
                      <div key={idx} className="space-y-1">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-slate-900">{proj.name}</span>
                          <span className="text-[10px] text-slate-400 font-mono">
                            {proj.techStack?.join(', ')}
                          </span>
                        </div>
                        <ul className="list-disc list-outside pl-4 text-xs text-slate-700 space-y-0.5">
                          {(proj.bullets || []).map((b, bIdx) => (
                            <li key={bIdx}>
                              {highlightMatchedText(b, matchedTermStrings).map((seg, sIdx) =>
                                seg.isMatch ? (
                                  <mark
                                    key={sIdx}
                                    className="bg-emerald-100 text-emerald-900 font-semibold px-1 py-0.5 rounded border border-emerald-300/80 shadow-2xs mx-0.5"
                                  >
                                    {seg.text}
                                  </mark>
                                ) : (
                                  <span key={sIdx}>{seg.text}</span>
                                )
                              )}
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 3: FULL ATS AUDIT & SCORE OVERVIEW */}
          {activeTab === 'overview' && (
            <div className="space-y-5">
              {/* Main Score Hero Card */}
              <div className="p-5 rounded-2xl bg-gradient-to-br from-slate-900 via-slate-850 to-slate-900 text-white flex flex-col sm:flex-row items-center justify-between gap-6 shadow-md">
                <div className="flex items-center gap-5">
                  {/* Radial score badge */}
                  <div className="relative w-24 h-24 flex items-center justify-center flex-shrink-0">
                    <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                      <path
                        className="text-slate-700"
                        strokeWidth="3.5"
                        stroke="currentColor"
                        fill="none"
                        d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                      />
                      <path
                        className={
                          score >= 85
                            ? 'text-emerald-400'
                            : score >= 70
                            ? 'text-blue-400'
                            : score >= 50
                            ? 'text-amber-400'
                            : 'text-rose-400'
                        }
                        strokeDasharray={`${score}, 100`}
                        strokeWidth="3.5"
                        strokeLinecap="round"
                        stroke="currentColor"
                        fill="none"
                        d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                      />
                    </svg>
                    <div className="absolute flex flex-col items-center justify-center">
                      <span className="text-2xl font-black font-mono tracking-tighter">{score}</span>
                      <span className="text-[9px] uppercase tracking-wider text-slate-400 font-semibold">
                        / 100
                      </span>
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center gap-2">
                      <span
                        className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${
                          score >= 85
                            ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                            : score >= 70
                            ? 'bg-blue-500/20 text-blue-300 border border-blue-500/30'
                            : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                        }`}
                      >
                        {currentReport.verdict}
                      </span>
                    </div>
                    <h3 className="text-sm font-semibold text-white mt-1.5">
                      {score >= 85
                        ? 'Your resume is highly optimized for top enterprise ATS filters.'
                        : score >= 70
                        ? 'Good candidate match with minor opportunities to increase impact.'
                        : 'Requires keyword & quantifiable metric improvements to pass screening.'}
                    </h3>
                    <p className="text-xs text-slate-300 mt-1">
                      Evaluated across 5 recruitment criteria including action verbs and metric density.
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => {
                    onClose();
                    onOpenTailorModal();
                  }}
                  className="px-4 py-2 text-xs font-bold text-slate-900 bg-white hover:bg-slate-100 rounded-xl transition-all flex items-center gap-1.5 cursor-pointer shadow-xs flex-shrink-0"
                >
                  <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
                  <span>Tailor to Job</span>
                </button>
              </div>

              {/* Breakdown Metrics Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                {[
                  { label: 'Keywords Match', val: currentReport.breakdown.keywordDensity },
                  { label: 'Quantifiable Impact', val: currentReport.breakdown.quantifiableImpact },
                  { label: 'ATS Format', val: currentReport.breakdown.formattingAndATS },
                  { label: 'Action Verbs', val: currentReport.breakdown.actionVerbs },
                  { label: 'Brevity / Clarity', val: currentReport.breakdown.brevityAndClarity },
                ].map((metric, i) => (
                  <div key={i} className="p-3 bg-slate-50 border border-slate-200 rounded-xl">
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-[11px] font-semibold text-slate-600">{metric.label}</span>
                      <span className="text-xs font-mono font-bold text-slate-900">{metric.val}%</span>
                    </div>
                    <div className="w-full bg-slate-200 rounded-full h-1.5 overflow-hidden">
                      <div
                        className={`h-full rounded-full ${
                          metric.val >= 80
                            ? 'bg-emerald-500'
                            : metric.val >= 60
                            ? 'bg-blue-500'
                            : 'bg-amber-500'
                        }`}
                        style={{ width: `${metric.val}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>

              {/* Critical Improvements Checklist */}
              {currentReport.criticalImprovements?.length > 0 && (
                <div className="space-y-3">
                  <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                    Actionable Optimization Checklist
                  </h3>
                  <div className="space-y-2">
                    {currentReport.criticalImprovements.map((item, idx) => (
                      <div key={idx} className="p-3 bg-white border border-slate-200 rounded-xl space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 bg-amber-100 text-amber-800 rounded">
                            {item.section}
                          </span>
                          <span className="text-xs font-bold text-slate-900">{item.issue}</span>
                        </div>
                        <p className="text-xs text-slate-600 pl-1">{item.suggestion}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Strengths */}
              {currentReport.strengths?.length > 0 && (
                <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
                  <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                    <Zap className="w-3.5 h-3.5 text-amber-500" /> Confirmed Strengths
                  </span>
                  <ul className="list-disc list-outside pl-4 text-xs text-slate-600 space-y-1">
                    {currentReport.strengths.map((str, i) => (
                      <li key={i}>{str}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-5 py-3 border-t border-slate-200 bg-slate-50 flex items-center justify-between">
          <span className="text-xs text-slate-500">
            Audit standard: Fortune 500 Enterprise ATS benchmarks (Taleo, Greenhouse, Workday).
          </span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 text-xs font-bold text-slate-700 bg-white border border-slate-300 hover:bg-slate-50 rounded-lg transition-colors cursor-pointer shadow-2xs"
          >
            Close Inspector
          </button>
        </div>
      </div>
    </div>
  );
};
