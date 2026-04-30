import { existsSync, readFileSync } from 'node:fs';

const IMPORT_VERSION = '0.22.0';
const MIN_APP_VERSION = '0.22.0';

const required = [
  'scripts/import-noor-tafseer.mjs',
  'scripts/check-noor-tafseer-import.mjs',
  'content-pipeline/schemas/noor-tafseer-import-source.schema.json',
  'content-pipeline/importers/tafseer/README.md',
  'content-pipeline/importers/tafseer/samples/tafseer-import-sample.json',
  'content-pipeline/imported/tafseer-v0.22/noor-cdn/manifest/noor-tafseer-import-report.json',
  'content-pipeline/imported/tafseer-v0.22/noor-cdn/metadata/tafseer-books.json',
  'content-pipeline/imported/tafseer-v0.22/noor-cdn/tafseer/demo-tafseer-import/surahs/001.json',
  'content-pipeline/imported/tafseer-v0.22/audit/noor-tafseer-import-audit.md',
  'apps/web/components/TafseerImportCard.tsx',
  'docs/NOOR_TAFSEER_IMPORTER.md',
  'docs/SPRINT_22_SCOPE.md',
  'docs/LOCAL_TESTING_SPRINT_22.md'
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
  console.error('Missing required NOOR Tafseer importer files:');
  for (const file of missing) console.error(`- ${file}`);
  process.exit(1);
}

const packageJson = readJson('package.json');
for (const script of ['tafseer:import', 'check:tafseer-import']) {
  if (!packageJson.scripts?.[script]) fail(`package.json must include ${script} script.`);
}

const appVersion = parseVersionFromApp();
if (!appVersion || compareSemver(appVersion, MIN_APP_VERSION) < 0) {
  fail(`NOOR app version must be >= ${MIN_APP_VERSION} for tafseer importer checks. Current: ${appVersion}.`);
}

const versionJson = readJson('apps/web/public/version.json');
if (versionJson.version !== appVersion) {
  fail(`version.json must match app version ${appVersion}. Current: ${versionJson.version}.`);
}

const sample = readJson('content-pipeline/importers/tafseer/samples/tafseer-import-sample.json');
if (sample.adapter !== 'noor-tafseer-importer-v1') fail('Tafseer import sample must use noor-tafseer-importer-v1.');
if (sample.productionApproved !== false || sample.reviewerSignoff !== false) {
  fail('Sprint 22 Tafseer fixture must remain non-production-approved.');
}
if (sample.sourceCandidateId !== 'tafseer-production-candidate-placeholder') {
  fail('Tafseer import sample must reference the Sprint 19 tafseer candidate placeholder.');
}

const report = readJson('content-pipeline/imported/tafseer-v0.22/noor-cdn/manifest/noor-tafseer-import-report.json');
if (report.version !== IMPORT_VERSION) fail(`Tafseer import report must be v${IMPORT_VERSION}.`);
if (report.adapterId !== 'noor-tafseer-importer-v1') fail('Tafseer import report adapterId mismatch.');
if (report.importedBookCount !== 1) fail(`Expected 1 imported tafseer book, got ${report.importedBookCount}.`);
if (report.importedSurahCount !== 1) fail(`Expected 1 imported tafseer surah, got ${report.importedSurahCount}.`);
if (report.importedEntryCount !== 3) fail(`Expected 3 imported tafseer entries, got ${report.importedEntryCount}.`);
if (report.productionReady !== false) fail('Sprint 22 fixture output must not be productionReady.');
if (report.productionGate?.status !== 'blocked') fail('Sprint 22 Tafseer import production gate must be blocked.');
if (!Array.isArray(report.productionGate?.reasons) || !report.productionGate.reasons.includes('candidate-not-production-approved')) {
  fail('Tafseer import report must include candidate-not-production-approved gate reason.');
}

const index = readJson('content-pipeline/imported/tafseer-v0.22/noor-cdn/metadata/tafseer-books.json');
if (index.books?.length !== 1) fail('Imported tafseer books index must contain 1 book.');
if (index.books[0].bookId !== 'demo-tafseer-import') fail('Imported tafseer book id mismatch.');

const entries = readJson('content-pipeline/imported/tafseer-v0.22/noor-cdn/tafseer/demo-tafseer-import/surahs/001.json');
if (!Array.isArray(entries) || entries.length !== 3) fail('Imported tafseer surah route must contain 3 entries.');
const seenIds = new Set();
for (const entry of entries) {
  if (seenIds.has(entry.id)) fail(`Duplicate tafseer entry id: ${entry.id}.`);
  seenIds.add(entry.id);
  if (entry.bookId !== 'demo-tafseer-import') fail(`Unexpected tafseer bookId for ${entry.id}.`);
  if (entry.surah !== 1) fail(`Unexpected tafseer surah for ${entry.id}.`);
  if (!entry.title || !entry.body) fail(`Missing tafseer title/body for ${entry.id}.`);
  if (!entry.source?.candidateId || !entry.source?.attributionText) fail(`Missing tafseer source metadata for ${entry.id}.`);
  if (entry.fromAyah > entry.toAyah) fail(`Invalid tafseer ayah range for ${entry.id}.`);
}

const pipeline = readFileSync('apps/web/lib/content-pipeline.ts', 'utf8');
for (const expected of ['NOOR_TAFSEER_IMPORTER', 'tafseer:import', 'noor-tafseer-importer-v1']) {
  if (!pipeline.includes(expected)) fail(`content-pipeline.ts must include ${expected}.`);
}

const settingsPage = readFileSync('apps/web/app/settings/page.tsx', 'utf8');
if (!settingsPage.includes('TafseerImportCard')) fail('Settings page must render TafseerImportCard.');

const ciWorkflow = readFileSync('.github/workflows/noor-ci.yml', 'utf8');
if (!ciWorkflow.includes('pnpm tafseer:import') || !ciWorkflow.includes('pnpm check:tafseer-import')) {
  fail('NOOR CI must run Tafseer import commands.');
}

console.log(`NOOR Tafseer importer check passed for import adapter v${IMPORT_VERSION} under NOOR v${appVersion}.`);
