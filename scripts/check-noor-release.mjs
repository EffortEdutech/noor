import { readFileSync } from 'node:fs';

const EXPECTED_VERSION = '0.26.0';

function fail(message) {
  console.error(message);
  process.exit(1);
}
function read(file) { return readFileSync(file, 'utf8'); }

const appVersionSource = read('apps/web/lib/app-version.ts');
if (!appVersionSource.includes(`NOOR_APP_VERSION = '${EXPECTED_VERSION}'`)) fail(`NOOR release metadata must use v${EXPECTED_VERSION}.`);
if (!appVersionSource.includes('Sprint 26')) fail('NOOR release metadata must mention Sprint 26.');
if (!appVersionSource.includes('CDN search index')) fail('NOOR release metadata must mention CDN search index.');

const versionJson = JSON.parse(read('apps/web/public/version.json'));
if (versionJson.version !== EXPECTED_VERSION) fail(`version.json must use v${EXPECTED_VERSION}.`);
if (!String(versionJson.label).includes('Sprint 26')) fail('version.json label must mention Sprint 26.');

const releaseDocs = read('RELEASE_NOTES.md') + read('CHANGELOG.md') + read('apps/web/lib/release-notes.ts');
if (!releaseDocs.includes('0.26.0')) fail('Release docs must include v0.26.0.');
if (!releaseDocs.includes('CDN search index')) fail('Release docs must mention CDN search index.');
if (!releaseDocs.includes('0.25.0') || !releaseDocs.includes('Production CDN v1 promotion')) {
  fail('Release docs must preserve v0.25.0 Production CDN v1 promotion history.');
}

console.log(`NOOR release metadata check passed for v${EXPECTED_VERSION}.`);
