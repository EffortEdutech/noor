import {
  recordsPath,
  parseArgs,
  readJson,
  recordSummaryLine
} from './ilm-mate-evidence-record-utils.mjs';

const args = parseArgs();
const records = readJson(recordsPath)
  .filter((record) => !args.domain || record.domain === args.domain)
  .filter((record) => !args.status || record.completionStatus === args.status)
  .filter((record) => !args.evidence_key || record.evidenceKey === args.evidence_key);

if (args.json) {
  console.log(JSON.stringify(records, null, 2));
  process.exit(0);
}

console.log('NOOR ilm-mate evidence records');
console.log('id | domain | evidenceKey | completionStatus | reviewerDecision | accepted');
console.log('---');
for (const record of records) {
  console.log(recordSummaryLine(record));
}
console.log('---');
console.log(`Records shown: ${records.length}`);
console.log('Tip: update using pnpm ilm:evidence:update -- --id=<record-id> --status=submitted');
