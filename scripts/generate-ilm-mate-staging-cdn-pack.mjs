import fs from 'node:fs';
import path from 'node:path';
import {
  outputRoot as evidenceRecordsRoot,
  recordsPath,
  readJson,
  summarize,
  writeJson,
  writeText
} from './ilm-mate-evidence-record-utils.mjs';

const root = process.cwd();
const VERSION = '0.27.4';
const reviewRoot = path.join(root, 'content-pipeline', 'review', 'ilm-mate-v1');
const outputRoot = path.join(reviewRoot, 'staging-cdn-publish');
const migratedCdnRoot = path.join(root, 'content-pipeline', 'imported', 'ilm-mate-v1', 'noor-cdn');
const stagingBranch = 'staging-ilm-mate-v1';
const stagingPublishRoot = 'content-pipeline/publish/ilm-mate-v1-staging-cdn';

const NON_PRODUCTION_REQUIRED = [
  'source_identity',
  'license_or_permission',
  'attribution_wording',
  'checksum_integrity_plan',
  'scholarly_reviewer_signoff'
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

function domainLabel(domain) {
  if (domain === 'quran') return 'Quran';
  if (domain === 'tafseer') return 'Tafseer';
  if (domain === 'hadith') return 'Hadith';
  return domain;
}

function buildDomainRows(records) {
  return ['quran', 'tafseer', 'hadith'].map((domain) => {
    const domainRecords = records.filter((record) => record.domain === domain);
    const accepted = domainRecords
      .filter((record) => NON_PRODUCTION_REQUIRED.includes(record.evidenceKey) && record.acceptedForStaging === true)
      .map((record) => record.evidenceKey);
    const missing = NON_PRODUCTION_REQUIRED.filter((key) => !accepted.includes(key));
    const blocked = domainRecords.find((record) => record.evidenceKey === 'production_promotion_approval');

    return {
      domain,
      domainLabel: domainLabel(domain),
      nonProductionRequired: NON_PRODUCTION_REQUIRED.length,
      acceptedForStaging: accepted.length,
      missingForStaging: missing.length,
      acceptedEvidenceKeys: accepted,
      missingEvidenceKeys: missing,
      stagingReady: missing.length === 0,
      productionApprovalStatus: blocked?.completionStatus ?? 'unknown',
      productionApproved: false,
      canPromoteToProduction: false
    };
  });
}

function writeMarkdown(report) {
  const domainLines = report.domains.map((domain) => [
    `### ${domain.domainLabel}`,
    '',
    `- Accepted for staging: **${domain.acceptedForStaging}/${domain.nonProductionRequired}**`,
    `- Staging ready: **${domain.stagingReady}**`,
    `- Missing: ${domain.missingEvidenceKeys.length > 0 ? domain.missingEvidenceKeys.map((key) => `\`${key}\``).join(', ') : 'none'}`,
    `- Production approved: **false**`,
    ''
  ].join('\n')).join('\n');

  return `# NOOR Sprint 27.4 — ilm-mate Staging CDN Publish Pack Gate

Generated: ${report.generatedAt}

## Gate status

- Status: **${report.status}**
- Target noor-cdn staging branch: \`${report.noorCdnTarget.branch}\`
- Can push noor-cdn staging branch: **${report.canPushNoorCdnStaging}**
- Can push noor-cdn main: **false**
- Production approved: **false**
- Can promote to production: **false**
- Domains ready for staging: **${report.domainsReadyForStaging}/3**

## Domain readiness

${domainLines}

## Current decision

Sprint 27.4 generates the staging CDN publish gate and command pack only. It does **not** publish migrated ilm-mate content because not all non-production evidence is accepted for staging.

## Safe noor-cdn rule

- Allowed later: \`noor-cdn/staging-ilm-mate-v1\` after all three domains are staging-ready.
- Not allowed now: \`noor-cdn/main\`.
- Production CDN remains blocked until a future explicit production promotion sprint.

## Required next evidence

${report.requiredNextEvidence.map((item) => `- ${item.domainLabel}: \`${item.evidenceKey}\``).join('\n')}

`;
}

function writeCommands(report) {
  return `# NOOR Sprint 27.4 — Future Staging noor-cdn Commands

These commands are intentionally **not active yet** because canPushNoorCdnStaging is ${report.canPushNoorCdnStaging}.

## Current status

- Domains ready for staging: ${report.domainsReadyForStaging}/3
- Production approved: false
- Can promote to production: false

## Future workflow after all staging evidence is accepted

From the NOOR app repo:

\`\`\`powershell
cd "C:\\Users\\user\\Documents\\00 Combo3\\Noor"

pnpm ilm:staging-cdn-pack
pnpm check:ilm-staging-cdn-pack
\`\`\`

Then, only after the check says canPushNoorCdnStaging=true, use a **staging branch** in the noor-cdn repo:

\`\`\`powershell
cd "C:\\Users\\user\\Documents\\00 Combo3\\noor-cdn"

git checkout -b staging-ilm-mate-v1
# copy approved staging CDN files here only after a future sprint unlocks the pack
git status
git add .
git commit -m "Add ilm-mate v1 staging CDN candidate"
git push -u origin staging-ilm-mate-v1
\`\`\`

Do not push \`noor-cdn/main\` until a future production promotion sprint.
`;
}

if (!fs.existsSync(recordsPath)) {
  throw new Error(`Evidence records missing: ${path.relative(root, recordsPath)}. Run pnpm ilm:evidence-records first.`);
}

const records = readJson(recordsPath);
const summary = summarize(records);
const domains = buildDomainRows(records);
const domainsReadyForStaging = domains.filter((domain) => domain.stagingReady).length;
const canPushNoorCdnStaging = domainsReadyForStaging === 3;
const migratedCdnAvailable = fs.existsSync(migratedCdnRoot);
const requiredNextEvidence = domains.flatMap((domain) =>
  domain.missingEvidenceKeys.map((evidenceKey) => ({
    domain: domain.domain,
    domainLabel: domain.domainLabel,
    evidenceKey
  }))
);

const report = {
  sprint: '27.4',
  version: VERSION,
  label: 'ilm-mate staging CDN publish pack gate',
  generatedAt: new Date().toISOString(),
  source: {
    evidenceRecordsRoot: path.relative(root, evidenceRecordsRoot).replaceAll('\\', '/'),
    evidenceRecordsPath: path.relative(root, recordsPath).replaceAll('\\', '/'),
    migratedCdnRoot: path.relative(root, migratedCdnRoot).replaceAll('\\', '/'),
    migratedCdnAvailable
  },
  outputRoot: path.relative(root, outputRoot).replaceAll('\\', '/'),
  stagingPublishRoot,
  status: 'blocked',
  productionApproved: false,
  canPromoteToProduction: false,
  canPushNoorCdnStaging,
  canPushNoorCdnMain: false,
  domainsReadyForStaging,
  totalDomains: 3,
  totalEvidenceRecords: records.length,
  acceptedForStaging: summary.acceptedForStaging,
  blockedProductionApprovalRecords: records.filter((record) => record.evidenceKey === 'production_promotion_approval' && record.completionStatus === 'blocked').length,
  requiredNextEvidence,
  noorCdnTarget: {
    repository: 'EffortEdutech/noor-cdn',
    branch: stagingBranch,
    path: 'noor-cdn/',
    rule: 'Staging branch only. Never push migrated ilm-mate content to noor-cdn/main in Sprint 27.4.'
  },
  domains,
  guardrails: [
    'Production CDN remains blocked.',
    'noor-cdn/main must not be updated in Sprint 27.4.',
    'Staging noor-cdn branch may only be used after all three domains have five non-production evidence items accepted for staging.',
    'production_promotion_approval records must remain blocked.'
  ],
  commands: [
    'pnpm ilm:staging-cdn-pack',
    'pnpm check:ilm-staging-cdn-pack',
    'pnpm ilm:evidence:list -- --status=accepted-for-staging'
  ]
};

fs.mkdirSync(outputRoot, { recursive: true });
writeJson(path.join(outputRoot, 'staging-cdn-publish-report.json'), report);
writeText(path.join(outputRoot, 'staging-cdn-publish-report.md'), writeMarkdown(report));
writeText(
  path.join(outputRoot, 'staging-cdn-domain-readiness.csv'),
  toCsv(
    domains.map((domain) => ({
      ...domain,
      acceptedEvidenceKeys: domain.acceptedEvidenceKeys.join(';'),
      missingEvidenceKeys: domain.missingEvidenceKeys.join(';')
    })),
    ['domain', 'domainLabel', 'nonProductionRequired', 'acceptedForStaging', 'missingForStaging', 'stagingReady', 'acceptedEvidenceKeys', 'missingEvidenceKeys', 'productionApprovalStatus', 'productionApproved', 'canPromoteToProduction']
  )
);
writeText(
  path.join(outputRoot, 'staging-cdn-required-next-evidence.csv'),
  toCsv(requiredNextEvidence, ['domain', 'domainLabel', 'evidenceKey'])
);
writeText(path.join(outputRoot, 'future-noor-cdn-staging-commands.md'), writeCommands(report));

console.log('NOOR Sprint 27.4 ilm-mate staging CDN publish pack gate generated.');
console.log(`Domains ready for staging: ${domainsReadyForStaging}/3`);
console.log(`Can push noor-cdn staging branch: ${canPushNoorCdnStaging}`);
console.log('Status: blocked, productionApproved: false, canPromoteToProduction: false.');
console.log(`Output: ${path.relative(root, outputRoot)}`);
