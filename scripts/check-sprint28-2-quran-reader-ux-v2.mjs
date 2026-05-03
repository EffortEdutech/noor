import fs from 'node:fs';
import path from 'node:path';

function read(relativePath) {
  const fullPath = path.join(process.cwd(), relativePath);
  if (!fs.existsSync(fullPath)) {
    throw new Error(`Missing required file: ${relativePath}`);
  }
  return fs.readFileSync(fullPath, 'utf8');
}

function assertIncludes(content, expected, label) {
  if (!content.includes(expected)) {
    throw new Error(`Missing ${label}: ${expected}`);
  }
}

const quranExperience = read('apps/web/components/QuranReadingExperience.tsx');
const ayahCard = read('apps/web/components/AyahStudyCard.tsx');
const readerPage = read('apps/web/app/learn/quran/[surah]/page.tsx');
const css = read('apps/web/app/globals.css');
const docs = read('docs/SPRINT_28_2_QURAN_READER_UX_V2.md');
const localTesting = read('docs/LOCAL_TESTING_SPRINT_28_2.md');
const packageJson = JSON.parse(read('package.json'));

assertIncludes(quranExperience, 'READER_MODE_STORAGE_KEY', 'persistent reader mode storage');
assertIncludes(quranExperience, 'noor.quran.readerMode.v2', 'reader mode storage key');
assertIncludes(quranExperience, 'scrollToAyah', 'jump-to-ayah behaviour');
assertIncludes(quranExperience, 'noor-reader-jump-form', 'jump form');
assertIncludes(quranExperience, 'noor-ayah-map', 'surah ayah map');
assertIncludes(quranExperience, 'Previous Surah', 'previous surah navigation');
assertIncludes(quranExperience, 'Next Surah', 'next surah navigation');

assertIncludes(ayahCard, 'Copy ayah', 'copy ayah action');
assertIncludes(ayahCard, 'Copy reference', 'copy reference action');
assertIncludes(ayahCard, 'noor-reflection-prompt', 'reflection prompt');
assertIncludes(ayahCard, 'getModeHelper', 'mode helper copy');

assertIncludes(readerPage, 'Read, study or memorise with a focused reader', 'reader page product copy');

assertIncludes(css, 'Sprint 28.2: Quran Reader UX v2', 'Sprint 28.2 CSS section');
assertIncludes(css, '.noor-reader-jump-form', 'jump form CSS');
assertIncludes(css, '.noor-ayah-map-button', 'ayah map CSS');
assertIncludes(css, '.noor-copy-status', 'copy status CSS');

assertIncludes(docs, 'Sprint 28.2', 'Sprint doc title');
assertIncludes(localTesting, 'pnpm check:sprint28-2', 'local testing command');

if (packageJson.scripts?.['check:quran-reader-ux-v2'] !== 'node scripts/check-sprint28-2-quran-reader-ux-v2.mjs') {
  throw new Error('package.json missing check:quran-reader-ux-v2 script. Run node scripts/apply-sprint28-2-package-scripts.mjs');
}

if (!packageJson.scripts?.['check:sprint28-2']?.includes('pnpm check:quran-reader-ux-v2')) {
  throw new Error('package.json missing check:sprint28-2 script. Run node scripts/apply-sprint28-2-package-scripts.mjs');
}

console.log('NOOR Sprint 28.2 Quran Reader UX v2 check passed.');
