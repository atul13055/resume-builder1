import React from 'react';
import { ResumeData, ThemeConfig } from '../../../types/resume';
import { Mail, Phone, MapPin, Globe, Linkedin, Github, Terminal, Code2, Cpu } from 'lucide-react';

interface TemplateProps {
  resume: ResumeData;
  theme: ThemeConfig;
}

export const TechTemplate: React.FC<TemplateProps> = ({ resume, theme }) => {
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

  // Group skills by category if available
  const skillCategories = React.useMemo<Record<string, string[]>>(() => {
    const map: Record<string, string[]> = {};
    (resume.skills || []).forEach((s) => {
      const cat = s.category || 'Technologies';
      if (!map[cat]) {
        map[cat] = [];
      }
      map[cat].push(s.name);
    });
    return map;
  }, [resume.skills]);

  return (
    <div
      id="resume-printable-content"
      className={`w-full bg-white text-slate-900 ${spacingClasses.padding} ${fontSizeClass} leading-relaxed min-h-[1050px] shadow-sm print:shadow-none print:p-6 print:m-0`}
      style={{
        fontFamily:
          theme.fontPairing === 'serif'
            ? 'Georgia, serif'
            : theme.fontPairing === 'mono'
            ? 'ui-monospace, SFMono-Regular, Menlo, monospace'
            : 'Inter, system-ui, sans-serif',
      }}
    >
      {/* Tech Header */}
      <header className="border-b border-slate-300 pb-5 mb-5">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="font-mono text-xs font-bold text-slate-400">&gt;</span>
              <h1 className="text-2xl sm:text-3xl font-black tracking-tight" style={{ color: theme.primaryColor }}>
                {p.fullName || 'Developer Name'}
              </h1>
            </div>
            <div className="flex items-center gap-2">
              <span
                className="px-2 py-0.5 rounded text-xs font-mono font-bold text-white shadow-2xs"
                style={{ backgroundColor: theme.accentColor }}
              >
                {p.title || 'Senior Software Engineer'}
              </span>
              {p.location && (
                <span className="text-xs font-mono text-slate-500 flex items-center gap-1">
                  <MapPin className="w-3 h-3 text-slate-400" /> {p.location}
                </span>
              )}
            </div>
          </div>

          {/* Social / Dev Links Box */}
          <div className="flex flex-wrap gap-2 text-xs font-mono">
            {p.email && (
              <a
                href={`mailto:${p.email}`}
                className="flex items-center gap-1 px-2.5 py-1 rounded bg-slate-100 text-slate-700 hover:bg-slate-200 transition-colors border border-slate-200"
              >
                <Mail className="w-3 h-3" /> {p.email}
              </a>
            )}
            {p.github && (
              <a
                href={p.github.startsWith('http') ? p.github : `https://${p.github}`}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-1 px-2.5 py-1 rounded bg-slate-900 text-white hover:bg-slate-800 transition-colors shadow-2xs"
              >
                <Github className="w-3 h-3" /> {p.github.replace(/^https?:\/\/(www\.)?github\.com\//, 'gh/')}
              </a>
            )}
            {p.linkedin && (
              <a
                href={p.linkedin.startsWith('http') ? p.linkedin : `https://${p.linkedin}`}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-1 px-2.5 py-1 rounded bg-blue-50 text-blue-700 hover:bg-blue-100 transition-colors border border-blue-200"
              >
                <Linkedin className="w-3 h-3" /> {p.linkedin.replace(/^https?:\/\/(www\.)?linkedin\.com\/in\//, 'in/')}
              </a>
            )}
            {p.website && (
              <a
                href={p.website.startsWith('http') ? p.website : `https://${p.website}`}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-1 px-2.5 py-1 rounded bg-slate-100 text-slate-700 hover:bg-slate-200 transition-colors border border-slate-200"
              >
                <Globe className="w-3 h-3" /> {p.website.replace(/^https?:\/\//, '')}
              </a>
            )}
          </div>
        </div>
      </header>

      {/* Main Content Sections */}
      <div className={spacingClasses.sectionGap}>
        {/* Technical Summary */}
        {!isHidden('summary') && resume.summary && (
          <section id="section-summary">
            <h2 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-500 mb-1.5 flex items-center gap-1.5">
              <Terminal className="w-3.5 h-3.5" style={{ color: theme.accentColor }} />
              // ABOUT_ME
            </h2>
            <p className="text-slate-700 leading-relaxed font-normal">{resume.summary}</p>
          </section>
        )}

        {/* Technical Stack / Skills Matrix */}
        {!isHidden('skills') && resume.skills && resume.skills.length > 0 && (
          <section id="section-skills" className="p-3.5 rounded-xl bg-slate-50/80 border border-slate-200">
            <h2 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-700 mb-2.5 flex items-center gap-1.5">
              <Code2 className="w-3.5 h-3.5" style={{ color: theme.accentColor }} />
              // TECHNICAL_STACK & COMPETENCIES
            </h2>
            <div className="space-y-2 text-xs">
              {(Object.entries(skillCategories) as [string, string[]][]).map(([cat, skills]) => (
                <div key={cat} className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2">
                  <span className="font-mono font-bold text-slate-800 text-[11px] min-w-[130px] shrink-0">
                    {cat}:
                  </span>
                  <div className="flex flex-wrap gap-1">
                    {skills.map((s, idx) => (
                      <span
                        key={idx}
                        className="px-2 py-0.5 rounded text-[11px] font-mono font-semibold bg-white text-slate-800 border border-slate-300 shadow-2xs"
                      >
                        {s}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Work Experience */}
        {!isHidden('experience') && resume.experience && resume.experience.length > 0 && (
          <section id="section-experience">
            <h2 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-500 mb-3 flex items-center gap-1.5 border-b border-slate-200 pb-1">
              <Cpu className="w-3.5 h-3.5" style={{ color: theme.accentColor }} />
              // EXPERIENCE
            </h2>
            <div className={spacingClasses.itemGap}>
              {resume.experience.map((exp) => (
                <div key={exp.id} className="break-inside-avoid">
                  <div className="flex justify-between items-baseline flex-wrap gap-1">
                    <div className="flex items-center gap-1.5">
                      <span className="font-bold text-slate-900">{exp.role}</span>
                      <span className="font-mono text-slate-400">@</span>
                      <span className="font-bold" style={{ color: theme.accentColor }}>{exp.company}</span>
                    </div>
                    <span className="text-xs font-mono font-medium text-slate-500">
                      {exp.startDate} – {exp.current ? 'Present' : exp.endDate || ''}
                      {exp.location && ` | ${exp.location}`}
                    </span>
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

        {/* Projects & Open Source */}
        {!isHidden('projects') && resume.projects && resume.projects.length > 0 && (
          <section id="section-projects">
            <h2 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-500 mb-2.5 flex items-center gap-1.5 border-b border-slate-200 pb-1">
              <Terminal className="w-3.5 h-3.5" style={{ color: theme.accentColor }} />
              // OPEN_SOURCE & KEY_PROJECTS
            </h2>
            <div className={spacingClasses.itemGap}>
              {resume.projects.map((proj) => (
                <div key={proj.id} className="break-inside-avoid">
                  <div className="flex justify-between items-baseline flex-wrap gap-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-bold text-slate-900">{proj.name}</span>
                      {proj.techStack && proj.techStack.length > 0 && (
                        <div className="flex flex-wrap gap-1">
                          {proj.techStack.map((tech, tIdx) => (
                            <span
                              key={tIdx}
                              className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-slate-100 text-slate-700 border border-slate-200"
                            >
                              {tech}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                    {proj.link && (
                      <a
                        href={proj.link.startsWith('http') ? proj.link : `https://${proj.link}`}
                        target="_blank"
                        rel="noreferrer"
                        className="text-xs font-mono hover:underline"
                        style={{ color: theme.accentColor }}
                      >
                        [view source]
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

        {/* Education & Certifications Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {!isHidden('education') && resume.education && resume.education.length > 0 && (
            <section id="section-education">
              <h2 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-500 mb-2 border-b border-slate-200 pb-0.5">
                // EDUCATION
              </h2>
              <div className="space-y-2">
                {resume.education.map((edu) => (
                  <div key={edu.id} className="text-xs">
                    <p className="font-bold text-slate-900">
                      {edu.degree} {edu.field ? `in ${edu.field}` : ''}
                    </p>
                    <p className="text-slate-600 font-mono text-[11px]">{edu.school}</p>
                    <p className="text-slate-400 font-mono text-[10px]">
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
            <section id="section-certs">
              <h2 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-500 mb-2 border-b border-slate-200 pb-0.5">
                // CERTS & LANGUAGES
              </h2>
              <div className="space-y-1.5 text-xs text-slate-700">
                {resume.certifications?.map((c) => (
                  <div key={c.id} className="font-mono text-[11px]">
                    <span className="font-semibold text-slate-900">{c.name}</span>
                    <span className="text-slate-500"> ({c.issuer})</span>
                  </div>
                ))}
                {resume.languages?.length > 0 && (
                  <div className="pt-1 flex flex-wrap gap-1.5">
                    {resume.languages.map((l) => (
                      <span key={l.id} className="font-mono text-[10px] px-1.5 py-0.5 rounded bg-slate-100 text-slate-800">
                        {l.language}: {l.proficiency}
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
