import { existsSync, readFileSync } from 'node:fs';

const GATE_VERSION = '0.21.0';
const required = [
  'scripts/validate-noor-quran-source-gate.mjs',
  'scripts/check-noor-quran-source-gate.mjs',
  'content-pipeline/source-gates/quran/quran-production-source-selection.json',
  'content-pipeline/source-gates/quran/audit/noor-quran-source-gate-audit.json',
  'content-pipeline/source-gates/quran/audit/noor-quran-source-gate-audit.md',
  'apps/web/components/QuranSourceGateCard.tsx',
  'apps/web/lib/content-pipeline.ts',
  'apps/web/app/settings/page.tsx',
  'docs/NOOR_QURAN_SOURCE_GATE.md',
  'docs/SPRINT_21_SCOPE.md',
  'docs/LOCAL_TESTING_SPRINT_21.md'
];

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

function parseAppVersion() {
  const match = read('apps/web/lib/app-version.ts').match(/NOOR_APP_VERSION\s*=\s*['"]([^'"]+)['"]/);
  return match?.[1] ?? null;
}

function parseSemver(version) {
  const match = String(version ?? '').match(/^(\d+)\.(\d+)\.(\d+)$/);
  if (!match) return null;
  return match.slice(1).map(Number);
}

function isAtLeast(actual, minimum) {
  const a = parseSemver(actual);
  const m = parseSemver(minimum);
  if (!a || !m) return false;

  for (let index = 0; index < 3; index += 1) {
    if (a[index] > m[index]) return true;
    if (a[index] < m[index]) return false;
  }

  return true;
}

const missing = required.filter((file) => !existsSync(file));
if (missing.length > 0) {
  console.error('Missing required NOOR Sprint 21 Quran source gate files:');
  for (const file of missing) console.error(`- ${file}`);
  process.exit(1);
}

const pkg = readJson('package.json');
for (const script of ['quran:gate', 'check:quran-source-gate']) {
  if (!pkg.scripts?.[script]) fail(`package.json must include ${script} script.`);
}

const appVersion = parseAppVersion();
if (!isAtLeast(appVersion, GATE_VERSION)) {
  fail(`NOOR app version must be ${GATE_VERSION} or newer for the Quran source gate. Current: ${appVersion}.`);
}

const versionJson = readJson('apps/web/public/version.json');
if (!isAtLeast(versionJson.version, GATE_VERSION)) {
  fail(`version.json must be ${GATE_VERSION} or newer for the Quran source gate. Current: ${versionJson.version}.`);
}

const selection = readJson('content-pipeline/source-gates/quran/quran-production-source-selection.json');
if (selection.version !== GATE_VERSION) fail(`Quran source selection record must remain v${GATE_VERSION}.`);
if (selection.domain !== 'quran') fail('Quran source selection record must use domain quran.');
if (selection.selectedCandidateId !== 'quran-production-candidate-placeholder') fail('Sprint 21 must still point to the Quran placeholder until a real source is manually selected.');
if (selection.selectionStatus !== 'blocked') fail('Sprint 21 default Quran source selection must remain blocked.');
if (selection.approvedForProductionImport !== false) fail('Sprint 21 must not approve production Quran import by default.');
if (!Array.isArray(selection.gateRequirements) || selection.gateRequirements.length < 6) fail('Quran source selection must list gate requirements.');

const audit = readJson('content-pipeline/source-gates/quran/audit/noor-quran-source-gate-audit.json');
if (audit.version !== GATE_VERSION) fail(`Quran source gate audit must remain v${GATE_VERSION}.`);
if (audit.gateStatus !== 'blocked') fail('Sprint 21 Quran source gate must remain blocked until real source approval.');
if (audit.approvedForProductionImport !== false) fail('Sprint 21 audit must not approve production import.');
for (const reason of ['source-url-missing', 'license-not-approved', 'reviewer-signoff-missing', 'candidate-not-production-approved']) {
  if (!audit.failedReasons?.includes(reason)) fail(`Quran source gate audit must include ${reason}.`);
}

const validator = read('scripts/validate-noor-quran-source-gate.mjs');
for (const expected of ['quran-production-source-selection.json', 'gateRequirements', 'reviewer-signoff-missing']) {
  if (!validator.includes(expected)) fail(`validate-noor-quran-source-gate.mjs must include ${expected}.`);
}

const pipeline = read('apps/web/lib/content-pipeline.ts');
for (const expected of ['NOOR_QURAN_SOURCE_GATE', 'quran:gate', 'check:quran-source-gate']) {
  if (!pipeline.includes(expected)) fail(`content-pipeline.ts must include ${expected}.`);
}

const settings = read('apps/web/app/settings/page.tsx');
if (!settings.includes('QuranSourceGateCard')) fail('Settings page must render QuranSourceGateCard.');

const ci = read('.github/workflows/noor-ci.yml');
if (!ci.includes('pnpm quran:gate') || !ci.includes('pnpm check:quran-source-gate')) {
  fail('NOOR CI must run Quran source gate checks.');
}

const releaseDocs = read('RELEASE_NOTES.md') + read('CHANGELOG.md');
if (!releaseDocs.includes('v0.21.0') || !releaseDocs.includes('Quran production source selection gate')) {
  fail('Release docs must include v0.21.0 Quran production source selection gate.');
}

console.log(`NOOR Sprint 21 Quran source gate check passed for gate v${GATE_VERSION} under NOOR v${appVersion}.`);
