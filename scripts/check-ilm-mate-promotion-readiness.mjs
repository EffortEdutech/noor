import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const outputRoot = path.join(root, 'content-pipeline', 'review', 'ilm-mate-v1', 'promotion-readiness');
const reportPath = path.join(outputRoot, 'promotion-readiness-report.json');

function fail(message) {
  console.error(message);
  process.exit(1);
}

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, 'utf8'));
}

if (!fs.existsSync(reportPath)) {
  fail('Missing promotion readiness report. Run pnpm ilm:promotion-readiness first.');
}

const report = readJson(reportPath);

if (report.version !== '0.26.8') {
  fail(`Expected Sprint 26.8 report version 0.26.8, found: ${report.version}`);
}

if (report.policy?.productionGateStatus !== 'blocked') {
  fail('Promotion readiness gate must remain blocked.');
}

if (report.policy?.productionApproved !== false) {
  fail('Promotion readiness report must keep productionApproved=false.');
}

if (report.policy?.canPromoteToProduction !== false) {
  fail('Promotion readiness report must keep canPromoteToProduction=false.');
}

const domains = Array.isArray(report.domainReadiness) ? report.domainReadiness : [];
const requiredDomains = ['quran', 'tafseer', 'hadith'];

for (const domain of requiredDomains) {
  const item = domains.find((candidate) => candidate.domain === domain);
  if (!item) {
    fail(`Missing domain readiness entry: ${domain}`);
  }

  if (item.productionApproved !== false) {
    fail(`Domain ${domain} must keep productionApproved=false.`);
  }

  if (item.canPromoteToProduction !== false) {
    fail(`Domain ${domain} must keep canPromoteToProduction=false.`);
  }

  if (!Array.isArray(item.requiredEvidence) || item.requiredEvidence.length < 6) {
    fail(`Domain ${domain} must keep the full evidence checklist.`);
  }

  const productionApproval = item.requiredEvidence.find((evidence) => evidence.key === 'production_promotion_approval');
  if (!productionApproval || productionApproval.status !== 'blocked') {
    fail(`Domain ${domain} production promotion approval must remain blocked.`);
  }
}

const expectedFiles = [
  'promotion-readiness-report.json',
  'promotion-readiness-report.md',
  'promotion-readiness-domains.csv',
  'promotion-readiness-evidence.csv'
];

for (const file of expectedFiles) {
  const filePath = path.join(outputRoot, file);
  if (!fs.existsSync(filePath)) {
    fail(`Missing promotion readiness output file: ${file}`);
  }
}

console.log('NOOR Sprint 26.8 ilm-mate promotion readiness check passed.');
console.log(`Promotion readiness root: ${path.relative(root, outputRoot)}`);
console.log(`Domain readiness entries: ${domains.length}`);
console.log(`Missing evidence: ${report.summary?.missingEvidence}`);
console.log('Status: blocked, productionApproved: false, canPromoteToProduction: false.');
