import { existsSync, readFileSync } from 'node:fs';

const planFile = 'content-pipeline/production-cdn/promotion-execution/noor-cdn-production-promotion-plan.json';

function fail(message) {
  console.error(message);
  process.exit(1);
}
function readJson(file) {
  return JSON.parse(readFileSync(file, 'utf8'));
}

if (!existsSync(planFile)) fail(`Missing Sprint 27.14 promotion plan: ${planFile}. Run pnpm production:cdn-promotion-plan.`);
const plan = readJson(planFile);

if (plan.sprint !== '27.14') fail('Promotion plan must declare Sprint 27.14.');
if (plan.promotionStatus !== 'ready_for_manual_noor_cdn_main_promotion') fail(`Promotion plan is not ready: ${plan.promotionStatus}`);
if (plan.productionPromotionAllowed !== true) fail('Promotion plan must allow production promotion.');
if (plan.promotionExecuted !== false || plan.noorCdnMainTouched !== false) fail('Promotion plan must not mark promotion as executed yet.');
if (plan.sourceBranch !== 'noor-cdn/staging-ilm-mate-v1') fail('Promotion source branch must be noor-cdn/staging-ilm-mate-v1.');
if (plan.targetBranch !== 'noor-cdn/main') fail('Promotion target branch must be noor-cdn/main.');
if (!Array.isArray(plan.gates) || plan.gates.some((gate) => gate.severity === 'required' && gate.status !== 'pass')) fail('All required promotion plan gates must pass.');
if (Array.isArray(plan.requiredFailures) && plan.requiredFailures.length > 0) fail(`Promotion plan still has required failures: ${plan.requiredFailures.join('; ')}`);
if (!(plan.noorCdnGit?.originStagingOnlyCommits > 0)) fail('Promotion plan must show staging branch has commits not yet on main.');
if (plan.noorCdnGit?.originMainOnlyCommits !== 0) fail('Promotion plan must show noor-cdn/main has no extra commits outside staging.');

console.log('NOOR Sprint 27.14 production CDN promotion plan check passed. Ready to promote noor-cdn/staging-ilm-mate-v1 into noor-cdn/main.');
