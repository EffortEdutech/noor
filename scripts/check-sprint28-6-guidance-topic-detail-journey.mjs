import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();

function read(relativePath) {
  const fullPath = path.join(root, relativePath);
  if (!fs.existsSync(fullPath)) {
    throw new Error(`Missing required file: ${relativePath}`);
  }
  return fs.readFileSync(fullPath, 'utf8');
}

function assertIncludes(file, text, label = text) {
  const content = read(file);
  if (!content.includes(text)) {
    throw new Error(`${file} missing ${label}: ${text}`);
  }
}

const requiredFiles = [
  'apps/web/app/explore/page.tsx',
  'apps/web/app/explore/[topic]/page.tsx',
  'apps/web/app/globals.css',
  'packages/noor-search/src/index.ts',
  'docs/SPRINT_28_6_GUIDANCE_TOPIC_DETAIL_JOURNEY.md',
  'docs/LOCAL_TESTING_SPRINT_28_6.md',
  'scripts/check-sprint28-6-guidance-topic-detail-journey.mjs',
  'scripts/register-sprint28-6-topic-journey.mjs'
];

for (const file of requiredFiles) {
  read(file);
}

[
  'NOOR_GUIDANCE_TOPIC_JOURNEYS',
  'Open a topic journey',
  'Open guided path',
  'read, understand, reflect, then respond'
].forEach((needle) => assertIncludes('apps/web/app/explore/page.tsx', needle));

[
  'generateStaticParams',
  'getNoorGuidanceTopicJourney',
  'Explore-to-Reader Journey',
  'Read → Understand → Reflect → Respond',
  'topic.readerSteps',
  'searchNoorLocal',
  'Source entry points'
].forEach((needle) => assertIncludes('apps/web/app/explore/[topic]/page.tsx', needle));

[
  'export type NoorGuidanceTopicJourney',
  'NOOR_GUIDANCE_TOPIC_JOURNEYS',
  'getNoorGuidanceTopicJourney',
  "id: 'mercy'",
  "id: 'patience'",
  "id: 'rizq'",
  "id: 'intention'",
  "id: 'protection'",
  "id: 'prayer'",
  "id: 'repentance'",
  'buildTopicReaderSteps'
].forEach((needle) => assertIncludes('packages/noor-search/src/index.ts', needle));

[
  'Sprint 28.6: Guidance Topic Detail Journey',
  '.noor-topic-detail-grid',
  '.noor-topic-journey-hero-grid',
  '.noor-topic-reader-path'
].forEach((needle) => assertIncludes('apps/web/app/globals.css', needle));

const topicPage = read('apps/web/app/explore/[topic]/page.tsx');
if (/CDN|runtime|manifest|endpoint/i.test(topicPage)) {
  throw new Error('Topic detail page must not expose technical/runtime wording in user-facing UI.');
}

const pkg = JSON.parse(read('package.json'));
if (pkg.scripts?.['check:guidance-topic-detail-journey'] !== 'node scripts/check-sprint28-6-guidance-topic-detail-journey.mjs') {
  throw new Error('package.json missing check:guidance-topic-detail-journey script. Run node scripts/register-sprint28-6-topic-journey.mjs');
}

if (!pkg.scripts?.['check:sprint28-6']?.includes('pnpm check:sprint28-5')) {
  throw new Error('package.json missing check:sprint28-6 chain to Sprint 28.5.');
}

if (!pkg.scripts?.['check:sprint28-6']?.includes('pnpm check:guidance-topic-detail-journey')) {
  throw new Error('package.json missing check:sprint28-6 guidance topic detail check.');
}

console.log('NOOR Sprint 28.6 Guidance Topic Detail Journey check passed.');
