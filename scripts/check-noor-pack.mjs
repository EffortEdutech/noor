import { existsSync, readFileSync } from 'node:fs';

const EXPECTED_VERSION = '0.23.0';
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
  'content-pipeline/schemas/noor-source-intake.schema.json',
  'content-pipeline/schemas/noor-quran-import-source.schema.json',
  'content-pipeline/schemas/noor-tafseer-import-source.schema.json',
  'content-pipeline/schemas/noor-hadith-import-source.schema.json',
  'content-pipeline/source-intake/templates/quran-source-intake.template.json',
  'content-pipeline/source-intake/templates/tafseer-source-intake.template.json',
  'content-pipeline/source-intake/templates/hadith-source-intake.template.json',
  'content-pipeline/source-intake/noor-source-candidates.json',
  'content-pipeline/source-gates/quran/quran-production-source-selection.json',
  'content-pipeline/source-gates/quran/audit/noor-quran-source-gate-audit.json',
  'content-pipeline/source-gates/quran/audit/noor-quran-source-gate-audit.md',
  'content-pipeline/importers/quran/README.md',
  'content-pipeline/importers/quran/samples/quran-import-sample.json',
  'content-pipeline/imported/quran-v0.20/noor-cdn/manifest/noor-quran-import-report.json',
  'content-pipeline/imported/quran-v0.20/noor-cdn/metadata/surah-index.json',
  'content-pipeline/imported/quran-v0.20/audit/noor-quran-import-audit.md',
  'content-pipeline/importers/tafseer/README.md',
  'content-pipeline/importers/tafseer/samples/tafseer-import-sample.json',
  'content-pipeline/imported/tafseer-v0.22/noor-cdn/manifest/noor-tafseer-import-report.json',
  'content-pipeline/imported/tafseer-v0.22/noor-cdn/metadata/tafseer-books.json',
  'content-pipeline/imported/tafseer-v0.22/noor-cdn/tafseer/demo-tafseer-import/surahs/001.json',
  'content-pipeline/imported/tafseer-v0.22/audit/noor-tafseer-import-audit.md',
  'content-pipeline/importers/hadith/README.md',
  'content-pipeline/importers/hadith/samples/hadith-import-sample.json',
  'content-pipeline/imported/hadith-v0.23/noor-cdn/manifest/noor-hadith-import-report.json',
  'content-pipeline/imported/hadith-v0.23/noor-cdn/hadith/collections.json',
  'content-pipeline/imported/hadith-v0.23/noor-cdn/hadith/demo-hadith-import/items.json',
  'content-pipeline/imported/hadith-v0.23/audit/noor-hadith-import-audit.md',
  'docs/NOOR_MASTER_ROADMAP.md',
  'docs/NOOR_SOURCE_INTAKE.md',
  'docs/NOOR_QURAN_IMPORTER.md',
  'docs/NOOR_QURAN_SOURCE_GATE.md',
  'docs/NOOR_TAFSEER_IMPORTER.md',
  'docs/NOOR_HADITH_IMPORTER.md',
  'docs/SPRINT_19_SCOPE.md',
  'docs/SPRINT_20_SCOPE.md',
  'docs/SPRINT_21_SCOPE.md',
  'docs/SPRINT_22_SCOPE.md',
  'docs/SPRINT_23_SCOPE.md',
  'docs/LOCAL_TESTING_SPRINT_19.md',
  'docs/LOCAL_TESTING_SPRINT_20.md',
  'docs/LOCAL_TESTING_SPRINT_21.md',
  'docs/LOCAL_TESTING_SPRINT_22.md',
  'docs/LOCAL_TESTING_SPRINT_23.md',
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
  console.error('Missing required NOOR Sprint 0-23 files:');
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
  'noor-quran-importer-v1',
  'noor-tafseer-importer-v1',
  'noor-hadith-importer-v1',
  'source:intake',
  'quran:import',
  'quran:gate',
  'tafseer:import',
  'hadith:import',
  'check:hadith-import'
]) {
  if (!pipeline.includes(expected)) fail(`content-pipeline.ts missing ${expected}`);
}

const settings = read('apps/web/app/settings/page.tsx');
for (const expected of ['RoadmapControlCard', 'QuranSourceGateCard', 'QuranImportCard', 'TafseerImportCard', 'HadithImportCard', 'SourceIntakeCard', 'RuntimeContentSourceCard']) {
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

const sourceGate = readJson('content-pipeline/source-gates/quran/quran-production-source-selection.json');
if (sourceGate.version !== '0.21.0' || sourceGate.selectionStatus !== 'blocked' || sourceGate.approvedForProductionImport !== false) {
  fail('Sprint 21 Quran source gate must be blocked and not production approved.');
}
const sourceGateAudit = readJson('content-pipeline/source-gates/quran/audit/noor-quran-source-gate-audit.json');
if (sourceGateAudit.version !== '0.21.0' || sourceGateAudit.gateStatus !== 'blocked') {
  fail('Sprint 21 Quran source gate audit must be blocked. Run pnpm quran:gate.');
}

const quranReport = readJson('content-pipeline/imported/quran-v0.20/noor-cdn/manifest/noor-quran-import-report.json');
if (quranReport.version !== QURAN_IMPORT_VERSION || quranReport.importedSurahCount !== 4 || quranReport.importedAyahCount !== 22) {
  fail('Sprint 20 Quran import report has unexpected version/count values. Run pnpm quran:import.');
}
if (quranReport.productionGate?.status !== 'blocked') fail('Sprint 20 Quran import production gate must be blocked.');

const tafseerReport = readJson('content-pipeline/imported/tafseer-v0.22/noor-cdn/manifest/noor-tafseer-import-report.json');
if (tafseerReport.version !== TAFSEER_IMPORT_VERSION || tafseerReport.importedBookCount !== 1 || tafseerReport.importedEntryCount !== 3) {
  fail('Sprint 22 Tafseer import report has unexpected version/count values. Run pnpm tafseer:import.');
}
if (tafseerReport.productionGate?.status !== 'blocked') fail('Sprint 22 Tafseer import production gate must be blocked.');

const hadithReport = readJson('content-pipeline/imported/hadith-v0.23/noor-cdn/manifest/noor-hadith-import-report.json');
if (hadithReport.version !== HADITH_IMPORT_VERSION || hadithReport.importedCollectionCount !== 1 || hadithReport.importedItemCount !== 3) {
  fail('Sprint 23 Hadith import report has unexpected version/count values. Run pnpm hadith:import.');
}
if (hadithReport.productionGate?.status !== 'blocked') fail('Sprint 23 Hadith import production gate must be blocked.');

const roadmap = read('apps/web/lib/roadmap.ts');
for (const expected of ['currentSprint', 'Sprint 23', 'Sprint 24', 'Hadith importer adapter v1']) {
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
  'pnpm quran:gate',
  'pnpm check:quran-source-gate',
  'pnpm quran:import',
  'pnpm check:quran-import',
  'pnpm tafseer:import',
  'pnpm check:tafseer-import',
  'pnpm hadith:import',
  'pnpm check:hadith-import',
  'pnpm roadmap:status',
  'pnpm check:roadmap'
]) {
  if (!ci.includes(expected)) fail(`CI workflow missing ${expected}`);
}

const releaseNotes = read('RELEASE_NOTES.md') + read('CHANGELOG.md');
if (!releaseNotes.includes('v0.23.0') || !releaseNotes.includes('Hadith importer adapter v1')) {
  fail('Release notes/changelog must include v0.23.0 Hadith importer adapter v1 entry.');
}

console.log('NOOR Sprint 0-23 pack check passed.');
