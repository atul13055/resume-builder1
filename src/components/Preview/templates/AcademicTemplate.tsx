import React from 'react';
import { ResumeData, ThemeConfig } from '../../../types/resume';

interface TemplateProps {
  resume: ResumeData;
  theme: ThemeConfig;
}

export const AcademicTemplate: React.FC<TemplateProps> = ({ resume, theme }) => {
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
  const fontSizeClass =
    theme.fontSize === 'sm' ? 'text-xs' : theme.fontSize === 'lg' ? 'text-sm' : 'text-[13px]';

  const hiddenSections = theme.hiddenSections || [];
  const isHidden = (sec: string) => hiddenSections.includes(sec);

  return (
    <div
      id="resume-printable-content"
      className={`w-full bg-white text-stone-900 p-10 md:p-12 ${fontSizeClass} leading-relaxed min-h-[1050px] shadow-sm print:shadow-none print:p-8 print:m-0`}
      style={{ fontFamily: 'Georgia, "Times New Roman", Times, serif' }}
    >
      {/* Centered Academic Header */}
      <header className="text-center border-b-2 border-stone-800 pb-4 mb-5">
        <h1 className="text-3xl font-bold tracking-tight text-stone-900 mb-1 uppercase">
          {p.fullName || 'Full Legal Name'}
        </h1>
        {p.title && (
          <p className="text-sm font-semibold tracking-wide text-stone-700 italic mb-2">
            {p.title}
          </p>
        )}
        <div className="flex flex-wrap justify-center items-center gap-x-2 gap-y-0.5 text-xs text-stone-700 font-serif">
          {p.email && <span>{p.email}</span>}
          {p.email && p.phone && <span className="text-stone-400">|</span>}
          {p.phone && <span>{p.phone}</span>}
          {(p.email || p.phone) && p.location && <span className="text-stone-400">|</span>}
          {p.location && <span>{p.location}</span>}
          {p.website && <span className="text-stone-400">|</span>}
          {p.website && <span>{p.website.replace(/^https?:\/\//, '')}</span>}
          {p.linkedin && <span className="text-stone-400">|</span>}
          {p.linkedin && <span>{p.linkedin.replace(/^https?:\/\/(www\.)?/, '')}</span>}
          {p.github && <span className="text-stone-400">|</span>}
          {p.github && <span>{p.github.replace(/^https?:\/\//, '')}</span>}
        </div>
      </header>

      <div className="space-y-5">
        {/* Education (Often first in Academic/CV style) */}
        {!isHidden('education') && resume.education && resume.education.length > 0 && (
          <section>
            <h2 className="text-xs font-bold uppercase tracking-widest text-stone-900 border-b border-stone-300 pb-1 mb-2.5">
              Education
            </h2>
            <div className="space-y-2.5">
              {resume.education.map((edu) => (
                <div key={edu.id} className="break-inside-avoid">
                  <div className="flex justify-between items-baseline">
                    <span className="font-bold text-stone-900">
                      {edu.school}, {edu.location}
                    </span>
                    <span className="text-xs text-stone-600 italic font-serif">
                      {edu.startDate} – {edu.endDate}
                    </span>
                  </div>
                  <div className="flex justify-between items-baseline text-xs italic text-stone-800">
                    <span>{edu.degree} in {edu.field}</span>
                    {edu.gpa && <span>GPA: {edu.gpa}</span>}
                  </div>
                  {edu.bullets && edu.bullets.length > 0 && (
                    <ul className="list-disc list-outside pl-4 space-y-0.5 mt-1 text-stone-700 text-xs">
                      {edu.bullets.map((b, i) => b.trim() && <li key={i}>{b}</li>)}
                    </ul>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Summary / Research Focus */}
        {!isHidden('summary') && resume.summary && (
          <section>
            <h2 className="text-xs font-bold uppercase tracking-widest text-stone-900 border-b border-stone-300 pb-1 mb-2">
              Professional & Academic Statement
            </h2>
            <p className="text-stone-800 text-justify leading-relaxed">{resume.summary}</p>
          </section>
        )}

        {/* Experience */}
        {!isHidden('experience') && resume.experience && resume.experience.length > 0 && (
          <section>
            <h2 className="text-xs font-bold uppercase tracking-widest text-stone-900 border-b border-stone-300 pb-1 mb-2.5">
              Appointments & Professional Experience
            </h2>
            <div className="space-y-3.5">
              {resume.experience.map((exp) => (
                <div key={exp.id} className="break-inside-avoid">
                  <div className="flex justify-between items-baseline flex-wrap gap-1">
                    <div className="font-bold text-stone-900 text-[13.5px]">
                      <span>{exp.role}</span>
                      <span className="text-stone-400 font-normal mx-1">|</span>
                      <span className="font-semibold text-stone-800">{exp.company}</span>
                    </div>
                    <div className="text-xs text-stone-600 italic font-serif">
                      {exp.location ? `${exp.location} | ` : ''}
                      {exp.startDate} – {exp.current ? 'Present' : exp.endDate || ''}
                    </div>
                  </div>
                  {exp.bullets && exp.bullets.length > 0 && (
                    <ul className="list-disc list-outside pl-4 space-y-1 text-stone-800 text-xs mt-1">
                      {exp.bullets.map((b, i) => b.trim() && <li key={i}>{b}</li>)}
                    </ul>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Projects / Publications */}
        {!isHidden('projects') && resume.projects && resume.projects.length > 0 && (
          <section>
            <h2 className="text-xs font-bold uppercase tracking-widest text-stone-900 border-b border-stone-300 pb-1 mb-2.5">
              Projects & Research Contributions
            </h2>
            <div className="space-y-2.5">
              {resume.projects.map((proj) => (
                <div key={proj.id} className="break-inside-avoid">
                  <div className="flex justify-between items-baseline">
                    <span className="font-bold text-stone-900">{proj.name}</span>
                    {proj.link && (
                      <span className="text-xs text-stone-600 underline">{proj.link.replace(/^https?:\/\//, '')}</span>
                    )}
                  </div>
                  {proj.bullets && proj.bullets.length > 0 && (
                    <ul className="list-disc list-outside pl-4 space-y-0.5 text-stone-800 text-xs">
                      {proj.bullets.map((b, i) => b.trim() && <li key={i}>{b}</li>)}
                    </ul>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Skills & Honors (Category Grouped Clean Text) */}
        {!isHidden('skills') && resume.skills && resume.skills.length > 0 && (
          <section>
            <h2 className="text-xs font-bold uppercase tracking-widest text-stone-900 border-b border-stone-300 pb-1 mb-1.5">
              Areas of Expertise & Skills
            </h2>
            {(() => {
              const categories: Record<string, string[]> = {};

              resume.skills.forEach((s) => {
                const cat = s.category || 'Core Skills';
                if (!categories[cat]) categories[cat] = [];
                categories[cat].push(s.name);
              });

              const catKeys = Object.keys(categories);
              if (catKeys.length > 1 || (catKeys.length === 1 && catKeys[0] !== 'Core Skills')) {
                return (
                  <div className="space-y-1 text-xs text-stone-800 leading-relaxed">
                    {catKeys.map((cat) => (
                      <div key={cat}>
                        <span className="font-bold text-stone-900">{cat}: </span>
                        <span>{categories[cat].join(', ')}</span>
                      </div>
                    ))}
                  </div>
                );
              }

              return (
                <p className="text-stone-800 text-xs leading-relaxed">
                  {resume.skills.map((s) => s.name).join(', ')}
                </p>
              );
            })()}
          </section>
        )}

        {/* Certifications & Languages */}
        {((!isHidden('certifications') && resume.certifications && resume.certifications.length > 0) ||
          (!isHidden('languages') && resume.languages && resume.languages.length > 0)) && (
          <div className="grid grid-cols-2 gap-4">
            {!isHidden('certifications') && resume.certifications && resume.certifications.length > 0 && (
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-stone-900 border-b border-stone-300 pb-0.5 mb-1.5">
                  Certifications
                </h3>
                <ul className="text-xs text-stone-800 space-y-0.5">
                  {resume.certifications.map((c) => (
                    <li key={c.id}>
                      <span className="font-semibold">{c.name}</span>, {c.issuer} ({c.issueDate})
                    </li>
                  ))}
                </ul>
              </div>
            )}
            {!isHidden('languages') && resume.languages && resume.languages.length > 0 && (
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-stone-900 border-b border-stone-300 pb-0.5 mb-1.5">
                  Languages
                </h3>
                <p className="text-xs text-stone-800">
                  {resume.languages.map((l) => `${l.language} (${l.proficiency})`).join(', ')}
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
