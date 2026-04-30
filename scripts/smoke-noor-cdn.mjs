import { existsSync, readFileSync, statSync } from 'node:fs';
import { join, resolve } from 'node:path';

const DEFAULT_LOCAL_TARGET = 'content-pipeline/publish/noor-cdn-gh-pages/noor-cdn';
const REQUIRED_PATHS = [
  'manifest/noor-content-manifest.json',
  'manifest/noor-content-health.json',
  'metadata/surah-index.json',
  'quran/surahs/001.json',
  'tafseer/demo-tafseer/surahs/001.json',
  'hadith/collections.json'
];

const TIMEOUT_MS = 15000;

function fail(message) {
  console.error(message);
  process.exit(1);
}

function normalizeTarget(rawTarget) {
  const target = rawTarget || process.env.NOOR_CDN_SMOKE_BASE || DEFAULT_LOCAL_TARGET;
  return target.replace(/\/+$/, '');
}

function isHttpTarget(target) {
  return target.startsWith('http://') || target.startsWith('https://');
}

async function fetchJson(url) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), TIMEOUT_MS);

  try {
    const response = await fetch(url, {
      headers: { accept: 'application/json,text/plain;q=0.9,*/*;q=0.8' },
      signal: controller.signal
    });

    if (!response.ok) {
      fail(`NOOR CDN smoke failed: ${url} returned HTTP ${response.status}.`);
    }

    const text = await response.text();
    try {
      return JSON.parse(text);
    } catch (error) {
      fail(`NOOR CDN smoke failed: ${url} did not return valid JSON. ${error.message}`);
    }
  } catch (error) {
    fail(`NOOR CDN smoke failed: cannot fetch ${url}. ${error.message}`);
  } finally {
    clearTimeout(timeout);
  }
}

function readLocalJson(target, relativePath) {
  const full = join(target, relativePath);

  if (!existsSync(full)) {
    fail(`NOOR CDN smoke failed: missing local file ${full}`);
  }

  const stat = statSync(full);
  if (stat.size === 0) {
    fail(`NOOR CDN smoke failed: empty local file ${full}`);
  }

  try {
    return JSON.parse(readFileSync(full, 'utf8'));
  } catch (error) {
    fail(`NOOR CDN smoke failed: invalid JSON in ${full}. ${error.message}`);
  }
}

async function readJson(target, relativePath) {
  if (isHttpTarget(target)) {
    return fetchJson(`${target}/${relativePath}`);
  }

  return readLocalJson(target, relativePath);
}

function validateManifest(manifest) {
  if (!manifest || typeof manifest !== 'object') fail('NOOR CDN smoke failed: manifest is not an object.');
  if (manifest.mode !== 'cdn-ready') fail(`NOOR CDN smoke failed: manifest.mode must be cdn-ready, got ${manifest.mode}.`);
  const datasets = manifest.datasets ?? manifest;
  if (!datasets.quran || !datasets.tafseer || !datasets.hadith) {
    fail('NOOR CDN smoke failed: manifest must include quran, tafseer and hadith sections.');
  }
}

function validateHealth(health) {
  if (!health || typeof health !== 'object') fail('NOOR CDN smoke failed: content health is not an object.');
  const summary = health.summary ?? health;
  const totalAyat = summary.totalAyat ?? summary.ayatCount ?? health.totalAyat;
  if (typeof totalAyat === 'number' && totalAyat <= 0) {
    fail('NOOR CDN smoke failed: content health total ayat must be greater than zero.');
  }
}

function validateSurahIndex(index) {
  const surahs = Array.isArray(index) ? index : index.surahs;
  if (!Array.isArray(surahs) || surahs.length === 0) fail('NOOR CDN smoke failed: surah index must contain at least one surah.');
}

function validateSurahOne(surah) {
  if (!surah?.surah || surah.surah.number !== 1) fail('NOOR CDN smoke failed: quran/surahs/001.json must describe Surah 1.');
  if (!Array.isArray(surah.ayahs) || surah.ayahs.length !== 7) {
    fail('NOOR CDN smoke failed: Surah Al-Fatihah must contain 7 ayat in demo CDN pack.');
  }
}

function validateTafseer(tafseer) {
  const entries = Array.isArray(tafseer) ? tafseer : (tafseer.entries ?? tafseer.ayahs ?? tafseer.items);
  if (!Array.isArray(entries) || entries.length === 0) fail('NOOR CDN smoke failed: tafseer file must contain entries.');
}

function validateHadithCollections(collections) {
  const items = Array.isArray(collections) ? collections : collections.collections;
  if (!Array.isArray(items) || items.length === 0) fail('NOOR CDN smoke failed: hadith collections must contain at least one collection.');
}

async function main() {
  const target = normalizeTarget(process.argv[2]);

  if (!isHttpTarget(target)) {
    const full = resolve(target);
    if (!existsSync(full)) fail(`NOOR CDN smoke target missing: ${target}. Run pnpm cdn:pack first, or pass a CDN URL.`);
  }

  console.log(`NOOR CDN smoke target: ${target}`);

  const results = new Map();
  for (const relativePath of REQUIRED_PATHS) {
    results.set(relativePath, await readJson(target, relativePath));
    console.log(`✓ ${relativePath}`);
  }

  validateManifest(results.get('manifest/noor-content-manifest.json'));
  validateHealth(results.get('manifest/noor-content-health.json'));
  validateSurahIndex(results.get('metadata/surah-index.json'));
  validateSurahOne(results.get('quran/surahs/001.json'));
  validateTafseer(results.get('tafseer/demo-tafseer/surahs/001.json'));
  validateHadithCollections(results.get('hadith/collections.json'));

  console.log(`NOOR CDN smoke test passed for ${isHttpTarget(target) ? 'remote URL' : 'local publish pack'}: ${target}`);
}

main();
