import fs from 'node:fs';
import path from 'node:path';
import {
  root,
  outputRoot,
  recordsPath,
  workflowPath,
  readJson,
  validateRecords,
  summarize
} from './ilm-mate-evidence-record-utils.mjs';

const trialRoot = path.join(outputRoot, 'trial');
const reportPath = path.join(trialRoot, 'evidence-update-trial-report.json');
const commandsPath = path.join(trialRoot, 'sample-submission-commands.md');
const expectedIds = [
  'ilm-mate-v1-quran-source_identity-evidence-record',
  'ilm-mate-v1-tafseer-source_identity-evidence-record',
  'ilm-mate-v1-hadith-source_identity-evidence-record'
];

function fail(message) {
  console.error(message);
  process.exit(1);
}
function exists(filePath) {
  return fs.existsSync(filePath);
}

if (!exists(recordsPath)) fail(`Evidence records missing: ${path.relative(root, recordsPath)}. Run pnpm ilm:evidence-records first.`);
if (!exists(workflowPath)) fail(`Evidence workflow missing: ${path.relative(root, workflowPath)}. Run pnpm ilm:evidence-records first.`);
if (!exists(reportPath)) fail(`Sprint 27.2 trial report missing: ${path.relative(root, reportPath)}. Run pnpm ilm:evidence-trial first.`);
if (!exists(commandsPath)) fail(`Sprint 27.2 sample commands missing: ${path.relative(root, commandsPath)}. Run pnpm ilm:evidence-trial first.`);

const records = readJson(recordsPath);
validateRecords(records);
const workflow = readJson(workflowPath);
const report = readJson(reportPath);
const summary = summarize(records);

if (records.length !== 18) fail(`Expected 18 evidence records, got ${records.length}.`);
if (report.version !== '0.27.2') fail(`Expected report version 0.27.2, got ${report.version}.`);
if (report.sprint !== '27.2') fail(`Expected sprint 27.2 report, got ${report.sprint}.`);
if (report.productionApproved !== false || report.canPromoteToProduction !== false || report.status !== 'blocked') {
  fail('Trial report must keep production promotion blocked.');
}
if (workflow.policy?.productionApproved !== false || workflow.policy?.canPromoteToProduction !== false || workflow.policy?.status !== 'blocked') {
  fail('Evidence workflow policy must keep production promotion blocked.');
}
if (summary.productionApproved !== false || summary.canPromoteToProduction !== false || summary.status !== 'blocked') {
  fail('Evidence summary must keep production promotion blocked.');
}

for (const id of expectedIds) {
  const record = records.find((item) => item.id === id);
  if (!record) fail(`Expected trial record missing: ${id}`);
  if (record.completionStatus !== 'submitted') fail(`Trial record must be submitted: ${id}`);
  if (record.submissionStatus !== 'submitted') fail(`Trial record submissionStatus must be submitted: ${id}`);
  if (record.reviewerDecision !== 'pending') fail(`Trial record reviewer decision must remain pending: ${id}`);
  if (record.acceptedForStaging !== false) fail(`Trial record must not be accepted for staging: ${id}`);
  if (record.productionApproved !== false || record.canApproveProduction !== false) fail(`Trial record must not approve production: ${id}`);
  if (!record.evidenceReference || !record.sourceUrlOrDocument || !record.dateSubmitted) fail(`Trial record must include submission reference, source document and date: ${id}`);
  if (!String(record.trialSubmissionId || '').startsWith('sprint-27-2-')) fail(`Trial record missing Sprint 27.2 trialSubmissionId: ${id}`);
}

for (const record of records.filter((item) => item.evidenceKey === 'production_promotion_approval')) {
  if (record.completionStatus !== 'blocked' || record.submissionStatus !== 'blocked') fail(`Production promotion record must stay blocked: ${record.id}`);
  if (record.lockedByGate !== true) fail(`Production promotion record must remain locked: ${record.id}`);
  if (record.productionApproved !== false || record.canApproveProduction !== false) fail(`Production promotion record must not approve production: ${record.id}`);
}

if (summary.acceptedForStaging !== 0) fail(`Sprint 27.2 trial should not accept any record for staging. Accepted: ${summary.acceptedForStaging}`);
if (summary.domainsReadyForStaging !== 0) fail(`Sprint 27.2 trial should not mark domains ready for staging. Ready: ${summary.domainsReadyForStaging}`);
if (report.submittedTrialRecords !== expectedIds.length) fail(`Expected ${expectedIds.length} trial records in report, got ${report.submittedTrialRecords}.`);

console.log('NOOR Sprint 27.2 evidence update trial check passed.');
console.log(`Trial records submitted: ${expectedIds.length}`);
console.log(`Accepted for staging: ${summary.acceptedForStaging}`);
console.log('Status: blocked, productionApproved: false, canPromoteToProduction: false.');
