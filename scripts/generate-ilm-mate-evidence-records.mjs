import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const intakeRoot = path.join(root, 'content-pipeline', 'review', 'ilm-mate-v1', 'evidence-intake');
const formsPath = path.join(intakeRoot, 'reviewer-submission-forms.json');
const intakePackPath = path.join(intakeRoot, 'evidence-intake-pack.json');
const outputRoot = path.join(root, 'content-pipeline', 'review', 'ilm-mate-v1', 'evidence-records');
const recordsPath = path.join(outputRoot, 'evidence-completion-records.json');
const workflowPath = path.join(outputRoot, 'evidence-completion-workflow.json');
const VERSION = '0.27.0';

const REVIEWER_DECISIONS = ['pending', 'accepted-for-staging', 'needs-more-information', 'rejected'];
const COMPLETION_STATUSES = ['draft', 'not-submitted', 'submitted', 'under-review', 'accepted-for-staging', 'needs-more-information', 'rejected', 'blocked'];

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, 'utf8'));
}
function writeJson(filePath, value) {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, `${JSON.stringify(value, null, 2)}\n`, 'utf8');
}
function writeText(filePath, content) {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, content, 'utf8');
}
function csvEscape(value) {
  const text = value === undefined || value === null ? '' : String(value);
  return `"${text.replaceAll('"', '""')}"`;
}
function toCsv(rows, headers) {
  const lines = [headers.map(csvEscape).join(',')];
  for (const row of rows) lines.push(headers.map((header) => csvEscape(row[header])).join(','));
  return `${lines.join('\n')}\n`;
}
function domainLabel(domain) {
  if (domain === 'quran') return 'Quran';
  if (domain === 'tafseer') return 'Tafseer';
  if (domain === 'hadith') return 'Hadith';
  return String(domain);
}
function oldRecordMap() {
  if (!fs.existsSync(recordsPath)) return new Map();
  const old = readJson(recordsPath);
  return Array.isArray(old) ? new Map(old.map((record) => [record.formId || record.id, record])) : new Map();
}
function valid(value, allowed, fallback) {
  return allowed.includes(value) ? value : fallback;
}
function createRecord(form, existing) {
  const isProductionApproval = form.evidenceKey === 'production_promotion_approval';
  const id = form.id.replace(/-evidence-form$/, '-evidence-record');
  const fallback = isProductionApproval ? 'blocked' : 'not-submitted';
  const old = existing || {};
  const record = {
    id,
    formId: form.id,
    domain: form.domain,
    domainLabel: form.domainLabel || domainLabel(form.domain),
    evidenceKey: form.evidenceKey,
    evidenceLabel: form.evidenceLabel,
    required: true,
    editable: true,
    currentEvidenceStatus: form.currentStatus || 'missing',
    completionStatus: valid(old.completionStatus, COMPLETION_STATUSES, fallback),
    submissionStatus: valid(old.submissionStatus, COMPLETION_STATUSES, fallback),
    reviewerDecision: valid(old.reviewerDecision, REVIEWER_DECISIONS, 'pending'),
    reviewerName: old.reviewerName || form.reviewerName || '',
    reviewerRole: old.reviewerRole || form.reviewerRole || '',
    reviewerOrganisation: old.reviewerOrganisation || '',
    evidenceReference: old.evidenceReference || form.evidenceReference || '',
    sourceUrlOrDocument: old.sourceUrlOrDocument || form.sourceUrlOrDocument || '',
    evidenceFiles: Array.isArray(old.evidenceFiles) ? old.evidenceFiles : [],
    dateSubmitted: old.dateSubmitted || form.dateSubmitted || '',
    dateReviewed: old.dateReviewed || form.dateReviewed || '',
    reviewerNotes: old.reviewerNotes || '',
    rejectionReason: old.rejectionReason || '',
    acceptedForStaging: Boolean(old.acceptedForStaging),
    productionApproved: false,
    canApproveProduction: false,
    lockedByGate: isProductionApproval,
    instructions: form.instructions || '',
    notes: old.notes || form.notes || '',
    allowedCompletionStatuses: isProductionApproval ? ['blocked'] : COMPLETION_STATUSES.filter((status) => status !== 'blocked'),
    allowedReviewerDecisions: REVIEWER_DECISIONS,
    lastUpdatedAt: old.lastUpdatedAt || '',
    recordPolicy: isProductionApproval
      ? 'This production approval record is locked until a future explicit production-promotion sprint.'
      : 'Editable staging evidence record. Accepted staging evidence does not equal production approval.'
  };
  if (isProductionApproval) {
    record.completionStatus = 'blocked';
    record.submissionStatus = 'blocked';
    record.reviewerDecision = 'pending';
    record.acceptedForStaging = false;
  }
  if (record.reviewerDecision === 'accepted-for-staging') {
    record.acceptedForStaging = true;
    record.completionStatus = 'accepted-for-staging';
  }
  return record;
}
function summarize(records) {
  const domains = ['quran', 'tafseer', 'hadith'].map((domain) => {
    const domainRecords = records.filter((record) => record.domain === domain);
    const nonProduction = domainRecords.filter((record) => record.evidenceKey !== 'production_promotion_approval');
    const nonProductionAccepted = nonProduction.filter((record) => record.acceptedForStaging).length;
    const rejected = domainRecords.filter((record) => record.completionStatus === 'rejected').length;
    const needsMoreInformation = domainRecords.filter((record) => record.completionStatus === 'needs-more-information').length;
    return {
      domain,
      domainLabel: domainLabel(domain),
      requiredEvidenceRecords: domainRecords.length,
      nonProductionRequired: nonProduction.length,
      nonProductionAccepted,
      acceptedForStaging: domainRecords.filter((record) => record.acceptedForStaging).length,
      submittedOrUnderReview: domainRecords.filter((record) => ['submitted', 'under-review'].includes(record.completionStatus)).length,
      needsMoreInformation,
      rejected,
      blocked: domainRecords.filter((record) => record.completionStatus === 'blocked').length,
      completionPercent: nonProduction.length === 0 ? 0 : Math.round((nonProductionAccepted / nonProduction.length) * 100),
      stagingReady: nonProductionAccepted === nonProduction.length && rejected === 0 && needsMoreInformation === 0,
      productionApproved: false,
      canPromoteToProduction: false
    };
  });
  return {
    totalRecords: records.length,
    acceptedForStaging: records.filter((record) => record.acceptedForStaging).length,
    blocked: records.filter((record) => record.completionStatus === 'blocked').length,
    missingOrDraft: records.filter((record) => ['draft', 'not-submitted'].includes(record.completionStatus)).length,
    domainsReadyForStaging: domains.filter((domain) => domain.stagingReady).length,
    domains,
    productionApproved: false,
    canPromoteToProduction: false,
    status: 'blocked'
  };
}

if (!fs.existsSync(formsPath)) throw new Error(`Sprint 26.9 reviewer forms not found: ${path.relative(root, formsPath)}. Run pnpm ilm:evidence-intake first.`);
if (!fs.existsSync(intakePackPath)) throw new Error(`Sprint 26.9 evidence intake pack not found: ${path.relative(root, intakePackPath)}. Run pnpm ilm:evidence-intake first.`);

const forms = readJson(formsPath);
const intakePack = readJson(intakePackPath);
if (!Array.isArray(forms) || forms.length === 0) throw new Error('reviewer-submission-forms.json must contain evidence forms.');

const old = oldRecordMap();
fs.mkdirSync(outputRoot, { recursive: true });
const records = forms.map((form) => createRecord(form, old.get(form.id) || old.get(form.id.replace(/-evidence-form$/, '-evidence-record'))));
const summary = summarize(records);

const workflow = {
  id: 'noor-ilm-mate-v1-evidence-completion-workflow',
  version: VERSION,
  label: 'ilm-mate migrated content evidence completion workflow',
  generatedAt: new Date().toISOString(),
  sourceEvidenceIntakePack: 'content-pipeline/review/ilm-mate-v1/evidence-intake/evidence-intake-pack.json',
  outputRoot: 'content-pipeline/review/ilm-mate-v1/evidence-records',
  policy: {
    status: 'blocked',
    productionApproved: false,
    canPromoteToProduction: false,
    rule: 'Sprint 27 creates editable staging evidence records only. It must not approve production and must not publish migrated ilm-mate content to the NOOR CDN repository.'
  },
  editableRecordPolicy: {
    owner: 'NOOR content governance / review team',
    editableFields: ['completionStatus', 'submissionStatus', 'reviewerDecision', 'reviewerName', 'reviewerRole', 'reviewerOrganisation', 'evidenceReference', 'sourceUrlOrDocument', 'evidenceFiles', 'dateSubmitted', 'dateReviewed', 'reviewerNotes', 'rejectionReason', 'acceptedForStaging', 'lastUpdatedAt'],
    lockedFields: ['domain', 'evidenceKey', 'required', 'productionApproved', 'canApproveProduction', 'lockedByGate'],
    allowedReviewerDecisions: REVIEWER_DECISIONS,
    allowedCompletionStatuses: COMPLETION_STATUSES,
    productionApprovalRule: 'production_promotion_approval records remain blocked until a later production-promotion sprint.'
  },
  sourceSummary: intakePack.summary || {},
  summary,
  nextActions: [
    'Open evidence-completion-records.json and fill reviewer/evidence fields as submissions arrive.',
    'Use accepted-for-staging only after source, license, attribution, checksum and scholarly evidence are reviewed.',
    'Keep production_promotion_approval records blocked.',
    'Re-run pnpm check:ilm-evidence-records after editing records.'
  ]
};

writeJson(recordsPath, records);
writeJson(workflowPath, workflow);
const headers = ['id', 'formId', 'domain', 'evidenceKey', 'evidenceLabel', 'completionStatus', 'submissionStatus', 'reviewerDecision', 'reviewerName', 'reviewerRole', 'reviewerOrganisation', 'evidenceReference', 'sourceUrlOrDocument', 'dateSubmitted', 'dateReviewed', 'acceptedForStaging', 'productionApproved', 'canApproveProduction', 'lockedByGate', 'reviewerNotes', 'rejectionReason'];
writeText(path.join(outputRoot, 'evidence-completion-register.csv'), toCsv(records, headers));

const decisions = records.map((record) => ({
  recordId: record.id,
  domain: record.domain,
  evidenceKey: record.evidenceKey,
  reviewerDecision: record.reviewerDecision,
  completionStatus: record.completionStatus,
  reviewerName: record.reviewerName,
  dateReviewed: record.dateReviewed,
  acceptedForStaging: record.acceptedForStaging,
  productionApproved: false,
  decisionNotes: record.reviewerNotes
}));
writeJson(path.join(outputRoot, 'reviewer-decision-register.json'), decisions);
writeText(path.join(outputRoot, 'reviewer-decision-register.csv'), toCsv(decisions, ['recordId', 'domain', 'evidenceKey', 'reviewerDecision', 'completionStatus', 'reviewerName', 'dateReviewed', 'acceptedForStaging', 'productionApproved', 'decisionNotes']));
writeJson(path.join(outputRoot, 'editable-evidence-record-template.json'), {
  note: 'Copy one evidence record, fill only editable fields, then paste it back into evidence-completion-records.json. Do not set productionApproved=true.',
  editableFields: workflow.editableRecordPolicy.editableFields,
  allowedCompletionStatuses: workflow.editableRecordPolicy.allowedCompletionStatuses,
  allowedReviewerDecisions: workflow.editableRecordPolicy.allowedReviewerDecisions,
  sampleRecord: records.find((record) => record.evidenceKey !== 'production_promotion_approval') || records[0]
});

const md = `# NOOR Sprint 27 — ilm-mate Evidence Completion Workflow\n\n` +
  `Generated: ${workflow.generatedAt}\n\n` +
  `## Gate status\n\n` +
  `- Status: **${workflow.policy.status}**\n` +
  `- Production approved: **${workflow.policy.productionApproved}**\n` +
  `- Can promote to production: **${workflow.policy.canPromoteToProduction}**\n` +
  `- Evidence records: **${summary.totalRecords}**\n` +
  `- Accepted for staging: **${summary.acceptedForStaging}**\n` +
  `- Domains ready for staging: **${summary.domainsReadyForStaging}/3**\n\n` +
  `## Domain completion\n\n` +
  summary.domains.map((domain) => `- **${domain.domainLabel}** — ${domain.nonProductionAccepted}/${domain.nonProductionRequired} non-production evidence items accepted for staging, production approved: ${domain.productionApproved}`).join('\n') +
  `\n\n## Editable records\n\nEdit this file carefully when evidence arrives:\n\n` +
  '`content-pipeline/review/ilm-mate-v1/evidence-records/evidence-completion-records.json`\n\n' +
  `Allowed decisions: ${REVIEWER_DECISIONS.map((decision) => `\`${decision}\``).join(', ')}.\n\n` +
  `## Policy\n\n${workflow.policy.rule}\n`;
writeText(path.join(outputRoot, 'evidence-completion-workflow.md'), md);

console.log('NOOR Sprint 27 ilm-mate evidence completion workflow generated.');
console.log(`Output: ${path.relative(root, outputRoot)}`);
console.log(`Evidence records: ${records.length}`);
console.log(`Accepted for staging: ${summary.acceptedForStaging}`);
console.log('Status: blocked, productionApproved: false, canPromoteToProduction: false.');
