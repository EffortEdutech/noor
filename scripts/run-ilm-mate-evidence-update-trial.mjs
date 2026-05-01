import path from 'node:path';
import {
  root,
  outputRoot,
  recordsPath,
  readJson,
  writeJson,
  writeText,
  todayIsoDate,
  syncOutputs,
  validateRecords,
  summarize
} from './ilm-mate-evidence-record-utils.mjs';

const VERSION = '0.27.2';
const trialRoot = path.join(outputRoot, 'trial');
const trialRecords = [
  {
    id: 'ilm-mate-v1-quran-source_identity-evidence-record',
    domain: 'quran',
    evidenceKey: 'source_identity',
    evidenceReference: 'NOOR-S27.2-TRIAL-QURAN-SOURCE-IDENTITY',
    sourceUrlOrDocument: 'local://muslim-companion-poc/content/quran/MANIFEST.md',
    reviewerNotes: 'Sprint 27.2 sample submission only. Source identity evidence is submitted for future reviewer assessment, not accepted for staging yet.'
  },
  {
    id: 'ilm-mate-v1-tafseer-source_identity-evidence-record',
    domain: 'tafseer',
    evidenceKey: 'source_identity',
    evidenceReference: 'NOOR-S27.2-TRIAL-TAFSEER-SOURCE-IDENTITY',
    sourceUrlOrDocument: 'local://muslim-companion-poc/content/tafsir/MANIFEST.md',
    reviewerNotes: 'Sprint 27.2 sample submission only. Source identity evidence is submitted for future reviewer assessment, not accepted for staging yet.'
  },
  {
    id: 'ilm-mate-v1-hadith-source_identity-evidence-record',
    domain: 'hadith',
    evidenceKey: 'source_identity',
    evidenceReference: 'NOOR-S27.2-TRIAL-HADITH-SOURCE-IDENTITY',
    sourceUrlOrDocument: 'local://muslim-companion-poc/content/hadith/MANIFEST.md',
    reviewerNotes: 'Sprint 27.2 sample submission only. Source identity evidence is submitted for future reviewer assessment, not accepted for staging yet.'
  }
];

function csvEscape(value) {
  const text = value === undefined || value === null ? '' : String(value);
  return `"${text.replaceAll('"', '""')}"`;
}
function toCsv(rows, headers) {
  const lines = [headers.map(csvEscape).join(',')];
  for (const row of rows) lines.push(headers.map((header) => csvEscape(row[header])).join(','));
  return `${lines.join('\n')}\n`;
}
function fail(message) {
  throw new Error(message);
}

const records = readJson(recordsPath);
const submittedAt = new Date().toISOString();
const submittedDate = todayIsoDate();
const updates = [];

for (const trial of trialRecords) {
  const record = records.find((item) => item.id === trial.id);
  if (!record) fail(`Trial record missing: ${trial.id}`);
  if (record.lockedByGate || record.evidenceKey === 'production_promotion_approval') fail(`Refusing to update locked record: ${trial.id}`);
  if (record.acceptedForStaging === true || record.completionStatus === 'accepted-for-staging') {
    fail(`Trial must not downgrade accepted staging evidence: ${trial.id}`);
  }

  const previous = {
    completionStatus: record.completionStatus,
    submissionStatus: record.submissionStatus,
    reviewerDecision: record.reviewerDecision,
    acceptedForStaging: record.acceptedForStaging
  };

  record.completionStatus = 'submitted';
  record.submissionStatus = 'submitted';
  record.reviewerDecision = 'pending';
  record.acceptedForStaging = false;
  record.productionApproved = false;
  record.canApproveProduction = false;
  record.evidenceReference = trial.evidenceReference;
  record.sourceUrlOrDocument = trial.sourceUrlOrDocument;
  record.dateSubmitted = submittedDate;
  record.dateReviewed = '';
  record.reviewerName = '';
  record.reviewerRole = '';
  record.reviewerOrganisation = '';
  record.reviewerNotes = trial.reviewerNotes;
  record.rejectionReason = '';
  record.lastUpdatedAt = submittedAt;
  record.trialSubmissionId = `sprint-27-2-${trial.domain}-source-identity`;
  record.trialSubmissionStatus = 'sample-submitted-only';

  updates.push({
    id: record.id,
    domain: record.domain,
    evidenceKey: record.evidenceKey,
    previousCompletionStatus: previous.completionStatus,
    currentCompletionStatus: record.completionStatus,
    previousReviewerDecision: previous.reviewerDecision,
    currentReviewerDecision: record.reviewerDecision,
    evidenceReference: record.evidenceReference,
    sourceUrlOrDocument: record.sourceUrlOrDocument,
    dateSubmitted: record.dateSubmitted,
    acceptedForStaging: record.acceptedForStaging,
    productionApproved: record.productionApproved,
    canApproveProduction: record.canApproveProduction
  });
}

validateRecords(records);
syncOutputs(records);

const summary = summarize(records);
const submittedRecords = records.filter((record) => record.completionStatus === 'submitted').length;
const submittedTrialRecords = updates.length;
const report = {
  version: VERSION,
  sprint: '27.2',
  label: 'ilm-mate evidence update trial / sample record submission',
  generatedAt: submittedAt,
  recordsPath: path.relative(root, recordsPath).replaceAll('\\', '/'),
  status: 'blocked',
  productionApproved: false,
  canPromoteToProduction: false,
  trialPolicy: 'This sprint submits sample evidence records only. It does not accept evidence for staging and does not approve production CDN promotion.',
  expectedTrialUpdates: trialRecords.length,
  submittedTrialRecords,
  totalSubmittedRecords: submittedRecords,
  acceptedForStaging: summary.acceptedForStaging,
  domainsReadyForStaging: summary.domainsReadyForStaging,
  updates,
  summary
};

writeJson(path.join(trialRoot, 'evidence-update-trial-report.json'), report);
writeText(path.join(trialRoot, 'evidence-update-trial-updates.csv'), toCsv(updates, [
  'id',
  'domain',
  'evidenceKey',
  'previousCompletionStatus',
  'currentCompletionStatus',
  'previousReviewerDecision',
  'currentReviewerDecision',
  'evidenceReference',
  'sourceUrlOrDocument',
  'dateSubmitted',
  'acceptedForStaging',
  'productionApproved',
  'canApproveProduction'
]));
writeText(path.join(trialRoot, 'sample-submission-commands.md'), `# NOOR Sprint 27.2 Sample Evidence Submission Commands\n\n` +
  `These commands demonstrate how future evidence records can be submitted using the Sprint 27.1 helper.\n\n` +
  trialRecords.map((trial) => `\`pnpm ilm:evidence:update -- --id=${trial.id} --status=submitted --evidence-reference=${trial.evidenceReference} --source-url-or-document=${trial.sourceUrlOrDocument} --notes="Sprint 27.2 sample submission only"\``).join('\n\n') +
  `\n\nProduction approval remains blocked.\n`);
writeText(path.join(trialRoot, 'evidence-update-trial-report.md'), `# NOOR Sprint 27.2 — Evidence Update Trial\n\n` +
  `Generated: ${report.generatedAt}\n\n` +
  `## Result\n\n` +
  `- Trial records submitted: **${submittedTrialRecords}/${trialRecords.length}**\n` +
  `- Total submitted records: **${submittedRecords}**\n` +
  `- Accepted for staging: **${summary.acceptedForStaging}**\n` +
  `- Domains ready for staging: **${summary.domainsReadyForStaging}/3**\n` +
  `- Production approved: **false**\n` +
  `- Can promote to production: **false**\n` +
  `- Status: **blocked**\n\n` +
  `## Updated records\n\n` +
  updates.map((update) => `- ${update.id} — ${update.previousCompletionStatus} → ${update.currentCompletionStatus}`).join('\n') +
  `\n\n## Policy\n\nThis is a sample submission trial only. Evidence is not accepted for staging and production CDN publication remains blocked.\n`);

console.log('NOOR Sprint 27.2 evidence update trial complete.');
console.log(`Trial records submitted: ${submittedTrialRecords}/${trialRecords.length}`);
console.log(`Total submitted records: ${submittedRecords}`);
console.log(`Accepted for staging: ${summary.acceptedForStaging}`);
console.log('Status: blocked, productionApproved: false, canPromoteToProduction: false.');
console.log(`Report: ${path.relative(root, path.join(trialRoot, 'evidence-update-trial-report.md')).replaceAll('\\', '/')}`);
