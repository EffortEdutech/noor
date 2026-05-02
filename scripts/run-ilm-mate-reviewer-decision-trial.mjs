import fs from 'node:fs';
import path from 'node:path';
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
const decisionRoot = path.join(outputRoot, 'reviewer-decisions');
const reportPath = path.join(decisionRoot, 'reviewer-decision-trial-report.json');
const reportMdPath = path.join(decisionRoot, 'reviewer-decision-trial-report.md');
const csvPath = path.join(decisionRoot, 'reviewer-decision-trial-updates.csv');
const commandsPath = path.join(decisionRoot, 'sample-reviewer-decision-commands.md');

function csvEscape(value) {
  const text = value === undefined || value === null ? '' : String(value);
  return `"${text.replaceAll('"', '""')}"`;
}
function toCsv(rows, headers) {
  return `${[headers.map(csvEscape).join(','), ...rows.map((row) => headers.map((header) => csvEscape(row[header])).join(','))].join('\n')}\n`;
}

const reviewer = {
  name: 'NOOR Sprint 27.3 Review Trial',
  role: 'Content governance reviewer',
  organisation: 'Effort Edutech / NOOR'
};

const trialTargets = [
  {
    id: 'ilm-mate-v1-quran-source_identity-evidence-record',
    domain: 'quran',
    evidenceKey: 'source_identity',
    decisionReference: 'NOOR-S27.3-REVIEW-QURAN-SOURCE-IDENTITY'
  },
  {
    id: 'ilm-mate-v1-tafseer-source_identity-evidence-record',
    domain: 'tafseer',
    evidenceKey: 'source_identity',
    decisionReference: 'NOOR-S27.3-REVIEW-TAFSEER-SOURCE-IDENTITY'
  },
  {
    id: 'ilm-mate-v1-hadith-source_identity-evidence-record',
    domain: 'hadith',
    evidenceKey: 'source_identity',
    decisionReference: 'NOOR-S27.3-REVIEW-HADITH-SOURCE-IDENTITY'
  }
];

const records = readJson(recordsPath);
const byId = new Map(records.map((record) => [record.id, record]));
const dateReviewed = todayIsoDate();
const now = new Date().toISOString();
const updates = [];

for (const target of trialTargets) {
  const record = byId.get(target.id);
  if (!record) throw new Error(`Trial target record missing: ${target.id}`);
  if (record.evidenceKey === 'production_promotion_approval' || record.lockedByGate === true) {
    throw new Error(`Cannot accept locked production record: ${target.id}`);
  }
  const beforeStatus = record.completionStatus;
  const beforeDecision = record.reviewerDecision;

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
    `Sprint 27.3 reviewer decision trial accepted this source identity evidence for staging review only. Decision reference: ${target.decisionReference}. This is not production approval.`
  ].filter(Boolean).join('\n\n');
  record.reviewerDecisionTrialId = `sprint-27-3-${target.domain}-source-identity`;
  record.reviewerDecisionTrialStatus = 'accepted-for-staging-only';
  record.reviewerDecisionReference = target.decisionReference;

  updates.push({
    recordId: record.id,
    domain: record.domain,
    evidenceKey: record.evidenceKey,
    beforeStatus,
    afterStatus: record.completionStatus,
    beforeDecision,
    afterDecision: record.reviewerDecision,
    reviewerName: record.reviewerName,
    dateReviewed: record.dateReviewed,
    acceptedForStaging: record.acceptedForStaging,
    productionApproved: record.productionApproved,
    decisionReference: target.decisionReference
  });
}

validateRecords(records);
syncOutputs(records);
const summary = summarize(records);

const report = {
  sprint: '27.3',
  version: '0.27.3',
  title: 'Evidence Reviewer Decision Trial',
  generatedAt: now,
  sourceRecordsPath: path.relative(root, recordsPath).replaceAll('\\\\', '/'),
  outputRoot: path.relative(root, decisionRoot).replaceAll('\\\\', '/'),
  reviewer,
  trialRecordsReviewed: updates.length,
  acceptedForStaging: summary.acceptedForStaging,
  domainsReadyForStaging: summary.domainsReadyForStaging,
  status: 'blocked',
  productionApproved: false,
  canPromoteToProduction: false,
  policy: 'Sprint 27.3 accepts only three source-identity evidence records for staging review. Production promotion remains blocked and no noor-cdn publish is allowed.',
  updates,
  domainSummary: summary.domains
};

writeJson(reportPath, report);
writeText(csvPath, toCsv(updates, ['recordId', 'domain', 'evidenceKey', 'beforeStatus', 'afterStatus', 'beforeDecision', 'afterDecision', 'reviewerName', 'dateReviewed', 'acceptedForStaging', 'productionApproved', 'decisionReference']));
writeText(reportMdPath, `# NOOR Sprint 27.3 — Evidence Reviewer Decision Trial\n\n` +
  `Generated: ${report.generatedAt}\n\n` +
  `## Result\n\n` +
  `- Trial records reviewed: **${report.trialRecordsReviewed}**\n` +
  `- Accepted for staging: **${report.acceptedForStaging}**\n` +
  `- Domains ready for staging: **${report.domainsReadyForStaging}/3**\n` +
  `- Status: **blocked**\n` +
  `- Production approved: **false**\n` +
  `- Can promote to production: **false**\n\n` +
  `## Accepted records\n\n` +
  updates.map((update) => `- ${update.domain} / ${update.evidenceKey} — ${update.afterDecision} (${update.decisionReference})`).join('\n') +
  `\n\n## Policy\n\n${report.policy}\n`);
writeText(commandsPath, `# Sprint 27.3 sample reviewer decision commands\n\n` +
  `Run the full trial:\n\n` +
  '```powershell\n' +
  `pnpm ilm:reviewer-decision-trial\n` +
  `pnpm check:ilm-reviewer-decision-trial\n` +
  `pnpm ilm:evidence:list -- --status=accepted-for-staging\n` +
  '```\n\n' +
  `Manual equivalent commands for future reviewer decisions:\n\n` +
  trialTargets.map((target) => '```powershell\n' + `pnpm ilm:evidence:update -- --id=${target.id} --status=accepted-for-staging --reviewer-decision=accepted-for-staging --reviewer-name="Reviewer Name" --reviewer-role="Reviewer Role" --reviewer-organisation="Organisation" --notes="Accepted for staging only; not production approval."\n` + '```').join('\n'));

console.log('NOOR Sprint 27.3 reviewer decision trial complete.');
console.log(`Trial records reviewed: ${updates.length}`);
console.log(`Accepted for staging: ${summary.acceptedForStaging}`);
console.log(`Domains ready for staging: ${summary.domainsReadyForStaging}/3`);
console.log('Status: blocked, productionApproved: false, canPromoteToProduction: false.');
console.log(`Report: ${path.relative(root, reportMdPath)}`);
