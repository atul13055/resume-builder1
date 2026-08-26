import React from 'react';
import { ResumeData, ThemeConfig } from '../../../types/resume';
import { Mail, Phone, MapPin, Globe, Linkedin, Github, Zap, Target, TrendingUp, Sparkles } from 'lucide-react';

interface TemplateProps {
  resume: ResumeData;
  theme: ThemeConfig;
}

export const InfographicTemplate: React.FC<TemplateProps> = ({ resume, theme }) => {
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

  // Helper to compute skill percentage based on level
  const getSkillPercent = (level?: string) => {
    switch (level) {
      case 'expert':
        return 95;
      case 'advanced':
        return 80;
      case 'intermediate':
        return 65;
      case 'beginner':
        return 45;
      default:
        return 75;
    }
  };

  return (
    <div
      id="resume-printable-content"
      className={`w-full bg-white text-slate-900 ${spacingClasses.padding} ${fontSizeClass} leading-relaxed min-h-[1050px] shadow-sm print:shadow-none print:p-6 print:m-0`}
      style={{
        fontFamily:
          theme.fontPairing === 'serif'
            ? 'Georgia, serif'
            : theme.fontPairing === 'mono'
            ? 'ui-monospace, monospace'
            : 'Inter, system-ui, sans-serif',
      }}
    >
      {/* Modern Badge Header */}
      <header className="pb-5 mb-5 border-b-2" style={{ borderColor: theme.primaryColor }}>
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold tracking-wide uppercase mb-1 bg-slate-100 text-slate-700">
              <Sparkles className="w-3 h-3" style={{ color: theme.accentColor }} />
              Growth & Product Profile
            </div>
            <h1
              className="text-2xl sm:text-4xl font-black tracking-tight uppercase"
              style={{ color: theme.primaryColor }}
            >
              {p.fullName || 'Candidate Name'}
            </h1>
            <p
              className="text-xs sm:text-sm font-extrabold tracking-wide uppercase mt-0.5"
              style={{ color: theme.accentColor }}
            >
              {p.title || 'Product & Growth Leader'}
            </p>
          </div>

          {/* Contact Line */}
          <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5 text-xs text-slate-600 font-mono">
            {p.email && <span>{p.email}</span>}
            {p.email && p.phone && <span className="text-slate-300">|</span>}
            {p.phone && <span>{p.phone}</span>}
            {(p.email || p.phone) && p.location && <span className="text-slate-300">|</span>}
            {p.location && <span>{p.location}</span>}
            {p.website && <span className="text-slate-300">|</span>}
            {p.website && <span>{p.website.replace(/^https?:\/\//, '')}</span>}
            {p.linkedin && <span className="text-slate-300">|</span>}
            {p.linkedin && <span>{p.linkedin.replace(/^https?:\/\/(www\.)?/, '')}</span>}
            {p.github && <span className="text-slate-300">|</span>}
            {p.github && <span>{p.github.replace(/^https?:\/\//, '')}</span>}
          </div>
        </div>
      </header>

      {/* Main Grid */}
      <div className={spacingClasses.sectionGap}>
        {/* Summary Card with Left Accent */}
        {!isHidden('summary') && resume.summary && (
          <section id="section-summary" className="p-4 rounded-xl bg-slate-50 border-l-4" style={{ borderColor: theme.accentColor }}>
            <h2
              className="text-xs font-black uppercase tracking-wider mb-1.5 flex items-center gap-1.5"
              style={{ color: theme.primaryColor }}
            >
              <Target className="w-4 h-4" style={{ color: theme.accentColor }} />
              Executive Focus & Value Matrix
            </h2>
            <p className="text-slate-700 leading-relaxed text-justify">{resume.summary}</p>
          </section>
        )}

        {/* Clean Category Grouped Plain Text Skills */}
        {!isHidden('skills') && resume.skills && resume.skills.length > 0 && (
          <section id="section-skills">
            <h2
              className="text-xs font-black uppercase tracking-wider mb-2 flex items-center gap-1.5"
              style={{ color: theme.primaryColor }}
            >
              <Zap className="w-4 h-4" style={{ color: theme.accentColor }} />
              Core Competencies & Skills
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

        {/* Experience with Impact Highlights */}
        {!isHidden('experience') && resume.experience && resume.experience.length > 0 && (
          <section id="section-experience">
            <h2
              className="text-xs font-black uppercase tracking-wider mb-3 flex items-center gap-1.5 border-b pb-1"
              style={{ color: theme.primaryColor, borderColor: theme.accentColor }}
            >
              <TrendingUp className="w-4 h-4" style={{ color: theme.accentColor }} />
              Key Positions & Measurable Outcomes
            </h2>
            <div className={spacingClasses.itemGap}>
              {resume.experience.map((exp) => (
                <div key={exp.id} className="break-inside-avoid">
                  <div className="flex justify-between items-baseline flex-wrap gap-1">
                    <div className="font-black text-slate-900 text-[13.5px]">
                      <span>{exp.role}</span>
                      <span className="text-slate-400 font-normal mx-1 font-mono">|</span>
                      <span className="font-bold" style={{ color: theme.accentColor }}>{exp.company}</span>
                    </div>
                    <div className="text-xs font-mono font-bold text-slate-500">
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

        {/* Projects */}
        {!isHidden('projects') && resume.projects && resume.projects.length > 0 && (
          <section id="section-projects">
            <h2
              className="text-xs font-black uppercase tracking-wider mb-2.5 flex items-center gap-1.5 border-b pb-1"
              style={{ color: theme.primaryColor, borderColor: theme.accentColor }}
            >
              <Target className="w-4 h-4" style={{ color: theme.accentColor }} />
              Strategic Initiatives & Launches
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
                        className="text-xs font-bold hover:underline"
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

        {/* Education & Certs */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {!isHidden('education') && resume.education && resume.education.length > 0 && (
            <section id="section-education">
              <h2
                className="text-xs font-black uppercase tracking-wider mb-2 border-b pb-1"
                style={{ color: theme.primaryColor, borderColor: theme.accentColor }}
              >
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
            <section id="section-credentials">
              <h2
                className="text-xs font-black uppercase tracking-wider mb-2 border-b pb-1"
                style={{ color: theme.primaryColor, borderColor: theme.accentColor }}
              >
                Credentials & Languages
              </h2>
              <div className="space-y-1.5 text-xs text-slate-700">
                {resume.certifications?.map((c) => (
                  <div key={c.id}>
                    <span className="font-bold text-slate-900">{c.name}</span>
                    <span className="text-slate-500"> — {c.issuer}</span>
                  </div>
                ))}
                {resume.languages?.length > 0 && (
                  <div className="pt-1 flex flex-wrap gap-1.5">
                    {resume.languages.map((l) => (
                      <span key={l.id} className="font-semibold px-2 py-0.5 rounded bg-slate-100 text-slate-800 text-[11px]">
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
