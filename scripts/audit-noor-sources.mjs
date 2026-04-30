import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname } from 'node:path';

const REGISTRY_PATH = 'content-pipeline/source/noor-demo-v0.12/manifest/noor-source-registry.json';
const AUDIT_JSON = 'content-pipeline/audit/noor-source-audit.json';
const AUDIT_MD = 'content-pipeline/audit/noor-source-audit.md';
const REQUIRED_DOMAINS = ['quran', 'tafseer', 'hadith'];
const REQUIRED_PRODUCTION_GATE_ITEMS = [
  'Verified text source',
  'Clear redistribution license or internal permission',
  'Attribution label approved',
  'Import transform checked',
  'Content validator passes',
  'Scholar/reviewer sign-off recorded'
];

const requireProduction = process.argv.includes('--require-production');

function fail(message) {
  console.error(message);
  process.exit(1);
}

function readJson(path) {
  if (!existsSync(path)) fail(`Source registry missing: ${path}`);

  try {
    return JSON.parse(readFileSync(path, 'utf8'));
  } catch (error) {
    fail(`Could not parse JSON at ${path}: ${error instanceof Error ? error.message : String(error)}`);
  }
}

function unique(values) {
  return [...new Set(values)];
}

const registry = readJson(REGISTRY_PATH);
if (!Array.isArray(registry.sources) || registry.sources.length === 0) {
  fail('Source registry must contain at least one source.');
}

const domains = unique(registry.sources.map((source) => source.domain));
const missingDomains = REQUIRED_DOMAINS.filter((domain) => !domains.includes(domain));
if (missingDomains.length > 0) {
  fail(`Source registry is missing required domains: ${missingDomains.join(', ')}`);
}

for (const item of REQUIRED_PRODUCTION_GATE_ITEMS) {
  if (!registry.productionGate?.includes(item)) {
    fail(`Source registry productionGate must include: ${item}`);
  }
}

const issues = [];
const sources = registry.sources.map((source) => {
  const missingFields = ['id', 'domain', 'stage', 'licenseStatus', 'approvalStatus', 'notes'].filter(
    (field) => !source[field]
  );

  if (missingFields.length > 0) {
    issues.push(`${source.id ?? 'unknown-source'} missing fields: ${missingFields.join(', ')}`);
  }

  const productionApproved = source.approvalStatus === 'production-approved';
  const licenseApproved = ['approved', 'redistribution-approved', 'public-domain', 'permitted'].includes(
    source.licenseStatus
  );

  if (productionApproved && !licenseApproved) {
    issues.push(`${source.id} is production-approved but licenseStatus is ${source.licenseStatus}.`);
  }

  return {
    id: source.id,
    domain: source.domain,
    stage: source.stage,
    licenseStatus: source.licenseStatus,
    approvalStatus: source.approvalStatus,
    productionApproved,
    licenseApproved,
    blockedReason: productionApproved ? null : 'not-production-approved'
  };
});

if (issues.length > 0) {
  fail(`Source governance audit failed:\n- ${issues.join('\n- ')}`);
}

const blockedSources = sources.filter((source) => !source.productionApproved);
const demoOnlySources = sources.filter((source) => String(source.licenseStatus).includes('demo'));

const report = {
  id: 'noor-source-audit-v0.17',
  generatedAt: new Date().toISOString(),
  registryPath: REGISTRY_PATH,
  registryId: registry.id,
  registryVersion: registry.version,
  registryStatus: registry.status,
  sourceCount: sources.length,
  requiredDomains: REQUIRED_DOMAINS,
  domains,
  productionBlocked: blockedSources.length > 0,
  blockedSourceCount: blockedSources.length,
  demoOnlySourceCount: demoOnlySources.length,
  gateMode: requireProduction ? 'require-production' : 'audit-only',
  productionGate: registry.productionGate,
  sources
};

mkdirSync(dirname(AUDIT_JSON), { recursive: true });
writeFileSync(AUDIT_JSON, `${JSON.stringify(report, null, 2)}\n`, 'utf8');

const markdown = `# NOOR Source Governance Audit

Generated: ${report.generatedAt}

## Summary

- Registry: \`${report.registryPath}\`
- Registry status: \`${report.registryStatus}\`
- Sources checked: ${report.sourceCount}
- Required domains: ${REQUIRED_DOMAINS.map((domain) => `\`${domain}\``).join(', ')}
- Demo-only sources: ${report.demoOnlySourceCount}
- Production blocked: **${report.productionBlocked ? 'YES' : 'NO'}**
- Gate mode: \`${report.gateMode}\`

## Sources

| Source | Domain | Stage | License | Approval | Production |
| --- | --- | --- | --- | --- | --- |
${sources
  .map(
    (source) =>
      `| ${source.id} | ${source.domain} | ${source.stage} | ${source.licenseStatus} | ${source.approvalStatus} | ${source.productionApproved ? 'approved' : 'blocked'} |`
  )
  .join('\n')}

## Production Gate

${registry.productionGate.map((item) => `- ${item}`).join('\n')}

## Decision

${report.productionBlocked
  ? 'This content pack must remain pre-production/demo until all source records are approved.'
  : 'All sources are marked production-approved. Proceed only after manual reviewer confirmation.'}
`;

writeFileSync(AUDIT_MD, markdown, 'utf8');

if (requireProduction && report.productionBlocked) {
  fail(
    `NOOR production source gate blocked ${blockedSources.length} source(s). Audit files were generated in content-pipeline/audit/.`
  );
}

console.log(
  `NOOR source governance audit passed: ${sources.length} sources checked, ${blockedSources.length} blocked from production.`
);
console.log(`Wrote ${AUDIT_JSON}`);
console.log(`Wrote ${AUDIT_MD}`);
