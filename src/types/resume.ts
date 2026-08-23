export type TemplateId =
  | 'modern'
  | 'minimal'
  | 'creative'
  | 'academic'
  | 'compact'
  | 'executive'
  | 'tech'
  | 'elegant'
  | 'nordic'
  | 'split'
  | 'infographic';
export type ResumeTemplateType = TemplateId;

export type FontPairing = 'sans' | 'serif' | 'mono';
export type FontSizeOption = 'sm' | 'md' | 'lg';
export type SpacingOption = 'compact' | 'normal' | 'spacious';
export type PaperSize = 'a4' | 'letter' | 'legal' | 'executive';

export interface PersonalInfo {
  fullName: string;
  title: string;
  email: string;
  phone: string;
  location: string;
  website: string;
  linkedin: string;
  github: string;
  photoUrl?: string;
}

export interface ExperienceItem {
  id: string;
  company: string;
  role: string;
  location: string;
  startDate: string;
  endDate: string;
  current: boolean;
  bullets: string[];
}

export interface EducationItem {
  id: string;
  school: string;
  degree: string;
  field: string;
  location: string;
  startDate: string;
  endDate: string;
  current?: boolean;
  gpa?: string;
  bullets: string[];
}

export interface SkillItem {
  id: string;
  name: string;
  category?: 'Technical' | 'Soft Skills' | 'Tools & Platforms' | 'Languages' | 'Other';
  level?: 'Beginner' | 'Intermediate' | 'Advanced' | 'Expert';
}

export interface ProjectItem {
  id: string;
  name: string;
  role?: string;
  link?: string;
  github?: string;
  startDate?: string;
  endDate?: string;
  techStack: string[];
  bullets: string[];
}

export interface CertificationItem {
  id: string;
  name: string;
  issuer: string;
  issueDate: string;
  expiryDate?: string;
  credentialId?: string;
  url?: string;
}

export interface LanguageItem {
  id: string;
  language: string;
  proficiency: 'Native' | 'Fluent' | 'Proficient' | 'Working' | 'Basic';
}

export interface CustomSectionItem {
  id: string;
  title: string;
  subtitle?: string;
  date?: string;
  bullets: string[];
}

export interface CustomSection {
  id: string;
  title: string;
  items: CustomSectionItem[];
}

export interface ResumeData {
  id: string;
  title: string; // e.g. "Senior Frontend Resume - Google"
  updatedAt: string;
  personalInfo: PersonalInfo;
  summary: string;
  experience: ExperienceItem[];
  education: EducationItem[];
  skills: SkillItem[];
  projects: ProjectItem[];
  certifications: CertificationItem[];
  languages: LanguageItem[];
  customSections: CustomSection[];
}

export interface ThemeConfig {
  template: TemplateId;
  primaryColor: string; // hex or tailwind token
  accentColor: string;
  fontPairing: FontPairing;
  fontSize: FontSizeOption;
  spacing: SpacingOption;
  paperSize: PaperSize;
  showPhoto: boolean;
  photoShape: 'circle' | 'square' | 'rounded';
  showIcons: boolean;
  sectionOrder: string[];
  hiddenSections: string[];
}

export interface ATSScoreBreakdown {
  keywordDensity: number;
  quantifiableImpact: number;
  formattingAndATS: number;
  actionVerbs: number;
  brevityAndClarity: number;
}

export interface ATSCriticalImprovement {
  section: string;
  issue: string;
  suggestion: string;
}

export interface ATSAnalysisResult {
  overallScore: number;
  verdict: string;
  breakdown: ATSScoreBreakdown;
  matchingKeywords: string[];
  missingKeywords: string[];
  strengths: string[];
  criticalImprovements: ATSCriticalImprovement[];
  quickWins: string[];
}

export interface TailoredExperience {
  experienceId?: string;
  company: string;
  role: string;
  originalBullets?: string[];
  tailoredBullets: string[];
  enhancementReason?: string;
}

export interface AITailorResult {
  jobTitleMatch: string;
  matchScoreBefore: number;
  matchScoreAfter: number;
  tailoredHeadline?: string;
  tailoredSummary: string;
  tailoredExperiences: TailoredExperience[];
  recommendedSkillsToAdd: string[];
  topKeywordsEmbedded: string[];
}
