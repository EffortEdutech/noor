import { createHash } from 'node:crypto';
import { spawnSync } from 'node:child_process';
import { cpSync, existsSync, mkdirSync, readdirSync, readFileSync, rmSync, statSync, writeFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';

const DEFAULT_OUTPUT_ROOT = 'content-pipeline/imported/ilm-mate-v1/noor-cdn';
const REPORT_FILE = 'content-pipeline/imported/ilm-mate-v1/migration-report.json';
const REPORT_MD = 'content-pipeline/imported/ilm-mate-v1/migration-report.md';

const LANGUAGE_MAP = {
  Arabic: 'ar',
  English: 'en',
  Malay: 'ms',
  Indonesian: 'id',
  Urdu: 'ur',
  Translit: 'en',
  Transliteration: 'en',
  ara: 'ar',
  ar: 'ar',
  eng: 'en',
  en: 'en',
  mal: 'ms',
  ms: 'ms',
  ind: 'id',
  id: 'id',
  urd: 'ur',
  ur: 'ur'
};

const TRANSLATION_CODE_MAP = {
  'eng': 'en',
  'en': 'en',
  'mal': 'ms',
  'ms': 'ms',
  'ind': 'id',
  'id': 'id',
  'urd': 'ur',
  'ur': 'ur'
};

const SUPPORTED_NOOR_LANGUAGES = new Set(['ar', 'en', 'ms', 'id', 'ur']);
const UNSUPPORTED_NOTES = [];

function parseArg(name, fallback = undefined) {
  const prefix = `--${name}=`;
  const inline = process.argv.find((arg) => arg.startsWith(prefix));
  if (inline) return inline.slice(prefix.length);
  const index = process.argv.indexOf(`--${name}`);
  if (index >= 0 && process.argv[index + 1]) return process.argv[index + 1];
  return fallback;
}

const ONLY = parseArg('only', 'all');
const OUTPUT_ROOT = parseArg('output', DEFAULT_OUTPUT_ROOT);

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
  const candidates = candidateSourceRoots();
  for (const candidate of candidates) {
    if (existsSync(candidate)) return candidate;
  }

  console.error('Could not find ilm-mate content folder. Tried:');
  for (const candidate of candidates) console.error(`- ${candidate}`);
  console.error('\nClone old repo next to NOOR, then run again:');
  console.error('cd "C:\\Users\\user\\Documents\\00 Combo3"');
  console.error('git clone https://github.com/EffortEdutech/muslim-companion-poc.git');
  process.exit(1);
}

function readJson(file, fallback = null) {
  if (!existsSync(file)) return fallback;
  const text = readFileSync(file, 'utf8').trim();
  if (!text) return fallback;
  try {
    return JSON.parse(text);
  } catch (error) {
    throw new Error(`Invalid JSON in ${file}: ${error.message}`);
  }
}

function writeJson(file, value) {
  mkdirSync(dirname(file), { recursive: true });
  writeFileSync(file, `${JSON.stringify(value, null, 2)}\n`, 'utf8');
}

function padSurah(number) {
  return String(number).padStart(3, '0');
}

function slugify(value) {
  return String(value ?? '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '') || 'unknown';
}

function normalizeWhitespace(value) {
  return String(value ?? '').replace(/\s+/g, ' ').trim();
}

function sha256Text(value) {
  return createHash('sha256').update(value).digest('hex');
}

function listDirs(dir) {
  if (!existsSync(dir)) return [];
  return readdirSync(dir)
    .map((name) => ({ name, full: join(dir, name) }))
    .filter((item) => statSync(item.full).isDirectory())
    .map((item) => item.name)
    .sort();
}

function listJsonFiles(dir) {
  if (!existsSync(dir)) return [];
  return readdirSync(dir).filter((name) => name.endsWith('.json')).sort();
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
  if (!SUPPORTED_NOOR_LANGUAGES.has(mapped)) return fallback;
  return mapped;
}

function getEditionFile(sourceRoot, edition) {
  const fromRegistry = edition.file ? resolve(sourceRoot, '..', edition.file) : null;
  if (fromRegistry && existsSync(fromRegistry)) return fromRegistry;
  return join(sourceRoot, 'quran', 'db', `${edition.key}.json`);
}

function getSurahContainer(editionData, surahNumber) {
  const surahs = editionData?.surahs;
  if (!surahs) return null;
  if (Array.isArray(surahs)) {
    return surahs.find((item) => Number(item.surah ?? item.number ?? item.id) === Number(surahNumber)) ?? null;
  }
  return surahs[String(surahNumber)] ?? surahs[surahNumber] ?? null;
}

function getVersesFromSurah(surahContainer) {
  if (!surahContainer) return [];
  const verses = surahContainer.verses ?? surahContainer.ayahs ?? surahContainer.verses_data;
  if (Array.isArray(verses)) return verses;
  if (verses && typeof verses === 'object') return Object.entries(verses).map(([key, value]) => ({ verse: Number(key), ...(typeof value === 'object' ? value : { text: value }) }));
  return [];
}

function getVerseText(verse, preferredKey = 'text') {
  return normalizeWhitespace(
    verse?.[preferredKey] ??
    verse?.text ??
    verse?.translation ??
    verse?.transliteration ??
    verse?.arabic ??
    verse?.uthmani ??
    verse?.verse_text ??
    ''
  );
}

function getVerseNumber(verse, fallback) {
  return Number(verse?.verse ?? verse?.ayah ?? verse?.id ?? verse?.number ?? fallback);
}

function buildSurahInfo(sourceRoot, number, arabicSurah, metaRecord) {
  const nameTransliteration = metaRecord?.name_transliterated ?? metaRecord?.name_english ?? arabicSurah?.name ?? `Surah ${number}`;
  const revelationPlace = String(metaRecord?.revelation?.place ?? metaRecord?.revelation ?? '').toLowerCase();
  return {
    number,
    slug: slugify(nameTransliteration),
    nameArabic: metaRecord?.name_arabic ?? arabicSurah?.name_arabic ?? arabicSurah?.arabic_name ?? '',
    nameTransliteration,
    nameEnglish: metaRecord?.meaning ?? metaRecord?.name_english ?? nameTransliteration,
    revelation: revelationPlace.includes('med') ? 'madani' : 'makki',
    ayahCount: Number(metaRecord?.structure?.verse_count ?? arabicSurah?.total_verses ?? getVersesFromSurah(arabicSurah).length)
  };
}

function copyIfExists(sourceRoot, outputRoot, relativePath) {
  const source = join(sourceRoot, relativePath);
  const output = join(outputRoot, relativePath);
  if (existsSync(source)) {
    mkdirSync(dirname(output), { recursive: true });
    cpSync(source, output, { recursive: true });
  }
}

function migrateQuran(sourceRoot, outputRoot, selectedEditions, report) {
  const quranEditions = selectedEditions?.quran?.editions ?? [];
  const editionData = new Map();

  for (const edition of quranEditions) {
    const code = edition.lang_code;
    if (['spa', 'fra'].includes(code)) {
      UNSUPPORTED_NOTES.push(`Quran edition ${edition.key} (${edition.language}) skipped from translations because NOOR LanguageCode does not yet include Spanish/French.`);
      continue;
    }

    const file = getEditionFile(sourceRoot, edition);
    const data = readJson(file, null);
    if (!data?.surahs) {
      report.quran.skippedEditions.push({ key: edition.key, reason: 'missing or invalid surahs', file });
      continue;
    }
    editionData.set(edition.key, { edition, data });
  }

  const arabic = editionData.get('ara-uthmani') ?? [...editionData.values()].find((entry) => entry.edition.lang_code === 'ara');
  if (!arabic) throw new Error('Cannot migrate Quran: Arabic source edition ara-uthmani is missing or invalid.');

  const surahMetaFile = join(sourceRoot, 'quran', 'meta', 'surah_info.json');
  const surahMeta = readJson(surahMetaFile, {});
  const metaRecords = Array.isArray(surahMeta?.surahs_metadata) ? surahMeta.surahs_metadata : [];

  const arabicSurahs = arabic.data.surahs;
  const surahNumbers = Array.isArray(arabicSurahs)
    ? arabicSurahs.map((item) => Number(item.surah ?? item.number ?? item.id)).filter(Boolean)
    : Object.keys(arabicSurahs).map(Number).filter(Boolean);

  const surahIndex = [];

  for (const number of surahNumbers.sort((a, b) => a - b)) {
    const arabicSurah = getSurahContainer(arabic.data, number);
    const arabicVerses = getVersesFromSurah(arabicSurah);
    const metaRecord = metaRecords.find((item) => Number(item.number ?? item.id) === number);
    const surah = buildSurahInfo(sourceRoot, number, arabicSurah, metaRecord);
    const ayahs = [];

    for (const [index, arabicVerse] of arabicVerses.entries()) {
      const ayahNumber = getVerseNumber(arabicVerse, index + 1);
      const ayah = {
        surah: number,
        ayah: ayahNumber,
        key: `${number}:${ayahNumber}`,
        arabic: getVerseText(arabicVerse),
        translations: {}
      };

      for (const { edition, data } of editionData.values()) {
        if (edition.key === arabic.edition.key || edition.lang_code === 'ara') continue;

        if (edition.key === 'transliteration') {
          const transSurah = getSurahContainer(data, number);
          const transVerse = getVersesFromSurah(transSurah).find((verse, i) => getVerseNumber(verse, i + 1) === ayahNumber);
          const value = getVerseText(transVerse, 'transliteration');
          if (value) ayah.transliteration = value;
          continue;
        }

        const noorCode = TRANSLATION_CODE_MAP[edition.lang_code];
        if (!noorCode) continue;
        const transSurah = getSurahContainer(data, number);
        const transVerse = getVersesFromSurah(transSurah).find((verse, i) => getVerseNumber(verse, i + 1) === ayahNumber);
        const value = getVerseText(transVerse);
        if (value) ayah.translations[noorCode] = value;
      }

      ayahs.push(ayah);
    }

    surah.ayahCount = ayahs.length || surah.ayahCount;
    surahIndex.push(surah);
    writeJson(join(outputRoot, 'quran', 'surahs', `${padSurah(number)}.json`), { surah, ayahs });
    report.quran.ayahCount += ayahs.length;
  }

  writeJson(join(outputRoot, 'metadata', 'surah-index.json'), surahIndex);
  copyIfExists(sourceRoot, outputRoot, 'quran/meta/juz_info.json');
  copyIfExists(sourceRoot, outputRoot, 'quran/meta/quran-data.xml');

  report.quran.surahCount = surahIndex.length;
  report.quran.editionCount = editionData.size;
}

function migrateTafseer(sourceRoot, outputRoot, selectedEditions, report) {
  const registry = selectedEditions?.tafsir?.editions ?? [];
  const tafseerDb = join(sourceRoot, 'tafsir', 'db');
  const folders = listDirs(tafseerDb);

  for (const slug of folders) {
    const edition = registry.find((item) => item.slug === slug) ?? { slug, label: slug, language: 'English' };
    const lang = getLangCode(edition.lang_code ?? edition.language, 'en');
    const sourceDir = join(tafseerDb, slug);
    let entryCount = 0;
    let surahCount = 0;

    for (const fileName of listJsonFiles(sourceDir)) {
      const surahNumber = Number(fileName.replace(/\.json$/, ''));
      if (!surahNumber) continue;
      const payload = readJson(join(sourceDir, fileName), null);
      const ayahs = Array.isArray(payload?.ayahs) ? payload.ayahs : [];
      const entries = ayahs
        .map((ayah) => {
          const ayahNumber = Number(ayah.id ?? ayah.ayah ?? ayah.verse);
          const body = normalizeWhitespace(ayah.text ?? ayah.body ?? '');
          if (!ayahNumber || !body) return null;
          return {
            id: `${slug}-${surahNumber}-${ayahNumber}`,
            bookId: slug,
            language: lang,
            surah: surahNumber,
            fromAyah: ayahNumber,
            toAyah: ayahNumber,
            title: `${edition.label_en ?? edition.label ?? slug} · ${surahNumber}:${ayahNumber}`,
            body,
            sourceLabel: edition.label_en ?? edition.label ?? payload?._meta?.edition ?? slug,
            tags: [slug, lang, edition.level].filter(Boolean)
          };
        })
        .filter(Boolean);

      if (entries.length > 0) {
        writeJson(join(outputRoot, 'tafseer', slug, 'surahs', `${padSurah(surahNumber)}.json`), entries);
        entryCount += entries.length;
        surahCount += 1;
      }
    }

    if (entryCount > 0) {
      report.tafseer.editions.push({ slug, language: lang, sourceLabel: edition.label_en ?? edition.label ?? slug, surahCount, entryCount });
      report.tafseer.entryCount += entryCount;
    }
  }
}

function findHadithFiles(sourceRoot) {
  const hadithDb = join(sourceRoot, 'hadith', 'db');
  return walkJsonFiles(hadithDb).filter((file) => !file.includes(`${join('metadata')}`));
}

function collectionNameFromFile(file, payload, meta) {
  return payload?.metadata?.name ?? meta?.book ?? file.split(/[\\/]/).slice(-2, -1)[0] ?? 'Hadith Collection';
}

function getHadithArray(payload) {
  if (Array.isArray(payload?.hadiths)) return payload.hadiths;
  if (Array.isArray(payload?.data)) return payload.data;
  if (Array.isArray(payload)) return payload;
  return [];
}

function migrateHadith(sourceRoot, outputRoot, report) {
  const files = findHadithFiles(sourceRoot);
  const collections = [];

  for (const file of files) {
    const payload = readJson(file, null);
    if (!payload) continue;
    const meta = payload._ilmmate_meta ?? payload._meta ?? {};
    const edition = meta.edition ?? file.replace(/\.json$/, '').split(/[\\/]/).pop();
    const lang = getLangCode(meta.lang ?? edition?.split('-')[0], 'en');

    if (!SUPPORTED_NOOR_LANGUAGES.has(lang)) {
      UNSUPPORTED_NOTES.push(`Hadith edition ${edition} skipped because language ${meta.lang} is not yet supported by NOOR LanguageCode.`);
      continue;
    }

    const hadiths = getHadithArray(payload);
    if (hadiths.length === 0) continue;

    const collectionId = slugify(edition);
    const collectionName = collectionNameFromFile(file, payload, meta);
    const items = [];

    for (const [index, item] of hadiths.entries()) {
      const number = String(item.number ?? item.hadithnumber ?? item.hadithNumber ?? index + 1);
      const arabic = normalizeWhitespace(item.arab ?? item.arabic ?? item.ar ?? '');
      const text = normalizeWhitespace(item.text ?? item.translation ?? item.body ?? item.en ?? '');
      const translations = {};

      if (lang !== 'ar' && text) translations[lang] = text;

      items.push({
        id: `${collectionId}-${number}`,
        collectionId,
        book: meta.book ?? payload?.metadata?.name ?? collectionName,
        chapter: item.chapter ?? item.bookName ?? undefined,
        number,
        narrator: item.narrator ?? item.by ?? undefined,
        arabic: arabic || (lang === 'ar' ? text : undefined),
        translations,
        sourceLabel: `${collectionName} · ${edition}`,
        tags: [meta.book, lang, collectionId].filter(Boolean)
      });
    }

    collections.push({
      id: collectionId,
      name: `${collectionName} — ${edition}`,
      language: lang,
      description: `Migrated from ilm-mate ${edition}. Staging only pending NOOR review approval.`
    });
    writeJson(join(outputRoot, 'hadith', collectionId, 'items.json'), items);
    report.hadith.itemCount += items.length;
  }

  writeJson(join(outputRoot, 'hadith', 'collections.json'), collections);
  report.hadith.collectionCount = collections.length;
}

function buildManifest(outputRoot, report) {
  const now = new Date().toISOString();
  const manifest = {
    id: 'noor-ilm-mate-v1-migrated-staging',
    version: '0.26.5',
    label: 'NOOR migrated ilm-mate content staging pack',
    releasedAt: now,
    mode: 'staging',
    datasets: {
      quran: {
        id: 'quran-ilm-mate-v1',
        label: 'Quran migrated from ilm-mate',
        status: report.quran.surahCount >= 114 ? 'ready' : 'partial',
        sourceLabel: 'ilm-mate content/quran',
        languages: ['ar', 'en', 'ms', 'id', 'ur'],
        itemCount: report.quran.ayahCount,
        updatedAt: now,
        notes: 'Staging migration only. Production approval still blocked pending review.'
      },
      tafseer: {
        id: 'tafseer-ilm-mate-v1',
        label: 'Tafseer migrated from ilm-mate',
        status: report.tafseer.entryCount > 0 ? 'partial' : 'missing',
        sourceLabel: 'ilm-mate content/tafsir',
        languages: [...new Set(report.tafseer.editions.map((item) => item.language))],
        itemCount: report.tafseer.entryCount,
        updatedAt: now,
        notes: 'Staging migration only. Empty source entries skipped.'
      },
      hadith: {
        id: 'hadith-ilm-mate-v1',
        label: 'Hadith migrated from ilm-mate',
        status: report.hadith.itemCount > 0 ? 'partial' : 'missing',
        sourceLabel: 'ilm-mate content/hadith',
        languages: ['ar', 'en', 'id', 'ur'],
        itemCount: report.hadith.itemCount,
        updatedAt: now,
        notes: 'Staging migration only. Each old language edition becomes a NOOR collection.'
      }
    }
  };

  const sourceRegistry = {
    generatedAt: now,
    status: 'staging-only',
    productionGate: [
      'Verify source license and redistribution rights',
      'Record attribution per edition/collection',
      'Generate source checksums',
      'Run scholarly/content review',
      'Approve through NOOR production promotion gate'
    ],
    sources: [
      { id: 'ilm-mate-quran', area: 'quran', sourcePath: 'content/quran', approvalStatus: 'pending-review' },
      { id: 'ilm-mate-tafseer', area: 'tafseer', sourcePath: 'content/tafsir', approvalStatus: 'pending-review' },
      { id: 'ilm-mate-hadith', area: 'hadith', sourcePath: 'content/hadith', approvalStatus: 'pending-review' }
    ]
  };

  writeJson(join(outputRoot, 'manifest', 'noor-content-manifest.json'), manifest);
  writeJson(join(outputRoot, 'manifest', 'noor-source-registry.json'), sourceRegistry);
}

function buildHealthAndFileIndex(outputRoot, report) {
  const issues = [];
  if (report.quran.surahCount < 114) {
    issues.push({ severity: 'warning', area: 'quran', message: `Migrated ${report.quran.surahCount} surahs; expected 114 for full Quran.` });
  }
  if (report.tafseer.entryCount === 0) {
    issues.push({ severity: 'warning', area: 'tafseer', message: 'No tafseer entries migrated.' });
  }
  if (report.hadith.itemCount === 0) {
    issues.push({ severity: 'warning', area: 'hadith', message: 'No hadith items migrated.' });
  }
  for (const note of UNSUPPORTED_NOTES) {
    issues.push({ severity: 'info', area: 'manifest', message: note });
  }
  issues.push({ severity: 'info', area: 'manifest', message: 'Sprint 26.5 output is staging-only. Do not publish as production CDN until NOOR review approval passes.' });

  const manifest = readJson(join(outputRoot, 'manifest', 'noor-content-manifest.json'));
  const health = {
    manifest,
    generatedAt: new Date().toISOString(),
    isHealthy: !issues.some((issue) => issue.severity === 'error'),
    summary: {
      surahIndexedCount: report.quran.surahCount,
      surahContentCount: report.quran.surahCount,
      ayahContentCount: report.quran.ayahCount,
      tafseerEntryCount: report.tafseer.entryCount,
      tafseerCoveredSurahCount: report.tafseer.editions.reduce((total, item) => total + item.surahCount, 0),
      hadithCollectionCount: report.hadith.collectionCount,
      hadithItemCount: report.hadith.itemCount
    },
    issues
  };

  const files = walkJsonFiles(outputRoot).map((file) => {
    const text = readFileSync(file, 'utf8');
    return {
      path: file.slice(resolve(outputRoot).length + 1).replaceAll('\\\\', '/').replaceAll('\\', '/'),
      bytes: statSync(file).size,
      sha256: sha256Text(text)
    };
  });

  writeJson(join(outputRoot, 'manifest', 'noor-content-health.json'), health);
  writeJson(join(outputRoot, 'manifest', 'file-index.json'), { generatedAt: health.generatedAt, files });
}

function runSearchIndexBuilder(outputRoot) {
  const result = spawnSync(process.execPath, ['scripts/build-noor-cdn-search-index.mjs', outputRoot, outputRoot], {
    stdio: 'inherit',
    shell: false
  });

  if (result.error) throw result.error;
  if (result.status !== 0) process.exit(result.status ?? 1);
}

function writeReports(report) {
  report.unsupportedNotes = UNSUPPORTED_NOTES;
  writeJson(REPORT_FILE, report);

  const lines = [
    '# NOOR Sprint 26.5 — ilm-mate Migration Report',
    '',
    `Generated: ${report.generatedAt}`,
    `Source root: \`${report.sourceRoot}\``,
    `Output root: \`${report.outputRoot}\``,
    '',
    '## Summary',
    '',
    `- Quran editions read: ${report.quran.editionCount}`,
    `- Quran surahs migrated: ${report.quran.surahCount}`,
    `- Quran ayat migrated: ${report.quran.ayahCount}`,
    `- Tafseer editions migrated: ${report.tafseer.editions.length}`,
    `- Tafseer entries migrated: ${report.tafseer.entryCount}`,
    `- Hadith collections migrated: ${report.hadith.collectionCount}`,
    `- Hadith items migrated: ${report.hadith.itemCount}`,
    '',
    '## Production gate',
    '',
    'This output is staging-only. Do not publish as production CDN until review approval passes.',
    '',
    '## Unsupported / deferred notes',
    '',
    ...(UNSUPPORTED_NOTES.length ? UNSUPPORTED_NOTES.map((note) => `- ${note}`) : ['- None'])
  ];
  mkdirSync(dirname(REPORT_MD), { recursive: true });
  writeFileSync(REPORT_MD, `${lines.join('\n')}\n`, 'utf8');
}

function migrate() {
  const sourceRoot = resolveSourceRoot();
  const outputRoot = resolve(OUTPUT_ROOT);
  const selectedEditions = readJson(join(sourceRoot, 'quran', 'selected-editions.json'), {});

  if (ONLY === 'all') {
    rmSync(outputRoot, { recursive: true, force: true });
  } else {
    const folders = { quran: ['quran', 'metadata'], tafseer: ['tafseer'], hadith: ['hadith'] }[ONLY] ?? [];
    for (const folder of folders) rmSync(join(outputRoot, folder), { recursive: true, force: true });
  }
  mkdirSync(outputRoot, { recursive: true });

  const report = {
    name: 'NOOR Sprint 26.5 ilm-mate Content Migration',
    generatedAt: new Date().toISOString(),
    sourceRoot,
    outputRoot,
    mode: 'staging-only',
    quran: { editionCount: 0, skippedEditions: [], surahCount: 0, ayahCount: 0 },
    tafseer: { editions: [], entryCount: 0 },
    hadith: { collectionCount: 0, itemCount: 0 }
  };

  if (ONLY === 'all' || ONLY === 'quran') migrateQuran(sourceRoot, outputRoot, selectedEditions, report);
  if (ONLY === 'all' || ONLY === 'tafseer') migrateTafseer(sourceRoot, outputRoot, selectedEditions, report);
  if (ONLY === 'all' || ONLY === 'hadith') migrateHadith(sourceRoot, outputRoot, report);

  buildManifest(outputRoot, report);
  runSearchIndexBuilder(outputRoot);
  buildHealthAndFileIndex(outputRoot, report);
  writeReports(report);

  console.log('NOOR Sprint 26.5 ilm-mate migration complete.');
  console.log(`Output: ${OUTPUT_ROOT}`);
  console.log(`Quran: ${report.quran.surahCount} surahs, ${report.quran.ayahCount} ayat`);
  console.log(`Tafseer: ${report.tafseer.entryCount} entries`);
  console.log(`Hadith: ${report.hadith.collectionCount} collections, ${report.hadith.itemCount} items`);
  console.log(`Report: ${REPORT_MD}`);
}

if (!['all', 'quran', 'tafseer', 'hadith'].includes(ONLY)) {
  console.error(`Invalid --only value: ${ONLY}. Use all, quran, tafseer or hadith.`);
  process.exit(1);
}

migrate();
