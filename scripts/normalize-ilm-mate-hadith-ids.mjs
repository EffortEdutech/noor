import crypto from 'node:crypto';
import { spawnSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const DEFAULT_OUTPUT_ROOT = 'content-pipeline/imported/ilm-mate-v1/noor-cdn';
const REPORT_DIR = path.join(root, 'content-pipeline', 'review', 'ilm-mate-v1', 'hadith-id-normalization');
const REPORT_JSON = path.join(REPORT_DIR, 'hadith-id-normalization-report.json');
const REPORT_MD = path.join(REPORT_DIR, 'hadith-id-normalization-report.md');

const LANGUAGE_MAP = {
  Arabic: 'ar', English: 'en', Malay: 'ms', Indonesian: 'id', Urdu: 'ur',
  ara: 'ar', ar: 'ar', eng: 'en', en: 'en', mal: 'ms', ms: 'ms', ind: 'id', id: 'id', urd: 'ur', ur: 'ur'
};
const SUPPORTED_NOOR_LANGUAGES = new Set(['ar', 'en', 'ms', 'id', 'ur']);

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

function ensureDir(dirPath) {
  fs.mkdirSync(dirPath, { recursive: true });
}

function readJson(filePath, fallback = null) {
  if (!fs.existsSync(filePath)) return fallback;
  const text = fs.readFileSync(filePath, 'utf8').trim();
  if (!text) return fallback;
  try {
    return JSON.parse(text);
  } catch (error) {
    throw new Error(`Invalid JSON in ${rel(filePath)}: ${error.message}`);
  }
}

function writeJson(filePath, value) {
  ensureDir(path.dirname(filePath));
  fs.writeFileSync(filePath, `${JSON.stringify(value, null, 2)}\n`, 'utf8');
}

function writeText(filePath, value) {
  ensureDir(path.dirname(filePath));
  fs.writeFileSync(filePath, value, 'utf8');
}

function normalizeWhitespace(value) {
  return String(value ?? '').replace(/\s+/g, ' ').trim();
}

function slugify(value) {
  return String(value ?? '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '') || 'unknown';
}

function sha256Buffer(buffer) {
  return crypto.createHash('sha256').update(buffer).digest('hex');
}

function sha256File(filePath) {
  return sha256Buffer(fs.readFileSync(filePath));
}

function candidateSourceRoots() {
  const cwd = process.cwd();
  return [
    process.env.ILM_MATE_CONTENT_ROOT,
    parseArg('source'),
    path.join(cwd, '..', 'muslim-companion-poc', 'content'),
    path.join(cwd, '..', 'ilm-mate', 'content'),
    path.join(cwd, 'content-pipeline', 'sources', 'ilm-mate', 'content'),
    path.join(cwd, 'content')
  ].filter(Boolean).map((item) => path.resolve(item));
}

function resolveSourceRoot() {
  const candidates = candidateSourceRoots();
  for (const candidate of candidates) {
    if (fs.existsSync(candidate)) return candidate;
  }
  console.error('Could not find ilm-mate content folder. Tried:');
  for (const candidate of candidates) console.error(`- ${candidate}`);
  process.exit(1);
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

function walkJsonFiles(dirPath) {
  return walkFiles(dirPath).filter((file) => file.endsWith('.json'));
}

function getLangCode(value, fallback = 'en') {
  const mapped = LANGUAGE_MAP[value] ?? LANGUAGE_MAP[String(value ?? '').toLowerCase()] ?? fallback;
  return SUPPORTED_NOOR_LANGUAGES.has(mapped) ? mapped : fallback;
}

function getHadithArray(payload) {
  if (Array.isArray(payload?.hadiths)) return payload.hadiths;
  if (Array.isArray(payload?.data)) return payload.data;
  if (Array.isArray(payload)) return payload;
  return [];
}

function collectionNameFromFile(filePath, payload, meta) {
  return payload?.metadata?.name ?? meta?.book ?? path.basename(path.dirname(filePath)) ?? 'Hadith Collection';
}

function findHadithFiles(sourceRoot) {
  const hadithDb = path.join(sourceRoot, 'hadith', 'db');
  return walkJsonFiles(hadithDb)
    .filter((file) => !toPosix(path.relative(hadithDb, file)).split('/').includes('metadata'))
    .sort((a, b) => toPosix(path.relative(hadithDb, a)).localeCompare(toPosix(path.relative(hadithDb, b))));
}

function buildRawRecords(sourceRoot) {
  const hadithDb = path.join(sourceRoot, 'hadith', 'db');
  const files = findHadithFiles(sourceRoot);
  const records = [];
  const skipped = [];

  for (const file of files) {
    const payload = readJson(file, null);
    if (!payload) continue;

    const meta = payload._ilmmate_meta ?? payload._meta ?? {};
    const edition = meta.edition ?? path.basename(file, '.json');
    const lang = getLangCode(meta.lang ?? String(edition).split('-')[0], 'en');

    if (!SUPPORTED_NOOR_LANGUAGES.has(lang)) {
      skipped.push({ file: toPosix(path.relative(sourceRoot, file)), edition, reason: `unsupported language ${meta.lang}` });
      continue;
    }

    const hadiths = getHadithArray(payload);
    if (hadiths.length === 0) {
      skipped.push({ file: toPosix(path.relative(sourceRoot, file)), edition, reason: 'empty hadith array' });
      continue;
    }

    const relativeFromDb = toPosix(path.relative(hadithDb, file));
    const relativeStem = relativeFromDb.replace(/\.json$/i, '');
    const collectionName = collectionNameFromFile(file, payload, meta);
    const oldId = slugify(edition);

    records.push({
      file,
      sourcePath: toPosix(path.relative(sourceRoot, file)),
      relativeFromDb,
      relativeStem,
      payload,
      meta,
      edition,
      lang,
      collectionName,
      oldId,
      hadiths
    });
  }

  return { records, skipped };
}

function allocateCollectionIds(records) {
  const baseCounts = new Map();
  for (const record of records) baseCounts.set(record.oldId, (baseCounts.get(record.oldId) ?? 0) + 1);

  const used = new Set();
  const duplicateBaseIds = [...baseCounts.entries()]
    .filter(([, count]) => count > 1)
    .map(([id, count]) => ({ id, count }));
  const changes = [];

  for (const record of records) {
    const baseCount = baseCounts.get(record.oldId) ?? 0;
    let collectionId = record.oldId;

    if (used.has(collectionId)) {
      const candidates = [
        slugify(record.relativeStem),
        slugify(`${record.meta?.book ?? ''}-${record.edition}`),
        slugify(`${record.collectionName}-${record.edition}`),
        slugify(`${record.lang}-${record.relativeStem}`)
      ].filter(Boolean);

      collectionId = candidates.find((candidate) => candidate && !used.has(candidate)) ?? collectionId;
      let suffix = 2;
      while (used.has(collectionId)) {
        collectionId = `${record.oldId}-${suffix}`;
        suffix += 1;
      }
    }

    used.add(collectionId);
    record.collectionId = collectionId;
    if (baseCount > 1 || collectionId !== record.oldId) {
      changes.push({
        sourcePath: record.sourcePath,
        oldId: record.oldId,
        newId: collectionId,
        duplicateGroupSize: baseCount,
        changed: collectionId !== record.oldId
      });
    }
  }

  return { duplicateBaseIds, changes };
}

function getHadithNumber(item, fallback) {
  const raw = item?.number ?? item?.hadithnumber ?? item?.hadithNumber ?? item?.id ?? fallback;
  return normalizeWhitespace(raw) || String(fallback);
}

function buildItems(record) {
  const usedItemIds = new Set();
  return record.hadiths.map((item, index) => {
    const number = getHadithNumber(item, index + 1);
    const numberSlug = slugify(number);
    let id = `${record.collectionId}-${numberSlug}`;
    let suffix = 2;
    while (usedItemIds.has(id)) {
      id = `${record.collectionId}-${numberSlug}-${suffix}`;
      suffix += 1;
    }
    usedItemIds.add(id);

    const arabic = normalizeWhitespace(item?.arab ?? item?.arabic ?? item?.ar ?? '');
    const text = normalizeWhitespace(item?.text ?? item?.translation ?? item?.body ?? item?.en ?? '');
    const translations = {};
    if (record.lang !== 'ar' && text) translations[record.lang] = text;

    return {
      id,
      collectionId: record.collectionId,
      book: record.meta?.book ?? record.payload?.metadata?.name ?? record.collectionName,
      chapter: item?.chapter ?? item?.bookName ?? undefined,
      number,
      narrator: item?.narrator ?? item?.by ?? undefined,
      arabic: arabic || (record.lang === 'ar' ? text : undefined),
      translations,
      sourceLabel: `${record.collectionName} · ${record.edition}`,
      tags: [record.meta?.book, record.lang, record.collectionId].filter(Boolean),
      migration: {
        sourcePath: record.sourcePath,
        oldCollectionId: record.oldId
      }
    };
  });
}

function countTafseerEntries(outputRoot) {
  const tafseerRoot = path.join(outputRoot, 'tafseer');
  let count = 0;
  for (const file of walkJsonFiles(tafseerRoot)) {
    const payload = readJson(file, []);
    if (Array.isArray(payload)) count += payload.length;
  }
  return count;
}

function countQuranAyat(outputRoot) {
  const quranRoot = path.join(outputRoot, 'quran', 'surahs');
  let count = 0;
  for (const file of walkJsonFiles(quranRoot)) {
    const payload = readJson(file, {});
    if (Array.isArray(payload?.ayahs)) count += payload.ayahs.length;
  }
  return count;
}

function rebuildManifestHealthAndFileIndex(outputRoot, hadithCollectionCount, hadithItemCount, notes) {
  const now = new Date().toISOString();
  const manifestPath = path.join(outputRoot, 'manifest', 'noor-content-manifest.json');
  const healthPath = path.join(outputRoot, 'manifest', 'noor-content-health.json');
  const fileIndexPath = path.join(outputRoot, 'manifest', 'file-index.json');

  const manifest = readJson(manifestPath, { datasets: {} });
  manifest.updatedAt = now;
  manifest.hadithIdNormalization = {
    sprint: '27.9.1',
    status: 'normalized',
    generatedAt: now,
    rule: 'Hadith collection IDs are globally unique across migrated ilm-mate source files.'
  };
  manifest.datasets = manifest.datasets ?? {};
  manifest.datasets.hadith = {
    ...(manifest.datasets.hadith ?? {}),
    itemCount: hadithItemCount,
    updatedAt: now,
    notes: 'Staging migration only. Sprint 27.9.1 normalized every Hadith collection ID to avoid duplicate React keys and CDN path collisions.'
  };
  writeJson(manifestPath, manifest);

  const surahIndex = readJson(path.join(outputRoot, 'metadata', 'surah-index.json'), []);
  const quranAyat = countQuranAyat(outputRoot);
  const tafseerEntries = countTafseerEntries(outputRoot);

  const health = readJson(healthPath, {});
  health.manifest = manifest;
  health.generatedAt = now;
  health.isHealthy = true;
  health.summary = {
    ...(health.summary ?? {}),
    surahIndexedCount: Array.isArray(surahIndex) ? surahIndex.length : 0,
    surahContentCount: walkJsonFiles(path.join(outputRoot, 'quran', 'surahs')).length,
    ayahContentCount: quranAyat,
    tafseerEntryCount: tafseerEntries,
    hadithCollectionCount,
    hadithItemCount
  };
  const oldIssues = Array.isArray(health.issues) ? health.issues.filter((issue) => !(String(issue?.message ?? '').toLowerCase().includes('hadith') && String(issue?.message ?? '').toLowerCase().includes('duplicate'))) : [];
  health.issues = [
    ...oldIssues,
    ...notes.map((message) => ({ severity: 'info', area: 'hadith', message }))
  ];
  writeJson(healthPath, health);

  const files = walkJsonFiles(outputRoot).map((file) => ({
    path: toPosix(path.relative(outputRoot, file)),
    bytes: fs.statSync(file).size,
    sha256: sha256File(file)
  }));
  writeJson(fileIndexPath, { generatedAt: now, files });
}

function rebuildSearchIndex(outputRoot) {
  const result = spawnSync(process.execPath, ['scripts/build-noor-cdn-search-index.mjs', outputRoot, outputRoot], {
    stdio: 'inherit',
    shell: false
  });
  if (result.error) throw result.error;
  if (result.status !== 0) process.exit(result.status ?? 1);
}

function renderMarkdown(report) {
  const largestDuplicateGroups = report.duplicateBaseIds
    .slice(0, 20)
    .map((item) => `- \`${item.id}\` appeared ${item.count} times`)
    .join('\n') || '- None';
  const changedRows = report.changedCollectionIds
    .filter((item) => item.changed)
    .slice(0, 40)
    .map((item) => `- \`${item.oldId}\` → \`${item.newId}\` from \`${item.sourcePath}\``)
    .join('\n') || '- None';

  return `# NOOR Sprint 27.9.1 — Hadith Collection ID Normalization\n\n` +
    `Generated: ${report.generatedAt}\n\n` +
    `## Result\n\n` +
    `- Status: **${report.status}**\n` +
    `- Source root: \`${report.sourceRoot}\`\n` +
    `- Output root: \`${report.outputRoot}\`\n` +
    `- Collections: **${report.collectionCount}**\n` +
    `- Hadith items: **${report.itemCount}**\n` +
    `- Duplicate old ID groups found: **${report.duplicateBaseIds.length}**\n` +
    `- Collection IDs changed: **${report.changedCollectionIds.filter((item) => item.changed).length}**\n` +
    `- Duplicate final IDs: **${report.duplicateFinalIds.length}**\n\n` +
    `## Duplicate old ID groups\n\n${largestDuplicateGroups}\n\n` +
    `## Sample changed collection IDs\n\n${changedRows}\n\n` +
    `## Guardrail\n\n` +
    `This fixes staging content only. Production CDN and \`noor-cdn/main\` remain blocked.\n`;
}

function main() {
  const sourceRoot = resolveSourceRoot();
  const outputRoot = path.resolve(parseArg('output', DEFAULT_OUTPUT_ROOT));
  const hadithOutputRoot = path.join(outputRoot, 'hadith');

  if (!fs.existsSync(outputRoot)) {
    console.error(`Migrated output root is missing: ${rel(outputRoot)}`);
    console.error('Run pnpm ilm:migrate:all first.');
    process.exit(1);
  }

  const { records, skipped } = buildRawRecords(sourceRoot);
  const { duplicateBaseIds, changes } = allocateCollectionIds(records);

  fs.rmSync(hadithOutputRoot, { recursive: true, force: true });
  ensureDir(hadithOutputRoot);

  const collections = [];
  let itemCount = 0;

  for (const record of records) {
    const items = buildItems(record);
    writeJson(path.join(hadithOutputRoot, record.collectionId, 'items.json'), items);
    itemCount += items.length;

    collections.push({
      id: record.collectionId,
      name: `${record.collectionName} — ${record.edition}`,
      language: record.lang,
      description: `Migrated from ilm-mate ${record.edition}. Staging only pending NOOR review approval.`,
      migration: {
        sourcePath: record.sourcePath,
        oldCollectionId: record.oldId,
        normalizedInSprint: '27.9.1'
      }
    });
  }

  collections.sort((a, b) => a.id.localeCompare(b.id));
  writeJson(path.join(hadithOutputRoot, 'collections.json'), collections);

  rebuildSearchIndex(outputRoot);

  const finalIds = collections.map((item) => item.id);
  const idCounts = new Map();
  for (const id of finalIds) idCounts.set(id, (idCounts.get(id) ?? 0) + 1);
  const duplicateFinalIds = [...idCounts.entries()].filter(([, count]) => count > 1).map(([id, count]) => ({ id, count }));

  const notes = [
    `Sprint 27.9.1 normalized Hadith collection IDs. Duplicate final IDs: ${duplicateFinalIds.length}.`,
    `Old duplicate groups resolved: ${duplicateBaseIds.length}.`,
    'This remains staging-only content. Production CDN remains blocked.'
  ];
  rebuildManifestHealthAndFileIndex(outputRoot, collections.length, itemCount, notes);

  const report = {
    sprint: '27.9.1',
    label: 'Hadith collection ID normalization',
    generatedAt: new Date().toISOString(),
    status: duplicateFinalIds.length === 0 ? 'normalized' : 'failed-duplicates-remain',
    sourceRoot,
    outputRoot: rel(outputRoot),
    collectionCount: collections.length,
    itemCount,
    skipped,
    duplicateBaseIds,
    changedCollectionIds: changes,
    duplicateFinalIds,
    productionApproved: false,
    canPushNoorCdnMain: false,
    canPromoteToProduction: false,
    allowedTarget: 'noor-cdn/staging-ilm-mate-v1',
    blockedTargets: ['noor-cdn/main', 'production CDN']
  };

  writeJson(REPORT_JSON, report);
  writeText(REPORT_MD, renderMarkdown(report));

  console.log('NOOR Sprint 27.9.1 Hadith collection ID normalization complete.');
  console.log(`Collections: ${report.collectionCount}`);
  console.log(`Hadith items: ${report.itemCount}`);
  console.log(`Old duplicate ID groups resolved: ${report.duplicateBaseIds.length}`);
  console.log(`Final duplicate collection IDs: ${report.duplicateFinalIds.length}`);
  console.log(`Report: ${rel(REPORT_MD)}`);

  if (duplicateFinalIds.length > 0) process.exit(1);
}

main();
