import { readFileSync } from 'node:fs';

const EXPECTED_VERSION = '0.21.0';

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
if (!appVersionSource.includes('Quran production source selection gate')) {
  fail('NOOR release metadata must mention Sprint 21 Quran production source selection gate.');
}

const versionJson = JSON.parse(read('apps/web/public/version.json'));
if (versionJson.version !== EXPECTED_VERSION) {
  fail(`version.json must use v${EXPECTED_VERSION}.`);
}

const releaseNotes = read('RELEASE_NOTES.md');
const changelog = read('CHANGELOG.md');
for (const content of [releaseNotes, changelog]) {
  if (!content.includes('v0.21.0')) fail('Release docs must include v0.21.0.');
  if (!content.includes('Quran production source selection gate')) fail('Release docs must mention Quran production source selection gate.');
}

const releaseNotesTs = read('apps/web/lib/release-notes.ts');
if (!releaseNotesTs.includes('0.21.0') || !releaseNotesTs.includes('Quran production source selection gate')) {
  fail('UI release notes must include v0.21.0 Quran production source selection gate.');
}

const ci = read('.github/workflows/noor-ci.yml');
if (!ci.includes('pnpm check:quran-source-gate')) {
  fail('CI must include check:quran-source-gate for Sprint 21.');
}

console.log(`NOOR release metadata check passed for v${EXPECTED_VERSION}.`);
