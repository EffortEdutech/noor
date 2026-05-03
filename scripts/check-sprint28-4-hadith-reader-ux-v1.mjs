import fs from 'node:fs';

function read(path) {
  if (!fs.existsSync(path)) throw new Error(`Missing required file: ${path}`);
  return fs.readFileSync(path, 'utf8');
}

function assertIncludes(path, content, tokens) {
  for (const token of tokens) {
    if (!content.includes(token)) {
      throw new Error(`${path} must include ${token}`);
    }
  }
}

const pagePath = 'apps/web/app/learn/hadith/page.tsx';
const cardPath = 'packages/noor-ui/src/components/HadithCard.tsx';
const actionsPath = 'packages/noor-ui/src/components/HadithActionButtons.tsx';
const cssPath = 'apps/web/app/globals.css';
const docsPath = 'docs/SPRINT_28_4_HADITH_READER_UX_V1.md';
const localTestingPath = 'docs/LOCAL_TESTING_SPRINT_28_4.md';
const packagePath = 'package.json';

assertIncludes(pagePath, read(pagePath), [
  'HadithReaderMode',
  'Read → Reflect → Practise',
  'noor-hadith-guidance-grid',
  'collectTopics',
  'filterItemsByTopic',
  'mode={activeMode}'
]);

assertIncludes(cardPath, read(cardPath), [
  'HadithActionButtons',
  'noor-hadith-guidance-note',
  'buildReflectionPrompt',
  'mode?: HadithReaderMode'
]);

assertIncludes(actionsPath, read(actionsPath), [
  "'use client'",
  'navigator.clipboard.writeText',
  'Copy Hadith',
  'Copy reference',
  'BookmarkButton'
]);

assertIncludes(cssPath, read(cssPath), [
  'Sprint 28.4: Hadith Reader UX v1',
  '.noor-hadith-flow',
  '.noor-hadith-guidance-note',
  '.noor-topic-chip-row'
]);

assertIncludes(docsPath, read(docsPath), [
  'Sprint 28.4',
  'Hadith Reader UX v1',
  'Read → Reflect → Practise'
]);

assertIncludes(localTestingPath, read(localTestingPath), [
  'Sprint 28.4',
  'pnpm check:hadith-reader-ux-v1',
  'Full local CI mirror'
]);

const packageJson = JSON.parse(read(packagePath));
if (packageJson.scripts?.['check:hadith-reader-ux-v1'] !== 'node scripts/check-sprint28-4-hadith-reader-ux-v1.mjs') {
  throw new Error('package.json must register check:hadith-reader-ux-v1');
}
if (!packageJson.scripts?.['check:sprint28-4']?.includes('check:sprint28-3')) {
  throw new Error('package.json must register check:sprint28-4 chained after Sprint 28.3');
}

console.log('NOOR Sprint 28.4 Hadith Reader UX v1 check passed.');
