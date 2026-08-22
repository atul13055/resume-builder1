import {
  Document,
  Packer,
  Paragraph,
  TextRun,
  HeadingLevel,
  AlignmentType,
  BorderStyle,
  Table,
  TableRow,
  TableCell,
  WidthType,
} from 'docx';
import { ResumeData, ThemeConfig } from '../types/resume';
import { getPageSizeConfig } from '../data/pageSizeData';

export async function exportToDocx(resume: ResumeData, theme: ThemeConfig): Promise<void> {
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

  // Build Document Children
  const children: (Paragraph | Table)[] = [];

  // 1. Header Name
  children.push(
    new Paragraph({
      alignment: AlignmentType.CENTER,
      heading: HeadingLevel.TITLE,
      spacing: { after: 120 },
      children: [
        new TextRun({
          text: p.fullName || 'Untitled Resume',
          bold: true,
          size: 32, // 16pt
          color: theme.primaryColor.replace('#', '') || '111827',
          font: 'Arial',
        }),
      ],
    })
  );

  // 2. Headline / Title
  if (p.title) {
    children.push(
      new Paragraph({
        alignment: AlignmentType.CENTER,
        spacing: { after: 140 },
        children: [
          new TextRun({
            text: p.title,
            size: 24, // 12pt
            bold: true,
            color: theme.accentColor.replace('#', '') || '2563EB',
            font: 'Arial',
          }),
        ],
      })
    );
  }

  // 3. Contact Line
  const contactParts = [p.email, p.phone, p.location, p.website, p.linkedin, p.github].filter(Boolean);
  if (contactParts.length > 0) {
    children.push(
      new Paragraph({
        alignment: AlignmentType.CENTER,
        spacing: { after: 240 },
        children: [
          new TextRun({
            text: contactParts.join('  |  '),
            size: 18, // 9pt
            color: '4B5563',
            font: 'Arial',
          }),
        ],
      })
    );
  }

  // Helper for Section Heading
  function createSectionHeading(title: string): Paragraph {
    return new Paragraph({
      spacing: { before: 240, after: 100 },
      border: {
        bottom: {
          color: theme.primaryColor.replace('#', '') || '111827',
          space: 4,
          style: BorderStyle.SINGLE,
          size: 12,
        },
      },
      children: [
        new TextRun({
          text: title.toUpperCase(),
          bold: true,
          size: 22, // 11pt
          color: theme.primaryColor.replace('#', '') || '111827',
          font: 'Arial',
        }),
      ],
    });
  }

  const order = theme.sectionOrder || [
    'summary',
    'experience',
    'skills',
    'projects',
    'education',
    'certifications',
    'languages',
  ];

  order.forEach((secKey) => {
    // 4. Professional Summary
    if (secKey === 'summary' && resume.summary?.trim()) {
      children.push(createSectionHeading('Professional Summary'));
      children.push(
        new Paragraph({
          spacing: { after: 180, line: 276 },
          children: [
            new TextRun({
              text: resume.summary,
              size: 20, // 10pt
              color: '1F2937',
              font: 'Arial',
            }),
          ],
        })
      );
    }

    // 5. Work Experience
    if (secKey === 'experience' && resume.experience && resume.experience.length > 0) {
      children.push(createSectionHeading('Professional Experience'));

      resume.experience.forEach((exp) => {
        children.push(
          new Paragraph({
            spacing: { before: 120, after: 40 },
            children: [
              new TextRun({
                text: exp.role,
                bold: true,
                size: 21,
                color: '111827',
                font: 'Arial',
              }),
              new TextRun({
                text: ` – ${exp.company}`,
                bold: true,
                size: 21,
                color: theme.accentColor.replace('#', '') || '2563EB',
                font: 'Arial',
              }),
              new TextRun({
                text: `    ${exp.startDate} - ${exp.current ? 'Present' : exp.endDate || ''}${exp.location ? ` | ${exp.location}` : ''}`,
                italics: true,
                size: 18,
                color: '6B7280',
                font: 'Arial',
              }),
            ],
          })
        );

        (exp.bullets || []).forEach((b) => {
          if (!b.trim()) return;
          children.push(
            new Paragraph({
              bullet: { level: 0 },
              spacing: { after: 40, line: 260 },
              children: [
                new TextRun({
                  text: b.trim(),
                  size: 19,
                  color: '374151',
                  font: 'Arial',
                }),
              ],
            })
          );
        });
      });
    }

    // 6. Skills
    if (secKey === 'skills' && resume.skills && resume.skills.length > 0) {
      children.push(createSectionHeading('Key Skills & Competencies'));

      const categories: Record<string, string[]> = {};
      resume.skills.forEach((s) => {
        const cat = s.category || 'Core Skills';
        if (!categories[cat]) categories[cat] = [];
        categories[cat].push(s.name);
      });

      Object.entries(categories).forEach(([category, skills]) => {
        children.push(
          new Paragraph({
            spacing: { after: 60 },
            children: [
              new TextRun({
                text: `${category}: `,
                bold: true,
                size: 20,
                color: '111827',
                font: 'Arial',
              }),
              new TextRun({
                text: skills.join(', '),
                size: 20,
                color: '374151',
                font: 'Arial',
              }),
            ],
          })
        );
      });
    }

    // 7. Education
    if (secKey === 'education' && resume.education && resume.education.length > 0) {
      children.push(createSectionHeading('Education'));

      resume.education.forEach((edu) => {
        children.push(
          new Paragraph({
            spacing: { before: 100, after: 40 },
            children: [
              new TextRun({
                text: `${edu.degree}${edu.field ? ` in ${edu.field}` : ''}`,
                bold: true,
                size: 21,
                color: '111827',
                font: 'Arial',
              }),
              new TextRun({
                text: ` – ${edu.school}`,
                size: 20,
                color: '4B5563',
                font: 'Arial',
              }),
              new TextRun({
                text: `    ${edu.startDate || ''} - ${edu.endDate || ''}${edu.gpa ? ` | GPA: ${edu.gpa}` : ''}`,
                italics: true,
                size: 18,
                color: '6B7280',
                font: 'Arial',
              }),
            ],
          })
        );

        (edu.bullets || []).forEach((b) => {
          if (!b.trim()) return;
          children.push(
            new Paragraph({
              bullet: { level: 0 },
              spacing: { after: 30 },
              children: [
                new TextRun({
                  text: b.trim(),
                  size: 19,
                  color: '374151',
                  font: 'Arial',
                }),
              ],
            })
          );
        });
      });
    }

    // 8. Projects
    if (secKey === 'projects' && resume.projects && resume.projects.length > 0) {
      children.push(createSectionHeading('Key Projects'));

      resume.projects.forEach((proj) => {
        children.push(
          new Paragraph({
            spacing: { before: 100, after: 40 },
            children: [
              new TextRun({
                text: proj.name,
                bold: true,
                size: 21,
                color: '111827',
                font: 'Arial',
              }),
              new TextRun({
                text: proj.techStack?.length ? ` (${proj.techStack.join(', ')})` : '',
                italics: true,
                size: 19,
                color: '4B5563',
                font: 'Arial',
              }),
              new TextRun({
                text: proj.link ? ` | ${proj.link}` : '',
                size: 18,
                color: theme.accentColor.replace('#', '') || '2563EB',
                font: 'Arial',
              }),
            ],
          })
        );

        (proj.bullets || []).forEach((b) => {
          if (!b.trim()) return;
          children.push(
            new Paragraph({
              bullet: { level: 0 },
              spacing: { after: 30 },
              children: [
                new TextRun({
                  text: b.trim(),
                  size: 19,
                  color: '374151',
                  font: 'Arial',
                }),
              ],
            })
          );
        });
      });
    }

    // 9. Certifications
    if (secKey === 'certifications' && resume.certifications && resume.certifications.length > 0) {
      children.push(createSectionHeading('Certifications & Credentials'));

      resume.certifications.forEach((cert) => {
        children.push(
          new Paragraph({
            bullet: { level: 0 },
            spacing: { after: 40 },
            children: [
              new TextRun({
                text: `${cert.name} `,
                bold: true,
                size: 19,
                color: '111827',
                font: 'Arial',
              }),
              new TextRun({
                text: `– ${cert.issuer} (${cert.issueDate}${cert.credentialId ? ` | ID: ${cert.credentialId}` : ''})`,
                size: 19,
                color: '4B5563',
                font: 'Arial',
              }),
            ],
          })
        );
      });
    }

    // 10. Languages
    if (secKey === 'languages' && resume.languages && resume.languages.length > 0) {
      children.push(createSectionHeading('Languages'));
      children.push(
        new Paragraph({
          spacing: { after: 60 },
          children: [
            new TextRun({
              text: resume.languages.map((l) => `${l.language} (${l.proficiency})`).join('  •  '),
              size: 20,
              color: '374151',
              font: 'Arial',
            }),
          ],
        })
      );
    }
  });

  const pageSizeConfig = getPageSizeConfig(theme.paperSize || 'a4');

  // Create Word Document
  const doc = new Document({
    sections: [
      {
        properties: {
          page: {
            size: {
              width: pageSizeConfig.docxPageSize.width,
              height: pageSizeConfig.docxPageSize.height,
            },
            margin: {
              top: 720, // 0.5 inch
              right: 720,
              bottom: 720,
              left: 720,
            },
          },
        },
        children,
      },
    ],
  });

  // Pack into blob and trigger browser download
  const blob = await Packer.toBlob(doc);
  const fileName = `${(p.fullName || 'Resume').replace(/[^a-zA-Z0-9]/g, '_')}_Resume.docx`;
  
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = fileName;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  window.URL.revokeObjectURL(url);
}
