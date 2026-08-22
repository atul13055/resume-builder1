import React from 'react';
import { ResumeData, ThemeConfig } from '../../../types/resume';
import { Mail, Phone, MapPin, Globe, Linkedin, Github } from 'lucide-react';

interface TemplateProps {
  resume: ResumeData;
  theme: ThemeConfig;
}

export const CompactTemplate: React.FC<TemplateProps> = ({ resume, theme }) => {
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
    theme.fontSize === 'sm' ? 'text-[11px]' : theme.fontSize === 'lg' ? 'text-[13px]' : 'text-xs';

  const hiddenSections = theme.hiddenSections || [];
  const isHidden = (sec: string) => hiddenSections.includes(sec);

  return (
    <div
      id="resume-printable-content"
      className={`w-full bg-white text-slate-800 p-8 ${fontSizeClass} leading-tight min-h-[1050px] shadow-sm print:shadow-none print:p-6 print:m-0`}
      style={{
        fontFamily:
          theme.fontPairing === 'serif'
            ? 'Georgia, serif'
            : theme.fontPairing === 'mono'
            ? 'ui-monospace, monospace'
            : 'system-ui, -apple-system, sans-serif',
      }}
    >
      {/* Top Compact Bar */}
      <header className="border-b-2 pb-3 mb-3.5 flex justify-between items-end flex-wrap gap-2" style={{ borderColor: theme.primaryColor }}>
        <div>
          <h1 className="text-2xl font-black tracking-tight uppercase" style={{ color: theme.primaryColor }}>
            {p.fullName || 'Your Name'}
          </h1>
          <p className="text-xs font-bold uppercase tracking-wider" style={{ color: theme.accentColor }}>
            {p.title || 'Professional Title'}
          </p>
        </div>
        <div className="text-[11px] text-slate-600 flex flex-wrap gap-x-3 gap-y-0.5 justify-end">
          {p.email && <span>{p.email}</span>}
          {p.phone && <span>• {p.phone}</span>}
          {p.location && <span>• {p.location}</span>}
          {p.linkedin && <span>• {p.linkedin.replace(/^https?:\/\/(www\.)?/, '')}</span>}
          {p.github && <span>• {p.github.replace(/^https?:\/\/(www\.)?/, '')}</span>}
        </div>
      </header>

      {/* 2-Column Split Layout */}
      <div className="grid grid-cols-12 gap-5">
        {/* Left Main Column (8 cols) */}
        <div className="col-span-12 md:col-span-8 space-y-4">
          {/* Summary */}
          {!isHidden('summary') && resume.summary && (
            <section>
              <h2
                className="text-[11px] font-black uppercase tracking-wider border-b pb-0.5 mb-1.5"
                style={{ color: theme.primaryColor, borderColor: theme.accentColor }}
              >
                Profile Summary
              </h2>
              <p className="text-slate-700 leading-normal text-justify">{resume.summary}</p>
            </section>
          )}

          {/* Work Experience */}
          {!isHidden('experience') && resume.experience && resume.experience.length > 0 && (
            <section>
              <h2
                className="text-[11px] font-black uppercase tracking-wider border-b pb-0.5 mb-2"
                style={{ color: theme.primaryColor, borderColor: theme.accentColor }}
              >
                Experience
              </h2>
              <div className="space-y-3">
                {resume.experience.map((exp) => (
                  <div key={exp.id} className="break-inside-avoid">
                    <div className="flex justify-between items-baseline">
                      <span className="font-bold text-slate-900">{exp.role}</span>
                      <span className="text-[10px] text-slate-500 font-medium">
                        {exp.startDate} – {exp.current ? 'Present' : exp.endDate}
                      </span>
                    </div>
                    <div className="text-[11px] font-semibold mb-1" style={{ color: theme.accentColor }}>
                      {exp.company} {exp.location && `| ${exp.location}`}
                    </div>
                    {exp.bullets && exp.bullets.length > 0 && (
                      <ul className="list-disc list-outside pl-3.5 space-y-0.5 text-slate-700">
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
            <section>
              <h2
                className="text-[11px] font-black uppercase tracking-wider border-b pb-0.5 mb-2"
                style={{ color: theme.primaryColor, borderColor: theme.accentColor }}
              >
                Projects
              </h2>
              <div className="space-y-2">
                {resume.projects.map((pr) => (
                  <div key={pr.id} className="break-inside-avoid">
                    <div className="flex justify-between items-baseline">
                      <span className="font-bold text-slate-900">{pr.name}</span>
                      {pr.link && (
                        <span className="text-[10px] text-blue-600 underline">{pr.link.replace(/^https?:\/\//, '')}</span>
                      )}
                    </div>
                    {pr.techStack && pr.techStack.length > 0 && (
                      <div className="text-[10px] text-slate-500 mb-0.5">[{pr.techStack.join(', ')}]</div>
                    )}
                    {pr.bullets && pr.bullets.length > 0 && (
                      <ul className="list-disc list-outside pl-3.5 space-y-0.5 text-slate-700">
                        {pr.bullets.map((b, i) => b.trim() && <li key={i}>{b}</li>)}
                      </ul>
                    )}
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>

        {/* Right Sidebar Column (4 cols) */}
        <div className="col-span-12 md:col-span-4 space-y-4 border-l md:border-slate-200 md:pl-4">
          {/* Skills */}
          {!isHidden('skills') && resume.skills && resume.skills.length > 0 && (
            <section>
              <h2
                className="text-[11px] font-black uppercase tracking-wider border-b pb-0.5 mb-1.5"
                style={{ color: theme.primaryColor, borderColor: theme.accentColor }}
              >
                Core Skills
              </h2>
              <div className="flex flex-wrap gap-1">
                {resume.skills.map((s) => (
                  <span
                    key={s.id}
                    className="px-1.5 py-0.5 rounded text-[10px] font-semibold bg-slate-100 text-slate-800 border border-slate-200"
                  >
                    {s.name}
                  </span>
                ))}
              </div>
            </section>
          )}

          {/* Education */}
          {!isHidden('education') && resume.education && resume.education.length > 0 && (
            <section>
              <h2
                className="text-[11px] font-black uppercase tracking-wider border-b pb-0.5 mb-1.5"
                style={{ color: theme.primaryColor, borderColor: theme.accentColor }}
              >
                Education
              </h2>
              <div className="space-y-2">
                {resume.education.map((edu) => (
                  <div key={edu.id} className="text-xs">
                    <p className="font-bold text-slate-900 leading-tight">
                      {edu.degree} {edu.field ? `in ${edu.field}` : ''}
                    </p>
                    <p className="text-slate-600 text-[11px]">{edu.school}</p>
                    <p className="text-slate-400 text-[10px]">
                      {edu.startDate} – {edu.endDate} {edu.gpa ? `| GPA: ${edu.gpa}` : ''}
                    </p>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Certifications */}
          {!isHidden('certifications') && resume.certifications && resume.certifications.length > 0 && (
            <section>
              <h2
                className="text-[11px] font-black uppercase tracking-wider border-b pb-0.5 mb-1.5"
                style={{ color: theme.primaryColor, borderColor: theme.accentColor }}
              >
                Certifications
              </h2>
              <div className="space-y-1 text-[11px] text-slate-700">
                {resume.certifications.map((c) => (
                  <div key={c.id}>
                    <span className="font-bold text-slate-900">{c.name}</span>
                    <p className="text-[10px] text-slate-500">{c.issuer} ({c.issueDate})</p>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Languages */}
          {!isHidden('languages') && resume.languages && resume.languages.length > 0 && (
            <section>
              <h2
                className="text-[11px] font-black uppercase tracking-wider border-b pb-0.5 mb-1.5"
                style={{ color: theme.primaryColor, borderColor: theme.accentColor }}
              >
                Languages
              </h2>
              <div className="space-y-0.5 text-[11px] text-slate-700">
                {resume.languages.map((l) => (
                  <div key={l.id} className="flex justify-between">
                    <span className="font-medium">{l.language}</span>
                    <span className="text-slate-500 text-[10px]">{l.proficiency}</span>
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>
      </div>
    </div>
  );
};
