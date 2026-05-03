export type NoorPipelineStep = {
  id: string;
  label: string;
  status: 'ready' | 'blocked' | 'manual' | 'planned';
  note: string;
};

const ready = 'ready' as const;
const blocked = 'blocked' as const;
const manual = 'manual' as const;
const planned = 'planned' as const;

export const NOOR_CONTENT_PIPELINE = {
  version: '0.24.0',
  label: 'Production content pipeline / CDN source preparation',
  sourceRoot: 'content-pipeline/source',
  distRoot: 'content-pipeline/dist/noor-cdn',
  publicRoot: 'apps/web/public/noor-cdn',
  localCdnBase: '/noor-cdn',
  commands: ['pnpm content:validate', 'pnpm content:prepare', 'pnpm check:content'],
  steps: [
    { id: 'source', label: 'Source tree', status: ready, note: 'Keep raw, reviewed and generated content separated.' },
    { id: 'manifest', label: 'Manifest generation', status: ready, note: 'Prepare CDN manifests and integrity metadata before publishing.' },
    { id: 'gate', label: 'Production gate', status: blocked, note: 'Real Quran, tafseer and hadith data remains blocked until source approval is complete.' }
  ] satisfies NoorPipelineStep[]
};

export const NOOR_CDN_PUBLISHING = {
  version: '0.14.0',
  label: 'Zero-budget CDN publish pack',
  publishRoot: 'noor-cdn',
  publishPackRoot: 'content-pipeline/publish/noor-cdn-gh-pages',
  githubPagesBase: 'https://effortedutech.github.io/noor-cdn',
  jsDelivrBase: 'https://cdn.jsdelivr.net/gh/EffortEdutech/noor-cdn@main',
  commands: ['pnpm cdn:pack', 'pnpm cdn:verify', 'pnpm check:cdn-publish'],
  steps: [
    { id: 'pack', label: 'Build CDN pack', status: ready, note: 'Copy generated CDN files into a clean publish folder.' },
    { id: 'verify', label: 'Verify files', status: ready, note: 'Check required resolver files and manifests.' },
    { id: 'publish', label: 'Manual publish', status: manual, note: 'Push the CDN folder to the chosen zero-budget host.' }
  ] satisfies NoorPipelineStep[]
};

export const NOOR_CDN_SMOKE_TESTING = {
  version: '0.15.0',
  label: 'CDN smoke testing gate',
  defaultLocalTarget: 'noor-cdn',
  githubPagesBase: 'https://effortedutech.github.io/noor-cdn',
  jsDelivrBase: 'https://cdn.jsdelivr.net/gh/EffortEdutech/noor-cdn@main',
  requiredResolverPaths: [
    '/manifest/noor-content-health.json',
    '/metadata/surah-index.json',
    '/quran/surahs/001.json'
  ],
  commands: ['pnpm cdn:smoke', 'pnpm check:cdn-smoke'],
  steps: [
    { id: 'local', label: 'Local smoke test', status: ready, note: 'Validate files before publishing.' },
    { id: 'remote', label: 'Remote smoke test', status: manual, note: 'Run against GitHub Pages or jsDelivr URL after publish.' },
    { id: 'promote', label: 'Promote only after pass', status: blocked, note: 'Do not switch runtime CDN mode until smoke test passes.' }
  ] satisfies NoorPipelineStep[]
};

export const NOOR_CDN_PROMOTION = {
  version: '0.16.0',
  label: 'CDN promotion handoff',
  defaultPromotionBase: 'https://effortedutech.github.io/noor-cdn',
  fallbackPromotionBase: 'https://cdn.jsdelivr.net/gh/EffortEdutech/noor-cdn@main',
  promotionRoot: 'content-pipeline/promotion',
  generatedEnvFile: 'content-pipeline/promotion/noor-cdn.env.local',
  generatedPromotionFile: 'content-pipeline/promotion/noor-cdn-promotion.json',
  generatedChecklistFile: 'content-pipeline/promotion/noor-cdn-promotion-checklist.md',
  envKeys: [
    'NEXT_PUBLIC_NOOR_DATA_MODE',
    'NEXT_PUBLIC_NOOR_QURAN_CDN_BASE',
    'NEXT_PUBLIC_NOOR_TAFSEER_CDN_BASE',
    'NEXT_PUBLIC_NOOR_HADITH_CDN_BASE',
    'NEXT_PUBLIC_NOOR_MANIFEST_CDN_BASE'
  ],
  commands: ['pnpm cdn:promote', 'pnpm check:cdn-promotion'],
  steps: [
    { id: 'handoff', label: 'Generate handoff', status: ready, note: 'Write environment values and promotion checklist.' },
    { id: 'paste', label: 'Paste env', status: manual, note: 'Apply values locally or in Vercel only after smoke test passes.' },
    { id: 'runtime', label: 'Runtime source switch', status: blocked, note: 'External CDN mode remains a controlled decision.' }
  ] satisfies NoorPipelineStep[]
};

export const NOOR_SOURCE_GOVERNANCE = {
  version: '0.17.0',
  label: 'Source governance and production approval gate',
  sourceRegistry: 'content-pipeline/source-registry/noor-source-registry.json',
  generatedAuditFile: 'content-pipeline/source-registry/audit/noor-source-audit.json',
  generatedAuditMarkdown: 'content-pipeline/source-registry/audit/noor-source-audit.md',
  requiredDomains: ['quran', 'tafseer', 'hadith'],
  commands: ['pnpm source:audit', 'pnpm check:source-audit', 'pnpm source:gate'],
  steps: [
    { id: 'registry', label: 'Source registry', status: ready, note: 'Make every source domain explicit.' },
    { id: 'license', label: 'License and attribution', status: blocked, note: 'Production promotion requires verified redistribution rights.' },
    { id: 'review', label: 'Scholarly review', status: blocked, note: 'Production promotion requires reviewer sign-off.' }
  ] satisfies NoorPipelineStep[]
};

export const NOOR_SOURCE_INTAKE = {
  version: '0.19.0',
  label: 'Production source intake templates',
  templateRoot: 'content-pipeline/source-intake/templates',
  candidateRegistry: 'content-pipeline/source-intake/noor-source-candidates.json',
  generatedAuditFile: 'content-pipeline/source-intake/audit/noor-source-intake-audit.json',
  requiredDomains: ['quran', 'tafseer', 'hadith'],
  requiredFields: ['domain', 'candidateId', 'title', 'license', 'attribution', 'reviewer'],
  commands: ['pnpm source:intake', 'pnpm check:source-intake'],
  steps: [
    { id: 'templates', label: 'Intake templates', status: ready, note: 'Capture Quran, tafseer and hadith source candidates consistently.' },
    { id: 'audit', label: 'Intake audit', status: ready, note: 'Validate that required source metadata is present.' },
    { id: 'approval', label: 'Approval remains manual', status: blocked, note: 'Intake does not approve any source automatically.' }
  ] satisfies NoorPipelineStep[]
};

export const NOOR_QURAN_SOURCE_GATE = {
  version: '0.21.0',
  label: 'Quran production source selection gate',
  selectedCandidateId: 'quran-source-candidate-001',
  selectionRecord: 'content-pipeline/source-gates/quran/quran-production-source-selection.json',
  generatedAuditFile: 'content-pipeline/source-gates/quran/audit/noor-quran-source-gate-audit.json',
  decision: {
    status: 'blocked',
    approvedForProductionImport: false
  },
  gateRequirements: [
    'Verified source identity',
    'Redistribution license approved',
    'Attribution wording approved',
    'Checksum plan prepared',
    'Scholarly reviewer sign-off captured'
  ],
  commands: ['pnpm quran:gate', 'pnpm check:quran-source-gate'],
  steps: [
    { id: 'candidate', label: 'Candidate selected', status: ready, note: 'A candidate can be selected without being approved.' },
    { id: 'evidence', label: 'Evidence required', status: blocked, note: 'License, attribution and checksum evidence are still required.' },
    { id: 'review', label: 'Reviewer sign-off', status: blocked, note: 'No production Quran import without review sign-off.' }
  ] satisfies NoorPipelineStep[]
};

export const NOOR_QURAN_IMPORTER = {
  version: '0.20.0',
  label: 'Quran importer adapter v1',
  adapterId: 'noor-quran-importer-v1',
  sampleSource: 'content-pipeline/importers/quran/samples/quran-import-sample.json',
  outputRoot: 'content-pipeline/imported/quran-v0.20/noor-cdn',
  generatedReport: 'content-pipeline/imported/quran-v0.20/noor-cdn/manifest/noor-quran-import-report.json',
  productionGate: ['license', 'attribution', 'checksum', 'reviewer sign-off'],
  commands: ['pnpm quran:import', 'pnpm check:quran-import'],
  steps: [
    { id: 'fixture', label: 'Fixture import', status: ready, note: 'Import adapter works against non-production fixture data.' },
    { id: 'routes', label: 'CDN route output', status: ready, note: 'Generate surah index and per-surah JSON routes.' },
    { id: 'production', label: 'Production import', status: blocked, note: 'Blocked until Quran source gate is approved.' }
  ] satisfies NoorPipelineStep[]
};

export const NOOR_TAFSEER_IMPORTER = {
  version: '0.22.0',
  label: 'Tafseer importer adapter v1',
  adapterId: 'noor-tafseer-importer-v1',
  sampleSource: 'content-pipeline/importers/tafseer/samples/tafseer-import-sample.json',
  outputRoot: 'content-pipeline/imported/tafseer-v0.22/noor-cdn',
  generatedReport: 'content-pipeline/imported/tafseer-v0.22/noor-cdn/manifest/noor-tafseer-import-report.json',
  productionGate: ['license', 'attribution', 'checksum', 'reviewer sign-off'],
  commands: ['pnpm tafseer:import', 'pnpm check:tafseer-import'],
  steps: [
    { id: 'fixture', label: 'Fixture import', status: ready, note: 'Import adapter works against non-production tafseer fixture data.' },
    { id: 'routes', label: 'Book and surah routes', status: ready, note: 'Generate tafseer book metadata and per-surah JSON routes.' },
    { id: 'production', label: 'Production import', status: blocked, note: 'Blocked until tafseer source review is approved.' }
  ] satisfies NoorPipelineStep[]
};

export const NOOR_HADITH_IMPORTER = {
  version: '0.23.0',
  label: 'Hadith importer adapter v1',
  adapterId: 'noor-hadith-importer-v1',
  sampleSource: 'content-pipeline/importers/hadith/samples/hadith-import-sample.json',
  outputRoot: 'content-pipeline/imported/hadith-v0.23/noor-cdn',
  generatedReport: 'content-pipeline/imported/hadith-v0.23/noor-cdn/manifest/noor-hadith-import-report.json',
  productionGate: ['license', 'attribution', 'checksum', 'reviewer sign-off'],
  commands: ['pnpm hadith:import', 'pnpm check:hadith-import'],
  steps: [
    { id: 'fixture', label: 'Fixture import', status: ready, note: 'Import adapter works against non-production hadith fixture data.' },
    { id: 'routes', label: 'Collection and item routes', status: ready, note: 'Generate collection metadata and hadith item JSON routes.' },
    { id: 'production', label: 'Production import', status: blocked, note: 'Blocked until hadith source review is approved.' }
  ] satisfies NoorPipelineStep[]
};

export const NOOR_SCHOLARLY_REVIEW_CONSOLE = {
  version: '0.24.0',
  label: 'Scholarly review console',
  consoleId: 'noor-scholarly-review-console-v1',
  reviewRegistry: 'content-pipeline/review/noor-scholarly-review-console.json',
  generatedAuditFile: 'content-pipeline/review/audit/noor-scholarly-review-audit.json',
  generatedAuditMarkdown: 'content-pipeline/review/audit/noor-scholarly-review-audit.md',
  requiredDomains: ['quran', 'tafseer', 'hadith'],
  requiredEvidence: ['source identity', 'license/permission', 'attribution wording', 'checksum/integrity plan', 'scholarly reviewer sign-off'],
  commands: ['pnpm review:console', 'pnpm check:review-console'],
  steps: [
    { id: 'review-cases', label: 'Review cases', status: ready, note: 'Track Quran, tafseer and hadith review cases from one console record.' },
    { id: 'evidence', label: 'Evidence checklist', status: blocked, note: 'Each case remains blocked until evidence and reviewer sign-off are captured.' },
    { id: 'promotion', label: 'Promotion decision', status: blocked, note: 'The console does not promote production content; it only records review readiness.' }
  ] satisfies NoorPipelineStep[]
};



