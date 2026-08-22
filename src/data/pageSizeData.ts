import { PaperSize } from '../types/resume';

export interface PageSizeDefinition {
  id: PaperSize;
  name: string;
  shortLabel: string;
  dimensionsMetric: string;
  dimensionsImperial: string;
  widthMm: number;
  heightMm: number;
  widthIn: number;
  heightIn: number;
  widthCss: string;
  minHeightCss: string;
  aspectRatio: string;
  description: string;
  regionBadge: string;
  docxPageSize: {
    width: number; // in DXA (1/20th of a point)
    height: number;
  };
  jsPdfFormat: string | [number, number];
}

export const PAGE_SIZE_OPTIONS: Record<PaperSize, PageSizeDefinition> = {
  a4: {
    id: 'a4',
    name: 'International A4',
    shortLabel: 'A4',
    dimensionsMetric: '210 × 297 mm',
    dimensionsImperial: '8.27 × 11.69 in',
    widthMm: 210,
    heightMm: 297,
    widthIn: 8.27,
    heightIn: 11.69,
    widthCss: '210mm',
    minHeightCss: '297mm',
    aspectRatio: '210 / 297',
    description: 'Standard global format (Europe, Asia, UK, India, LATAM, Australia)',
    regionBadge: 'Global Standard',
    docxPageSize: {
      width: 11906, // 210mm in twips
      height: 16838, // 297mm in twips
    },
    jsPdfFormat: 'a4',
  },
  letter: {
    id: 'letter',
    name: 'US Letter',
    shortLabel: 'Letter',
    dimensionsMetric: '215.9 × 279.4 mm',
    dimensionsImperial: '8.5 × 11.0 in',
    widthMm: 215.9,
    heightMm: 279.4,
    widthIn: 8.5,
    heightIn: 11.0,
    widthCss: '8.5in',
    minHeightCss: '11in',
    aspectRatio: '8.5 / 11',
    description: 'Standard format across North America (USA, Canada, Mexico)',
    regionBadge: 'USA & Canada',
    docxPageSize: {
      width: 12240, // 8.5 in * 1440
      height: 15840, // 11 in * 1440
    },
    jsPdfFormat: 'letter',
  },
  legal: {
    id: 'legal',
    name: 'US Legal',
    shortLabel: 'Legal',
    dimensionsMetric: '215.9 × 355.6 mm',
    dimensionsImperial: '8.5 × 14.0 in',
    widthMm: 215.9,
    heightMm: 355.6,
    widthIn: 8.5,
    heightIn: 14.0,
    widthCss: '8.5in',
    minHeightCss: '14in',
    aspectRatio: '8.5 / 14',
    description: 'Extended page format for comprehensive, executive, or technical resumes',
    regionBadge: 'Extended Format',
    docxPageSize: {
      width: 12240,
      height: 20160, // 14 in * 1440
    },
    jsPdfFormat: 'legal',
  },
  executive: {
    id: 'executive',
    name: 'Executive / Monarch',
    shortLabel: 'Executive',
    dimensionsMetric: '184.1 × 266.7 mm',
    dimensionsImperial: '7.25 × 10.5 in',
    widthMm: 184.15,
    heightMm: 266.7,
    widthIn: 7.25,
    heightIn: 10.5,
    widthCss: '7.25in',
    minHeightCss: '10.5in',
    aspectRatio: '7.25 / 10.5',
    description: 'Compact executive stationery size for high-impact single-page briefs',
    regionBadge: 'Compact / Executive',
    docxPageSize: {
      width: 10440, // 7.25 in * 1440
      height: 15120, // 10.5 in * 1440
    },
    jsPdfFormat: [184.15, 266.7],
  },
};

export const PAGE_SIZE_LIST: PageSizeDefinition[] = Object.values(PAGE_SIZE_OPTIONS);

export function getPageSizeConfig(paperSize: PaperSize = 'a4'): PageSizeDefinition {
  return PAGE_SIZE_OPTIONS[paperSize] || PAGE_SIZE_OPTIONS.a4;
}

/**
 * Injects dynamic CSS @page rule for browser printing matching chosen paper format.
 */
export function applyPrintPageSize(paperSize: PaperSize = 'a4'): void {
  const styleId = 'dynamic-print-page-size';
  let styleEl = document.getElementById(styleId) as HTMLStyleElement | null;
  if (!styleEl) {
    styleEl = document.createElement('style');
    styleEl.id = styleId;
    document.head.appendChild(styleEl);
  }

  let sizeRule = 'a4 portrait';
  if (paperSize === 'letter') sizeRule = 'letter portrait';
  else if (paperSize === 'legal') sizeRule = 'legal portrait';
  else if (paperSize === 'executive') sizeRule = '7.25in 10.5in';

  styleEl.innerHTML = `
    @media print {
      @page {
        size: ${sizeRule};
        margin: 0;
      }
    }
  `;
}
