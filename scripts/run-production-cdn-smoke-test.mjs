import { mkdirSync, writeFileSync } from 'node:fs';
import path from 'node:path';

const sprint = '27.15';
const outputRoot = 'content-pipeline/production-cdn/runtime-qa';
const reportJsonFile = path.join(outputRoot, 'production-cdn-smoke-test-report.json');
const reportMdFile = path.join(outputRoot, 'production-cdn-smoke-test-report.md');

const productionBases = [
  {
    id: 'jsdelivr-main',
    label: 'jsDelivr production main',
    required: true,
    baseUrl: process.env.NOOR_PRODUCTION_CDN_BASE || 'https://cdn.jsdelivr.net/gh/EffortEdutech/noor-cdn@main/noor-cdn'
  },
  {
    id: 'raw-github-main',
    label: 'Raw GitHub production main',
    required: true,
    baseUrl: 'https://raw.githubusercontent.com/EffortEdutech/noor-cdn/main/noor-cdn'
  },
  {
    id: 'github-pages-main',
    label: 'GitHub Pages production main',
    required: false,
    baseUrl: 'https://effortedutech.github.io/noor-cdn/noor-cdn'
  }
];

const fixedRequiredPaths = [
  { id: 'manifest', path: 'manifest/noor-content-manifest.json', expect: (json) => Boolean(json && typeof json === 'object') },
  { id: 'health', path: 'manifest/noor-content-health.json', expect: (json) => Boolean(json && typeof json === 'object') },
  { id: 'surah-index', path: 'metadata/surah-index.json', expect: (json) => Array.isArray(json?.surahs) || Array.isArray(json) },
  { id: 'quran-001', path: 'quran/surahs/001.json', expect: (json) => Array.isArray(json?.ayahs) || Array.isArray(json?.ayat) || Array.isArray(json?.verses) },
  { id: 'quran-114', path: 'quran/surahs/114.json', expect: (json) => Array.isArray(json?.ayahs) || Array.isArray(json?.ayat) || Array.isArray(json?.verses) },
  { id: 'tafseer-index', path: 'metadata/tafseer-index.json', expect: (json) => Array.isArray(json?.books) || Array.isArray(json?.sources) || Array.isArray(json?.editions) },
  { id: 'hadith-collections', path: 'hadith/collections.json', expect: (json) => Array.isArray(json?.collections) || Array.isArray(json) },
  { id: 'search-index', path: 'search/search-index.json', expect: (json) => Array.isArray(json?.entries) || Array.isArray(json?.items) || Array.isArray(json) }
];

function joinUrl(base, itemPath) {
  return `${base.replace(/\/+$/, '')}/${itemPath.replace(/^\/+/, '')}`;
}

async function fetchJson(baseUrl, itemPath) {
  const url = joinUrl(baseUrl, itemPath);
  const startedAt = Date.now();
  try {
    const response = await fetch(url, { cache: 'no-store' });
    const elapsedMs = Date.now() - startedAt;
    const text = await response.text();
    let json = null;
    let parseError = null;
    try {
      json = JSON.parse(text);
    } catch (error) {
      parseError = String(error?.message ?? error);
    }
    return {
      url,
      ok: response.ok && json !== null,
      httpStatus: response.status,
      elapsedMs,
      bytes: Buffer.byteLength(text, 'utf8'),
      json,
      parseError
    };
  } catch (error) {
    return {
      url,
      ok: false,
      httpStatus: 0,
      elapsedMs: Date.now() - startedAt,
      bytes: 0,
      json: null,
      error: String(error?.message ?? error)
    };
  }
}

function getArray(value, keys) {
  for (const key of keys) if (Array.isArray(value?.[key])) return value[key];
  return Array.isArray(value) ? value : [];
}

function unique(values) {
  return [...new Set(values.filter(Boolean).map(String))];
}

async function runBase(base) {
  const checks = [];
  const requiredFailures = [];

  for (const item of fixedRequiredPaths) {
    const result = await fetchJson(base.baseUrl, item.path);
    const contentOk = result.ok && item.expect(result.json);
    const status = contentOk ? 'pass' : 'fail';
    const check = {
      id: item.id,
      path: item.path,
      url: result.url,
      severity: 'required',
      status,
      httpStatus: result.httpStatus,
      elapsedMs: result.elapsedMs,
      bytes: result.bytes,
      parseError: result.parseError ?? null,
      error: result.error ?? null
    };
    checks.push(check);
    if (status !== 'pass') requiredFailures.push(`${base.id}:${item.id}`);
  }

  const tafseerIndex = checks.find((check) => check.id === 'tafseer-index')?.status === 'pass'
    ? (await fetchJson(base.baseUrl, 'metadata/tafseer-index.json')).json
    : null;
  const tafseerBooks = getArray(tafseerIndex, ['books', 'sources', 'editions']);
  const tafseerCandidates = unique([
    ...tafseerBooks.slice(0, 10).flatMap((book) => [book.id, book.slug, book.sourceId, book.key]),
    'ar-tafsir-ibn-kathir',
    'demo-tafseer'
  ]);
  let tafseerSample = null;
  for (const bookId of tafseerCandidates) {
    const candidate = await fetchJson(base.baseUrl, `tafseer/${encodeURIComponent(bookId)}/surahs/001.json`);
    if (candidate.ok) {
      tafseerSample = { bookId, ...candidate };
      break;
    }
  }
  checks.push({
    id: 'tafseer-sample-001',
    path: tafseerSample ? `tafseer/${tafseerSample.bookId}/surahs/001.json` : 'tafseer/<first-index-book>/surahs/001.json',
    url: tafseerSample?.url ?? null,
    severity: 'required',
    status: tafseerSample?.ok ? 'pass' : 'fail',
    httpStatus: tafseerSample?.httpStatus ?? 0,
    elapsedMs: tafseerSample?.elapsedMs ?? null,
    bytes: tafseerSample?.bytes ?? 0,
    selectedBookId: tafseerSample?.bookId ?? null
  });
  if (!tafseerSample?.ok) requiredFailures.push(`${base.id}:tafseer-sample-001`);

  const hadithCollectionsJson = checks.find((check) => check.id === 'hadith-collections')?.status === 'pass'
    ? (await fetchJson(base.baseUrl, 'hadith/collections.json')).json
    : null;
  const collections = getArray(hadithCollectionsJson, ['collections']);
  const firstCollection = collections.find((collection) => collection?.id);
  let hadithSample = null;
  if (firstCollection?.id) {
    hadithSample = await fetchJson(base.baseUrl, `hadith/${encodeURIComponent(firstCollection.id)}/items.json`);
  }
  checks.push({
    id: 'hadith-sample-items',
    path: firstCollection?.id ? `hadith/${firstCollection.id}/items.json` : 'hadith/<first-collection>/items.json',
    url: hadithSample?.url ?? null,
    severity: 'required',
    status: hadithSample?.ok && (Array.isArray(hadithSample.json?.items) || Array.isArray(hadithSample.json?.hadiths) || Array.isArray(hadithSample.json)) ? 'pass' : 'fail',
    httpStatus: hadithSample?.httpStatus ?? 0,
    elapsedMs: hadithSample?.elapsedMs ?? null,
    bytes: hadithSample?.bytes ?? 0,
    selectedCollectionId: firstCollection?.id ?? null
  });
  if (checks.at(-1).status !== 'pass') requiredFailures.push(`${base.id}:hadith-sample-items`);

  return {
    ...base,
    checkedAt: new Date().toISOString(),
    checks,
    summary: {
      total: checks.length,
      passed: checks.filter((check) => check.status === 'pass').length,
      failed: checks.filter((check) => check.status !== 'pass').length,
      requiredFailures
    }
  };
}

const baseResults = [];
for (const base of productionBases) {
  console.log(`Checking ${base.label}: ${base.baseUrl}`);
  baseResults.push(await runBase(base));
}

const requiredBaseFailures = baseResults
  .filter((base) => base.required)
  .flatMap((base) => base.summary.requiredFailures);

const optionalFailures = baseResults
  .filter((base) => !base.required)
  .flatMap((base) => base.summary.requiredFailures);

const report = {
  sprint,
  title: 'Production CDN Runtime Smoke Test',
  generatedAt: new Date().toISOString(),
  status: requiredBaseFailures.length === 0 ? 'production_runtime_passed' : 'production_runtime_failed',
  productionBranch: 'noor-cdn/main',
  requiredBases: productionBases.filter((base) => base.required).map((base) => base.id),
  optionalBases: productionBases.filter((base) => !base.required).map((base) => base.id),
  baseResults,
  requiredFailures: requiredBaseFailures,
  optionalFailures,
  note: 'Required production bases are jsDelivr @main and raw GitHub main. GitHub Pages is optional because repository Pages may be disabled or delayed.'
};

mkdirSync(outputRoot, { recursive: true });
writeFileSync(reportJsonFile, `${JSON.stringify(report, null, 2)}\n`, 'utf8');
writeFileSync(reportMdFile, `# Sprint 27.15 — Production CDN Runtime Smoke Test\n\nStatus: ${report.status}\n\nProduction branch: ${report.productionBranch}\n\nGenerated: ${report.generatedAt}\n\n## Required failures\n\n${report.requiredFailures.length ? report.requiredFailures.map((item) => `- ${item}`).join('\n') : '- None'}\n\n## Base results\n\n${report.baseResults.map((base) => `### ${base.label}\n\nBase: ${base.baseUrl}\n\nPassed: ${base.summary.passed}/${base.summary.total}\n\nFailures: ${base.summary.requiredFailures.length ? base.summary.requiredFailures.join(', ') : 'None'}`).join('\n\n')}\n`, 'utf8');

console.log(`NOOR Sprint 27.15 production CDN smoke test generated. Status: ${report.status}.`);
if (report.requiredFailures.length) {
  console.log('Required failures:');
  for (const failure of report.requiredFailures) console.log(`- ${failure}`);
}
console.log(`Report: ${reportMdFile}`);
