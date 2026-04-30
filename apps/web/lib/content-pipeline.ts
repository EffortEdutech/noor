export type NoorContentPipelineStep = {
  id: string;
  label: string;
  status: 'ready' | 'manual-gate' | 'future';
  note: string;
};

export type NoorCdnPublishingStep = NoorContentPipelineStep;
export type NoorCdnSmokeStep = NoorContentPipelineStep;
export type NoorCdnPromotionStep = NoorContentPipelineStep;
export type NoorSourceGovernanceStep = NoorContentPipelineStep;
export type NoorSourceIntakeStep = NoorContentPipelineStep;
export type NoorQuranImporterStep = NoorContentPipelineStep;
export type NoorQuranSourceGateStep = NoorContentPipelineStep;
export type NoorTafseerImporterStep = NoorContentPipelineStep;

export const NOOR_CONTENT_PIPELINE = {
  version: '0.12.0',
  label: 'Sprint 12 — Production content pipeline / CDN source preparation',
  sourceRoot: 'content-pipeline/source/noor-demo-v0.12',
  distRoot: 'content-pipeline/dist/noor-cdn',
  publicRoot: 'apps/web/public/noor-cdn',
  localCdnBase: '/noor-cdn',
  commands: ['pnpm content:validate', 'pnpm content:prepare', 'pnpm check:content'],
  steps: [
    { id: 'source-registry', label: 'Source registry', status: 'ready', note: 'Records Quran, tafseer and hadith source status before production promotion.' },
    { id: 'cdn-layout', label: 'CDN folder layout', status: 'ready', note: 'Matches existing resolver paths for metadata, surah files, tafseer book files and hadith collections.' },
    { id: 'validation', label: 'Local validation scripts', status: 'ready', note: 'Checks manifest, source registry, surah counts, ayah keys, tafseer routes and hadith routes.' },
    { id: 'scholarly-gate', label: 'Scholarly and licensing gate', status: 'manual-gate', note: 'Required before any real Quran, tafseer or hadith dataset is labelled production.' },
    { id: 'production-importers', label: 'Production importers', status: 'future', note: 'Quran and tafseer adapters are now started; hadith importer remains next.' }
  ] satisfies NoorContentPipelineStep[]
};

export const NOOR_CDN_PUBLISHING = {
  version: '0.14.0',
  label: 'Sprint 14 — Zero-budget CDN publish pack',
  sourceRoot: 'content-pipeline/dist/noor-cdn',
  publishRoot: 'content-pipeline/publish/noor-cdn-gh-pages',
  publicSubfolder: 'noor-cdn',
  generatedManifest: 'content-pipeline/publish/noor-cdn-gh-pages/publish-manifest.json',
  recommendedDataRepo: 'https://github.com/EffortEdutech/noor-cdn',
  githubPagesBase: 'https://effortedutech.github.io/noor-cdn/noor-cdn',
  jsDelivrBase: 'https://cdn.jsdelivr.net/gh/EffortEdutech/noor-cdn@main/noor-cdn',
  commands: ['pnpm cdn:pack', 'pnpm cdn:verify', 'pnpm check:cdn-publish'],
  steps: [
    { id: 'prepare-local-cdn', label: 'Prepare local CDN files', status: 'ready', note: 'Uses the Sprint 12 content:prepare path to produce a clean noor-cdn folder.' },
    { id: 'generate-publish-pack', label: 'Generate publish pack', status: 'ready', note: 'Creates a GitHub Pages/jsDelivr-ready folder with checksums and deployment notes.' },
    { id: 'verify-pack', label: 'Verify publish pack', status: 'ready', note: 'Checks required resolver paths and SHA-256 values before any upload.' },
    { id: 'external-hosting', label: 'External zero-budget hosting', status: 'manual-gate', note: 'Manual copy to a separate noor-cdn repository, then enable GitHub Pages or use jsDelivr.' },
    { id: 'production-dataset', label: 'Production dataset promotion', status: 'future', note: 'Real Quran, tafseer and hadith datasets still require licensing, attribution and scholarly review.' }
  ] satisfies NoorCdnPublishingStep[]
};

export const NOOR_CDN_SMOKE_TESTING = {
  version: '0.15.0',
  label: 'Sprint 15 — CDN smoke testing and promotion gate',
  defaultLocalTarget: 'content-pipeline/publish/noor-cdn-gh-pages/noor-cdn',
  githubPagesBase: NOOR_CDN_PUBLISHING.githubPagesBase,
  jsDelivrBase: NOOR_CDN_PUBLISHING.jsDelivrBase,
  commands: ['pnpm cdn:pack', 'pnpm cdn:verify', 'pnpm cdn:smoke', 'pnpm cdn:smoke https://effortedutech.github.io/noor-cdn/noor-cdn'],
  requiredResolverPaths: ['manifest/noor-content-manifest.json', 'manifest/noor-content-health.json', 'metadata/surah-index.json', 'quran/surahs/001.json', 'tafseer/demo-tafseer/surahs/001.json', 'hadith/collections.json'],
  steps: [
    { id: 'local-pack-smoke', label: 'Local publish pack smoke test', status: 'ready', note: 'Validates the generated publish folder before it is copied to the data/CDN repository.' },
    { id: 'external-url-smoke', label: 'External CDN URL smoke test', status: 'ready', note: 'Accepts a GitHub Pages or jsDelivr base URL and checks all required resolver files over HTTP.' },
    { id: 'runtime-promotion-gate', label: 'Runtime promotion gate', status: 'manual-gate', note: 'Only switch NOOR to external CDN mode after cdn:smoke passes against the published URL.' },
    { id: 'production-content', label: 'Production content gate', status: 'future', note: 'Real datasets still require licensing, attribution and scholarly review before production release.' }
  ] satisfies NoorCdnSmokeStep[]
};

export const NOOR_CDN_PROMOTION = {
  version: '0.16.0',
  label: 'Sprint 16 — CDN promotion bundle and environment handoff',
  defaultPromotionBase: NOOR_CDN_PUBLISHING.githubPagesBase,
  fallbackPromotionBase: NOOR_CDN_PUBLISHING.jsDelivrBase,
  promotionRoot: 'content-pipeline/promotion',
  generatedEnvFile: 'content-pipeline/promotion/noor-cdn.env.local',
  generatedPromotionFile: 'content-pipeline/promotion/noor-cdn-promotion.json',
  generatedChecklistFile: 'content-pipeline/promotion/noor-cdn-promotion-checklist.md',
  commands: ['pnpm cdn:smoke <published-cdn-base>', 'pnpm cdn:promote <published-cdn-base>', 'pnpm check:cdn-promotion'],
  envKeys: ['NEXT_PUBLIC_NOOR_DATA_MODE', 'NEXT_PUBLIC_NOOR_MANIFEST_CDN_BASE', 'NEXT_PUBLIC_NOOR_QURAN_CDN_BASE', 'NEXT_PUBLIC_NOOR_TAFSEER_CDN_BASE', 'NEXT_PUBLIC_NOOR_HADITH_CDN_BASE'],
  steps: [
    { id: 'smoke-first', label: 'Smoke first', status: 'manual-gate', note: 'Run pnpm cdn:smoke against the published URL before generating promotion files.' },
    { id: 'generate-env', label: 'Generate .env handoff', status: 'ready', note: 'cdn:promote writes a copy-pasteable .env.local template using one shared CDN base.' },
    { id: 'promotion-record', label: 'Promotion record', status: 'ready', note: 'A JSON promotion record documents target URL, resolver paths and the exact smoke command.' },
    { id: 'vercel-env', label: 'Vercel environment update', status: 'manual-gate', note: 'Copy the generated NEXT_PUBLIC values into Vercel or local .env.local, then rebuild.' },
    { id: 'production-content', label: 'Production content gate', status: 'future', note: 'Production Quran, tafseer and hadith content still requires licensing and scholarly approval.' }
  ] satisfies NoorCdnPromotionStep[]
};

export const NOOR_SOURCE_GOVERNANCE = {
  version: '0.17.0',
  label: 'Sprint 17 — Source governance and production approval gate',
  sourceRegistry: 'content-pipeline/source/noor-demo-v0.12/manifest/noor-source-registry.json',
  auditRoot: 'content-pipeline/audit',
  generatedAuditFile: 'content-pipeline/audit/noor-source-audit.json',
  generatedAuditMarkdown: 'content-pipeline/audit/noor-source-audit.md',
  commands: ['pnpm source:audit', 'pnpm check:source-audit', 'pnpm source:gate'],
  requiredDomains: ['quran', 'tafseer', 'hadith'],
  productionRequirements: ['Verified canonical/source text', 'Clear redistribution license or written permission', 'Attribution wording approved', 'Import transform checked against source sample', 'Content validator passes after import', 'Scholar/reviewer sign-off recorded'],
  steps: [
    { id: 'domain-coverage', label: 'Domain coverage', status: 'ready', note: 'Audit confirms Quran, tafseer and hadith source records exist before any promotion discussion.' },
    { id: 'demo-block', label: 'Demo content production block', status: 'ready', note: 'Current demo sources remain explicitly marked demo-only and not-production-approved.' },
    { id: 'audit-report', label: 'Generated audit report', status: 'ready', note: 'source:audit writes JSON and Markdown reports under content-pipeline/audit for local review.' },
    { id: 'production-gate', label: 'Production gate command', status: 'manual-gate', note: 'source:gate intentionally fails until all source records are production-approved.' },
    { id: 'real-source-import', label: 'Real source import adapters', status: 'future', note: 'Future sprints add importer adapters after selected Quran, tafseer and hadith sources are approved.' }
  ] satisfies NoorSourceGovernanceStep[]
};

export const NOOR_SOURCE_INTAKE = {
  version: '0.19.0',
  label: 'Sprint 19 — Production source intake templates',
  templateRoot: 'content-pipeline/source-intake/templates',
  candidateRegistry: 'content-pipeline/source-intake/noor-source-candidates.json',
  schemaFile: 'content-pipeline/schemas/noor-source-intake.schema.json',
  generatedAuditFile: 'content-pipeline/source-intake/audit/noor-source-intake-audit.json',
  generatedAuditMarkdown: 'content-pipeline/source-intake/audit/noor-source-intake-audit.md',
  commands: ['pnpm source:intake', 'pnpm check:source-intake', 'pnpm source:gate'],
  requiredDomains: ['quran', 'tafseer', 'hadith'],
  requiredFields: ['id', 'domain', 'title', 'language', 'sourceType', 'sourceUrl', 'licenseStatus', 'attributionText', 'reviewerRequired', 'approvalStatus', 'importReadiness'],
  steps: [
    { id: 'quran-template', label: 'Quran intake template', status: 'ready', note: 'Captures canonical text source, translation source, license notes, attribution and reviewer requirements before importer work.' },
    { id: 'tafseer-template', label: 'Tafseer intake template', status: 'ready', note: 'Captures tafseer book, author/translator, source route, license and scholarly review requirements.' },
    { id: 'hadith-template', label: 'Hadith intake template', status: 'ready', note: 'Captures collection, grading/source metadata, source route, license and reviewer requirements.' },
    { id: 'candidate-registry', label: 'Candidate source registry', status: 'ready', note: 'Keeps real source candidates separate from the demo CDN registry until approval.' },
    { id: 'production-approval', label: 'Production approval', status: 'manual-gate', note: 'No candidate can become production-approved without license, attribution, checksum/import plan and reviewer sign-off.' },
    { id: 'import-adapters', label: 'Importer adapters', status: 'future', note: 'Quran and tafseer importer adapters are started with non-production fixtures; hadith remains next.' }
  ] satisfies NoorSourceIntakeStep[]
};

export const NOOR_QURAN_IMPORTER = {
  version: '0.20.0',
  label: 'Sprint 20 — Quran importer adapter v1',
  adapterId: 'noor-quran-importer-v1',
  sampleSource: 'content-pipeline/importers/quran/samples/quran-import-sample.json',
  outputRoot: 'content-pipeline/imported/quran-v0.20/noor-cdn',
  generatedReport: 'content-pipeline/imported/quran-v0.20/noor-cdn/manifest/noor-quran-import-report.json',
  generatedAuditMarkdown: 'content-pipeline/imported/quran-v0.20/audit/noor-quran-import-audit.md',
  commands: ['pnpm quran:import', 'pnpm check:quran-import', 'pnpm check:pack'],
  productionGate: ['Selected Quran source candidate exists in source intake registry', 'License is approved for redistribution', 'Attribution wording is recorded', 'Canonical text checksum/import plan is recorded', 'Reviewer sign-off is recorded', 'Adapter output passes count, key and route validation'],
  steps: [
    { id: 'adapter-contract', label: 'Importer contract', status: 'ready', note: 'Normalizes a structured Quran source JSON into NOOR CDN-style surah index and per-surah files.' },
    { id: 'fixture-import', label: 'Fixture import', status: 'ready', note: 'Imports existing NOOR demo Quran records as a non-production adapter fixture.' },
    { id: 'count-validation', label: 'Count and key validation', status: 'ready', note: 'Checks surah numbers, ayah counts, unique keys and required translations before writing output.' },
    { id: 'source-gate', label: 'Source governance gate', status: 'manual-gate', note: 'Output report remains blocked from production because the Quran source candidate is still not approved.' },
    { id: 'production-quran-source', label: 'Production Quran source', status: 'future', note: 'Replace the fixture with a verified Quran source only after license, attribution and reviewer sign-off are complete.' }
  ] satisfies NoorQuranImporterStep[]
};

export const NOOR_QURAN_SOURCE_GATE = {
  version: '0.21.0',
  label: 'Sprint 21 — Quran production source selection gate',
  selectedCandidateId: 'quran-production-candidate-placeholder',
  selectionRecord: 'content-pipeline/source-gates/quran/quran-production-source-selection.json',
  candidateRegistry: NOOR_SOURCE_INTAKE.candidateRegistry,
  generatedAuditFile: 'content-pipeline/source-gates/quran/audit/noor-quran-source-gate-audit.json',
  generatedAuditMarkdown: 'content-pipeline/source-gates/quran/audit/noor-quran-source-gate-audit.md',
  commands: ['pnpm quran:gate', 'pnpm check:quran-source-gate', 'pnpm quran:import'],
  gateRequirements: ['Real Quran source URL or source file path recorded', 'License approved for redistribution', 'Attribution wording approved', 'Checksum/import plan recorded', 'Scholar/reviewer sign-off recorded', 'Candidate approvalStatus set to production-approved only after manual review'],
  decision: {
    status: 'blocked',
    approvedForProductionImport: false,
    note: 'The current Quran candidate remains a placeholder. Production import stays blocked until a real source is selected and signed off.'
  },
  steps: [
    { id: 'selection-record', label: 'Selection record', status: 'ready', note: 'A Quran-specific source selection JSON now records the selected candidate, decision and manual gate requirements.' },
    { id: 'gate-validator', label: 'Gate validator', status: 'ready', note: 'quran:gate evaluates the selected Quran candidate and writes JSON/Markdown audit reports.' },
    { id: 'production-block', label: 'Production block', status: 'manual-gate', note: 'The default candidate is intentionally blocked because source URL, license, attribution, checksum and reviewer sign-off are not complete.' },
    { id: 'approved-source-import', label: 'Approved source import', status: 'future', note: 'After a real Quran source is approved, the importer can be pointed to that source and promoted through CDN checks.' }
  ] satisfies NoorQuranSourceGateStep[]
};

export const NOOR_TAFSEER_IMPORTER = {
  version: '0.22.0',
  label: 'Sprint 22 — Tafseer importer adapter v1',
  adapterId: 'noor-tafseer-importer-v1',
  sampleSource: 'content-pipeline/importers/tafseer/samples/tafseer-import-sample.json',
  outputRoot: 'content-pipeline/imported/tafseer-v0.22/noor-cdn',
  generatedReport: 'content-pipeline/imported/tafseer-v0.22/noor-cdn/manifest/noor-tafseer-import-report.json',
  generatedAuditMarkdown: 'content-pipeline/imported/tafseer-v0.22/audit/noor-tafseer-import-audit.md',
  commands: ['pnpm tafseer:import', 'pnpm check:tafseer-import', 'pnpm check:pack'],
  productionGate: ['Selected tafseer source candidate exists in source intake registry', 'License is approved for redistribution', 'Attribution wording is recorded', 'Author/translator metadata is recorded', 'Ayah range mapping is checked', 'Reviewer sign-off is recorded', 'Adapter output passes book, route and entry validation'],
  steps: [
    { id: 'adapter-contract', label: 'Importer contract', status: 'ready', note: 'Normalizes structured tafseer source entries into NOOR CDN-style tafseer book and per-surah route files.' },
    { id: 'fixture-import', label: 'Fixture import', status: 'ready', note: 'Imports a small non-production tafseer fixture so the adapter contract can be tested before real source approval.' },
    { id: 'range-validation', label: 'Ayah range validation', status: 'ready', note: 'Checks surah numbers, ayah ranges, unique entry IDs, required body text and source attribution before writing output.' },
    { id: 'source-gate', label: 'Source governance gate', status: 'manual-gate', note: 'Output report remains blocked from production because the tafseer source candidate is still not approved.' },
    { id: 'production-tafseer-source', label: 'Production tafseer source', status: 'future', note: 'Replace the fixture with a verified tafseer source only after license, attribution and reviewer sign-off are complete.' }
  ] satisfies NoorTafseerImporterStep[]
};
