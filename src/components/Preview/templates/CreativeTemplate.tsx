import React from 'react';
import { ResumeData, ThemeConfig } from '../../../types/resume';
import { Mail, Phone, MapPin, Globe, Linkedin, Github, GraduationCap, Award, Languages } from 'lucide-react';

interface TemplateProps {
  resume: ResumeData;
  theme: ThemeConfig;
}

export const CreativeTemplate: React.FC<TemplateProps> = ({ resume, theme }) => {
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
      className={`w-full bg-white text-slate-800 ${fontSizeClass} leading-relaxed min-h-[1050px] shadow-sm print:shadow-none print:m-0 flex flex-col md:flex-row`}
      style={{
        fontFamily:
          theme.fontPairing === 'serif'
            ? 'Georgia, serif'
            : theme.fontPairing === 'mono'
            ? 'ui-monospace, monospace'
            : 'system-ui, sans-serif',
      }}
    >
      {/* Left Sidebar */}
      <aside
        className="w-full md:w-[32%] p-6 md:p-8 text-white flex-shrink-0 flex flex-col justify-between"
        style={{ backgroundColor: theme.primaryColor }}
      >
        <div className="space-y-6">
          {/* Profile photo */}
          {theme.showPhoto && p.photoUrl && (
            <div className="flex justify-center mb-4">
              <img
                src={p.photoUrl}
                alt={p.fullName}
                className={`w-24 h-24 object-cover border-2 border-white/40 ${
                  theme.photoShape === 'circle' ? 'rounded-full' : theme.photoShape === 'rounded' ? 'rounded-xl' : 'rounded-none'
                }`}
              />
            </div>
          )}

          {/* Contact Details */}
          <div>
            <h3 className="text-[11px] font-bold uppercase tracking-widest text-white/70 border-b border-white/20 pb-1 mb-2">
              Contact
            </h3>
            <div className="space-y-1 text-xs text-white/90 font-mono">
              {p.email && <div>{p.email}</div>}
              {p.phone && <div>{p.phone}</div>}
              {p.location && <div>{p.location}</div>}
              {p.linkedin && <div>{p.linkedin.replace(/^https?:\/\/(www\.)?/, '')}</div>}
              {p.github && <div>{p.github.replace(/^https?:\/\/(www\.)?/, '')}</div>}
              {p.website && <div>{p.website.replace(/^https?:\/\//, '')}</div>}
            </div>
          </div>

          {/* Skills Categorized Plain Text in Sidebar */}
          {!isHidden('skills') && resume.skills && resume.skills.length > 0 && (
            <div>
              <h3 className="text-[11px] font-bold uppercase tracking-widest text-white/70 border-b border-white/20 pb-1 mb-2">
                Skills & Expertise
              </h3>
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
                    <div className="space-y-1.5 text-xs text-white/90 leading-snug">
                      {catKeys.map((cat) => (
                        <div key={cat}>
                          <span className="font-bold text-white">{cat}: </span>
                          <span>{categories[cat].join(', ')}</span>
                        </div>
                      ))}
                    </div>
                  );
                }

                return (
                  <p className="text-white/90 text-xs leading-relaxed">
                    {resume.skills.map((s) => s.name).join(', ')}
                  </p>
                );
              })()}
            </div>
          )}

          {/* Education in Sidebar */}
          {!isHidden('education') && resume.education && resume.education.length > 0 && (
            <div>
              <h3 className="text-[11px] font-bold uppercase tracking-widest text-white/70 border-b border-white/20 pb-1 mb-3 flex items-center gap-1.5">
                <GraduationCap className="w-3.5 h-3.5" /> Education
              </h3>
              <div className="space-y-3">
                {resume.education.map((edu) => (
                  <div key={edu.id} className="text-xs">
                    <p className="font-bold text-white leading-tight">
                      {edu.degree} {edu.field ? `in ${edu.field}` : ''}
                    </p>
                    <p className="text-white/80">{edu.school}</p>
                    <p className="text-white/60 text-[11px]">
                      {edu.startDate} – {edu.endDate} {edu.gpa ? `| GPA ${edu.gpa}` : ''}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Languages in Sidebar */}
          {!isHidden('languages') && resume.languages && resume.languages.length > 0 && (
            <div>
              <h3 className="text-[11px] font-bold uppercase tracking-widest text-white/70 border-b border-white/20 pb-1 mb-2 flex items-center gap-1.5">
                <Languages className="w-3.5 h-3.5" /> Languages
              </h3>
              <div className="space-y-1 text-xs text-white/90">
                {resume.languages.map((l) => (
                  <div key={l.id} className="flex justify-between">
                    <span>{l.language}</span>
                    <span className="text-white/60 text-[11px]">{l.proficiency}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </aside>

      {/* Main Right Content */}
      <main className="w-full md:w-[68%] p-6 md:p-8 space-y-5">
        {/* Name Header */}
        <header className="border-b border-slate-200 pb-4">
          <h1 className="text-3xl font-extrabold tracking-tight" style={{ color: theme.primaryColor }}>
            {p.fullName || 'Your Name'}
          </h1>
          <p className="text-sm font-semibold tracking-wide mt-0.5" style={{ color: theme.accentColor }}>
            {p.title || 'Professional Title'}
          </p>
        </header>

        {/* Summary */}
        {!isHidden('summary') && resume.summary && (
          <section>
            <h2
              className="text-xs font-bold uppercase tracking-wider mb-2 flex items-center gap-1.5"
              style={{ color: theme.accentColor }}
            >
              Professional Profile
            </h2>
            <p className="text-slate-700 text-justify leading-relaxed">{resume.summary}</p>
          </section>
        )}

        {/* Experience */}
        {!isHidden('experience') && resume.experience && resume.experience.length > 0 && (
          <section>
            <h2
              className="text-xs font-bold uppercase tracking-wider mb-3 flex items-center gap-1.5"
              style={{ color: theme.accentColor }}
            >
              Work Experience
            </h2>
            <div className="space-y-4">
              {resume.experience.map((exp) => (
                <div key={exp.id} className="break-inside-avoid">
                  <div className="flex justify-between items-baseline flex-wrap gap-1">
                    <div className="font-bold text-slate-900 text-[13.5px]">
                      <span>{exp.role}</span>
                      <span className="text-slate-400 font-normal mx-1 font-mono">|</span>
                      <span className="font-semibold text-slate-700">{exp.company}</span>
                    </div>
                    <div className="text-xs text-slate-500 font-mono">
                      {exp.location ? `${exp.location} | ` : ''}
                      {exp.startDate} – {exp.current ? 'Present' : exp.endDate || ''}
                    </div>
                  </div>
                  <div className="text-xs font-semibold text-slate-600 mb-1">
                    {exp.company} {exp.location ? `• ${exp.location}` : ''}
                  </div>
                  {exp.bullets && exp.bullets.length > 0 && (
                    <ul className="list-disc list-outside pl-4 space-y-1 text-slate-700 text-xs">
                      {exp.bullets.map((b, i) => b.trim() && <li key={i}>{b}</li>)}
                    </ul>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Projects */}
        {!isHidden('projects') && resume.projects && resume.projects.length > 0 && (
          <section>
            <h2
              className="text-xs font-bold uppercase tracking-wider mb-2.5 flex items-center gap-1.5"
              style={{ color: theme.accentColor }}
            >
              Featured Projects
            </h2>
            <div className="space-y-3">
              {resume.projects.map((proj) => (
                <div key={proj.id} className="break-inside-avoid">
                  <div className="flex justify-between items-baseline">
                    <span className="font-bold text-slate-900">{proj.name}</span>
                    {proj.link && (
                      <a href={proj.link} target="_blank" rel="noreferrer" className="text-xs text-blue-600 hover:underline">
                        View Project
                      </a>
                    )}
                  </div>
                  {proj.techStack && proj.techStack.length > 0 && (
                    <div className="text-[11px] text-slate-500 font-mono mb-1">
                      {proj.techStack.join(' • ')}
                    </div>
                  )}
                  {proj.bullets && proj.bullets.length > 0 && (
                    <ul className="list-disc list-outside pl-4 space-y-0.5 text-slate-700 text-xs">
                      {proj.bullets.map((b, i) => b.trim() && <li key={i}>{b}</li>)}
                    </ul>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Certifications */}
        {!isHidden('certifications') && resume.certifications && resume.certifications.length > 0 && (
          <section>
            <h2
              className="text-xs font-bold uppercase tracking-wider mb-2 flex items-center gap-1.5"
              style={{ color: theme.accentColor }}
            >
              <Award className="w-3.5 h-3.5" /> Certifications
            </h2>
            <div className="grid grid-cols-1 gap-1 text-xs text-slate-700">
              {resume.certifications.map((c) => (
                <div key={c.id}>
                  <span className="font-semibold text-slate-900">{c.name}</span>
                  <span className="text-slate-500"> — {c.issuer} ({c.issueDate})</span>
                </div>
              ))}
            </div>
          </section>
        )}
      </main>
    </div>
  );
};
