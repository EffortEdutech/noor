import fs from 'node:fs';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import {
  outputRoot,
  recordsPath,
  readJson,
  writeJson,
  writeText,
  todayIsoDate,
  summarize,
  syncOutputs,
  validateRecords
} from './ilm-mate-evidence-record-utils.mjs';

const root = process.cwd();
const VERSION = '0.27.6';
const acceptanceRoot = path.join(outputRoot, 'required-evidence-acceptance');
const reportPath = path.join(acceptanceRoot, 'required-evidence-acceptance-report.json');
const reportMdPath = path.join(acceptanceRoot, 'required-evidence-acceptance-report.md');
const updatesCsvPath = path.join(acceptanceRoot, 'required-evidence-acceptance-updates.csv');
const domainCsvPath = path.join(acceptanceRoot, 'domain-staging-readiness.csv');
const nextStepPath = path.join(acceptanceRoot, 'future-staging-cdn-next-step.md');

const NON_PRODUCTION_REQUIRED = [
  'source_identity',
  'license_or_permission',
  'attribution_wording',
  'checksum_integrity_plan',
  'scholarly_reviewer_signoff'
];

const REQUIRED_EVIDENCE_TARGETS = ['quran', 'tafseer', 'hadith'].flatMap((domain) => [
  'license_or_permission',
  'attribution_wording',
  'checksum_integrity_plan',
  'scholarly_reviewer_signoff'
].map((evidenceKey) => ({
  id: `ilm-mate-v1-${domain}-${evidenceKey}-evidence-record`,
  domain,
  evidenceKey,
  decisionReference: `NOOR-S27.6-ACCEPT-${domain.toUpperCase()}-${evidenceKey.replaceAll('_', '-').toUpperCase()}`
})));

const reviewer = {
  name: 'NOOR Sprint 27.6 Required Evidence Acceptance',
  role: 'Content governance reviewer',
  organisation: 'Effort Edutech / NOOR'
};

function csvEscape(value) {
  const text = value === undefined || value === null ? '' : String(value);
  return `"${text.replaceAll('"', '""')}"`;
}

function toCsv(rows, headers) {
  const lines = [headers.map(csvEscape).join(',')];
  for (const row of rows) lines.push(headers.map((header) => csvEscape(row[header])).join(','));
  return `${lines.join('\n')}\n`;
}

function labelForDomain(domain) {
  if (domain === 'quran') return 'Quran';
  if (domain === 'tafseer') return 'Tafseer';
  if (domain === 'hadith') return 'Hadith';
  return domain;
}

function domainRows(records) {
  return ['quran', 'tafseer', 'hadith'].map((domain) => {
    const domainRecords = records.filter((record) => record.domain === domain);
    const nonProductionRecords = domainRecords.filter((record) => NON_PRODUCTION_REQUIRED.includes(record.evidenceKey));
    const acceptedEvidenceKeys = nonProductionRecords
      .filter((record) => record.acceptedForStaging === true)
      .map((record) => record.evidenceKey);
    const missingEvidenceKeys = NON_PRODUCTION_REQUIRED.filter((key) => !acceptedEvidenceKeys.includes(key));
    return {
      domain,
      domainLabel: labelForDomain(domain),
      nonProductionRequired: NON_PRODUCTION_REQUIRED.length,
      acceptedForStaging: acceptedEvidenceKeys.length,
      missingForStaging: missingEvidenceKeys.length,
      acceptedEvidenceKeys: acceptedEvidenceKeys.join(';'),
      missingEvidenceKeys: missingEvidenceKeys.join(';'),
      stagingReady: missingEvidenceKeys.length === 0,
      productionApproved: false,
      canPromoteToProduction: false
    };
  });
}

function writeMarkdown(report) {
  const domainLines = report.domains.map((domain) => [
    `### ${domain.domainLabel}`,
    '',
    `- Accepted non-production evidence: **${domain.acceptedForStaging}/${domain.nonProductionRequired}**`,
    `- Staging ready: **${domain.stagingReady}**`,
    `- Missing for staging: ${domain.missingEvidenceKeys || 'none'}`,
    `- Production approved: **false**`,
    ''
  ].join('\n')).join('\n');

  return `# NOOR Sprint 27.6 — Required Evidence Reviewer Acceptance\n\n` +
    `Generated: ${report.generatedAt}\n\n` +
    `## Result\n\n` +
    `- Required evidence reviewed: **${report.requiredEvidenceReviewed}**\n` +
    `- Newly accepted for staging: **${report.newlyAcceptedForStaging}**\n` +
    `- Total accepted for staging: **${report.acceptedForStaging}**\n` +
    `- Domains ready for staging: **${report.domainsReadyForStaging}/3**\n` +
    `- Can push noor-cdn staging branch: **${report.canPushNoorCdnStaging}**\n` +
    `- Can push noor-cdn main: **false**\n` +
    `- Production approved: **false**\n` +
    `- Can promote to production: **false**\n\n` +
    `## Domain readiness\n\n${domainLines}\n` +
    `## Policy\n\n${report.policy}\n`;
}

function writeNextStep(report) {
  return `# NOOR Sprint 27.6 — Future noor-cdn staging branch step\n\n` +
    `Sprint 27.6 allows the **future staging branch candidate workflow** only after this report and the staging CDN pack both pass.\n\n` +
    `## Current gate\n\n` +
    `- Can push noor-cdn staging branch: ${report.canPushNoorCdnStaging}\n` +
    `- Can push noor-cdn main: false\n` +
    `- Production approved: false\n\n` +
    `## Next safe sprint\n\n` +
    `Sprint 27.7 should generate a staging CDN candidate package and guide copying it into a **staging branch** of the separate \`noor-cdn\` repository.\n\n` +
    `Do not push \`noor-cdn/main\` yet. Production promotion remains blocked until production approval records are explicitly unlocked in a later sprint.\n`;
}

if (!fs.existsSync(recordsPath)) {
  throw new Error(`Evidence records missing: ${path.relative(root, recordsPath)}. Run pnpm ilm:evidence-records first.`);
}

const records = readJson(recordsPath);
const byId = new Map(records.map((record) => [record.id, record]));
const now = new Date().toISOString();
const dateReviewed = todayIsoDate();
const updates = [];

for (const target of REQUIRED_EVIDENCE_TARGETS) {
  const record = byId.get(target.id);
  if (!record) throw new Error(`Required evidence record missing: ${target.id}`);
  if (record.evidenceKey === 'production_promotion_approval' || record.lockedByGate === true) {
    throw new Error(`Cannot accept locked production record: ${target.id}`);
  }
  const beforeStatus = record.completionStatus;
  const beforeDecision = record.reviewerDecision;
  const beforeAccepted = record.acceptedForStaging === true;

  if (!['submitted', 'under-review', 'accepted-for-staging'].includes(record.completionStatus)) {
    throw new Error(`Record must be submitted or under review before acceptance: ${record.id} (${record.completionStatus})`);
  }
  if (!record.evidenceReference && !record.sourceUrlOrDocument && !(Array.isArray(record.evidenceFiles) && record.evidenceFiles.length > 0)) {
    throw new Error(`Evidence record needs reference/source/file before acceptance: ${record.id}`);
  }

  record.completionStatus = 'accepted-for-staging';
  record.submissionStatus = 'accepted-for-staging';
  record.reviewerDecision = 'accepted-for-staging';
  record.reviewerName = reviewer.name;
  record.reviewerRole = reviewer.role;
  record.reviewerOrganisation = reviewer.organisation;
  record.dateReviewed = dateReviewed;
  record.acceptedForStaging = true;
  record.productionApproved = false;
  record.canApproveProduction = false;
  record.lockedByGate = false;
  record.lastUpdatedAt = now;
  record.reviewerNotes = [
    record.reviewerNotes,
    `Sprint 27.6 reviewer acceptance accepted this required evidence for staging candidate review only. Decision reference: ${target.decisionReference}. This is not production approval.`
  ].filter(Boolean).join('\n\n');
  record.requiredEvidenceAcceptanceId = `sprint-27-6-${target.domain}-${target.evidenceKey.replaceAll('_', '-')}`;
  record.requiredEvidenceAcceptanceStatus = 'accepted-for-staging-only';
  record.requiredEvidenceAcceptanceReference = target.decisionReference;

  updates.push({
    recordId: record.id,
    domain: record.domain,
    evidenceKey: record.evidenceKey,
    beforeStatus,
    afterStatus: record.completionStatus,
    beforeDecision,
    afterDecision: record.reviewerDecision,
    beforeAccepted,
    afterAccepted: record.acceptedForStaging,
    reviewerName: record.reviewerName,
    dateReviewed: record.dateReviewed,
    productionApproved: false,
    decisionReference: target.decisionReference
  });
}

validateRecords(records);
syncOutputs(records);
const summary = summarize(records);
const domains = domainRows(records);
const domainsReadyForStaging = domains.filter((domain) => domain.stagingReady).length;
const canPushNoorCdnStaging = domainsReadyForStaging === 3;

const report = {
  sprint: '27.6',
  version: VERSION,
  label: 'ilm-mate required evidence reviewer acceptance',
  generatedAt: now,
  sourceRecordsPath: path.relative(root, recordsPath).replaceAll('\\', '/'),
  outputRoot: path.relative(root, acceptanceRoot).replaceAll('\\', '/'),
  reviewer,
  requiredEvidenceReviewed: updates.length,
  newlyAcceptedForStaging: updates.filter((update) => update.beforeAccepted === false && update.afterAccepted === true).length,
  acceptedForStaging: summary.acceptedForStaging,
  domainsReadyForStaging,
  totalDomains: 3,
  canPushNoorCdnStaging,
  canPushNoorCdnMain: false,
  status: 'blocked',
  productionApproved: false,
  canPromoteToProduction: false,
  blockedProductionApprovalRecords: records.filter((record) => record.evidenceKey === 'production_promotion_approval' && record.completionStatus === 'blocked').length,
  policy: 'Sprint 27.6 accepts the remaining non-production evidence records for staging candidate review only. It may unlock a future noor-cdn staging branch workflow, but noor-cdn/main and production CDN promotion remain blocked.',
  updates,
  domains,
  commands: [
    'pnpm ilm:required-evidence-acceptance',
    'pnpm check:ilm-required-evidence-acceptance',
    'pnpm ilm:staging-cdn-pack',
    'pnpm check:ilm-staging-cdn-pack'
  ]
};

fs.mkdirSync(acceptanceRoot, { recursive: true });
writeJson(reportPath, report);
writeText(reportMdPath, writeMarkdown(report));
writeText(updatesCsvPath, toCsv(updates, ['recordId', 'domain', 'evidenceKey', 'beforeStatus', 'afterStatus', 'beforeDecision', 'afterDecision', 'beforeAccepted', 'afterAccepted', 'reviewerName', 'dateReviewed', 'productionApproved', 'decisionReference']));
writeText(domainCsvPath, toCsv(domains, ['domain', 'domainLabel', 'nonProductionRequired', 'acceptedForStaging', 'missingForStaging', 'acceptedEvidenceKeys', 'missingEvidenceKeys', 'stagingReady', 'productionApproved', 'canPromoteToProduction']));
writeText(nextStepPath, writeNextStep(report));

const stagingPackScript = path.join(root, 'scripts', 'generate-ilm-mate-staging-cdn-pack.mjs');
if (fs.existsSync(stagingPackScript)) {
  const result = spawnSync(process.execPath, [stagingPackScript], { cwd: root, stdio: 'inherit' });
  if (result.status !== 0) {
    throw new Error('Sprint 27.6 acceptance succeeded, but staging CDN pack regeneration failed. Run pnpm ilm:staging-cdn-pack manually after checking the error above.');
  }
}

console.log('NOOR Sprint 27.6 required evidence reviewer acceptance complete.');
console.log(`Required evidence reviewed: ${updates.length}`);
console.log(`Accepted for staging: ${summary.acceptedForStaging}`);
console.log(`Domains ready for staging: ${domainsReadyForStaging}/3`);
console.log(`Can push noor-cdn staging branch: ${canPushNoorCdnStaging}`);
console.log('Status: blocked, productionApproved: false, canPromoteToProduction: false.');
console.log(`Report: ${path.relative(root, reportMdPath)}`);
