import React from 'react';
import { ResumeData, ThemeConfig } from '../../../types/resume';

interface TemplateProps {
  resume: ResumeData;
  theme: ThemeConfig;
}

export const ElegantTemplate: React.FC<TemplateProps> = ({ resume, theme }) => {
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
    ? { sectionGap: 'space-y-4', itemGap: 'space-y-2.5', padding: 'p-8', bulletGap: 'space-y-0.5' }
    : isSpacious
    ? { sectionGap: 'space-y-6', itemGap: 'space-y-4', padding: 'p-12', bulletGap: 'space-y-1.5' }
    : { sectionGap: 'space-y-5', itemGap: 'space-y-3', padding: 'p-10', bulletGap: 'space-y-1' };

  const fontSizeClass =
    theme.fontSize === 'sm' ? 'text-xs' : theme.fontSize === 'lg' ? 'text-sm' : 'text-[13px]';

  const hiddenSections = theme.hiddenSections || [];
  const isHidden = (sec: string) => hiddenSections.includes(sec);

  return (
    <div
      id="resume-printable-content"
      className={`w-full bg-[#fdfbf7] text-stone-900 ${spacingClasses.padding} ${fontSizeClass} leading-relaxed min-h-[1050px] shadow-sm print:shadow-none print:p-8 print:m-0`}
      style={{
        fontFamily: 'Merriweather, Georgia, "Times New Roman", serif',
      }}
    >
      {/* Classic Editorial Masthead with Double Line */}
      <header className="text-center pb-5 mb-5 border-b border-stone-400/80 relative">
        <div className="inline-block mb-1">
          <h1
            className="text-2xl sm:text-4xl font-normal tracking-widest uppercase mb-1"
            style={{ color: theme.primaryColor }}
          >
            {p.fullName || 'Candidate Name'}
          </h1>
          <div className="w-16 h-0.5 mx-auto my-2" style={{ backgroundColor: theme.accentColor }} />
        </div>

        {p.title && (
          <p
            className="text-xs sm:text-sm font-semibold tracking-widest uppercase italic mb-2.5"
            style={{ color: theme.accentColor }}
          >
            {p.title}
          </p>
        )}

        <div className="flex flex-wrap justify-center items-center gap-x-4 gap-y-1 text-xs text-stone-600 font-sans tracking-wide">
          {p.location && <span>{p.location}</span>}
          {p.phone && <span>• {p.phone}</span>}
          {p.email && <span>• {p.email}</span>}
          {p.website && <span>• {p.website.replace(/^https?:\/\//, '')}</span>}
          {p.linkedin && <span>• {p.linkedin.replace(/^https?:\/\/(www\.)?/, '')}</span>}
        </div>
      </header>

      {/* Main Content */}
      <div className={spacingClasses.sectionGap}>
        {/* Summary */}
        {!isHidden('summary') && resume.summary && (
          <section id="section-summary">
            <h2
              className="text-xs font-bold uppercase tracking-widest mb-2 text-center"
              style={{ color: theme.primaryColor }}
            >
              — Executive Summary —
            </h2>
            <p className="text-stone-800 leading-relaxed text-justify px-2 italic font-serif">
              "{resume.summary}"
            </p>
          </section>
        )}

        {/* Experience */}
        {!isHidden('experience') && resume.experience && resume.experience.length > 0 && (
          <section id="section-experience">
            <div className="flex items-center justify-center gap-3 mb-3">
              <div className="h-px bg-stone-300 flex-1" />
              <h2
                className="text-xs font-bold uppercase tracking-widest px-2"
                style={{ color: theme.primaryColor }}
              >
                Professional Experience
              </h2>
              <div className="h-px bg-stone-300 flex-1" />
            </div>

            <div className={spacingClasses.itemGap}>
              {resume.experience.map((exp) => (
                <div key={exp.id} className="break-inside-avoid">
                  <div className="flex justify-between items-baseline flex-wrap gap-1">
                    <div>
                      <span className="font-bold text-stone-900">{exp.role}</span>
                      <span className="text-stone-500 italic">, {exp.company}</span>
                    </div>
                    <span className="text-xs font-sans text-stone-600 italic">
                      {exp.startDate} – {exp.current ? 'Present' : exp.endDate || ''}
                      {exp.location && ` | ${exp.location}`}
                    </span>
                  </div>

                  {exp.bullets && exp.bullets.length > 0 && (
                    <ul className={`mt-1.5 list-disc list-outside pl-4 text-stone-800 ${spacingClasses.bulletGap}`}>
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

        {/* Education */}
        {!isHidden('education') && resume.education && resume.education.length > 0 && (
          <section id="section-education">
            <div className="flex items-center justify-center gap-3 mb-3">
              <div className="h-px bg-stone-300 flex-1" />
              <h2
                className="text-xs font-bold uppercase tracking-widest px-2"
                style={{ color: theme.primaryColor }}
              >
                Education & Honors
              </h2>
              <div className="h-px bg-stone-300 flex-1" />
            </div>

            <div className={spacingClasses.itemGap}>
              {resume.education.map((edu) => (
                <div key={edu.id} className="break-inside-avoid">
                  <div className="flex justify-between items-baseline flex-wrap gap-1">
                    <div>
                      <span className="font-bold text-stone-900">
                        {edu.degree} {edu.field ? `in ${edu.field}` : ''}
                      </span>
                      <span className="text-stone-600 italic">, {edu.school}</span>
                    </div>
                    <span className="text-xs font-sans text-stone-600 italic">
                      {edu.startDate} – {edu.endDate} {edu.gpa ? `| GPA: ${edu.gpa}` : ''}
                    </span>
                  </div>
                  {edu.bullets && edu.bullets.length > 0 && (
                    <ul className={`mt-1 list-disc list-outside pl-4 text-stone-800 ${spacingClasses.bulletGap}`}>
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

        {/* Projects */}
        {!isHidden('projects') && resume.projects && resume.projects.length > 0 && (
          <section id="section-projects">
            <div className="flex items-center justify-center gap-3 mb-3">
              <div className="h-px bg-stone-300 flex-1" />
              <h2
                className="text-xs font-bold uppercase tracking-widest px-2"
                style={{ color: theme.primaryColor }}
              >
                Key Case Studies & Engagements
              </h2>
              <div className="h-px bg-stone-300 flex-1" />
            </div>

            <div className={spacingClasses.itemGap}>
              {resume.projects.map((proj) => (
                <div key={proj.id} className="break-inside-avoid">
                  <div className="flex justify-between items-baseline flex-wrap gap-1">
                    <span className="font-bold text-stone-900">{proj.name}</span>
                    {proj.link && (
                      <a
                        href={proj.link.startsWith('http') ? proj.link : `https://${proj.link}`}
                        target="_blank"
                        rel="noreferrer"
                        className="text-xs font-sans hover:underline"
                        style={{ color: theme.accentColor }}
                      >
                        {proj.link.replace(/^https?:\/\//, '')}
                      </a>
                    )}
                  </div>
                  {proj.bullets && proj.bullets.length > 0 && (
                    <ul className={`mt-1 list-disc list-outside pl-4 text-stone-800 ${spacingClasses.bulletGap}`}>
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

        {/* Skills & Certifications Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          {!isHidden('skills') && resume.skills && resume.skills.length > 0 && (
            <section id="section-skills">
              <h3
                className="text-xs font-bold uppercase tracking-widest mb-1.5 pb-0.5 border-b border-stone-300"
                style={{ color: theme.primaryColor }}
              >
                Areas of Practice & Expertise
              </h3>
              <p className="text-xs text-stone-800 leading-relaxed">
                {resume.skills.map((s) => s.name).join(' • ')}
              </p>
            </section>
          )}

          {((!isHidden('certifications') && resume.certifications && resume.certifications.length > 0) ||
            (!isHidden('languages') && resume.languages && resume.languages.length > 0)) && (
            <section id="section-credentials">
              <h3
                className="text-xs font-bold uppercase tracking-widest mb-1.5 pb-0.5 border-b border-stone-300"
                style={{ color: theme.primaryColor }}
              >
                Certifications & Languages
              </h3>
              <div className="space-y-1 text-xs text-stone-800">
                {resume.certifications?.map((c) => (
                  <div key={c.id}>
                    <span className="font-semibold">{c.name}</span> — {c.issuer}
                  </div>
                ))}
                {resume.languages?.length > 0 && (
                  <div className="pt-1">
                    <span className="font-semibold">Languages: </span>
                    {resume.languages.map((l) => `${l.language} (${l.proficiency})`).join(', ')}
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
