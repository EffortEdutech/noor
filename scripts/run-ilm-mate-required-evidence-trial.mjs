import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const recordsRoot = path.join(root, 'content-pipeline', 'review', 'ilm-mate-v1', 'evidence-records');
const recordsPath = path.join(recordsRoot, 'evidence-completion-records.json');
const outputRoot = path.join(root, 'content-pipeline', 'review', 'ilm-mate-v1', 'required-evidence-trial');

const domains = [
  { key: 'quran', label: 'Quran', sourceFolder: 'quran' },
  { key: 'tafseer', label: 'Tafseer', sourceFolder: 'tafsir' },
  { key: 'hadith', label: 'Hadith', sourceFolder: 'hadith' }
];

const requiredEvidenceKeys = [
  'source_identity',
  'license_or_permission',
  'attribution_wording',
  'checksum_integrity_plan',
  'scholarly_reviewer_signoff'
];

const targetEvidenceKeys = [
  'license_or_permission',
  'attribution_wording',
  'checksum_integrity_plan',
  'scholarly_reviewer_signoff'
];

const evidenceLabels = {
  license_or_permission: 'License or written redistribution permission',
  attribution_wording: 'Attribution wording',
  checksum_integrity_plan: 'Checksum / integrity plan',
  scholarly_reviewer_signoff: 'Scholarly reviewer sign-off'
};

function fail(message) {
  console.error(message);
  process.exit(1);
}

function ensureDir(dir) {
  fs.mkdirSync(dir, { recursive: true });
}

function readJson(filePath) {
  if (!fs.existsSync(filePath)) fail(`Missing required file: ${path.relative(root, filePath)}`);
  return JSON.parse(fs.readFileSync(filePath, 'utf8'));
}

function writeJson(filePath, data) {
  ensureDir(path.dirname(filePath));
  fs.writeFileSync(filePath, `${JSON.stringify(data, null, 2)}\n`, 'utf8');
}

function csvEscape(value) {
  const text = String(value ?? '');
  if (/[",\n\r]/.test(text)) return `"${text.replaceAll('"', '""')}"`;
  return text;
}

function writeCsv(filePath, rows, headers) {
  const lines = [headers.join(',')];
  for (const row of rows) {
    lines.push(headers.map((header) => csvEscape(row[header])).join(','));
  }
  fs.writeFileSync(filePath, `${lines.join('\n')}\n`, 'utf8');
}

function findRecord(records, domain, evidenceKey) {
  return records.find((record) => record.domain === domain && record.evidenceKey === evidenceKey);
}

function countBy(records, predicate) {
  return records.filter(predicate).length;
}

function getDomainSummary(records, domain) {
  const nonProductionRecords = records.filter(
    (record) => record.domain === domain.key && requiredEvidenceKeys.includes(record.evidenceKey)
  );
  const acceptedForStaging = countBy(nonProductionRecords, (record) => record.acceptedForStaging === true);
  const submittedOrAccepted = countBy(nonProductionRecords, (record) =>
    ['submitted', 'under-review', 'accepted-for-staging'].includes(record.completionStatus)
  );
  const submittedNotAccepted = countBy(nonProductionRecords, (record) =>
    ['submitted', 'under-review'].includes(record.completionStatus) && record.acceptedForStaging !== true
  );

  return {
    domain: domain.key,
    domainLabel: domain.label,
    nonProductionRequired: requiredEvidenceKeys.length,
    submittedOrAccepted,
    submittedNotAccepted,
    acceptedForStaging,
    readyForReviewerDecision: submittedOrAccepted === requiredEvidenceKeys.length,
    stagingReady: acceptedForStaging === requiredEvidenceKeys.length,
    productionApproved: false,
    canPromoteToProduction: false,
    targetSubmittedEvidenceKeys: targetEvidenceKeys.filter((evidenceKey) => {
      const record = findRecord(records, domain.key, evidenceKey);
      return record && record.completionStatus === 'submitted';
    }),
    acceptedEvidenceKeys: requiredEvidenceKeys.filter((evidenceKey) => {
      const record = findRecord(records, domain.key, evidenceKey);
      return record && record.acceptedForStaging === true;
    }),
    pendingReviewerDecisionKeys: requiredEvidenceKeys.filter((evidenceKey) => {
      const record = findRecord(records, domain.key, evidenceKey);
      return record && record.completionStatus === 'submitted' && record.reviewerDecision === 'pending';
    })
  };
}

const records = readJson(recordsPath);
if (!Array.isArray(records)) fail('Evidence records file must contain an array.');
if (records.length !== 18) fail(`Expected 18 evidence records, found ${records.length}.`);

const now = new Date().toISOString();
const dateSubmitted = now.slice(0, 10);
const updated = [];

for (const domain of domains) {
  for (const evidenceKey of targetEvidenceKeys) {
    const record = findRecord(records, domain.key, evidenceKey);
    if (!record) fail(`Missing evidence record for ${domain.key}/${evidenceKey}.`);
    if (record.lockedByGate === true) fail(`Record should not be locked for ${domain.key}/${evidenceKey}.`);

    const reference = `NOOR-S27.5-TRIAL-${domain.key.toUpperCase()}-${evidenceKey.toUpperCase().replaceAll('_', '-')}`;

    record.currentEvidenceStatus = 'submitted';
    record.completionStatus = 'submitted';
    record.submissionStatus = 'submitted';
    record.reviewerDecision = 'pending';
    record.reviewerName = '';
    record.reviewerRole = '';
    record.reviewerOrganisation = '';
    record.evidenceReference = reference;
    record.sourceUrlOrDocument = `trial://noor/sprint-27.5/${domain.key}/${evidenceKey}`;
    record.evidenceFiles = [];
    record.dateSubmitted = dateSubmitted;
    record.dateReviewed = '';
    record.reviewerNotes = [
      'Sprint 27.5 required evidence submission trial.',
      'This is a workflow/sample submission only. It is not legal approval, scholarly approval, staging approval, or production approval.',
      'A future reviewer-decision sprint must independently review and accept this evidence before any staging CDN pack may be pushed.'
    ].join(' ');
    record.rejectionReason = '';
    record.acceptedForStaging = false;
    record.productionApproved = false;
    record.canApproveProduction = false;
    record.lockedByGate = false;
    record.lastUpdatedAt = now;
    record.requiredEvidenceTrialId = `sprint-27-5-${domain.key}-${evidenceKey.replaceAll('_', '-')}`;
    record.requiredEvidenceTrialStatus = 'submitted-only';
    record.requiredEvidenceTrialReference = reference;

    updated.push({
      domain: domain.key,
      domainLabel: domain.label,
      evidenceKey,
      evidenceLabel: evidenceLabels[evidenceKey],
      recordId: record.id,
      completionStatus: record.completionStatus,
      reviewerDecision: record.reviewerDecision,
      acceptedForStaging: record.acceptedForStaging,
      evidenceReference: record.evidenceReference
    });
  }
}

for (const domain of domains) {
  const productionRecord = findRecord(records, domain.key, 'production_promotion_approval');
  if (!productionRecord) fail(`Missing production approval record for ${domain.key}.`);
  productionRecord.currentEvidenceStatus = 'blocked';
  productionRecord.completionStatus = 'blocked';
  productionRecord.submissionStatus = 'blocked';
  productionRecord.acceptedForStaging = false;
  productionRecord.productionApproved = false;
  productionRecord.canApproveProduction = false;
  productionRecord.lockedByGate = true;
}

writeJson(recordsPath, records);

const domainsSummary = domains.map((domain) => getDomainSummary(records, domain));
const readyForReviewerDecision = countBy(domainsSummary, (domain) => domain.readyForReviewerDecision);
const domainsReadyForStaging = countBy(domainsSummary, (domain) => domain.stagingReady);
const acceptedForStaging = countBy(records, (record) => record.acceptedForStaging === true);
const productionRecords = records.filter((record) => record.evidenceKey === 'production_promotion_approval');

const report = {
  sprint: '27.5',
  version: '0.27.5',
  label: 'ilm-mate required evidence submission trial',
  generatedAt: now,
  source: {
    evidenceRecordsRoot: path.relative(root, recordsRoot).replaceAll(path.sep, '/'),
    evidenceRecordsPath: path.relative(root, recordsPath).replaceAll(path.sep, '/')
  },
  outputRoot: path.relative(root, outputRoot).replaceAll(path.sep, '/'),
  status: 'blocked',
  productionApproved: false,
  canPromoteToProduction: false,
  canPushNoorCdnStaging: false,
  canPushNoorCdnMain: false,
  totalEvidenceRecords: records.length,
  trialSubmittedRecords: updated.length,
  acceptedForStaging,
  domainsReadyForReviewerDecision: readyForReviewerDecision,
  domainsReadyForStaging,
  totalDomains: domains.length,
  productionApprovalRecordsBlocked: productionRecords.filter((record) => record.completionStatus === 'blocked' && record.lockedByGate === true).length,
  domains: domainsSummary,
  submittedRecords: updated,
  nextSprintRecommendation: {
    sprint: '27.6',
    label: 'reviewer acceptance for required staging evidence',
    action: 'Review the 12 submitted records and decide whether to accept them for staging. Only then can all 3 domains become staging-ready.'
  },
  guardrails: [
    'Sprint 27.5 only submits required evidence records for review.',
    'Submitted evidence is not accepted for staging.',
    'Production approval records remain blocked.',
    'noor-cdn/staging branch must not be pushed in Sprint 27.5.',
    'noor-cdn/main must not be pushed in Sprint 27.5.'
  ],
  commands: [
    'pnpm ilm:required-evidence-trial',
    'pnpm check:ilm-required-evidence-trial',
    'pnpm ilm:evidence:list -- --status=submitted'
  ]
};

ensureDir(outputRoot);
writeJson(path.join(outputRoot, 'required-evidence-trial-report.json'), report);
writeCsv(path.join(outputRoot, 'required-evidence-trial-submissions.csv'), updated, [
  'domain',
  'domainLabel',
  'evidenceKey',
  'evidenceLabel',
  'recordId',
  'completionStatus',
  'reviewerDecision',
  'acceptedForStaging',
  'evidenceReference'
]);
writeCsv(path.join(outputRoot, 'required-evidence-domain-status.csv'), domainsSummary, [
  'domain',
  'domainLabel',
  'nonProductionRequired',
  'submittedOrAccepted',
  'submittedNotAccepted',
  'acceptedForStaging',
  'readyForReviewerDecision',
  'stagingReady',
  'productionApproved',
  'canPromoteToProduction'
]);

const md = `# NOOR Sprint 27.5 — Required Evidence Submission Trial

Generated: ${now}

## Status

- Status: **${report.status}**
- Trial submitted records: **${report.trialSubmittedRecords}**
- Domains ready for reviewer decision: **${report.domainsReadyForReviewerDecision}/${report.totalDomains}**
- Domains ready for staging: **${report.domainsReadyForStaging}/${report.totalDomains}**
- Accepted for staging: **${report.acceptedForStaging}**
- Production approved: **${report.productionApproved}**
- Can promote to production: **${report.canPromoteToProduction}**
- Can push noor-cdn staging branch: **${report.canPushNoorCdnStaging}**
- Can push noor-cdn/main: **${report.canPushNoorCdnMain}**

## Submitted trial records

| Domain | Evidence | Status | Reviewer decision | Accepted for staging |
|---|---|---:|---:|---:|
${updated.map((record) => `| ${record.domainLabel} | ${record.evidenceLabel} | ${record.completionStatus} | ${record.reviewerDecision} | ${record.acceptedForStaging} |`).join('\n')}

## Domain status

| Domain | Submitted or accepted | Accepted for staging | Ready for reviewer decision | Staging ready |
|---|---:|---:|---:|---:|
${domainsSummary.map((domain) => `| ${domain.domainLabel} | ${domain.submittedOrAccepted}/${domain.nonProductionRequired} | ${domain.acceptedForStaging}/${domain.nonProductionRequired} | ${domain.readyForReviewerDecision} | ${domain.stagingReady} |`).join('\n')}

## Guardrails

${report.guardrails.map((item) => `- ${item}`).join('\n')}

## Next sprint

Sprint 27.6 should review these 12 submitted records and decide whether they can be accepted for staging.
`;

fs.writeFileSync(path.join(outputRoot, 'required-evidence-trial-report.md'), md, 'utf8');

console.log('NOOR Sprint 27.5 ilm-mate required evidence submission trial complete.');
console.log(`Trial submitted records: ${report.trialSubmittedRecords}`);
console.log(`Domains ready for reviewer decision: ${report.domainsReadyForReviewerDecision}/${report.totalDomains}`);
console.log(`Domains ready for staging: ${report.domainsReadyForStaging}/${report.totalDomains}`);
console.log('Status: blocked, productionApproved: false, canPromoteToProduction: false.');
