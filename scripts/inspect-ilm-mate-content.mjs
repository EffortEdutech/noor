import { existsSync, mkdirSync, readdirSync, readFileSync, statSync, writeFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';

const DEFAULT_REPORT_JSON = 'content-pipeline/imported/ilm-mate-v1/inspection-report.json';
const DEFAULT_REPORT_MD = 'content-pipeline/imported/ilm-mate-v1/inspection-report.md';

function parseArg(name, fallback = undefined) {
  const prefix = `--${name}=`;
  const inline = process.argv.find((arg) => arg.startsWith(prefix));
  if (inline) return inline.slice(prefix.length);
  const index = process.argv.indexOf(`--${name}`);
  if (index >= 0 && process.argv[index + 1]) return process.argv[index + 1];
  return fallback;
}

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
  try {
    if (!existsSync(file)) return fallback;
    const text = readFileSync(file, 'utf8').trim();
    if (!text) return fallback;
    return JSON.parse(text);
  } catch (error) {
    return { __parseError: error.message };
  }
}

function countJsonFiles(dir) {
  if (!existsSync(dir)) return 0;
  let count = 0;
  for (const name of readdirSync(dir)) {
    const full = join(dir, name);
    const stat = statSync(full);
    if (stat.isDirectory()) count += countJsonFiles(full);
    if (stat.isFile() && name.endsWith('.json')) count += 1;
  }
  return count;
}

function listDirs(dir) {
  if (!existsSync(dir)) return [];
  return readdirSync(dir)
    .map((name) => ({ name, full: join(dir, name) }))
    .filter((item) => statSync(item.full).isDirectory())
    .map((item) => item.name)
    .sort();
}

function listJson(dir) {
  if (!existsSync(dir)) return [];
  return readdirSync(dir).filter((name) => name.endsWith('.json')).sort();
}

function ensureDir(file) {
  mkdirSync(dirname(file), { recursive: true });
}

function writeJson(file, value) {
  ensureDir(file);
  writeFileSync(file, `${JSON.stringify(value, null, 2)}\n`, 'utf8');
}

function writeMarkdown(file, report) {
  ensureDir(file);
  const q = report.quran;
  const t = report.tafseer;
  const h = report.hadith;
  const lines = [
    '# NOOR Sprint 26.5 — ilm-mate Content Inspection Report',
    '',
    `Generated: ${report.generatedAt}`,
    `Source root: \`${report.sourceRoot}\``,
    '',
    '## Summary',
    '',
    `- Quran edition registry entries: ${q.selectedEditionCount}`,
    `- Quran JSON files in content/quran/db: ${q.dbJsonCount}`,
    `- Quran metadata files: ${q.metaJsonCount}`,
    `- Tafseer edition folders: ${t.editionFolderCount}`,
    `- Tafseer JSON files: ${t.totalJsonFiles}`,
    `- Hadith JSON files: ${h.totalJsonFiles}`,
    '',
    '## Quran editions',
    '',
    ...q.editions.map((e) => `- ${e.key} — ${e.language} — ${e.fileExists ? 'present' : 'missing'}${e.parseOk ? '' : ' — invalid/empty'}`),
    '',
    '## Tafseer editions',
    '',
    ...t.editions.map((e) => `- ${e.slug} — ${e.language ?? 'unknown'} — ${e.fileCount} JSON files`),
    '',
    '## Hadith book folders',
    '',
    ...h.books.map((b) => `- ${b.path} — ${b.fileCount} JSON files`),
    '',
    '## Notes',
    '',
    '- This inspection does not promote content to production.',
    '- Sprint 26.5 migration writes a staging pack only.',
    '- Production approval still requires licensing, source integrity and scholarly review.'
  ];
  writeFileSync(file, `${lines.join('\n')}\n`, 'utf8');
}

function inspect() {
  const sourceRoot = resolveSourceRoot();
  const selectedEditions = readJson(join(sourceRoot, 'quran', 'selected-editions.json'), {});
  const quranEditions = Array.isArray(selectedEditions?.quran?.editions) ? selectedEditions.quran.editions : [];
  const tafseerEditions = Array.isArray(selectedEditions?.tafsir?.editions) ? selectedEditions.tafsir.editions : [];

  const quran = {
    selectedEditionCount: quranEditions.length,
    dbJsonCount: listJson(join(sourceRoot, 'quran', 'db')).length,
    metaJsonCount: listJson(join(sourceRoot, 'quran', 'meta')).length,
    editions: quranEditions.map((edition) => {
      const file = resolve(sourceRoot, '..', edition.file ?? '');
      const directFile = join(sourceRoot, 'quran', 'db', `${edition.key}.json`);
      const target = existsSync(file) ? file : directFile;
      const parsed = readJson(target, null);
      return {
        key: edition.key,
        language: edition.language,
        langCode: edition.lang_code,
        file: target,
        fileExists: existsSync(target),
        parseOk: Boolean(parsed && !parsed.__parseError),
        hasSurahs: Boolean(parsed?.surahs)
      };
    })
  };

  const tafseerDb = join(sourceRoot, 'tafsir', 'db');
  const tafseerFolders = listDirs(tafseerDb);
  const tafseer = {
    editionFolderCount: tafseerFolders.length,
    totalJsonFiles: countJsonFiles(tafseerDb),
    editions: tafseerFolders.map((slug) => {
      const registry = tafseerEditions.find((entry) => entry.slug === slug) ?? {};
      return {
        slug,
        language: registry.language,
        label: registry.label_en ?? registry.label,
        fileCount: listJson(join(tafseerDb, slug)).length
      };
    })
  };

  const hadithDb = join(sourceRoot, 'hadith', 'db');
  const books = [];
  function walkHadith(current, relativePath = '') {
    if (!existsSync(current)) return;
    const jsonFiles = listJson(current);
    if (jsonFiles.length > 0) books.push({ path: relativePath || '.', fileCount: jsonFiles.length, files: jsonFiles });
    for (const dir of listDirs(current)) walkHadith(join(current, dir), join(relativePath, dir).replaceAll('\\\\', '/').replaceAll('\\', '/'));
  }
  walkHadith(hadithDb);

  const report = {
    name: 'NOOR Sprint 26.5 ilm-mate Content Inspection',
    generatedAt: new Date().toISOString(),
    sourceRoot,
    quran,
    tafseer,
    hadith: {
      totalJsonFiles: countJsonFiles(hadithDb),
      books
    }
  };

  writeJson(DEFAULT_REPORT_JSON, report);
  writeMarkdown(DEFAULT_REPORT_MD, report);

  console.log('NOOR Sprint 26.5 ilm-mate inspection complete.');
  console.log(`Source root: ${sourceRoot}`);
  console.log(`Quran editions: ${quran.selectedEditionCount}`);
  console.log(`Tafseer folders: ${tafseer.editionFolderCount}`);
  console.log(`Hadith JSON files: ${report.hadith.totalJsonFiles}`);
  console.log(`Report: ${DEFAULT_REPORT_MD}`);
}

inspect();
