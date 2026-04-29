import { existsSync, readFileSync } from 'node:fs';

const required = [
  'apps/web/lib/app-version.ts',
  'apps/web/public/version.json',
  'apps/web/lib/release-notes.ts',
  'apps/web/components/ReleaseNotesCard.tsx',
  'apps/web/app/changelog/page.tsx',
  'CHANGELOG.md',
  'RELEASE_NOTES.md',
  '.github/workflows/noor-ci.yml',
  '.github/workflows/noor-release.yml'
];

const missing = required.filter((file) => !existsSync(file));
if (missing.length > 0) {
  console.error('Missing release files:');
  for (const file of missing) console.error(`- ${file}`);
  process.exit(1);
}

const appVersionTs = readFileSync('apps/web/lib/app-version.ts', 'utf8');
const versionJson = JSON.parse(readFileSync('apps/web/public/version.json', 'utf8'));
const changelog = readFileSync('CHANGELOG.md', 'utf8');
const releaseNotes = readFileSync('RELEASE_NOTES.md', 'utf8');
const packageJson = JSON.parse(readFileSync('package.json', 'utf8'));

const match = appVersionTs.match(/NOOR_APP_VERSION = '([^']+)'/);
if (!match) {
  console.error('Cannot read NOOR_APP_VERSION from app-version.ts.');
  process.exit(1);
}

const appVersion = match[1];
if (appVersion !== versionJson.version) {
  console.error(`Version mismatch: app-version.ts=${appVersion}, version.json=${versionJson.version}`);
  process.exit(1);
}

if (!/^\d+\.\d+\.\d+$/.test(appVersion)) {
  console.error(`Invalid semantic version: ${appVersion}`);
  process.exit(1);
}

if (!changelog.includes(`v${appVersion}`)) {
  console.error(`CHANGELOG.md must include v${appVersion}.`);
  process.exit(1);
}

if (!releaseNotes.includes(`v${appVersion}`)) {
  console.error(`RELEASE_NOTES.md must include v${appVersion}.`);
  process.exit(1);
}

if (!packageJson.scripts?.['check:release']) {
  console.error('package.json must include check:release script.');
  process.exit(1);
}

if (!packageJson.scripts?.['release:bump']) {
  console.error('package.json must include release:bump script.');
  process.exit(1);
}

console.log(`NOOR release metadata check passed for v${appVersion}.`);
