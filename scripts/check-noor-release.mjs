import { readFileSync } from 'node:fs';

const EXPECTED_VERSION = '0.27.12';
const EXPECTED_SPRINT = 'Sprint 27.12';

function fail(message) {
  console.error(message);
  process.exit(1);
}
function read(file) { return readFileSync(file, 'utf8'); }

const appVersionSource = read('apps/web/lib/app-version.ts');
if (!appVersionSource.includes(`NOOR_APP_VERSION = '${EXPECTED_VERSION}'`)) fail(`NOOR release metadata must use v${EXPECTED_VERSION}.`);
if (!appVersionSource.includes(EXPECTED_SPRINT)) fail(`NOOR release metadata must mention ${EXPECTED_SPRINT}.`);
if (!appVersionSource.includes('Release metadata') || !appVersionSource.includes('staging CDN QA')) {
  fail('NOOR release metadata must mention release metadata and staging CDN QA.');
}

const versionJson = JSON.parse(read('apps/web/public/version.json'));
if (versionJson.version !== EXPECTED_VERSION) fail(`version.json must use v${EXPECTED_VERSION}.`);
if (!String(versionJson.label).includes(EXPECTED_SPRINT)) fail(`version.json label must mention ${EXPECTED_SPRINT}.`);

const releaseDocs = read('RELEASE_NOTES.md') + read('CHANGELOG.md') + read('apps/web/lib/release-notes.ts');
for (const expected of [
  '0.27.12',
  'Sprint 27.12',
  'Release metadata',
  'staging CDN QA',
  'production CDN promotion remains blocked'
]) {
  if (!releaseDocs.includes(expected)) fail(`Release docs must include ${expected}.`);
}
if (!releaseDocs.includes('0.26.0') || !releaseDocs.includes('CDN search index')) {
  fail('Release docs must preserve v0.26.0 CDN search index history.');
}
if (!releaseDocs.includes('0.25.0') || !releaseDocs.includes('Production CDN v1 promotion')) {
  fail('Release docs must preserve v0.25.0 Production CDN v1 promotion history.');
}

console.log(`NOOR release metadata check passed for v${EXPECTED_VERSION}.`);
