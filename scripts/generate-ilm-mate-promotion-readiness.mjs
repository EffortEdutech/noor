import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();

const actionsRoot = path.join(root, 'content-pipeline', 'review', 'ilm-mate-v1', 'actions');
const outputRoot = path.join(root, 'content-pipeline', 'review', 'ilm-mate-v1', 'promotion-readiness');

const actionsRegisterPath = path.join(actionsRoot, 'review-actions-register.json');
const evidenceRegisterPath = path.join(actionsRoot, 'review-evidence-register.json');

const version = '0.26.8';
const allowedCompleteStatuses = new Set(['complete', 'verified', 'reviewed', 'approved-for-staging']);
const requiredDomains = ['quran', 'tafseer', 'hadith'];

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, 'utf8'));
}

function writeJson(filePath, value) {
  fs.writeFileSync(filePath, JSON.stringify(value, null, 2) + '\n', 'utf8');
}

function csvCell(value) {
  const text = String(value ?? '');
  return `"${text.replaceAll('"', '""')}"`;
}

function writeCsv(filePath, rows) {
  fs.writeFileSync(filePath, rows.map((row) => row.map(csvCell).join(',')).join('\n') + '\n', 'utf8');
}

function ensureDir(dirPath) {
  fs.mkdirSync(dirPath, { recursive: true });
}

function normalizeStatus(status) {
  return String(status || '').trim().toLowerCase();
}

function isEvidenceComplete(evidence) {
  const status = normalizeStatus(evidence.status);
  const hasEvidenceRef = String(evidence.evidenceRef || '').trim().length > 0;
  const hasReviewer = String(evidence.reviewer || '').trim().length > 0;
  return allowedCompleteStatuses.has(status) && hasEvidenceRef && hasReviewer;
}

if (!fs.existsSync(actionsRegisterPath)) {
  throw new Error(`Missing Sprint 26.7 actions register: ${path.relative(root, actionsRegisterPath)}. Run pnpm ilm:review-actions first.`);
}

if (!fs.existsSync(evidenceRegisterPath)) {
  throw new Error(`Missing Sprint 26.7 evidence register: ${path.relative(root, evidenceRegisterPath)}. Run pnpm ilm:review-actions first.`);
}

const actionsRegister = readJson(actionsRegisterPath);
const evidenceRegister = readJson(evidenceRegisterPath);

ensureDir(outputRoot);

const domainReadiness = requiredDomains.map((domain) => {
  const review = actionsRegister.domainReviews?.find((item) => item.domain === domain);
  if (!review) {
    throw new Error(`Missing domain review in actions register: ${domain}`);
  }

  const evidenceItems = Array.isArray(review.requiredEvidence) ? review.requiredEvidence : [];
  const requiredEvidence = evidenceItems.filter((item) => item.required !== false);
  const completedEvidence = requiredEvidence.filter(isEvidenceComplete);
  const missingEvidence = requiredEvidence.filter((item) => !isEvidenceComplete(item));
  const productionApprovalEvidence = requiredEvidence.find((item) => item.key === 'production_promotion_approval');

  const readinessScore = requiredEvidence.length === 0
    ? 0
    : Math.round((completedEvidence.length / requiredEvidence.length) * 100);

  const canApproveForStaging = requiredEvidence.length > 0 && completedEvidence.length === requiredEvidence.length;
  const canPromoteToProduction = false;

  const blockers = [];
  if (review.productionApproved !== false) {
    blockers.push('Domain productionApproved must remain false during Sprint 26.8.');
  }
  if (!canApproveForStaging) {
    blockers.push(`${missingEvidence.length} required evidence item(s) incomplete.`);
  }
  if (!productionApprovalEvidence || normalizeStatus(productionApprovalEvidence.status) !== 'blocked') {
    blockers.push('Production promotion approval evidence must remain blocked until formal review approval.');
  }

  return {
    domain,
    status: blockers.length > 0 ? 'blocked' : 'ready-for-staging-review',
    productionApproved: false,
    canApproveForStaging,
    canPromoteToProduction,
    readinessScore,
    requiredEvidenceCount: requiredEvidence.length,
    completedEvidenceCount: completedEvidence.length,
    missingEvidenceCount: missingEvidence.length,
    blockers,
    counts: review.counts || {},
    requiredEvidence: requiredEvidence.map((item) => ({
      key: item.key,
      label: item.label,
      status: normalizeStatus(item.status),
      evidenceRef: item.evidenceRef || '',
      reviewer: item.reviewer || '',
      complete: isEvidenceComplete(item),
      notes: item.notes || ''
    }))
  };
});

const allDomainsReadyForStaging = domainReadiness.every((item) => item.canApproveForStaging);
const anyDomainProductionApproved = domainReadiness.some((item) => item.productionApproved === true);

const report = {
  id: 'noor-ilm-mate-v1-promotion-readiness',
  version,
  label: 'ilm-mate migrated content promotion readiness gate',
  generatedAt: new Date().toISOString(),
  sourceActionsRegister: 'content-pipeline/review/ilm-mate-v1/actions/review-actions-register.json',
  sourceEvidenceRegister: 'content-pipeline/review/ilm-mate-v1/actions/review-evidence-register.json',
  outputRoot: 'content-pipeline/review/ilm-mate-v1/promotion-readiness',
  policy: {
    productionGateStatus: 'blocked',
    productionApproved: false,
    canPromoteToProduction: false,
    allDomainsReadyForStaging,
    rule: 'Sprint 26.8 may calculate readiness but must not approve or promote migrated ilm-mate content to production CDN.'
  },
  summary: {
    domains: domainReadiness.length,
    readyForStagingDomains: domainReadiness.filter((item) => item.canApproveForStaging).length,
    blockedDomains: domainReadiness.filter((item) => item.status === 'blocked').length,
    totalRequiredEvidence: domainReadiness.reduce((sum, item) => sum + item.requiredEvidenceCount, 0),
    completedEvidence: domainReadiness.reduce((sum, item) => sum + item.completedEvidenceCount, 0),
    missingEvidence: domainReadiness.reduce((sum, item) => sum + item.missingEvidenceCount, 0),
    anyDomainProductionApproved
  },
  contentSummary: actionsRegister.summary || {},
  domainReadiness,
  nextActions: [
    'Complete source identity evidence for Quran, Tafseer and Hadith.',
    'Complete license or written permission evidence for every migrated source.',
    'Confirm public attribution wording for each domain.',
    'Record checksum and integrity verification plan.',
    'Collect qualified scholarly reviewer sign-off.',
    'Keep productionApproved=false until a future explicit production-promotion sprint.'
  ],
  evidenceRegisterSummary: {
    id: evidenceRegister.id,
    version: evidenceRegister.version,
    entries: Array.isArray(evidenceRegister.evidenceEntries) ? evidenceRegister.evidenceEntries.length : undefined
  }
};

const reportPath = path.join(outputRoot, 'promotion-readiness-report.json');
writeJson(reportPath, report);

const md = [
  '# NOOR Sprint 26.8 — ilm-mate Promotion Readiness Gate',
  '',
  `Generated: ${report.generatedAt}`,
  '',
  '## Status',
  '',
  `- Production gate: **${report.policy.productionGateStatus}**`,
  `- Production approved: **${report.policy.productionApproved}**`,
  `- Can promote to production CDN: **${report.policy.canPromoteToProduction}**`,
  `- Ready for staging domains: **${report.summary.readyForStagingDomains}/${report.summary.domains}**`,
  `- Missing evidence items: **${report.summary.missingEvidence}**`,
  '',
  '## Domain Readiness',
  '',
  '| Domain | Status | Readiness | Evidence complete | Missing evidence | Can promote |',
  '| --- | --- | ---: | ---: | ---: | --- |',
  ...domainReadiness.map((item) => `| ${item.domain} | ${item.status} | ${item.readinessScore}% | ${item.completedEvidenceCount}/${item.requiredEvidenceCount} | ${item.missingEvidenceCount} | ${item.canPromoteToProduction} |`),
  '',
  '## Policy',
  '',
  report.policy.rule,
  '',
  '## Next Actions',
  '',
  ...report.nextActions.map((action) => `- ${action}`),
  '',
  '## Blockers',
  '',
  ...domainReadiness.flatMap((item) => item.blockers.map((blocker) => `- **${item.domain}:** ${blocker}`)),
  ''
].join('\n');

fs.writeFileSync(path.join(outputRoot, 'promotion-readiness-report.md'), md, 'utf8');

writeCsv(path.join(outputRoot, 'promotion-readiness-domains.csv'), [
  ['domain', 'status', 'readinessScore', 'requiredEvidenceCount', 'completedEvidenceCount', 'missingEvidenceCount', 'canApproveForStaging', 'canPromoteToProduction'],
  ...domainReadiness.map((item) => [
    item.domain,
    item.status,
    item.readinessScore,
    item.requiredEvidenceCount,
    item.completedEvidenceCount,
    item.missingEvidenceCount,
    item.canApproveForStaging,
    item.canPromoteToProduction
  ])
]);

writeCsv(path.join(outputRoot, 'promotion-readiness-evidence.csv'), [
  ['domain', 'key', 'label', 'status', 'complete', 'evidenceRef', 'reviewer', 'notes'],
  ...domainReadiness.flatMap((domain) => domain.requiredEvidence.map((item) => [
    domain.domain,
    item.key,
    item.label,
    item.status,
    item.complete,
    item.evidenceRef,
    item.reviewer,
    item.notes
  ]))
]);

console.log('NOOR Sprint 26.8 ilm-mate promotion readiness generated.');
console.log(`Output: ${path.relative(root, outputRoot)}`);
console.log(`Domains: ${domainReadiness.map((item) => item.domain).join(', ')}`);
console.log(`Ready for staging: ${report.summary.readyForStagingDomains}/${report.summary.domains}`);
console.log('Status: blocked, productionApproved: false, canPromoteToProduction: false.');
