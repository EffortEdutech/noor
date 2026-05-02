import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const cdnRootArg = process.argv.find((arg) => arg.startsWith('--cdn-root='))?.split('=').slice(1).join('=');
const cdnRoot = path.resolve(root, cdnRootArg || path.join('content-pipeline', 'imported', 'ilm-mate-v1', 'noor-cdn'));
const indexPath = path.join(cdnRoot, 'metadata', 'tafseer-index.json');

function fail(message) {
  console.error(message);
  process.exit(1);
}

if (!fs.existsSync(indexPath)) {
  fail(`Missing Tafseer CDN index: ${indexPath}`);
}

const payload = JSON.parse(fs.readFileSync(indexPath, 'utf8'));
const books = Array.isArray(payload) ? payload : payload.books;

if (!Array.isArray(books) || books.length === 0) {
  fail('Tafseer CDN index must contain at least one book.');
}

let totalEntries = 0;
const seenIds = new Set();

for (const book of books) {
  if (!book.id || typeof book.id !== 'string') fail('Tafseer book is missing string id.');
  if (seenIds.has(book.id)) fail(`Duplicate Tafseer book id: ${book.id}`);
  seenIds.add(book.id);

  if (!book.label || typeof book.label !== 'string') fail(`Tafseer book ${book.id} is missing label.`);
  if (!Number.isFinite(book.entryCount) || book.entryCount <= 0) fail(`Tafseer book ${book.id} has invalid entryCount.`);
  if (!Array.isArray(book.availableSurahs) || book.availableSurahs.length === 0) fail(`Tafseer book ${book.id} has no availableSurahs.`);

  const sampleSurah = String(book.availableSurahs[0]).padStart(3, '0');
  const samplePath = path.join(cdnRoot, 'tafseer', book.id, 'surahs', `${sampleSurah}.json`);
  if (!fs.existsSync(samplePath)) {
    fail(`Tafseer book ${book.id} sample file is missing: ${samplePath}`);
  }

  totalEntries += book.entryCount;
}

if (totalEntries <= 0) {
  fail('Tafseer CDN index total entries must be greater than zero.');
}

console.log('NOOR Tafseer CDN index check passed.');
console.log(`Books: ${books.length}`);
console.log(`Entries: ${totalEntries}`);
console.log(`Index: ${path.relative(root, indexPath)}`);
