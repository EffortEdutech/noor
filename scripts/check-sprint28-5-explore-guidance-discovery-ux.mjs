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

const explorePath = 'apps/web/app/explore/page.tsx';
const panelPath = 'apps/web/components/SearchPanel.tsx';
const searchPath = 'packages/noor-search/src/index.ts';
const cssPath = 'apps/web/app/globals.css';
const docsPath = 'docs/SPRINT_28_5_EXPLORE_GUIDANCE_DISCOVERY_UX.md';
const localTestingPath = 'docs/LOCAL_TESTING_SPRINT_28_5.md';
const packagePath = 'package.json';

assertIncludes(explorePath, read(explorePath), [
  'Discover guidance by need, topic, and source.',
  'noor-guidance-path-grid',
  'Quran reader',
  'Tafseer',
  'Hadith',
  '<SearchPanel />'
]);

const panel = read(panelPath);
assertIncludes(panelPath, panel, [
  'GUIDANCE_TOPIC_PROMPTS',
  'NOOR_DISCOVERY_SOURCE_TYPES',
  'SOURCE_GROUPS',
  'groupedResults',
  'noor-topic-prompt-grid',
  'noor-result-group',
  'buildQuranReaderHref',
  'buildTafseerHref',
  'buildHadithReaderHref',
  'Open Quran reader',
  'Open Tafseer understanding',
  'Open Hadith reader',
  'Try a wider doorway into guidance'
]);

if (panel.includes('Local entries')) {
  throw new Error('SearchPanel must not expose technical Local entries wording.');
}

assertIncludes(searchPath, read(searchPath), [
  "id: 'mercy'",
  "id: 'patience'",
  "id: 'rizq'",
  "id: 'intention'",
  "id: 'protection'",
  "id: 'prayer'",
  "id: 'repentance'",
  '/learn/tafseer?surah=',
  '/learn/hadith?'
]);

assertIncludes(cssPath, read(cssPath), [
  'Sprint 28.5: Explore Guidance Discovery UX',
  '.noor-topic-prompt-grid',
  '.noor-result-group',
  '.noor-empty-guidance-card',
  '.noor-guidance-path-grid'
]);

assertIncludes(docsPath, read(docsPath), [
  'Sprint 28.5',
  'Explore Guidance Discovery UX',
  'Quran, Tafseer and Hadith',
  'topic prompt cards'
]);

assertIncludes(localTestingPath, read(localTestingPath), [
  'Sprint 28.5',
  'pnpm check:explore-guidance-discovery-ux',
  'Full local CI mirror',
  'Clean generated files after full CI mirror'
]);

const packageJson = JSON.parse(read(packagePath));
if (
  packageJson.scripts?.['check:explore-guidance-discovery-ux'] !==
  'node scripts/check-sprint28-5-explore-guidance-discovery-ux.mjs'
) {
  throw new Error('package.json must register check:explore-guidance-discovery-ux');
}
if (!packageJson.scripts?.['check:sprint28-5']?.includes('check:sprint28-4')) {
  throw new Error('package.json must register check:sprint28-5 chained after Sprint 28.4');
}
if (!packageJson.scripts?.['check:sprint28-5']?.includes('typecheck')) {
  throw new Error('check:sprint28-5 must include typecheck');
}
if (!packageJson.scripts?.['check:sprint28-5']?.includes('build')) {
  throw new Error('check:sprint28-5 must include build');
}

console.log('NOOR Sprint 28.5 Explore Guidance Discovery UX check passed.');
