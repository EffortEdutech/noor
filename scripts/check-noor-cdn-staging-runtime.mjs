import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const reportPath = path.join(root, 'content-pipeline', 'review', 'ilm-mate-v1', 'noor-cdn-staging-runtime', 'staging-runtime-test-report.json');
const envTemplatePath = path.join(root, '.env.local.staging-ilm-mate-v1');

function fail(message) {
  console.error(message);
  process.exit(1);
}

if (!fs.existsSync(reportPath)) {
  fail(`Missing staging runtime report. Run pnpm cdn:test-staging first. Expected: ${path.relative(root, reportPath)}`);
}

const report = JSON.parse(fs.readFileSync(reportPath, 'utf8'));

if (report.sprint !== '27.9') fail(`Expected sprint 27.9 report, got ${report.sprint}`);
if (!String(report.base || '').includes('@staging-ilm-mate-v1')) fail(`Report base is not staging branch: ${report.base}`);
if (report.targetBranch !== 'staging-ilm-mate-v1') fail(`Expected targetBranch staging-ilm-mate-v1, got ${report.targetBranch}`);
if (report.canPushNoorCdnMain !== false) fail('noor-cdn main must remain blocked.');
if (report.productionApproved !== false) fail('productionApproved must remain false.');
if (report.canPromoteToProduction !== false) fail('canPromoteToProduction must remain false.');
if (report.passed !== true) fail('Staging runtime report did not pass.');
if (report.requiredPassed !== report.requiredTotal) fail(`Required endpoints incomplete: ${report.requiredPassed}/${report.requiredTotal}`);

const requiredIds = [
  'manifest',
  'health',
  'search_manifest',
  'surah_index',
  'quran_001',
  'quran_002',
  'tafseer_001',
  'hadith_collections',
  'hadith_01',
  'search_lite'
];

const resultMap = new Map((report.results || []).map((item) => [item.id, item]));
for (const id of requiredIds) {
  const item = resultMap.get(id);
  if (!item) fail(`Missing runtime endpoint result: ${id}`);
  if (!item.passed) fail(`Runtime endpoint did not pass: ${id}`);
}

if (!fs.existsSync(envTemplatePath)) {
  console.warn('Warning: .env.local.staging-ilm-mate-v1 does not exist yet. Run pnpm cdn:staging-env to create it.');
} else {
  const envTemplate = fs.readFileSync(envTemplatePath, 'utf8');
  if (!envTemplate.includes('@staging-ilm-mate-v1')) fail('.env.local.staging-ilm-mate-v1 does not point to the staging branch.');
  if (!envTemplate.includes('NEXT_PUBLIC_NOOR_DATA_MODE=cdn')) fail('.env.local.staging-ilm-mate-v1 must set NEXT_PUBLIC_NOOR_DATA_MODE=cdn.');
}

console.log('NOOR Sprint 27.9 staging CDN runtime check passed.');
console.log(`Base: ${report.base}`);
console.log(`Required endpoints: ${report.requiredPassed}/${report.requiredTotal}`);
console.log('noor-cdn/main remains blocked. Production CDN remains blocked.');
