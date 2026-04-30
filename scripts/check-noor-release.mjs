import { readFileSync } from 'node:fs';

const EXPECTED_VERSION = '0.24.0';

function fail(message) {
  console.error(message);
  process.exit(1);
}

function read(file) {
  return readFileSync(file, 'utf8');
}

const appVersionSource = read('apps/web/lib/app-version.ts');
if (!appVersionSource.includes(`NOOR_APP_VERSION = '${EXPECTED_VERSION}'`)) {
  fail(`NOOR release metadata must use v${EXPECTED_VERSION}.`);
}
if (!appVersionSource.includes('Scholarly review console')) {
  fail('NOOR release metadata must mention Sprint 24 Scholarly review console.');
}

const versionJson = JSON.parse(read('apps/web/public/version.json'));
if (versionJson.version !== EXPECTED_VERSION) {
  fail(`version.json must use v${EXPECTED_VERSION}.`);
}

const releaseNotes = read('RELEASE_NOTES.md');
const changelog = read('CHANGELOG.md');
for (const content of [releaseNotes, changelog]) {
  if (!content.includes('v0.24.0')) fail('Release docs must include v0.24.0.');
  if (!content.includes('Scholarly review console')) fail('Release docs must mention Scholarly review console.');
}

const releaseNotesTs = read('apps/web/lib/release-notes.ts');
if (!releaseNotesTs.includes('0.24.0') || !releaseNotesTs.includes('Scholarly review console')) {
  fail('UI release notes must include v0.24.0 Scholarly review console.');
}

const ci = read('.github/workflows/noor-ci.yml');
if (!ci.includes('pnpm check:review-console')) {
  fail('CI must include check:review-console for Sprint 24.');
}

console.log(`NOOR release metadata check passed for v${EXPECTED_VERSION}.`);
