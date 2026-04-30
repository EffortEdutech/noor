import { existsSync, readFileSync } from 'node:fs';

const required = [
  'packages/noor-data/src/config.ts',
  'packages/noor-data/src/fetch-json.ts',
  'packages/noor-data/src/resolvers/diagnostics.ts',
  'apps/web/lib/runtime-content-source.ts',
  'apps/web/lib/runtime-content-source-constants.ts',
  'apps/web/components/RuntimeContentSourceCard.tsx',
  'apps/web/public/noor-cdn/manifest/noor-content-manifest.json',
  'docs/SPRINT_13_SCOPE.md',
  'docs/LOCAL_TESTING_SPRINT_13.md',
  'docs/NOOR_RUNTIME_CDN_MODE.md'
];

const missing = required.filter((file) => !existsSync(file));
if (missing.length > 0) {
  console.error('Missing Sprint 13 runtime files:');
  for (const file of missing) console.error(`- ${file}`);
  process.exit(1);
}

const packageJson = JSON.parse(readFileSync('package.json', 'utf8'));
if (!packageJson.scripts?.['check:runtime']) {
  console.error('package.json must include check:runtime script.');
  process.exit(1);
}

const config = readFileSync('packages/noor-data/src/config.ts', 'utf8');
for (const value of ["'mock'", "'local-cdn'", "'cdn'"]) {
  if (!config.includes(value)) {
    console.error(`config.ts must support ${value} mode.`);
    process.exit(1);
  }
}

const settingsPage = readFileSync('apps/web/app/settings/page.tsx', 'utf8');
if (!settingsPage.includes('RuntimeContentSourceCard') || !settingsPage.includes('getNoorResolverDiagnostics')) {
  console.error('Settings page must render runtime source switching and diagnostics.');
  process.exit(1);
}

const quranPage = readFileSync('apps/web/app/learn/quran/page.tsx', 'utf8');
const quranReader = readFileSync('apps/web/app/learn/quran/[surah]/page.tsx', 'utf8');
const tafseerPage = readFileSync('apps/web/app/learn/tafseer/page.tsx', 'utf8');
const hadithPage = readFileSync('apps/web/app/learn/hadith/page.tsx', 'utf8');

for (const [name, content] of Object.entries({ quranPage, quranReader, tafseerPage, hadithPage })) {
  if (!content.includes('getServerNoorContentSource')) {
    console.error(`${name} must use the selected runtime content source.`);
    process.exit(1);
  }
}

const appVersion = readFileSync('apps/web/lib/app-version.ts', 'utf8');
if (!appVersion.includes("NOOR_APP_VERSION = '0.13.0'")) {
  console.error('Sprint 13 must update NOOR app version to 0.13.0.');
  process.exit(1);
}

const versionJson = JSON.parse(readFileSync('apps/web/public/version.json', 'utf8'));
if (versionJson.version !== '0.13.0') {
  console.error('version.json must be updated to 0.13.0.');
  process.exit(1);
}

console.log('NOOR Sprint 13 runtime source switching check passed.');
