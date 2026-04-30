import { existsSync, readFileSync } from 'node:fs';

const EXPECTED_VERSION = '0.25.0';

function fail(message) {
  console.error(message);
  process.exit(1);
}
function read(file) { return readFileSync(file, 'utf8'); }
function readJson(file) { return JSON.parse(read(file)); }

const requiredFiles = [
  'package.json',
  'apps/web/app/settings/page.tsx',
  'apps/web/components/ProductionCdnPromotionCard.tsx',
  'apps/web/lib/app-version.ts',
  'apps/web/lib/production-cdn-promotion.ts',
  'apps/web/lib/roadmap.ts',
  'apps/web/public/version.json',
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
  console.error('Missing required NOOR Sprint 0-25 files:');
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
  'roadmap:status'
]) {
  if (!pkg.scripts?.[script]) fail(`package.json missing script: ${script}`);
}

const appVersion = read('apps/web/lib/app-version.ts');
if (!appVersion.includes(`NOOR_APP_VERSION = '${EXPECTED_VERSION}'`)) fail(`NOOR app version must be ${EXPECTED_VERSION}.`);
if (readJson('apps/web/public/version.json').version !== EXPECTED_VERSION) fail(`version.json must be ${EXPECTED_VERSION}.`);

const settings = read('apps/web/app/settings/page.tsx');
for (const expected of ['RoadmapControlCard', 'ProductionCdnPromotionCard', 'ScholarlyReviewConsoleCard', 'QuranSourceGateCard', 'QuranImportCard', 'TafseerImportCard', 'HadithImportCard', 'SourceIntakeCard', 'RuntimeContentSourceCard']) {
  if (!settings.includes(expected)) fail(`settings page must render ${expected}`);
}

const promotion = readJson('content-pipeline/production-cdn/noor-production-cdn-promotion.json');
if (promotion.version !== EXPECTED_VERSION || promotion.status !== 'blocked') fail('Sprint 25 production CDN promotion must remain blocked.');
if (promotion.productionPromotionAllowed !== false || promotion.runtimeDefault !== 'bundled') fail('Sprint 25 production CDN promotion must keep bundled runtime default.');

const roadmap = read('apps/web/lib/roadmap.ts');
for (const expected of ['currentSprint', 'Sprint 25', 'Sprint 26', 'Production CDN v1 promotion']) {
  if (!roadmap.includes(expected)) fail(`roadmap.ts missing ${expected}`);
}

const ci = read('.github/workflows/noor-ci.yml');
for (const expected of ['pnpm review:console', 'pnpm check:review-console', 'pnpm production:promote', 'pnpm check:production-promotion', 'pnpm roadmap:status', 'pnpm check:roadmap']) {
  if (!ci.includes(expected)) fail(`CI workflow missing ${expected}`);
}

const releaseNotes = read('RELEASE_NOTES.md') + read('CHANGELOG.md') + read('apps/web/lib/release-notes.ts');
if (!releaseNotes.includes('0.25.0') || !releaseNotes.includes('Production CDN v1 promotion')) {
  fail('Release notes/changelog must include v0.25.0 Production CDN v1 promotion entry.');
}

console.log('NOOR Sprint 0-25 pack check passed.');
