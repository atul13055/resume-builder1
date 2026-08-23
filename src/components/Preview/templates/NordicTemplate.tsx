import React from 'react';
import { ResumeData, ThemeConfig } from '../../../types/resume';
import { Mail, Phone, MapPin, Globe, Linkedin, Github, Compass } from 'lucide-react';

interface TemplateProps {
  resume: ResumeData;
  theme: ThemeConfig;
}

export const NordicTemplate: React.FC<TemplateProps> = ({ resume, theme }) => {
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
    ? { sectionGap: 'space-y-4', itemGap: 'space-y-2.5', padding: 'p-6 sm:p-8', bulletGap: 'space-y-1' }
    : isSpacious
    ? { sectionGap: 'space-y-6', itemGap: 'space-y-4', padding: 'p-10 sm:p-12', bulletGap: 'space-y-2' }
    : { sectionGap: 'space-y-5', itemGap: 'space-y-3', padding: 'p-8 sm:p-10', bulletGap: 'space-y-1.5' };

  const fontSizeClass =
    theme.fontSize === 'sm' ? 'text-xs' : theme.fontSize === 'lg' ? 'text-sm' : 'text-[13px]';

  const hiddenSections = theme.hiddenSections || [];
  const isHidden = (sec: string) => hiddenSections.includes(sec);

  return (
    <div
      id="resume-printable-content"
      className={`w-full bg-[#fafbfc] text-slate-800 ${spacingClasses.padding} ${fontSizeClass} leading-relaxed min-h-[1050px] shadow-sm print:shadow-none print:p-6 print:m-0`}
      style={{
        fontFamily:
          theme.fontPairing === 'serif'
            ? 'Georgia, serif'
            : theme.fontPairing === 'mono'
            ? 'ui-monospace, monospace'
            : 'Plus Jakarta Sans, Inter, system-ui, sans-serif',
      }}
    >
      {/* Nordic Minimalist Header */}
      <header className="mb-6 pb-4 border-b border-slate-200/80">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-baseline gap-2 mb-2">
          <div>
            <h1
              className="text-3xl sm:text-4xl font-light tracking-tight text-slate-900"
              style={{ color: theme.primaryColor }}
            >
              <span className="font-extrabold">{p.fullName?.split(' ')[0] || 'Firstname'}</span>{' '}
              <span>{p.fullName?.split(' ').slice(1).join(' ') || 'Lastname'}</span>
            </h1>
            <p
              className="text-xs sm:text-sm font-semibold tracking-widest uppercase mt-0.5"
              style={{ color: theme.accentColor }}
            >
              {p.title || 'Professional Specialist'}
            </p>
          </div>

          {/* Clean Contact Tags */}
          <div className="flex flex-wrap gap-x-3 gap-y-1 text-xs text-slate-500">
            {p.location && <span className="flex items-center gap-1"><MapPin className="w-3 h-3 text-slate-400" /> {p.location}</span>}
            {p.email && <span className="flex items-center gap-1"><Mail className="w-3 h-3 text-slate-400" /> {p.email}</span>}
            {p.phone && <span className="flex items-center gap-1"><Phone className="w-3 h-3 text-slate-400" /> {p.phone}</span>}
            {p.linkedin && <span className="flex items-center gap-1"><Linkedin className="w-3 h-3 text-slate-400" /> {p.linkedin.replace(/^https?:\/\/(www\.)?/, '')}</span>}
          </div>
        </div>
      </header>

      {/* Main Flow */}
      <div className={spacingClasses.sectionGap}>
        {/* Profile Statement */}
        {!isHidden('summary') && resume.summary && (
          <section id="section-summary" className="pl-4 border-l-2" style={{ borderColor: theme.accentColor }}>
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">
              Background & Focus
            </h2>
            <p className="text-slate-700 leading-relaxed text-justify">{resume.summary}</p>
          </section>
        )}

        {/* Experience Timeline */}
        {!isHidden('experience') && resume.experience && resume.experience.length > 0 && (
          <section id="section-experience">
            <h2
              className="text-xs font-extrabold uppercase tracking-widest text-slate-900 mb-3 flex items-center gap-2"
              style={{ color: theme.primaryColor }}
            >
              <span className="w-2 h-2 rounded-full" style={{ backgroundColor: theme.accentColor }} />
              Experience & Trajectory
            </h2>
            <div className="relative pl-5 border-l-2 border-slate-200 ml-1 space-y-4">
              {resume.experience.map((exp) => (
                <div key={exp.id} className="relative break-inside-avoid">
                  {/* Timeline Dot Node */}
                  <span
                    className="absolute -left-[27px] top-1.5 w-3 h-3 rounded-full border-2 border-white shadow-2xs"
                    style={{ backgroundColor: theme.accentColor }}
                  />

                  <div className="flex justify-between items-baseline flex-wrap gap-1">
                    <div>
                      <span className="font-bold text-slate-900">{exp.role}</span>
                      <span className="text-slate-400"> / </span>
                      <span className="font-semibold" style={{ color: theme.accentColor }}>{exp.company}</span>
                    </div>
                    <span className="text-xs font-mono text-slate-500">
                      {exp.startDate} – {exp.current ? 'Present' : exp.endDate || ''}
                      {exp.location && ` (${exp.location})`}
                    </span>
                  </div>

                  {exp.bullets && exp.bullets.length > 0 && (
                    <ul className={`mt-1.5 list-disc list-outside pl-4 text-slate-700 ${spacingClasses.bulletGap}`}>
                      {exp.bullets.map((b, idx) => b.trim() && (
                        <li key={idx} className="leading-snug">{b}</li>
                      ))}
                    </ul>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Skills Clean Pills */}
        {!isHidden('skills') && resume.skills && resume.skills.length > 0 && (
          <section id="section-skills">
            <h2
              className="text-xs font-extrabold uppercase tracking-widest text-slate-900 mb-2.5 flex items-center gap-2"
              style={{ color: theme.primaryColor }}
            >
              <span className="w-2 h-2 rounded-full" style={{ backgroundColor: theme.accentColor }} />
              Competencies & Skills
            </h2>
            <div className="flex flex-wrap gap-1.5">
              {resume.skills.map((skill) => (
                <span
                  key={skill.id}
                  className="px-2.5 py-1 rounded-lg text-xs font-medium bg-white text-slate-800 border border-slate-200/90 shadow-2xs hover:border-slate-300 transition-colors"
                >
                  {skill.name}
                  {skill.level && (
                    <span className="text-[10px] text-slate-400 ml-1">· {skill.level}</span>
                  )}
                </span>
              ))}
            </div>
          </section>
        )}

        {/* Projects */}
        {!isHidden('projects') && resume.projects && resume.projects.length > 0 && (
          <section id="section-projects">
            <h2
              className="text-xs font-extrabold uppercase tracking-widest text-slate-900 mb-2.5 flex items-center gap-2"
              style={{ color: theme.primaryColor }}
            >
              <span className="w-2 h-2 rounded-full" style={{ backgroundColor: theme.accentColor }} />
              Featured Projects
            </h2>
            <div className={spacingClasses.itemGap}>
              {resume.projects.map((proj) => (
                <div key={proj.id} className="p-3 rounded-xl bg-white border border-slate-200/80 break-inside-avoid shadow-2xs">
                  <div className="flex justify-between items-baseline flex-wrap gap-1">
                    <span className="font-bold text-slate-900">{proj.name}</span>
                    {proj.link && (
                      <a
                        href={proj.link.startsWith('http') ? proj.link : `https://${proj.link}`}
                        target="_blank"
                        rel="noreferrer"
                        className="text-xs font-mono hover:underline"
                        style={{ color: theme.accentColor }}
                      >
                        {proj.link.replace(/^https?:\/\//, '')}
                      </a>
                    )}
                  </div>
                  {proj.techStack && proj.techStack.length > 0 && (
                    <p className="text-[11px] font-mono text-slate-500 mb-1">{proj.techStack.join(' • ')}</p>
                  )}
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

        {/* Education & Languages Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {!isHidden('education') && resume.education && resume.education.length > 0 && (
            <section id="section-education">
              <h2
                className="text-xs font-extrabold uppercase tracking-widest text-slate-900 mb-2 flex items-center gap-2"
                style={{ color: theme.primaryColor }}
              >
                <span className="w-2 h-2 rounded-full" style={{ backgroundColor: theme.accentColor }} />
                Education
              </h2>
              <div className="space-y-2">
                {resume.education.map((edu) => (
                  <div key={edu.id} className="text-xs">
                    <p className="font-bold text-slate-900">
                      {edu.degree} {edu.field ? `in ${edu.field}` : ''}
                    </p>
                    <p className="text-slate-600">{edu.school}</p>
                    <p className="text-slate-400 text-[11px]">
                      {edu.startDate} – {edu.endDate} {edu.gpa ? `| GPA: ${edu.gpa}` : ''}
                    </p>
                  </div>
                ))}
              </div>
            </section>
          )}

          {((!isHidden('certifications') && resume.certifications && resume.certifications.length > 0) ||
            (!isHidden('languages') && resume.languages && resume.languages.length > 0)) && (
            <section id="section-other">
              <h2
                className="text-xs font-extrabold uppercase tracking-widest text-slate-900 mb-2 flex items-center gap-2"
                style={{ color: theme.primaryColor }}
              >
                <span className="w-2 h-2 rounded-full" style={{ backgroundColor: theme.accentColor }} />
                Certifications & Languages
              </h2>
              <div className="space-y-1 text-xs text-slate-700">
                {resume.certifications?.map((c) => (
                  <div key={c.id}>
                    <span className="font-semibold text-slate-900">{c.name}</span> — {c.issuer}
                  </div>
                ))}
                {resume.languages?.length > 0 && (
                  <div className="pt-1 flex flex-wrap gap-1">
                    {resume.languages.map((l) => (
                      <span key={l.id} className="px-2 py-0.5 rounded bg-slate-200/70 text-slate-800 text-[11px]">
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
