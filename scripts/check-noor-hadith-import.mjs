import { existsSync, readFileSync } from 'node:fs';

const IMPORT_VERSION = '0.23.0';
const MIN_APP_VERSION = '0.23.0';

const required = [
  'scripts/import-noor-hadith.mjs',
  'scripts/check-noor-hadith-import.mjs',
  'content-pipeline/schemas/noor-hadith-import-source.schema.json',
  'content-pipeline/importers/hadith/README.md',
  'content-pipeline/importers/hadith/samples/hadith-import-sample.json',
  'content-pipeline/imported/hadith-v0.23/noor-cdn/manifest/noor-hadith-import-report.json',
  'content-pipeline/imported/hadith-v0.23/noor-cdn/hadith/collections.json',
  'content-pipeline/imported/hadith-v0.23/noor-cdn/hadith/demo-hadith-import/items.json',
  'content-pipeline/imported/hadith-v0.23/audit/noor-hadith-import-audit.md',
  'apps/web/components/HadithImportCard.tsx',
  'docs/NOOR_HADITH_IMPORTER.md',
  'docs/SPRINT_23_SCOPE.md',
  'docs/LOCAL_TESTING_SPRINT_23.md'
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
  console.error('Missing required NOOR Hadith importer files:');
  for (const file of missing) console.error(`- ${file}`);
  process.exit(1);
}

const packageJson = readJson('package.json');
for (const script of ['hadith:import', 'check:hadith-import']) {
  if (!packageJson.scripts?.[script]) fail(`package.json must include ${script} script.`);
}

const appVersion = parseVersionFromApp();
if (!appVersion || compareSemver(appVersion, MIN_APP_VERSION) < 0) {
  fail(`NOOR app version must be >= ${MIN_APP_VERSION} for hadith importer checks. Current: ${appVersion}.`);
}

const versionJson = readJson('apps/web/public/version.json');
if (versionJson.version !== appVersion) {
  fail(`version.json must match app version ${appVersion}. Current: ${versionJson.version}.`);
}

const sample = readJson('content-pipeline/importers/hadith/samples/hadith-import-sample.json');
if (sample.adapter !== 'noor-hadith-importer-v1') fail('Hadith import sample must use noor-hadith-importer-v1.');
if (sample.productionApproved !== false || sample.reviewerSignoff !== false) {
  fail('Sprint 23 Hadith fixture must remain non-production-approved.');
}
if (sample.sourceCandidateId !== 'hadith-production-candidate-placeholder') {
  fail('Hadith import sample must reference the Sprint 19 hadith candidate placeholder.');
}

const report = readJson('content-pipeline/imported/hadith-v0.23/noor-cdn/manifest/noor-hadith-import-report.json');
if (report.version !== IMPORT_VERSION) fail(`Hadith import report must be v${IMPORT_VERSION}.`);
if (report.adapterId !== 'noor-hadith-importer-v1') fail('Hadith import report adapterId mismatch.');
if (report.importedCollectionCount !== 1) fail(`Expected 1 imported hadith collection, got ${report.importedCollectionCount}.`);
if (report.importedItemCount !== 3) fail(`Expected 3 imported hadith items, got ${report.importedItemCount}.`);
if (report.productionReady !== false) fail('Sprint 23 fixture output must not be productionReady.');
if (report.productionGate?.status !== 'blocked') fail('Sprint 23 Hadith import production gate must be blocked.');
if (!Array.isArray(report.productionGate?.reasons) || !report.productionGate.reasons.includes('candidate-not-production-approved')) {
  fail('Hadith import report must include candidate-not-production-approved gate reason.');
}

const collections = readJson('content-pipeline/imported/hadith-v0.23/noor-cdn/hadith/collections.json');
if (!Array.isArray(collections) || collections.length !== 1) fail('Imported hadith collection index must contain 1 collection.');
if (collections[0].id !== 'demo-hadith-import') fail('Imported hadith collection id mismatch.');

const items = readJson('content-pipeline/imported/hadith-v0.23/noor-cdn/hadith/demo-hadith-import/items.json');
if (!Array.isArray(items) || items.length !== 3) fail('Imported hadith route must contain 3 items.');
const seenIds = new Set();
const seenNumbers = new Set();
for (const item of items) {
  if (seenIds.has(item.id)) fail(`Duplicate hadith item id: ${item.id}.`);
  if (seenNumbers.has(item.number)) fail(`Duplicate hadith item number: ${item.number}.`);
  seenIds.add(item.id);
  seenNumbers.add(item.number);
  if (item.collectionId !== 'demo-hadith-import') fail(`Unexpected collectionId for ${item.id}.`);
  if (!item.translations || !item.translations.en) fail(`Missing English translation for ${item.id}.`);
  if (!item.sourceLabel) fail(`Missing sourceLabel for ${item.id}.`);
  if (!item.source?.candidateId || !item.source?.attributionText) fail(`Missing hadith source metadata for ${item.id}.`);
  if (!Array.isArray(item.tags)) fail(`Missing hadith tags array for ${item.id}.`);
}

const pipeline = readFileSync('apps/web/lib/content-pipeline.ts', 'utf8');
for (const expected of ['NOOR_HADITH_IMPORTER', 'hadith:import', 'noor-hadith-importer-v1']) {
  if (!pipeline.includes(expected)) fail(`content-pipeline.ts must include ${expected}.`);
}

const settingsPage = readFileSync('apps/web/app/settings/page.tsx', 'utf8');
if (!settingsPage.includes('HadithImportCard')) fail('Settings page must render HadithImportCard.');

const ciWorkflow = readFileSync('.github/workflows/noor-ci.yml', 'utf8');
if (!ciWorkflow.includes('pnpm hadith:import') || !ciWorkflow.includes('pnpm check:hadith-import')) {
  fail('NOOR CI must run Hadith import commands.');
}

console.log(`NOOR Hadith importer check passed for import adapter v${IMPORT_VERSION} under NOOR v${appVersion}.`);
