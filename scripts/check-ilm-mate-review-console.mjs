import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

const REVIEW_ROOT = process.argv[2] ?? 'content-pipeline/review/ilm-mate-v1';
function fail(message) { console.error(`NOOR Sprint 26.6 review console check failed: ${message}`); process.exit(1); }
function readJson(file) { if (!existsSync(file)) fail(`Missing required file: ${file}`); return JSON.parse(readFileSync(file, 'utf8')); }

for (const file of ['review-console.json', 'review-console.md', 'review-sample-queue.json', 'review-sample-queue.md', 'review-action-register.csv']) {
  if (!existsSync(join(REVIEW_ROOT, file))) fail(`Missing required review output: ${file}`);
}

const reviewConsole = readJson(join(REVIEW_ROOT, 'review-console.json'));
const sampleQueue = readJson(join(REVIEW_ROOT, 'review-sample-queue.json'));

if (reviewConsole.version !== '0.26.6') fail('Review console version must be 0.26.6.');
if (reviewConsole.productionGate?.status !== 'blocked') fail('Production gate must remain blocked.');
if (reviewConsole.productionGate?.productionApproved !== false) fail('Production approval must remain false.');
if ((reviewConsole.summary?.quran?.surahFileCount ?? 0) < 114) fail('Expected at least 114 migrated Quran surah files.');
if ((reviewConsole.summary?.quran?.ayahCount ?? 0) < 6236) fail('Expected at least 6,236 migrated ayat.');
if ((reviewConsole.summary?.tafseer?.entryCount ?? 0) < 1000) fail('Expected tafseer review entries to be present.');
if ((reviewConsole.summary?.hadith?.collectionCount ?? 0) < 100) fail('Expected migrated hadith collections to be present.');
if ((reviewConsole.summary?.hadith?.itemCount ?? 0) < 10000) fail('Expected migrated hadith items to be present.');
if ((reviewConsole.summary?.search?.totalEntries ?? 0) < 100000) fail('Expected generated search index entries to be present.');

for (const domain of ['quran', 'tafseer', 'hadith']) {
  if (!Array.isArray(sampleQueue.byDomain?.[domain]) || sampleQueue.byDomain[domain].length < 1) fail(`Expected review sample queue for ${domain}.`);
  for (const item of sampleQueue.byDomain[domain]) {
    if (item.productionApproved !== false) fail(`Review item must not be production approved: ${item.reviewId}`);
    if (item.status !== 'pending-review') fail(`Review item must be pending-review: ${item.reviewId}`);
  }
}

console.log('NOOR Sprint 26.6 ilm-mate review console check passed.');
console.log(`Review root: ${REVIEW_ROOT}`);
console.log(`Surahs: ${reviewConsole.summary.quran.surahFileCount}`);
console.log(`Ayat: ${reviewConsole.summary.quran.ayahCount}`);
console.log(`Tafseer entries: ${reviewConsole.summary.tafseer.entryCount}`);
console.log(`Hadith collections: ${reviewConsole.summary.hadith.collectionCount}`);
console.log(`Hadith items: ${reviewConsole.summary.hadith.itemCount}`);
console.log(`Search entries: ${reviewConsole.summary.search.totalEntries}`);
console.log('Status: blocked, productionApproved: false.');
