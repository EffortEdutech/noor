import { existsSync, readFileSync } from 'node:fs';

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

const missing = required.filter((file) => !existsSync(file));
if (missing.length > 0) {
  console.error('Missing Sprint 17 source governance files:');
  for (const file of missing) console.error(`- ${file}`);
  process.exit(1);
}

const packageJson = JSON.parse(readFileSync('package.json', 'utf8'));
for (const script of ['source:audit', 'source:gate', 'check:source-audit']) {
  if (!packageJson.scripts?.[script]) {
    console.error(`package.json must include ${script} script.`);
    process.exit(1);
  }
}

const appVersion = readFileSync('apps/web/lib/app-version.ts', 'utf8');
if (!appVersion.includes("NOOR_APP_VERSION = '0.17.0'")) {
  console.error('Sprint 17 must update NOOR app version to 0.17.0.');
  process.exit(1);
}

const versionJson = JSON.parse(readFileSync('apps/web/public/version.json', 'utf8'));
if (versionJson.version !== '0.17.0') {
  console.error('version.json must be updated to 0.17.0.');
  process.exit(1);
}

const pipeline = readFileSync('apps/web/lib/content-pipeline.ts', 'utf8');
for (const expected of ['NOOR_SOURCE_GOVERNANCE', 'source:audit', 'source:gate', 'noor-source-audit.json']) {
  if (!pipeline.includes(expected)) {
    console.error(`content-pipeline.ts must include ${expected}.`);
    process.exit(1);
  }
}

const settingsPage = readFileSync('apps/web/app/settings/page.tsx', 'utf8');
if (!settingsPage.includes('SourceGovernanceCard')) {
  console.error('Settings page must render the Sprint 17 Source Governance card.');
  process.exit(1);
}

const auditScript = readFileSync('scripts/audit-noor-sources.mjs', 'utf8');
for (const expected of ['--require-production', 'noor-source-audit.json', 'not-production-approved']) {
  if (!auditScript.includes(expected)) {
    console.error(`audit-noor-sources.mjs must include ${expected}.`);
    process.exit(1);
  }
}

const registry = JSON.parse(readFileSync('content-pipeline/source/noor-demo-v0.12/manifest/noor-source-registry.json', 'utf8'));
const domains = new Set(registry.sources?.map((source) => source.domain));
for (const domain of ['quran', 'tafseer', 'hadith']) {
  if (!domains.has(domain)) {
    console.error(`Source registry must include ${domain} domain.`);
    process.exit(1);
  }
}

const notApproved = registry.sources.filter((source) => source.approvalStatus !== 'production-approved');
if (notApproved.length === 0) {
  console.error('Sprint 17 expects current demo sources to remain blocked from production.');
  process.exit(1);
}

const ciWorkflow = readFileSync('.github/workflows/noor-ci.yml', 'utf8');
if (!ciWorkflow.includes('pnpm source:audit') || !ciWorkflow.includes('pnpm check:source-audit')) {
  console.error('NOOR CI must run source governance audit checks.');
  process.exit(1);
}

const changelog = readFileSync('CHANGELOG.md', 'utf8');
const releaseNotes = readFileSync('RELEASE_NOTES.md', 'utf8');
if (!changelog.includes('v0.17.0') || !releaseNotes.includes('v0.17.0')) {
  console.error('Sprint 17 release metadata must mention v0.17.0.');
  process.exit(1);
}

console.log('NOOR Sprint 17 source governance check passed.');
