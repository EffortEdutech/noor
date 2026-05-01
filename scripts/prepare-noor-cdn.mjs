import { cpSync, existsSync, mkdirSync, readdirSync, readFileSync, rmSync, statSync, writeFileSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { join, relative } from 'node:path';
import { spawnSync } from 'node:child_process';

const SOURCE_ROOT = process.argv[2] ?? 'content-pipeline/source/noor-demo-v0.12';
const DIST_ROOT = process.argv[3] ?? 'content-pipeline/dist/noor-cdn';
const PUBLIC_ROOT = process.argv[4] ?? 'apps/web/public/noor-cdn';

function runValidator() {
  const result = spawnSync(process.execPath, ['scripts/validate-noor-cdn.mjs', SOURCE_ROOT], {
    stdio: 'inherit',
    shell: false
  });

  if (result.error) {
    console.error(result.error);
    process.exit(1);
  }

  if (result.status !== 0) {
    process.exit(result.status ?? 1);
  }
}

function runSearchIndexBuilder(target) {
  const result = spawnSync(process.execPath, ['scripts/build-noor-cdn-search-index.mjs', target, target], {
    stdio: 'inherit',
    shell: false
  });

  if (result.error) {
    console.error(result.error);
    process.exit(1);
  }

  if (result.status !== 0) {
    process.exit(result.status ?? 1);
  }
}

function readJson(path) {
  return JSON.parse(readFileSync(path, 'utf8'));
}

function listJsonFiles(dir) {
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

function sha256(path) {
  return createHash('sha256').update(readFileSync(path)).digest('hex');
}

function copyFresh(target) {
  rmSync(target, { recursive: true, force: true });
  mkdirSync(target, { recursive: true });
  cpSync(SOURCE_ROOT, target, { recursive: true });
}

function padSurah(number) {
  return String(number).padStart(3, '0');
}

function buildContentHealthReport(root, manifest) {
  const issues = [];
  const surahIndex = readJson(join(root, 'metadata/surah-index.json'));
  const collections = readJson(join(root, 'hadith/collections.json'));
  const ayahKeys = new Set();
  const tafseerCoveredSurahs = new Set();

  let surahContentCount = 0;
  let ayahContentCount = 0;
  let tafseerEntryCount = 0;
  let hadithItemCount = 0;

  for (const surah of surahIndex) {
    const surahFile = join(root, 'quran/surahs', `${padSurah(surah.number)}.json`);

    if (!existsSync(surahFile)) {
      issues.push({
        severity: 'error',
        area: 'quran',
        message: `Missing Quran CDN surah file for ${surah.nameTransliteration}.`,
        reference: String(surah.number)
      });
      continue;
    }

    const content = readJson(surahFile);
    surahContentCount += 1;

    if (!Array.isArray(content.ayahs) || content.ayahs.length !== surah.ayahCount) {
      issues.push({
        severity: 'error',
        area: 'quran',
        message: `${surah.nameTransliteration} expects ${surah.ayahCount} ayat but file contains ${content.ayahs?.length ?? 0}.`,
        reference: String(surah.number)
      });
    }

    for (const ayah of content.ayahs ?? []) {
      ayahContentCount += 1;

      if (!ayah.key || ayahKeys.has(ayah.key)) {
        issues.push({
          severity: 'error',
          area: 'quran',
          message: `Missing or duplicate ayah key detected: ${ayah.key ?? 'unknown'}`,
          reference: ayah.key
        });
      }

      if (ayah.key) ayahKeys.add(ayah.key);

      if (!ayah.arabic || !ayah.translations?.en || !ayah.translations?.ms) {
        issues.push({
          severity: 'warning',
          area: 'quran',
          message: `Ayah ${ayah.key ?? 'unknown'} is missing Arabic, English or Malay demo content.`,
          reference: ayah.key
        });
      }
    }

    const tafseerFile = join(root, 'tafseer/demo-tafseer/surahs', `${padSurah(surah.number)}.json`);
    if (!existsSync(tafseerFile)) {
      issues.push({
        severity: 'warning',
        area: 'tafseer',
        message: `${surah.nameTransliteration} has no CDN tafseer file.`,
        reference: String(surah.number)
      });
    } else {
      const entries = readJson(tafseerFile);
      if (Array.isArray(entries)) {
        if (entries.length > 0) tafseerCoveredSurahs.add(surah.number);
        tafseerEntryCount += entries.length;
      } else {
        issues.push({
          severity: 'error',
          area: 'tafseer',
          message: `Tafseer CDN file must contain an array: ${padSurah(surah.number)}.json`,
          reference: String(surah.number)
        });
      }
    }
  }

  for (const collection of collections) {
    const itemsFile = join(root, 'hadith', collection.id, 'items.json');

    if (!existsSync(itemsFile)) {
      issues.push({
        severity: 'warning',
        area: 'hadith',
        message: `${collection.name} has no CDN items file.`,
        reference: collection.id
      });
      continue;
    }

    const items = readJson(itemsFile);
    if (Array.isArray(items)) hadithItemCount += items.length;
  }

  issues.push({
    severity: 'info',
    area: 'manifest',
    message: 'Sprint 26 publishes a CDN-ready demo pack with a generated search index. Production promotion still requires verified sources, licensing and scholarly review.'
  });

  const hasErrors = issues.some((issue) => issue.severity === 'error');

  return {
    manifest,
    generatedAt: new Date().toISOString(),
    isHealthy: !hasErrors,
    summary: {
      surahIndexedCount: surahIndex.length,
      surahContentCount,
      ayahContentCount,
      tafseerEntryCount,
      tafseerCoveredSurahCount: tafseerCoveredSurahs.size,
      hadithCollectionCount: collections.length,
      hadithItemCount
    },
    issues
  };
}

runValidator();
copyFresh(DIST_ROOT);
copyFresh(PUBLIC_ROOT);
runSearchIndexBuilder(DIST_ROOT);
runSearchIndexBuilder(PUBLIC_ROOT);

const files = listJsonFiles(DIST_ROOT).map((file) => ({
  path: relative(DIST_ROOT, file).replaceAll('\\\\', '/').replaceAll('\\', '/'),
  bytes: statSync(file).size,
  sha256: sha256(file)
}));

const manifest = readJson(join(DIST_ROOT, 'manifest/noor-content-manifest.json'));
const health = buildContentHealthReport(DIST_ROOT, manifest);
const fileIndex = {
  generatedAt: health.generatedAt,
  files
};

for (const target of [DIST_ROOT, PUBLIC_ROOT]) {
  mkdirSync(join(target, 'manifest'), { recursive: true });
  writeFileSync(join(target, 'manifest/file-index.json'), `${JSON.stringify(fileIndex, null, 2)}\n`, 'utf8');
  writeFileSync(join(target, 'manifest/noor-content-health.json'), `${JSON.stringify(health, null, 2)}\n`, 'utf8');
}

console.log(`NOOR CDN pack prepared at ${DIST_ROOT} and ${PUBLIC_ROOT}.`);
console.log(`Generated ${files.length} indexed JSON files.`);
