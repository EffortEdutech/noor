import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const actionsRoot = path.join(root, 'content-pipeline', 'review', 'ilm-mate-v1', 'actions');
const actionRegisterPath = path.join(actionsRoot, 'review-actions-register.json');
const evidenceRegisterPath = path.join(actionsRoot, 'review-evidence-register.json');

function fail(message) {
  console.error(message);
  process.exit(1);
}

function readJson(filePath) {
  if (!fs.existsSync(filePath)) {
    fail(`Missing ${path.relative(root, filePath)}. Run pnpm ilm:review-actions first.`);
  }
  return JSON.parse(fs.readFileSync(filePath, 'utf8'));
}

const requiredFiles = [
  'review-actions-register.json',
  'review-actions-register.md',
  'review-actions-register.csv',
  'review-evidence-register.json',
  'review-evidence-register.md',
  'review-evidence-register.csv'
];

for (const file of requiredFiles) {
  const fullPath = path.join(actionsRoot, file);
  if (!fs.existsSync(fullPath)) {
    fail(`Missing review action output: ${path.relative(root, fullPath)}`);
  }
}

const actionRegister = readJson(actionRegisterPath);
const evidenceRegister = readJson(evidenceRegisterPath);

if (actionRegister.version !== '0.26.7') fail(`Expected review actions version 0.26.7, found ${actionRegister.version}`);
if (actionRegister.policy?.productionGateStatus !== 'blocked') fail('Sprint 26.7 production gate must remain blocked.');
if (actionRegister.policy?.productionApproved !== false) fail('Sprint 26.7 productionApproved must remain false.');

const domains = new Set(['quran', 'tafseer', 'hadith']);
const domainReviews = actionRegister.domainReviews || [];
if (domainReviews.length !== 3) fail(`Expected 3 domain reviews, found ${domainReviews.length}`);

for (const review of domainReviews) {
  if (!domains.has(review.domain)) fail(`Unexpected review domain: ${review.domain}`);
  if (review.productionApproved !== false) fail(`${review.domain} must not be production approved.`);
  if (!['blocked', 'needs-evidence', 'in-review', 'reviewed', 'approved-for-staging'].includes(review.status)) fail(`${review.domain} has invalid review status: ${review.status}`);
  const evidence = review.requiredEvidence || [];
  const missingRequired = evidence.filter((item) => item.required && !item.status);
  if (missingRequired.length > 0) fail(`${review.domain} has required evidence entries without status.`);
  const requiredCount = evidence.filter((item) => item.required).length;
  if (requiredCount < 6) fail(`${review.domain} must have at least 6 required evidence controls.`);
}

if (evidenceRegister.productionApproved !== false || evidenceRegister.status !== 'blocked') fail('Evidence register must remain blocked and not production approved.');

const evidenceEntries = evidenceRegister.entries || [];
if (evidenceEntries.length < 18) fail(`Expected at least 18 evidence entries, found ${evidenceEntries.length}`);

const approvedProductionEntries = evidenceEntries.filter((entry) => entry.status === 'approved-for-production' || entry.status === 'production-promoted');
if (approvedProductionEntries.length > 0) fail('No evidence entry may be approved-for-production or production-promoted in Sprint 26.7.');

console.log('NOOR Sprint 26.7 ilm-mate review actions check passed.');
console.log(`Review actions root: ${path.relative(root, actionsRoot)}`);
console.log(`Domain reviews: ${domainReviews.length}`);
console.log(`Evidence entries: ${evidenceEntries.length}`);
console.log('Status: blocked, productionApproved: false.');
