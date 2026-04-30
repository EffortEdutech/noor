import { existsSync, readFileSync } from 'node:fs';

const requiredFiles = [
  'packages/noor-content/src/demo/surah-index.ts',
  'packages/noor-content/src/demo/quran.ts',
  'packages/noor-content/src/demo/tafseer.ts',
  'packages/noor-content/src/demo/hadith.ts',
  'packages/noor-content/src/demo/content-manifest.ts',
  'packages/noor-content/src/demo/content-health.ts',
  'packages/noor-data/src/resolvers/content-health.ts',
  'apps/web/components/ContentHealthCard.tsx',
  'content-pipeline/source/noor-demo-v0.12/manifest/noor-content-manifest.json',
  'content-pipeline/source/noor-demo-v0.12/manifest/noor-source-registry.json',
  'content-pipeline/source/noor-demo-v0.12/metadata/surah-index.json',
  'content-pipeline/source/noor-demo-v0.12/quran/surahs/001.json',
  'content-pipeline/source/noor-demo-v0.12/quran/surahs/112.json',
  'content-pipeline/source/noor-demo-v0.12/quran/surahs/113.json',
  'content-pipeline/source/noor-demo-v0.12/quran/surahs/114.json',
  'scripts/validate-noor-cdn.mjs',
  'scripts/prepare-noor-cdn.mjs'
];

const missing = requiredFiles.filter((file) => !existsSync(file));
if (missing.length > 0) {
  console.error('Missing content integrity / CDN preparation files:');
  for (const file of missing) console.error(`- ${file}`);
  process.exit(1);
}

const quran = readFileSync('packages/noor-content/src/demo/quran.ts', 'utf8');
const requiredAyahKeys = [
  '1:1', '1:2', '1:3', '1:4', '1:5', '1:6', '1:7',
  '112:1', '112:2', '112:3', '112:4',
  '113:1', '113:2', '113:3', '113:4', '113:5',
  '114:1', '114:2', '114:3', '114:4', '114:5', '114:6'
];

const missingKeys = requiredAyahKeys.filter((key) => !quran.includes(`key: '${key}'`));
if (missingKeys.length > 0) {
  console.error('Missing expected demo Quran ayah keys:');
  for (const key of missingKeys) console.error(`- ${key}`);
  process.exit(1);
}

const demoManifest = readFileSync('packages/noor-content/src/demo/content-manifest.ts', 'utf8');
if (!demoManifest.includes("version: '0.8.0'")) {
  console.error('Demo content manifest must remain version 0.8.0 until demo content itself changes.');
  process.exit(1);
}

const cdnManifest = JSON.parse(readFileSync('content-pipeline/source/noor-demo-v0.12/manifest/noor-content-manifest.json', 'utf8'));
if (cdnManifest.version !== '0.12.0' || cdnManifest.mode !== 'cdn-ready') {
  console.error('Sprint 12 CDN source manifest must be version 0.12.0 and mode cdn-ready.');
  process.exit(1);
}

const sourceRegistry = JSON.parse(readFileSync('content-pipeline/source/noor-demo-v0.12/manifest/noor-source-registry.json', 'utf8'));
if (!sourceRegistry.productionGate?.includes('Scholar/reviewer sign-off recorded')) {
  console.error('Source registry must include scholarly/reviewer sign-off in production gate.');
  process.exit(1);
}

console.log('NOOR Sprint 8 + Sprint 12 content checks passed.');
