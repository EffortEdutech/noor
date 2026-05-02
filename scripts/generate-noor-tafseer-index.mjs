import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const cdnRootArg = process.argv.find((arg) => arg.startsWith('--cdn-root='))?.split('=').slice(1).join('=');
const cdnRoot = path.resolve(root, cdnRootArg || path.join('content-pipeline', 'imported', 'ilm-mate-v1', 'noor-cdn'));
const tafseerRoot = path.join(cdnRoot, 'tafseer');
const metadataRoot = path.join(cdnRoot, 'metadata');
const outputPath = path.join(metadataRoot, 'tafseer-index.json');

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, 'utf8'));
}

function padSurah(value) {
  return String(value).padStart(3, '0');
}

function titleCase(input) {
  return String(input)
    .replace(/[-_]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
    .replace(/\b\w/g, (char) => char.toUpperCase());
}

function getSurahNumberFromFilename(fileName) {
  const match = fileName.match(/(\d{1,3})\.json$/);
  if (!match) return undefined;
  const parsed = Number.parseInt(match[1], 10);
  if (!Number.isFinite(parsed) || parsed < 1 || parsed > 114) return undefined;
  return parsed;
}

if (!fs.existsSync(tafseerRoot)) {
  throw new Error(`Tafseer folder not found: ${tafseerRoot}`);
}

const books = [];

for (const bookId of fs.readdirSync(tafseerRoot).sort()) {
  const bookRoot = path.join(tafseerRoot, bookId);
  const surahsRoot = path.join(bookRoot, 'surahs');

  if (!fs.statSync(bookRoot).isDirectory() || !fs.existsSync(surahsRoot)) continue;

  const surahFiles = fs
    .readdirSync(surahsRoot)
    .filter((fileName) => fileName.endsWith('.json'))
    .sort();

  const availableSurahs = [];
  let entryCount = 0;
  let sourceLabel = titleCase(bookId);
  let language = 'en';
  let samplePath;

  for (const fileName of surahFiles) {
    const surahNumber = getSurahNumberFromFilename(fileName);
    if (!surahNumber) continue;

    const filePath = path.join(surahsRoot, fileName);
    const entries = readJson(filePath);

    if (!Array.isArray(entries)) {
      throw new Error(`Expected Tafseer entries array: ${filePath}`);
    }

    availableSurahs.push(surahNumber);
    entryCount += entries.length;

    const firstEntry = entries.find(Boolean);
    if (firstEntry) {
      sourceLabel = firstEntry.sourceLabel || sourceLabel;
      language = firstEntry.language || language;
      if (!samplePath) {
        samplePath = `tafseer/${bookId}/surahs/${padSurah(surahNumber)}.json`;
      }
    }
  }

  if (availableSurahs.length === 0) continue;

  availableSurahs.sort((a, b) => a - b);

  books.push({
    id: bookId,
    label: sourceLabel,
    sourceLabel,
    language,
    surahCount: availableSurahs.length,
    entryCount,
    firstSurah: availableSurahs[0],
    lastSurah: availableSurahs[availableSurahs.length - 1],
    availableSurahs,
    status: 'staging',
    samplePath: samplePath || `tafseer/${bookId}/surahs/${padSurah(availableSurahs[0])}.json`
  });
}

if (books.length === 0) {
  throw new Error(`No Tafseer books found under: ${tafseerRoot}`);
}

const payload = {
  version: 'sprint-27.9.3',
  generatedAt: new Date().toISOString(),
  source: 'ilm-mate-v1-staging',
  summary: {
    bookCount: books.length,
    entryCount: books.reduce((sum, book) => sum + book.entryCount, 0),
    coveredSurahCount: new Set(books.flatMap((book) => book.availableSurahs)).size
  },
  books
};

fs.mkdirSync(metadataRoot, { recursive: true });
fs.writeFileSync(outputPath, `${JSON.stringify(payload, null, 2)}\n`, 'utf8');

const reportDir = path.join(root, 'content-pipeline', 'review', 'ilm-mate-v1', 'tafseer-cdn-index');
fs.mkdirSync(reportDir, { recursive: true });
fs.writeFileSync(
  path.join(reportDir, 'tafseer-index-report.md'),
  `# NOOR Sprint 27.9.3 Tafseer CDN Index Report

Generated at: ${payload.generatedAt}

CDN root:

\`\`\`text
${cdnRoot}
\`\`\`

Output:

\`\`\`text
${outputPath}
\`\`\`

Summary:

- Books: ${payload.summary.bookCount}
- Entries: ${payload.summary.entryCount}
- Covered Surahs: ${payload.summary.coveredSurahCount}

Books:

${books.map((book) => `- ${book.id}: ${book.label} — ${book.surahCount} surah(s), ${book.entryCount} entries`).join('\n')}
`,
  'utf8'
);

console.log('NOOR Tafseer CDN index generated.');
console.log(`Books: ${payload.summary.bookCount}`);
console.log(`Entries: ${payload.summary.entryCount}`);
console.log(`Output: ${path.relative(root, outputPath)}`);
