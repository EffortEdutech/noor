import { existsSync, readFileSync } from 'node:fs';

const requiredFiles = [
  'packages/noor-content/src/demo/surah-index.ts',
  'packages/noor-content/src/demo/quran.ts',
  'packages/noor-content/src/demo/tafseer.ts',
  'packages/noor-content/src/demo/hadith.ts',
  'packages/noor-content/src/demo/content-manifest.ts',
  'packages/noor-content/src/demo/content-health.ts',
  'packages/noor-data/src/resolvers/content-health.ts',
  'apps/web/components/ContentHealthCard.tsx'
];

const missing = requiredFiles.filter((file) => !existsSync(file));
if (missing.length > 0) {
  console.error('Missing Sprint 8 content integrity files:');
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

const manifest = readFileSync('packages/noor-content/src/demo/content-manifest.ts', 'utf8');
if (!manifest.includes("version: '0.8.0'")) {
  console.error('Content manifest must be updated to version 0.8.0.');
  process.exit(1);
}

console.log('NOOR Sprint 8 content integrity check passed.');
