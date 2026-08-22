import { ResumeData } from '../types/resume';

export interface ExtractedKeyword {
  term: string;
  normalizedTerm: string;
  countInJd: number;
  isMatched: boolean;
  category: 'Technical Skills' | 'Tools & Platforms' | 'Architecture & Backend' | 'Methodologies & Process' | 'Leadership & Soft Skills' | 'General';
  importance: 'High' | 'Medium' | 'Low';
  occurrencesInResume: {
    section: 'Summary' | 'Experience' | 'Skills' | 'Education' | 'Projects';
    snippet: string;
  }[];
  suggestedPlacementSection: 'Skills' | 'Experience' | 'Summary' | 'Projects';
  suggestedPhrase: string;
}

export interface KeywordAnalysisData {
  totalJdKeywords: number;
  matchedCount: number;
  missingCount: number;
  matchPercentage: number;
  keywords: ExtractedKeyword[];
  matchedKeywords: ExtractedKeyword[];
  missingKeywords: ExtractedKeyword[];
}

// Curated technical and domain multi-word phrases for precise extraction
const MULTI_WORD_PHRASES = [
  'machine learning', 'artificial intelligence', 'system design', 'cloud computing',
  'microservices architecture', 'continuous integration', 'continuous deployment',
  'ci/cd pipeline', 'ci/cd', 'test-driven development', 'test driven development',
  'agile development', 'agile / scrum', 'scrum master', 'data engineering',
  'data pipelines', 'object-oriented programming', 'restful api', 'rest api',
  'graphql api', 'aws lambda', 'amazon web services', 'google cloud platform',
  'microsoft azure', 'kubernetes cluster', 'docker container', 'distributed systems',
  'performance optimization', 'database optimization', 'unit testing', 'end-to-end testing',
  'e2e testing', 'user experience', 'product management', 'project management',
  'front-end development', 'frontend development', 'back-end development',
  'backend development', 'full stack development', 'full-stack engineering',
  'state management', 'version control', 'infrastructure as code', 'large language models',
  'prompt engineering', 'generative ai', 'deep learning', 'computer vision',
  'natural language processing', 'code review', 'cross-functional collaboration',
  'technical leadership', 'stakeholder management', 'search engine optimization',
  'responsive design', 'web accessibility', 'wcag compliance', 'event-driven architecture',
  'serverless architecture', 'message queues', 'nosql database', 'relational database',
  'clean architecture', 'solid principles', 'design patterns', 'cyber security',
  'threat modeling', 'incident response', 'business intelligence', 'data visualization'
];

// Common stop words to exclude from keyword mining
const STOP_WORDS = new Set([
  'about', 'above', 'across', 'after', 'again', 'against', 'all', 'almost', 'alone', 'along',
  'already', 'also', 'although', 'always', 'among', 'and', 'another', 'any', 'anybody',
  'anyone', 'anything', 'anywhere', 'are', 'area', 'areas', 'around', 'ask', 'asked',
  'asking', 'asks', 'away', 'back', 'backed', 'backing', 'backs', 'became', 'because',
  'become', 'becomes', 'becoming', 'been', 'before', 'began', 'behind', 'being', 'beings',
  'best', 'better', 'between', 'big', 'both', 'candidate', 'candidates', 'cannot', 'case',
  'cases', 'certain', 'certainly', 'clear', 'clearly', 'come', 'could', 'did', 'differ',
  'different', 'differently', 'does', 'done', 'down', 'downed', 'downing', 'downs', 'during',
  'each', 'early', 'either', 'end', 'ended', 'ending', 'ends', 'enough', 'even', 'evenly',
  'ever', 'every', 'everybody', 'everyone', 'everything', 'everywhere', 'face', 'faces',
  'fact', 'facts', 'far', 'felt', 'few', 'fewer', 'find', 'finds', 'first', 'for', 'four',
  'from', 'full', 'fully', 'further', 'furthered', 'furthering', 'furthers', 'gave', 'general',
  'generally', 'get', 'gets', 'getting', 'give', 'given', 'gives', 'giving', 'good', 'goods',
  'great', 'greater', 'greatest', 'group', 'grouped', 'grouping', 'groups', 'had', 'has',
  'have', 'having', 'help', 'helped', 'helping', 'helps', 'her', 'here', 'herself', 'high',
  'higher', 'highest', 'him', 'himself', 'his', 'how', 'however', 'important', 'interest',
  'interested', 'interesting', 'interests', 'into', 'its', 'itself', 'job', 'jobs', 'just',
  'keep', 'keeps', 'kind', 'knew', 'know', 'known', 'knows', 'large', 'largely', 'last',
  'later', 'latest', 'least', 'less', 'let', 'lets', 'like', 'likely', 'made', 'make',
  'making', 'man', 'many', 'may', 'member', 'members', 'men', 'might', 'more', 'most',
  'mostly', 'mr', 'mrs', 'much', 'must', 'myself', 'name', 'named', 'names', 'need',
  'needed', 'needing', 'needs', 'never', 'new', 'newer', 'newest', 'next', 'non', 'not',
  'nobody', 'noone', 'nothing', 'now', 'nowhere', 'number', 'numbers', 'off', 'often',
  'old', 'older', 'oldest', 'once', 'one', 'ones', 'only', 'open', 'opened', 'opening',
  'opens', 'order', 'ordered', 'ordering', 'orders', 'other', 'others', 'our', 'out',
  'over', 'part', 'parted', 'parting', 'parts', 'per', 'place', 'places', 'point',
  'pointed', 'pointing', 'points', 'possible', 'present', 'presented', 'presenting',
  'presents', 'problem', 'problems', 'put', 'puts', 'quite', 'rather', 'really',
  'requirement', 'requirements', 'responsibility', 'responsibilities', 'role', 'roles',
  'said', 'same', 'saw', 'say', 'saying', 'says', 'second', 'seconds', 'see', 'seeing',
  'seem', 'seemed', 'seeming', 'seems', 'sees', 'several', 'shall', 'she', 'should',
  'show', 'showed', 'showing', 'shows', 'side', 'sides', 'since', 'small', 'smaller',
  'smallest', 'some', 'somebody', 'someone', 'something', 'somewhere', 'state', 'states',
  'still', 'such', 'sure', 'take', 'taken', 'taking', 'than', 'that', 'the', 'their',
  'them', 'then', 'there', 'therefore', 'these', 'they', 'thing', 'things', 'think',
  'thinks', 'this', 'those', 'though', 'thought', 'thoughts', 'three', 'through',
  'thus', 'time', 'times', 'today', 'together', 'too', 'took', 'toward', 'turn',
  'turned', 'turning', 'turns', 'two', 'under', 'until', 'upon', 'use', 'used', 'uses',
  'using', 'very', 'want', 'wanted', 'wanting', 'wants', 'was', 'way', 'ways', 'well',
  'wells', 'went', 'were', 'what', 'when', 'where', 'whether', 'which', 'while', 'who',
  'whole', 'whose', 'why', 'will', 'with', 'within', 'without', 'work', 'worked',
  'working', 'works', 'would', 'year', 'years', 'yet', 'you', 'young', 'younger',
  'youngest', 'your', 'yours'
]);

function categorizeKeyword(term: string): ExtractedKeyword['category'] {
  const t = term.toLowerCase();
  if (
    t.includes('react') || t.includes('node') || t.includes('python') || t.includes('typescript') ||
    t.includes('javascript') || t.includes('java') || t.includes('c++') || t.includes('c#') ||
    t.includes('golang') || t.includes('rust') || t.includes('sql') || t.includes('nosql') ||
    t.includes('html') || t.includes('css') || t.includes('tailwind') || t.includes('vue') ||
    t.includes('angular') || t.includes('django') || t.includes('flask') || t.includes('fastapi') ||
    t.includes('spring') || t.includes('graphql') || t.includes('api')
  ) {
    return 'Technical Skills';
  }

  if (
    t.includes('aws') || t.includes('cloud') || t.includes('docker') || t.includes('kubernetes') ||
    t.includes('azure') || t.includes('gcp') || t.includes('git') || t.includes('ci/cd') ||
    t.includes('jenkins') || t.includes('linux') || t.includes('terraform') || t.includes('redis') ||
    t.includes('kafka') || t.includes('postgres') || t.includes('mongo') || t.includes('jira') ||
    t.includes('figma')
  ) {
    return 'Tools & Platforms';
  }

  if (
    t.includes('microservices') || t.includes('architecture') || t.includes('distributed') ||
    t.includes('system design') || t.includes('scalability') || t.includes('database') ||
    t.includes('backend') || t.includes('security') || t.includes('serverless')
  ) {
    return 'Architecture & Backend';
  }

  if (
    t.includes('agile') || t.includes('scrum') || t.includes('ci/cd') || t.includes('testing') ||
    t.includes('test-driven') || t.includes('tdd') || t.includes('devops') || t.includes('code review') ||
    t.includes('optimization') || t.includes('lifecycle')
  ) {
    return 'Methodologies & Process';
  }

  if (
    t.includes('leadership') || t.includes('communication') || t.includes('collaboration') ||
    t.includes('management') || t.includes('mentoring') || t.includes('stakeholder') ||
    t.includes('cross-functional') || t.includes('problem solving')
  ) {
    return 'Leadership & Soft Skills';
  }

  return 'Technical Skills';
}

function generateSuggestedPhrase(term: string): string {
  const t = term.toLowerCase();
  if (t.includes('docker') || t.includes('container')) {
    return `Containerized application microservices using ${term} to ensure seamless CI/CD deployments.`;
  }
  if (t.includes('kubernetes') || t.includes('k8s')) {
    return `Orchestrated container workloads using ${term} for automated scaling and 99.9% uptime.`;
  }
  if (t.includes('typescript') || t.includes('javascript')) {
    return `Engineered high-performance web applications with ${term}, ensuring strict type-safety and code reliability.`;
  }
  if (t.includes('react') || t.includes('next.js') || t.includes('vue')) {
    return `Developed dynamic, responsive UI components using ${term}, boosting user engagement and reducing load times.`;
  }
  if (t.includes('python') || t.includes('django') || t.includes('fastapi')) {
    return `Built scalable RESTful services and data ingestion workflows utilizing ${term}.`;
  }
  if (t.includes('sql') || t.includes('postgres') || t.includes('database') || t.includes('redis')) {
    return `Designed optimized data queries and indexing structures in ${term}, slashing query latency by 40%.`;
  }
  if (t.includes('aws') || t.includes('cloud') || t.includes('azure') || t.includes('gcp')) {
    return `Architected cloud-native infrastructure on ${term} with automated provisioning and cost optimization.`;
  }
  if (t.includes('ci/cd') || t.includes('pipeline')) {
    return `Configured automated ${term} pipelines, decreasing release deployment cycles from days to minutes.`;
  }
  if (t.includes('testing') || t.includes('jest') || t.includes('cypress')) {
    return `Authored comprehensive automated test suites using ${term}, elevating test coverage above 85%.`;
  }
  if (t.includes('agile') || t.includes('scrum')) {
    return `Collaborated in fast-paced ${term} sprints, delivering features consistently ahead of product milestones.`;
  }
  if (t.includes('graphql') || t.includes('api') || t.includes('rest')) {
    return `Engineered robust ${term} endpoints facilitating high-throughput communication between microservices.`;
  }
  return `Applied ${term} to streamline operational workflows and enhance overall technical system performance.`;
}

/**
 * Extracts and analyzes keywords from a Job Description against a Resume
 */
export function extractAndAnalyzeKeywords(
  jobDescription: string,
  resume: ResumeData
): KeywordAnalysisData {
  if (!jobDescription || jobDescription.trim().length < 10) {
    return {
      totalJdKeywords: 0,
      matchedCount: 0,
      missingCount: 0,
      matchPercentage: 100,
      keywords: [],
      matchedKeywords: [],
      missingKeywords: [],
    };
  }

  const jdTextLower = jobDescription.toLowerCase();

  // Index resume sections and text
  const sections = {
    summary: (resume.summary || '').toLowerCase(),
    skills: (resume.skills || []).map((s) => s.name.toLowerCase()).join(' '),
    experience: (resume.experience || [])
      .map((e) => `${e.role} ${e.company} ${e.location} ${(e.bullets || []).join(' ')}`)
      .join(' ')
      .toLowerCase(),
    projects: (resume.projects || [])
      .map((p) => `${p.name} ${(p.techStack || []).join(' ')} ${(p.bullets || []).join(' ')}`)
      .join(' ')
      .toLowerCase(),
    education: (resume.education || [])
      .map((ed) => `${ed.degree} ${ed.field} ${ed.school}`)
      .join(' ')
      .toLowerCase(),
    personal: `${resume.personalInfo?.title || ''} ${resume.personalInfo?.fullName || ''}`.toLowerCase(),
  };

  const fullResumeText = `${sections.personal} ${sections.summary} ${sections.skills} ${sections.experience} ${sections.projects} ${sections.education}`;

  const foundTermsMap = new Map<string, { term: string; count: number }>();

  // 1. Extract Multi-Word Key Phrases first
  MULTI_WORD_PHRASES.forEach((phrase) => {
    // Regex with word boundaries
    const escaped = phrase.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const regex = new RegExp(`\\b${escaped}\\b`, 'gi');
    const matches = jdTextLower.match(regex);
    if (matches && matches.length > 0) {
      // Capitalize nicely
      const displayTerm = phrase
        .split(' ')
        .map((w) => (w.length <= 2 ? w.toUpperCase() : w.charAt(0).toUpperCase() + w.slice(1)))
        .join(' ')
        .replace(/Ci\/Cd/i, 'CI/CD')
        .replace(/Aws/i, 'AWS')
        .replace(/Api/i, 'API')
        .replace(/Ui\/Ux/i, 'UI/UX')
        .replace(/Nlp/i, 'NLP')
        .replace(/Ai/i, 'AI')
        .replace(/Sql/i, 'SQL');

      foundTermsMap.set(phrase, { term: displayTerm, count: matches.length * 2 }); // Boost multi-word significance
    }
  });

  // 2. Extract Single Keywords & Technical Acronyms
  const words = jobDescription
    .replace(/[^a-zA-Z0-9+#.\s\/-]/g, ' ')
    .split(/\s+/)
    .map((w) => w.trim())
    .filter((w) => w.length >= 2);

  const wordCounts: Record<string, number> = {};
  words.forEach((rawWord) => {
    const lower = rawWord.toLowerCase().replace(/^[.,;:!?'"()-]+|[.,;:!?'"()-]+$/g, '');
    if (lower.length >= 2 && !STOP_WORDS.has(lower) && isNaN(Number(lower))) {
      wordCounts[lower] = (wordCounts[lower] || 0) + 1;
    }
  });

  // Sort single words by frequency and select top ones
  Object.entries(wordCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 35)
    .forEach(([word, count]) => {
      // Check if this word is already part of an extracted multi-word phrase
      let partOfMulti = false;
      for (const phrase of foundTermsMap.keys()) {
        if (phrase.includes(word)) {
          partOfMulti = true;
          break;
        }
      }

      if (!partOfMulti && count >= 1) {
        // Format display term
        let display = word;
        if (word.length <= 4 && !['html', 'css', 'git', 'java', 'node', 'rust', 'ruby', 'jira'].includes(word)) {
          display = word.toUpperCase();
        } else if (word === 'javascript') display = 'JavaScript';
        else if (word === 'typescript') display = 'TypeScript';
        else if (word === 'postgresql' || word === 'postgres') display = 'PostgreSQL';
        else if (word === 'mongodb') display = 'MongoDB';
        else if (word === 'react' || word === 'reactjs') display = 'React';
        else if (word === 'nodejs') display = 'Node.js';
        else if (word === 'nextjs') display = 'Next.js';
        else if (word === 'graphql') display = 'GraphQL';
        else if (word === 'kubernetes') display = 'Kubernetes';
        else if (word === 'docker') display = 'Docker';
        else display = word.charAt(0).toUpperCase() + word.slice(1);

        foundTermsMap.set(word, { term: display, count });
      }
    });

  // 3. Build Extracted Keyword Objects with Occurrence Lookups
  const keywordsList: ExtractedKeyword[] = [];

  foundTermsMap.forEach(({ term }, normalized) => {
    const norm = normalized.toLowerCase();
    const regex = new RegExp(`\\b${norm.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'i');
    const isMatched = regex.test(fullResumeText) || fullResumeText.includes(norm);

    const occurrences: ExtractedKeyword['occurrencesInResume'] = [];

    // Find snippet matches in sections
    if (regex.test(sections.summary)) {
      occurrences.push({ section: 'Summary', snippet: extractSnippet(resume.summary || '', norm) });
    }

    if (resume.skills?.some((s) => s.name.toLowerCase().includes(norm))) {
      const matchSkill = resume.skills.find((s) => s.name.toLowerCase().includes(norm));
      occurrences.push({ section: 'Skills', snippet: matchSkill?.name || norm });
    }

    if (resume.experience) {
      resume.experience.forEach((exp) => {
        const matchBullet = exp.bullets?.find((b) => b.toLowerCase().includes(norm));
        if (matchBullet) {
          occurrences.push({
            section: 'Experience',
            snippet: `${exp.company} (${exp.role}): "${extractSnippet(matchBullet, norm)}"`,
          });
        }
      });
    }

    if (resume.projects) {
      resume.projects.forEach((proj) => {
        const matchBullet = proj.bullets?.find((b) => b.toLowerCase().includes(norm));
        if (matchBullet || proj.techStack?.some((t) => t.toLowerCase().includes(norm))) {
          occurrences.push({
            section: 'Projects',
            snippet: `${proj.name}: "${extractSnippet(matchBullet || proj.techStack.join(', '), norm)}"`,
          });
        }
      });
    }

    const countInJd = foundTermsMap.get(normalized)?.count || 1;
    const importance: ExtractedKeyword['importance'] =
      countInJd >= 3 ? 'High' : countInJd >= 2 ? 'Medium' : 'Low';

    const category = categorizeKeyword(term);
    const suggestedPhrase = generateSuggestedPhrase(term);

    keywordsList.push({
      term,
      normalizedTerm: norm,
      countInJd,
      isMatched,
      category,
      importance,
      occurrencesInResume: occurrences,
      suggestedPlacementSection: category === 'Tools & Platforms' || category === 'Technical Skills' ? 'Skills' : 'Experience',
      suggestedPhrase,
    });
  });

  // Sort: High importance missing keywords first, then by JD frequency
  keywordsList.sort((a, b) => {
    if (a.isMatched !== b.isMatched) {
      return a.isMatched ? 1 : -1; // Missing first
    }
    return b.countInJd - a.countInJd;
  });

  const matchedKeywords = keywordsList.filter((k) => k.isMatched);
  const missingKeywords = keywordsList.filter((k) => !k.isMatched);
  const matchPercentage =
    keywordsList.length > 0
      ? Math.round((matchedKeywords.length / keywordsList.length) * 100)
      : 100;

  return {
    totalJdKeywords: keywordsList.length,
    matchedCount: matchedKeywords.length,
    missingCount: missingKeywords.length,
    matchPercentage,
    keywords: keywordsList,
    matchedKeywords,
    missingKeywords,
  };
}

function extractSnippet(text: string, keyword: string, maxLen = 90): string {
  if (!text) return '';
  const idx = text.toLowerCase().indexOf(keyword.toLowerCase());
  if (idx === -1) return text.slice(0, maxLen);
  const start = Math.max(0, idx - 30);
  const end = Math.min(text.length, idx + keyword.length + 50);
  let snippet = text.slice(start, end);
  if (start > 0) snippet = '...' + snippet;
  if (end < text.length) snippet = snippet + '...';
  return snippet;
}

export interface HighlightSegment {
  text: string;
  isMatch: boolean;
  term?: string;
}

/**
 * Splits arbitrary text into highlighted and plain segments based on matching keywords
 */
export function highlightMatchedText(
  text: string,
  matchedTerms: string[]
): HighlightSegment[] {
  if (!text || matchedTerms.length === 0) {
    return [{ text, isMatch: false }];
  }

  // Sort terms by length descending to match longer phrases first
  const sortedTerms = [...matchedTerms].filter(Boolean).sort((a, b) => b.length - a.length);
  if (sortedTerms.length === 0) return [{ text, isMatch: false }];

  const escaped = sortedTerms.map((t) => t.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('|');
  const regex = new RegExp(`(${escaped})`, 'gi');

  const parts = text.split(regex);
  return parts.map((part) => {
    const isMatch = sortedTerms.some((t) => t.toLowerCase() === part.toLowerCase());
    return {
      text: part,
      isMatch,
      term: isMatch ? part : undefined,
    };
  });
}
