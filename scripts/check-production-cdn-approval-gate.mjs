import { existsSync, readFileSync } from 'node:fs';

const REPORT = 'content-pipeline/production-cdn/approval-gate/noor-production-cdn-approval-gate.json';
const REPORT_MD = 'content-pipeline/production-cdn/approval-gate/noor-production-cdn-approval-gate.md';

function fail(message) {
  console.error(message);
  process.exit(1);
}

function readJson(file) {
  return JSON.parse(readFileSync(file, 'utf8'));
}

if (!existsSync(REPORT)) fail(`Missing Sprint 27.13 approval gate report: ${REPORT}`);
if (!existsSync(REPORT_MD)) fail(`Missing Sprint 27.13 approval gate markdown report: ${REPORT_MD}`);

const report = readJson(REPORT);

if (report.sprint !== '27.13') fail('Production approval gate report must declare Sprint 27.13.');
if (report.title !== 'Production CDN Promotion Approval Gate') fail('Unexpected Sprint 27.13 approval gate title.');
if (report.approvalStatus !== 'approved_for_promotion') {
  fail('Production CDN approval gate is not approved. Run pnpm production:approval-gate -- --approve --approver "Darya Malak" --note "...".');
}
if (report.productionPromotionAllowed !== true) fail('Production promotion must be allowed by the Sprint 27.13 approval gate.');
if (report.promotionExecuted !== false) fail('Sprint 27.13 must not execute promotion. Promotion belongs to Sprint 27.14.');
if (report.noorCdnMainTouched !== false) fail('Sprint 27.13 must not touch noor-cdn/main.');
if (report.sourceBranch !== 'noor-cdn/staging-ilm-mate-v1') fail('Source branch must be noor-cdn/staging-ilm-mate-v1.');
if (report.targetBranch !== 'noor-cdn/main') fail('Target branch must be noor-cdn/main.');
if (!report.approvedBy || !report.approvedAt) fail('Approval must include approvedBy and approvedAt.');

if (!Array.isArray(report.gates) || report.gates.length < 8) fail('Approval report must include all required gates.');
const failedGates = report.gates.filter((gate) => gate.severity === 'required' && gate.status !== 'pass');
if (failedGates.length > 0) fail(`Approval report has failed gates: ${failedGates.map((gate) => gate.id).join(', ')}`);
if (Array.isArray(report.requiredFailures) && report.requiredFailures.length > 0) {
  fail(`Approval report has required failures: ${report.requiredFailures.map((gate) => gate.id ?? gate).join(', ')}`);
}

for (const id of [
  'staging-acceptance',
  'browser-qa',
  'quran',
  'tafseer',
  'hadith',
  'runtime-staging',
  'noor-cdn-staging-clean',
  'legacy-production-block-still-safe'
]) {
  const gate = report.gates.find((item) => item.id === id);
  if (!gate) fail(`Missing Sprint 27.13 gate: ${id}`);
  if (gate.status !== 'pass') fail(`Sprint 27.13 gate did not pass: ${id}`);
}

const md = readFileSync(REPORT_MD, 'utf8');
if (!md.includes('APPROVED FOR NEXT SPRINT PROMOTION')) fail('Approval markdown must show approved status.');
if (!md.includes('noor-cdn/main touched in this sprint: **NO**')) fail('Approval markdown must confirm noor-cdn/main was not touched.');

console.log('NOOR Sprint 27.13 production CDN approval gate check passed.');
console.log('Approved for Sprint 27.14 promotion only. noor-cdn/main remains untouched in Sprint 27.13.');
