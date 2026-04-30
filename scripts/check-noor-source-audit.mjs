import { existsSync, readFileSync } from 'node:fs';

const MIN_SOURCE_GOVERNANCE_VERSION = '0.17.0';

const required = [
  'scripts/audit-noor-sources.mjs',
  'scripts/check-noor-source-audit.mjs',
  'apps/web/components/SourceGovernanceCard.tsx',
  'apps/web/lib/content-pipeline.ts',
  'apps/web/app/settings/page.tsx',
  'content-pipeline/source/noor-demo-v0.12/manifest/noor-source-registry.json',
  'docs/NOOR_SOURCE_GOVERNANCE.md',
  'docs/SPRINT_17_SCOPE.md',
  'docs/LOCAL_TESTING_SPRINT_17.md'
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
  console.error('Missing Sprint 17 source governance files:');
  for (const file of missing) console.error(`- ${file}`);
  process.exit(1);
}

const packageJson = JSON.parse(readFileSync('package.json', 'utf8'));
for (const script of ['source:audit', 'source:gate', 'check:source-audit']) {
  if (!packageJson.scripts?.[script]) {
    fail(`package.json must include ${script} script.`);
  }
}

const appVersionSource = readFileSync('apps/web/lib/app-version.ts', 'utf8');
const appVersionMatch = appVersionSource.match(/NOOR_APP_VERSION\s*=\s*['"]([^'"]+)['"]/);
if (!appVersionMatch) {
  fail('apps/web/lib/app-version.ts must export NOOR_APP_VERSION.');
}

const appVersion = appVersionMatch[1];
if (compareSemver(appVersion, MIN_SOURCE_GOVERNANCE_VERSION) < 0) {
  fail(`Source governance requires NOOR app version >= ${MIN_SOURCE_GOVERNANCE_VERSION}. Current: ${appVersion}.`);
}

const versionJson = JSON.parse(readFileSync('apps/web/public/version.json', 'utf8'));
if (versionJson.version !== appVersion) {
  fail(`version.json version (${versionJson.version}) must match NOOR_APP_VERSION (${appVersion}).`);
}

const pipeline = readFileSync('apps/web/lib/content-pipeline.ts', 'utf8');
for (const expected of ['NOOR_SOURCE_GOVERNANCE', 'source:audit', 'source:gate', 'noor-source-audit.json']) {
  if (!pipeline.includes(expected)) {
    fail(`content-pipeline.ts must include ${expected}.`);
  }
}

const settingsPage = readFileSync('apps/web/app/settings/page.tsx', 'utf8');
if (!settingsPage.includes('SourceGovernanceCard')) {
  fail('Settings page must render the Sprint 17 Source Governance card.');
}

const auditScript = readFileSync('scripts/audit-noor-sources.mjs', 'utf8');
for (const expected of ['--require-production', 'noor-source-audit.json', 'not-production-approved']) {
  if (!auditScript.includes(expected)) {
    fail(`audit-noor-sources.mjs must include ${expected}.`);
  }
}

const registry = JSON.parse(readFileSync('content-pipeline/source/noor-demo-v0.12/manifest/noor-source-registry.json', 'utf8'));
const domains = new Set(registry.sources?.map((source) => source.domain));
for (const domain of ['quran', 'tafseer', 'hadith']) {
  if (!domains.has(domain)) {
    fail(`Source registry must include ${domain} domain.`);
  }
}

const notApproved = registry.sources.filter((source) => source.approvalStatus !== 'production-approved');
if (notApproved.length === 0) {
  fail('Sprint 17 expects current demo sources to remain blocked from production.');
}

const ciWorkflow = readFileSync('.github/workflows/noor-ci.yml', 'utf8');
if (!ciWorkflow.includes('pnpm source:audit') || !ciWorkflow.includes('pnpm check:source-audit')) {
  fail('NOOR CI must run source governance audit checks.');
}

console.log(`NOOR Sprint 17+ source governance check passed for v${appVersion}.`);
