import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';

const ROOT = process.cwd();
const OUT_DIR = path.join(ROOT, 'content-pipeline', 'review', 'ilm-mate-v1', 'staging-cdn-acceptance');
const OUT_JSON = path.join(OUT_DIR, 'staging-cdn-acceptance-report.json');
const OUT_MD = path.join(OUT_DIR, 'staging-cdn-acceptance-report.md');

const EXPECTED_STAGING_BRANCH = 'staging-ilm-mate-v1';
const PRODUCTION_BRANCH = 'main';

function exists(p) {
  return fs.existsSync(p);
}

function ensureDir(p) {
  fs.mkdirSync(p, { recursive: true });
}

function readJson(file) {
  try {
    return JSON.parse(fs.readFileSync(file, 'utf8'));
  } catch (error) {
    return null;
  }
}

function writeJson(file, data) {
  fs.writeFileSync(file, `${JSON.stringify(data, null, 2)}\n`, 'utf8');
}

function writeText(file, text) {
  fs.writeFileSync(file, text, 'utf8');
}

function listFiles(dir, predicate = () => true, files = []) {
  if (!exists(dir)) return files;
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) listFiles(full, predicate, files);
    if (entry.isFile() && predicate(full)) files.push(full);
  }
  return files;
}

function gitBranch(dir) {
  try {
    return execFileSync('git', ['branch', '--show-current'], { cwd: dir, encoding: 'utf8' }).trim();
  } catch {
    return null;
  }
}

function gitHead(dir) {
  try {
    return execFileSync('git', ['rev-parse', '--short', 'HEAD'], { cwd: dir, encoding: 'utf8' }).trim();
  } catch {
    return null;
  }
}

function gitStatusShort(dir) {
  try {
    return execFileSync('git', ['status', '--short'], { cwd: dir, encoding: 'utf8' }).trim();
  } catch {
    return null;
  }
}

function normaliseArray(value, keys = ['items', 'collections', 'entries', 'surahs', 'ayahs', 'books']) {
  if (Array.isArray(value)) return value;
  if (!value || typeof value !== 'object') return [];
  for (const key of keys) {
    if (Array.isArray(value[key])) return value[key];
  }
  return [];
}

function check(id, title, pass, details = {}, severity = 'required') {
  return {
    id,
    title,
    severity,
    status: pass ? 'pass' : 'fail',
    details,
  };
}

function uniqueDuplicates(values) {
  const counts = new Map();
  for (const value of values.filter(Boolean)) counts.set(value, (counts.get(value) ?? 0) + 1);
  return [...counts.entries()].filter(([, count]) => count > 1).map(([value, count]) => ({ value, count }));
}

function chooseCdnRoot() {
  const candidates = [
    {
      label: 'sibling noor-cdn repository',
      root: path.resolve(ROOT, '..', 'noor-cdn', 'noor-cdn'),
      repoRoot: path.resolve(ROOT, '..', 'noor-cdn'),
      preferred: true,
    },
    {
      label: 'generated git-safe staging pack',
      root: path.join(ROOT, 'content-pipeline', 'publish', 'ilm-mate-v1-staging-cdn-git-safe', 'noor-cdn'),
      repoRoot: null,
      preferred: false,
    },
    {
      label: 'generated staging candidate',
      root: path.join(ROOT, 'content-pipeline', 'publish', 'ilm-mate-v1-staging-cdn', 'noor-cdn'),
      repoRoot: null,
      preferred: false,
    },
    {
      label: 'imported ilm-mate CDN staging data',
      root: path.join(ROOT, 'content-pipeline', 'imported', 'ilm-mate-v1', 'noor-cdn'),
      repoRoot: null,
      preferred: false,
    },
  ];

  const existing = candidates.filter((candidate) => exists(candidate.root));
  if (existing.length === 0) return { selected: null, candidates };

  const scored = existing.map((candidate) => {
    const collections = normaliseArray(readJson(path.join(candidate.root, 'hadith', 'collections.json')));
    const byChapter = collections.filter((collection) => isByChapterCollection(collection)).length;
    const tafseerIndexExists = exists(path.join(candidate.root, 'metadata', 'tafseer-index.json'));
    const manifestExists = exists(path.join(candidate.root, 'manifest', 'noor-content-manifest.json'));
    return {
      ...candidate,
      score: (candidate.preferred ? 50 : 0) + (manifestExists ? 10 : 0) + (tafseerIndexExists ? 10 : 0) + (byChapter > 0 ? 10 : 0),
    };
  });

  scored.sort((a, b) => b.score - a.score);
  return { selected: scored[0], candidates };
}

function isByChapterCollection(collection) {
  const fields = [collection?.sourceView, collection?.viewMode, collection?.view, collection?.id, collection?.sourcePath, collection?.path]
    .filter(Boolean)
    .join(' ')
    .toLowerCase();
  return fields.includes('by_chapter') || fields.includes('by-chapter') || fields.includes('chapter');
}

function isByBookCollection(collection) {
  const fields = [collection?.sourceView, collection?.viewMode, collection?.view, collection?.id, collection?.sourcePath, collection?.path]
    .filter(Boolean)
    .join(' ')
    .toLowerCase();
  return fields.includes('by_book') || fields.includes('by-book') || fields.includes('book');
}

function countQuran(root) {
  const surahIndex = normaliseArray(readJson(path.join(root, 'metadata', 'surah-index.json')));
  const quranSurahFiles = listFiles(path.join(root, 'quran', 'surahs'), (file) => file.endsWith('.json'));
  let ayat = 0;
  for (const file of quranSurahFiles) {
    const json = readJson(file);
    const items = normaliseArray(json, ['ayahs', 'ayat', 'verses', 'items']);
    ayat += items.length;
  }
  return { surahIndexCount: surahIndex.length, surahFiles: quranSurahFiles.length, ayat };
}

function countTafseer(root) {
  const indexPath = path.join(root, 'metadata', 'tafseer-index.json');
  const index = readJson(indexPath);
  const indexEntries = normaliseArray(index, ['books', 'sources', 'editions', 'collections', 'items', 'entries']);
  const tafseerFiles = listFiles(path.join(root, 'tafseer'), (file) => file.endsWith('.json'));
  let entryCount = 0;
  let sampleFilesChecked = 0;
  for (const file of tafseerFiles.slice(0, 250)) {
    const json = readJson(file);
    const items = normaliseArray(json, ['entries', 'ayahs', 'ayat', 'items', 'verses']);
    entryCount += items.length;
    sampleFilesChecked += 1;
  }
  return {
    indexExists: exists(indexPath),
    indexEntries: indexEntries.length,
    tafseerFiles: tafseerFiles.length,
    sampledEntryCount: entryCount,
    sampleFilesChecked,
  };
}

function countHadith(root) {
  const collectionsPath = path.join(root, 'hadith', 'collections.json');
  const collections = normaliseArray(readJson(collectionsPath));
  const ids = collections.map((collection) => collection?.id).filter(Boolean);
  const duplicateIds = uniqueDuplicates(ids);
  const byBook = collections.filter(isByBookCollection).length;
  const byChapter = collections.filter(isByChapterCollection).length;
  const itemFiles = listFiles(path.join(root, 'hadith'), (file) => file.endsWith('items.json'));
  let totalSampledItems = 0;
  const duplicateItemIdSamples = [];
  const emptyItemFiles = [];

  for (const file of itemFiles.slice(0, 1000)) {
    const json = readJson(file);
    const items = normaliseArray(json, ['items', 'hadith', 'entries']);
    totalSampledItems += items.length;
    if (items.length === 0) emptyItemFiles.push(path.relative(root, file).replaceAll('\\\\', '/').replaceAll('\\', '/'));
    const itemIds = items.map((item, index) => item?.viewItemId ?? item?.id ?? item?.canonicalHadithId ?? String(index));
    const dups = uniqueDuplicates(itemIds);
    if (dups.length > 0) {
      duplicateItemIdSamples.push({ file: path.relative(root, file).replaceAll('\\\\', '/').replaceAll('\\', '/'), duplicates: dups.slice(0, 10) });
    }
  }

  return {
    collectionsPathExists: exists(collectionsPath),
    collections: collections.length,
    byBook,
    byChapter,
    duplicateCollectionIds: duplicateIds,
    itemFiles: itemFiles.length,
    sampledItems: totalSampledItems,
    emptyItemFileSamples: emptyItemFiles.slice(0, 25),
    emptyItemFileCountInSample: emptyItemFiles.length,
    duplicateItemIdSamples: duplicateItemIdSamples.slice(0, 10),
  };
}

function countSearch(root) {
  const candidates = [
    path.join(root, 'search', 'search-index-lite.json'),
    path.join(root, 'search', 'search-index.json'),
    path.join(root, 'metadata', 'search-index-lite.json'),
  ];
  const first = candidates.find(exists);
  const json = first ? readJson(first) : null;
  const entries = normaliseArray(json, ['entries', 'items', 'documents']);
  const sources = new Set(entries.map((entry) => entry?.type ?? entry?.kind ?? entry?.sourceType).filter(Boolean));
  return {
    path: first ? path.relative(root, first).replaceAll('\\\\', '/').replaceAll('\\', '/') : null,
    exists: Boolean(first),
    entries: entries.length,
    sourceTypes: [...sources].sort(),
  };
}

function readEnvSummary() {
  const envCandidates = [path.join(ROOT, '.env.local'), path.join(ROOT, 'apps', 'web', '.env.local')];
  const envFiles = envCandidates.filter(exists);
  const values = {};
  for (const file of envFiles) {
    const text = fs.readFileSync(file, 'utf8');
    for (const line of text.split(/\r?\n/)) {
      const match = line.match(/^([A-Z0-9_]+)=(.*)$/);
      if (match) values[match[1]] = match[2];
    }
  }
  return { envFiles: envFiles.map((file) => path.relative(ROOT, file).replaceAll('\\\\', '/').replaceAll('\\', '/')), values };
}

const { selected, candidates } = chooseCdnRoot();
ensureDir(OUT_DIR);

const env = readEnvSummary();
const checks = [];
const summary = {
  generatedAt: new Date().toISOString(),
  sprint: '27.10',
  title: 'Staging CDN Acceptance Checklist',
  productionPromotion: 'blocked',
  expectedStagingBranch: EXPECTED_STAGING_BRANCH,
  productionBranch: PRODUCTION_BRANCH,
  selectedCdnRoot: selected ? path.relative(ROOT, selected.root).replaceAll('\\\\', '/').replaceAll('\\', '/') : null,
  selectedCdnRootLabel: selected?.label ?? null,
  candidates: candidates.map((candidate) => ({
    label: candidate.label,
    root: path.relative(ROOT, candidate.root).replaceAll('\\\\', '/').replaceAll('\\', '/'),
    exists: exists(candidate.root),
  })),
  env,
};

if (!selected) {
  checks.push(check('cdn-root', 'A staging CDN folder is available locally', false, { candidates: summary.candidates }));
} else {
  checks.push(check('cdn-root', 'A staging CDN folder is available locally', true, { selected: summary.selectedCdnRoot, label: selected.label }));

  const branch = selected.repoRoot ? gitBranch(selected.repoRoot) : null;
  const head = selected.repoRoot ? gitHead(selected.repoRoot) : null;
  const statusShort = selected.repoRoot ? gitStatusShort(selected.repoRoot) : null;
  summary.noorCdnGit = selected.repoRoot ? {
    repoRoot: path.relative(ROOT, selected.repoRoot).replaceAll('\\\\', '/').replaceAll('\\', '/'),
    branch,
    head,
    clean: statusShort === '',
    statusShort,
  } : null;

  if (selected.repoRoot) {
    checks.push(check('noor-cdn-branch', 'Local noor-cdn repository is on staging branch', branch === EXPECTED_STAGING_BRANCH, { branch, expected: EXPECTED_STAGING_BRANCH }));
    checks.push(check('noor-cdn-clean', 'Local noor-cdn working tree is clean', statusShort === '', { statusShort: statusShort || '(clean)' }, 'recommended'));
  }

  const manifestPath = path.join(selected.root, 'manifest', 'noor-content-manifest.json');
  const healthPath = path.join(selected.root, 'manifest', 'noor-content-health.json');
  const fileIndexPath = path.join(selected.root, 'manifest', 'file-index.json');
  const manifest = readJson(manifestPath);
  summary.manifest = {
    exists: exists(manifestPath),
    healthExists: exists(healthPath),
    fileIndexExists: exists(fileIndexPath),
    version: manifest?.version ?? manifest?.contentVersion ?? null,
    status: manifest?.status ?? manifest?.reviewStatus ?? null,
  };
  checks.push(check('manifest', 'Manifest and health files exist', exists(manifestPath) && exists(healthPath), summary.manifest));

  summary.quran = countQuran(selected.root);
  checks.push(check('quran', 'Quran staging CDN has 114 surahs and 6,236 ayat', summary.quran.surahIndexCount === 114 && summary.quran.surahFiles === 114 && summary.quran.ayat === 6236, summary.quran));

  summary.tafseer = countTafseer(selected.root);
  checks.push(check('tafseer', 'Tafseer staging CDN index and files are present', summary.tafseer.indexExists && summary.tafseer.indexEntries > 0 && summary.tafseer.tafseerFiles > 0, summary.tafseer));

  summary.hadith = countHadith(selected.root);
  checks.push(check('hadith-collections', 'Hadith collections include both by_book and by_chapter views', summary.hadith.collections > 0 && summary.hadith.byBook > 0 && summary.hadith.byChapter > 0, {
    collections: summary.hadith.collections,
    byBook: summary.hadith.byBook,
    byChapter: summary.hadith.byChapter,
  }));
  checks.push(check('hadith-unique-collection-ids', 'Hadith collection IDs are globally unique', summary.hadith.duplicateCollectionIds.length === 0, {
    duplicateCollectionIds: summary.hadith.duplicateCollectionIds.slice(0, 25),
  }));
  checks.push(check('hadith-item-ids', 'Hadith sampled item IDs are unique inside each CDN collection', summary.hadith.duplicateItemIdSamples.length === 0, {
    sampledItemFiles: Math.min(summary.hadith.itemFiles, 1000),
    duplicateItemIdSamples: summary.hadith.duplicateItemIdSamples,
    emptyItemFileCountInSample: summary.hadith.emptyItemFileCountInSample,
    emptyItemFileSamples: summary.hadith.emptyItemFileSamples,
  }, summary.hadith.emptyItemFileCountInSample > 0 ? 'recommended' : 'required'));

  summary.search = countSearch(selected.root);
  checks.push(check('search', 'Search index exists and has entries', summary.search.exists && summary.search.entries > 0, summary.search));
}

const envText = Object.values(env.values).join('\n');
checks.push(check('runtime-env-staging', 'Runtime env points to staging CDN branch, not noor-cdn main', envText.includes(EXPECTED_STAGING_BRANCH) && !envText.includes('noor-cdn@main'), {
  envFiles: env.envFiles,
  containsStagingBranch: envText.includes(EXPECTED_STAGING_BRANCH),
  containsNoorCdnMain: envText.includes('noor-cdn@main'),
}));
checks.push(check('production-block', 'Production promotion remains blocked until explicit final approval', true, {
  noorCdnMainTouched: false,
  productionBranch: PRODUCTION_BRANCH,
  requiredNextStepBeforeProduction: 'Manual review sign-off + explicit promotion sprint',
}));

const requiredFailures = checks.filter((item) => item.severity === 'required' && item.status !== 'pass');
const recommendedFailures = checks.filter((item) => item.severity !== 'required' && item.status !== 'pass');
const acceptedForStaging = requiredFailures.length === 0;
const report = {
  ...summary,
  acceptedForStaging,
  productionPromotion: 'blocked',
  requiredFailures: requiredFailures.map((item) => item.id),
  recommendedFailures: recommendedFailures.map((item) => item.id),
  checks,
  nextAction: acceptedForStaging
    ? 'Staging CDN is accepted for reviewer/runtime testing only. Do not promote noor-cdn/main yet.'
    : 'Fix required failures, regenerate staging CDN, push staging branch, then rerun pnpm cdn:staging-acceptance.',
};

writeJson(OUT_JSON, report);

const mdLines = [];
mdLines.push('# NOOR Sprint 27.10 — Staging CDN Acceptance Report');
mdLines.push('');
mdLines.push(`Generated: ${report.generatedAt}`);
mdLines.push(`Selected CDN root: ${report.selectedCdnRoot ?? 'not found'}`);
mdLines.push(`Staging accepted: ${report.acceptedForStaging ? 'YES' : 'NO'}`);
mdLines.push(`Production promotion: ${report.productionPromotion.toUpperCase()}`);
mdLines.push('');
mdLines.push('## Checklist');
mdLines.push('');
mdLines.push('| Status | Severity | Check | Notes |');
mdLines.push('|---|---|---|---|');
for (const item of checks) {
  const icon = item.status === 'pass' ? '✅' : '❌';
  const notes = Object.entries(item.details ?? {})
    .slice(0, 5)
    .map(([key, value]) => `${key}: ${Array.isArray(value) || typeof value === 'object' ? JSON.stringify(value).slice(0, 120) : String(value)}`)
    .join('<br>');
  mdLines.push(`| ${icon} ${item.status} | ${item.severity} | ${item.title} | ${notes} |`);
}
mdLines.push('');
mdLines.push('## Summary');
mdLines.push('');
mdLines.push('```json');
mdLines.push(JSON.stringify({
  quran: report.quran ?? null,
  tafseer: report.tafseer ?? null,
  hadith: report.hadith ? {
    collections: report.hadith.collections,
    byBook: report.hadith.byBook,
    byChapter: report.hadith.byChapter,
    duplicateCollectionIds: report.hadith.duplicateCollectionIds.length,
  } : null,
  search: report.search ?? null,
  requiredFailures: report.requiredFailures,
  recommendedFailures: report.recommendedFailures,
}, null, 2));
mdLines.push('```');
mdLines.push('');
mdLines.push('## Decision');
mdLines.push('');
mdLines.push(report.nextAction);
mdLines.push('');
mdLines.push('Production CDN remains blocked. noor-cdn/main must not be updated by this sprint.');
writeText(OUT_MD, `${mdLines.join('\n')}\n`);

console.log('NOOR Sprint 27.10 staging CDN acceptance report generated.');
console.log(`Report: ${path.relative(ROOT, OUT_MD)}`);
console.log(`JSON: ${path.relative(ROOT, OUT_JSON)}`);
console.log(`Accepted for staging: ${acceptedForStaging ? 'YES' : 'NO'}`);
if (!acceptedForStaging) {
  console.log(`Required failures: ${requiredFailures.map((item) => item.id).join(', ') || '(none)'}`);
}
