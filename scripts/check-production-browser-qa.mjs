import { existsSync, readFileSync } from 'node:fs';

const reportFile = 'content-pipeline/production-cdn/runtime-qa/production-browser-qa-report.json';
function fail(message) { console.error(message); process.exit(1); }
function readJson(file) { return JSON.parse(readFileSync(file, 'utf8')); }

if (!existsSync(reportFile)) fail(`Missing production browser QA report: ${reportFile}. Run pnpm production:browser-qa and update it after manual checks.`);
const report = readJson(reportFile);

if (report.sprint !== '27.15') fail('Production browser QA report must declare Sprint 27.15.');
if (report.status !== 'accepted_for_production_browser_qa') fail(`Production browser QA must be accepted, got ${report.status}.`);
if (report.productionBranch !== 'noor-cdn/main') fail('Production browser QA must target noor-cdn/main.');
if ((report.summary?.requiredFailed ?? 0) !== 0) fail('Production browser QA has failed required tasks.');
if ((report.summary?.requiredPending ?? 0) !== 0) fail('Production browser QA has pending required tasks.');

const requiredTasks = ['settings-production-cdn', 'quran-index-production', 'tafseer-production-library', 'hadith-production-library', 'explore-production-search'];
for (const id of requiredTasks) {
  const task = report.tasks?.find((item) => item.id === id);
  if (!task || task.status !== 'pass') fail(`Missing passed production browser QA task: ${id}.`);
}

console.log('NOOR Sprint 27.15 production browser QA check passed. Production browser QA accepted.');
