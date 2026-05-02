import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const recordsPath = path.join(root, 'content-pipeline', 'review', 'ilm-mate-v1', 'evidence-records', 'evidence-completion-records.json');
const outputRoot = path.join(root, 'content-pipeline', 'review', 'ilm-mate-v1', 'required-evidence-trial');
const reportPath = path.join(outputRoot, 'required-evidence-trial-report.json');
const acceptanceReportPath = path.join(root, 'content-pipeline', 'review', 'ilm-mate-v1', 'evidence-records', 'required-evidence-acceptance', 'required-evidence-acceptance-report.json');

const domains = ['quran', 'tafseer', 'hadith'];
const sourceKey = 'source_identity';
const targetKeys = [
  'license_or_permission',
  'attribution_wording',
  'checksum_integrity_plan',
  'scholarly_reviewer_signoff'
];

function fail(message) {
  console.error(message);
  process.exit(1);
}

function requireFile(filePath) {
  if (!fs.existsSync(filePath)) fail(`Required Sprint 27.5 file missing: ${path.relative(root, filePath)}`);
}

function readJson(filePath) {
  requireFile(filePath);
  return JSON.parse(fs.readFileSync(filePath, 'utf8'));
}

function findRecord(records, domain, evidenceKey) {
  return records.find((record) => record.domain === domain && record.evidenceKey === evidenceKey);
}

requireFile(reportPath);
requireFile(path.join(outputRoot, 'required-evidence-trial-report.md'));
requireFile(path.join(outputRoot, 'required-evidence-trial-submissions.csv'));
requireFile(path.join(outputRoot, 'required-evidence-domain-status.csv'));

const records = readJson(recordsPath);
const report = readJson(reportPath);
const acceptanceApplied = fs.existsSync(acceptanceReportPath);
const acceptanceReport = acceptanceApplied ? readJson(acceptanceReportPath) : null;

if (!Array.isArray(records) || records.length !== 18) fail(`Expected 18 evidence records, got ${Array.isArray(records) ? records.length : 'non-array'}.`);
if (report.sprint !== '27.5') fail(`Expected Sprint 27.5 report, got ${report.sprint}.`);
if (report.status !== 'blocked') fail(`Sprint 27.5 status must remain blocked, got ${report.status}.`);
if (report.productionApproved !== false) fail('Sprint 27.5 must not approve production.');
if (report.canPromoteToProduction !== false) fail('Sprint 27.5 must not allow production promotion.');
if (report.canPushNoorCdnMain !== false) fail('Sprint 27.5 must not allow noor-cdn/main push.');
if (report.trialSubmittedRecords !== 12) fail(`Expected 12 trial submitted records, got ${report.trialSubmittedRecords}.`);
if (report.domainsReadyForReviewerDecision !== 3) fail(`Expected 3 domains ready for reviewer decision, got ${report.domainsReadyForReviewerDecision}.`);
if (report.productionApprovalRecordsBlocked !== 3) fail(`Expected 3 blocked production approval records, got ${report.productionApprovalRecordsBlocked}.`);

if (!acceptanceApplied) {
  if (report.canPushNoorCdnStaging !== false) fail('Sprint 27.5 must not allow noor-cdn staging push before Sprint 27.6 acceptance.');
  if (report.domainsReadyForStaging !== 0) fail(`Expected 0 domains ready for staging before acceptance, got ${report.domainsReadyForStaging}.`);
} else {
  if (acceptanceReport.sprint !== '27.6') fail(`Expected Sprint 27.6 acceptance report, got ${acceptanceReport.sprint}.`);
  if (acceptanceReport.productionApproved !== false) fail('Sprint 27.6 acceptance must not approve production.');
  if (acceptanceReport.canPromoteToProduction !== false) fail('Sprint 27.6 acceptance must not allow production promotion.');
  if (acceptanceReport.canPushNoorCdnMain !== false) fail('Sprint 27.6 acceptance must not allow noor-cdn/main push.');
}

for (const domain of domains) {
  const sourceRecord = findRecord(records, domain, sourceKey);
  if (!sourceRecord) fail(`Missing source identity record for ${domain}.`);
  if (sourceRecord.completionStatus !== 'accepted-for-staging' || sourceRecord.acceptedForStaging !== true) {
    fail(`${domain} source identity must remain accepted-for-staging.`);
  }

  for (const evidenceKey of targetKeys) {
    const record = findRecord(records, domain, evidenceKey);
    if (!record) fail(`Missing ${domain}/${evidenceKey} record.`);

    if (acceptanceApplied) {
      if (record.completionStatus !== 'accepted-for-staging') fail(`${domain}/${evidenceKey} must be accepted-for-staging after Sprint 27.6, got ${record.completionStatus}.`);
      if (record.submissionStatus !== 'accepted-for-staging') fail(`${domain}/${evidenceKey} submissionStatus must be accepted-for-staging after Sprint 27.6.`);
      if (record.reviewerDecision !== 'accepted-for-staging') fail(`${domain}/${evidenceKey} reviewerDecision must be accepted-for-staging after Sprint 27.6.`);
      if (record.acceptedForStaging !== true) fail(`${domain}/${evidenceKey} must be accepted for staging after Sprint 27.6.`);
      if (!String(record.requiredEvidenceAcceptanceReference || '').startsWith(`NOOR-S27.6-ACCEPT-${domain.toUpperCase()}-`)) {
        fail(`${domain}/${evidenceKey} requiredEvidenceAcceptanceReference must be a Sprint 27.6 acceptance reference.`);
      }
    } else {
      if (record.completionStatus !== 'submitted') fail(`${domain}/${evidenceKey} must be submitted, got ${record.completionStatus}.`);
      if (record.submissionStatus !== 'submitted') fail(`${domain}/${evidenceKey} submissionStatus must be submitted.`);
      if (record.reviewerDecision !== 'pending') fail(`${domain}/${evidenceKey} reviewerDecision must remain pending.`);
      if (record.acceptedForStaging !== false) fail(`${domain}/${evidenceKey} must not be accepted for staging in Sprint 27.5.`);
    }

    if (record.productionApproved !== false || record.canApproveProduction !== false) {
      fail(`${domain}/${evidenceKey} must not approve production.`);
    }
    if (!String(record.evidenceReference || '').startsWith(`NOOR-S27.5-TRIAL-${domain.toUpperCase()}-`)) {
      fail(`${domain}/${evidenceKey} evidenceReference must be a Sprint 27.5 trial reference.`);
    }
  }

  const productionRecord = findRecord(records, domain, 'production_promotion_approval');
  if (!productionRecord) fail(`Missing production approval record for ${domain}.`);
  if (productionRecord.completionStatus !== 'blocked' || productionRecord.submissionStatus !== 'blocked') {
    fail(`${domain} production approval must remain blocked.`);
  }
  if (productionRecord.lockedByGate !== true || productionRecord.productionApproved !== false) {
    fail(`${domain} production approval gate must remain locked and false.`);
  }
}

console.log('NOOR Sprint 27.5 required evidence submission trial check passed.');
console.log(`Lifecycle mode: ${acceptanceApplied ? 'post-Sprint 27.6 acceptance' : 'Sprint 27.5 submitted trial'}`);
console.log(`Trial submitted records: ${report.trialSubmittedRecords}`);
console.log(`Domains ready for reviewer decision: ${report.domainsReadyForReviewerDecision}/3`);
console.log(`Domains ready for staging: ${acceptanceApplied ? acceptanceReport.domainsReadyForStaging : report.domainsReadyForStaging}/3`);
console.log('Status: blocked, productionApproved: false, canPromoteToProduction: false.');
