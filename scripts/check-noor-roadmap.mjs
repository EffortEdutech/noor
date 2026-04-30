import { existsSync, readFileSync } from 'node:fs';

const required = [
  'apps/web/lib/roadmap.ts',
  'apps/web/components/RoadmapControlCard.tsx',
  'apps/web/app/settings/page.tsx',
  'apps/web/lib/app-version.ts',
  'apps/web/public/version.json',
  'apps/web/lib/release-notes.ts',
  'CHANGELOG.md',
  'RELEASE_NOTES.md',
  'docs/NOOR_MASTER_ROADMAP.md',
  'docs/SPRINT_18_SCOPE.md',
  'docs/LOCAL_TESTING_SPRINT_18.md',
  'scripts/generate-noor-roadmap.mjs',
  'scripts/check-noor-roadmap.mjs',
  'content-pipeline/roadmap/noor-roadmap-status.json',
  'content-pipeline/roadmap/noor-roadmap-status.md'
];

const missing = required.filter((file) => !existsSync(file));
if (missing.length > 0) {
  console.error('Missing roadmap files. Run pnpm roadmap:status before pnpm check:roadmap if generated files are missing.');
  for (const file of missing) console.error(`- ${file}`);
  process.exit(1);
}

const appVersion = readFileSync('apps/web/lib/app-version.ts', 'utf8');
if (!appVersion.includes("NOOR_APP_VERSION = '0.18.0'")) {
  console.error('Sprint 18 must update NOOR app version to 0.18.0.');
  process.exit(1);
}

const versionJson = JSON.parse(readFileSync('apps/web/public/version.json', 'utf8'));
if (versionJson.version !== '0.18.0') {
  console.error('version.json must be updated to 0.18.0.');
  process.exit(1);
}

const packageJson = JSON.parse(readFileSync('package.json', 'utf8'));
for (const script of ['roadmap:status', 'check:roadmap']) {
  if (!packageJson.scripts?.[script]) {
    console.error(`package.json must include ${script}.`);
    process.exit(1);
  }
}

const roadmapLib = readFileSync('apps/web/lib/roadmap.ts', 'utf8');
for (const expected of ['NOOR_MASTER_ROADMAP', 'Sprint 19', 'Production source intake templates', 'Sprint 24', 'Production CDN release candidate']) {
  if (!roadmapLib.includes(expected)) {
    console.error(`roadmap.ts must include ${expected}.`);
    process.exit(1);
  }
}

const settingsPage = readFileSync('apps/web/app/settings/page.tsx', 'utf8');
if (!settingsPage.includes('RoadmapControlCard')) {
  console.error('Settings page must render the Sprint 18 RoadmapControlCard.');
  process.exit(1);
}

const releaseNotes = readFileSync('apps/web/lib/release-notes.ts', 'utf8');
const changelog = readFileSync('CHANGELOG.md', 'utf8');
const releaseNotesMd = readFileSync('RELEASE_NOTES.md', 'utf8');
for (const [name, text] of [['release-notes.ts', releaseNotes], ['CHANGELOG.md', changelog], ['RELEASE_NOTES.md', releaseNotesMd]]) {
  if (!text.includes('v0.18.0') && !text.includes("version: '0.18.0'")) {
    console.error(`${name} must include v0.18.0.`);
    process.exit(1);
  }
}

const roadmapStatus = JSON.parse(readFileSync('content-pipeline/roadmap/noor-roadmap-status.json', 'utf8'));
if (roadmapStatus.currentVersion !== '0.18.0' || roadmapStatus.currentSprint !== 'Sprint 18') {
  console.error('Generated roadmap status must identify Sprint 18 and v0.18.0.');
  process.exit(1);
}
if (!roadmapStatus.next?.includes('Sprint 19')) {
  console.error('Generated roadmap status must identify Sprint 19 as next.');
  process.exit(1);
}

console.log('NOOR Sprint 18 roadmap check passed.');
