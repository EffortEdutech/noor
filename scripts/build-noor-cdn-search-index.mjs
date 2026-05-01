import { createHash } from 'node:crypto';
import { existsSync, mkdirSync, readdirSync, readFileSync, statSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';

const SOURCE_ROOT = process.argv[2] ?? 'content-pipeline/dist/noor-cdn';
const OUTPUT_ROOT = process.argv[3] ?? SOURCE_ROOT;

function readJson(file, fallback = null) {
  if (!existsSync(file)) return fallback;
  return JSON.parse(readFileSync(file, 'utf8'));
}

function padSurah(number) {
  return String(number).padStart(3, '0');
}

function normalizeText(value) {
  return String(value ?? '')
    .replace(/\s+/g, ' ')
    .trim();
}

function shortExcerpt(value, max = 220) {
  const text = normalizeText(value);
  if (text.length <= max) return text;
  return `${text.slice(0, max - 1).trim()}…`;
}

function walkJsonFiles(dir) {
  if (!existsSync(dir)) return [];
  const files = [];

  function walk(current) {
    for (const name of readdirSync(current)) {
      const full = join(current, name);
      const stat = statSync(full);
      if (stat.isDirectory()) walk(full);
      if (stat.isFile() && name.endsWith('.json')) files.push(full);
    }
  }

  walk(dir);
  return files.sort();
}

function sha256Text(text) {
  return createHash('sha256').update(text).digest('hex');
}

function writeJson(file, value) {
  mkdirSync(dirname(file), { recursive: true });
  writeFileSync(file, `${JSON.stringify(value, null, 2)}\n`, 'utf8');
}

function buildIndex() {
  const entries = [];
  const surahIndex = readJson(join(SOURCE_ROOT, 'metadata/surah-index.json'), []);
  const collections = readJson(join(SOURCE_ROOT, 'hadith/collections.json'), []);

  for (const surah of surahIndex) {
    const surahFile = join(SOURCE_ROOT, 'quran/surahs', `${padSurah(surah.number)}.json`);
    const content = readJson(surahFile, null);
    if (!content?.ayahs) continue;

    for (const ayah of content.ayahs) {
      entries.push({
        id: ayah.key,
        type: 'quran',
        title: `${surah.nameTransliteration} ${ayah.ayah}`,
        excerpt: shortExcerpt(ayah.translations?.en ?? ayah.translations?.ms ?? ayah.arabic),
        reference: ayah.key,
        href: `/learn/quran/${ayah.surah}#ayah-${ayah.ayah}`,
        sourceLabel: `${surah.nameEnglish} · ${surah.revelation}`,
        tags: [surah.slug, surah.nameTransliteration.toLowerCase(), surah.revelation],
        priority: 4,
        searchText: {
          title: `${surah.nameTransliteration} ${surah.nameEnglish} ${surah.nameArabic}`,
          reference: ayah.key,
          arabic: ayah.arabic,
          transliteration: ayah.transliteration,
          english: ayah.translations?.en,
          malay: ayah.translations?.ms,
          tags: surah.slug
        }
      });
    }
  }

  const tafseerRoot = join(SOURCE_ROOT, 'tafseer');
  for (const file of walkJsonFiles(tafseerRoot)) {
    const items = readJson(file, []);
    if (!Array.isArray(items)) continue;

    for (const entry of items) {
      entries.push({
        id: entry.id,
        type: 'tafseer',
        title: entry.title,
        excerpt: shortExcerpt(entry.body),
        reference: `${entry.surah}:${entry.fromAyah}-${entry.toAyah}`,
        href: `/learn/quran/${entry.surah}#ayah-${entry.fromAyah}`,
        sourceLabel: entry.sourceLabel,
        tags: entry.tags ?? [],
        priority: 3,
        searchText: {
          title: entry.title,
          body: entry.body,
          tags: (entry.tags ?? []).join(' '),
          source: entry.sourceLabel,
          reference: `${entry.surah}:${entry.fromAyah}-${entry.toAyah}`
        }
      });
    }
  }

  for (const collection of collections) {
    const items = readJson(join(SOURCE_ROOT, 'hadith', collection.id, 'items.json'), []);
    if (!Array.isArray(items)) continue;

    for (const hadith of items) {
      entries.push({
        id: hadith.id,
        type: 'hadith',
        title: `Hadith ${hadith.number}`,
        excerpt: shortExcerpt(hadith.translations?.en ?? hadith.translations?.ms ?? ''),
        reference: hadith.sourceLabel,
        href: '/learn/hadith',
        sourceLabel: hadith.narrator ? `Narrator: ${hadith.narrator}` : hadith.sourceLabel,
        tags: hadith.tags ?? [],
        priority: 2,
        searchText: {
          title: `Hadith ${hadith.number}`,
          narrator: hadith.narrator,
          arabic: hadith.arabic,
          english: hadith.translations?.en,
          malay: hadith.translations?.ms,
          source: hadith.sourceLabel,
          tags: (hadith.tags ?? []).join(' ')
        }
      });
    }
  }

  const payload = entries.sort((a, b) => a.type.localeCompare(b.type) || a.reference.localeCompare(b.reference));
  const json = JSON.stringify(payload, null, 2);
  const generatedAt = new Date().toISOString();

  writeJson(join(OUTPUT_ROOT, 'search/search-index.json'), payload);
  writeJson(join(OUTPUT_ROOT, 'manifest/search-index-manifest.json'), {
    name: 'NOOR CDN Search Index',
    generatedAt,
    sourceRoot: SOURCE_ROOT,
    outputRoot: OUTPUT_ROOT,
    totalEntries: payload.length,
    sha256: sha256Text(json),
    byType: payload.reduce((acc, item) => {
      acc[item.type] = (acc[item.type] ?? 0) + 1;
      return acc;
    }, {})
  });

  console.log(`NOOR CDN search index built: ${payload.length} entries.`);
  console.log(`Output: ${join(OUTPUT_ROOT, 'search/search-index.json')}`);
}

if (!existsSync(SOURCE_ROOT)) {
  console.error(`NOOR CDN source root missing: ${SOURCE_ROOT}`);
  process.exit(1);
}

buildIndex();
