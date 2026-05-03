import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const requiredFiles = [
  'packages/noor-config/src/index.ts',
  'apps/web/app/today/page.tsx',
  'apps/web/app/learn/page.tsx',
  'apps/web/app/learn/quran/page.tsx',
  'apps/web/app/learn/quran/[surah]/page.tsx',
  'apps/web/app/learn/tafseer/page.tsx',
  'apps/web/app/learn/hadith/page.tsx',
  'apps/web/app/explore/page.tsx',
  'apps/web/app/library/page.tsx',
  'apps/web/components/QuranReadingExperience.tsx',
  'apps/web/components/AyahStudyCard.tsx',
  'apps/web/components/ReaderPreferencesPanel.tsx',
  'apps/web/components/SearchPanel.tsx',
  'packages/noor-ui/src/components/HadithCard.tsx',
  'apps/web/app/globals.css',
  'docs/SPRINT_28_1_REAL_READING_UX.md',
  'docs/LOCAL_TESTING_SPRINT_28_1.md'
];

function read(relativePath) {
  const absolutePath = path.join(root, relativePath);
  if (!fs.existsSync(absolutePath)) {
    throw new Error(`Missing required file: ${relativePath}`);
  }
  return fs.readFileSync(absolutePath, 'utf8');
}

function assertIncludes(file, text, needles) {
  for (const needle of needles) {
    if (!text.includes(needle)) {
      throw new Error(`Expected ${file} to include: ${needle}`);
    }
  }
}

const files = Object.fromEntries(requiredFiles.map((file) => [file, read(file)]));

const expectations = [
  ['packages/noor-config/src/index.ts', ['label: \'Studio\'', "href: '/studio'"]],
  ['apps/web/app/today/page.tsx', ['Return to the light.']],
  ['apps/web/app/learn/page.tsx', ['Not a database. A companion.']],
  ['apps/web/app/learn/quran/page.tsx', ['Read with presence.']],
  ['apps/web/app/learn/quran/[surah]/page.tsx', ['QuranReadingExperience']],
  ['apps/web/components/QuranReadingExperience.tsx', ["id: 'memorise'"]],
  ['apps/web/components/AyahStudyCard.tsx', ['Memorise focus']],
  ['apps/web/app/learn/tafseer/page.tsx', ['Understand the Quran.']],
  ['apps/web/app/learn/hadith/page.tsx', ['Read the Sunnah as guidance for today.']],
  ['apps/web/app/explore/page.tsx', ['Discover guidance by need, topic, and source.']],
  ['apps/web/components/SearchPanel.tsx', ['Search guidance']],
  ['apps/web/app/globals.css', ['Sprint 28.1: real reading UX foundation']]
];

for (const [file, needles] of expectations) {
  assertIncludes(file, files[file], needles);
}

const userFacingFiles = [
  'apps/web/app/today/page.tsx',
  'apps/web/app/learn/page.tsx',
  'apps/web/app/learn/quran/page.tsx',
  'apps/web/app/learn/quran/[surah]/page.tsx',
  'apps/web/app/learn/tafseer/page.tsx',
  'apps/web/app/learn/hadith/page.tsx',
  'apps/web/app/explore/page.tsx',
  'apps/web/app/library/page.tsx',
  'apps/web/components/SearchPanel.tsx'
];

for (const file of userFacingFiles) {
  const text = files[file];
  if (/Sprint\s+\d+/i.test(text)) {
    throw new Error(`User-facing file still contains sprint wording: ${file}`);
  }
}

console.log('NOOR Sprint 28.1 real reading UX check passed.');
