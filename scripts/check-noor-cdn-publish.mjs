import { existsSync, readFileSync } from 'node:fs';

const MIN_CDN_PUBLISH_VERSION = '0.14.0';

const required = [
  'scripts/build-noor-cdn-publish-pack.mjs',
  'scripts/verify-noor-cdn-publish-pack.mjs',
  'scripts/check-noor-cdn-publish.mjs',
  'apps/web/components/CdnPublishCard.tsx',
  'apps/web/lib/content-pipeline.ts',
  'docs/NOOR_CDN_PUBLISHING.md',
  'docs/SPRINT_14_SCOPE.md',
  'docs/LOCAL_TESTING_SPRINT_14.md'
];

function parseVersion(value) {
  return String(value)
    .split('.')
    .map((part) => Number.parseInt(part, 10))
    .map((part) => (Number.isFinite(part) ? part : 0));
}

function compareVersions(left, right) {
  const a = parseVersion(left);
  const b = parseVersion(right);
  const max = Math.max(a.length, b.length);

  for (let index = 0; index < max; index += 1) {
    const diff = (a[index] ?? 0) - (b[index] ?? 0);
    if (diff !== 0) return diff;
  }

  return 0;
}

function readNoorAppVersion() {
  const appVersion = readFileSync('apps/web/lib/app-version.ts', 'utf8');
  const match = appVersion.match(/NOOR_APP_VERSION\s*=\s*['\"]([^'\"]+)['\"]/);

  if (!match?.[1]) {
    console.error('Unable to read NOOR_APP_VERSION from apps/web/lib/app-version.ts.');
    process.exit(1);
  }

  return match[1];
}

const missing = required.filter((file) => !existsSync(file));
if (missing.length > 0) {
  console.error('Missing Sprint 14 CDN publishing files:');
  for (const file of missing) console.error(`- ${file}`);
  process.exit(1);
}

const packageJson = JSON.parse(readFileSync('package.json', 'utf8'));
for (const script of ['cdn:pack', 'cdn:verify', 'check:cdn-publish']) {
  if (!packageJson.scripts?.[script]) {
    console.error(`package.json must include ${script} script.`);
    process.exit(1);
  }
}

const noorAppVersion = readNoorAppVersion();
if (compareVersions(noorAppVersion, MIN_CDN_PUBLISH_VERSION) < 0) {
  console.error(`CDN publish support requires NOOR app version ${MIN_CDN_PUBLISH_VERSION} or newer. Found ${noorAppVersion}.`);
  process.exit(1);
}

const versionJson = JSON.parse(readFileSync('apps/web/public/version.json', 'utf8'));
if (versionJson.version !== noorAppVersion) {
  console.error(`version.json (${versionJson.version}) must match NOOR_APP_VERSION (${noorAppVersion}).`);
  process.exit(1);
}

if (compareVersions(versionJson.version, MIN_CDN_PUBLISH_VERSION) < 0) {
  console.error(`version.json must be ${MIN_CDN_PUBLISH_VERSION} or newer for CDN publishing.`);
  process.exit(1);
}

const settingsPage = readFileSync('apps/web/app/settings/page.tsx', 'utf8');
if (!settingsPage.includes('CdnPublishCard')) {
  console.error('Settings page must render the Sprint 14 CDN publish card.');
  process.exit(1);
}

const pipeline = readFileSync('apps/web/lib/content-pipeline.ts', 'utf8');
if (!pipeline.includes('NOOR_CDN_PUBLISHING') || !pipeline.includes('noor-cdn-gh-pages')) {
  console.error('content-pipeline.ts must expose NOOR_CDN_PUBLISHING metadata.');
  process.exit(1);
}

const changelog = readFileSync('CHANGELOG.md', 'utf8');
const releaseNotes = readFileSync('RELEASE_NOTES.md', 'utf8');
if (!changelog.includes('v0.14.0') || !releaseNotes.includes('v0.14.0')) {
  console.error('Sprint 14 release metadata must mention v0.14.0.');
  process.exit(1);
}

console.log(`NOOR Sprint 14+ CDN publish check passed for v${noorAppVersion}.`);
