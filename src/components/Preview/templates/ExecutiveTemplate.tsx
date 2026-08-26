import React from 'react';
import { ResumeData, ThemeConfig } from '../../../types/resume';
import { Mail, Phone, MapPin, Globe, Linkedin, Github, ShieldCheck, Award } from 'lucide-react';

interface TemplateProps {
  resume: ResumeData;
  theme: ThemeConfig;
}

export const ExecutiveTemplate: React.FC<TemplateProps> = ({ resume, theme }) => {
  const p = resume?.personalInfo || {
    fullName: '',
    title: '',
    email: '',
    phone: '',
    location: '',
    website: '',
    linkedin: '',
    github: '',
  };

  const isCompact = theme.spacing === 'compact';
  const isSpacious = theme.spacing === 'spacious';

  const spacingClasses = isCompact
    ? { sectionGap: 'space-y-4', itemGap: 'space-y-2.5', padding: 'p-6 sm:p-8', bulletGap: 'space-y-0.5' }
    : isSpacious
    ? { sectionGap: 'space-y-6', itemGap: 'space-y-4', padding: 'p-10 sm:p-12', bulletGap: 'space-y-1.5' }
    : { sectionGap: 'space-y-5', itemGap: 'space-y-3', padding: 'p-8 sm:p-10', bulletGap: 'space-y-1' };

  const fontSizeClass =
    theme.fontSize === 'sm' ? 'text-xs' : theme.fontSize === 'lg' ? 'text-sm' : 'text-[13px]';

  const hiddenSections = theme.hiddenSections || [];
  const isHidden = (sec: string) => hiddenSections.includes(sec);

  return (
    <div
      id="resume-printable-content"
      className={`w-full bg-white text-slate-900 ${fontSizeClass} leading-relaxed min-h-[1050px] shadow-sm print:shadow-none print:p-0 print:m-0`}
      style={{
        fontFamily:
          theme.fontPairing === 'serif'
            ? 'Georgia, Cambria, serif'
            : theme.fontPairing === 'mono'
            ? 'ui-monospace, SFMono-Regular, monospace'
            : 'system-ui, -apple-system, sans-serif',
      }}
    >
      {/* Executive Dark Header Banner */}
      <header
        className="px-8 py-7 sm:px-10 sm:py-8 text-white relative overflow-hidden"
        style={{ backgroundColor: theme.primaryColor }}
      >
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 relative z-10">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <span
                className="inline-block w-2.5 h-2.5 rounded-full"
                style={{ backgroundColor: theme.accentColor }}
              />
              <span className="text-[10px] font-bold uppercase tracking-widest text-slate-300">
                Executive Profile
              </span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-white mb-1.5 uppercase">
              {p.fullName || 'Executive Full Name'}
            </h1>
            <p
              className="text-sm sm:text-base font-semibold tracking-wide"
              style={{ color: theme.accentColor }}
            >
              {p.title || 'Chief Executive / Senior Director'}
            </p>
          </div>

          {/* Clean ATS Contact Details */}
          <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5 text-xs text-slate-200 font-mono">
            {p.email && <a href={`mailto:${p.email}`} className="hover:underline text-slate-100">{p.email}</a>}
            {p.email && p.phone && <span className="text-slate-400">|</span>}
            {p.phone && <span>{p.phone}</span>}
            {(p.email || p.phone) && p.location && <span className="text-slate-400">|</span>}
            {p.location && <span>{p.location}</span>}
            {p.linkedin && <span className="text-slate-400">|</span>}
            {p.linkedin && (
              <a
                href={p.linkedin.startsWith('http') ? p.linkedin : `https://${p.linkedin}`}
                target="_blank"
                rel="noreferrer"
                className="hover:underline text-slate-100"
              >
                {p.linkedin.replace(/^https?:\/\/(www\.)?/, '')}
              </a>
            )}
          </div>
        </div>

        {/* Accent Underline */}
        <div
          className="absolute bottom-0 left-0 right-0 h-1.5"
          style={{ backgroundColor: theme.accentColor }}
        />
      </header>

      {/* Main Body */}
      <div className={`${spacingClasses.padding} ${spacingClasses.sectionGap}`}>
        {/* Executive Summary Block */}
        {!isHidden('summary') && resume.summary && (
          <section id="section-summary" className="p-4 rounded-xl border border-slate-200 bg-slate-50/70">
            <h2
              className="text-xs font-black uppercase tracking-wider mb-2 flex items-center gap-1.5"
              style={{ color: theme.primaryColor }}
            >
              <ShieldCheck className="w-4 h-4" style={{ color: theme.accentColor }} />
              Executive Value Proposition & Leadership Summary
            </h2>
            <p className="text-slate-800 leading-relaxed text-justify">{resume.summary}</p>
          </section>
        )}

        {/* Skills Section (Category Grouped Clean Plain Text) */}
        {!isHidden('skills') && resume.skills && resume.skills.length > 0 && (
          <section id="section-skills">
            <h2
              className="text-xs font-black uppercase tracking-wider mb-2.5 pb-1 border-b-2 flex items-center justify-between"
              style={{ color: theme.primaryColor, borderColor: theme.accentColor }}
            >
              <span>Areas of Strategic Expertise & Core Competencies</span>
            </h2>
            {(() => {
              const categories: Record<string, string[]> = {};

              resume.skills.forEach((s) => {
                const cat = s.category || 'Core Competencies';
                if (!categories[cat]) categories[cat] = [];
                categories[cat].push(s.name);
              });

              const catKeys = Object.keys(categories);
              if (catKeys.length > 1 || (catKeys.length === 1 && catKeys[0] !== 'Core Competencies')) {
                return (
                  <div className="space-y-1 text-xs text-slate-800 leading-relaxed">
                    {catKeys.map((cat) => (
                      <div key={cat}>
                        <span className="font-bold text-slate-900">{cat}: </span>
                        <span>{categories[cat].join(', ')}</span>
                      </div>
                    ))}
                  </div>
                );
              }

              return (
                <p className="text-slate-800 text-xs leading-relaxed">
                  {resume.skills.map((s) => s.name).join(', ')}
                </p>
              );
            })()}
          </section>
        )}

        {/* Professional Experience */}
        {!isHidden('experience') && resume.experience && resume.experience.length > 0 && (
          <section id="section-experience">
            <h2
              className="text-xs font-black uppercase tracking-wider mb-3 pb-1 border-b-2"
              style={{ color: theme.primaryColor, borderColor: theme.accentColor }}
            >
              Career History & Executive Leadership
            </h2>
            <div className={spacingClasses.itemGap}>
              {resume.experience.map((exp) => (
                <div key={exp.id} className="break-inside-avoid">
                  <div className="flex justify-between items-baseline flex-wrap gap-1">
                    <div className="font-bold text-slate-950 text-sm sm:text-base">
                      <span>{exp.role}</span>
                      <span className="text-slate-400 font-normal mx-1">|</span>
                      <span className="font-bold" style={{ color: theme.accentColor }}>{exp.company}</span>
                    </div>
                    <div className="text-xs font-bold text-slate-500 font-mono">
                      {exp.location ? `${exp.location} | ` : ''}
                      {exp.startDate} – {exp.current ? 'Present' : exp.endDate || ''}
                    </div>
                  </div>

                  {exp.bullets && exp.bullets.length > 0 && (
                    <ul className={`mt-2 list-disc list-outside pl-4 text-slate-700 ${spacingClasses.bulletGap}`}>
                      {exp.bullets.map((b, idx) => b.trim() && (
                        <li key={idx} className="leading-snug">
                          {b}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Key Projects */}
        {!isHidden('projects') && resume.projects && resume.projects.length > 0 && (
          <section id="section-projects">
            <h2
              className="text-xs font-black uppercase tracking-wider mb-2.5 pb-1 border-b-2"
              style={{ color: theme.primaryColor, borderColor: theme.accentColor }}
            >
              Key Initiatives & Enterprise Projects
            </h2>
            <div className={spacingClasses.itemGap}>
              {resume.projects.map((proj) => (
                <div key={proj.id} className="break-inside-avoid">
                  <div className="flex justify-between items-baseline flex-wrap gap-1">
                    <span className="font-bold text-slate-900">{proj.name}</span>
                    {proj.link && (
                      <a
                        href={proj.link.startsWith('http') ? proj.link : `https://${proj.link}`}
                        target="_blank"
                        rel="noreferrer"
                        className="text-xs hover:underline"
                        style={{ color: theme.accentColor }}
                      >
                        {proj.link.replace(/^https?:\/\//, '')}
                      </a>
                    )}
                  </div>
                  {proj.bullets && proj.bullets.length > 0 && (
                    <ul className={`mt-1 list-disc list-outside pl-4 text-slate-700 ${spacingClasses.bulletGap}`}>
                      {proj.bullets.map((b, idx) => b.trim() && (
                        <li key={idx} className="leading-snug">{b}</li>
                      ))}
                    </ul>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Education & Credentials */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {!isHidden('education') && resume.education && resume.education.length > 0 && (
            <section id="section-education">
              <h2
                className="text-xs font-black uppercase tracking-wider mb-2 pb-1 border-b-2"
                style={{ color: theme.primaryColor, borderColor: theme.accentColor }}
              >
                Education & Credentials
              </h2>
              <div className="space-y-2">
                {resume.education.map((edu) => (
                  <div key={edu.id} className="break-inside-avoid text-xs">
                    <p className="font-bold text-slate-900">
                      {edu.degree} {edu.field ? `in ${edu.field}` : ''}
                    </p>
                    <p className="text-slate-600 font-medium">{edu.school}</p>
                    <p className="text-slate-400 text-[11px]">
                      {edu.startDate} – {edu.endDate} {edu.gpa ? `| GPA: ${edu.gpa}` : ''}
                    </p>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Certifications & Languages */}
          {((!isHidden('certifications') && resume.certifications && resume.certifications.length > 0) ||
            (!isHidden('languages') && resume.languages && resume.languages.length > 0)) && (
            <section id="section-credentials">
              <h2
                className="text-xs font-black uppercase tracking-wider mb-2 pb-1 border-b-2"
                style={{ color: theme.primaryColor, borderColor: theme.accentColor }}
              >
                Board Certifications & Languages
              </h2>
              <div className="space-y-2 text-xs text-slate-700">
                {resume.certifications?.map((c) => (
                  <div key={c.id}>
                    <span className="font-semibold text-slate-900">{c.name}</span>
                    <span className="text-slate-500"> – {c.issuer}</span>
                  </div>
                ))}
                {resume.languages?.length > 0 && (
                  <div className="pt-1 flex flex-wrap gap-1.5">
                    {resume.languages.map((l) => (
                      <span key={l.id} className="font-medium px-2 py-0.5 rounded bg-slate-100 text-slate-800 text-[11px]">
                        {l.language} ({l.proficiency})
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </section>
          )}
        </div>
      </div>
    </div>
  );
};
