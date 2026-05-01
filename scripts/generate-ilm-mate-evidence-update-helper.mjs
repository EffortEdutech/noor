import path from 'node:path';
import {
  root,
  outputRoot,
  updateHelperRoot,
  recordsPath,
  VERSION,
  USER_EDITABLE_STATUSES,
  readJson,
  writeJson,
  writeText,
  summarize
} from './ilm-mate-evidence-record-utils.mjs';

const records = readJson(recordsPath);
const summary = summarize(records);
const helper = {
  id: 'noor-sprint27-1-ilm-mate-evidence-update-helper',
  version: VERSION,
  label: 'ilm-mate evidence record update helper',
  generatedAt: new Date().toISOString(),
  status: 'blocked',
  productionApproved: false,
  canPromoteToProduction: false,
  sourceRecords: path.relative(root, recordsPath).replaceAll('\\', '/'),
  outputRoot: path.relative(root, updateHelperRoot).replaceAll('\\', '/'),
  recordsRoot: path.relative(root, outputRoot).replaceAll('\\', '/'),
  allowedUpdateStatuses: USER_EDITABLE_STATUSES,
  recordCount: records.length,
  summary,
  commands: {
    generate: 'pnpm ilm:evidence-helper',
    listAll: 'pnpm ilm:evidence:list',
    listQuran: 'pnpm ilm:evidence:list -- --domain=quran',
    updateById: 'pnpm ilm:evidence:update -- --id=ilm-mate-v1-quran-source_identity-evidence-record --status=submitted --reviewer-name="Reviewer Name" --evidence-reference="Evidence reference"',
    updateByDomain: 'pnpm ilm:evidence:update -- --domain=quran --evidence-key=source_identity --status=under-review --reviewer-name="Reviewer Name"',
    validate: 'pnpm check:ilm-evidence-records && pnpm check:ilm-evidence-helper'
  },
  policy: {
    productionApprovalRecordsLocked: true,
    productionApproved: false,
    canPromoteToProduction: false,
    rule: 'Sprint 27.1 may update staging evidence records only. It must not approve production CDN publication.'
  }
};

writeJson(path.join(updateHelperRoot, 'evidence-update-helper.json'), helper);

const md = `# NOOR Sprint 27.1 — ilm-mate Evidence Record Update Helper\n\n` +
  `Generated: ${helper.generatedAt}\n\n` +
  `## Gate status\n\n` +
  `- Status: **${helper.status}**\n` +
  `- Production approved: **${helper.productionApproved}**\n` +
  `- Can promote to production: **${helper.canPromoteToProduction}**\n` +
  `- Evidence records: **${helper.recordCount}**\n\n` +
  `## Allowed update statuses\n\n` +
  USER_EDITABLE_STATUSES.map((status) => `- \`${status}\``).join('\n') +
  `\n\n## Common commands\n\n` +
  `\`\`\`powershell\n${Object.values(helper.commands).join('\n')}\n\`\`\`\n\n` +
  `## Policy\n\n${helper.policy.rule}\n`;
writeText(path.join(updateHelperRoot, 'evidence-update-helper.md'), md);

const examples = `# Sprint 27.1 Update Examples\n\n` +
  `## List records\n\n\`\`\`powershell\npnpm ilm:evidence:list\npnpm ilm:evidence:list -- --domain=quran\n\`\`\`\n\n` +
  `## Mark submitted\n\n\`\`\`powershell\npnpm ilm:evidence:update -- --domain=quran --evidence-key=source_identity --status=submitted --reviewer-name="Darya Malak" --reviewer-role="Founder" --evidence-reference="Source identity evidence received" --source-url-or-document="Local document / URL" --notes="Submitted for review"\n\`\`\`\n\n` +
  `## Mark under review\n\n\`\`\`powershell\npnpm ilm:evidence:update -- --domain=quran --evidence-key=source_identity --status=under-review --reviewer-name="Reviewer Name" --reviewer-role="Content Reviewer" --notes="Review started"\n\`\`\`\n\n` +
  `## Accept for staging\n\n\`\`\`powershell\npnpm ilm:evidence:update -- --domain=quran --evidence-key=source_identity --status=accepted-for-staging --reviewer-name="Reviewer Name" --reviewer-role="Scholarly Reviewer" --evidence-reference="QUR-SRC-001" --date-reviewed=2026-05-02 --notes="Accepted for staging only"\n\`\`\`\n\n` +
  `## Request more information\n\n\`\`\`powershell\npnpm ilm:evidence:update -- --domain=hadith --evidence-key=license_or_permission --status=needs-more-information --reviewer-name="Reviewer Name" --rejection-reason="License wording unclear"\n\`\`\`\n\n`;
writeText(path.join(updateHelperRoot, 'evidence-update-examples.md'), examples);

console.log('NOOR Sprint 27.1 ilm-mate evidence update helper generated.');
console.log(`Output: ${path.relative(root, updateHelperRoot)}`);
console.log(`Evidence records: ${records.length}`);
console.log(`Accepted for staging: ${summary.acceptedForStaging}`);
console.log('Status: blocked, productionApproved: false, canPromoteToProduction: false.');
