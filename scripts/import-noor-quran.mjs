import { mkdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { createHash } from 'node:crypto';
import path from 'node:path';

const DEFAULT_INPUT = 'content-pipeline/importers/quran/samples/quran-import-sample.json';
const DEFAULT_OUTPUT = 'content-pipeline/imported/quran-v0.20/noor-cdn';
const DEFAULT_SOURCE_REGISTRY = 'content-pipeline/source-intake/noor-source-candidates.json';
const AUDIT_DIR = 'content-pipeline/imported/quran-v0.20/audit';
const ADAPTER_VERSION = '0.20.0';
const ADAPTER_ID = 'noor-quran-importer-v1';

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

function ayahKey(surah, ayah) {
  return `${surah}:${ayah}`;
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
  if (!Array.isArray(source.surahs) || source.surahs.length === 0) errors.push('source.surahs must contain at least one surah.');

  const seenSurahs = new Set();
  const seenAyahs = new Set();

  for (const surah of source.surahs ?? []) {
    if (!Number.isInteger(surah.number) || surah.number < 1 || surah.number > 114) errors.push(`Invalid surah number: ${surah.number}.`);
    if (seenSurahs.has(surah.number)) errors.push(`Duplicate surah number: ${surah.number}.`);
    seenSurahs.add(surah.number);

    for (const field of ['slug', 'nameArabic', 'nameTransliteration', 'nameEnglish', 'revelation']) {
      if (typeof surah[field] !== 'string' || surah[field].trim().length === 0) errors.push(`Surah ${surah.number} missing ${field}.`);
    }

    if (!['makki', 'madani'].includes(surah.revelation)) errors.push(`Surah ${surah.number} revelation must be makki or madani.`);
    if (!Number.isInteger(surah.ayahCount) || surah.ayahCount < 1) errors.push(`Surah ${surah.number} ayahCount must be a positive integer.`);
    if (!Array.isArray(surah.ayahs)) errors.push(`Surah ${surah.number} ayahs must be an array.`);
    if (Array.isArray(surah.ayahs) && surah.ayahs.length !== surah.ayahCount) {
      errors.push(`Surah ${surah.number} ayahCount ${surah.ayahCount} does not match ayahs length ${surah.ayahs.length}.`);
    }

    for (const ayah of surah.ayahs ?? []) {
      if (!Number.isInteger(ayah.ayah) || ayah.ayah < 1) errors.push(`Surah ${surah.number} has invalid ayah number: ${ayah.ayah}.`);
      const key = ayahKey(surah.number, ayah.ayah);
      if (seenAyahs.has(key)) errors.push(`Duplicate ayah key: ${key}.`);
      seenAyahs.add(key);
      if (typeof ayah.arabic !== 'string' || ayah.arabic.trim().length === 0) errors.push(`Ayah ${key} missing arabic text.`);
      if (!ayah.translations || typeof ayah.translations !== 'object') errors.push(`Ayah ${key} missing translations object.`);
      if (!ayah.translations?.en || !ayah.translations?.ms) errors.push(`Ayah ${key} must include en and ms translations for this fixture.`);
    }
  }

  if (errors.length > 0) {
    for (const error of errors) console.error(`- ${error}`);
    fail('NOOR Quran import source validation failed.');
  }
}

function findCandidate(sourceCandidateId, registryPath) {
  const registry = readJson(registryPath);
  return registry.candidateSources?.find((candidate) => candidate.id === sourceCandidateId) ?? null;
}

function buildOutput(source, candidate) {
  const generatedAt = new Date().toISOString();
  const productionReady =
    source.productionApproved === true &&
    source.reviewerSignoff === true &&
    candidate?.approvalStatus === 'production-approved' &&
    candidate?.licenseStatus === 'approved';

  const gateReasons = [];
  if (!candidate) gateReasons.push('source-candidate-missing');
  if (candidate?.approvalStatus !== 'production-approved') gateReasons.push('candidate-not-production-approved');
  if (candidate?.licenseStatus !== 'approved') gateReasons.push('license-not-approved');
  if (source.productionApproved !== true) gateReasons.push('source-fixture-not-production-approved');
  if (source.reviewerSignoff !== true) gateReasons.push('reviewer-signoff-missing');

  const surahIndex = {
    version: ADAPTER_VERSION,
    generatedAt,
    sourceCandidateId: source.sourceCandidateId,
    sourceLabel: source.sourceLabel,
    productionReady,
    surahs: source.surahs.map((surah) => ({
      number: surah.number,
      slug: surah.slug,
      nameArabic: surah.nameArabic,
      nameTransliteration: surah.nameTransliteration,
      nameEnglish: surah.nameEnglish,
      revelation: surah.revelation,
      ayahCount: surah.ayahCount,
      route: `quran/surahs/${padSurah(surah.number)}.json`
    }))
  };

  const surahFiles = source.surahs.map((surah) => ({
    route: `quran/surahs/${padSurah(surah.number)}.json`,
    content: {
      version: ADAPTER_VERSION,
      generatedAt,
      sourceCandidateId: source.sourceCandidateId,
      productionReady,
      surah: {
        number: surah.number,
        slug: surah.slug,
        nameArabic: surah.nameArabic,
        nameTransliteration: surah.nameTransliteration,
        nameEnglish: surah.nameEnglish,
        revelation: surah.revelation,
        ayahCount: surah.ayahCount
      },
      ayahs: surah.ayahs.map((ayah) => ({
        surah: surah.number,
        ayah: ayah.ayah,
        key: ayahKey(surah.number, ayah.ayah),
        arabic: ayah.arabic,
        translations: ayah.translations,
        source: {
          candidateId: source.sourceCandidateId,
          label: source.sourceLabel,
          licenseStatus: source.licenseStatus,
          productionApproved: source.productionApproved
        }
      }))
    }
  }));

  const totalAyahCount = source.surahs.reduce((sum, surah) => sum + surah.ayahs.length, 0);
  const report = {
    version: ADAPTER_VERSION,
    adapterId: ADAPTER_ID,
    generatedAt,
    sourceId: source.id,
    sourceCandidateId: source.sourceCandidateId,
    sourceLabel: source.sourceLabel,
    sourceStatus: source.status,
    productionReady,
    productionGate: {
      status: productionReady ? 'passed' : 'blocked',
      reasons: gateReasons
    },
    importedSurahCount: source.surahs.length,
    importedAyahCount: totalAyahCount,
    routes: [
      'metadata/surah-index.json',
      ...surahFiles.map((file) => file.route)
    ]
  };

  return { surahIndex, surahFiles, report };
}

function writeOutput(outputRoot, output) {
  rmSync(outputRoot, { recursive: true, force: true });
  mkdirSync(path.join(outputRoot, 'metadata'), { recursive: true });
  mkdirSync(path.join(outputRoot, 'manifest'), { recursive: true });
  mkdirSync(path.join(outputRoot, 'quran', 'surahs'), { recursive: true });
  mkdirSync(AUDIT_DIR, { recursive: true });

  const fileRecords = [];

  const writeJsonRecord = (relativePath, content) => {
    const payload = stableJson(content);
    writeFileSync(path.join(outputRoot, relativePath), payload, 'utf8');
    fileRecords.push({ path: relativePath, sha256: sha256Text(payload) });
  };

  writeJsonRecord('metadata/surah-index.json', output.surahIndex);
  for (const file of output.surahFiles) writeJsonRecord(file.route, file.content);

  output.report.files = fileRecords;
  writeJsonRecord('manifest/noor-quran-import-report.json', output.report);

  const audit = `# NOOR Quran Import Audit

Version: ${output.report.version}
Adapter: ${output.report.adapterId}
Generated: ${output.report.generatedAt}
Source: ${output.report.sourceId}
Candidate: ${output.report.sourceCandidateId}
Production gate: ${output.report.productionGate.status}

## Imported Content

- Surahs: ${output.report.importedSurahCount}
- Ayat: ${output.report.importedAyahCount}
- Production ready: ${output.report.productionReady ? 'yes' : 'no'}

## Gate Reasons

${output.report.productionGate.reasons.map((reason) => `- ${reason}`).join('\n')}

## Files

${fileRecords.map((record) => `- ${record.path} — ${record.sha256}`).join('\n')}
`;
  writeFileSync(path.join(AUDIT_DIR, 'noor-quran-import-audit.md'), audit, 'utf8');
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

console.log(`NOOR Quran import completed: ${output.report.importedSurahCount} surahs, ${output.report.importedAyahCount} ayat.`);
console.log(`Production gate: ${output.report.productionGate.status}`);
console.log(`Report: ${path.join(outputRoot, 'manifest/noor-quran-import-report.json')}`);
