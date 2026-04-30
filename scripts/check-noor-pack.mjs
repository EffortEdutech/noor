import { existsSync, readFileSync } from 'node:fs';

const EXPECTED_VERSION = '0.20.0';

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
  'content-pipeline/schemas/noor-source-intake.schema.json',
  'content-pipeline/schemas/noor-quran-import-source.schema.json',
  'content-pipeline/source-intake/templates/quran-source-intake.template.json',
  'content-pipeline/source-intake/templates/tafseer-source-intake.template.json',
  'content-pipeline/source-intake/templates/hadith-source-intake.template.json',
  'content-pipeline/source-intake/noor-source-candidates.json',
  'content-pipeline/importers/quran/README.md',
  'content-pipeline/importers/quran/samples/quran-import-sample.json',
  'content-pipeline/imported/quran-v0.20/noor-cdn/manifest/noor-quran-import-report.json',
  'content-pipeline/imported/quran-v0.20/noor-cdn/metadata/surah-index.json',
  'content-pipeline/imported/quran-v0.20/audit/noor-quran-import-audit.md',
  'docs/NOOR_MASTER_ROADMAP.md',
  'docs/NOOR_SOURCE_INTAKE.md',
  'docs/NOOR_QURAN_IMPORTER.md',
  'docs/SPRINT_19_SCOPE.md',
  'docs/SPRINT_20_SCOPE.md',
  'docs/LOCAL_TESTING_SPRINT_19.md',
  'docs/LOCAL_TESTING_SPRINT_20.md',
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
  console.error('Missing required NOOR Sprint 0-20 files:');
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
  'noor-quran-importer-v1',
  'source:intake',
  'quran:import',
  'check:quran-import'
]) {
  if (!pipeline.includes(expected)) fail(`content-pipeline.ts missing ${expected}`);
}

const settings = read('apps/web/app/settings/page.tsx');
for (const expected of ['RoadmapControlCard', 'QuranImportCard', 'SourceIntakeCard', 'RuntimeContentSourceCard']) {
  if (!settings.includes(expected)) fail(`settings page must render ${expected}`);
}

const candidates = readJson('content-pipeline/source-intake/noor-source-candidates.json');
const candidateList = Array.isArray(candidates.candidateSources)
  ? candidates.candidateSources
  : Array.isArray(candidates.candidates)
    ? candidates.candidates
    : [];
const candidateDomains = new Set(candidateList.map((candidate) => candidate.domain));
for (const domain of ['quran', 'tafseer', 'hadith']) {
  if (!candidateDomains.has(domain)) fail(`Sprint 19 source intake must include a ${domain} candidate source.`);
}

const report = readJson('content-pipeline/imported/quran-v0.20/noor-cdn/manifest/noor-quran-import-report.json');
if (report.version !== EXPECTED_VERSION || report.importedSurahCount !== 4 || report.importedAyahCount !== 22) {
  fail('Sprint 20 Quran import report has unexpected version/count values. Run pnpm quran:import.');
}
if (report.productionGate?.status !== 'blocked') fail('Sprint 20 Quran import production gate must be blocked.');

const roadmap = read('apps/web/lib/roadmap.ts');
for (const expected of ['currentSprint', 'Sprint 20', 'Sprint 21', 'Quran importer adapter v1']) {
  if (!roadmap.includes(expected)) fail(`roadmap.ts missing ${expected}`);
}

const ci = read('.github/workflows/noor-ci.yml');
for (const expected of [
  'pnpm content:validate',
  'pnpm content:prepare',
  'pnpm cdn:pack',
  'pnpm cdn:verify',
  'pnpm cdn:promote',
  'pnpm check:cdn-promotion',
  'pnpm source:audit',
  'pnpm check:source-audit',
  'pnpm source:intake',
  'pnpm check:source-intake',
  'pnpm quran:import',
  'pnpm check:quran-import',
  'pnpm roadmap:status',
  'pnpm check:roadmap'
]) {
  if (!ci.includes(expected)) fail(`CI workflow missing ${expected}`);
}

const releaseNotes = read('RELEASE_NOTES.md') + read('CHANGELOG.md');
if (!releaseNotes.includes('v0.20.0') || !releaseNotes.includes('Quran importer adapter')) {
  fail('Release notes/changelog must include v0.20.0 Quran importer adapter entry.');
}

console.log('NOOR Sprint 0-20 pack check passed.');
