import { ResumeData, ATSAnalysisResult } from '../types/resume';
import { extractAndAnalyzeKeywords } from './keywordExtractor';

const STRONG_ACTION_VERBS = [
  'accelerated', 'achieved', 'administered', 'advised', 'analyzed', 'architected', 'automated',
  'built', 'championed', 'coached', 'collaborated', 'consolidated', 'constructed', 'coordinated',
  'created', 'decreased', 'delivered', 'deployed', 'designed', 'developed', 'directed',
  'doubled', 'drove', 'eliminated', 'enabled', 'engineered', 'established', 'evaluated',
  'executed', 'expanded', 'expedited', 'facilitated', 'formulated', 'generated', 'governed',
  'grew', 'guided', 'headed', 'identified', 'implemented', 'improved', 'increased',
  'initiated', 'innovated', 'instituted', 'integrated', 'invented', 'launched', 'led',
  'leveraged', 'managed', 'maximized', 'mentored', 'migrated', 'minimized', 'modernized',
  'negotiated', 'optimized', 'orchestrated', 'overhauled', 'oversaw', 'partnered', 'pioneered',
  'produced', 'programmed', 'projected', 'published', 'raised', 'rebuilt', 'recruited',
  'redesigned', 'reduced', 'reengineered', 'remodeled', 'reorganized', 'resolved', 'restructured',
  'revamped', 'scaled', 'slashed', 'spearheaded', 'standardized', 'streamlined', 'strengthened',
  'structured', 'supervised', 'surpassed', 'synthesized', 'systematized', 'targeted', 'transformed',
  'transitioned', 'tripled', 'uncovered', 'unified', 'upgraded', 'validated', 'yielded'
];

const WEAK_PASSIVE_PHRASES = [
  'responsible for', 'duties included', 'worked on', 'helped with', 'assisted in', 'handled',
  'participated in', 'contributed to', 'involved in', 'served as', 'tasked with', 'attempted to'
];

export function calculateLiveATSScore(resume: ResumeData, jobDescription?: string): ATSAnalysisResult {
  let score = 0;
  const criticalImprovements: { section: string; issue: string; suggestion: string }[] = [];
  const strengths: string[] = [];
  const quickWins: string[] = [];

  const safeResume = resume || ({} as ResumeData);
  const p = safeResume.personalInfo || {
    fullName: '',
    title: '',
    email: '',
    phone: '',
    location: '',
    website: '',
    linkedin: '',
    github: '',
  };

  // 1. Personal & Contact Info (Weight: 15)
  let contactScore = 0;
  if (p.fullName?.trim().length > 2) contactScore += 3;
  else criticalImprovements.push({ section: 'Personal Info', issue: 'Missing full name', suggestion: 'Enter your legal full name prominently at the top.' });

  if (p.title?.trim().length > 3) contactScore += 3;
  else criticalImprovements.push({ section: 'Personal Info', issue: 'Missing targeted professional headline', suggestion: 'Add a specific title (e.g. "Senior Full-Stack Engineer") that matches target roles.' });

  if (p.email?.includes('@') && p.email?.includes('.')) contactScore += 3;
  else criticalImprovements.push({ section: 'Personal Info', issue: 'Invalid or missing email address', suggestion: 'Provide a clean professional email address.' });

  if (p.phone?.trim().length > 6) contactScore += 2;
  if (p.location?.trim().length > 2) contactScore += 2;
  if (p.linkedin?.trim().length > 4 || p.website?.trim().length > 4 || p.github?.trim().length > 4) contactScore += 2;

  if (contactScore >= 13) strengths.push('Complete contact information with active online portfolio/LinkedIn links.');
  
  // 2. Summary Quality (Weight: 15)
  let summaryScore = 0;
  const summaryWords = resume.summary?.trim().split(/\s+/).filter(Boolean) || [];
  if (summaryWords.length >= 25 && summaryWords.length <= 110) {
    summaryScore += 10;
    strengths.push('Professional summary has an optimal length (between 30 and 100 words).');
  } else if (summaryWords.length < 25 && summaryWords.length > 0) {
    summaryScore += 4;
    criticalImprovements.push({ section: 'Professional Summary', issue: 'Summary is too brief', suggestion: 'Expand summary to 3-4 sentences outlining your core value proposition and top achievements.' });
  } else if (summaryWords.length > 110) {
    summaryScore += 5;
    criticalImprovements.push({ section: 'Professional Summary', issue: 'Summary is too lengthy', suggestion: 'Condense your summary to 3-4 impactful sentences to keep recruiters engaged.' });
  } else {
    criticalImprovements.push({ section: 'Professional Summary', issue: 'Missing professional summary', suggestion: 'Add a high-impact summary to immediately grab recruiter attention.' });
  }

  // Check for 1st person pronouns in summary
  const summaryLower = resume.summary?.toLowerCase() || '';
  const hasFirstPerson = /\b(i|me|my|mine|myself)\b/i.test(summaryLower);
  if (hasFirstPerson) {
    summaryScore = Math.max(0, summaryScore - 3);
    criticalImprovements.push({ section: 'Professional Summary', issue: 'First-person pronouns detected ("I", "my")', suggestion: 'Remove "I" and "my". Write in standard resume third-person implied style (e.g. "Experienced engineer leading...").' });
  } else if (summaryWords.length >= 25) {
    summaryScore += 5;
  }

  // 3. Experience & Quantifiable Impact (Weight: 35)
  let experienceScore = 0;
  let quantifiableImpactScore = 0;
  let actionVerbScore = 0;
  let totalBullets = 0;
  let quantifiedBullets = 0;
  let strongVerbBullets = 0;
  let passiveCount = 0;

  const metricRegex = /(\d+[%kKmMbB]?|\$\d+|\d+\+|\b\d+\b)/;

  if (resume.experience && resume.experience.length > 0) {
    experienceScore += 10;

    resume.experience.forEach((exp) => {
      const bullets = exp.bullets || [];
      totalBullets += bullets.length;

      bullets.forEach((b) => {
        const text = b.trim();
        if (!text) return;

        // Metric check
        if (metricRegex.test(text) || text.includes('%') || text.includes('$') || text.includes('x') || text.includes('X')) {
          quantifiedBullets++;
        }

        // Strong action verb start check
        const firstWord = text.split(/\s+/)[0]?.toLowerCase().replace(/[^a-z]/g, '');
        if (STRONG_ACTION_VERBS.includes(firstWord)) {
          strongVerbBullets++;
        }

        // Passive check
        WEAK_PASSIVE_PHRASES.forEach((phrase) => {
          if (text.toLowerCase().includes(phrase)) {
            passiveCount++;
          }
        });
      });
    });

    if (totalBullets >= 4) {
      const metricRatio = quantifiedBullets / totalBullets;
      quantifiableImpactScore = Math.round(Math.min(100, metricRatio * 140));

      if (metricRatio >= 0.5) {
        experienceScore += 15;
        strengths.push(`High quantifiable impact: ${quantifiedBullets} of ${totalBullets} bullet points contain numbers, %, or metrics.`);
      } else {
        experienceScore += Math.round(metricRatio * 20);
        criticalImprovements.push({
          section: 'Work Experience',
          issue: 'Low percentage of quantified accomplishments',
          suggestion: 'Enhance bullet points with specific metrics (e.g., "Reduced latency by 35%", "Grew revenue to $2.4M", "Mentored 6 engineers"). Use the AI Bullet Optimizer.'
        });
      }

      const verbRatio = strongVerbBullets / totalBullets;
      actionVerbScore = Math.round(Math.min(100, verbRatio * 130));
      if (verbRatio >= 0.6) {
        experienceScore += 10;
        strengths.push('Strong action-driven language across experience achievements.');
      } else {
        experienceScore += Math.round(verbRatio * 10);
        criticalImprovements.push({
          section: 'Work Experience',
          issue: 'Bullets lack strong opening action verbs',
          suggestion: 'Start every bullet point with a powerful past-tense action verb (e.g. "Spearheaded", "Engineered", "Orchestrated").'
        });
      }

      if (passiveCount > 0) {
        criticalImprovements.push({
          section: 'Work Experience',
          issue: `Found ${passiveCount} weak or passive phrasing instances (e.g. "Responsible for")`,
          suggestion: 'Replace passive phrases with direct ownership action verbs.'
        });
      }
    } else {
      criticalImprovements.push({
        section: 'Work Experience',
        issue: 'Too few bullet points describing past achievements',
        suggestion: 'Add 3-5 accomplishment-oriented bullet points for each recent role.'
      });
    }
  } else {
    criticalImprovements.push({
      section: 'Work Experience',
      issue: 'No work experience entries found',
      suggestion: 'Add your professional experience or internships to establish career history.'
    });
  }

  // 4. Skills Section (Weight: 20)
  let skillsScore = 0;
  const skillsCount = resume.skills?.length || 0;
  if (skillsCount >= 8 && skillsCount <= 25) {
    skillsScore = 20;
    strengths.push(`Comprehensive skill profile (${skillsCount} key skills categorized).`);
  } else if (skillsCount >= 4 && skillsCount < 8) {
    skillsScore = 12;
    quickWins.push('Add 4-6 more relevant industry skills and tools to maximize ATS search matching.');
  } else if (skillsCount > 25) {
    skillsScore = 14;
    criticalImprovements.push({ section: 'Skills', issue: 'Skills section may be overcrowded', suggestion: 'Focus on your top 12-18 most relevant skills for targeted roles.' });
  } else {
    skillsScore = 4;
    criticalImprovements.push({ section: 'Skills', issue: 'Missing or very few skills listed', suggestion: 'Add at least 8 relevant technical and core skills.' });
  }

  // 5. Education & Certifications (Weight: 15)
  let educationScore = 0;
  if (resume.education && resume.education.length > 0) {
    educationScore += 10;
    if (resume.education.some((e) => e.degree && e.school && (e.startDate || e.endDate))) {
      educationScore += 5;
    }
  } else {
    criticalImprovements.push({ section: 'Education', issue: 'Missing education details', suggestion: 'Include your university degree, bootcamp, or academic credentials.' });
  }

  // Formatting & ATS Parseability Check
  let formattingScore = 90;
  if (resume.customSections && resume.customSections.length > 4) {
    formattingScore -= 10;
  }
  if (!p.email || !p.fullName) {
    formattingScore -= 30;
  }

  // Keyword Match Analysis (If JD provided)
  let matchingKeywords: string[] = [];
  let missingKeywords: string[] = [];
  let keywordDensityScore = 75;

  if (jobDescription && jobDescription.trim().length > 15) {
    const analysis = extractAndAnalyzeKeywords(jobDescription, resume);
    matchingKeywords = analysis.matchedKeywords.map((k) => k.term);
    missingKeywords = analysis.missingKeywords.map((k) => k.term);
    keywordDensityScore = analysis.matchPercentage;

    if (analysis.totalJdKeywords > 0) {
      if (analysis.matchPercentage >= 75) {
        strengths.push(`High JD keyword alignment (${matchingKeywords.length} of ${analysis.totalJdKeywords} target terms matched).`);
      } else {
        criticalImprovements.push({
          section: 'Job Keyword Targeting',
          issue: `Missing ${missingKeywords.length} prominent keywords from the target job description`,
          suggestion: `Incorporate key terms like "${missingKeywords.slice(0, 4).join('", "')}" naturally into your skills and experience bullets.`
        });
      }
    }
  } else {
    // Default top skill check
    const resumeFullText = (
      `${p.fullName || ''} ${p.title || ''} ${resume?.summary || ''} ` +
      (resume?.experience || []).map((e) => `${e.role || ''} ${e.company || ''} ${(e.bullets || []).join(' ')}`).join(' ') +
      (resume?.skills || []).map((s) => s.name || '').join(' ')
    ).toLowerCase();

    (resume.skills || []).slice(0, 8).forEach((s) => {
      if (resumeFullText.includes(s.name.toLowerCase())) {
        matchingKeywords.push(s.name);
      }
    });
  }

  // Calculate Weighted Total Score
  const rawScore =
    contactScore + // max 15
    summaryScore + // max 15
    experienceScore + // max 35
    skillsScore + // max 20
    educationScore; // max 15

  const totalCalculated = Math.min(100, Math.max(15, rawScore));

  let verdict = 'Needs Optimization';
  if (totalCalculated >= 88) verdict = 'ATS Ready & Highly Competitive';
  else if (totalCalculated >= 75) verdict = 'Strong Candidate Match';
  else if (totalCalculated >= 60) verdict = 'Good Foundation – Action Needed';

  return {
    overallScore: totalCalculated,
    verdict,
    breakdown: {
      keywordDensity: keywordDensityScore,
      quantifiableImpact: quantifiableImpactScore || 65,
      formattingAndATS: formattingScore,
      actionVerbs: actionVerbScore || 70,
      brevityAndClarity: Math.min(100, Math.max(50, 95 - (passiveCount * 8))),
    },
    matchingKeywords: Array.from(new Set(matchingKeywords)),
    missingKeywords: Array.from(new Set(missingKeywords)),
    strengths,
    criticalImprovements,
    quickWins,
  };
}

export const calculateATSScore = calculateLiveATSScore;

