import { ResumeData } from '../types/resume';

export interface CompletenessItem {
  id: string;
  name: string;
  weight: number;
  isComplete: boolean;
  hint: string;
}

export interface ResumeCompletenessResult {
  percentage: number;
  completedCount: number;
  totalCount: number;
  items: CompletenessItem[];
  nextSuggestedAction: string | null;
}

export function calculateResumeCompleteness(resume: ResumeData): ResumeCompletenessResult {
  const p = resume.personalInfo || {
    fullName: '',
    title: '',
    email: '',
    phone: '',
    location: '',
    website: '',
    linkedin: '',
    github: '',
  };

  const hasName = Boolean(p.fullName && p.fullName.trim().length > 1);
  const hasTitle = Boolean(p.title && p.title.trim().length > 1);
  const hasContact = Boolean((p.email && p.email.trim().length > 3) && (p.phone && p.phone.trim().length > 3));
  const hasLocation = Boolean(p.location && p.location.trim().length > 1);
  const hasLinks = Boolean(p.linkedin || p.github || p.website);

  const hasSummary = Boolean(resume.summary && resume.summary.trim().length >= 30);
  
  const hasExperience = Boolean(
    resume.experience &&
    resume.experience.length > 0 &&
    resume.experience.some(
      (exp) =>
        exp.company?.trim() &&
        exp.role?.trim() &&
        Array.isArray(exp.bullets) &&
        exp.bullets.some((b) => b && b.trim().length > 5)
    )
  );

  const hasEducation = Boolean(
    resume.education &&
    resume.education.length > 0 &&
    resume.education.some((edu) => edu.school?.trim() && edu.degree?.trim())
  );

  const hasSkills = Boolean(
    resume.skills &&
    resume.skills.length >= 3 &&
    resume.skills.every((s) => s.name?.trim().length > 0)
  );

  const hasProjects = Boolean(
    resume.projects &&
    resume.projects.length > 0 &&
    resume.projects.some(
      (prj) =>
        prj.name?.trim() &&
        (prj.techStack?.length > 0 || (Array.isArray(prj.bullets) && prj.bullets.some((b) => b.trim().length > 3)))
    )
  );

  const hasCertOrLang = Boolean(
    (resume.certifications && resume.certifications.length > 0) ||
    (resume.languages && resume.languages.length > 0) ||
    (resume.customSections && resume.customSections.length > 0)
  );

  const items: CompletenessItem[] = [
    {
      id: 'personal_basic',
      name: 'Full Name & Professional Title',
      weight: 15,
      isComplete: hasName && hasTitle,
      hint: !hasName ? 'Add your full name' : !hasTitle ? 'Add your target job title' : 'Complete',
    },
    {
      id: 'personal_contact',
      name: 'Email, Phone & Location',
      weight: 10,
      isComplete: hasContact && hasLocation,
      hint: !hasContact ? 'Add verified email and phone number' : !hasLocation ? 'Add your city/location' : 'Complete',
    },
    {
      id: 'summary',
      name: 'Professional Summary',
      weight: 15,
      isComplete: hasSummary,
      hint: !hasSummary ? 'Write a 2-3 sentence executive summary' : 'Complete',
    },
    {
      id: 'experience',
      name: 'Work Experience & Impact Bullets',
      weight: 25,
      isComplete: hasExperience,
      hint: !hasExperience ? 'Add at least 1 job role with quantified bullet points' : 'Complete',
    },
    {
      id: 'education',
      name: 'Education & Degree',
      weight: 15,
      isComplete: hasEducation,
      hint: !hasEducation ? 'Add your university or degree' : 'Complete',
    },
    {
      id: 'skills',
      name: 'Key Skills (at least 3)',
      weight: 10,
      isComplete: hasSkills,
      hint: !hasSkills ? 'Add at least 3 relevant skills or technologies' : 'Complete',
    },
    {
      id: 'projects',
      name: 'Key Projects / Portfolio',
      weight: 5,
      isComplete: hasProjects,
      hint: !hasProjects ? 'Add 1 prominent project or portfolio item' : 'Complete',
    },
    {
      id: 'links_or_cert',
      name: 'Links & Additional Credentials',
      weight: 5,
      isComplete: hasLinks || hasCertOrLang,
      hint: !(hasLinks || hasCertOrLang) ? 'Add LinkedIn/GitHub link, certifications or languages' : 'Complete',
    },
  ];

  const earnedWeight = items.reduce((acc, item) => (item.isComplete ? acc + item.weight : acc), 0);
  const completedCount = items.filter((item) => item.isComplete).length;
  const percentage = Math.min(100, Math.max(0, earnedWeight));

  const firstIncomplete = items.find((item) => !item.isComplete);
  const nextSuggestedAction = firstIncomplete ? firstIncomplete.hint : null;

  return {
    percentage,
    completedCount,
    totalCount: items.length,
    items,
    nextSuggestedAction,
  };
}
