import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import path from 'node:path';

const VERSION = '0.24.0';
const registryFile = 'content-pipeline/review/noor-scholarly-review-console.json';
const auditRoot = 'content-pipeline/review/audit';
const auditJsonFile = path.join(auditRoot, 'noor-scholarly-review-audit.json');
const auditMdFile = path.join(auditRoot, 'noor-scholarly-review-audit.md');

function readJson(file) {
  return JSON.parse(readFileSync(file, 'utf8'));
}

function fail(message) {
  console.error(message);
  process.exit(1);
}

const registry = readJson(registryFile);
if (registry.version !== VERSION) fail(`Review console registry must use version ${VERSION}.`);

const cases = Array.isArray(registry.reviewCases) ? registry.reviewCases : [];
const requiredDomains = ['quran', 'tafseer', 'hadith'];
const domains = new Set(cases.map((item) => item.domain));
for (const domain of requiredDomains) {
  if (!domains.has(domain)) fail(`Review console missing ${domain} review case.`);
}

const blockedCases = cases.filter((item) => item.approvalStatus !== 'approved').map((item) => item.id);
const approvedCases = cases.filter((item) => item.approvalStatus === 'approved');
const productionPromotionAllowed = approvedCases.length === cases.length && cases.length === requiredDomains.length;

const audit = {
  version: VERSION,
  generatedAt: new Date().toISOString(),
  source: registryFile,
  consoleId: registry.consoleId,
  gateStatus: productionPromotionAllowed ? 'approved' : 'blocked',
  productionPromotionAllowed,
  caseCount: cases.length,
  domains: requiredDomains,
  blockedCases,
  requiredEvidence: registry.reviewCases?.[0]?.requiredEvidence ?? [],
  notes: productionPromotionAllowed
    ? ['All review cases are approved. Confirm final manual promotion separately.']
    : ['No case is approved automatically.', 'Production promotion remains blocked until each case has reviewer sign-off and evidence.']
};

mkdirSync(auditRoot, { recursive: true });
writeFileSync(auditJsonFile, `${JSON.stringify(audit, null, 2)}\n`, 'utf8');

const markdown = `# NOOR Scholarly Review Audit

Version: ${audit.version}  
Generated: ${audit.generatedAt}  
Gate status: ${audit.gateStatus}  
Production promotion allowed: ${audit.productionPromotionAllowed}

## Review cases

${cases.map((item) => `- ${item.id} — ${item.domain} — ${item.approvalStatus}`).join('\n')}

## Required evidence

${audit.requiredEvidence.map((item) => `- ${item}`).join('\n')}

## Decision

Sprint 24 adds a review console and audit trail only. It does not approve production content.
`;
writeFileSync(auditMdFile, markdown, 'utf8');

console.log(`NOOR Sprint 24 scholarly review console generated: ${cases.length} review cases. Gate: ${audit.gateStatus}.`);
