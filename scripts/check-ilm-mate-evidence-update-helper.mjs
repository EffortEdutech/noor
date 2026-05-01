import fs from 'node:fs';
import path from 'node:path';
import {
  root,
  updateHelperRoot,
  recordsPath,
  workflowPath,
  VERSION,
  readJson,
  validateRecords
} from './ilm-mate-evidence-record-utils.mjs';

function fail(message) {
  console.error(message);
  process.exit(1);
}
function mustExist(filePath) {
  if (!fs.existsSync(filePath)) fail(`Required Sprint 27.1 file missing: ${path.relative(root, filePath)}`);
}

const helperJsonPath = path.join(updateHelperRoot, 'evidence-update-helper.json');
const helperMdPath = path.join(updateHelperRoot, 'evidence-update-helper.md');
const examplesPath = path.join(updateHelperRoot, 'evidence-update-examples.md');

for (const file of [
  'scripts/ilm-mate-evidence-record-utils.mjs',
  'scripts/generate-ilm-mate-evidence-update-helper.mjs',
  'scripts/list-ilm-mate-evidence-records.mjs',
  'scripts/update-ilm-mate-evidence-record.mjs',
  'scripts/check-ilm-mate-evidence-update-helper.mjs',
  'apps/web/components/IlmMateEvidenceUpdateHelperCard.tsx',
  'docs/SPRINT_27_1_EVIDENCE_UPDATE_HELPER.md'
]) {
  mustExist(path.join(root, file));
}

mustExist(helperJsonPath);
mustExist(helperMdPath);
mustExist(examplesPath);
mustExist(recordsPath);
mustExist(workflowPath);

const helper = readJson(helperJsonPath);
const workflow = readJson(workflowPath);
const records = readJson(recordsPath);

if (helper.version !== VERSION) fail(`Expected Sprint 27.1 helper version ${VERSION}, got ${helper.version}`);
if (helper.productionApproved !== false || helper.canPromoteToProduction !== false) fail('Sprint 27.1 helper must not approve production promotion.');
if (helper.policy?.productionApprovalRecordsLocked !== true) fail('Sprint 27.1 helper must keep production approval records locked.');
if (!Array.isArray(helper.allowedUpdateStatuses) || helper.allowedUpdateStatuses.includes('blocked')) fail('User update statuses must not include blocked.');

validateRecords(records);

if (workflow.policy?.productionApproved !== false || workflow.policy?.canPromoteToProduction !== false) fail('Workflow policy must not allow production promotion.');
if (workflow.summary?.productionApproved !== false || workflow.summary?.canPromoteToProduction !== false) fail('Workflow summary must not allow production promotion.');

for (const record of records.filter((item) => item.evidenceKey === 'production_promotion_approval')) {
  if (record.completionStatus !== 'blocked' || record.submissionStatus !== 'blocked' || record.lockedByGate !== true) {
    fail(`Production promotion record must remain locked and blocked: ${record.id}`);
  }
}

console.log('NOOR Sprint 27.1 evidence update helper check passed.');
console.log(`Helper root: ${path.relative(root, updateHelperRoot)}`);
console.log(`Evidence records: ${records.length}`);
console.log('Status: blocked, productionApproved: false, canPromoteToProduction: false.');
