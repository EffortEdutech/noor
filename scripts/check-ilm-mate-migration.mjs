import { existsSync, readFileSync, statSync } from 'node:fs';
import { join } from 'node:path';

const OUTPUT_ROOT = process.argv.find((arg) => arg.startsWith('--output='))?.slice('--output='.length) ?? 'content-pipeline/imported/ilm-mate-v1/noor-cdn';

function fail(message) {
  console.error(`NOOR ilm-mate migration check failed: ${message}`);
  process.exit(1);
}

function requireFile(relativePath) {
  const file = join(OUTPUT_ROOT, relativePath);
  if (!existsSync(file)) fail(`Missing required file: ${file}`);
  if (statSync(file).size === 0) fail(`Required file is empty: ${file}`);
  return file;
}

function readJson(relativePath) {
  return JSON.parse(readFileSync(requireFile(relativePath), 'utf8'));
}

const manifest = readJson('manifest/noor-content-manifest.json');
if (manifest.version !== '0.26.5') fail('Manifest version must be 0.26.5 for Sprint 26.5.');
if (manifest.mode !== 'staging') fail('Manifest mode must be staging, not production.');

const registry = readJson('manifest/noor-source-registry.json');
if (!Array.isArray(registry.productionGate) || registry.productionGate.length < 5) {
  fail('Source registry must include production gate checklist.');
}

const surahIndex = readJson('metadata/surah-index.json');
if (!Array.isArray(surahIndex) || surahIndex.length < 4) fail('Surah index must include migrated Quran surahs.');

let ayahCount = 0;
for (const surah of surahIndex) {
  const file = `quran/surahs/${String(surah.number).padStart(3, '0')}.json`;
  const content = readJson(file);
  if (content.surah?.number !== surah.number) fail(`Surah file mismatch: ${file}`);
  if (!Array.isArray(content.ayahs) || content.ayahs.length !== surah.ayahCount) {
    fail(`${file} expected ${surah.ayahCount} ayat but has ${content.ayahs?.length ?? 0}.`);
  }
  ayahCount += content.ayahs.length;
}

const collections = readJson('hadith/collections.json');
if (!Array.isArray(collections)) fail('Hadith collections must be an array.');
for (const collection of collections) {
  const items = readJson(`hadith/${collection.id}/items.json`);
  if (!Array.isArray(items)) fail(`Hadith collection items must be an array: ${collection.id}`);
}

const searchIndex = readJson('search/search-index.json');
if (!Array.isArray(searchIndex) || searchIndex.length < ayahCount) {
  fail('Search index must exist and include at least the migrated Quran ayah entries.');
}

const searchManifest = readJson('manifest/search-index-manifest.json');
if (searchManifest.totalEntries !== searchIndex.length) fail('Search index manifest totalEntries mismatch.');

const health = readJson('manifest/noor-content-health.json');
if (!health.isHealthy) fail('Health report is not healthy. Review manifest/noor-content-health.json.');
if (health.summary.ayahContentCount !== ayahCount) fail('Health report ayah count mismatch.');

console.log('NOOR Sprint 26.5 ilm-mate migration check passed.');
console.log(`Output root: ${OUTPUT_ROOT}`);
console.log(`Surahs: ${surahIndex.length}`);
console.log(`Ayat: ${ayahCount}`);
console.log(`Hadith collections: ${collections.length}`);
console.log(`Search entries: ${searchIndex.length}`);
console.log('Status: staging-only, production gate remains blocked pending review.');
