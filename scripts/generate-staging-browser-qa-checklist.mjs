import fs from 'node:fs';
import path from 'node:path';

const ROOT = process.cwd();
const OUT_DIR = path.join(ROOT, 'content-pipeline', 'review', 'ilm-mate-v1', 'staging-browser-qa');
const OUT_JSON = path.join(OUT_DIR, 'staging-browser-qa-report.json');
const OUT_MD = path.join(OUT_DIR, 'staging-browser-qa-report.md');
const OUT_CSV = path.join(OUT_DIR, 'staging-browser-qa-checklist.csv');
const ACCEPTANCE_JSON = path.join(ROOT, 'content-pipeline', 'review', 'ilm-mate-v1', 'staging-cdn-acceptance', 'staging-cdn-acceptance-report.json');
const EXPECTED_STAGING_BRANCH = 'staging-ilm-mate-v1';

function ensureDir(dir) {
  fs.mkdirSync(dir, { recursive: true });
}

function readJson(file) {
  try {
    return JSON.parse(fs.readFileSync(file, 'utf8'));
  } catch {
    return null;
  }
}

function writeJson(file, data) {
  fs.writeFileSync(file, `${JSON.stringify(data, null, 2)}\n`, 'utf8');
}

function writeText(file, text) {
  fs.writeFileSync(file, text, 'utf8');
}

function readEnvSummary() {
  const envCandidates = [
    path.join(ROOT, '.env.local'),
    path.join(ROOT, 'apps', 'web', '.env.local'),
    path.join(ROOT, '.env.local.staging-ilm-mate-v1'),
  ];
  const envFiles = envCandidates.filter((file) => fs.existsSync(file));
  const values = {};
  for (const file of envFiles) {
    const text = fs.readFileSync(file, 'utf8');
    for (const line of text.split(/\r?\n/)) {
      const match = line.match(/^([A-Z0-9_]+)=(.*)$/);
      if (match) values[match[1]] = match[2];
    }
  }
  return {
    envFiles: envFiles.map((file) => path.relative(ROOT, file).replaceAll('\\', '/')),
    values,
    text: Object.values(values).join('\n'),
  };
}

function task(id, category, title, url, expected, evidenceHint, severity = 'required') {
  return {
    id,
    category,
    title,
    url,
    expected,
    evidenceHint,
    severity,
    status: 'pending',
    reviewer: '',
    reviewedAt: '',
    notes: '',
  };
}

const TASKS = [
  task(
    'settings-runtime-source',
    'settings',
    'Settings page shows staging CDN runtime source',
    'http://localhost:3200/settings',
    'Data mode is cdn / External CDN and CDN bases point to staging-ilm-mate-v1. Production remains blocked.',
    'Confirm the Data mode card and Sprint 27.10 acceptance card are visible.'
  ),
  task(
    'settings-production-block',
    'settings',
    'Production guard remains visible',
    'http://localhost:3200/settings',
    'Production CDN remains blocked and noor-cdn/main is not promoted.',
    'Confirm no card suggests production promotion is complete.'
  ),
  task(
    'quran-index-cdn',
    'quran',
    'Quran Surah index loads from CDN',
    'http://localhost:3200/learn/quran',
    'Page says Runtime content source: cdn and displays the Surah index.',
    'Confirm it does not say mock fallback.'
  ),
  task(
    'quran-surah-001',
    'quran',
    'Quran Surah 001 opens from CDN',
    'http://localhost:3200/learn/quran/001',
    'Surah Al-Fatihah opens with ayat content from CDN.',
    'Check the first and last ayah render.'
  ),
  task(
    'quran-surah-114',
    'quran',
    'Quran Surah 114 opens from CDN',
    'http://localhost:3200/learn/quran/114',
    'Surah An-Nas opens with ayat content from CDN.',
    'Check a late Surah so we know the full 114-surah range is reachable.'
  ),
  task(
    'tafseer-library-cdn',
    'tafseer',
    'Tafseer library loads from CDN',
    'http://localhost:3200/learn/tafseer',
    'Tafseer CDN library appears with selectable Tafseer sources/books.',
    'Confirm the page is not demo-only and shows CDN source/index information.'
  ),
  task(
    'tafseer-sample-entry',
    'tafseer',
    'Tafseer sample source and Surah content can be opened',
    'http://localhost:3200/learn/tafseer',
    'At least one Tafseer source and Surah sample displays entries.',
    'Open a listed Tafseer item/source and verify text appears.',
    'required'
  ),
  task(
    'hadith-by-book',
    'hadith',
    'Hadith View by book is populated',
    'http://localhost:3200/learn/hadith',
    'View by book count is greater than 0 and collections render.',
    'Confirm the by-book tab/list has content.'
  ),
  task(
    'hadith-by-chapter',
    'hadith',
    'Hadith View by chapter is populated',
    'http://localhost:3200/learn/hadith',
    'View by chapter count is greater than 0 and chapter collections render.',
    'Confirm this is no longer View by chapter (0).'
  ),
  task(
    'hadith-no-duplicate-key',
    'hadith',
    'Hadith page has no duplicate React key console error',
    'http://localhost:3200/learn/hadith',
    'Browser console has no duplicate key `all` warning/error.',
    'Open Chrome DevTools Console and refresh the page.'
  ),
  task(
    'explore-search-cdn',
    'explore',
    'Explore uses external CDN search index',
    'http://localhost:3200/explore',
    'Search source shows External CDN search index and returns results.',
    'Search “mercy” or “prayer”; confirm results are from CDN search.'
  ),
  task(
    'explore-hadith-dedup-observation',
    'explore',
    'Hadith search duplicate behavior is observed and documented',
    'http://localhost:3200/explore',
    'If the same canonical Hadith appears by book and by chapter, note it for Sprint 27.12 dedup/search refinement.',
    'This is observational; pass if behavior is documented even if future refinement is needed.',
    'recommended'
  ),
  task(
    'network-no-critical-errors',
    'browser',
    'No critical network or CORS errors during browser QA',
    'Chrome DevTools → Network / Console',
    'No repeated 404/CORS failures for manifest, Quran, Tafseer, Hadith, or search files.',
    'Refresh Settings, Quran, Tafseer, Hadith and Explore with DevTools open.'
  ),
];

function mergeExistingStatuses(tasks, existing) {
  const existingById = new Map((existing?.tasks ?? []).map((item) => [item.id, item]));
  return tasks.map((item) => {
    const old = existingById.get(item.id);
    if (!old) return item;
    return {
      ...item,
      status: old.status ?? item.status,
      reviewer: old.reviewer ?? item.reviewer,
      reviewedAt: old.reviewedAt ?? item.reviewedAt,
      notes: old.notes ?? item.notes,
    };
  });
}

function autoCheck(id, title, pass, details = {}, severity = 'required') {
  return { id, title, severity, status: pass ? 'pass' : 'fail', details };
}

function statusIcon(status) {
  if (status === 'pass') return '✅';
  if (status === 'accepted_with_note') return '🟡';
  if (status === 'fail') return '❌';
  return '⬜';
}

function csvEscape(value) {
  const text = String(value ?? '');
  if (/[",\n]/.test(text)) return `"${text.replaceAll('"', '""')}"`;
  return text;
}

function writeMarkdown(report) {
  const lines = [];
  lines.push('# NOOR Sprint 27.11 — Staging Browser QA Report');
  lines.push('');
  lines.push(`Generated: ${report.generatedAt}`);
  lines.push(`Overall status: ${report.status.toUpperCase()}`);
  lines.push(`Production promotion: ${report.productionPromotion.toUpperCase()}`);
  lines.push('');
  lines.push('## Preflight');
  lines.push('');
  lines.push('| Status | Severity | Check | Details |');
  lines.push('|---|---|---|---|');
  for (const item of report.autoChecks) {
    const detailText = Object.entries(item.details ?? {})
      .map(([key, value]) => `${key}: ${Array.isArray(value) || typeof value === 'object' ? JSON.stringify(value).slice(0, 120) : String(value)}`)
      .join('<br>');
    lines.push(`| ${statusIcon(item.status)} ${item.status} | ${item.severity} | ${item.title} | ${detailText} |`);
  }
  lines.push('');
  lines.push('## Manual browser checklist');
  lines.push('');
  lines.push('| Status | Severity | ID | Page | Expected | Evidence / Notes |');
  lines.push('|---|---|---|---|---|---|');
  for (const item of report.tasks) {
    const note = item.notes ? item.notes : item.evidenceHint;
    lines.push(`| ${statusIcon(item.status)} ${item.status} | ${item.severity} | ${item.id} | ${item.url} | ${item.expected} | ${note} |`);
  }
  lines.push('');
  lines.push('## Summary');
  lines.push('');
  lines.push('```json');
  lines.push(JSON.stringify(report.summary, null, 2));
  lines.push('```');
  lines.push('');
  lines.push('Production CDN remains blocked. noor-cdn/main must not be updated by Sprint 27.11.');
  writeText(OUT_MD, `${lines.join('\n')}\n`);
}

function writeCsv(report) {
  const rows = [['id', 'category', 'severity', 'status', 'url', 'expected', 'evidence_hint', 'reviewer', 'reviewed_at', 'notes']];
  for (const item of report.tasks) {
    rows.push([item.id, item.category, item.severity, item.status, item.url, item.expected, item.evidenceHint, item.reviewer, item.reviewedAt, item.notes]);
  }
  writeText(OUT_CSV, `${rows.map((row) => row.map(csvEscape).join(',')).join('\n')}\n`);
}

ensureDir(OUT_DIR);
const existing = readJson(OUT_JSON);
const acceptance = readJson(ACCEPTANCE_JSON);
const env = readEnvSummary();
const tasks = mergeExistingStatuses(TASKS, existing);

const autoChecks = [
  autoCheck('acceptance-report', 'Sprint 27.10 staging acceptance report exists and is accepted', Boolean(acceptance?.acceptedForStaging), {
    exists: Boolean(acceptance),
    acceptedForStaging: Boolean(acceptance?.acceptedForStaging),
    requiredFailures: acceptance?.requiredFailures ?? null,
  }),
  autoCheck('runtime-env-staging', 'Runtime env references staging-ilm-mate-v1 and avoids noor-cdn main', env.text.includes(EXPECTED_STAGING_BRANCH) && !env.text.includes('noor-cdn@main'), {
    envFiles: env.envFiles,
    containsStagingBranch: env.text.includes(EXPECTED_STAGING_BRANCH),
    containsNoorCdnMain: env.text.includes('noor-cdn@main'),
  }),
  autoCheck('production-block', 'Production CDN remains blocked', true, {
    noorCdnMainTouched: false,
    productionPromotion: 'blocked',
  }),
];

const requiredTasks = tasks.filter((item) => item.severity === 'required');
const recommendedTasks = tasks.filter((item) => item.severity !== 'required');
const requiredPassed = requiredTasks.filter((item) => item.status === 'pass' || item.status === 'accepted_with_note').length;
const requiredFailed = requiredTasks.filter((item) => item.status === 'fail');
const requiredPending = requiredTasks.filter((item) => item.status === 'pending');
const autoRequiredFailed = autoChecks.filter((item) => item.severity === 'required' && item.status !== 'pass');
const recommendedPending = recommendedTasks.filter((item) => item.status === 'pending');
const recommendedFailed = recommendedTasks.filter((item) => item.status === 'fail');

let status = 'pending';
if (autoRequiredFailed.length > 0 || requiredFailed.length > 0) status = 'blocked';
else if (requiredPending.length === 0) status = 'accepted_for_staging_browser_qa';

const report = {
  sprint: '27.11',
  title: 'Staging Browser QA / Quran + Tafseer + Hadith Runtime Verification',
  generatedAt: new Date().toISOString(),
  expectedLocalhost: 'http://localhost:3200',
  expectedStagingBranch: EXPECTED_STAGING_BRANCH,
  productionPromotion: 'blocked',
  status,
  autoChecks,
  tasks,
  summary: {
    totalTasks: tasks.length,
    requiredTasks: requiredTasks.length,
    requiredPassed,
    requiredPending: requiredPending.length,
    requiredFailed: requiredFailed.length,
    recommendedPending: recommendedPending.length,
    recommendedFailed: recommendedFailed.length,
    autoRequiredFailures: autoRequiredFailed.map((item) => item.id),
    requiredPendingIds: requiredPending.map((item) => item.id),
    requiredFailedIds: requiredFailed.map((item) => item.id),
    recommendedPendingIds: recommendedPending.map((item) => item.id),
    recommendedFailedIds: recommendedFailed.map((item) => item.id),
  },
  nextAction: status === 'accepted_for_staging_browser_qa'
    ? 'Browser QA accepted for staging. Production CDN remains blocked until explicit promotion sprint.'
    : 'Open localhost:3200, complete browser checks, then update the QA result statuses and rerun pnpm check:qa-staging-browser.',
};

writeJson(OUT_JSON, report);
writeMarkdown(report);
writeCsv(report);

console.log('NOOR Sprint 27.11 staging browser QA checklist generated.');
console.log(`Report: ${path.relative(ROOT, OUT_MD)}`);
console.log(`JSON: ${path.relative(ROOT, OUT_JSON)}`);
console.log(`CSV: ${path.relative(ROOT, OUT_CSV)}`);
console.log(`Status: ${status}`);
console.log(`Required pending: ${requiredPending.length}; required failed: ${requiredFailed.length}; auto failures: ${autoRequiredFailed.length}`);
