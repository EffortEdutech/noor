import { existsSync, readFileSync, readdirSync, statSync } from 'node:fs';
import { join, relative } from 'node:path';

const SOURCE_ROOT = process.argv[2] ?? 'content-pipeline/source/noor-demo-v0.12';

function readJson(path) {
  return JSON.parse(readFileSync(path, 'utf8'));
}

function fail(message) {
  console.error(`NOOR CDN validation failed: ${message}`);
  process.exit(1);
}

function requireFile(path) {
  if (!existsSync(path)) fail(`Missing required CDN file: ${path}`);
}

const required = [
  'manifest/noor-content-manifest.json',
  'manifest/noor-source-registry.json',
  'metadata/surah-index.json',
  'quran/surahs/001.json',
  'quran/surahs/112.json',
  'quran/surahs/113.json',
  'quran/surahs/114.json',
  'tafseer/demo-tafseer/surahs/001.json',
  'tafseer/demo-tafseer/surahs/112.json',
  'tafseer/demo-tafseer/surahs/113.json',
  'tafseer/demo-tafseer/surahs/114.json',
  'hadith/collections.json',
  'hadith/demo-nawawi/items.json',
  'search/index.json'
];

for (const file of required) requireFile(join(SOURCE_ROOT, file));

const manifest = readJson(join(SOURCE_ROOT, 'manifest/noor-content-manifest.json'));
if (manifest.version !== '0.12.0') fail('Manifest version must be 0.12.0.');
if (manifest.mode !== 'cdn-ready') fail('Manifest mode must be cdn-ready for Sprint 12.');

const sourceRegistry = readJson(join(SOURCE_ROOT, 'manifest/noor-source-registry.json'));
if (!Array.isArray(sourceRegistry.sources) || sourceRegistry.sources.length < 3) {
  fail('Source registry must list Quran, Tafseer and Hadith source records.');
}
if (!Array.isArray(sourceRegistry.productionGate) || sourceRegistry.productionGate.length < 5) {
  fail('Source registry must define a production gate checklist.');
}

const surahIndex = readJson(join(SOURCE_ROOT, 'metadata/surah-index.json'));
if (!Array.isArray(surahIndex) || surahIndex.length < 4) fail('Surah index must include the demo short-surah pack.');

const ayahKeys = new Set();
let ayahCount = 0;
for (const surah of surahIndex) {
  const file = join(SOURCE_ROOT, 'quran/surahs', `${String(surah.number).padStart(3, '0')}.json`);
  requireFile(file);
  const content = readJson(file);
  if (content.surah?.number !== surah.number) fail(`Surah file ${file} has mismatched surah number.`);
  if (!Array.isArray(content.ayahs) || content.ayahs.length !== surah.ayahCount) {
    fail(`${surah.nameTransliteration} expects ${surah.ayahCount} ayat but file contains ${content.ayahs?.length ?? 0}.`);
  }
  for (const ayah of content.ayahs) {
    ayahCount += 1;
    if (!ayah.key || ayahKeys.has(ayah.key)) fail(`Missing or duplicate ayah key: ${ayah.key}`);
    ayahKeys.add(ayah.key);
    if (!ayah.arabic || !ayah.translations?.en || !ayah.translations?.ms) {
      fail(`Ayah ${ayah.key} must include Arabic, English and Malay demo fields.`);
    }
  }
}

const collections = readJson(join(SOURCE_ROOT, 'hadith/collections.json'));
if (!Array.isArray(collections) || collections.length < 1) fail('Hadith collections file must contain at least one collection.');
for (const collection of collections) {
  requireFile(join(SOURCE_ROOT, 'hadith', collection.id, 'items.json'));
}

const tafseerDir = join(SOURCE_ROOT, 'tafseer/demo-tafseer/surahs');
for (const surah of surahIndex) {
  const tafseerFile = join(tafseerDir, `${String(surah.number).padStart(3, '0')}.json`);
  requireFile(tafseerFile);
  const entries = readJson(tafseerFile);
  if (!Array.isArray(entries)) fail(`Tafseer file must be an array: ${tafseerFile}`);
  for (const entry of entries) {
    if (entry.bookId !== 'demo-tafseer' || entry.surah !== surah.number) {
      fail(`Tafseer entry ${entry.id} has mismatched book or surah.`);
    }
  }
}

const searchIndex = readJson(join(SOURCE_ROOT, 'search/index.json'));
if (!Array.isArray(searchIndex) || searchIndex.length < 6) fail('Search index must contain CDN-ready records.');

function countJsonFiles(dir) {
  let count = 0;
  for (const name of readdirSync(dir)) {
    const full = join(dir, name);
    const stat = statSync(full);
    if (stat.isDirectory()) count += countJsonFiles(full);
    if (stat.isFile() && name.endsWith('.json')) count += 1;
  }
  return count;
}

console.log(`NOOR Sprint 12 CDN source validation passed: ${ayahCount} ayat, ${countJsonFiles(SOURCE_ROOT)} JSON files.`);
