import { readFileSync } from 'node:fs';

const EXPECTED_VERSION = '0.22.0';

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
if (!appVersionSource.includes('Tafseer importer adapter v1')) {
  fail('NOOR release metadata must mention Sprint 22 Tafseer importer adapter v1.');
}

const versionJson = JSON.parse(read('apps/web/public/version.json'));
if (versionJson.version !== EXPECTED_VERSION) {
  fail(`version.json must use v${EXPECTED_VERSION}.`);
}

const releaseNotes = read('RELEASE_NOTES.md');
const changelog = read('CHANGELOG.md');
for (const content of [releaseNotes, changelog]) {
  if (!content.includes('v0.22.0')) fail('Release docs must include v0.22.0.');
  if (!content.includes('Tafseer importer adapter v1')) fail('Release docs must mention Tafseer importer adapter v1.');
}

const releaseNotesTs = read('apps/web/lib/release-notes.ts');
if (!releaseNotesTs.includes('0.22.0') || !releaseNotesTs.includes('Tafseer importer adapter v1')) {
  fail('UI release notes must include v0.22.0 Tafseer importer adapter v1.');
}

const ci = read('.github/workflows/noor-ci.yml');
if (!ci.includes('pnpm check:tafseer-import')) {
  fail('CI must include check:tafseer-import for Sprint 22.');
}

console.log(`NOOR release metadata check passed for v${EXPECTED_VERSION}.`);
