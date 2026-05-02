import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';

const sprint = '27.14';
const outputRoot = 'content-pipeline/production-cdn/promotion-execution';
const planFile = path.join(outputRoot, 'noor-cdn-production-promotion-plan.json');
const executionJsonFile = path.join(outputRoot, 'noor-cdn-production-promotion-execution.json');
const executionMdFile = path.join(outputRoot, 'noor-cdn-production-promotion-execution.md');
const noorCdnRepoRoot = path.normalize('../noor-cdn');

function readJson(file) { return JSON.parse(readFileSync(file, 'utf8')); }
function sh(args) { return execFileSync(args[0], args.slice(1), { encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] }).trim(); }
function git(repo, args, allowFail = false) {
  try { return sh(['git', '-C', repo, ...args]); } catch (error) { if (allowFail) return ''; throw error; }
}
function splitCount(value) {
  const [left = '0', right = '0'] = String(value).trim().split(/\s+/);
  return { left: Number(left), right: Number(right) };
}

const requiredFailures = [];
if (!existsSync(planFile)) requiredFailures.push('Promotion plan file missing. Run pnpm production:cdn-promotion-plan first.');
if (!existsSync(noorCdnRepoRoot)) requiredFailures.push('Local noor-cdn repository missing at ../noor-cdn.');

const plan = existsSync(planFile) ? readJson(planFile) : {};
if (plan.productionPromotionAllowed !== true) requiredFailures.push('Promotion plan was not approved for promotion.');

let noorCdnGit = { repoRoot: noorCdnRepoRoot, exists: existsSync(noorCdnRepoRoot) };
if (noorCdnGit.exists) {
  git(noorCdnRepoRoot, ['fetch', 'origin', 'main', 'staging-ilm-mate-v1'], true);
  const branch = git(noorCdnRepoRoot, ['branch', '--show-current'], true);
  const statusShort = git(noorCdnRepoRoot, ['status', '--short'], true);
  const localMainHead = git(noorCdnRepoRoot, ['rev-parse', '--short', 'main'], true);
  const localStagingHead = git(noorCdnRepoRoot, ['rev-parse', '--short', 'staging-ilm-mate-v1'], true);
  const originMainHead = git(noorCdnRepoRoot, ['rev-parse', '--short', 'origin/main'], true);
  const originStagingHead = git(noorCdnRepoRoot, ['rev-parse', '--short', 'origin/staging-ilm-mate-v1'], true);
  const localCompare = splitCount(git(noorCdnRepoRoot, ['rev-list', '--left-right', '--count', 'main...staging-ilm-mate-v1'], true));
  const remoteCompare = splitCount(git(noorCdnRepoRoot, ['rev-list', '--left-right', '--count', 'origin/main...origin/staging-ilm-mate-v1'], true));
  noorCdnGit = {
    ...noorCdnGit,
    branch,
    clean: statusShort.length === 0,
    statusShort,
    localMainHead,
    localStagingHead,
    originMainHead,
    originStagingHead
  };
  const mainContainsStaging = remoteCompare.right === 0;
  const mainExtraCommitsOutsideStaging = remoteCompare.left;
  noorCdnGit.comparison = {
    localMainOnlyCommits: localCompare.left,
    localStagingOnlyCommits: localCompare.right,
    originMainOnlyCommits: remoteCompare.left,
    stagingCommitsMissingFromMain: remoteCompare.right,
    mainContainsStaging
  };
  if (!noorCdnGit.clean) requiredFailures.push('Local noor-cdn working tree is not clean after promotion.');
  if (!mainContainsStaging) requiredFailures.push('origin/main does not yet contain all staging branch commits. Did you push noor-cdn/main?');
  if (mainExtraCommitsOutsideStaging > 0 && originMainHead !== originStagingHead) {
    // This can happen if main has a merge commit. It is okay as long as staging commits are included.
    noorCdnGit.note = 'origin/main has additional commits, but includes all staging commits.';
  }
}

const promotionExecuted = requiredFailures.length === 0;
const execution = {
  sprint,
  title: 'Production CDN Promotion Execution Record',
  generatedAt: new Date().toISOString(),
  promotionStatus: promotionExecuted ? 'production_promoted' : 'blocked_or_incomplete',
  productionPromotionAllowed: plan.productionPromotionAllowed === true,
  promotionExecuted,
  noorCdnMainTouched: promotionExecuted,
  sourceBranch: 'noor-cdn/staging-ilm-mate-v1',
  targetBranch: 'noor-cdn/main',
  promotionPlan: planFile,
  noorCdnGit,
  gitComparison: noorCdnGit.comparison ?? null,
  requiredFailures,
  publicProductionBases: {
    githubPages: 'https://effortedutech.github.io/noor-cdn/noor-cdn',
    jsDelivr: 'https://cdn.jsdelivr.net/gh/EffortEdutech/noor-cdn@main/noor-cdn',
    rawGitHub: 'https://raw.githubusercontent.com/EffortEdutech/noor-cdn/main/noor-cdn'
  },
  runtimeReminder: 'After production CDN is promoted, app environments may point External CDN to @main/noor-cdn. Keep bundled fallback enabled.'
};

mkdirSync(outputRoot, { recursive: true });
writeFileSync(executionJsonFile, `${JSON.stringify(execution, null, 2)}\n`, 'utf8');
writeFileSync(executionMdFile, `# Sprint 27.14 — Production CDN Promotion Execution\n\nStatus: ${execution.promotionStatus}\n\nPromotion executed: ${execution.promotionExecuted}\n\nSource: ${execution.sourceBranch}\nTarget: ${execution.targetBranch}\n\nnoor-cdn origin/main: ${execution.noorCdnGit.originMainHead ?? 'unknown'}\nnoor-cdn origin/staging-ilm-mate-v1: ${execution.noorCdnGit.originStagingHead ?? 'unknown'}\n\n## Required failures\n\n${requiredFailures.length ? requiredFailures.map((item) => `- ${item}`).join('\n') : '- None'}\n\n## Production bases\n\n- GitHub Pages: ${execution.publicProductionBases.githubPages}\n- jsDelivr: ${execution.publicProductionBases.jsDelivr}\n- Raw GitHub: ${execution.publicProductionBases.rawGitHub}\n`, 'utf8');

console.log(`NOOR Sprint 27.14 production CDN promotion execution recorded. Status: ${execution.promotionStatus}.`);
if (requiredFailures.length) {
  console.log('Required failures:');
  for (const failure of requiredFailures) console.log(`- ${failure}`);
}
