import { existsSync, readFileSync } from 'node:fs';

const EXPECTED_VERSION = '0.24.0';
const QURAN_IMPORT_VERSION = '0.20.0';
const TAFSEER_IMPORT_VERSION = '0.22.0';
const HADITH_IMPORT_VERSION = '0.23.0';

const requiredFiles = [
  'package.json',
  'pnpm-workspace.yaml',
  'apps/web/package.json',
  'apps/web/next.config.mjs',
  'apps/web/tsconfig.json',
  'apps/web/app/layout.tsx',
  'apps/web/app/page.tsx',
  'apps/web/app/settings/page.tsx',
  'apps/web/components/QuranImportCard.tsx',
  'apps/web/components/QuranSourceGateCard.tsx',
  'apps/web/components/TafseerImportCard.tsx',
  'apps/web/components/HadithImportCard.tsx',
  'apps/web/components/ScholarlyReviewConsoleCard.tsx',
  'apps/web/components/SourceIntakeCard.tsx',
  'apps/web/components/RoadmapControlCard.tsx',
  'apps/web/lib/app-version.ts',
  'apps/web/lib/content-pipeline.ts',
  'apps/web/lib/roadmap.ts',
  'apps/web/public/version.json',
  'apps/web/public/sw.js',
  'apps/web/public/offline.html',
  'packages/noor-content/src/index.ts',
  'packages/noor-data/src/index.ts',
  'packages/noor-ui/src/index.ts',
  'scripts/check-noor-pack.mjs',
  'scripts/check-noor-release.mjs',
  'scripts/check-noor-runtime.mjs',
  'scripts/check-noor-roadmap.mjs',
  'scripts/generate-noor-roadmap.mjs',
  'scripts/validate-noor-source-intake.mjs',
  'scripts/check-noor-source-intake.mjs',
  'scripts/audit-noor-sources.mjs',
  'scripts/check-noor-source-audit.mjs',
  'scripts/import-noor-quran.mjs',
  'scripts/check-noor-quran-import.mjs',
  'scripts/validate-noor-quran-source-gate.mjs',
  'scripts/check-noor-quran-source-gate.mjs',
  'scripts/import-noor-tafseer.mjs',
  'scripts/check-noor-tafseer-import.mjs',
  'scripts/import-noor-hadith.mjs',
  'scripts/check-noor-hadith-import.mjs',
  'scripts/generate-noor-review-console.mjs',
  'scripts/check-noor-review-console.mjs',
  'content-pipeline/source-intake/noor-source-candidates.json',
  'content-pipeline/source-gates/quran/quran-production-source-selection.json',
  'content-pipeline/source-gates/quran/audit/noor-quran-source-gate-audit.json',
  'content-pipeline/imported/quran-v0.20/noor-cdn/manifest/noor-quran-import-report.json',
  'content-pipeline/imported/tafseer-v0.22/noor-cdn/manifest/noor-tafseer-import-report.json',
  'content-pipeline/imported/hadith-v0.23/noor-cdn/manifest/noor-hadith-import-report.json',
  'content-pipeline/review/noor-scholarly-review-console.json',
  'content-pipeline/review/audit/noor-scholarly-review-audit.json',
  'content-pipeline/review/audit/noor-scholarly-review-audit.md',
  'docs/NOOR_MASTER_ROADMAP.md',
  'docs/NOOR_SOURCE_INTAKE.md',
  'docs/NOOR_QURAN_IMPORTER.md',
  'docs/NOOR_QURAN_SOURCE_GATE.md',
  'docs/NOOR_TAFSEER_IMPORTER.md',
  'docs/NOOR_HADITH_IMPORTER.md',
  'docs/NOOR_SCHOLARLY_REVIEW_CONSOLE.md',
  'docs/SPRINT_19_SCOPE.md',
  'docs/SPRINT_20_SCOPE.md',
  'docs/SPRINT_21_SCOPE.md',
  'docs/SPRINT_22_SCOPE.md',
  'docs/SPRINT_23_SCOPE.md',
  'docs/SPRINT_24_SCOPE.md',
  'docs/LOCAL_TESTING_SPRINT_19.md',
  'docs/LOCAL_TESTING_SPRINT_20.md',
  'docs/LOCAL_TESTING_SPRINT_21.md',
  'docs/LOCAL_TESTING_SPRINT_22.md',
  'docs/LOCAL_TESTING_SPRINT_23.md',
  'docs/LOCAL_TESTING_SPRINT_24.md',
  'content-pipeline/roadmap/noor-roadmap-status.json',
  'content-pipeline/roadmap/noor-roadmap-status.md',
  '.github/workflows/noor-ci.yml'
];

function fail(message) {
  console.error(message);
  process.exit(1);
}

function readJson(file) {
  return JSON.parse(readFileSync(file, 'utf8'));
}

function read(file) {
  return readFileSync(file, 'utf8');
}

function appVersion() {
  const match = read('apps/web/lib/app-version.ts').match(/NOOR_APP_VERSION\s*=\s*['"]([^'"]+)['"]/);
  return match?.[1] ?? null;
}

const missing = requiredFiles.filter((file) => !existsSync(file));
if (missing.length > 0) {
  console.error('Missing required NOOR Sprint 0-24 files:');
  for (const file of missing) console.error(`- ${file}`);
  process.exit(1);
}

const pkg = readJson('package.json');
for (const script of [
  'check:pack',
  'check:content',
  'check:release',
  'check:runtime',
  'check:cdn-publish',
  'check:cdn-smoke',
  'check:cdn-promotion',
  'check:source-audit',
  'check:source-intake',
  'check:quran-import',
  'check:quran-source-gate',
  'check:tafseer-import',
  'check:hadith-import',
  'check:review-console',
  'check:roadmap',
  'content:validate',
  'content:prepare',
  'cdn:pack',
  'cdn:verify',
  'cdn:smoke',
  'cdn:promote',
  'source:audit',
  'source:gate',
  'source:intake',
  'quran:import',
  'quran:gate',
  'tafseer:import',
  'hadith:import',
  'review:console',
  'roadmap:status'
]) {
  if (!pkg.scripts?.[script]) fail(`package.json missing script: ${script}`);
}

if (appVersion() !== EXPECTED_VERSION) fail(`NOOR app version must be ${EXPECTED_VERSION}.`);
if (readJson('apps/web/public/version.json').version !== EXPECTED_VERSION) fail(`version.json must be ${EXPECTED_VERSION}.`);

const pipeline = read('apps/web/lib/content-pipeline.ts');
for (const expected of [
  'NOOR_SOURCE_INTAKE',
  'NOOR_QURAN_IMPORTER',
  'NOOR_QURAN_SOURCE_GATE',
  'NOOR_TAFSEER_IMPORTER',
  'NOOR_HADITH_IMPORTER',
  'NOOR_SCHOLARLY_REVIEW_CONSOLE',
  'noor-quran-importer-v1',
  'noor-tafseer-importer-v1',
  'noor-hadith-importer-v1',
  'noor-scholarly-review-console-v1',
  'review:console',
  'check:review-console'
]) {
  if (!pipeline.includes(expected)) fail(`content-pipeline.ts missing ${expected}`);
}

const settings = read('apps/web/app/settings/page.tsx');
for (const expected of ['RoadmapControlCard', 'ScholarlyReviewConsoleCard', 'QuranSourceGateCard', 'QuranImportCard', 'TafseerImportCard', 'HadithImportCard', 'SourceIntakeCard', 'RuntimeContentSourceCard']) {
  if (!settings.includes(expected)) fail(`settings page must render ${expected}`);
}

const quranReport = readJson('content-pipeline/imported/quran-v0.20/noor-cdn/manifest/noor-quran-import-report.json');
if (quranReport.version !== QURAN_IMPORT_VERSION || quranReport.productionGate?.status !== 'blocked') {
  fail('Sprint 20 Quran import report must remain blocked and unchanged.');
}

const tafseerReport = readJson('content-pipeline/imported/tafseer-v0.22/noor-cdn/manifest/noor-tafseer-import-report.json');
if (tafseerReport.version !== TAFSEER_IMPORT_VERSION || tafseerReport.productionGate?.status !== 'blocked') {
  fail('Sprint 22 Tafseer import report must remain blocked and unchanged.');
}

const hadithReport = readJson('content-pipeline/imported/hadith-v0.23/noor-cdn/manifest/noor-hadith-import-report.json');
if (hadithReport.version !== HADITH_IMPORT_VERSION || hadithReport.productionGate?.status !== 'blocked') {
  fail('Sprint 23 Hadith import report must remain blocked and unchanged.');
}

const review = readJson('content-pipeline/review/noor-scholarly-review-console.json');
if (review.version !== EXPECTED_VERSION || review.status !== 'blocked') fail('Sprint 24 review console must be blocked.');
if (review.summary?.productionPromotionAllowed !== false) fail('Sprint 24 review console must not allow production promotion.');

const reviewAudit = readJson('content-pipeline/review/audit/noor-scholarly-review-audit.json');
if (reviewAudit.version !== EXPECTED_VERSION || reviewAudit.gateStatus !== 'blocked') {
  fail('Sprint 24 scholarly review audit must be blocked. Run pnpm review:console.');
}

const roadmap = read('apps/web/lib/roadmap.ts');
for (const expected of ['currentSprint', 'Sprint 24', 'Sprint 25', 'Scholarly review console']) {
  if (!roadmap.includes(expected)) fail(`roadmap.ts missing ${expected}`);
}

const ci = read('.github/workflows/noor-ci.yml');
for (const expected of [
  'pnpm review:console',
  'pnpm check:review-console',
  'pnpm check:hadith-import',
  'pnpm roadmap:status',
  'pnpm check:roadmap'
]) {
  if (!ci.includes(expected)) fail(`CI workflow missing ${expected}`);
}

const releaseNotes = read('RELEASE_NOTES.md') + read('CHANGELOG.md');
if (!releaseNotes.includes('v0.24.0') || !releaseNotes.includes('Scholarly review console')) {
  fail('Release notes/changelog must include v0.24.0 Scholarly review console entry.');
}

console.log('NOOR Sprint 0-24 pack check passed.');
