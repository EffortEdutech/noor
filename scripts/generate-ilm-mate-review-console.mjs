import { existsSync, mkdirSync, readdirSync, readFileSync, statSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';

const SOURCE_ROOT = process.argv[2] ?? 'content-pipeline/imported/ilm-mate-v1/noor-cdn';
const OUTPUT_ROOT = process.argv[3] ?? 'content-pipeline/review/ilm-mate-v1';
const REVIEW_VERSION = '0.26.6';

function fail(message) { console.error(`NOOR Sprint 26.6 review console generation failed: ${message}`); process.exit(1); }
function readJson(file, fallback = null) { if (!existsSync(file)) return fallback; return JSON.parse(readFileSync(file, 'utf8')); }
function writeJson(file, value) { mkdirSync(dirname(file), { recursive: true }); writeFileSync(file, `${JSON.stringify(value, null, 2)}\n`, 'utf8'); }
function writeText(file, value) { mkdirSync(dirname(file), { recursive: true }); writeFileSync(file, value, 'utf8'); }
function padSurah(value) { return String(value).padStart(3, '0'); }
function clean(value) { return String(value ?? '').replace(/\s+/g, ' ').trim(); }
function excerpt(value, max = 180) { const text = clean(value); return text.length <= max ? text : `${text.slice(0, max - 1).trim()}…`; }
function listDirs(dir) { if (!existsSync(dir)) return []; return readdirSync(dir).map((name) => join(dir, name)).filter((p) => statSync(p).isDirectory()).sort(); }
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
function loadArray(file) { const value = readJson(file, []); return Array.isArray(value) ? value : []; }

if (!existsSync(SOURCE_ROOT)) fail(`Missing Sprint 26.5 migration output: ${SOURCE_ROOT}`);

const surahIndex = readJson(join(SOURCE_ROOT, 'metadata/surah-index.json'), []);
if (!Array.isArray(surahIndex) || surahIndex.length < 1) fail('Missing metadata/surah-index.json.');

let ayahCount = 0;
let surahFileCount = 0;
const quranSamples = [];
const preferredSurahs = new Set([1, 2, 18, 36, 55, 67, 112, 113, 114]);
for (const surah of surahIndex) {
  const content = readJson(join(SOURCE_ROOT, 'quran/surahs', `${padSurah(surah.number)}.json`), null);
  if (!content?.ayahs) continue;
  surahFileCount++;
  ayahCount += content.ayahs.length;
  if (preferredSurahs.has(surah.number)) {
    quranSamples.push({
      reviewId: `quran-surah-${padSurah(surah.number)}`,
      domain: 'quran',
      status: 'pending-review',
      productionApproved: false,
      surah: { number: surah.number, nameArabic: surah.nameArabic, nameTransliteration: surah.nameTransliteration, nameEnglish: surah.nameEnglish, ayahCount: surah.ayahCount },
      sampleAyahs: content.ayahs.slice(0, 3).map((ayah) => ({ key: ayah.key, arabic: ayah.arabic, english: ayah.translations?.en, malay: ayah.translations?.ms }))
    });
  }
}

let tafseerEntryCount = 0;
const tafseerSamples = [];
for (const bookDir of listDirs(join(SOURCE_ROOT, 'tafseer'))) {
  const bookId = bookDir.split(/[\\/]/).pop();
  let entryCount = 0;
  let firstSample = null;
  for (const file of walkJsonFiles(bookDir)) {
    const entries = loadArray(file);
    entryCount += entries.length;
    if (!firstSample && entries[0]) firstSample = entries[0];
  }
  tafseerEntryCount += entryCount;
  if (entryCount > 0 && tafseerSamples.length < 20) {
    tafseerSamples.push({ reviewId: `tafseer-book-${bookId}`, domain: 'tafseer', status: 'pending-review', productionApproved: false, bookId, entryCount, firstSample: firstSample ? { id: firstSample.id, title: firstSample.title, bodyExcerpt: excerpt(firstSample.body), sourceLabel: firstSample.sourceLabel } : null });
  }
}

const collections = readJson(join(SOURCE_ROOT, 'hadith/collections.json'), []);
if (!Array.isArray(collections)) fail('Missing hadith/collections.json.');
let hadithItemCount = 0;
const hadithSamples = [];
for (const collection of collections) {
  const items = loadArray(join(SOURCE_ROOT, 'hadith', collection.id, 'items.json'));
  hadithItemCount += items.length;
  if (items.length > 0 && hadithSamples.length < 30) {
    hadithSamples.push({ reviewId: `hadith-collection-${collection.id}`, domain: 'hadith', status: 'pending-review', productionApproved: false, collectionId: collection.id, name: collection.name, language: collection.language, itemCount: items.length, firstSample: { id: items[0].id, number: items[0].number, arabicExcerpt: excerpt(items[0].arabic), englishExcerpt: excerpt(items[0].translations?.en), malayExcerpt: excerpt(items[0].translations?.ms), sourceLabel: items[0].sourceLabel } });
  }
}

const searchIndex = readJson(join(SOURCE_ROOT, 'search/search-index.json'), []);
const searchEntryCount = Array.isArray(searchIndex) ? searchIndex.length : 0;

const sampleQueue = { version: REVIEW_VERSION, generatedAt: new Date().toISOString(), sourceRoot: SOURCE_ROOT, byDomain: { quran: quranSamples, tafseer: tafseerSamples, hadith: hadithSamples } };
const reviewConsole = {
  id: 'noor-ilm-mate-v1-review-console',
  version: REVIEW_VERSION,
  label: 'ilm-mate migrated content review console',
  generatedAt: sampleQueue.generatedAt,
  sourceRoot: SOURCE_ROOT,
  outputRoot: OUTPUT_ROOT,
  productionGate: {
    status: 'blocked',
    productionApproved: false,
    reason: 'Migrated ilm-mate content requires source licensing, attribution, checksum/integrity and scholarly review before production CDN promotion.',
    requiredEvidence: ['source identity', 'license or written redistribution permission', 'attribution wording', 'checksum/integrity plan', 'scholarly reviewer sign-off', 'production promotion approval']
  },
  summary: {
    quran: { surahIndexCount: surahIndex.length, surahFileCount, ayahCount },
    tafseer: { sampleBookCount: tafseerSamples.length, entryCount: tafseerEntryCount },
    hadith: { collectionCount: collections.length, itemCount: hadithItemCount },
    search: { totalEntries: searchEntryCount }
  }
};

function buildReviewMd() {
  const lines = ['# NOOR Sprint 26.6 — ilm-mate Migration Review Console', '', `Generated: ${reviewConsole.generatedAt}`, '', '## Status', '', `- Status: **${reviewConsole.productionGate.status}**`, `- Production approved: **${reviewConsole.productionGate.productionApproved}**`, '', '## Migration Summary', '', '| Area | Count |', '|---|---:|', `| Surah files | ${surahFileCount} |`, `| Ayat | ${ayahCount} |`, `| Tafseer entries | ${tafseerEntryCount} |`, `| Hadith collections | ${collections.length} |`, `| Hadith items | ${hadithItemCount} |`, `| Search entries | ${searchEntryCount} |`, '', '## Required Gate Evidence', ''];
  for (const item of reviewConsole.productionGate.requiredEvidence) lines.push(`- ${item}`);
  lines.push('', '## Sample Quran Review Cases', '');
  for (const item of quranSamples.slice(0, 5)) lines.push(`- **${item.reviewId}** — ${item.surah.nameTransliteration}`);
  lines.push('', '## Sample Tafseer Review Cases', '');
  for (const item of tafseerSamples.slice(0, 8)) lines.push(`- **${item.bookId}** — ${item.entryCount} entries`);
  lines.push('', '## Sample Hadith Review Cases', '');
  for (const item of hadithSamples.slice(0, 10)) lines.push(`- **${item.name}** — ${item.itemCount} items`);
  lines.push('', 'This review console is intentionally **blocked**. It does not publish, approve, or promote migrated content.', '');
  return lines.join('\n');
}
function buildQueueMd() {
  const lines = ['# NOOR Sprint 26.6 — Review Sample Queue', ''];
  for (const [domain, items] of Object.entries(sampleQueue.byDomain)) {
    lines.push(`## ${domain}`, '');
    for (const item of items) lines.push(`- [ ] ${item.reviewId} — ${item.status}`);
    lines.push('');
  }
  return lines.join('\n');
}
function buildCsv() {
  const lines = ['review_id,domain,status,production_approved,required_action'];
  for (const [domain, items] of Object.entries(sampleQueue.byDomain)) {
    for (const item of items) lines.push(`${item.reviewId},${domain},${item.status},false,"Capture license, attribution, checksum, and scholarly review evidence"`);
  }
  return `${lines.join('\n')}\n`;
}

writeJson(join(OUTPUT_ROOT, 'review-console.json'), reviewConsole);
writeJson(join(OUTPUT_ROOT, 'review-sample-queue.json'), sampleQueue);
writeText(join(OUTPUT_ROOT, 'review-console.md'), buildReviewMd());
writeText(join(OUTPUT_ROOT, 'review-sample-queue.md'), buildQueueMd());
writeText(join(OUTPUT_ROOT, 'review-action-register.csv'), buildCsv());

console.log('NOOR Sprint 26.6 ilm-mate review console generated.');
console.log(`Output: ${OUTPUT_ROOT}`);
console.log(`Quran ayat: ${ayahCount}`);
console.log(`Tafseer entries: ${tafseerEntryCount}`);
console.log(`Hadith items: ${hadithItemCount}`);
console.log(`Search entries: ${searchEntryCount}`);
console.log('Status: blocked, productionApproved: false.');
