import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const DEFAULT_OUTPUT_ROOT = 'content-pipeline/imported/ilm-mate-v1/noor-cdn';
const REPORT_JSON = path.join(root, 'content-pipeline', 'review', 'ilm-mate-v1', 'hadith-id-normalization', 'hadith-id-normalization-report.json');

function parseArg(name, fallback = undefined) {
  const prefix = `--${name}=`;
  const inline = process.argv.find((arg) => arg.startsWith(prefix));
  if (inline) return inline.slice(prefix.length);
  const index = process.argv.indexOf(`--${name}`);
  if (index >= 0 && process.argv[index + 1]) return process.argv[index + 1];
  return fallback;
}

function toPosix(value) {
  return String(value).replaceAll('\\', '/');
}

function rel(filePath, base = root) {
  return toPosix(path.relative(base, filePath));
}

function fail(message) {
  console.error(message);
  process.exit(1);
}

function requireFile(filePath) {
  if (!fs.existsSync(filePath)) fail(`Required file missing: ${rel(filePath)}`);
}

function readJson(filePath) {
  requireFile(filePath);
  try {
    return JSON.parse(fs.readFileSync(filePath, 'utf8'));
  } catch (error) {
    fail(`Invalid JSON in ${rel(filePath)}: ${error.message}`);
  }
}

function walkFiles(dirPath) {
  if (!fs.existsSync(dirPath)) return [];
  const files = [];
  for (const entry of fs.readdirSync(dirPath, { withFileTypes: true })) {
    const full = path.join(dirPath, entry.name);
    if (entry.isDirectory()) files.push(...walkFiles(full));
    if (entry.isFile()) files.push(full);
  }
  return files.sort((a, b) => a.localeCompare(b));
}

function countDuplicates(values) {
  const counts = new Map();
  for (const value of values) counts.set(value, (counts.get(value) ?? 0) + 1);
  return [...counts.entries()].filter(([, count]) => count > 1).map(([value, count]) => ({ value, count }));
}

const outputRoot = path.resolve(parseArg('output', DEFAULT_OUTPUT_ROOT));
const collectionsPath = path.join(outputRoot, 'hadith', 'collections.json');
const searchPath = path.join(outputRoot, 'search', 'search-index.json');
const manifestPath = path.join(outputRoot, 'manifest', 'noor-content-manifest.json');
const healthPath = path.join(outputRoot, 'manifest', 'noor-content-health.json');

requireFile(collectionsPath);
requireFile(searchPath);
requireFile(manifestPath);
requireFile(healthPath);

const collections = readJson(collectionsPath);
if (!Array.isArray(collections)) fail('hadith/collections.json must be an array.');
if (collections.length === 0) fail('hadith/collections.json is empty.');

const collectionIds = collections.map((collection) => collection?.id).filter(Boolean);
if (collectionIds.length !== collections.length) fail('Every Hadith collection must have an id.');

const duplicateIds = countDuplicates(collectionIds);
if (duplicateIds.length > 0) {
  fail(`Duplicate Hadith collection id(s) remain: ${duplicateIds.map((item) => `${item.value} x${item.count}`).join(', ')}`);
}

const collectionIdSet = new Set(collectionIds);
let itemCount = 0;
let itemIdDuplicates = [];
let invalidItems = [];
const globalItemIds = [];

for (const collection of collections) {
  const itemsPath = path.join(outputRoot, 'hadith', collection.id, 'items.json');
  requireFile(itemsPath);
  const items = readJson(itemsPath);
  if (!Array.isArray(items)) fail(`Hadith items must be an array: ${rel(itemsPath)}`);
  if (items.length === 0) fail(`Hadith collection has no items: ${collection.id}`);
  itemCount += items.length;

  for (const [index, item] of items.entries()) {
    if (!item?.id) invalidItems.push(`${collection.id}[${index}] missing item.id`);
    if (item?.collectionId !== collection.id) invalidItems.push(`${collection.id}[${index}] has collectionId=${item?.collectionId}`);
    if (item?.id) globalItemIds.push(item.id);
  }
}

itemIdDuplicates = countDuplicates(globalItemIds);
if (invalidItems.length > 0) {
  fail(`Invalid Hadith items found:\n${invalidItems.slice(0, 30).join('\n')}`);
}
if (itemIdDuplicates.length > 0) {
  fail(`Duplicate Hadith item id(s) remain: ${itemIdDuplicates.slice(0, 20).map((item) => `${item.value} x${item.count}`).join(', ')}`);
}

const extraHadithDirs = fs.readdirSync(path.join(outputRoot, 'hadith'), { withFileTypes: true })
  .filter((entry) => entry.isDirectory())
  .map((entry) => entry.name)
  .filter((name) => !collectionIdSet.has(name));
if (extraHadithDirs.length > 0) {
  fail(`Hadith folder contains collection folders not listed in collections.json: ${extraHadithDirs.slice(0, 30).join(', ')}`);
}

const searchIndex = readJson(searchPath);
if (!Array.isArray(searchIndex)) fail('search/search-index.json must be an array.');
const hadithSearchEntries = searchIndex.filter((entry) => String(entry?.type ?? '').toLowerCase() === 'hadith');
if (hadithSearchEntries.length === 0) fail('Search index has no Hadith entries.');

const unknownSearchCollections = hadithSearchEntries
  .map((entry) => entry.collectionId ?? entry.collection ?? entry.bookId)
  .filter(Boolean)
  .filter((id) => !collectionIdSet.has(id));
if (unknownSearchCollections.length > 0) {
  fail(`Search index refers to unknown Hadith collection id(s): ${[...new Set(unknownSearchCollections)].slice(0, 30).join(', ')}`);
}

const manifest = readJson(manifestPath);
if (manifest?.hadithIdNormalization?.sprint !== '27.9.1') {
  fail('Manifest is missing hadithIdNormalization.sprint = 27.9.1. Run pnpm ilm:hadith:normalize-ids again.');
}
if (manifest?.canPushNoorCdnMain === true || manifest?.canPromoteToProduction === true) {
  fail('Unsafe manifest state: production/main promotion must remain blocked.');
}

const health = readJson(healthPath);
const healthCollections = Number(health?.summary?.hadithCollectionCount ?? 0);
const healthItems = Number(health?.summary?.hadithItemCount ?? 0);
if (healthCollections !== collections.length) fail(`Health hadithCollectionCount mismatch: ${healthCollections} vs ${collections.length}`);
if (healthItems !== itemCount) fail(`Health hadithItemCount mismatch: ${healthItems} vs ${itemCount}`);

if (fs.existsSync(REPORT_JSON)) {
  const report = readJson(REPORT_JSON);
  if (report.sprint !== '27.9.1') fail(`Unexpected normalization report sprint: ${report.sprint}`);
  if (Array.isArray(report.duplicateFinalIds) && report.duplicateFinalIds.length > 0) fail('Normalization report says duplicate final IDs remain.');
}

const hadithJsonFiles = walkFiles(path.join(outputRoot, 'hadith')).filter((file) => file.endsWith('.json')).length;
console.log('NOOR Sprint 27.9.1 Hadith normalized ID check passed.');
console.log(`Output root: ${rel(outputRoot)}`);
console.log(`Collections: ${collections.length}`);
console.log(`Hadith items: ${itemCount}`);
console.log(`Hadith JSON files: ${hadithJsonFiles}`);
console.log(`Hadith search entries: ${hadithSearchEntries.length}`);
console.log('Duplicate collection IDs: 0');
console.log('Duplicate item IDs: 0');
console.log('Production CDN remains blocked. noor-cdn/main remains blocked.');
