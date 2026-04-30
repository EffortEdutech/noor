import { existsSync, readFileSync } from 'node:fs';

const IMPORT_VERSION = '0.20.0';
const MIN_APP_VERSION = '0.20.0';

const required = [
  'scripts/import-noor-quran.mjs',
  'scripts/check-noor-quran-import.mjs',
  'content-pipeline/schemas/noor-quran-import-source.schema.json',
  'content-pipeline/importers/quran/README.md',
  'content-pipeline/importers/quran/samples/quran-import-sample.json',
  'content-pipeline/imported/quran-v0.20/noor-cdn/manifest/noor-quran-import-report.json',
  'content-pipeline/imported/quran-v0.20/noor-cdn/metadata/surah-index.json',
  'content-pipeline/imported/quran-v0.20/noor-cdn/quran/surahs/001.json',
  'content-pipeline/imported/quran-v0.20/noor-cdn/quran/surahs/112.json',
  'content-pipeline/imported/quran-v0.20/noor-cdn/quran/surahs/113.json',
  'content-pipeline/imported/quran-v0.20/noor-cdn/quran/surahs/114.json',
  'content-pipeline/imported/quran-v0.20/audit/noor-quran-import-audit.md',
  'apps/web/components/QuranImportCard.tsx',
  'docs/NOOR_QURAN_IMPORTER.md',
  'docs/SPRINT_20_SCOPE.md',
  'docs/LOCAL_TESTING_SPRINT_20.md'
];

function fail(message) {
  console.error(message);
  process.exit(1);
}

function readJson(file) {
  return JSON.parse(readFileSync(file, 'utf8'));
}

function compareSemver(a, b) {
  const pa = a.split('.').map((part) => Number.parseInt(part, 10));
  const pb = b.split('.').map((part) => Number.parseInt(part, 10));
  for (let i = 0; i < Math.max(pa.length, pb.length); i += 1) {
    const av = pa[i] ?? 0;
    const bv = pb[i] ?? 0;
    if (av > bv) return 1;
    if (av < bv) return -1;
  }
  return 0;
}

function parseVersionFromApp() {
  const source = readFileSync('apps/web/lib/app-version.ts', 'utf8');
  const match = source.match(/NOOR_APP_VERSION\s*=\s*['"]([^'"]+)['"]/);
  return match?.[1] ?? null;
}

const missing = required.filter((file) => !existsSync(file));
if (missing.length > 0) {
  console.error('Missing required NOOR Quran importer files:');
  for (const file of missing) console.error(`- ${file}`);
  process.exit(1);
}

const packageJson = readJson('package.json');
for (const script of ['quran:import', 'check:quran-import']) {
  if (!packageJson.scripts?.[script]) fail(`package.json must include ${script} script.`);
}

const appVersion = parseVersionFromApp();
if (!appVersion || compareSemver(appVersion, MIN_APP_VERSION) < 0) {
  fail(`NOOR app version must be >= ${MIN_APP_VERSION} for Quran importer checks. Current: ${appVersion}.`);
}

const versionJson = readJson('apps/web/public/version.json');
if (versionJson.version !== appVersion) {
  fail(`version.json must match app version ${appVersion}. Current: ${versionJson.version}.`);
}

const sample = readJson('content-pipeline/importers/quran/samples/quran-import-sample.json');
if (sample.adapter !== 'noor-quran-importer-v1') fail('Quran import sample must use noor-quran-importer-v1.');
if (sample.productionApproved !== false || sample.reviewerSignoff !== false) {
  fail('Sprint 20 Quran fixture must remain non-production-approved.');
}
if (sample.sourceCandidateId !== 'quran-production-candidate-placeholder') {
  fail('Quran import sample must reference the Sprint 19 Quran candidate placeholder.');
}

const report = readJson('content-pipeline/imported/quran-v0.20/noor-cdn/manifest/noor-quran-import-report.json');
if (report.version !== IMPORT_VERSION) fail(`Quran import report must be v${IMPORT_VERSION}.`);
if (report.adapterId !== 'noor-quran-importer-v1') fail('Quran import report adapterId mismatch.');
if (report.importedSurahCount !== 4) fail(`Expected 4 imported surahs, got ${report.importedSurahCount}.`);
if (report.importedAyahCount !== 22) fail(`Expected 22 imported ayat, got ${report.importedAyahCount}.`);
if (report.productionReady !== false) fail('Sprint 20 fixture output must not be productionReady.');
if (report.productionGate?.status !== 'blocked') fail('Sprint 20 Quran import production gate must be blocked.');
if (!Array.isArray(report.productionGate?.reasons) || !report.productionGate.reasons.includes('candidate-not-production-approved')) {
  fail('Quran import report must include candidate-not-production-approved gate reason.');
}

const index = readJson('content-pipeline/imported/quran-v0.20/noor-cdn/metadata/surah-index.json');
if (index.surahs?.length !== 4) fail('Imported surah index must contain 4 surahs.');

const seenKeys = new Set();
for (const surah of index.surahs) {
  const file = readJson(`content-pipeline/imported/quran-v0.20/noor-cdn/${surah.route}`);
  if (file.surah.number !== surah.number) fail(`Surah route mismatch for ${surah.route}.`);
  if (file.ayahs.length !== surah.ayahCount) fail(`Ayah count mismatch for ${surah.route}.`);
  for (const ayah of file.ayahs) {
    if (seenKeys.has(ayah.key)) fail(`Duplicate imported ayah key: ${ayah.key}.`);
    seenKeys.add(ayah.key);
    if (!ayah.translations?.en || !ayah.translations?.ms) fail(`Missing en/ms translations for ${ayah.key}.`);
  }
}

const pipeline = readFileSync('apps/web/lib/content-pipeline.ts', 'utf8');
for (const expected of ['NOOR_QURAN_IMPORTER', 'quran:import', 'noor-quran-importer-v1']) {
  if (!pipeline.includes(expected)) fail(`content-pipeline.ts must include ${expected}.`);
}

const settingsPage = readFileSync('apps/web/app/settings/page.tsx', 'utf8');
if (!settingsPage.includes('QuranImportCard')) fail('Settings page must render QuranImportCard.');

const ciWorkflow = readFileSync('.github/workflows/noor-ci.yml', 'utf8');
if (!ciWorkflow.includes('pnpm quran:import') || !ciWorkflow.includes('pnpm check:quran-import')) {
  fail('NOOR CI must run Quran import commands.');
}

console.log(`NOOR Quran importer check passed for import adapter v${IMPORT_VERSION} under NOOR v${appVersion}.`);
