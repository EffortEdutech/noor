import { existsSync, readdirSync, readFileSync, statSync } from 'node:fs';
import { join } from 'node:path';

const ROOT = 'content-pipeline/imported/ilm-mate-v1/noor-cdn';
const REPORT = 'content-pipeline/review/ilm-mate-v1/hadith-view-model/hadith-view-model-report.json';

function readJson(file) {
  return JSON.parse(readFileSync(file, 'utf8'));
}

function fail(message) {
  console.error(message);
  process.exit(1);
}

function listItemFiles(hadithRoot) {
  const files = [];
  for (const name of readdirSync(hadithRoot)) {
    const full = join(hadithRoot, name);
    if (!statSync(full).isDirectory()) continue;
    const items = join(full, 'items.json');
    if (existsSync(items)) files.push({ collectionId: name, file: items });
  }
  return files.sort((a, b) => a.collectionId.localeCompare(b.collectionId));
}

if (!existsSync(REPORT)) fail(`Missing report: ${REPORT}`);
if (!existsSync(join(ROOT, 'hadith', 'collections.json'))) fail('Missing hadith/collections.json. Run pnpm ilm:hadith:view-model first.');

const report = readJson(REPORT);
const collections = readJson(join(ROOT, 'hadith', 'collections.json'));

const ids = new Set();
const duplicateIds = [];
let byBook = 0;
let byChapter = 0;

for (const collection of collections) {
  if (!collection.id) fail('Hadith collection is missing id.');
  if (collection.id === 'all') fail('Hadith collection id "all" is not allowed after view-model normalization.');
  if (ids.has(collection.id)) duplicateIds.push(collection.id);
  ids.add(collection.id);
  if (collection.sourceView === 'by_book') byBook += 1;
  if (collection.sourceView === 'by_chapter') byChapter += 1;
  if (!collection.sourcePath) fail(`Collection ${collection.id} is missing sourcePath.`);
}

if (duplicateIds.length > 0) fail(`Duplicate hadith collection ids found: ${duplicateIds.join(', ')}`);
if (byBook === 0) fail('No by_book Hadith collections found.');
if (byChapter === 0) fail('No by_chapter Hadith collections found.');

let itemCount = 0;
const itemFiles = listItemFiles(join(ROOT, 'hadith'));
for (const { collectionId, file } of itemFiles) {
  const items = readJson(file);
  const itemIds = new Set();
  for (const item of items) {
    if (item.collectionId !== collectionId) fail(`Item ${item.id} has collectionId ${item.collectionId}; expected ${collectionId}.`);
    if (!item.viewItemId) fail(`Item ${item.id} is missing viewItemId.`);
    if (!item.canonicalHadithId) fail(`Item ${item.id} is missing canonicalHadithId.`);
    if (itemIds.has(item.id)) fail(`Duplicate item id ${item.id} inside collection ${collectionId}.`);
    itemIds.add(item.id);
    itemCount += 1;
  }
}

if (report.duplicateCollectionIds?.length) fail('Report still contains duplicateCollectionIds.');
if (report.duplicateItemIds?.length) fail('Report still contains duplicateItemIds.');
if (report.canPushNoorCdnMain !== false) fail('noor-cdn/main must remain blocked.');
if (report.canPromoteToProduction !== false) fail('Production promotion must remain blocked.');

console.log('NOOR Sprint 27.9.2 Hadith view model check passed.');
console.log(`Collections: ${collections.length}`);
console.log(`by_book collections: ${byBook}`);
console.log(`by_chapter collections: ${byChapter}`);
console.log(`Items: ${itemCount}`);
console.log('Duplicate collection ids: 0');
console.log('Duplicate item ids inside collections: 0');
console.log('Same canonicalHadithId may appear across by_book/by_chapter and is allowed.');
console.log('noor-cdn/main remains blocked. Production CDN remains blocked.');
