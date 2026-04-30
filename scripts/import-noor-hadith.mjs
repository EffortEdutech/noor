import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import path from 'node:path';

const IMPORT_VERSION = '0.23.0';
const ADAPTER_ID = 'noor-hadith-importer-v1';
const SAMPLE_FILE = 'content-pipeline/importers/hadith/samples/hadith-import-sample.json';
const CANDIDATE_REGISTRY = 'content-pipeline/source-intake/noor-source-candidates.json';
const OUTPUT_ROOT = 'content-pipeline/imported/hadith-v0.23';
const CDN_ROOT = path.join(OUTPUT_ROOT, 'noor-cdn');
const MANIFEST_ROOT = path.join(CDN_ROOT, 'manifest');
const HADITH_ROOT = path.join(CDN_ROOT, 'hadith');
const AUDIT_ROOT = path.join(OUTPUT_ROOT, 'audit');

function fail(message) {
  console.error(message);
  process.exit(1);
}

function readJson(file) {
  return JSON.parse(readFileSync(file, 'utf8'));
}

function writeJson(file, data) {
  mkdirSync(path.dirname(file), { recursive: true });
  writeFileSync(file, `${JSON.stringify(data, null, 2)}\n`, 'utf8');
}

function requireString(value, label) {
  if (typeof value !== 'string' || value.trim().length === 0) {
    fail(`Missing required string: ${label}`);
  }
  return value.trim();
}

const source = readJson(SAMPLE_FILE);
if (source.adapter !== ADAPTER_ID) fail(`Expected adapter ${ADAPTER_ID}.`);
if (source.version !== IMPORT_VERSION) fail(`Expected source version ${IMPORT_VERSION}.`);

const registry = readJson(CANDIDATE_REGISTRY);
const candidateSources = Array.isArray(registry.candidateSources)
  ? registry.candidateSources
  : Array.isArray(registry.candidates)
    ? registry.candidates
    : [];
const candidate = candidateSources.find((item) => item.id === source.sourceCandidateId);
if (!candidate) fail(`Source candidate not found: ${source.sourceCandidateId}`);
if (candidate.domain !== 'hadith') fail(`Source candidate must be hadith, got ${candidate.domain}.`);

const gateReasons = [];
if (source.productionApproved !== true) gateReasons.push('candidate-not-production-approved');
if (source.reviewerSignoff !== true) gateReasons.push('reviewer-signoff-missing');
if (candidate.approvalStatus !== 'production-approved') gateReasons.push('source-intake-not-production-approved');
if (candidate.licenseStatus !== 'approved') gateReasons.push('license-not-approved');

const collection = source.collection ?? {};
const collectionId = requireString(collection.id, 'collection.id');
const normalizedCollection = {
  id: collectionId,
  name: requireString(collection.name, 'collection.name'),
  language: requireString(collection.language, 'collection.language'),
  description: requireString(collection.description, 'collection.description')
};

if (!Array.isArray(source.items) || source.items.length === 0) {
  fail('Hadith import source must include at least one item.');
}

const seenIds = new Set();
const seenNumbers = new Set();
const normalizedItems = source.items.map((item, index) => {
  const id = requireString(item.id, `items[${index}].id`);
  const number = requireString(item.number, `items[${index}].number`);
  if (seenIds.has(id)) fail(`Duplicate hadith item id: ${id}`);
  if (seenNumbers.has(number)) fail(`Duplicate hadith item number: ${number}`);
  seenIds.add(id);
  seenNumbers.add(number);

  if (!item.translations || typeof item.translations !== 'object' || Object.keys(item.translations).length === 0) {
    fail(`Hadith item ${id} must include translations.`);
  }

  const normalized = {
    id,
    collectionId,
    number,
    translations: item.translations,
    sourceLabel: requireString(item.sourceLabel ?? source.sourceLabel, `items[${index}].sourceLabel`),
    tags: Array.isArray(item.tags) ? Array.from(new Set(item.tags.map((tag) => String(tag).trim()).filter(Boolean))) : []
  };

  if (item.book) normalized.book = String(item.book);
  if (item.chapter) normalized.chapter = String(item.chapter);
  if (item.narrator) normalized.narrator = String(item.narrator);
  if (item.arabic) normalized.arabic = String(item.arabic);
  if (item.grading) normalized.grading = String(item.grading);
  normalized.source = {
    candidateId: source.sourceCandidateId,
    attributionText: requireString(source.attributionText, 'attributionText'),
    sourceLabel: requireString(source.sourceLabel, 'sourceLabel'),
    licenseStatus: requireString(source.licenseStatus, 'licenseStatus')
  };

  return normalized;
});

writeJson(path.join(HADITH_ROOT, 'collections.json'), [normalizedCollection]);
writeJson(path.join(HADITH_ROOT, collectionId, 'items.json'), normalizedItems);

const productionReady = gateReasons.length === 0;
const report = {
  id: 'noor-hadith-import-report-v0.23',
  version: IMPORT_VERSION,
  adapterId: ADAPTER_ID,
  generatedAt: new Date().toISOString(),
  sourceFile: SAMPLE_FILE,
  sourceCandidateId: source.sourceCandidateId,
  importedCollectionCount: 1,
  importedItemCount: normalizedItems.length,
  routeFiles: [
    'hadith/collections.json',
    `hadith/${collectionId}/items.json`
  ],
  productionReady,
  productionGate: {
    status: productionReady ? 'passed' : 'blocked',
    reasons: gateReasons
  }
};
writeJson(path.join(MANIFEST_ROOT, 'noor-hadith-import-report.json'), report);

mkdirSync(AUDIT_ROOT, { recursive: true });
const audit = `# NOOR Hadith Import Audit

Version: ${IMPORT_VERSION}
Adapter: ${ADAPTER_ID}
Source: ${SAMPLE_FILE}
Candidate: ${source.sourceCandidateId}
Collection: ${collectionId}
Items imported: ${normalizedItems.length}
Production gate: ${report.productionGate.status}

## Gate reasons

${gateReasons.map((reason) => `- ${reason}`).join('\n') || '- none'}

## Route files

${report.routeFiles.map((file) => `- ${file}`).join('\n')}

## Note

This Sprint 23 fixture proves the hadith importer route contract only. It is not approved for production scholarly use.
`;
writeFileSync(path.join(AUDIT_ROOT, 'noor-hadith-import-audit.md'), audit, 'utf8');

console.log(`NOOR Hadith import completed: 1 collection, ${normalizedItems.length} items.`);
console.log(`Production gate: ${report.productionGate.status}`);
console.log(`Report: ${path.join(MANIFEST_ROOT, 'noor-hadith-import-report.json')}`);
