import { createHash } from 'node:crypto';
import { spawnSync } from 'node:child_process';
import { existsSync, mkdirSync, readdirSync, readFileSync, rmSync, statSync, writeFileSync } from 'node:fs';
import { dirname, join, relative, resolve } from 'node:path';

const DEFAULT_OUTPUT_ROOT = 'content-pipeline/imported/ilm-mate-v1/noor-cdn';
const REVIEW_ROOT = 'content-pipeline/review/ilm-mate-v1/hadith-view-model';
const SUPPORTED_NOOR_LANGUAGES = new Set(['ar', 'en', 'ms', 'id', 'ur']);
const LANGUAGE_MAP = {
  Arabic: 'ar', English: 'en', Malay: 'ms', Indonesian: 'id', Urdu: 'ur',
  ara: 'ar', ar: 'ar', eng: 'en', en: 'en', mal: 'ms', ms: 'ms', ind: 'id', id: 'id', urd: 'ur', ur: 'ur'
};

function parseArg(name, fallback = undefined) {
  const prefix = `--${name}=`;
  const inline = process.argv.find((arg) => arg.startsWith(prefix));
  if (inline) return inline.slice(prefix.length);
  const index = process.argv.indexOf(`--${name}`);
  if (index >= 0 && process.argv[index + 1]) return process.argv[index + 1];
  return fallback;
}

const OUTPUT_ROOT = resolve(parseArg('output', DEFAULT_OUTPUT_ROOT));

function candidateSourceRoots() {
  const cwd = process.cwd();
  return [
    process.env.ILM_MATE_CONTENT_ROOT,
    parseArg('source'),
    join(cwd, '..', 'muslim-companion-poc', 'content'),
    join(cwd, '..', 'ilm-mate', 'content'),
    join(cwd, 'content-pipeline', 'sources', 'ilm-mate', 'content'),
    join(cwd, 'content')
  ].filter(Boolean).map((p) => resolve(p));
}

function resolveSourceRoot() {
  for (const candidate of candidateSourceRoots()) {
    if (existsSync(candidate)) return candidate;
  }
  console.error('Could not find ilm-mate content folder. Set ILM_MATE_CONTENT_ROOT or clone muslim-companion-poc next to NOOR.');
  process.exit(1);
}

function readJson(file, fallback = null) {
  if (!existsSync(file)) return fallback;
  const text = readFileSync(file, 'utf8').trim();
  if (!text) return fallback;
  try { return JSON.parse(text); } catch (error) { throw new Error(`Invalid JSON in ${file}: ${error.message}`); }
}

function writeJson(file, value) {
  mkdirSync(dirname(file), { recursive: true });
  writeFileSync(file, `${JSON.stringify(value, null, 2)}\n`, 'utf8');
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

function safeSegment(value) {
  return slugify(value).replace(/-+/g, '-');
}

function sha256Text(value) {
  return createHash('sha256').update(value).digest('hex');
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

function collectionNameFromFile(file, payload, meta) {
  return payload?.metadata?.name ?? meta?.book ?? file.split(/[\\/]/).slice(-2, -1)[0] ?? 'Hadith Collection';
}

function findHadithFiles(sourceRoot) {
  return walkJsonFiles(join(sourceRoot, 'hadith', 'db')).filter((file) => !file.includes(`${join('metadata')}`));
}

function sourceViewFromRelative(relativeSourcePath) {
  const normalized = relativeSourcePath.replaceAll('\\', '/');
  if (normalized.includes('/by_chapter/') || normalized.includes('/by-chapter/')) return 'by_chapter';
  if (normalized.includes('/by_book/') || normalized.includes('/by-book/')) return 'by_book';
  return 'legacy';
}

function collectionIdFromRelative(relativeSourcePath) {
  const normalized = relativeSourcePath
    .replaceAll('\\', '/')
    .replace(/^hadith\/db\//, '')
    .replace(/\.json$/i, '');
  return normalized.split('/').map(safeSegment).filter(Boolean).join('__');
}

function canonicalBookSlug(file, payload, meta, collectionName) {
  return slugify(meta?.book ?? payload?.metadata?.name ?? collectionName ?? file.split(/[\\/]/).slice(-2, -1)[0]);
}

function updateManifestAndHealth(outputRoot, report) {
  const manifestPath = join(outputRoot, 'manifest', 'noor-content-manifest.json');
  const healthPath = join(outputRoot, 'manifest', 'noor-content-health.json');
  const manifest = readJson(manifestPath, null);
  const health = readJson(healthPath, null);

  if (manifest?.datasets?.hadith) {
    manifest.datasets.hadith.itemCount = report.hadithItemCount;
    manifest.datasets.hadith.status = report.hadithItemCount > 0 ? 'partial' : 'missing';
    manifest.datasets.hadith.notes = 'Staging migration only. Hadith is normalized into separate by_book and by_chapter navigation views. Same canonical Hadith may appear in multiple views.';
    manifest.datasets.hadith.updatedAt = report.generatedAt;
    writeJson(manifestPath, manifest);
  }

  if (health?.summary) {
    health.generatedAt = report.generatedAt;
    health.summary.hadithCollectionCount = report.hadithCollectionCount;
    health.summary.hadithItemCount = report.hadithItemCount;
    health.isHealthy = !health.issues?.some((issue) => issue.severity === 'error');
    writeJson(healthPath, health);
  }
}

function rebuildSearchIndex(outputRoot) {
  const result = spawnSync(process.execPath, ['scripts/build-noor-cdn-search-index.mjs', outputRoot, outputRoot], {
    stdio: 'inherit', shell: false
  });
  if (result.error) throw result.error;
  if (result.status !== 0) process.exit(result.status ?? 1);
}

function rebuildFileIndex(outputRoot, generatedAt) {
  const files = walkJsonFiles(outputRoot).map((file) => {
    const text = readFileSync(file, 'utf8');
    return {
      path: relative(outputRoot, file).replaceAll('\\', '/'),
      bytes: statSync(file).size,
      sha256: sha256Text(text)
    };
  });
  writeJson(join(outputRoot, 'manifest', 'file-index.json'), { generatedAt, files });
}

function writeReviewReport(report) {
  writeJson(join(REVIEW_ROOT, 'hadith-view-model-report.json'), report);
  const lines = [
    '# Sprint 27.9.2 — Hadith View Model Normalization',
    '',
    `Generated: ${report.generatedAt}`,
    `Source root: \`${report.sourceRoot}\``,
    `Output root: \`${report.outputRoot}\``,
    '',
    '## Summary',
    '',
    `- Hadith source files read: ${report.sourceFileCount}`,
    `- Collections generated: ${report.hadithCollectionCount}`,
    `- Items generated: ${report.hadithItemCount}`,
    `- by_book collections: ${report.byBookCollectionCount}`,
    `- by_chapter collections: ${report.byChapterCollectionCount}`,
    `- Duplicate collection ids: ${report.duplicateCollectionIds.length}`,
    `- Duplicate item ids inside a collection: ${report.duplicateItemIds.length}`,
    '',
    '## Model',
    '',
    '- by_book and by_chapter are navigation views, not duplicate errors.',
    '- collection.id is globally unique and generated from the source path.',
    '- canonicalHadithId may repeat across views because the same Hadith may appear by book and by chapter.',
    '- viewItemId is unique for rendering/search view output.',
    '',
    '## Gate',
    '',
    '- noor-cdn/staging-ilm-mate-v1 may be updated after checks pass.',
    '- noor-cdn/main remains blocked.',
    '- Production CDN remains blocked.'
  ];
  mkdirSync(REVIEW_ROOT, { recursive: true });
  writeFileSync(join(REVIEW_ROOT, 'hadith-view-model-report.md'), `${lines.join('\n')}\n`, 'utf8');
}

function buildHadithViewModel() {
  const sourceRoot = resolveSourceRoot();
  const outputRoot = OUTPUT_ROOT;
  const hadithOut = join(outputRoot, 'hadith');
  rmSync(hadithOut, { recursive: true, force: true });
  mkdirSync(hadithOut, { recursive: true });

  const files = findHadithFiles(sourceRoot);
  const collections = [];
  const duplicateCollectionIds = [];
  const duplicateItemIds = [];
  const seenCollections = new Set();
  let hadithItemCount = 0;
  let byBookCollectionCount = 0;
  let byChapterCollectionCount = 0;

  for (const file of files) {
    const payload = readJson(file, null);
    if (!payload) continue;
    const hadiths = getHadithArray(payload);
    if (hadiths.length === 0) continue;

    const meta = payload._ilmmate_meta ?? payload._meta ?? {};
    const relativeSourcePath = relative(sourceRoot, file).replaceAll('\\', '/');
    const sourceView = sourceViewFromRelative(relativeSourcePath);
    if (sourceView !== 'by_book' && sourceView !== 'by_chapter') continue;

    const collectionId = collectionIdFromRelative(relativeSourcePath);
    if (seenCollections.has(collectionId)) duplicateCollectionIds.push(collectionId);
    seenCollections.add(collectionId);

    const edition = meta.edition ?? file.replace(/\.json$/, '').split(/[\\/]/).pop();
    const lang = getLangCode(meta.lang ?? edition?.split('-')[0], 'en');
    if (!SUPPORTED_NOOR_LANGUAGES.has(lang)) continue;

    const collectionName = collectionNameFromFile(file, payload, meta);
    const bookSlug = canonicalBookSlug(file, payload, meta, collectionName);
    const sourceParts = relativeSourcePath.replace(/\.json$/i, '').split('/');
    const sourceScope = sourceParts.slice(3, -1).join('/') || sourceParts.slice(-2, -1)[0] || 'unknown';
    const itemIdsInCollection = new Set();
    const items = [];

    for (const [index, item] of hadiths.entries()) {
      const number = String(item.number ?? item.hadithnumber ?? item.hadithNumber ?? item.id ?? index + 1);
      const normalizedNumber = slugify(number);
      const arabic = normalizeWhitespace(item.arab ?? item.arabic ?? item.ar ?? '');
      const text = normalizeWhitespace(item.text ?? item.translation ?? item.body ?? item.en ?? '');
      const translations = {};
      if (lang !== 'ar' && text) translations[lang] = text;

      const canonicalHadithId = `${bookSlug}:${normalizedNumber || index + 1}`;
      const viewItemId = `${collectionId}__${normalizedNumber || index + 1}__${index + 1}`;
      if (itemIdsInCollection.has(viewItemId)) duplicateItemIds.push(`${collectionId}/${viewItemId}`);
      itemIdsInCollection.add(viewItemId);

      items.push({
        id: viewItemId,
        collectionId,
        canonicalHadithId,
        viewItemId,
        sourceView,
        sourcePath: relativeSourcePath,
        book: meta.book ?? payload?.metadata?.name ?? collectionName,
        chapter: item.chapter ?? item.bookName ?? item.chapterName ?? undefined,
        number,
        narrator: item.narrator ?? item.by ?? undefined,
        arabic: arabic || (lang === 'ar' ? text : undefined),
        translations,
        sourceLabel: `${collectionName} · ${sourceView === 'by_book' ? 'By book' : 'By chapter'} · ${edition}`,
        tags: [sourceView, meta.book, lang, collectionId, canonicalHadithId].filter(Boolean)
      });
    }

    if (items.length === 0) continue;
    if (sourceView === 'by_book') byBookCollectionCount += 1;
    if (sourceView === 'by_chapter') byChapterCollectionCount += 1;

    collections.push({
      id: collectionId,
      name: `${collectionName} — ${sourceView === 'by_book' ? 'By book' : 'By chapter'}`,
      language: lang,
      description: `Migrated from ilm-mate ${relativeSourcePath}. Staging only pending NOOR review approval.`,
      sourceView,
      viewMode: sourceView,
      sourcePath: relativeSourcePath,
      sourceBook: meta.book ?? collectionName,
      sourceScope,
      itemCount: items.length
    });

    writeJson(join(hadithOut, collectionId, 'items.json'), items);
    hadithItemCount += items.length;
  }

  collections.sort((a, b) => a.sourceView.localeCompare(b.sourceView) || a.name.localeCompare(b.name));
  writeJson(join(hadithOut, 'collections.json'), collections);

  const report = {
    name: 'NOOR Sprint 27.9.2 Hadith View Model Normalization',
    generatedAt: new Date().toISOString(),
    sourceRoot,
    outputRoot,
    sourceFileCount: files.length,
    hadithCollectionCount: collections.length,
    hadithItemCount,
    byBookCollectionCount,
    byChapterCollectionCount,
    duplicateCollectionIds,
    duplicateItemIds,
    canPushNoorCdnStagingBranch: true,
    canPushNoorCdnMain: false,
    productionApproved: false,
    canPromoteToProduction: false
  };

  updateManifestAndHealth(outputRoot, report);
  rebuildSearchIndex(outputRoot);
  rebuildFileIndex(outputRoot, report.generatedAt);
  writeReviewReport(report);

  if (duplicateCollectionIds.length > 0 || duplicateItemIds.length > 0) {
    console.error('Hadith view model normalization found duplicates. See report.');
    process.exit(1);
  }

  console.log('NOOR Sprint 27.9.2 Hadith view model normalized.');
  console.log(`Collections: ${collections.length}`);
  console.log(`Items: ${hadithItemCount}`);
  console.log(`by_book collections: ${byBookCollectionCount}`);
  console.log(`by_chapter collections: ${byChapterCollectionCount}`);
  console.log('Duplicate collection IDs: 0');
  console.log('Duplicate item IDs: 0');
  console.log('noor-cdn/main remains blocked. Production CDN remains blocked.');
}

buildHadithViewModel();
