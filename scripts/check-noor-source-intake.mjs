import { existsSync, readFileSync } from 'node:fs';

const MIN_SOURCE_INTAKE_VERSION = '0.19.0';
const required = [
  'scripts/validate-noor-source-intake.mjs',
  'scripts/check-noor-source-intake.mjs',
  'apps/web/components/SourceIntakeCard.tsx',
  'apps/web/lib/content-pipeline.ts',
  'apps/web/app/settings/page.tsx',
  'content-pipeline/source-intake/templates/quran-source-intake.template.json',
  'content-pipeline/source-intake/templates/tafseer-source-intake.template.json',
  'content-pipeline/source-intake/templates/hadith-source-intake.template.json',
  'content-pipeline/source-intake/noor-source-candidates.json',
  'content-pipeline/schemas/noor-source-intake.schema.json',
  'content-pipeline/source-intake/audit/noor-source-intake-audit.json',
  'content-pipeline/source-intake/audit/noor-source-intake-audit.md',
  'docs/NOOR_SOURCE_INTAKE.md',
  'docs/SPRINT_19_SCOPE.md',
  'docs/LOCAL_TESTING_SPRINT_19.md'
];

function fail(message) {
  console.error(message);
  process.exit(1);
}

function parseSemver(version) {
  const match = String(version).match(/^(\d+)\.(\d+)\.(\d+)$/);
  if (!match) return null;
  return match.slice(1).map((part) => Number(part));
}

function compareSemver(a, b) {
  const parsedA = parseSemver(a);
  const parsedB = parseSemver(b);
  if (!parsedA || !parsedB) return Number.NaN;
  for (let index = 0; index < 3; index += 1) {
    if (parsedA[index] > parsedB[index]) return 1;
    if (parsedA[index] < parsedB[index]) return -1;
  }
  return 0;
}

const missing = required.filter((file) => !existsSync(file));
if (missing.length > 0) {
  console.error('Missing Sprint 19 source intake files. Run pnpm source:intake before pnpm check:source-intake if audit files are missing.');
  for (const file of missing) console.error(`- ${file}`);
  process.exit(1);
}

const packageJson = JSON.parse(readFileSync('package.json', 'utf8'));
for (const script of ['source:intake', 'check:source-intake']) {
  if (!packageJson.scripts?.[script]) fail(`package.json must include ${script} script.`);
}

const appVersionSource = readFileSync('apps/web/lib/app-version.ts', 'utf8');
const appVersionMatch = appVersionSource.match(/NOOR_APP_VERSION\s*=\s*['"]([^'"]+)['"]/);
if (!appVersionMatch) fail('apps/web/lib/app-version.ts must export NOOR_APP_VERSION.');
const appVersion = appVersionMatch[1];
if (compareSemver(appVersion, MIN_SOURCE_INTAKE_VERSION) < 0) {
  fail(`Source intake requires NOOR app version >= ${MIN_SOURCE_INTAKE_VERSION}. Current: ${appVersion}.`);
}

const versionJson = JSON.parse(readFileSync('apps/web/public/version.json', 'utf8'));
if (versionJson.version !== appVersion) fail(`version.json version (${versionJson.version}) must match NOOR_APP_VERSION (${appVersion}).`);

const pipeline = readFileSync('apps/web/lib/content-pipeline.ts', 'utf8');
for (const expected of ['NOOR_SOURCE_INTAKE', 'source:intake', 'check:source-intake', 'noor-source-intake-audit.json']) {
  if (!pipeline.includes(expected)) fail(`content-pipeline.ts must include ${expected}.`);
}

const settingsPage = readFileSync('apps/web/app/settings/page.tsx', 'utf8');
if (!settingsPage.includes('SourceIntakeCard')) fail('Settings page must render the Sprint 19 Source Intake card.');

const validator = readFileSync('scripts/validate-noor-source-intake.mjs', 'utf8');
for (const expected of ['REQUIRED_FIELDS', 'productionGate', 'noor-source-intake-audit.json']) {
  if (!validator.includes(expected)) fail(`validate-noor-source-intake.mjs must include ${expected}.`);
}

const registry = JSON.parse(readFileSync('content-pipeline/source-intake/noor-source-candidates.json', 'utf8'));
const domains = new Set(registry.candidateSources?.map((source) => source.domain));
for (const domain of ['quran', 'tafseer', 'hadith']) {
  if (!domains.has(domain)) fail(`Source candidate registry must include ${domain} domain.`);
}

const approved = registry.candidateSources.filter((source) => source.approvalStatus === 'production-approved');
if (approved.length > 0) {
  fail('Sprint 19 candidate placeholders must not be production-approved yet.');
}

const audit = JSON.parse(readFileSync('content-pipeline/source-intake/audit/noor-source-intake-audit.json', 'utf8'));
if (audit.registryVersion !== '0.19.0' || audit.candidateCount < 3 || audit.templateCount < 3) {
  fail('Source intake audit must identify v0.19.0 with at least three templates and three candidates.');
}

const ciWorkflow = readFileSync('.github/workflows/noor-ci.yml', 'utf8');
if (!ciWorkflow.includes('pnpm source:intake') || !ciWorkflow.includes('pnpm check:source-intake')) {
  fail('NOOR CI must run source intake validation checks.');
}

console.log(`NOOR Sprint 19 source intake check passed for v${appVersion}.`);
