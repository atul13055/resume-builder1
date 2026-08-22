import React from 'react';
import { ResumeData, ThemeConfig } from '../../../types/resume';

interface TemplateProps {
  resume: ResumeData;
  theme: ThemeConfig;
}

export const MinimalTemplate: React.FC<TemplateProps> = ({ resume, theme }) => {
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
    ? { sectionGap: 'space-y-3.5', itemGap: 'space-y-2', padding: 'p-8', bulletGap: 'space-y-0.5' }
    : isSpacious
    ? { sectionGap: 'space-y-6', itemGap: 'space-y-3.5', padding: 'p-12', bulletGap: 'space-y-1.5' }
    : { sectionGap: 'space-y-4.5', itemGap: 'space-y-2.5', padding: 'p-10', bulletGap: 'space-y-1' };

  const fontSizeClass =
    theme.fontSize === 'sm' ? 'text-xs' : theme.fontSize === 'lg' ? 'text-sm' : 'text-[13px]';

  return (
    <div
      id="resume-printable-content"
      className={`w-full bg-white text-zinc-900 ${spacingClasses.padding} ${fontSizeClass} leading-normal min-h-[1050px] shadow-sm print:shadow-none print:p-6 print:m-0`}
      style={{
        fontFamily:
          theme.fontPairing === 'serif'
            ? 'Georgia, serif'
            : theme.fontPairing === 'mono'
            ? 'ui-monospace, monospace'
            : 'Inter, system-ui, sans-serif',
      }}
    >
      {/* Header */}
      <header className="border-b border-zinc-900 pb-3 mb-4">
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-zinc-900 uppercase">
          {p.fullName || 'Your Full Name'}
        </h1>
        {p.title && (
          <p className="text-xs sm:text-sm font-medium tracking-wider text-zinc-600 uppercase mt-0.5">
            {p.title}
          </p>
        )}
        <div className="flex flex-wrap gap-x-3 gap-y-0.5 text-xs text-zinc-600 mt-2 font-mono">
          {p.location && <span>{p.location}</span>}
          {p.phone && <span>• {p.phone}</span>}
          {p.email && <span>• {p.email}</span>}
          {p.linkedin && <span>• {p.linkedin.replace(/^https?:\/\/(www\.)?/, '')}</span>}
          {p.website && <span>• {p.website.replace(/^https?:\/\//, '')}</span>}
          {p.github && <span>• {p.github.replace(/^https?:\/\//, '')}</span>}
        </div>
      </header>

      <div className={spacingClasses.sectionGap}>
        {(theme.sectionOrder || ['summary', 'experience', 'skills', 'projects', 'education', 'certifications', 'languages']).map((secKey) => {
          if (secKey === 'summary' && resume.summary) {
            return (
              <section key="summary">
                <h2 className="text-xs font-bold uppercase tracking-wider text-zinc-900 border-b border-zinc-300 pb-0.5 mb-1.5 font-mono">
                  Summary
                </h2>
                <p className="text-zinc-800 text-justify">{resume.summary}</p>
              </section>
            );
          }

          if (secKey === 'experience' && resume.experience && resume.experience.length > 0) {
            return (
              <section key="experience">
                <h2 className="text-xs font-bold uppercase tracking-wider text-zinc-900 border-b border-zinc-300 pb-0.5 mb-2 font-mono">
                  Experience
                </h2>
                <div className={spacingClasses.itemGap}>
                  {resume.experience.map((exp) => (
                    <div key={exp.id} className="break-inside-avoid">
                      <div className="flex justify-between items-baseline">
                        <span className="font-bold text-zinc-950">{exp.role}</span>
                        <span className="text-xs font-mono text-zinc-600">
                          {exp.startDate} — {exp.current ? 'Present' : exp.endDate}
                        </span>
                      </div>
                      <div className="flex justify-between items-baseline text-xs text-zinc-700 font-medium">
                        <span>{exp.company}</span>
                        {exp.location && <span>{exp.location}</span>}
                      </div>
                      {exp.bullets && exp.bullets.length > 0 && (
                        <ul className={`mt-1 list-disc list-outside pl-4 text-zinc-800 ${spacingClasses.bulletGap}`}>
                          {exp.bullets.map((b, i) => b.trim() && <li key={i}>{b}</li>)}
                        </ul>
                      )}
                    </div>
                  ))}
                </div>
              </section>
            );
          }

          if (secKey === 'skills' && resume.skills && resume.skills.length > 0) {
            return (
              <section key="skills">
                <h2 className="text-xs font-bold uppercase tracking-wider text-zinc-900 border-b border-zinc-300 pb-0.5 mb-1.5 font-mono">
                  Technical & Core Skills
                </h2>
                <p className="text-zinc-800">
                  <span className="font-semibold text-zinc-900">Skills: </span>
                  {resume.skills.map((s) => s.name).join(' • ')}
                </p>
              </section>
            );
          }

          if (secKey === 'projects' && resume.projects && resume.projects.length > 0) {
            return (
              <section key="projects">
                <h2 className="text-xs font-bold uppercase tracking-wider text-zinc-900 border-b border-zinc-300 pb-0.5 mb-2 font-mono">
                  Projects
                </h2>
                <div className={spacingClasses.itemGap}>
                  {resume.projects.map((pr) => (
                    <div key={pr.id} className="break-inside-avoid">
                      <div className="flex justify-between items-baseline">
                        <span className="font-bold text-zinc-900">
                          {pr.name} {pr.techStack?.length ? `— ${pr.techStack.join(', ')}` : ''}
                        </span>
                        {pr.link && (
                          <span className="text-xs font-mono text-zinc-500">{pr.link.replace(/^https?:\/\//, '')}</span>
                        )}
                      </div>
                      {pr.bullets && pr.bullets.length > 0 && (
                        <ul className={`mt-1 list-disc list-outside pl-4 text-zinc-800 ${spacingClasses.bulletGap}`}>
                          {pr.bullets.map((b, i) => b.trim() && <li key={i}>{b}</li>)}
                        </ul>
                      )}
                    </div>
                  ))}
                </div>
              </section>
            );
          }

          if (secKey === 'education' && resume.education && resume.education.length > 0) {
            return (
              <section key="education">
                <h2 className="text-xs font-bold uppercase tracking-wider text-zinc-900 border-b border-zinc-300 pb-0.5 mb-1.5 font-mono">
                  Education
                </h2>
                <div className={spacingClasses.itemGap}>
                  {resume.education.map((edu) => (
                    <div key={edu.id} className="break-inside-avoid">
                      <div className="flex justify-between items-baseline">
                        <span className="font-bold text-zinc-900">
                          {edu.degree} {edu.field ? `in ${edu.field}` : ''}
                        </span>
                        <span className="text-xs font-mono text-zinc-600">
                          {edu.startDate} — {edu.endDate}
                        </span>
                      </div>
                      <div className="flex justify-between items-baseline text-xs text-zinc-700">
                        <span>{edu.school}</span>
                        {edu.gpa && <span>GPA: {edu.gpa}</span>}
                      </div>
                      {edu.bullets && edu.bullets.length > 0 && (
                        <ul className={`mt-1 list-disc list-outside pl-4 text-zinc-800 ${spacingClasses.bulletGap}`}>
                          {edu.bullets.map((b, i) => b.trim() && <li key={i}>{b}</li>)}
                        </ul>
                      )}
                    </div>
                  ))}
                </div>
              </section>
            );
          }

          if (secKey === 'certifications' && resume.certifications && resume.certifications.length > 0) {
            return (
              <section key="certifications">
                <h2 className="text-xs font-bold uppercase tracking-wider text-zinc-900 border-b border-zinc-300 pb-0.5 mb-1.5 font-mono">
                  Certifications
                </h2>
                <div className={spacingClasses.itemGap}>
                  {resume.certifications.map((cert) => (
                    <div key={cert.id} className="flex justify-between items-baseline text-xs">
                      <div>
                        <span className="font-semibold text-zinc-900">{cert.name}</span>
                        <span className="text-zinc-600"> — {cert.issuer}</span>
                      </div>
                      {cert.issueDate && <span className="font-mono text-zinc-500">{cert.issueDate}</span>}
                    </div>
                  ))}
                </div>
              </section>
            );
          }

          if (secKey === 'languages' && resume.languages && resume.languages.length > 0) {
            return (
              <section key="languages">
                <h2 className="text-xs font-bold uppercase tracking-wider text-zinc-900 border-b border-zinc-300 pb-0.5 mb-1.5 font-mono">
                  Languages
                </h2>
                <p className="text-xs text-zinc-800">
                  {resume.languages.map((l) => `${l.language} (${l.proficiency})`).join(' • ')}
                </p>
              </section>
            );
          }

          return null;
        })}
      </div>
    </div>
  );
};
