import { readFileSync } from 'node:fs';

const EXPECTED_VERSION = '0.25.0';

function fail(message) {
  console.error(message);
  process.exit(1);
}
function read(file) { return readFileSync(file, 'utf8'); }

const appVersionSource = read('apps/web/lib/app-version.ts');
if (!appVersionSource.includes(`NOOR_APP_VERSION = '${EXPECTED_VERSION}'`)) fail(`NOOR release metadata must use v${EXPECTED_VERSION}.`);
if (!appVersionSource.includes('Production CDN v1 promotion')) fail('NOOR release metadata must mention Sprint 25 Production CDN v1 promotion.');

const versionJson = JSON.parse(read('apps/web/public/version.json'));
if (versionJson.version !== EXPECTED_VERSION) fail(`version.json must use v${EXPECTED_VERSION}.`);

const releaseDocs = read('RELEASE_NOTES.md') + read('CHANGELOG.md') + read('apps/web/lib/release-notes.ts');
if (!releaseDocs.includes('0.25.0')) fail('Release docs must include v0.25.0.');
if (!releaseDocs.includes('Production CDN v1 promotion')) fail('Release docs must mention Production CDN v1 promotion.');

const ci = read('.github/workflows/noor-ci.yml');
if (!ci.includes('pnpm check:production-promotion')) fail('CI must include check:production-promotion for Sprint 25.');

console.log(`NOOR release metadata check passed for v${EXPECTED_VERSION}.`);
