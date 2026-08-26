import React from 'react';
import { ResumeData, ThemeConfig } from '../../../types/resume';
import { Mail, Phone, MapPin, Globe, Linkedin, Github } from 'lucide-react';

interface TemplateProps {
  resume: ResumeData;
  theme: ThemeConfig;
}

export const ModernTemplate: React.FC<TemplateProps> = ({ resume, theme }) => {
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
    ? { sectionGap: 'space-y-4', itemGap: 'space-y-2', padding: 'p-8', bulletGap: 'space-y-1' }
    : isSpacious
    ? { sectionGap: 'space-y-7', itemGap: 'space-y-4', padding: 'p-12', bulletGap: 'space-y-2' }
    : { sectionGap: 'space-y-5', itemGap: 'space-y-3', padding: 'p-10', bulletGap: 'space-y-1.5' };

  const fontSizeClass =
    theme.fontSize === 'sm' ? 'text-xs' : theme.fontSize === 'lg' ? 'text-sm' : 'text-[13px]';

  const hiddenSections = theme.hiddenSections || [];
  const isHidden = (sec: string) => hiddenSections.includes(sec);

  return (
    <div
      id="resume-printable-content"
      className={`w-full bg-white text-slate-800 ${spacingClasses.padding} ${fontSizeClass} leading-relaxed min-h-[1050px] shadow-sm print:shadow-none print:p-8 print:m-0`}
      style={{
        fontFamily:
          theme.fontPairing === 'serif'
            ? 'Georgia, Cambria, serif'
            : theme.fontPairing === 'mono'
            ? 'ui-monospace, SFMono-Regular, monospace'
            : 'system-ui, -apple-system, sans-serif',
      }}
    >
      {/* Top Accent Strip */}
      <div
        className="w-full h-2 rounded-t-sm mb-6 print:mb-4"
        style={{ backgroundColor: theme.accentColor }}
      />

      {/* Header */}
      <header className="border-b border-slate-200 pb-5 mb-5 print:pb-4 print:mb-4">
        <div className="flex justify-between items-start">
          <div className="flex-1">
            <h1
              className="text-3xl sm:text-4xl font-bold tracking-tight mb-1"
              style={{ color: theme.primaryColor }}
            >
              {p.fullName || 'Your Name'}
            </h1>
            <p
              className="text-base sm:text-lg font-semibold mb-3 tracking-wide"
              style={{ color: theme.accentColor }}
            >
              {p.title || 'Professional Title'}
            </p>

            {/* Clean ATS-Optimized Contact Lines (Pipe Separated) */}
            <div className="text-xs text-slate-600 space-y-0.5">
              <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5">
                {p.email && <a href={`mailto:${p.email}`} className="hover:underline">{p.email}</a>}
                {p.email && p.phone && <span className="text-slate-300">|</span>}
                {p.phone && <span>{p.phone}</span>}
                {(p.email || p.phone) && p.location && <span className="text-slate-300">|</span>}
                {p.location && <span>{p.location}</span>}
              </div>
              {(p.linkedin || p.github || p.website) && (
                <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5 text-slate-500">
                  {p.linkedin && (
                    <a href={p.linkedin.startsWith('http') ? p.linkedin : `https://${p.linkedin}`} target="_blank" rel="noreferrer" className="hover:underline">
                      {p.linkedin.replace(/^https?:\/\/(www\.)?/, '')}
                    </a>
                  )}
                  {p.linkedin && p.github && <span className="text-slate-300">|</span>}
                  {p.github && (
                    <a href={p.github.startsWith('http') ? p.github : `https://${p.github}`} target="_blank" rel="noreferrer" className="hover:underline">
                      {p.github.replace(/^https?:\/\/(www\.)?/, '')}
                    </a>
                  )}
                  {(p.linkedin || p.github) && p.website && <span className="text-slate-300">|</span>}
                  {p.website && (
                    <a href={p.website.startsWith('http') ? p.website : `https://${p.website}`} target="_blank" rel="noreferrer" className="hover:underline">
                      {p.website.replace(/^https?:\/\//, '')}
                    </a>
                  )}
                </div>
              )}
            </div>
          </div>

          {theme.showPhoto && p.photoUrl && (
            <img
              src={p.photoUrl}
              alt={p.fullName}
              className={`w-20 h-20 object-cover border-2 border-slate-200 ml-4 ${
                theme.photoShape === 'circle' ? 'rounded-full' : theme.photoShape === 'rounded' ? 'rounded-xl' : 'rounded-none'
              }`}
            />
          )}
        </div>
      </header>

      {/* Main Sections */}
      <div className={spacingClasses.sectionGap}>
        {/* Professional Summary */}
        {!isHidden('summary') && resume.summary && (
          <section id="section-summary">
            <h2
              className="text-xs font-bold uppercase tracking-wider mb-2 pb-1 border-b-2 flex items-center justify-between"
              style={{ color: theme.primaryColor, borderColor: theme.accentColor }}
            >
              Professional Summary
            </h2>
            <p className="text-slate-700 leading-normal text-justify">{resume.summary}</p>
          </section>
        )}

        {/* Work Experience */}
        {!isHidden('experience') && resume.experience && resume.experience.length > 0 && (
          <section id="section-experience">
            <h2
              className="text-xs font-bold uppercase tracking-wider mb-2.5 pb-1 border-b-2"
              style={{ color: theme.primaryColor, borderColor: theme.accentColor }}
            >
              Work Experience
            </h2>
            <div className={spacingClasses.itemGap}>
              {resume.experience.map((exp) => (
                <div key={exp.id} className="break-inside-avoid">
                  <div className="flex justify-between items-baseline flex-wrap gap-1">
                    <div className="font-bold text-slate-900 text-[13.5px]">
                      <span>{exp.role}</span>
                      <span className="text-slate-400 font-normal mx-1">|</span>
                      <span className="font-semibold" style={{ color: theme.accentColor }}>{exp.company}</span>
                    </div>
                    <div className="text-xs font-medium text-slate-500 font-mono">
                      {exp.location ? `${exp.location} | ` : ''}
                      {exp.startDate} – {exp.current ? 'Present' : exp.endDate || ''}
                    </div>
                  </div>

                  {exp.bullets && exp.bullets.length > 0 && (
                    <ul className={`mt-1.5 list-disc list-outside pl-4 text-slate-700 ${spacingClasses.bulletGap}`}>
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

        {/* Skills (Clean ATS Category-Grouped Text, No Pills) */}
        {!isHidden('skills') && resume.skills && resume.skills.length > 0 && (
          <section id="section-skills">
            <h2
              className="text-xs font-bold uppercase tracking-wider mb-2 pb-1 border-b-2"
              style={{ color: theme.primaryColor, borderColor: theme.accentColor }}
            >
              Skills & Expertise
            </h2>
            {(() => {
              const categories: Record<string, string[]> = {};
              const uncategorized: string[] = [];

              resume.skills.forEach((s) => {
                const cat = s.category || 'Core Skills';
                if (!categories[cat]) categories[cat] = [];
                categories[cat].push(s.name);
              });

              const catKeys = Object.keys(categories);
              if (catKeys.length > 1 || (catKeys.length === 1 && catKeys[0] !== 'Core Skills')) {
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

        {/* Projects */}
        {!isHidden('projects') && resume.projects && resume.projects.length > 0 && (
          <section id="section-projects">
            <h2
              className="text-xs font-bold uppercase tracking-wider mb-2.5 pb-1 border-b-2"
              style={{ color: theme.primaryColor, borderColor: theme.accentColor }}
            >
              Key Projects
            </h2>
            <div className={spacingClasses.itemGap}>
              {resume.projects.map((proj) => (
                <div key={proj.id} className="break-inside-avoid">
                  <div className="flex justify-between items-baseline flex-wrap gap-1">
                    <div>
                      <span className="font-bold text-slate-900">{proj.name}</span>
                      {proj.techStack && proj.techStack.length > 0 && (
                        <span className="text-xs text-slate-500 ml-2">
                          [{proj.techStack.join(', ')}]
                        </span>
                      )}
                    </div>
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

        {/* Education */}
        {!isHidden('education') && resume.education && resume.education.length > 0 && (
          <section id="section-education">
            <h2
              className="text-xs font-bold uppercase tracking-wider mb-2.5 pb-1 border-b-2"
              style={{ color: theme.primaryColor, borderColor: theme.accentColor }}
            >
              Education
            </h2>
            <div className={spacingClasses.itemGap}>
              {resume.education.map((edu) => (
                <div key={edu.id} className="break-inside-avoid">
                  <div className="flex justify-between items-baseline flex-wrap gap-1">
                    <div>
                      <span className="font-bold text-slate-900">
                        {edu.degree} {edu.field ? `in ${edu.field}` : ''}
                      </span>
                      <span className="text-slate-500 font-medium"> – </span>
                      <span className="font-semibold text-slate-700">{edu.school}</span>
                    </div>
                    <span className="text-xs font-medium text-slate-500">
                      {edu.startDate} – {edu.endDate} {edu.gpa ? `| GPA: ${edu.gpa}` : ''}
                    </span>
                  </div>
                  {edu.bullets && edu.bullets.length > 0 && (
                    <ul className={`mt-1 list-disc list-outside pl-4 text-slate-700 ${spacingClasses.bulletGap}`}>
                      {edu.bullets.map((b, idx) => b.trim() && (
                        <li key={idx} className="leading-snug">{b}</li>
                      ))}
                    </ul>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Certifications & Languages Grid */}
        {((!isHidden('certifications') && resume.certifications && resume.certifications.length > 0) ||
          (!isHidden('languages') && resume.languages && resume.languages.length > 0)) && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {!isHidden('certifications') && resume.certifications && resume.certifications.length > 0 && (
              <section id="section-certifications">
                <h2
                  className="text-xs font-bold uppercase tracking-wider mb-2 pb-1 border-b-2"
                  style={{ color: theme.primaryColor, borderColor: theme.accentColor }}
                >
                  Certifications
                </h2>
                <ul className="space-y-1 text-slate-700 text-xs">
                  {resume.certifications.map((c) => (
                    <li key={c.id}>
                      <span className="font-semibold text-slate-900">{c.name}</span>
                      <span className="text-slate-500"> – {c.issuer} ({c.issueDate})</span>
                    </li>
                  ))}
                </ul>
              </section>
            )}

            {!isHidden('languages') && resume.languages && resume.languages.length > 0 && (
              <section id="section-languages">
                <h2
                  className="text-xs font-bold uppercase tracking-wider mb-2 pb-1 border-b-2"
                  style={{ color: theme.primaryColor, borderColor: theme.accentColor }}
                >
                  Languages
                </h2>
                <div className="flex flex-wrap gap-2 text-xs text-slate-700">
                  {resume.languages.map((l) => (
                    <span key={l.id} className="font-medium">
                      {l.language} <span className="text-slate-500">({l.proficiency})</span>
                    </span>
                  ))}
                </div>
              </section>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
