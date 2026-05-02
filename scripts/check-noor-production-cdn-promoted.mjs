import { existsSync, readFileSync } from 'node:fs';
import { execFileSync } from 'node:child_process';

const executionFile = 'content-pipeline/production-cdn/promotion-execution/noor-cdn-production-promotion-execution.json';
const noorCdnRepoRoot = '../noor-cdn';

function fail(message) {
  console.error(message);
  process.exit(1);
}
function readJson(file) { return JSON.parse(readFileSync(file, 'utf8')); }
function sh(args) { return execFileSync(args[0], args.slice(1), { encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] }).trim(); }
function git(repo, args, allowFail = false) {
  try { return sh(['git', '-C', repo, ...args]); } catch (error) { if (allowFail) return ''; throw error; }
}
function splitCount(value) {
  const [left = '0', right = '0'] = String(value).trim().split(/\s+/);
  return { left: Number(left), right: Number(right) };
}

if (!existsSync(executionFile)) fail(`Missing Sprint 27.14 production execution file: ${executionFile}. Run pnpm production:cdn-record-promotion.`);
const execution = readJson(executionFile);

if (execution.sprint !== '27.14') fail('Promotion execution file must declare Sprint 27.14.');
if (execution.promotionStatus !== 'production_promoted') fail(`Promotion execution status must be production_promoted, got ${execution.promotionStatus}.`);
if (execution.promotionExecuted !== true) fail('Promotion execution must be true.');
if (execution.noorCdnMainTouched !== true) fail('Promotion execution must record that noor-cdn/main was touched.');
if (execution.sourceBranch !== 'noor-cdn/staging-ilm-mate-v1') fail('Unexpected production promotion source branch.');
if (execution.targetBranch !== 'noor-cdn/main') fail('Unexpected production promotion target branch.');
if (execution.requiredFailures?.length > 0) fail(`Promotion execution has required failures: ${execution.requiredFailures.join('; ')}`);
if (execution.gitComparison?.stagingCommitsMissingFromMain !== 0) fail('Execution report says staging commits are still missing from noor-cdn/main.');

if (existsSync(noorCdnRepoRoot)) {
  git(noorCdnRepoRoot, ['fetch', 'origin', 'main', 'staging-ilm-mate-v1'], true);
  const compare = splitCount(git(noorCdnRepoRoot, ['rev-list', '--left-right', '--count', 'origin/main...origin/staging-ilm-mate-v1'], true));
  if (compare.right !== 0) fail('Live noor-cdn origin/main still does not contain all staging commits.');
}

if (!String(execution.publicProductionBases?.jsDelivr ?? '').includes('@main/noor-cdn')) fail('Production jsDelivr base must point to @main/noor-cdn.');

console.log('NOOR Sprint 27.14 production CDN promoted check passed. noor-cdn/main contains the approved staging content.');
