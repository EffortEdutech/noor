import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname } from 'node:path';

const TEMPLATE_ROOT = 'content-pipeline/source-intake/templates';
const REGISTRY_PATH = 'content-pipeline/source-intake/noor-source-candidates.json';
const SCHEMA_PATH = 'content-pipeline/schemas/noor-source-intake.schema.json';
const AUDIT_JSON = 'content-pipeline/source-intake/audit/noor-source-intake-audit.json';
const AUDIT_MD = 'content-pipeline/source-intake/audit/noor-source-intake-audit.md';

const REQUIRED_DOMAINS = ['quran', 'tafseer', 'hadith'];
const REQUIRED_FIELDS = [
  'id',
  'domain',
  'title',
  'language',
  'sourceType',
  'sourceUrl',
  'licenseStatus',
  'attributionText',
  'reviewerRequired',
  'approvalStatus',
  'importReadiness'
];
const REQUIRED_GATE_ITEMS = [
  'Source URL or source file path recorded',
  'License status approved for redistribution',
  'Attribution wording approved',
  'Checksum/import plan recorded',
  'Reviewer role assigned',
  'Scholar/reviewer sign-off recorded',
  'approvalStatus set to production-approved only after manual review'
];
const TEMPLATE_FILES = [
  `${TEMPLATE_ROOT}/quran-source-intake.template.json`,
  `${TEMPLATE_ROOT}/tafseer-source-intake.template.json`,
  `${TEMPLATE_ROOT}/hadith-source-intake.template.json`
];

function fail(message) {
  console.error(message);
  process.exit(1);
}

function readJson(path) {
  if (!existsSync(path)) fail(`Source intake file missing: ${path}`);
  try {
    return JSON.parse(readFileSync(path, 'utf8'));
  } catch (error) {
    fail(`Could not parse JSON at ${path}: ${error instanceof Error ? error.message : String(error)}`);
  }
}

function unique(values) {
  return [...new Set(values)];
}

for (const file of [...TEMPLATE_FILES, REGISTRY_PATH, SCHEMA_PATH]) {
  if (!existsSync(file)) fail(`Source intake file missing: ${file}`);
}

const schema = readJson(SCHEMA_PATH);
for (const field of REQUIRED_FIELDS) {
  if (!schema.required?.includes(field)) {
    fail(`Source intake schema must require ${field}.`);
  }
}

const templateReports = TEMPLATE_FILES.map((file) => {
  const template = readJson(file);
  const missingFields = REQUIRED_FIELDS.filter((field) => !Object.prototype.hasOwnProperty.call(template, field));
  if (missingFields.length > 0) {
    fail(`${file} is missing required fields: ${missingFields.join(', ')}`);
  }
  if (!REQUIRED_DOMAINS.includes(template.domain)) {
    fail(`${file} has invalid domain: ${template.domain}`);
  }
  if (template.approvalStatus === 'production-approved') {
    fail(`${file} must not be production-approved. Templates are intake examples only.`);
  }
  return {
    file,
    id: template.id,
    domain: template.domain,
    sourceType: template.sourceType,
    approvalStatus: template.approvalStatus
  };
});

const templateDomains = unique(templateReports.map((template) => template.domain));
for (const domain of REQUIRED_DOMAINS) {
  if (!templateDomains.includes(domain)) {
    fail(`Source intake templates are missing required domain: ${domain}`);
  }
}

const registry = readJson(REGISTRY_PATH);
if (!Array.isArray(registry.candidateSources) || registry.candidateSources.length === 0) {
  fail('Source candidate registry must include candidateSources.');
}

for (const domain of REQUIRED_DOMAINS) {
  if (!registry.requiredDomains?.includes(domain)) {
    fail(`Source candidate registry requiredDomains must include ${domain}.`);
  }
}

for (const gateItem of REQUIRED_GATE_ITEMS) {
  if (!registry.productionGate?.includes(gateItem)) {
    fail(`Source candidate registry productionGate must include: ${gateItem}`);
  }
}

const issues = [];
const candidateReports = registry.candidateSources.map((candidate) => {
  const missingFields = REQUIRED_FIELDS.filter((field) => !Object.prototype.hasOwnProperty.call(candidate, field));
  if (missingFields.length > 0) {
    issues.push(`${candidate.id ?? 'unknown-candidate'} missing fields: ${missingFields.join(', ')}`);
  }
  if (!REQUIRED_DOMAINS.includes(candidate.domain)) {
    issues.push(`${candidate.id ?? 'unknown-candidate'} has invalid domain: ${candidate.domain}`);
  }
  if (candidate.approvalStatus === 'production-approved') {
    const approvedLicense = ['approved', 'redistribution-approved', 'public-domain', 'permitted'].includes(candidate.licenseStatus);
    if (!approvedLicense) issues.push(`${candidate.id} is production-approved but licenseStatus is ${candidate.licenseStatus}.`);
    if (!candidate.attributionText || candidate.attributionText === 'TBD before import.' || candidate.attributionText === 'TBD') {
      issues.push(`${candidate.id} is production-approved but attributionText is not ready.`);
    }
  }
  return {
    id: candidate.id,
    domain: candidate.domain,
    title: candidate.title,
    sourceType: candidate.sourceType,
    licenseStatus: candidate.licenseStatus,
    approvalStatus: candidate.approvalStatus,
    importReadiness: candidate.importReadiness,
    reviewerRequired: Boolean(candidate.reviewerRequired),
    productionApproved: candidate.approvalStatus === 'production-approved'
  };
});

const candidateDomains = unique(candidateReports.map((candidate) => candidate.domain));
for (const domain of REQUIRED_DOMAINS) {
  if (!candidateDomains.includes(domain)) {
    issues.push(`Source candidate registry is missing required domain: ${domain}`);
  }
}

if (issues.length > 0) {
  fail(`Source intake validation failed:\n- ${issues.join('\n- ')}`);
}

const blockedCandidates = candidateReports.filter((candidate) => !candidate.productionApproved);
const report = {
  id: 'noor-source-intake-audit-v0.19',
  generatedAt: new Date().toISOString(),
  registryPath: REGISTRY_PATH,
  schemaPath: SCHEMA_PATH,
  templateRoot: TEMPLATE_ROOT,
  registryId: registry.id,
  registryVersion: registry.version,
  registryStatus: registry.status,
  requiredDomains: REQUIRED_DOMAINS,
  domains: candidateDomains,
  templateCount: templateReports.length,
  candidateCount: candidateReports.length,
  productionApprovedCount: candidateReports.filter((candidate) => candidate.productionApproved).length,
  blockedCandidateCount: blockedCandidates.length,
  productionGate: registry.productionGate,
  templates: templateReports,
  candidates: candidateReports
};

mkdirSync(dirname(AUDIT_JSON), { recursive: true });
writeFileSync(AUDIT_JSON, `${JSON.stringify(report, null, 2)}\n`, 'utf8');

const markdown = `# NOOR Source Intake Audit

Generated: ${report.generatedAt}

## Summary

- Registry: \`${report.registryPath}\`
- Registry status: \`${report.registryStatus}\`
- Templates checked: ${report.templateCount}
- Candidate sources checked: ${report.candidateCount}
- Production approved candidates: ${report.productionApprovedCount}
- Blocked / draft candidates: ${report.blockedCandidateCount}
- Required domains: ${REQUIRED_DOMAINS.map((domain) => `\`${domain}\``).join(', ')}

## Templates

| Template | Domain | Source type | Approval |
| --- | --- | --- | --- |
${templateReports.map((template) => `| ${template.id} | ${template.domain} | ${template.sourceType} | ${template.approvalStatus} |`).join('\n')}

## Candidate Sources

| Candidate | Domain | Source type | License | Approval | Import readiness |
| --- | --- | --- | --- | --- | --- |
${candidateReports.map((candidate) => `| ${candidate.id} | ${candidate.domain} | ${candidate.sourceType} | ${candidate.licenseStatus} | ${candidate.approvalStatus} | ${candidate.importReadiness} |`).join('\n')}

## Production Gate

${registry.productionGate.map((item) => `- ${item}`).join('\n')}

## Decision

Sprint 19 is an intake stage only. Candidate sources remain draft records until licensing, attribution, checksum/import planning and reviewer sign-off are complete.
`;

writeFileSync(AUDIT_MD, markdown, 'utf8');

console.log(`NOOR source intake validation passed: ${templateReports.length} templates, ${candidateReports.length} candidates.`);
console.log(`Wrote ${AUDIT_JSON}`);
console.log(`Wrote ${AUDIT_MD}`);
