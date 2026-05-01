import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const outputRoot = path.join(root, 'content-pipeline', 'review', 'ilm-mate-v1', 'evidence-intake');
const packPath = path.join(outputRoot, 'evidence-intake-pack.json');
const formsPath = path.join(outputRoot, 'reviewer-submission-forms.json');
const readinessPath = path.join(root, 'content-pipeline', 'review', 'ilm-mate-v1', 'promotion-readiness', 'promotion-readiness-report.json');
const VERSION = '0.26.9';

function fail(message) {
  console.error(message);
  process.exit(1);
}

function readJson(filePath) {
  if (!fs.existsSync(filePath)) fail(`Required file missing: ${path.relative(root, filePath)}`);
  return JSON.parse(fs.readFileSync(filePath, 'utf8'));
}

const readiness = readJson(readinessPath);
const pack = readJson(packPath);
const forms = readJson(formsPath);

if (pack.version !== VERSION) fail(`Expected evidence intake version ${VERSION}, got ${pack.version}`);
if (pack.policy?.status !== 'blocked') fail('Evidence intake policy status must remain blocked.');
if (pack.policy?.productionApproved !== false) fail('Evidence intake must not set productionApproved=true.');
if (pack.policy?.canPromoteToProduction !== false) fail('Evidence intake must not allow production promotion.');
if (!Array.isArray(forms)) fail('reviewer-submission-forms.json must contain an array.');
if (forms.length !== 18) fail(`Expected 18 evidence forms, got ${forms.length}.`);
if (pack.summary?.domains !== 3) fail(`Expected 3 domains, got ${pack.summary?.domains}.`);
if (pack.summary?.evidenceForms !== forms.length) fail('Pack evidenceForms summary does not match forms length.');
if (readiness.policy?.canPromoteToProduction !== false) fail('Source readiness report unexpectedly allows production promotion.');

const domains = new Set(forms.map((form) => form.domain));
for (const domain of ['quran', 'tafseer', 'hadith']) {
  if (!domains.has(domain)) fail(`Missing evidence forms for domain: ${domain}`);
  const templatePath = path.join(outputRoot, 'templates', `${domain}-evidence-submission-template.md`);
  if (!fs.existsSync(templatePath)) fail(`Missing reviewer template: ${path.relative(root, templatePath)}`);
  const domainForms = forms.filter((form) => form.domain === domain);
  if (domainForms.length !== 6) fail(`Expected 6 evidence forms for ${domain}, got ${domainForms.length}.`);
}

const disallowed = forms.filter((form) => form.productionApproved === true || form.canApproveProduction === true || form.reviewerDecision === 'approved-for-production');
if (disallowed.length > 0) fail('Evidence intake contains disallowed production approval state.');

const checklistPath = path.join(outputRoot, 'templates', 'all-domains-evidence-checklist.md');
if (!fs.existsSync(checklistPath)) fail('Missing all-domains evidence checklist.');

console.log('NOOR Sprint 26.9 ilm-mate evidence intake check passed.');
console.log(`Evidence intake root: ${path.relative(root, outputRoot)}`);
console.log(`Evidence forms: ${forms.length}`);
console.log(`Domains: ${Array.from(domains).join(', ')}`);
console.log('Status: blocked, productionApproved: false, canPromoteToProduction: false.');
