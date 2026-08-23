import React from 'react';
import { ResumeData, ThemeConfig } from '../../../types/resume';
import { Mail, Phone, MapPin, Globe, Linkedin, Github, GraduationCap, Award, Languages, BookOpen } from 'lucide-react';

interface TemplateProps {
  resume: ResumeData;
  theme: ThemeConfig;
}

export const SplitTemplate: React.FC<TemplateProps> = ({ resume, theme }) => {
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
            : 'system-ui, -apple-system, sans-serif',
      }}
    >
      {/* Tinted Left Column (35%) */}
      <aside className="w-full md:w-[36%] bg-slate-50/90 border-r border-slate-200/80 p-6 md:p-8 flex flex-col justify-between space-y-6">
        <div className="space-y-6">
          {/* Header in Left Sidebar */}
          <div>
            {theme.showPhoto && p.photoUrl && (
              <div className="mb-4">
                <img
                  src={p.photoUrl}
                  alt={p.fullName}
                  className={`w-24 h-24 object-cover border-2 border-white shadow-md ${
                    theme.photoShape === 'circle' ? 'rounded-full' : theme.photoShape === 'rounded' ? 'rounded-xl' : 'rounded-none'
                  }`}
                />
              </div>
            )}
            <h1
              className="text-2xl sm:text-3xl font-black tracking-tight"
              style={{ color: theme.primaryColor }}
            >
              {p.fullName || 'Your Name'}
            </h1>
            <p
              className="text-xs sm:text-sm font-bold tracking-wide mt-1"
              style={{ color: theme.accentColor }}
            >
              {p.title || 'Professional Title'}
            </p>
          </div>

          {/* Contact Details */}
          <div className="space-y-2 text-xs text-slate-600">
            <h3
              className="text-[11px] font-black uppercase tracking-wider pb-1 border-b border-slate-200"
              style={{ color: theme.primaryColor }}
            >
              Contact Details
            </h3>
            {p.email && (
              <div className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                <a href={`mailto:${p.email}`} className="truncate hover:underline">{p.email}</a>
              </div>
            )}
            {p.phone && (
              <div className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                <span>{p.phone}</span>
              </div>
            )}
            {p.location && (
              <div className="flex items-center gap-2">
                <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                <span>{p.location}</span>
              </div>
            )}
            {p.linkedin && (
              <div className="flex items-center gap-2">
                <Linkedin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                <a
                  href={p.linkedin.startsWith('http') ? p.linkedin : `https://${p.linkedin}`}
                  target="_blank"
                  rel="noreferrer"
                  className="truncate hover:underline"
                >
                  {p.linkedin.replace(/^https?:\/\/(www\.)?/, '')}
                </a>
              </div>
            )}
            {p.github && (
              <div className="flex items-center gap-2">
                <Github className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                <a
                  href={p.github.startsWith('http') ? p.github : `https://${p.github}`}
                  target="_blank"
                  rel="noreferrer"
                  className="truncate hover:underline"
                >
                  {p.github.replace(/^https?:\/\/(www\.)?/, '')}
                </a>
              </div>
            )}
            {p.website && (
              <div className="flex items-center gap-2">
                <Globe className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                <a
                  href={p.website.startsWith('http') ? p.website : `https://${p.website}`}
                  target="_blank"
                  rel="noreferrer"
                  className="truncate hover:underline"
                >
                  {p.website.replace(/^https?:\/\//, '')}
                </a>
              </div>
            )}
          </div>

          {/* Skills in Sidebar */}
          {!isHidden('skills') && resume.skills && resume.skills.length > 0 && (
            <div>
              <h3
                className="text-[11px] font-black uppercase tracking-wider pb-1 border-b border-slate-200 mb-2.5"
                style={{ color: theme.primaryColor }}
              >
                Skills & Tech
              </h3>
              <div className="flex flex-wrap gap-1.5">
                {resume.skills.map((s) => (
                  <span
                    key={s.id}
                    className="px-2 py-0.5 rounded text-[11px] font-medium bg-white text-slate-800 border border-slate-200 shadow-2xs"
                  >
                    {s.name}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Education in Sidebar */}
          {!isHidden('education') && resume.education && resume.education.length > 0 && (
            <div>
              <h3
                className="text-[11px] font-black uppercase tracking-wider pb-1 border-b border-slate-200 mb-2.5 flex items-center gap-1.5"
                style={{ color: theme.primaryColor }}
              >
                <GraduationCap className="w-3.5 h-3.5" style={{ color: theme.accentColor }} />
                Education
              </h3>
              <div className="space-y-2.5">
                {resume.education.map((edu) => (
                  <div key={edu.id} className="text-xs">
                    <p className="font-bold text-slate-900 leading-tight">
                      {edu.degree} {edu.field ? `in ${edu.field}` : ''}
                    </p>
                    <p className="text-slate-600">{edu.school}</p>
                    <p className="text-slate-400 text-[11px]">
                      {edu.startDate} – {edu.endDate} {edu.gpa ? `| GPA ${edu.gpa}` : ''}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Certifications in Sidebar */}
          {!isHidden('certifications') && resume.certifications && resume.certifications.length > 0 && (
            <div>
              <h3
                className="text-[11px] font-black uppercase tracking-wider pb-1 border-b border-slate-200 mb-2 flex items-center gap-1.5"
                style={{ color: theme.primaryColor }}
              >
                <Award className="w-3.5 h-3.5" style={{ color: theme.accentColor }} />
                Certifications
              </h3>
              <div className="space-y-1.5 text-xs text-slate-700">
                {resume.certifications.map((c) => (
                  <div key={c.id}>
                    <p className="font-bold text-slate-900 leading-tight">{c.name}</p>
                    <p className="text-[11px] text-slate-500">{c.issuer} ({c.issueDate})</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Languages in Sidebar */}
          {!isHidden('languages') && resume.languages && resume.languages.length > 0 && (
            <div>
              <h3
                className="text-[11px] font-black uppercase tracking-wider pb-1 border-b border-slate-200 mb-2 flex items-center gap-1.5"
                style={{ color: theme.primaryColor }}
              >
                <Languages className="w-3.5 h-3.5" style={{ color: theme.accentColor }} />
                Languages
              </h3>
              <div className="space-y-1 text-xs text-slate-700">
                {resume.languages.map((l) => (
                  <div key={l.id} className="flex justify-between">
                    <span className="font-medium">{l.language}</span>
                    <span className="text-slate-500 text-[11px]">{l.proficiency}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </aside>

      {/* Main Right Column (64%) */}
      <main className="w-full md:w-[64%] p-6 md:p-8 space-y-5">
        {/* Profile Summary */}
        {!isHidden('summary') && resume.summary && (
          <section id="section-summary">
            <h2
              className="text-xs font-black uppercase tracking-wider mb-2 pb-1 border-b-2"
              style={{ color: theme.primaryColor, borderColor: theme.accentColor }}
            >
              Professional Profile
            </h2>
            <p className="text-slate-700 leading-relaxed text-justify">{resume.summary}</p>
          </section>
        )}

        {/* Work Experience */}
        {!isHidden('experience') && resume.experience && resume.experience.length > 0 && (
          <section id="section-experience">
            <h2
              className="text-xs font-black uppercase tracking-wider mb-3 pb-1 border-b-2"
              style={{ color: theme.primaryColor, borderColor: theme.accentColor }}
            >
              Work Experience
            </h2>
            <div className="space-y-4">
              {resume.experience.map((exp) => (
                <div key={exp.id} className="break-inside-avoid">
                  <div className="flex justify-between items-baseline flex-wrap gap-1">
                    <div>
                      <span className="font-bold text-slate-900">{exp.role}</span>
                      <span className="text-slate-400"> – </span>
                      <span className="font-semibold" style={{ color: theme.accentColor }}>{exp.company}</span>
                    </div>
                    <span className="text-xs text-slate-500 font-mono">
                      {exp.startDate} – {exp.current ? 'Present' : exp.endDate}
                    </span>
                  </div>
                  {exp.location && (
                    <div className="text-[11px] text-slate-400 mb-1">{exp.location}</div>
                  )}
                  {exp.bullets && exp.bullets.length > 0 && (
                    <ul className="list-disc list-outside pl-4 space-y-1 text-slate-700 text-xs">
                      {exp.bullets.map((b, i) => b.trim() && <li key={i} className="leading-snug">{b}</li>)}
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
              className="text-xs font-black uppercase tracking-wider mb-2.5 pb-1 border-b-2"
              style={{ color: theme.primaryColor, borderColor: theme.accentColor }}
            >
              Featured Projects
            </h2>
            <div className="space-y-3">
              {resume.projects.map((proj) => (
                <div key={proj.id} className="break-inside-avoid">
                  <div className="flex justify-between items-baseline flex-wrap gap-1">
                    <span className="font-bold text-slate-900">{proj.name}</span>
                    {proj.link && (
                      <a
                        href={proj.link.startsWith('http') ? proj.link : `https://${proj.link}`}
                        target="_blank"
                        rel="noreferrer"
                        className="text-xs text-blue-600 hover:underline"
                      >
                        {proj.link.replace(/^https?:\/\//, '')}
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
                      {proj.bullets.map((b, i) => b.trim() && <li key={i} className="leading-snug">{b}</li>)}
                    </ul>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}
      </main>
    </div>
  );
};
