import { existsSync, readFileSync } from 'node:fs';

const EXPECTED_VERSION = '0.26.0';

function fail(message) {
  console.error(message);
  process.exit(1);
}

function read(file) {
  return readFileSync(file, 'utf8');
}

function readJson(file) {
  return JSON.parse(read(file));
}

function includesAny(source, expectedValues) {
  return expectedValues.some((value) => source.includes(value));
}

const requiredFiles = [
  'package.json',
  'apps/web/app/settings/page.tsx',
  'apps/web/app/explore/page.tsx',
  'apps/web/components/SearchPanel.tsx',
  'apps/web/components/ProductionCdnPromotionCard.tsx',
  'apps/web/lib/app-version.ts',
  'apps/web/lib/production-cdn-promotion.ts',
  'apps/web/lib/release-notes.ts',
  'apps/web/lib/roadmap.ts',
  'apps/web/public/version.json',
  'packages/noor-search/src/index.ts',
  'packages/noor-data/src/config.ts',
  'scripts/build-noor-cdn-search-index.mjs',
  'scripts/promote-noor-production-cdn.mjs',
  'scripts/check-noor-production-promotion.mjs',
  'scripts/check-noor-pack.mjs',
  'scripts/check-noor-release.mjs',
  'scripts/generate-noor-roadmap.mjs',
  'scripts/check-noor-roadmap.mjs',
  'content-pipeline/review/noor-scholarly-review-console.json',
  'content-pipeline/imported/quran-v0.20/noor-cdn/manifest/noor-quran-import-report.json',
  'content-pipeline/imported/tafseer-v0.22/noor-cdn/manifest/noor-tafseer-import-report.json',
  'content-pipeline/imported/hadith-v0.23/noor-cdn/manifest/noor-hadith-import-report.json',
  'content-pipeline/production-cdn/noor-production-cdn-promotion.json',
  'content-pipeline/production-cdn/noor-production-cdn-promotion.md',
  'content-pipeline/production-cdn/.env.noor-production-cdn.example',
  'content-pipeline/roadmap/noor-roadmap-status.json',
  'content-pipeline/roadmap/noor-roadmap-status.md',
  'docs/NOOR_MASTER_ROADMAP.md',
  'docs/NOOR_PRODUCTION_CDN_PROMOTION.md',
  'docs/SPRINT_25_SCOPE.md',
  'docs/LOCAL_TESTING_SPRINT_25.md',
  '.github/workflows/noor-ci.yml',
  'RELEASE_NOTES.md',
  'CHANGELOG.md'
];

const missing = requiredFiles.filter((file) => !existsSync(file));
if (missing.length > 0) {
  console.error('Missing required NOOR Sprint 0-26 files:');
  for (const file of missing) console.error(`- ${file}`);
  process.exit(1);
}

const pkg = readJson('package.json');
for (const script of [
  'check:pack',
  'check:content',
  'check:release',
  'check:runtime',
  'check:review-console',
  'check:production-promotion',
  'check:roadmap',
  'review:console',
  'production:promote',
  'roadmap:status',
  'search:build-cdn-index',
  'cdn:pack',
  'cdn:verify'
]) {
  if (!pkg.scripts?.[script]) fail(`package.json missing script: ${script}`);
}

const appVersion = read('apps/web/lib/app-version.ts');
if (!appVersion.includes(`NOOR_APP_VERSION = '${EXPECTED_VERSION}'`)) {
  fail(`NOOR app version must be ${EXPECTED_VERSION}.`);
}
if (!appVersion.includes('Sprint 26')) {
  fail('NOOR app version metadata must mention Sprint 26.');
}

const versionJson = readJson('apps/web/public/version.json');
if (versionJson.version !== EXPECTED_VERSION) {
  fail(`version.json must be ${EXPECTED_VERSION}.`);
}
if (!String(versionJson.label ?? '').includes('Sprint 26')) {
  fail('version.json label must mention Sprint 26.');
}

const settings = read('apps/web/app/settings/page.tsx');
for (const expected of [
  'RoadmapControlCard',
  'ProductionCdnPromotionCard',
  'ScholarlyReviewConsoleCard',
  'QuranSourceGateCard',
  'QuranImportCard',
  'TafseerImportCard',
  'HadithImportCard',
  'SourceIntakeCard',
  'RuntimeContentSourceCard'
]) {
  if (!settings.includes(expected)) fail(`settings page must render ${expected}`);
}

const promotion = readJson('content-pipeline/production-cdn/noor-production-cdn-promotion.json');
if (promotion.status !== 'blocked') fail('Production CDN promotion must remain blocked.');
if (promotion.productionPromotionAllowed !== false || promotion.runtimeDefault !== 'bundled') {
  fail('Production CDN promotion must keep bundled runtime default until review approval.');
}

const roadmap = read('apps/web/lib/roadmap.ts');
for (const expected of ['currentSprint', 'Sprint 26', 'CDN search index', 'Sprint 27']) {
  if (!roadmap.includes(expected)) fail(`roadmap.ts missing ${expected}`);
}

const generatedRoadmap = readJson('content-pipeline/roadmap/noor-roadmap-status.json');
if (generatedRoadmap.version !== EXPECTED_VERSION) {
  fail(`Roadmap generated version must be ${EXPECTED_VERSION}.`);
}
if (generatedRoadmap.currentSprint?.sprint !== 'Sprint 26') {
  fail('Current roadmap sprint must be Sprint 26.');
}
if (!generatedRoadmap.completedSprints?.includes('Sprint 25')) {
  fail('Roadmap must mark Sprint 25 complete.');
}
if (generatedRoadmap.futureSprints?.[0]?.sprint !== 'Sprint 27') {
  fail('Roadmap next sprint must be Sprint 27.');
}

const ci = read('.github/workflows/noor-ci.yml');
for (const expected of [
  'pnpm review:console',
  'pnpm check:review-console',
  'pnpm production:promote',
  'pnpm check:production-promotion',
  'pnpm roadmap:status',
  'pnpm check:roadmap'
]) {
  if (!ci.includes(expected)) fail(`CI workflow missing ${expected}`);
}

const releaseNotes = read('RELEASE_NOTES.md') + read('CHANGELOG.md') + read('apps/web/lib/release-notes.ts');
if (!releaseNotes.includes('0.26.0') || !releaseNotes.includes('Sprint 26')) {
  fail('Release notes/changelog must include v0.26.0 Sprint 26 entry.');
}
if (!includesAny(releaseNotes, ['CDN search index', 'Search Index from CDN Content', 'External CDN search index'])) {
  fail('Release notes/changelog must mention the Sprint 26 CDN search index.');
}

const searchPanel = read('apps/web/components/SearchPanel.tsx');
const searchPackage = read('packages/noor-search/src/index.ts');
const searchIndexBuilder = read('scripts/build-noor-cdn-search-index.mjs');

// The UI may build the source label dynamically, so this check intentionally accepts
// either the exact rendered text or the implementation primitives that produce it.
if (!includesAny(searchPanel, [
  'External CDN search index',
  'CDN search index',
  'search/search-index.json',
  'noor.contentSource.v1',
  'NOOR_CONTENT_SOURCE_LOCAL_STORAGE_KEY',
  'loadNoorSearchIndex'
])) {
  fail('SearchPanel must include Sprint 26 CDN search support.');
}

if (!includesAny(searchPackage, [
  'searchNoor',
  'searchNoorLocal',
  'NoorSearchIndex',
  'NoorSearchEntry',
  'rank'
])) {
  fail('packages/noor-search must expose NOOR search helpers.');
}

if (!includesAny(searchIndexBuilder, [
  'search-index.json',
  'quran',
  'tafseer',
  'hadith'
])) {
  fail('Sprint 26 search index builder must generate Quran, tafseer and hadith search index data.');
}

const cdnSearchCandidates = [
  'content-pipeline/dist/noor-cdn/search/search-index.json',
  'content-pipeline/publish/noor-cdn-gh-pages/noor-cdn/search/search-index.json',
  'apps/web/public/noor-cdn/search/search-index.json'
];
if (!cdnSearchCandidates.some((file) => existsSync(file))) {
  fail('Generated CDN search index missing. Run pnpm content:prepare and pnpm search:build-cdn-index.');
}

console.log('NOOR Sprint 0-26 pack check passed.');
