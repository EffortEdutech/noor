import { mkdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { createHash } from 'node:crypto';
import path from 'node:path';

const DEFAULT_INPUT = 'content-pipeline/importers/tafseer/samples/tafseer-import-sample.json';
const DEFAULT_OUTPUT = 'content-pipeline/imported/tafseer-v0.22/noor-cdn';
const DEFAULT_SOURCE_REGISTRY = 'content-pipeline/source-intake/noor-source-candidates.json';
const AUDIT_DIR = 'content-pipeline/imported/tafseer-v0.22/audit';
const ADAPTER_VERSION = '0.22.0';
const ADAPTER_ID = 'noor-tafseer-importer-v1';

function fail(message) {
  console.error(message);
  process.exit(1);
}

function argValue(name, fallback) {
  const prefix = `--${name}=`;
  const found = process.argv.find((arg) => arg.startsWith(prefix));
  if (!found) return fallback;
  return found.slice(prefix.length);
}

function readJson(file) {
  try {
    return JSON.parse(readFileSync(file, 'utf8'));
  } catch (error) {
    fail(`Unable to read JSON file: ${file}\n${error instanceof Error ? error.message : String(error)}`);
  }
}

function stableJson(value) {
  return `${JSON.stringify(value, null, 2)}\n`;
}

function sha256Text(value) {
  return createHash('sha256').update(value, 'utf8').digest('hex');
}

function padSurah(number) {
  return String(number).padStart(3, '0');
}

function requireString(value, label) {
  if (typeof value !== 'string' || value.trim().length === 0) {
    fail(`${label} must be a non-empty string.`);
  }
  return value.trim();
}

function validateSource(source) {
  const errors = [];
  if (source.version !== ADAPTER_VERSION) errors.push(`source.version must be ${ADAPTER_VERSION}.`);
  if (source.adapter !== ADAPTER_ID) errors.push(`source.adapter must be ${ADAPTER_ID}.`);
  if (!source.book || typeof source.book !== 'object') errors.push('source.book must be an object.');
  if (!Array.isArray(source.entries) || source.entries.length === 0) errors.push('source.entries must contain at least one tafseer entry.');

  const book = source.book ?? {};
  for (const field of ['bookId', 'title', 'language', 'author', 'description']) {
    if (typeof book[field] !== 'string' || book[field].trim().length === 0) errors.push(`book.${field} must be a non-empty string.`);
  }
  if (typeof book.bookId === 'string' && !/^[a-z0-9-]+$/.test(book.bookId)) errors.push('book.bookId must use lowercase slug format.');

  const seenEntryIds = new Set();
  for (const entry of source.entries ?? []) {
    if (typeof entry.id !== 'string' || entry.id.trim().length === 0) errors.push('Every tafseer entry needs an id.');
    if (seenEntryIds.has(entry.id)) errors.push(`Duplicate tafseer entry id: ${entry.id}.`);
    seenEntryIds.add(entry.id);

    if (!Number.isInteger(entry.surah) || entry.surah < 1 || entry.surah > 114) errors.push(`Invalid surah number for entry ${entry.id}: ${entry.surah}.`);
    if (!Number.isInteger(entry.fromAyah) || entry.fromAyah < 1) errors.push(`Invalid fromAyah for entry ${entry.id}.`);
    if (!Number.isInteger(entry.toAyah) || entry.toAyah < 1) errors.push(`Invalid toAyah for entry ${entry.id}.`);
    if (Number.isInteger(entry.fromAyah) && Number.isInteger(entry.toAyah) && entry.fromAyah > entry.toAyah) {
      errors.push(`Entry ${entry.id} has fromAyah greater than toAyah.`);
    }
    if (typeof entry.title !== 'string' || entry.title.trim().length === 0) errors.push(`Entry ${entry.id} missing title.`);
    if (typeof entry.body !== 'string' || entry.body.trim().length === 0) errors.push(`Entry ${entry.id} missing body.`);
    if (entry.tags !== undefined && !Array.isArray(entry.tags)) errors.push(`Entry ${entry.id} tags must be an array when provided.`);
  }

  if (errors.length > 0) {
    for (const error of errors) console.error(`- ${error}`);
    fail('NOOR Tafseer import source validation failed.');
  }
}

function findCandidate(sourceCandidateId, registryPath) {
  const registry = readJson(registryPath);
  return registry.candidateSources?.find((candidate) => candidate.id === sourceCandidateId) ?? null;
}

function buildOutput(source, candidate) {
  const generatedAt = new Date().toISOString();
  const book = source.book;
  const productionReady =
    source.productionApproved === true &&
    source.reviewerSignoff === true &&
    candidate?.approvalStatus === 'production-approved' &&
    candidate?.licenseStatus === 'approved';

  const gateReasons = [];
  if (!candidate) gateReasons.push('source-candidate-missing');
  if (candidate?.domain !== 'tafseer') gateReasons.push('candidate-domain-not-tafseer');
  if (candidate?.approvalStatus !== 'production-approved') gateReasons.push('candidate-not-production-approved');
  if (candidate?.licenseStatus !== 'approved') gateReasons.push('license-not-approved');
  if (source.productionApproved !== true) gateReasons.push('source-fixture-not-production-approved');
  if (source.reviewerSignoff !== true) gateReasons.push('reviewer-signoff-missing');

  const surahs = [...new Set(source.entries.map((entry) => entry.surah))].sort((a, b) => a - b);
  const booksIndex = {
    version: ADAPTER_VERSION,
    generatedAt,
    sourceCandidateId: source.sourceCandidateId,
    sourceLabel: source.sourceLabel,
    productionReady,
    books: [
      {
        bookId: book.bookId,
        title: book.title,
        language: book.language,
        author: book.author,
        translator: book.translator ?? null,
        description: book.description,
        routePattern: `tafseer/${book.bookId}/surahs/{surah}.json`,
        surahs
      }
    ]
  };

  const surahFiles = surahs.map((surah) => {
    const entries = source.entries
      .filter((entry) => entry.surah === surah)
      .sort((a, b) => a.fromAyah - b.fromAyah || a.toAyah - b.toAyah)
      .map((entry) => ({
        id: entry.id,
        bookId: book.bookId,
        language: book.language,
        surah: entry.surah,
        fromAyah: entry.fromAyah,
        toAyah: entry.toAyah,
        title: entry.title,
        body: entry.body,
        sourceLabel: source.sourceLabel,
        tags: entry.tags ?? [],
        source: {
          candidateId: source.sourceCandidateId,
          label: source.sourceLabel,
          licenseStatus: source.licenseStatus,
          productionApproved: source.productionApproved,
          attributionText: source.attributionText
        }
      }));

    return {
      route: `tafseer/${book.bookId}/surahs/${padSurah(surah)}.json`,
      content: entries
    };
  });

  const report = {
    version: ADAPTER_VERSION,
    adapterId: ADAPTER_ID,
    generatedAt,
    sourceId: source.id,
    sourceCandidateId: source.sourceCandidateId,
    sourceLabel: source.sourceLabel,
    sourceStatus: source.status,
    bookId: book.bookId,
    productionReady,
    productionGate: {
      status: productionReady ? 'passed' : 'blocked',
      reasons: gateReasons
    },
    importedBookCount: 1,
    importedSurahCount: surahs.length,
    importedEntryCount: source.entries.length,
    routes: [
      'metadata/tafseer-books.json',
      ...surahFiles.map((file) => file.route)
    ]
  };

  return { booksIndex, surahFiles, report };
}

function writeOutput(outputRoot, output) {
  rmSync(outputRoot, { recursive: true, force: true });
  mkdirSync(path.join(outputRoot, 'metadata'), { recursive: true });
  mkdirSync(path.join(outputRoot, 'manifest'), { recursive: true });
  for (const file of output.surahFiles) mkdirSync(path.dirname(path.join(outputRoot, file.route)), { recursive: true });
  mkdirSync(AUDIT_DIR, { recursive: true });

  const fileRecords = [];
  const writeJsonRecord = (relativePath, content) => {
    const payload = stableJson(content);
    writeFileSync(path.join(outputRoot, relativePath), payload, 'utf8');
    fileRecords.push({ path: relativePath, sha256: sha256Text(payload) });
  };

  writeJsonRecord('metadata/tafseer-books.json', output.booksIndex);
  for (const file of output.surahFiles) writeJsonRecord(file.route, file.content);

  output.report.files = fileRecords;
  writeJsonRecord('manifest/noor-tafseer-import-report.json', output.report);

  const audit = `# NOOR Tafseer Import Audit\n\nVersion: ${output.report.version}\nAdapter: ${output.report.adapterId}\nGenerated: ${output.report.generatedAt}\nSource: ${output.report.sourceId}\nCandidate: ${output.report.sourceCandidateId}\nBook: ${output.report.bookId}\nProduction gate: ${output.report.productionGate.status}\n\n## Imported Content\n\n- Books: ${output.report.importedBookCount}\n- Surahs: ${output.report.importedSurahCount}\n- Entries: ${output.report.importedEntryCount}\n- Production ready: ${output.report.productionReady ? 'yes' : 'no'}\n\n## Gate Reasons\n\n${output.report.productionGate.reasons.map((reason) => `- ${reason}`).join('\n')}\n\n## Files\n\n${fileRecords.map((record) => `- ${record.path} — ${record.sha256}`).join('\n')}\n`;
  writeFileSync(path.join(AUDIT_DIR, 'noor-tafseer-import-audit.md'), audit, 'utf8');
}

const inputPath = argValue('input', DEFAULT_INPUT);
const outputRoot = argValue('output', DEFAULT_OUTPUT);
const registryPath = argValue('registry', DEFAULT_SOURCE_REGISTRY);

const source = readJson(inputPath);
requireString(source.sourceCandidateId, 'source.sourceCandidateId');
requireString(source.attributionText, 'source.attributionText');
validateSource(source);

const candidate = findCandidate(source.sourceCandidateId, registryPath);
const output = buildOutput(source, candidate);
writeOutput(outputRoot, output);

console.log(`NOOR Tafseer import completed: ${output.report.importedBookCount} book, ${output.report.importedSurahCount} surah, ${output.report.importedEntryCount} entries.`);
console.log(`Production gate: ${output.report.productionGate.status}`);
console.log(`Report: ${path.join(outputRoot, 'manifest/noor-tafseer-import-report.json')}`);
