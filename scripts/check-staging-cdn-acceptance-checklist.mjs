import fs from 'node:fs';
import path from 'node:path';
import { spawnSync } from 'node:child_process';

const root = process.cwd();
const reportPath = path.join(root, 'content-pipeline', 'review', 'ilm-mate-v1', 'staging-cdn-acceptance', 'staging-cdn-acceptance-report.json');

if (!fs.existsSync(reportPath)) {
  console.log('Sprint 27.10 acceptance report not found. Generating it now...');
  const result = spawnSync(process.execPath, [path.join(root, 'scripts', 'run-staging-cdn-acceptance-checklist.mjs')], {
    cwd: root,
    stdio: 'inherit',
  });
  if (result.status !== 0) process.exit(result.status ?? 1);
}

const report = JSON.parse(fs.readFileSync(reportPath, 'utf8'));
const requiredFailures = report.checks.filter((item) => item.severity === 'required' && item.status !== 'pass');

if (requiredFailures.length > 0) {
  console.error('NOOR Sprint 27.10 staging CDN acceptance check failed.');
  for (const failure of requiredFailures) {
    console.error(`- ${failure.id}: ${failure.title}`);
    const details = failure.details ?? {};
    for (const [key, value] of Object.entries(details).slice(0, 8)) {
      const rendered = typeof value === 'object' ? JSON.stringify(value).slice(0, 240) : String(value);
      console.error(`  ${key}: ${rendered}`);
    }
  }
  console.error('Production promotion remains blocked. Fix the failures and rerun pnpm cdn:staging-acceptance.');
  process.exit(1);
}

if (report.productionPromotion !== 'blocked') {
  console.error('NOOR Sprint 27.10 check failed: production promotion must remain blocked.');
  process.exit(1);
}

console.log('NOOR Sprint 27.10 staging CDN acceptance check passed.');
console.log(`Report: ${path.relative(root, reportPath)}`);
console.log('Staging accepted for reviewer/runtime testing only. Production CDN remains blocked.');
