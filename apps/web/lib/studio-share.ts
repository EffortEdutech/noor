export type NoorSharePlatform = 'general' | 'whatsapp' | 'instagram' | 'telegram' | 'facebook';
export type NoorShareTheme = 'noor-gold' | 'emerald-night' | 'paper-light';

export type NoorShareSource = {
  type: 'ayah' | 'hadith' | 'bookmark' | 'manual';
  title: string;
  reference: string;
  body: string;
  translation?: string;
  sourceLabel?: string;
};

type ThemePalette = {
  background: string;
  panel: string;
  accent: string;
  accentSoft: string;
  ink: string;
  muted: string;
  border: string;
};

const THEME_PALETTES: Record<NoorShareTheme, ThemePalette> = {
  'noor-gold': {
    background: '#071014',
    panel: '#13232b',
    accent: '#d8b75a',
    accentSoft: '#392f18',
    ink: '#f4efe2',
    muted: '#b9b4a8',
    border: '#5d5130'
  },
  'emerald-night': {
    background: '#061714',
    panel: '#102720',
    accent: '#2fbf9b',
    accentSoft: '#123a31',
    ink: '#f4fff9',
    muted: '#b8cdc5',
    border: '#226d5d'
  },
  'paper-light': {
    background: '#f4efe2',
    panel: '#fffaf0',
    accent: '#84631f',
    accentSoft: '#f1dfaa',
    ink: '#1e2a27',
    muted: '#675f50',
    border: '#dcc892'
  }
};

function escapeXml(value: string) {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&apos;');
}

function sanitizeFilename(value: string) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
    .slice(0, 54) || 'noor-share-card';
}

function wrapText(value: string, maxChars: number) {
  const words = value.replace(/\s+/g, ' ').trim().split(' ').filter(Boolean);
  const lines: string[] = [];
  let current = '';

  for (const word of words) {
    const next = current ? `${current} ${word}` : word;
    if (next.length > maxChars && current) {
      lines.push(current);
      current = word;
    } else {
      current = next;
    }
  }

  if (current) lines.push(current);
  return lines;
}

function textLines(lines: string[], x: number, y: number, size: number, fill: string, weight = 500, max = 6) {
  return lines
    .slice(0, max)
    .map((line, index) => {
      const dy = index === 0 ? 0 : size * 1.45;
      return `<text x="${x}" y="${y + dy}" font-size="${size}" font-weight="${weight}" fill="${fill}" text-anchor="middle">${escapeXml(line)}</text>`;
    })
    .join('\n');
}

export function buildNoorShareCaption(
  source: NoorShareSource,
  options: { note?: string; platform?: NoorSharePlatform } = {}
) {
  const lines = [
    source.title,
    source.reference,
    '',
    source.body,
    source.translation ? `\n${source.translation}` : '',
    source.sourceLabel ? `\nSource: ${source.sourceLabel}` : ''
  ].filter(Boolean);

  if (options.note?.trim()) {
    lines.push('', options.note.trim());
  }

  lines.push('', '— Shared from NOOR');

  if (options.platform === 'instagram' || options.platform === 'facebook') {
    lines.push('#NOOR #Quran #Hadith #IslamicReminder');
  }

  return lines.join('\n');
}

export function buildNoorShareSvg(source: NoorShareSource, theme: NoorShareTheme, note = '') {
  const palette = THEME_PALETTES[theme];
  const bodyLines = wrapText(source.body, 44);
  const translationLines = wrapText(source.translation ?? '', 48);
  const noteLines = wrapText(note, 42);

  return `<?xml version="1.0" encoding="UTF-8"?>
<svg width="1080" height="1350" viewBox="0 0 1080 1350" fill="none" xmlns="http://www.w3.org/2000/svg">
  <rect width="1080" height="1350" fill="${palette.background}"/>
  <circle cx="140" cy="120" r="260" fill="${palette.accent}" opacity="0.16"/>
  <circle cx="950" cy="1100" r="300" fill="${palette.accent}" opacity="0.11"/>
  <rect x="86" y="92" width="908" height="1166" rx="54" fill="${palette.panel}" stroke="${palette.border}" stroke-width="3"/>
  <text x="540" y="178" font-family="Arial, sans-serif" font-size="34" font-weight="800" fill="${palette.accent}" text-anchor="middle" letter-spacing="8">NOOR</text>
  <text x="540" y="228" font-family="Arial, sans-serif" font-size="30" fill="${palette.muted}" text-anchor="middle">${escapeXml(source.type.toUpperCase())} REMINDER</text>
  <rect x="278" y="272" width="524" height="64" rx="32" fill="${palette.accentSoft}" stroke="${palette.border}" stroke-width="2"/>
  <text x="540" y="315" font-family="Arial, sans-serif" font-size="27" font-weight="700" fill="${palette.accent}" text-anchor="middle">${escapeXml(source.reference)}</text>

  ${textLines(wrapText(source.title, 32), 540, 430, 54, palette.ink, 800, 2)}

  ${textLines(bodyLines, 540, 590, 42, palette.ink, 600, 7)}

  ${translationLines.length > 0 ? textLines(translationLines, 540, 900, 32, palette.muted, 500, 5) : ''}

  ${noteLines.length > 0 ? `<rect x="170" y="1060" width="740" height="96" rx="24" fill="${palette.accentSoft}" stroke="${palette.border}" stroke-width="2"/>${textLines(noteLines, 540, 1118, 28, palette.ink, 600, 2)}` : ''}

  <text x="540" y="1210" font-family="Arial, sans-serif" font-size="24" fill="${palette.muted}" text-anchor="middle">Shared from NOOR · Daily Islamic Companion</text>
</svg>`;
}

export function getNoorShareFilename(source: NoorShareSource, extension: 'txt' | 'svg') {
  return `${sanitizeFilename(`${source.reference}-${source.title}`)}.${extension}`;
}

export function downloadTextFile(filename: string, content: string) {
  downloadBlob(filename, content, 'text/plain;charset=utf-8');
}

export function downloadSvgFile(filename: string, svg: string) {
  downloadBlob(filename, svg, 'image/svg+xml;charset=utf-8');
}

function downloadBlob(filename: string, content: string, type: string) {
  if (typeof document === 'undefined') return;

  const blob = new Blob([content], { type });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement('a');

  anchor.href = url;
  anchor.download = filename;
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();

  URL.revokeObjectURL(url);
}

export async function copyToClipboard(value: string) {
  try {
    await navigator.clipboard.writeText(value);
    return true;
  } catch {
    return false;
  }
}
