import { existsSync, readFileSync } from 'node:fs';

const EXPECTED_VERSION = '0.24.0';

function fail(message) {
  console.error(message);
  process.exit(1);
}

function read(file) {
  return readFileSync(file, 'utf8');
}

function readJson(file) {
  return JSON.parse(read(file));
}

for (const file of [
  'content-pipeline/review/noor-scholarly-review-console.json',
  'content-pipeline/review/audit/noor-scholarly-review-audit.json',
  'content-pipeline/review/audit/noor-scholarly-review-audit.md',
  'scripts/generate-noor-review-console.mjs',
  'scripts/check-noor-review-console.mjs',
  'apps/web/components/ScholarlyReviewConsoleCard.tsx',
  'docs/NOOR_SCHOLARLY_REVIEW_CONSOLE.md',
  'docs/SPRINT_24_SCOPE.md',
  'docs/LOCAL_TESTING_SPRINT_24.md'
]) {
  if (!existsSync(file)) fail(`Missing Sprint 24 review console file: ${file}`);
}

const registry = readJson('content-pipeline/review/noor-scholarly-review-console.json');
if (registry.version !== EXPECTED_VERSION) fail(`Review registry must be ${EXPECTED_VERSION}.`);
if (registry.status !== 'blocked') fail('Review registry status must remain blocked.');
if (registry.productionApprovalPolicy?.autoApprovalAllowed !== false) fail('Review console must not allow auto approval.');

const cases = Array.isArray(registry.reviewCases) ? registry.reviewCases : [];
if (cases.length !== 3) fail('Review console must include exactly three review cases.');
const domains = new Set(cases.map((item) => item.domain));
for (const domain of ['quran', 'tafseer', 'hadith']) {
  if (!domains.has(domain)) fail(`Review console missing ${domain} review case.`);
}
for (const item of cases) {
  if (item.approvalStatus !== 'blocked') fail(`${item.id} must remain blocked.`);
  for (const evidence of ['source identity', 'license/permission', 'attribution wording', 'checksum/integrity plan', 'scholarly reviewer sign-off']) {
    if (!item.requiredEvidence?.includes(evidence)) fail(`${item.id} missing required evidence: ${evidence}`);
  }
  if (item.signOff?.reviewerName !== null) fail(`${item.id} should not have reviewer sign-off yet.`);
}

const audit = readJson('content-pipeline/review/audit/noor-scholarly-review-audit.json');
if (audit.version !== EXPECTED_VERSION) fail(`Review audit must be ${EXPECTED_VERSION}.`);
if (audit.gateStatus !== 'blocked' || audit.productionPromotionAllowed !== false) {
  fail('Review audit must keep production promotion blocked.');
}

const pipeline = read('apps/web/lib/content-pipeline.ts');
for (const expected of ['NOOR_SCHOLARLY_REVIEW_CONSOLE', 'noor-scholarly-review-console-v1', 'review:console', 'check:review-console']) {
  if (!pipeline.includes(expected)) fail(`content-pipeline.ts missing ${expected}`);
}

const settings = read('apps/web/app/settings/page.tsx');
if (!settings.includes('ScholarlyReviewConsoleCard')) fail('Settings must render ScholarlyReviewConsoleCard.');

const ci = read('.github/workflows/noor-ci.yml');
for (const expected of ['pnpm review:console', 'pnpm check:review-console']) {
  if (!ci.includes(expected)) fail(`CI workflow missing ${expected}`);
}

console.log(`NOOR Sprint 24 scholarly review console check passed for v${EXPECTED_VERSION}.`);
