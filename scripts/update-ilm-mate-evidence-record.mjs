import {
  recordsPath,
  USER_EDITABLE_STATUSES,
  REVIEWER_DECISIONS,
  readJson,
  parseArgs,
  todayIsoDate,
  syncOutputs,
  validateRecords
} from './ilm-mate-evidence-record-utils.mjs';

function fail(message) {
  console.error(message);
  process.exit(1);
}
function splitList(value) {
  if (!value) return [];
  if (Array.isArray(value)) return value;
  return String(value).split(',').map((item) => item.trim()).filter(Boolean);
}
function findRecord(records, args) {
  if (args.id) return records.find((record) => record.id === args.id);
  if (args.domain && args.evidence_key) {
    return records.find((record) => record.domain === args.domain && record.evidenceKey === args.evidence_key);
  }
  return undefined;
}
function decisionForStatus(status, explicitDecision) {
  if (explicitDecision) {
    if (!REVIEWER_DECISIONS.includes(explicitDecision)) fail(`Invalid --decision "${explicitDecision}". Allowed: ${REVIEWER_DECISIONS.join(', ')}`);
    return explicitDecision;
  }
  if (status === 'accepted-for-staging') return 'accepted-for-staging';
  if (status === 'needs-more-information') return 'needs-more-information';
  if (status === 'rejected') return 'rejected';
  return 'pending';
}

const args = parseArgs();
const status = args.status || args.completion_status;
if (!status) fail('Missing --status. Example: --status=submitted');
if (!USER_EDITABLE_STATUSES.includes(status)) fail(`Invalid --status "${status}". Allowed: ${USER_EDITABLE_STATUSES.join(', ')}`);

const records = readJson(recordsPath);
const record = findRecord(records, args);
if (!record) {
  fail('Record not found. Use --id=<record-id> or --domain=<quran|tafseer|hadith> --evidence-key=<key>. Run pnpm ilm:evidence:list first.');
}
if (record.evidenceKey === 'production_promotion_approval' || record.lockedByGate === true) {
  fail(`Refusing to update locked production promotion record: ${record.id}. Production approval remains blocked in Sprint 27.1.`);
}

const previous = {
  completionStatus: record.completionStatus,
  reviewerDecision: record.reviewerDecision,
  acceptedForStaging: record.acceptedForStaging
};

record.completionStatus = status;
record.submissionStatus = status;
record.reviewerDecision = decisionForStatus(status, args.decision);
record.acceptedForStaging = status === 'accepted-for-staging';
record.productionApproved = false;
record.canApproveProduction = false;
record.lastUpdatedAt = new Date().toISOString();

if (args.reviewer_name) record.reviewerName = args.reviewer_name;
if (args.reviewer_role) record.reviewerRole = args.reviewer_role;
if (args.reviewer_organisation) record.reviewerOrganisation = args.reviewer_organisation;
if (args.evidence_reference) record.evidenceReference = args.evidence_reference;
if (args.source_url_or_document) record.sourceUrlOrDocument = args.source_url_or_document;
if (args.notes) record.reviewerNotes = args.notes;
if (args.reviewer_notes) record.reviewerNotes = args.reviewer_notes;
if (args.rejection_reason) record.rejectionReason = args.rejection_reason;
if (args.evidence_file || args.evidence_files) {
  const files = splitList(args.evidence_file || args.evidence_files);
  record.evidenceFiles = Array.from(new Set([...(Array.isArray(record.evidenceFiles) ? record.evidenceFiles : []), ...files]));
}

if (['submitted', 'under-review', 'accepted-for-staging'].includes(status) && !record.dateSubmitted) {
  record.dateSubmitted = args.date_submitted || todayIsoDate();
}
if (args.date_submitted) record.dateSubmitted = args.date_submitted;
if (['accepted-for-staging', 'needs-more-information', 'rejected'].includes(status)) {
  record.dateReviewed = args.date_reviewed || record.dateReviewed || todayIsoDate();
}
if (args.date_reviewed) record.dateReviewed = args.date_reviewed;

if (status === 'accepted-for-staging') {
  const hasEvidence = record.evidenceReference || record.sourceUrlOrDocument || (Array.isArray(record.evidenceFiles) && record.evidenceFiles.length > 0);
  if (!record.reviewerName) fail('Accepted-for-staging requires --reviewer-name.');
  if (!hasEvidence) fail('Accepted-for-staging requires --evidence-reference, --source-url-or-document, or --evidence-file.');
}

validateRecords(records);
syncOutputs(records);

console.log('NOOR Sprint 27.1 evidence record updated.');
console.log(`Record: ${record.id}`);
console.log(`Previous: ${previous.completionStatus} / ${previous.reviewerDecision} / accepted=${previous.acceptedForStaging}`);
console.log(`Current: ${record.completionStatus} / ${record.reviewerDecision} / accepted=${record.acceptedForStaging}`);
console.log('Production approved: false');
console.log('Can promote to production: false');
console.log('Run pnpm check:ilm-evidence-records && pnpm check:ilm-evidence-helper next.');
