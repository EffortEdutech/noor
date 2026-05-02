import fs from 'node:fs';
import path from 'node:path';

const ROOT = process.cwd();
const REPORT = path.join(ROOT, 'content-pipeline', 'review', 'ilm-mate-v1', 'staging-browser-qa', 'staging-browser-qa-report.json');

function fail(message, details = []) {
  console.error(message);
  for (const detail of details) console.error(`- ${detail}`);
  console.error('Production promotion remains blocked. Complete browser QA and rerun pnpm check:qa-staging-browser.');
  process.exit(1);
}

if (!fs.existsSync(REPORT)) {
  fail('NOOR Sprint 27.11 browser QA report not found.', ['Run: pnpm qa:staging-browser']);
}

let report;
try {
  report = JSON.parse(fs.readFileSync(REPORT, 'utf8'));
} catch (error) {
  fail('NOOR Sprint 27.11 browser QA report is not valid JSON.', [error.message]);
}

const autoFailures = (report.autoChecks ?? []).filter((item) => item.severity === 'required' && item.status !== 'pass');
const requiredTasks = (report.tasks ?? []).filter((item) => item.severity === 'required');
const pending = requiredTasks.filter((item) => item.status === 'pending');
const failed = requiredTasks.filter((item) => item.status === 'fail');
const invalid = requiredTasks.filter((item) => !['pass', 'accepted_with_note', 'pending', 'fail'].includes(item.status));

if (autoFailures.length > 0) {
  fail('NOOR Sprint 27.11 browser QA preflight failed.', autoFailures.map((item) => `${item.id}: ${item.title}`));
}

if (invalid.length > 0) {
  fail('NOOR Sprint 27.11 browser QA has invalid status values.', invalid.map((item) => `${item.id}: ${item.status}`));
}

if (failed.length > 0) {
  fail('NOOR Sprint 27.11 browser QA has failed required checks.', failed.map((item) => `${item.id}: ${item.notes || item.expected}`));
}

if (pending.length > 0) {
  fail('NOOR Sprint 27.11 browser QA still has pending required checks.', pending.map((item) => `${item.id}: ${item.title}`));
}

if (report.productionPromotion !== 'blocked') {
  fail('NOOR Sprint 27.11 must keep production promotion blocked.', [`productionPromotion=${report.productionPromotion}`]);
}

console.log('NOOR Sprint 27.11 browser QA check passed.');
console.log(`Report: ${path.relative(ROOT, REPORT)}`);
console.log('Staging browser QA accepted. Production CDN remains blocked.');
