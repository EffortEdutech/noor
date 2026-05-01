import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const reviewRoot = path.join(root, 'content-pipeline', 'review', 'ilm-mate-v1');
const consolePath = path.join(reviewRoot, 'review-console.json');
const sampleQueuePath = path.join(reviewRoot, 'review-sample-queue.json');
const actionsRoot = path.join(reviewRoot, 'actions');

function readJson(filePath) {
  if (!fs.existsSync(filePath)) {
    throw new Error(`Missing ${path.relative(root, filePath)}. Run pnpm ilm:review-console first.`);
  }
  return JSON.parse(fs.readFileSync(filePath, 'utf8'));
}

function writeJson(filePath, data) {
  fs.writeFileSync(filePath, `${JSON.stringify(data, null, 2)}\n`, 'utf8');
}

function writeText(filePath, text) {
  fs.writeFileSync(filePath, text, 'utf8');
}

function csvEscape(value) {
  const text = String(value ?? '');
  if (/[",\r\n]/.test(text)) {
    return `"${text.replaceAll('"', '""')}"`;
  }
  return text;
}

const reviewConsole = readJson(consolePath);
const sampleQueue = readJson(sampleQueuePath);
fs.mkdirSync(actionsRoot, { recursive: true });

const requiredEvidence = reviewConsole.productionGate?.requiredEvidence || [
  'source identity',
  'license or written redistribution permission',
  'attribution wording',
  'checksum/integrity plan',
  'scholarly reviewer sign-off',
  'production promotion approval'
];

const domains = ['quran', 'tafseer', 'hadith'];
const summary = reviewConsole.summary || {};
const generatedAt = new Date().toISOString();

function domainCounts(domain) {
  if (domain === 'quran') {
    return {
      surahs: summary.quran?.surahIndexCount ?? 0,
      ayat: summary.quran?.ayahCount ?? 0,
      sampleItems: sampleQueue.byDomain?.quran?.length ?? 0
    };
  }
  if (domain === 'tafseer') {
    return {
      books: summary.tafseer?.sampleBookCount ?? 0,
      entries: summary.tafseer?.entryCount ?? 0,
      sampleItems: sampleQueue.byDomain?.tafseer?.length ?? 0
    };
  }
  return {
    collections: summary.hadith?.collectionCount ?? 0,
    items: summary.hadith?.itemCount ?? 0,
    sampleItems: sampleQueue.byDomain?.hadith?.length ?? 0
  };
}

function evidenceTemplate(domain) {
  return [
    { key: 'source_identity', label: 'Source identity', required: true, status: 'missing', evidenceRef: '', reviewer: '', notes: `Confirm original source identity for ${domain} content.` },
    { key: 'license_or_permission', label: 'License or written redistribution permission', required: true, status: 'missing', evidenceRef: '', reviewer: '', notes: 'Attach license text, permission email, or official reuse terms.' },
    { key: 'attribution_wording', label: 'Attribution wording', required: true, status: 'missing', evidenceRef: '', reviewer: '', notes: 'Confirm exact public attribution wording before CDN promotion.' },
    { key: 'checksum_integrity_plan', label: 'Checksum / integrity plan', required: true, status: 'missing', evidenceRef: '', reviewer: '', notes: 'Record checksum method and integrity verification plan.' },
    { key: 'scholarly_reviewer_signoff', label: 'Scholarly reviewer sign-off', required: true, status: 'missing', evidenceRef: '', reviewer: '', notes: 'Capture qualified reviewer sign-off for sacred content accuracy.' },
    { key: 'production_promotion_approval', label: 'Production promotion approval', required: true, status: 'blocked', evidenceRef: '', reviewer: '', notes: 'Must remain blocked until all required evidence is complete.' }
  ];
}

function nextActionsFor(domain) {
  return [
    `Assign a responsible reviewer for ${domain}.`,
    `Collect source identity and license/permission evidence for ${domain}.`,
    `Confirm public attribution wording for ${domain}.`,
    `Record checksum/integrity verification for ${domain}.`,
    `Capture scholarly reviewer sign-off for ${domain}.`,
    'Keep productionApproved=false until all evidence is complete.'
  ];
}

const domainReviews = domains.map((domain) => ({
  id: `ilm-mate-v1-${domain}-review-actions`,
  domain,
  status: 'needs-evidence',
  productionApproved: false,
  readinessScore: 0,
  counts: domainCounts(domain),
  requiredEvidence: evidenceTemplate(domain),
  nextActions: nextActionsFor(domain)
}));

const actionRegister = {
  id: 'noor-ilm-mate-v1-review-actions-register',
  version: '0.26.7',
  label: 'ilm-mate migrated content review workflow actions',
  generatedAt,
  sourceReviewConsole: 'content-pipeline/review/ilm-mate-v1/review-console.json',
  sourceSampleQueue: 'content-pipeline/review/ilm-mate-v1/review-sample-queue.json',
  outputRoot: 'content-pipeline/review/ilm-mate-v1/actions',
  policy: {
    productionGateStatus: 'blocked',
    productionApproved: false,
    allowedStatuses: ['blocked', 'needs-evidence', 'in-review', 'reviewed', 'approved-for-staging'],
    disallowedUntilEvidenceComplete: ['approved-for-production', 'production-promoted'],
    rule: 'No domain may be productionApproved=true until all required evidence is complete and production promotion is explicitly approved.'
  },
  summary: { quran: summary.quran, tafseer: summary.tafseer, hadith: summary.hadith, search: summary.search },
  requiredEvidence,
  domainReviews
};

const evidenceRegister = {
  id: 'noor-ilm-mate-v1-evidence-register',
  version: '0.26.7',
  generatedAt,
  productionApproved: false,
  status: 'blocked',
  entries: domainReviews.flatMap((domainReview) =>
    domainReview.requiredEvidence.map((evidence) => ({
      domain: domainReview.domain,
      evidenceKey: evidence.key,
      label: evidence.label,
      required: evidence.required,
      status: evidence.status,
      evidenceRef: evidence.evidenceRef,
      reviewer: evidence.reviewer,
      notes: evidence.notes
    }))
  )
};

const md = `# NOOR Sprint 26.7 Review Actions Register\n\nGenerated: ${generatedAt}\n\n## Gate status\n\n- Status: **blocked**\n- Production approved: **false**\n- Rule: No migrated ilm-mate content may be promoted to production CDN until source, license, attribution, checksum/integrity, scholarly review and promotion approval evidence are complete.\n\n## Domain readiness\n\n| Domain | Status | Production approved | Readiness score | Counts |\n| --- | --- | --- | ---: | --- |\n${domainReviews.map((domainReview) => `| ${domainReview.domain} | ${domainReview.status} | ${domainReview.productionApproved} | ${domainReview.readinessScore} | ${Object.entries(domainReview.counts).map(([key, value]) => `${key}: ${value}`).join('; ')} |`).join('\n')}\n\n## Required evidence\n\n${requiredEvidence.map((item) => `- ${item}`).join('\n')}\n\n## Next reviewer actions\n\n${domainReviews.map((domainReview) => `### ${domainReview.domain}\n\n${domainReview.nextActions.map((action) => `- [ ] ${action}`).join('\n')}`).join('\n\n')}\n\n## Important\n\nThis register is a workflow control layer only. It does not approve, replace, publish or promote sacred content.\n`;

const evidenceMd = `# NOOR Sprint 26.7 Evidence Register\n\nGenerated: ${generatedAt}\n\n| Domain | Evidence | Required | Status | Evidence ref | Reviewer |\n| --- | --- | --- | --- | --- | --- |\n${evidenceRegister.entries.map((entry) => `| ${entry.domain} | ${entry.label} | ${entry.required} | ${entry.status} | ${entry.evidenceRef || '-'} | ${entry.reviewer || '-'} |`).join('\n')}\n\n## Gate\n\nProduction approval remains **false**.\n`;

const csvRows = [
  ['domain', 'status', 'production_approved', 'readiness_score', 'counts', 'next_actions'],
  ...domainReviews.map((domainReview) => [domainReview.domain, domainReview.status, String(domainReview.productionApproved), String(domainReview.readinessScore), Object.entries(domainReview.counts).map(([key, value]) => `${key}:${value}`).join(';'), domainReview.nextActions.join(' | ')])
];
const evidenceCsvRows = [
  ['domain', 'evidence_key', 'label', 'required', 'status', 'evidence_ref', 'reviewer', 'notes'],
  ...evidenceRegister.entries.map((entry) => [entry.domain, entry.evidenceKey, entry.label, String(entry.required), entry.status, entry.evidenceRef, entry.reviewer, entry.notes])
];

writeJson(path.join(actionsRoot, 'review-actions-register.json'), actionRegister);
writeJson(path.join(actionsRoot, 'review-evidence-register.json'), evidenceRegister);
writeText(path.join(actionsRoot, 'review-actions-register.md'), md);
writeText(path.join(actionsRoot, 'review-evidence-register.md'), evidenceMd);
writeText(path.join(actionsRoot, 'review-actions-register.csv'), csvRows.map((row) => row.map(csvEscape).join(',')).join('\n') + '\n');
writeText(path.join(actionsRoot, 'review-evidence-register.csv'), evidenceCsvRows.map((row) => row.map(csvEscape).join(',')).join('\n') + '\n');

console.log('NOOR Sprint 26.7 ilm-mate review actions generated.');
console.log(`Output: ${path.relative(root, actionsRoot)}`);
console.log('Domains: quran, tafseer, hadith');
console.log('Status: blocked, productionApproved: false.');
