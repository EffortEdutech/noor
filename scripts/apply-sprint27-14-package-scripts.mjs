import { readFileSync, writeFileSync } from 'node:fs';

function readJson(file) {
  return JSON.parse(readFileSync(file, 'utf8'));
}

function writeJson(file, value) {
  writeFileSync(file, `${JSON.stringify(value, null, 2)}\n`, 'utf8');
}

function addAfter(source, anchor, insertion) {
  if (source.includes(insertion.trim())) return source;
  if (!source.includes(anchor)) {
    throw new Error(`Unable to patch file. Missing anchor: ${anchor}`);
  }
  return source.replace(anchor, `${anchor}${insertion}`);
}

const pkgFile = 'package.json';
const pkg = readJson(pkgFile);
pkg.scripts = pkg.scripts ?? {};
const scriptsToAdd = {
  'production:cdn-promotion-plan': 'node scripts/generate-noor-production-cdn-promotion-plan.mjs',
  'check:production-cdn-promotion-plan': 'node scripts/check-noor-production-cdn-promotion-plan.mjs',
  'production:cdn-record-promotion': 'node scripts/record-noor-production-cdn-promotion.mjs',
  'check:production-cdn-promoted': 'node scripts/check-noor-production-cdn-promoted.mjs',
  'check:sprint27-14': 'pnpm check:sprint27-13 && pnpm check:production-cdn-promotion-plan && pnpm check:production-cdn-promoted && pnpm check:pack'
};
for (const [name, command] of Object.entries(scriptsToAdd)) {
  pkg.scripts[name] = command;
}
writeJson(pkgFile, pkg);

const checkPackFile = 'scripts/check-noor-pack.mjs';
let checkPack = readFileSync(checkPackFile, 'utf8').replace(/\r\n/g, '\n');

checkPack = checkPack.replace('Missing required NOOR Sprint 0-27.12 files:', 'Missing required NOOR Sprint 0-27.14 files:');
checkPack = checkPack.replace('NOOR Sprint 0-27.13 pack check passed.', 'NOOR Sprint 0-27.14 pack check passed.');

checkPack = addAfter(
  checkPack,
  "  'docs/SPRINT_27_13_PRODUCTION_CDN_APPROVAL_GATE.md',\n",
  "  'docs/SPRINT_27_14_PRODUCTION_CDN_PROMOTION.md',\n"
);

checkPack = addAfter(
  checkPack,
  "  'scripts/check-production-cdn-approval-gate.mjs',\n",
  "  'scripts/generate-noor-production-cdn-promotion-plan.mjs',\n  'scripts/check-noor-production-cdn-promotion-plan.mjs',\n  'scripts/record-noor-production-cdn-promotion.mjs',\n  'scripts/check-noor-production-cdn-promoted.mjs',\n  'scripts/apply-sprint27-14-package-scripts.mjs',\n"
);

checkPack = addAfter(
  checkPack,
  "  'content-pipeline/production-cdn/approval-gate/noor-production-cdn-approval-gate.md',\n",
  "  'content-pipeline/production-cdn/promotion-execution/noor-cdn-production-promotion-plan.json',\n  'content-pipeline/production-cdn/promotion-execution/noor-cdn-production-promotion-plan.md',\n  'content-pipeline/production-cdn/promotion-execution/noor-cdn-production-promotion-execution.json',\n  'content-pipeline/production-cdn/promotion-execution/noor-cdn-production-promotion-execution.md',\n"
);

checkPack = addAfter(
  checkPack,
  "  'check:sprint27-13'\n]) {\n",
  "  , 'production:cdn-promotion-plan'\n  , 'check:production-cdn-promotion-plan'\n  , 'production:cdn-record-promotion'\n  , 'check:production-cdn-promoted'\n  , 'check:sprint27-14'\n"
);

const executionValidation = `
const productionExecution = readJson('content-pipeline/production-cdn/promotion-execution/noor-cdn-production-promotion-execution.json');
if (productionExecution.sprint !== '27.14') fail('Sprint 27.14 production CDN execution file must declare sprint 27.14.');
if (productionExecution.promotionStatus !== 'production_promoted') fail('Sprint 27.14 production CDN execution must be production_promoted.');
if (productionExecution.promotionExecuted !== true || productionExecution.noorCdnMainTouched !== true) {
  fail('Sprint 27.14 must record that noor-cdn/main was touched and promoted.');
}
if (productionExecution.sourceBranch !== 'noor-cdn/staging-ilm-mate-v1') fail('Sprint 27.14 source branch must be noor-cdn/staging-ilm-mate-v1.');
if (productionExecution.targetBranch !== 'noor-cdn/main') fail('Sprint 27.14 target branch must be noor-cdn/main.');
if (productionExecution.requiredFailures?.length > 0) fail('Sprint 27.14 production execution must have no required failures.');
if (productionExecution.gitComparison?.stagingCommitsMissingFromMain !== 0) fail('noor-cdn/main must contain all staging branch commits.');
`;

if (!checkPack.includes("const productionExecution = readJson('content-pipeline/production-cdn/promotion-execution/noor-cdn-production-promotion-execution.json')")) {
  checkPack = checkPack.replace(
    "const stagingAcceptance = readJson('content-pipeline/review/ilm-mate-v1/staging-cdn-acceptance/staging-cdn-acceptance-report.json');",
    `${executionValidation}\nconst stagingAcceptance = readJson('content-pipeline/review/ilm-mate-v1/staging-cdn-acceptance/staging-cdn-acceptance-report.json');`
  );
}

writeFileSync(checkPackFile, checkPack, 'utf8');

console.log('Sprint 27.14 package scripts and pack validation added.');
for (const name of Object.keys(scriptsToAdd)) console.log(`Added/updated: pnpm ${name}`);

