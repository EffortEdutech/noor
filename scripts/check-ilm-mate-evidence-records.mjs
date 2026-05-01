import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const outputRoot = path.join(root, 'content-pipeline', 'review', 'ilm-mate-v1', 'evidence-records');
const recordsPath = path.join(outputRoot, 'evidence-completion-records.json');
const workflowPath = path.join(outputRoot, 'evidence-completion-workflow.json');
const intakeFormsPath = path.join(root, 'content-pipeline', 'review', 'ilm-mate-v1', 'evidence-intake', 'reviewer-submission-forms.json');
const VERSION = '0.27.0';

const COMPLETION_STATUSES = new Set(['draft', 'not-submitted', 'submitted', 'under-review', 'accepted-for-staging', 'needs-more-information', 'rejected', 'blocked']);
const REVIEWER_DECISIONS = new Set(['pending', 'accepted-for-staging', 'needs-more-information', 'rejected']);

function fail(message) {
  console.error(message);
  process.exit(1);
}
function readJson(filePath) {
  if (!fs.existsSync(filePath)) fail(`Required file missing: ${path.relative(root, filePath)}`);
  return JSON.parse(fs.readFileSync(filePath, 'utf8'));
}

const workflow = readJson(workflowPath);
const records = readJson(recordsPath);
const forms = readJson(intakeFormsPath);

if (workflow.version !== VERSION) fail(`Expected Sprint 27 workflow version ${VERSION}, got ${workflow.version}`);
if (workflow.policy?.status !== 'blocked') fail('Evidence completion workflow status must remain blocked.');
if (workflow.policy?.productionApproved !== false) fail('Evidence completion workflow must not set productionApproved=true.');
if (workflow.policy?.canPromoteToProduction !== false) fail('Evidence completion workflow must not allow production promotion.');
if (!Array.isArray(records)) fail('evidence-completion-records.json must contain an array.');
if (records.length !== 18) fail(`Expected 18 evidence records, got ${records.length}.`);
if (!Array.isArray(forms) || forms.length !== records.length) fail('Evidence record count must match Sprint 26.9 reviewer forms.');

for (const file of ['evidence-completion-workflow.md', 'evidence-completion-register.csv', 'reviewer-decision-register.json', 'reviewer-decision-register.csv', 'editable-evidence-record-template.json']) {
  const filePath = path.join(outputRoot, file);
  if (!fs.existsSync(filePath)) fail(`Missing Sprint 27 output file: ${path.relative(root, filePath)}`);
}

const domains = new Set(records.map((record) => record.domain));
for (const domain of ['quran', 'tafseer', 'hadith']) {
  if (!domains.has(domain)) fail(`Missing evidence records for domain: ${domain}`);
  const domainRecords = records.filter((record) => record.domain === domain);
  if (domainRecords.length !== 6) fail(`Expected 6 evidence records for ${domain}, got ${domainRecords.length}.`);
}

for (const record of records) {
  if (!record.id || !record.formId || !record.domain || !record.evidenceKey) fail(`Record has missing identity fields: ${JSON.stringify(record)}`);
  if (record.editable !== true) fail(`Record must be editable: ${record.id}`);
  if (!COMPLETION_STATUSES.has(record.completionStatus)) fail(`Invalid completionStatus "${record.completionStatus}" in ${record.id}`);
  if (!COMPLETION_STATUSES.has(record.submissionStatus)) fail(`Invalid submissionStatus "${record.submissionStatus}" in ${record.id}`);
  if (!REVIEWER_DECISIONS.has(record.reviewerDecision)) fail(`Invalid reviewerDecision "${record.reviewerDecision}" in ${record.id}`);
  if (record.productionApproved === true || record.canApproveProduction === true) fail(`Production approval is forbidden in Sprint 27: ${record.id}`);
  if (record.evidenceKey === 'production_promotion_approval') {
    if (record.completionStatus !== 'blocked') fail(`Production approval record must remain blocked: ${record.id}`);
    if (record.submissionStatus !== 'blocked') fail(`Production approval submission must remain blocked: ${record.id}`);
    if (record.acceptedForStaging === true) fail(`Production approval record must not be accepted for staging: ${record.id}`);
    if (record.lockedByGate !== true) fail(`Production approval record must be locked by gate: ${record.id}`);
  }
  if (record.acceptedForStaging === true) {
    if (record.reviewerDecision !== 'accepted-for-staging') fail(`acceptedForStaging=true requires reviewerDecision=accepted-for-staging: ${record.id}`);
    if (!record.evidenceReference && !record.sourceUrlOrDocument && (!Array.isArray(record.evidenceFiles) || record.evidenceFiles.length === 0)) fail(`Accepted staging evidence needs evidence reference, source document, or evidence file: ${record.id}`);
    if (!record.reviewerName || !record.dateReviewed) fail(`Accepted staging evidence needs reviewerName and dateReviewed: ${record.id}`);
  }
}

if (workflow.summary?.productionApproved === true || workflow.summary?.canPromoteToProduction === true) fail('Workflow summary must not allow production approval or promotion.');

console.log('NOOR Sprint 27 ilm-mate evidence completion workflow check passed.');
console.log(`Evidence records root: ${path.relative(root, outputRoot)}`);
console.log(`Evidence records: ${records.length}`);
console.log(`Domains: ${Array.from(domains).join(', ')}`);
console.log('Status: blocked, productionApproved: false, canPromoteToProduction: false.');
