import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';

const sprint = '27.14';
const outputRoot = 'content-pipeline/production-cdn/promotion-execution';
const planJsonFile = path.join(outputRoot, 'noor-cdn-production-promotion-plan.json');
const planMdFile = path.join(outputRoot, 'noor-cdn-production-promotion-plan.md');
const approvalGateFile = 'content-pipeline/production-cdn/approval-gate/noor-production-cdn-approval-gate.json';
const stagingAcceptanceFile = 'content-pipeline/review/ilm-mate-v1/staging-cdn-acceptance/staging-cdn-acceptance-report.json';
const browserQaFile = 'content-pipeline/review/ilm-mate-v1/staging-browser-qa/staging-browser-qa-report.json';
const noorCdnRepoRoot = path.normalize('../noor-cdn');

function readJson(file) {
  return JSON.parse(readFileSync(file, 'utf8'));
}

function sh(args, options = {}) {
  return execFileSync(args[0], args.slice(1), { encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'], ...options }).trim();
}

function git(repo, args, allowFail = false) {
  try {
    return sh(['git', '-C', repo, ...args]);
  } catch (error) {
    if (allowFail) return '';
    throw error;
  }
}

function splitCount(value) {
  const [left = '0', right = '0'] = String(value).trim().split(/\s+/);
  return { left: Number(left), right: Number(right) };
}

function addGate(gates, id, title, status, details = {}) {
  gates.push({ id, title, severity: 'required', status, details });
}

const gates = [];
const requiredFailures = [];

if (!existsSync(approvalGateFile)) requiredFailures.push('Missing Sprint 27.13 production approval gate.');
if (!existsSync(stagingAcceptanceFile)) requiredFailures.push('Missing Sprint 27.10 staging acceptance report.');
if (!existsSync(browserQaFile)) requiredFailures.push('Missing Sprint 27.11 browser QA report.');

const approvalGate = existsSync(approvalGateFile) ? readJson(approvalGateFile) : {};
const stagingAcceptance = existsSync(stagingAcceptanceFile) ? readJson(stagingAcceptanceFile) : {};
const browserQa = existsSync(browserQaFile) ? readJson(browserQaFile) : {};

addGate(gates, 'approval-gate', 'Sprint 27.13 approval gate allows Sprint 27.14 promotion', approvalGate.productionPromotionAllowed === true && approvalGate.approvalStatus === 'approved_for_promotion' ? 'pass' : 'fail', {
  approvalStatus: approvalGate.approvalStatus ?? 'missing',
  productionPromotionAllowed: approvalGate.productionPromotionAllowed === true,
  requiredNextSprint: approvalGate.requiredNextSprint ?? null
});
if (!(approvalGate.productionPromotionAllowed === true && approvalGate.approvalStatus === 'approved_for_promotion')) requiredFailures.push('Sprint 27.13 approval gate is not approved for promotion.');

addGate(gates, 'staging-acceptance', 'Sprint 27.10 staging CDN acceptance passed', stagingAcceptance.acceptedForStaging === true ? 'pass' : 'fail', {
  acceptedForStaging: stagingAcceptance.acceptedForStaging === true,
  requiredFailures: stagingAcceptance.requiredFailures ?? []
});
if (stagingAcceptance.acceptedForStaging !== true) requiredFailures.push('Staging CDN acceptance is not accepted.');

addGate(gates, 'browser-qa', 'Sprint 27.11 staging browser QA passed', browserQa.status === 'accepted_for_staging_browser_qa' ? 'pass' : 'fail', {
  status: browserQa.status ?? 'missing',
  requiredFailed: browserQa.summary?.requiredFailed ?? null,
  requiredPending: browserQa.summary?.requiredPending ?? null
});
if (browserQa.status !== 'accepted_for_staging_browser_qa') requiredFailures.push('Staging browser QA is not accepted.');

let noorCdnGit = { repoRoot: noorCdnRepoRoot, exists: existsSync(noorCdnRepoRoot) };
if (!noorCdnGit.exists) {
  requiredFailures.push('Local noor-cdn repository was not found at ../noor-cdn.');
  addGate(gates, 'noor-cdn-local-repo', 'Local noor-cdn repository exists beside NOOR', 'fail', noorCdnGit);
} else {
  git(noorCdnRepoRoot, ['fetch', 'origin', 'main', 'staging-ilm-mate-v1'], true);
  const branch = git(noorCdnRepoRoot, ['branch', '--show-current'], true);
  const statusShort = git(noorCdnRepoRoot, ['status', '--short'], true);
  const localStagingHead = git(noorCdnRepoRoot, ['rev-parse', '--short', 'staging-ilm-mate-v1'], true);
  const originStagingHead = git(noorCdnRepoRoot, ['rev-parse', '--short', 'origin/staging-ilm-mate-v1'], true);
  const originMainHead = git(noorCdnRepoRoot, ['rev-parse', '--short', 'origin/main'], true);
  const localCompare = splitCount(git(noorCdnRepoRoot, ['rev-list', '--left-right', '--count', 'main...staging-ilm-mate-v1'], true));
  const remoteCompare = splitCount(git(noorCdnRepoRoot, ['rev-list', '--left-right', '--count', 'origin/main...origin/staging-ilm-mate-v1'], true));
  noorCdnGit = {
    ...noorCdnGit,
    branch,
    clean: statusShort.length === 0,
    statusShort,
    localStagingHead,
    originStagingHead,
    originMainHead,
    localMainOnlyCommits: localCompare.left,
    localStagingOnlyCommits: localCompare.right,
    originMainOnlyCommits: remoteCompare.left,
    originStagingOnlyCommits: remoteCompare.right
  };
  addGate(gates, 'noor-cdn-clean', 'Local noor-cdn working tree is clean', noorCdnGit.clean ? 'pass' : 'fail', noorCdnGit);
  if (!noorCdnGit.clean) requiredFailures.push('Local noor-cdn working tree is not clean.');
  addGate(gates, 'noor-cdn-staging-ahead', 'noor-cdn staging has reviewed content not yet on main', noorCdnGit.originStagingOnlyCommits > 0 ? 'pass' : 'fail', noorCdnGit);
  if (!(noorCdnGit.originStagingOnlyCommits > 0)) requiredFailures.push('Remote staging branch is not ahead of noor-cdn/main; nothing to promote or already promoted.');
  addGate(gates, 'noor-cdn-main-not-ahead', 'noor-cdn/main is not ahead of staging', noorCdnGit.originMainOnlyCommits === 0 ? 'pass' : 'fail', noorCdnGit);
  if (noorCdnGit.originMainOnlyCommits !== 0) requiredFailures.push('Remote noor-cdn/main has commits not in staging. Resolve before promotion.');
}

const ready = requiredFailures.length === 0;
const plan = {
  sprint,
  title: 'Production CDN Promotion Plan',
  generatedAt: new Date().toISOString(),
  promotionStatus: ready ? 'ready_for_manual_noor_cdn_main_promotion' : 'blocked',
  productionPromotionAllowed: ready,
  promotionExecuted: false,
  noorCdnMainTouched: false,
  sourceBranch: 'noor-cdn/staging-ilm-mate-v1',
  targetBranch: 'noor-cdn/main',
  noorCdnGit,
  gates,
  requiredFailures,
  commands: {
    noorPrecheck: ['pnpm production:cdn-promotion-plan', 'pnpm check:production-cdn-promotion-plan'],
    noorCdnPromotion: [
      'cd "C:\\Users\\user\\Documents\\00 Combo3\\noor-cdn"',
      'git checkout staging-ilm-mate-v1',
      'git pull origin staging-ilm-mate-v1',
      'git checkout main',
      'git pull origin main',
      'git merge staging-ilm-mate-v1',
      'git push origin main'
    ],
    noorRecord: ['cd "C:\\Users\\user\\Documents\\00 Combo3\\Noor"', 'pnpm production:cdn-record-promotion', 'pnpm check:sprint27-14']
  },
  publicProductionBases: {
    githubPages: 'https://effortedutech.github.io/noor-cdn/noor-cdn',
    jsDelivr: 'https://cdn.jsdelivr.net/gh/EffortEdutech/noor-cdn@main/noor-cdn',
    rawGitHub: 'https://raw.githubusercontent.com/EffortEdutech/noor-cdn/main/noor-cdn'
  },
  safetyRules: [
    'Only promote noor-cdn/staging-ilm-mate-v1 into noor-cdn/main after this plan passes.',
    'Use a normal fast-forward merge when possible; do not force push noor-cdn/main.',
    'After pushing noor-cdn/main, return to NOOR and record the execution report.'
  ]
};

mkdirSync(outputRoot, { recursive: true });
writeFileSync(planJsonFile, `${JSON.stringify(plan, null, 2)}\n`, 'utf8');
writeFileSync(planMdFile, `# Sprint 27.14 — Production CDN Promotion Plan\n\nStatus: ${plan.promotionStatus}\n\nProduction promotion allowed: ${plan.productionPromotionAllowed}\n\nSource: ${plan.sourceBranch}\nTarget: ${plan.targetBranch}\n\n## Gates\n\n${gates.map((gate) => `- ${gate.status === 'pass' ? 'PASS' : 'FAIL'} — ${gate.title}`).join('\n')}\n\n## Required failures\n\n${requiredFailures.length ? requiredFailures.map((item) => `- ${item}`).join('\n') : '- None'}\n\n## Promotion commands\n\nRun these only after this plan passes.\n\n1. Open noor-cdn repo.\n2. Merge staging-ilm-mate-v1 into main.\n3. Push noor-cdn/main.\n4. Return to NOOR and record promotion.\n\nProduction base after promotion: ${plan.publicProductionBases.jsDelivr}\n`, 'utf8');

console.log(`NOOR Sprint 27.14 production CDN promotion plan generated. Status: ${plan.promotionStatus}.`);
if (requiredFailures.length) {
  console.log('Required failures:');
  for (const failure of requiredFailures) console.log(`- ${failure}`);
}
