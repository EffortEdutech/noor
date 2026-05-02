import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname } from 'node:path';
import { execFileSync } from 'node:child_process';

const OUTPUT_JSON = 'content-pipeline/production-cdn/approval-gate/noor-production-cdn-approval-gate.json';
const OUTPUT_MD = 'content-pipeline/production-cdn/approval-gate/noor-production-cdn-approval-gate.md';
const STAGING_ACCEPTANCE = 'content-pipeline/review/ilm-mate-v1/staging-cdn-acceptance/staging-cdn-acceptance-report.json';
const BROWSER_QA = 'content-pipeline/review/ilm-mate-v1/staging-browser-qa/staging-browser-qa-report.json';
const LEGACY_PROMOTION = 'content-pipeline/production-cdn/noor-production-cdn-promotion.json';

function argValue(name, fallback = '') {
  const index = process.argv.indexOf(name);
  if (index === -1) return fallback;
  return process.argv[index + 1] ?? fallback;
}

const approve = process.argv.includes('--approve');
const approver = argValue('--approver', argValue('--reviewer', ''));
const note = argValue('--note', '');

function readJson(file) {
  if (!existsSync(file)) return null;
  return JSON.parse(readFileSync(file, 'utf8'));
}

function writeJson(file, value) {
  mkdirSync(dirname(file), { recursive: true });
  writeFileSync(file, `${JSON.stringify(value, null, 2)}\n`, 'utf8');
}

function writeText(file, value) {
  mkdirSync(dirname(file), { recursive: true });
  writeFileSync(file, value, 'utf8');
}

function git(repoRoot, args) {
  try {
    return execFileSync('git', ['-C', repoRoot, ...args], { encoding: 'utf8' }).trim();
  } catch {
    return '';
  }
}

function gate(id, title, status, details = {}, severity = 'required') {
  return { id, title, severity, status: status ? 'pass' : 'fail', details };
}

const acceptance = readJson(STAGING_ACCEPTANCE);
const browserQa = readJson(BROWSER_QA);
const legacyPromotion = readJson(LEGACY_PROMOTION);

const noorCdnRoot = '../noor-cdn';
const noorCdnBranch = existsSync(noorCdnRoot) ? git(noorCdnRoot, ['branch', '--show-current']) : '';
const noorCdnHead = existsSync(noorCdnRoot) ? git(noorCdnRoot, ['rev-parse', '--short', 'HEAD']) : '';
const noorCdnStatus = existsSync(noorCdnRoot) ? git(noorCdnRoot, ['status', '--short']) : '';

const acceptancePassed = acceptance?.acceptedForStaging === true && Array.isArray(acceptance.requiredFailures) && acceptance.requiredFailures.length === 0;
const qaPassed = browserQa?.status === 'accepted_for_staging_browser_qa'
  && Number(browserQa?.summary?.requiredFailed ?? 0) === 0
  && Number(browserQa?.summary?.requiredPending ?? 0) === 0;
const quranPassed = acceptance?.quran?.surahIndexCount === 114 && acceptance?.quran?.ayat === 6236;
const tafseerPassed = acceptance?.tafseer?.indexExists === true && Number(acceptance?.tafseer?.tafseerFiles ?? 0) > 0;
const hadithPassed = Number(acceptance?.hadith?.collections ?? 0) > 0
  && Number(acceptance?.hadith?.byBook ?? 0) > 0
  && Number(acceptance?.hadith?.byChapter ?? 0) > 0
  && Array.isArray(acceptance?.hadith?.duplicateCollectionIds)
  && acceptance.hadith.duplicateCollectionIds.length === 0;
const envValues = acceptance?.env?.values ? Object.values(acceptance.env.values).join('\n') : '';
const runtimeStagingPassed = envValues.includes('@staging-ilm-mate-v1') && !envValues.includes('@main/noor-cdn');
const noorCdnStagingReady = noorCdnBranch === 'staging-ilm-mate-v1' && noorCdnStatus.length === 0;
const legacyStillBlocked = legacyPromotion?.status === 'blocked' && legacyPromotion?.productionPromotionAllowed === false;

const gates = [
  gate('staging-acceptance', 'Sprint 27.10 staging CDN acceptance is passed', acceptancePassed, {
    acceptedForStaging: acceptance?.acceptedForStaging ?? null,
    requiredFailures: acceptance?.requiredFailures ?? null
  }),
  gate('browser-qa', 'Sprint 27.11 browser QA is passed', qaPassed, {
    status: browserQa?.status ?? null,
    requiredFailed: browserQa?.summary?.requiredFailed ?? null,
    requiredPending: browserQa?.summary?.requiredPending ?? null
  }),
  gate('quran', 'Quran staging CDN has 114 surahs and 6,236 ayat', quranPassed, acceptance?.quran ?? {}),
  gate('tafseer', 'Tafseer staging CDN index and files are available', tafseerPassed, acceptance?.tafseer ?? {}),
  gate('hadith', 'Hadith by_book and by_chapter staging views are available and unique', hadithPassed, acceptance?.hadith ?? {}),
  gate('runtime-staging', 'Runtime env points to staging branch and not production main', runtimeStagingPassed, {
    containsStaging: envValues.includes('@staging-ilm-mate-v1'),
    containsMain: envValues.includes('@main/noor-cdn')
  }),
  gate('noor-cdn-staging-clean', 'Local noor-cdn repository is clean on staging branch', noorCdnStagingReady, {
    repoRoot: noorCdnRoot,
    branch: noorCdnBranch || null,
    head: noorCdnHead || null,
    statusShort: noorCdnStatus || '(clean)'
  }),
  gate('legacy-production-block-still-safe', 'Legacy production promotion file remains blocked until Sprint 27.14 executes promotion', legacyStillBlocked, {
    status: legacyPromotion?.status ?? null,
    productionPromotionAllowed: legacyPromotion?.productionPromotionAllowed ?? null
  })
];

const requiredFailures = gates.filter((item) => item.severity === 'required' && item.status !== 'pass');

if (approve && !approver.trim()) {
  console.error('Missing approver. Use --approve --approver "Your Name".');
  process.exit(1);
}

const canApprove = requiredFailures.length === 0 && approve === true;
const approvalStatus = canApprove ? 'approved_for_promotion' : 'pending_manual_approval';

const report = {
  sprint: '27.13',
  title: 'Production CDN Promotion Approval Gate',
  generatedAt: new Date().toISOString(),
  productionPromotion: canApprove ? 'approved_for_next_sprint' : 'blocked_pending_manual_approval',
  approvalStatus,
  productionPromotionAllowed: canApprove,
  promotionExecuted: false,
  noorCdnMainTouched: false,
  currentRuntimeDefault: 'staging_for_qa',
  approvedBy: canApprove ? approver.trim() : null,
  approvedAt: canApprove ? new Date().toISOString() : null,
  approvalNote: canApprove ? note : null,
  sourceBranch: 'noor-cdn/staging-ilm-mate-v1',
  targetBranch: 'noor-cdn/main',
  requiredNextSprint: 'Sprint 27.14 - Promote noor-cdn staging to production main',
  sourceReports: {
    stagingAcceptance: STAGING_ACCEPTANCE,
    stagingBrowserQa: BROWSER_QA,
    legacyPromotionGate: LEGACY_PROMOTION
  },
  noorCdnGit: {
    repoRoot: noorCdnRoot,
    branch: noorCdnBranch || null,
    head: noorCdnHead || null,
    clean: noorCdnStatus.length === 0,
    statusShort: noorCdnStatus
  },
  gates,
  requiredFailures,
  manualApprovalCommand: 'pnpm production:approval-gate -- --approve --approver "Darya Malak" --note "Founder approval for Sprint 27.14 production CDN promotion."',
  safetyRules: [
    'Sprint 27.13 does not copy files into noor-cdn/main.',
    'Sprint 27.13 does not push noor-cdn/main.',
    'Sprint 27.13 only records approval for Sprint 27.14 production promotion.',
    'Sprint 27.14 must run a separate promotion command/check before noor-cdn/main is touched.'
  ],
  nextAction: canApprove
    ? 'Approved for Sprint 27.14 production CDN promotion. Do not push noor-cdn/main until Sprint 27.14.'
    : 'Fix required failures or rerun with explicit approval command.'
};

const gateRows = gates.map((item) => `| ${item.title} | ${item.status.toUpperCase()} |`).join('\n');
const failureText = requiredFailures.length === 0 ? 'None.' : requiredFailures.map((item) => `- ${item.id}: ${item.title}`).join('\n');

const md = `# Sprint 27.13 - Production CDN Promotion Approval Gate

## Status

${canApprove ? 'APPROVED FOR NEXT SPRINT PROMOTION' : 'PENDING MANUAL APPROVAL'}

## Production Safety

- Production promotion allowed: **${report.productionPromotionAllowed ? 'YES' : 'NO'}**
- Promotion executed in this sprint: **NO**
- noor-cdn/main touched in this sprint: **NO**
- Source branch: \`${report.sourceBranch}\`
- Target branch: \`${report.targetBranch}\`
- Required next sprint: **${report.requiredNextSprint}**

## Approval

- Approved by: ${report.approvedBy ?? '(not approved yet)'}
- Approved at: ${report.approvedAt ?? '(not approved yet)'}
- Note: ${report.approvalNote ?? '(none)'}

## Required Gates

| Gate | Status |
| --- | --- |
${gateRows}

## Required Failures

${failureText}

## Manual Approval Command

\`\`\`powershell
${report.manualApprovalCommand}
\`\`\`

## Next Action

${report.nextAction}
`;

writeJson(OUTPUT_JSON, report);
writeText(OUTPUT_MD, md);

console.log('NOOR Sprint 27.13 production CDN approval gate generated.');
console.log(`Report: ${OUTPUT_MD}`);
console.log(`JSON: ${OUTPUT_JSON}`);
console.log(`Approval status: ${approvalStatus}`);
if (requiredFailures.length > 0) {
  console.log(`Required failures: ${requiredFailures.map((item) => item.id).join(', ')}`);
}
if (!canApprove) {
  console.log('Production promotion remains blocked until explicit approval is recorded.');
}
