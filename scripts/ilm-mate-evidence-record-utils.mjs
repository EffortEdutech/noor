import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const outputRoot = path.join(root, 'content-pipeline', 'review', 'ilm-mate-v1', 'evidence-records');
const recordsPath = path.join(outputRoot, 'evidence-completion-records.json');
const workflowPath = path.join(outputRoot, 'evidence-completion-workflow.json');
const updateHelperRoot = path.join(outputRoot, 'update-helper');
const VERSION = '0.27.1';

const COMPLETION_STATUSES = ['draft', 'not-submitted', 'submitted', 'under-review', 'accepted-for-staging', 'needs-more-information', 'rejected', 'blocked'];
const USER_EDITABLE_STATUSES = ['draft', 'not-submitted', 'submitted', 'under-review', 'accepted-for-staging', 'needs-more-information', 'rejected'];
const REVIEWER_DECISIONS = ['pending', 'accepted-for-staging', 'needs-more-information', 'rejected'];

function readJson(filePath) {
  if (!fs.existsSync(filePath)) {
    throw new Error(`Required file missing: ${path.relative(root, filePath)}. Run pnpm ilm:evidence-records first.`);
  }
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
function parseArgs(argv = process.argv.slice(2)) {
  const args = {};
  for (let index = 0; index < argv.length; index += 1) {
    const token = argv[index];
    if (!token.startsWith('--')) continue;
    const raw = token.slice(2);
    const [key, inlineValue] = raw.split(/=(.*)/s).filter((part) => part !== undefined);
    const normalisedKey = key.replaceAll('-', '_');
    if (inlineValue !== undefined) {
      args[normalisedKey] = inlineValue;
    } else {
      const next = argv[index + 1];
      if (next && !next.startsWith('--')) {
        args[normalisedKey] = next;
        index += 1;
      } else {
        args[normalisedKey] = true;
      }
    }
  }
  return args;
}
function domainLabel(domain) {
  if (domain === 'quran') return 'Quran';
  if (domain === 'tafseer') return 'Tafseer';
  if (domain === 'hadith') return 'Hadith';
  return String(domain);
}
function todayIsoDate() {
  return new Date().toISOString().slice(0, 10);
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
function syncOutputs(records) {
  const workflow = readJson(workflowPath);
  const summary = summarize(records);
  workflow.generatedAt = new Date().toISOString();
  workflow.summary = summary;
  workflow.policy = workflow.policy || {};
  workflow.policy.status = 'blocked';
  workflow.policy.productionApproved = false;
  workflow.policy.canPromoteToProduction = false;
  workflow.lastUpdatedBy = 'Sprint 27.1 evidence update helper';
  workflow.lastUpdatedAt = workflow.generatedAt;
  writeJson(recordsPath, records);
  writeJson(workflowPath, workflow);

  const registerHeaders = ['id', 'formId', 'domain', 'evidenceKey', 'evidenceLabel', 'completionStatus', 'submissionStatus', 'reviewerDecision', 'reviewerName', 'reviewerRole', 'reviewerOrganisation', 'evidenceReference', 'sourceUrlOrDocument', 'dateSubmitted', 'dateReviewed', 'acceptedForStaging', 'productionApproved', 'canApproveProduction', 'lockedByGate', 'reviewerNotes', 'rejectionReason'];
  writeText(path.join(outputRoot, 'evidence-completion-register.csv'), toCsv(records, registerHeaders));

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

  const md = `# NOOR Sprint 27 — ilm-mate Evidence Completion Workflow\n\n` +
    `Updated: ${workflow.lastUpdatedAt}\n\n` +
    `## Gate status\n\n` +
    `- Status: **blocked**\n` +
    `- Production approved: **false**\n` +
    `- Can promote to production: **false**\n` +
    `- Evidence records: **${summary.totalRecords}**\n` +
    `- Accepted for staging: **${summary.acceptedForStaging}**\n` +
    `- Domains ready for staging: **${summary.domainsReadyForStaging}/3**\n\n` +
    `## Domain completion\n\n` +
    summary.domains.map((domain) => `- **${domain.domainLabel}** — ${domain.nonProductionAccepted}/${domain.nonProductionRequired} non-production evidence items accepted for staging, production approved: false`).join('\n') +
    `\n\n## Policy\n\nAccepted staging evidence does not equal production approval. Production CDN publication remains blocked.\n`;
  writeText(path.join(outputRoot, 'evidence-completion-workflow.md'), md);
}
function validateRecords(records) {
  if (!Array.isArray(records) || records.length !== 18) throw new Error(`Expected 18 evidence records, got ${Array.isArray(records) ? records.length : 'non-array'}.`);
  for (const record of records) {
    if (!record.id || !record.domain || !record.evidenceKey) throw new Error(`Record has missing identity fields: ${JSON.stringify(record)}`);
    if (!COMPLETION_STATUSES.includes(record.completionStatus)) throw new Error(`Invalid completionStatus "${record.completionStatus}" in ${record.id}.`);
    if (!COMPLETION_STATUSES.includes(record.submissionStatus)) throw new Error(`Invalid submissionStatus "${record.submissionStatus}" in ${record.id}.`);
    if (!REVIEWER_DECISIONS.includes(record.reviewerDecision)) throw new Error(`Invalid reviewerDecision "${record.reviewerDecision}" in ${record.id}.`);
    if (record.productionApproved === true || record.canApproveProduction === true) throw new Error(`Production approval is forbidden in Sprint 27.1: ${record.id}`);
    if (record.evidenceKey === 'production_promotion_approval') {
      if (record.completionStatus !== 'blocked' || record.submissionStatus !== 'blocked') throw new Error(`Production promotion record must remain blocked: ${record.id}`);
      if (record.acceptedForStaging === true) throw new Error(`Production promotion record must not be accepted for staging: ${record.id}`);
      if (record.lockedByGate !== true) throw new Error(`Production promotion record must be locked by gate: ${record.id}`);
    }
    if (record.acceptedForStaging === true) {
      if (record.reviewerDecision !== 'accepted-for-staging') throw new Error(`acceptedForStaging=true requires reviewerDecision=accepted-for-staging: ${record.id}`);
      const hasEvidence = record.evidenceReference || record.sourceUrlOrDocument || (Array.isArray(record.evidenceFiles) && record.evidenceFiles.length > 0);
      if (!hasEvidence) throw new Error(`Accepted staging evidence needs evidence reference, source document, or evidence file: ${record.id}`);
      if (!record.reviewerName || !record.dateReviewed) throw new Error(`Accepted staging evidence needs reviewerName and dateReviewed: ${record.id}`);
    }
  }
}
function recordSummaryLine(record) {
  return [
    record.id,
    record.domain,
    record.evidenceKey,
    record.completionStatus,
    record.reviewerDecision,
    record.acceptedForStaging ? 'accepted' : 'not-accepted'
  ].join(' | ');
}

export {
  root,
  outputRoot,
  updateHelperRoot,
  recordsPath,
  workflowPath,
  VERSION,
  USER_EDITABLE_STATUSES,
  REVIEWER_DECISIONS,
  readJson,
  writeJson,
  writeText,
  parseArgs,
  todayIsoDate,
  summarize,
  syncOutputs,
  validateRecords,
  recordSummaryLine
};
