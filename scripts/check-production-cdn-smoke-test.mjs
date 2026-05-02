import { existsSync, readFileSync } from 'node:fs';

const reportFile = 'content-pipeline/production-cdn/runtime-qa/production-cdn-smoke-test-report.json';
function fail(message) { console.error(message); process.exit(1); }
function readJson(file) { return JSON.parse(readFileSync(file, 'utf8')); }

if (!existsSync(reportFile)) fail(`Missing production CDN smoke test report: ${reportFile}. Run pnpm production:cdn-smoke-test.`);
const report = readJson(reportFile);

if (report.sprint !== '27.15') fail('Production CDN smoke test must declare Sprint 27.15.');
if (report.status !== 'production_runtime_passed') fail(`Production CDN smoke test must pass, got ${report.status}.`);
if (report.productionBranch !== 'noor-cdn/main') fail('Production CDN smoke test must target noor-cdn/main.');
if (report.requiredFailures?.length > 0) fail(`Production CDN required failures: ${report.requiredFailures.join('; ')}`);

const requiredBases = new Set(report.requiredBases ?? []);
for (const baseId of ['jsdelivr-main', 'raw-github-main']) {
  if (!requiredBases.has(baseId)) fail(`Missing required production base: ${baseId}.`);
}

for (const base of report.baseResults ?? []) {
  if (!base.required) continue;
  const failed = (base.checks ?? []).filter((check) => check.severity === 'required' && check.status !== 'pass');
  if (failed.length) fail(`${base.id} has failed required checks: ${failed.map((check) => check.id).join(', ')}`);
}

console.log('NOOR Sprint 27.15 production CDN smoke test check passed. Production @main runtime endpoints are reachable.');
