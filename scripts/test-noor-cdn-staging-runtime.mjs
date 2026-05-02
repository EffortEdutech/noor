import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const outputDir = path.join(root, 'content-pipeline', 'review', 'ilm-mate-v1', 'noor-cdn-staging-runtime');
const outputJson = path.join(outputDir, 'staging-runtime-test-report.json');
const outputMd = path.join(outputDir, 'staging-runtime-test-report.md');
const STAGING_BASE = (process.env.NOOR_STAGING_CDN_BASE || 'https://cdn.jsdelivr.net/gh/EffortEdutech/noor-cdn@staging-ilm-mate-v1/noor-cdn').replace(/\/+$/, '');

const endpoints = [
  { id: 'manifest', path: 'manifest/noor-content-manifest.json', required: true },
  { id: 'health', path: 'manifest/noor-content-health.json', required: true },
  { id: 'search_manifest', path: 'manifest/search-index-manifest.json', required: true },
  { id: 'surah_index', path: 'metadata/surah-index.json', required: true },
  { id: 'quran_001', path: 'quran/surahs/001.json', required: true },
  { id: 'quran_002', path: 'quran/surahs/002.json', required: true },
  { id: 'tafseer_001', path: 'tafseer/ar-tafsir-ibn-kathir/surahs/001.json', required: true },
  { id: 'hadith_collections', path: 'hadith/collections.json', required: true },
  { id: 'hadith_01', path: 'hadith/01/items.json', required: true },
  { id: 'search_lite', path: 'search/search-index-lite.json', required: true }
];

function joinUrl(base, filePath) {
  return `${base}/${filePath.replace(/^\/+/, '')}`;
}

function summarizeJson(id, data) {
  if (Array.isArray(data)) {
    return { shape: 'array', count: data.length };
  }

  if (data && typeof data === 'object') {
    const keys = Object.keys(data).slice(0, 20);
    const summary = { shape: 'object', keys };

    if (Array.isArray(data.ayat)) summary.ayat = data.ayat.length;
    if (Array.isArray(data.verses)) summary.verses = data.verses.length;
    if (Array.isArray(data.items)) summary.items = data.items.length;
    if (Array.isArray(data.collections)) summary.collections = data.collections.length;
    if (Array.isArray(data.entries)) summary.entries = data.entries.length;
    if (typeof data.totalEntries === 'number') summary.totalEntries = data.totalEntries;
    if (typeof data.totalAyat === 'number') summary.totalAyat = data.totalAyat;
    if (typeof data.totalHadithItems === 'number') summary.totalHadithItems = data.totalHadithItems;
    if (typeof data.version === 'string') summary.version = data.version;
    if (typeof data.status === 'string') summary.status = data.status;

    return summary;
  }

  return { shape: typeof data };
}

async function fetchEndpoint(endpoint) {
  const url = joinUrl(STAGING_BASE, endpoint.path);
  const started = Date.now();

  try {
    const response = await fetch(url, {
      cache: 'no-store',
      headers: {
        accept: 'application/json,text/plain,*/*',
        'user-agent': 'noor-sprint-27-9-staging-runtime-test'
      }
    });

    const text = await response.text();
    const durationMs = Date.now() - started;
    let parsed = null;
    let parseError = null;

    try {
      parsed = JSON.parse(text);
    } catch (error) {
      parseError = error instanceof Error ? error.message : String(error);
    }

    const passed = response.ok && !parseError;

    return {
      id: endpoint.id,
      path: endpoint.path,
      url,
      required: endpoint.required,
      passed,
      status: response.status,
      statusText: response.statusText,
      bytes: Buffer.byteLength(text, 'utf8'),
      durationMs,
      parseError,
      summary: parsed ? summarizeJson(endpoint.id, parsed) : null
    };
  } catch (error) {
    return {
      id: endpoint.id,
      path: endpoint.path,
      url,
      required: endpoint.required,
      passed: false,
      error: error instanceof Error ? error.message : String(error),
      durationMs: Date.now() - started
    };
  }
}

function renderMarkdown(report) {
  const rows = report.results.map((item) => `| ${item.id} | ${item.passed ? 'PASS' : 'FAIL'} | ${item.status ?? '-'} | ${item.bytes ?? '-'} | ${item.path} |`).join('\n');

  return `# NOOR Sprint 27.9 staging CDN runtime test\n\n` +
    `Base URL:\n\n\`\`\`text\n${report.base}\n\`\`\`\n\n` +
    `## Result\n\n` +
    `- Passed: ${report.passed}\n` +
    `- Required endpoints passed: ${report.requiredPassed}/${report.requiredTotal}\n` +
    `- Target branch: ${report.targetBranch}\n` +
    `- noor-cdn main allowed: ${report.canPushNoorCdnMain}\n` +
    `- Production promotion allowed: ${report.canPromoteToProduction}\n\n` +
    `| Endpoint | Result | HTTP | Bytes | Path |\n` +
    `|---|---:|---:|---:|---|\n${rows}\n\n` +
    `## Next browser test\n\n` +
    `Run:\n\n\`\`\`powershell\npnpm cdn:staging-env -- --write-local\npnpm dev\n\`\`\`\n\n` +
    `Open:\n\n- http://localhost:3200/settings\n- http://localhost:3200/learn/quran\n- http://localhost:3200/explore\n\n` +
    `Production CDN remains blocked.\n`;
}

async function main() {
  if (!STAGING_BASE.includes('@staging-ilm-mate-v1')) {
    throw new Error(`Refusing to test non-staging CDN base: ${STAGING_BASE}`);
  }

  fs.mkdirSync(outputDir, { recursive: true });

  const results = [];
  for (const endpoint of endpoints) {
    const result = await fetchEndpoint(endpoint);
    results.push(result);
    console.log(`${result.passed ? 'PASS' : 'FAIL'} ${endpoint.id} ${result.status ?? ''} ${endpoint.path}`);
  }

  const required = results.filter((item) => item.required);
  const requiredPassed = required.filter((item) => item.passed).length;

  const report = {
    sprint: '27.9',
    label: 'NOOR staging CDN runtime test',
    generatedAt: new Date().toISOString(),
    base: STAGING_BASE,
    targetRepo: 'EffortEdutech/noor-cdn',
    targetBranch: 'staging-ilm-mate-v1',
    passed: requiredPassed === required.length,
    requiredPassed,
    requiredTotal: required.length,
    canPushNoorCdnStaging: true,
    canPushNoorCdnMain: false,
    productionApproved: false,
    canPromoteToProduction: false,
    results
  };

  fs.writeFileSync(outputJson, `${JSON.stringify(report, null, 2)}\n`, 'utf8');
  fs.writeFileSync(outputMd, renderMarkdown(report), 'utf8');

  console.log(`Report: ${path.relative(root, outputJson)}`);
  console.log(`Required endpoints: ${requiredPassed}/${required.length}`);
  console.log(`Production promotion allowed: ${report.canPromoteToProduction}`);

  if (!report.passed) {
    process.exitCode = 1;
  }
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error);
  process.exit(1);
});
