import fs from 'node:fs';
import path from 'node:path';
import {
  outputRoot,
  recordsPath,
  readJson,
  summarize,
  validateRecords
} from './ilm-mate-evidence-record-utils.mjs';

const root = process.cwd();
const decisionRoot = path.join(outputRoot, 'reviewer-decisions');
const reportPath = path.join(decisionRoot, 'reviewer-decision-trial-report.json');
const reportMdPath = path.join(decisionRoot, 'reviewer-decision-trial-report.md');
const csvPath = path.join(decisionRoot, 'reviewer-decision-trial-updates.csv');

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

const records = readJson(recordsPath);
validateRecords(records);
const summary = summarize(records);

const requiredIds = [
  'ilm-mate-v1-quran-source_identity-evidence-record',
  'ilm-mate-v1-tafseer-source_identity-evidence-record',
  'ilm-mate-v1-hadith-source_identity-evidence-record'
];
for (const id of requiredIds) {
  const record = records.find((item) => item.id === id);
  assert(record, `Required Sprint 27.3 accepted source identity record missing: ${id}`);
  assert(record.completionStatus === 'accepted-for-staging', `${id} must be accepted-for-staging.`);
  assert(record.submissionStatus === 'accepted-for-staging', `${id} submissionStatus must be accepted-for-staging.`);
  assert(record.reviewerDecision === 'accepted-for-staging', `${id} reviewerDecision must be accepted-for-staging.`);
  assert(record.acceptedForStaging === true, `${id} acceptedForStaging must be true.`);
  assert(Boolean(record.reviewerName), `${id} must have reviewerName.`);
  assert(Boolean(record.dateReviewed), `${id} must have dateReviewed.`);
  assert(record.productionApproved === false, `${id} must not be production approved.`);
  assert(record.canApproveProduction === false, `${id} must not allow production approval.`);
}

for (const record of records.filter((item) => item.evidenceKey === 'production_promotion_approval')) {
  assert(record.completionStatus === 'blocked', `Production promotion record must remain blocked: ${record.id}`);
  assert(record.submissionStatus === 'blocked', `Production promotion submission must remain blocked: ${record.id}`);
  assert(record.lockedByGate === true, `Production promotion record must remain locked by gate: ${record.id}`);
  assert(record.productionApproved === false, `Production promotion record must not be production approved: ${record.id}`);
  assert(record.acceptedForStaging === false, `Production promotion record must not be accepted for staging: ${record.id}`);
}

assert(summary.acceptedForStaging === 3, `Expected exactly 3 accepted-for-staging records, got ${summary.acceptedForStaging}.`);
assert(summary.domainsReadyForStaging === 0, `Expected 0 domains ready for staging, got ${summary.domainsReadyForStaging}.`);
assert(summary.productionApproved === false, 'Summary productionApproved must be false.');
assert(summary.canPromoteToProduction === false, 'Summary canPromoteToProduction must be false.');
assert(summary.status === 'blocked', 'Summary status must remain blocked.');

for (const filePath of [reportPath, reportMdPath, csvPath]) {
  assert(fs.existsSync(filePath), `Missing reviewer decision output: ${path.relative(root, filePath)}`);
}
const report = readJson(reportPath);
assert(report.trialRecordsReviewed === 3, 'Report must show 3 trial records reviewed.');
assert(report.acceptedForStaging === 3, 'Report must show 3 accepted for staging.');
assert(report.status === 'blocked', 'Report status must remain blocked.');
assert(report.productionApproved === false, 'Report productionApproved must be false.');
assert(report.canPromoteToProduction === false, 'Report canPromoteToProduction must be false.');

console.log('NOOR Sprint 27.3 reviewer decision trial check passed.');
console.log(`Accepted for staging: ${summary.acceptedForStaging}`);
console.log(`Domains ready for staging: ${summary.domainsReadyForStaging}/3`);
console.log('Status: blocked, productionApproved: false, canPromoteToProduction: false.');
