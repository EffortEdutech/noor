import { existsSync, readFileSync } from 'node:fs';

const expectedVersion = '0.19.0';
const required = [
  'apps/web/lib/app-version.ts',
  'apps/web/public/version.json',
  'apps/web/lib/release-notes.ts',
  'apps/web/components/ReleaseNotesCard.tsx',
  'apps/web/app/changelog/page.tsx',
  'CHANGELOG.md',
  'RELEASE_NOTES.md',
  '.github/workflows/noor-ci.yml',
  '.github/workflows/noor-release.yml',
  'scripts/check-noor-release.mjs',
  'scripts/bump-noor-version.mjs'
];

function fail(message) {
  console.error(message);
  process.exit(1);
}

const missing = required.filter((file) => !existsSync(file));
if (missing.length > 0) {
  console.error('Missing release files:');
  for (const file of missing) console.error(`- ${file}`);
  process.exit(1);
}

const appVersionSource = readFileSync('apps/web/lib/app-version.ts', 'utf8');
if (!appVersionSource.includes(`NOOR_APP_VERSION = '${expectedVersion}'`)) {
  fail(`NOOR app version must be ${expectedVersion}.`);
}
if (!appVersionSource.includes('Sprint 19')) {
  fail('NOOR app build label must mention Sprint 19.');
}

const versionJson = JSON.parse(readFileSync('apps/web/public/version.json', 'utf8'));
if (versionJson.version !== expectedVersion) {
  fail(`version.json must be ${expectedVersion}.`);
}

const releaseNotesSource = readFileSync('apps/web/lib/release-notes.ts', 'utf8');
if (!releaseNotesSource.includes(`version: '${expectedVersion}'`) || !releaseNotesSource.includes('Production source intake templates')) {
  fail('release-notes.ts must include the Sprint 19 release note.');
}

const changelog = readFileSync('CHANGELOG.md', 'utf8');
const releaseNotesMd = readFileSync('RELEASE_NOTES.md', 'utf8');
for (const [name, text] of [['CHANGELOG.md', changelog], ['RELEASE_NOTES.md', releaseNotesMd]]) {
  if (!text.includes(`v${expectedVersion}`) || !text.includes('Production source intake templates')) {
    fail(`${name} must include v${expectedVersion} Sprint 19 notes.`);
  }
}

const ci = readFileSync('.github/workflows/noor-ci.yml', 'utf8');
for (const expected of ['pnpm check:pack', 'pnpm check:content', 'pnpm check:release', 'pnpm source:intake', 'pnpm check:source-intake', 'pnpm typecheck', 'pnpm build']) {
  if (!ci.includes(expected)) {
    fail(`noor-ci.yml must include ${expected}.`);
  }
}

console.log(`NOOR release metadata check passed for v${expectedVersion}.`);
