import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname } from 'node:path';

const VERSION = '0.21.0';
const SELECTION_PATH = 'content-pipeline/source-gates/quran/quran-production-source-selection.json';
const REGISTRY_PATH = 'content-pipeline/source-intake/noor-source-candidates.json';
const AUDIT_JSON = 'content-pipeline/source-gates/quran/audit/noor-quran-source-gate-audit.json';
const AUDIT_MD = 'content-pipeline/source-gates/quran/audit/noor-quran-source-gate-audit.md';
const APPROVED_LICENSE_STATUSES = new Set(['approved', 'redistribution-approved', 'public-domain', 'permitted']);

function fail(message) {
  console.error(message);
  process.exit(1);
}

function readJson(file) {
  if (!existsSync(file)) fail(`Required file missing: ${file}`);
  try {
    return JSON.parse(readFileSync(file, 'utf8'));
  } catch (error) {
    fail(`Unable to parse ${file}: ${error instanceof Error ? error.message : String(error)}`);
  }
}

function isReadyText(value) {
  return typeof value === 'string' && value.trim().length > 0 && !['TBD', 'TBD before import.'].includes(value.trim());
}

function findQuranCandidate(registry, candidateId) {
  const candidate = registry.candidateSources?.find((source) => source.id === candidateId) ?? null;
  if (!candidate) fail(`Selected Quran candidate not found: ${candidateId}`);
  if (candidate.domain !== 'quran') fail(`Selected candidate must be quran domain. Found: ${candidate.domain}`);
  return candidate;
}

const selection = readJson(SELECTION_PATH);
if (selection.version !== VERSION) fail(`Quran source selection record must be v${VERSION}.`);
if (selection.domain !== 'quran') fail('Quran source selection record must use domain quran.');
if (!selection.selectedCandidateId) fail('Quran source selection record must include selectedCandidateId.');
if (!Array.isArray(selection.gateRequirements) || selection.gateRequirements.length < 6) {
  fail('Quran source selection record must include gateRequirements.');
}

const registry = readJson(REGISTRY_PATH);
const candidate = findQuranCandidate(registry, selection.selectedCandidateId);

const failedReasons = [];
if (!isReadyText(candidate.sourceUrl)) failedReasons.push('source-url-missing');
if (!APPROVED_LICENSE_STATUSES.has(candidate.licenseStatus)) failedReasons.push('license-not-approved');
if (!isReadyText(candidate.attributionText)) failedReasons.push('attribution-not-approved');
if (!isReadyText(candidate.checksumPlan)) failedReasons.push('checksum-plan-missing');
if (candidate.reviewerRequired !== true) failedReasons.push('reviewer-not-required');
if (candidate.reviewerSignoff !== true && candidate.reviewerSignedOff !== true && candidate.scholarReviewerSignoff !== true) {
  failedReasons.push('reviewer-signoff-missing');
}
if (candidate.approvalStatus !== 'production-approved') failedReasons.push('candidate-not-production-approved');

const gateStatus = failedReasons.length === 0 ? 'passed' : 'blocked';
const approvedForProductionImport = gateStatus === 'passed';

if (selection.approvedForProductionImport === true && !approvedForProductionImport) {
  fail(`Selection record cannot approve production import while gate is blocked: ${failedReasons.join(', ')}`);
}
if (selection.selectionStatus === 'approved' && !approvedForProductionImport) {
  fail(`Selection status cannot be approved while gate is blocked: ${failedReasons.join(', ')}`);
}
if (approvedForProductionImport && selection.productionDecision !== 'promote-to-production-import') {
  fail('Gate passed but selection.productionDecision is not promote-to-production-import. Confirm manual decision before promotion.');
}

const audit = {
  id: 'noor-quran-source-gate-audit-v0.21',
  version: VERSION,
  generatedAt: new Date().toISOString(),
  selectionRecord: SELECTION_PATH,
  candidateRegistry: REGISTRY_PATH,
  domain: 'quran',
  selectedCandidateId: selection.selectedCandidateId,
  gateStatus,
  approvedForProductionImport,
  candidate: {
    id: candidate.id,
    domain: candidate.domain,
    title: candidate.title,
    sourceUrl: candidate.sourceUrl,
    licenseStatus: candidate.licenseStatus,
    approvalStatus: candidate.approvalStatus,
    importReadiness: candidate.importReadiness
  },
  failedReasons,
  nextAction: approvedForProductionImport
    ? 'Run pnpm quran:import against the approved source input and complete reviewer spot-check before CDN promotion.'
    : selection.nextAction
};

mkdirSync(dirname(AUDIT_JSON), { recursive: true });
writeFileSync(AUDIT_JSON, `${JSON.stringify(audit, null, 2)}\n`, 'utf8');

const markdown = `# NOOR Quran Source Gate Audit

Version: ${audit.version}  
Generated: ${audit.generatedAt}  
Selected candidate: \`${audit.selectedCandidateId}\`  
Gate status: \`${audit.gateStatus}\`

## Decision

The Quran production source is ${audit.approvedForProductionImport ? '**approved** for production import.' : '**not approved** for production import yet.'}

## Candidate

- Title: ${candidate.title}
- Source URL: ${candidate.sourceUrl}
- License: ${candidate.licenseStatus}
- Approval: ${candidate.approvalStatus}
- Import readiness: ${candidate.importReadiness}

## Failed Reasons

${audit.failedReasons.length === 0 ? '- none' : audit.failedReasons.map((reason) => `- ${reason}`).join('\n')}

## Next Action

${audit.nextAction}
`;
writeFileSync(AUDIT_MD, markdown, 'utf8');

console.log(`NOOR Quran production source gate ${gateStatus}.`);
console.log(`Selected candidate: ${selection.selectedCandidateId}`);
console.log(`Approved for production import: ${approvedForProductionImport ? 'yes' : 'no'}`);
console.log(`Report: ${AUDIT_JSON}`);
