import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const recordsPath = path.join(root, 'content-pipeline', 'review', 'ilm-mate-v1', 'evidence-records', 'evidence-completion-records.json');
const outputRoot = path.join(root, 'content-pipeline', 'review', 'ilm-mate-v1', 'evidence-records', 'required-evidence-acceptance');
const reportPath = path.join(outputRoot, 'required-evidence-acceptance-report.json');
const stagingReportPath = path.join(root, 'content-pipeline', 'review', 'ilm-mate-v1', 'staging-cdn-publish', 'staging-cdn-publish-report.json');

const NON_PRODUCTION_REQUIRED = [
  'source_identity',
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
  if (!fs.existsSync(filePath)) fail(`Required Sprint 27.6 file missing: ${path.relative(root, filePath)}`);
}

requireFile(recordsPath);
requireFile(reportPath);
requireFile(path.join(outputRoot, 'required-evidence-acceptance-report.md'));
requireFile(path.join(outputRoot, 'required-evidence-acceptance-updates.csv'));
requireFile(path.join(outputRoot, 'domain-staging-readiness.csv'));
requireFile(path.join(outputRoot, 'future-staging-cdn-next-step.md'));

const records = JSON.parse(fs.readFileSync(recordsPath, 'utf8'));
const report = JSON.parse(fs.readFileSync(reportPath, 'utf8'));

if (!Array.isArray(records) || records.length !== 18) fail(`Expected 18 evidence records, got ${Array.isArray(records) ? records.length : 'non-array'}.`);
if (report.sprint !== '27.6') fail(`Expected Sprint 27.6 report, got ${report.sprint}.`);
if (report.requiredEvidenceReviewed !== 12) fail(`Expected 12 reviewed required evidence records, got ${report.requiredEvidenceReviewed}.`);
if (report.acceptedForStaging !== 15) fail(`Expected 15 accepted non-production records, got ${report.acceptedForStaging}.`);
if (report.domainsReadyForStaging !== 3) fail(`Expected 3/3 domains ready for staging, got ${report.domainsReadyForStaging}/3.`);
if (report.canPushNoorCdnStaging !== true) fail('Sprint 27.6 should allow a future noor-cdn staging branch candidate.');
if (report.canPushNoorCdnMain !== false) fail('Sprint 27.6 must not allow noor-cdn/main push.');
if (report.productionApproved !== false || report.canPromoteToProduction !== false || report.status !== 'blocked') {
  fail('Sprint 27.6 must keep production blocked.');
}
if (report.blockedProductionApprovalRecords !== 3) fail(`Expected 3 blocked production approval records, got ${report.blockedProductionApprovalRecords}.`);

for (const domain of ['quran', 'tafseer', 'hadith']) {
  const domainRecords = records.filter((record) => record.domain === domain);
  for (const evidenceKey of NON_PRODUCTION_REQUIRED) {
    const record = domainRecords.find((item) => item.evidenceKey === evidenceKey);
    if (!record) fail(`Missing ${domain}/${evidenceKey} evidence record.`);
    if (record.completionStatus !== 'accepted-for-staging') fail(`${domain}/${evidenceKey} must be accepted-for-staging.`);
    if (record.submissionStatus !== 'accepted-for-staging') fail(`${domain}/${evidenceKey} submissionStatus must be accepted-for-staging.`);
    if (record.reviewerDecision !== 'accepted-for-staging') fail(`${domain}/${evidenceKey} reviewerDecision must be accepted-for-staging.`);
    if (record.acceptedForStaging !== true) fail(`${domain}/${evidenceKey} acceptedForStaging must be true.`);
    if (!record.reviewerName || !record.dateReviewed) fail(`${domain}/${evidenceKey} must have reviewerName and dateReviewed.`);
    if (record.productionApproved === true || record.canApproveProduction === true) fail(`${domain}/${evidenceKey} must not approve production.`);
  }
  const productionRecord = domainRecords.find((item) => item.evidenceKey === 'production_promotion_approval');
  if (!productionRecord) fail(`Missing ${domain} production approval record.`);
  if (productionRecord.completionStatus !== 'blocked' || productionRecord.submissionStatus !== 'blocked') fail(`${domain} production approval record must remain blocked.`);
  if (productionRecord.acceptedForStaging === true || productionRecord.productionApproved === true || productionRecord.canApproveProduction === true) fail(`${domain} production approval must not be accepted/approved.`);
}

if (fs.existsSync(stagingReportPath)) {
  const stagingReport = JSON.parse(fs.readFileSync(stagingReportPath, 'utf8'));
  if (stagingReport.canPushNoorCdnStaging !== true || stagingReport.domainsReadyForStaging !== 3) {
    fail('Staging CDN pack report is stale. Run pnpm ilm:staging-cdn-pack after Sprint 27.6 acceptance.');
  }
  if (stagingReport.canPushNoorCdnMain !== false || stagingReport.canPromoteToProduction !== false) {
    fail('Staging CDN pack must not allow main or production promotion.');
  }
}

console.log('NOOR Sprint 27.6 required evidence reviewer acceptance check passed.');
console.log('Required evidence reviewed: 12');
console.log('Accepted for staging: 15');
console.log('Domains ready for staging: 3/3');
console.log('Can push noor-cdn staging branch: true');
console.log('Status: blocked, productionApproved: false, canPromoteToProduction: false.');
