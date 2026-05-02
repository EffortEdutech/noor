import { existsSync, readFileSync, writeFileSync } from 'node:fs';

const reportJsonFile = 'content-pipeline/production-cdn/runtime-qa/production-browser-qa-report.json';
const reportMdFile = 'content-pipeline/production-cdn/runtime-qa/production-browser-qa-report.md';
const checklistCsvFile = 'content-pipeline/production-cdn/runtime-qa/production-browser-qa-checklist.csv';

function fail(message) { console.error(message); process.exit(1); }
function argValue(name, fallback = '') {
  const index = process.argv.indexOf(name);
  return index >= 0 ? process.argv[index + 1] ?? fallback : fallback;
}
function hasArg(name) { return process.argv.includes(name); }
function toCsv(rows) {
  const header = ['id', 'title', 'severity', 'status', 'reviewer', 'reviewedAt', 'note'];
  const escape = (value) => `"${String(value ?? '').replace(/"/g, '""')}"`;
  return [header.join(','), ...rows.map((row) => header.map((key) => escape(row[key])).join(','))].join('\n') + '\n';
}
function updateSummary(report) {
  const required = report.tasks.filter((task) => task.severity === 'required');
  report.summary = {
    total: report.tasks.length,
    requiredTotal: required.length,
    requiredPassed: required.filter((task) => task.status === 'pass').length,
    requiredFailed: required.filter((task) => task.status === 'fail').length,
    requiredPending: required.filter((task) => task.status === 'pending').length
  };
  report.status = report.summary.requiredFailed === 0 && report.summary.requiredPending === 0
    ? 'accepted_for_production_browser_qa'
    : 'pending_browser_qa';
}

if (!existsSync(reportJsonFile)) fail(`Missing production browser QA report: ${reportJsonFile}. Run pnpm production:browser-qa.`);
const report = JSON.parse(readFileSync(reportJsonFile, 'utf8'));
const status = argValue('--status', 'pass');
if (!['pass', 'fail', 'pending'].includes(status)) fail('--status must be pass, fail or pending.');
const reviewer = argValue('--reviewer', 'Darya Malak');
const note = argValue('--note', 'Manual production browser QA completed.');
const reviewedAt = new Date().toISOString();

if (hasArg('--all')) {
  for (const task of report.tasks) Object.assign(task, { status, reviewer, note, reviewedAt });
} else {
  const id = argValue('--id', '');
  if (!id) fail('Pass --all or --id <task-id>.');
  const task = report.tasks.find((item) => item.id === id);
  if (!task) fail(`Unknown production browser QA task id: ${id}`);
  Object.assign(task, { status, reviewer, note, reviewedAt });
}

report.updatedAt = reviewedAt;
updateSummary(report);
writeFileSync(reportJsonFile, `${JSON.stringify(report, null, 2)}\n`, 'utf8');
writeFileSync(checklistCsvFile, toCsv(report.tasks), 'utf8');
writeFileSync(reportMdFile, `# Sprint 27.15 — Production Browser QA\n\nStatus: ${report.status}\n\nProduction branch: ${report.productionBranch}\n\nUpdated: ${report.updatedAt}\n\nSummary: ${report.summary.requiredPassed}/${report.summary.requiredTotal} required passed.\n\n## Tasks\n\n${report.tasks.map((task) => `- [${task.status === 'pass' ? 'x' : ' '}] ${task.id} — ${task.title} — ${task.status}${task.note ? ` — ${task.note}` : ''}`).join('\n')}\n`, 'utf8');

console.log(`NOOR Sprint 27.15 production browser QA updated. Status: ${report.status}.`);
