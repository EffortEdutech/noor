import { existsSync, readFileSync } from 'node:fs';

const MIN_PROMOTION_VERSION = '0.16.0';
const required = [
  'scripts/promote-noor-cdn.mjs',
  'scripts/check-noor-cdn-promotion.mjs',
  'scripts/smoke-noor-cdn.mjs',
  'apps/web/components/CdnPromotionCard.tsx',
  'apps/web/lib/content-pipeline.ts',
  'docs/NOOR_CDN_PROMOTION.md',
  'docs/SPRINT_16_SCOPE.md',
  'docs/LOCAL_TESTING_SPRINT_16.md'
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
  console.error('Missing Sprint 16 CDN promotion files:');
  for (const file of missing) console.error(`- ${file}`);
  process.exit(1);
}

const packageJson = JSON.parse(readFileSync('package.json', 'utf8'));
for (const script of ['cdn:promote', 'check:cdn-promotion', 'cdn:smoke']) {
  if (!packageJson.scripts?.[script]) {
    console.error(`package.json must include ${script} script.`);
    process.exit(1);
  }
}

const noorAppVersion = readNoorAppVersion();
if (compareVersions(noorAppVersion, MIN_PROMOTION_VERSION) < 0) {
  console.error(`CDN promotion support requires NOOR app version ${MIN_PROMOTION_VERSION} or newer. Found ${noorAppVersion}.`);
  process.exit(1);
}

const versionJson = JSON.parse(readFileSync('apps/web/public/version.json', 'utf8'));
if (versionJson.version !== noorAppVersion) {
  console.error(`version.json (${versionJson.version}) must match NOOR_APP_VERSION (${noorAppVersion}).`);
  process.exit(1);
}

const pipeline = readFileSync('apps/web/lib/content-pipeline.ts', 'utf8');
for (const expected of ['NOOR_CDN_PROMOTION', 'cdn:promote', 'noor-cdn.env.local', 'NEXT_PUBLIC_NOOR_DATA_MODE']) {
  if (!pipeline.includes(expected)) {
    console.error(`content-pipeline.ts must include ${expected}.`);
    process.exit(1);
  }
}

const settingsPage = readFileSync('apps/web/app/settings/page.tsx', 'utf8');
if (!settingsPage.includes('CdnPromotionCard')) {
  console.error('Settings page must render the Sprint 16 CDN promotion card.');
  process.exit(1);
}

const promoteScript = readFileSync('scripts/promote-noor-cdn.mjs', 'utf8');
for (const expected of ['NOOR_CDN_PROMOTION_BASE', 'NEXT_PUBLIC_NOOR_QURAN_CDN_BASE', 'manual-apply-after-smoke-pass']) {
  if (!promoteScript.includes(expected)) {
    console.error(`promote-noor-cdn.mjs must include ${expected}.`);
    process.exit(1);
  }
}

const envExample = readFileSync('.env.example', 'utf8');
if (!envExample.includes('Sprint 16 CDN promotion handoff') || !envExample.includes('NOOR_CDN_PROMOTION_BASE')) {
  console.error('.env.example must document Sprint 16 CDN promotion handoff.');
  process.exit(1);
}

const changelog = readFileSync('CHANGELOG.md', 'utf8');
const releaseNotes = readFileSync('RELEASE_NOTES.md', 'utf8');
if (!changelog.includes('v0.16.0') || !releaseNotes.includes('v0.16.0')) {
  console.error('Sprint 16 release metadata must mention v0.16.0.');
  process.exit(1);
}

console.log(`NOOR Sprint 16 CDN promotion check passed for v${noorAppVersion}.`);
