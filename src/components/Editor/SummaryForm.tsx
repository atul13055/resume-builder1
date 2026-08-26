import React, { useState } from 'react';
import { ResumeData } from '../../types/resume';
import { FileText, Sparkles, Loader2, Check, RefreshCw } from 'lucide-react';
import { SpellCheckedTextarea } from './SpellCheckedTextarea';

import { generateSummaryClientSide } from '../../utils/aiClientFallback';

interface SummaryFormProps {
  summary: string;
  resumeData: ResumeData;
  onChange: (summary: string) => void;
}

export const SummaryForm: React.FC<SummaryFormProps> = ({ summary, resumeData, onChange }) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [aiSuggestions, setAiSuggestions] = useState<{ summary: string; alternatives: string[]; coreKeywords: string[] } | null>(null);
  const [selectedTone, setSelectedTone] = useState('executive');
  const [error, setError] = useState<string | null>(null);

  const wordCount = summary?.trim().split(/\s+/).filter(Boolean).length || 0;

  const handleAiGenerate = async () => {
    try {
      setIsGenerating(true);
      setError(null);
      let data;
      try {
        const res = await fetch('/api/ai/generate-summary', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            resumeData,
            targetRole: resumeData.personalInfo.title,
            tone: selectedTone,
          }),
        });

        if (res.ok) {
          data = await res.json();
        } else {
          // If serverless endpoint returned 404 or error, fallback to client-side Gemini AI
          data = await generateSummaryClientSide(resumeData, resumeData.personalInfo.title, selectedTone);
        }
      } catch (fetchErr) {
        data = await generateSummaryClientSide(resumeData, resumeData.personalInfo.title, selectedTone);
      }

      setAiSuggestions(data);
    } catch (err: any) {
      setError(err.message || 'AI Generation failed. Please configure GEMINI_API_KEY in Vercel project environment variables.');
    } finally {
      setIsGenerating(false);
    }
  };

  const applySummary = (text: string) => {
    onChange(text);
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-start border-b border-slate-200 pb-3 flex-wrap gap-2">
        <div>
          <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
            <FileText className="w-4 h-4 text-blue-600" /> Professional Summary
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            A 3–4 sentence elevator pitch highlighting your top wins and unique value.
          </p>
        </div>

        {/* AI Action Header */}
        <div className="flex items-center gap-2">
          <select
            value={selectedTone}
            onChange={(e) => setSelectedTone(e.target.value)}
            className="text-xs bg-slate-50 border border-slate-200 rounded-md px-2 py-1 text-slate-700 outline-none"
          >
            <option value="executive">Tone: Executive & Strategic</option>
            <option value="technical">Tone: Hands-on Technical</option>
            <option value="growth">Tone: Results & Growth</option>
            <option value="concise">Tone: Direct & Concise</option>
          </select>

          <button
            id="ai-generate-summary-btn"
            type="button"
            onClick={handleAiGenerate}
            disabled={isGenerating}
            className="flex items-center gap-1.5 px-3 py-1 text-xs font-semibold text-white bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all shadow-xs cursor-pointer disabled:opacity-50"
          >
            {isGenerating ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Sparkles className="w-3.5 h-3.5" />}
            <span>{isGenerating ? 'Drafting...' : 'Write with AI'}</span>
          </button>
        </div>
      </div>

      {error && (
        <div className="p-2.5 rounded-lg bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center justify-between">
          <span>{error}</span>
          <button onClick={() => setError(null)} className="text-rose-500 hover:text-rose-800 font-bold ml-2">×</button>
        </div>
      )}

      {/* Main Textarea */}
      <div className="relative">
        <SpellCheckedTextarea
          id="summary-textarea"
          value={summary}
          onChange={(val) => onChange(val)}
          rows={5}
          placeholder="e.g. Results-driven Senior Full-Stack Engineer with 7+ years of experience architecting distributed cloud platforms and scaling microservices to 3.5M+ active users. Skilled in TypeScript, React, and Node.js with a track record of slashing latency by 42%."
          textareaClassName="p-3 leading-relaxed"
        />

        {/* Word count & Health indicator */}
        <div className="flex justify-between items-center text-[11px] text-slate-500 mt-1 px-1">
          <span className="flex items-center gap-1.5">
            <span
              className={`w-2 h-2 rounded-full ${
                wordCount >= 30 && wordCount <= 90
                  ? 'bg-emerald-500'
                  : wordCount === 0
                  ? 'bg-slate-300'
                  : 'bg-amber-400'
              }`}
            />
            {wordCount >= 30 && wordCount <= 90
              ? 'Ideal length (30-90 words)'
              : wordCount < 30
              ? 'A bit short for ATS'
              : 'Consider shortening slightly'}
          </span>
          <span className="font-mono font-medium">{wordCount} words</span>
        </div>
      </div>

      {/* AI Suggestions Box */}
      {aiSuggestions && (
        <div className="p-3.5 bg-indigo-50/70 border border-indigo-200 rounded-xl space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-indigo-900 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
              AI Drafted Variations
            </span>
            <button
              onClick={handleAiGenerate}
              className="text-[11px] font-semibold text-indigo-600 hover:text-indigo-800 flex items-center gap-1 cursor-pointer"
            >
              <RefreshCw className="w-3 h-3" /> Regenerate
            </button>
          </div>

          {/* Primary Recommendation */}
          <div className="bg-white p-3 rounded-lg border border-indigo-100 shadow-xs">
            <div className="flex justify-between items-start gap-2 mb-1.5">
              <span className="text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.5 bg-indigo-100 text-indigo-800 rounded">
                Recommended
              </span>
              <button
                onClick={() => applySummary(aiSuggestions.summary)}
                className="flex items-center gap-1 px-2.5 py-1 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-md transition-colors cursor-pointer"
              >
                <Check className="w-3 h-3" /> Apply to Resume
              </button>
            </div>
            <p className="text-xs text-slate-800 leading-relaxed">{aiSuggestions.summary}</p>
          </div>

          {/* Alternative options */}
          {aiSuggestions.alternatives?.length > 0 && (
            <div className="space-y-2">
              <span className="text-[11px] font-semibold text-indigo-800">Alternative Options:</span>
              {aiSuggestions.alternatives.map((alt, idx) => (
                <div key={idx} className="bg-white p-2.5 rounded-lg border border-slate-200 flex justify-between items-start gap-2">
                  <p className="text-xs text-slate-700 leading-normal flex-1">{alt}</p>
                  <button
                    onClick={() => applySummary(alt)}
                    className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 px-2 py-1 rounded hover:bg-indigo-50 transition-colors flex-shrink-0 cursor-pointer"
                  >
                    Use This
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* Embedded Keywords */}
          {aiSuggestions.coreKeywords?.length > 0 && (
            <div className="flex flex-wrap items-center gap-1.5 pt-1">
              <span className="text-[10px] font-bold text-indigo-900 uppercase">Woven Keywords:</span>
              {aiSuggestions.coreKeywords.map((kw, i) => (
                <span key={i} className="px-2 py-0.5 text-[10px] font-medium bg-white text-indigo-700 border border-indigo-200 rounded-full">
                  {kw}
                </span>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
