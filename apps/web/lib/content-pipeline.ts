export type NoorContentPipelineStep = {
  id: string;
  label: string;
  status: 'ready' | 'manual-gate' | 'future';
  note: string;
};

export type NoorCdnPublishingStep = {
  id: string;
  label: string;
  status: 'ready' | 'manual-gate' | 'future';
  note: string;
};

export type NoorCdnSmokeStep = {
  id: string;
  label: string;
  status: 'ready' | 'manual-gate' | 'future';
  note: string;
};

export type NoorCdnPromotionStep = {
  id: string;
  label: string;
  status: 'ready' | 'manual-gate' | 'future';
  note: string;
};

export type NoorSourceGovernanceStep = {
  id: string;
  label: string;
  status: 'ready' | 'manual-gate' | 'future';
  note: string;
};

export type NoorSourceIntakeStep = {
  id: string;
  label: string;
  status: 'ready' | 'manual-gate' | 'future';
  note: string;
};

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
    { id: 'production-importers', label: 'Production importers', status: 'future', note: 'Next sprint can add import transformers for chosen verified source datasets.' }
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
  commands: [
    'pnpm cdn:pack',
    'pnpm cdn:verify',
    'pnpm cdn:smoke',
    'pnpm cdn:smoke https://effortedutech.github.io/noor-cdn/noor-cdn'
  ],
  requiredResolverPaths: [
    'manifest/noor-content-manifest.json',
    'manifest/noor-content-health.json',
    'metadata/surah-index.json',
    'quran/surahs/001.json',
    'tafseer/demo-tafseer/surahs/001.json',
    'hadith/collections.json'
  ],
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
  commands: [
    'pnpm cdn:smoke <published-cdn-base>',
    'pnpm cdn:promote <published-cdn-base>',
    'pnpm check:cdn-promotion'
  ],
  envKeys: [
    'NEXT_PUBLIC_NOOR_DATA_MODE',
    'NEXT_PUBLIC_NOOR_MANIFEST_CDN_BASE',
    'NEXT_PUBLIC_NOOR_QURAN_CDN_BASE',
    'NEXT_PUBLIC_NOOR_TAFSEER_CDN_BASE',
    'NEXT_PUBLIC_NOOR_HADITH_CDN_BASE'
  ],
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
  commands: [
    'pnpm source:audit',
    'pnpm check:source-audit',
    'pnpm source:gate'
  ],
  requiredDomains: ['quran', 'tafseer', 'hadith'],
  productionRequirements: [
    'Verified canonical/source text',
    'Clear redistribution license or written permission',
    'Attribution wording approved',
    'Import transform checked against source sample',
    'Content validator passes after import',
    'Scholar/reviewer sign-off recorded'
  ],
  steps: [
    { id: 'domain-coverage', label: 'Domain coverage', status: 'ready', note: 'Audit confirms Quran, tafseer and hadith source records exist before any promotion discussion.' },
    { id: 'demo-block', label: 'Demo content production block', status: 'ready', note: 'Current demo sources remain explicitly marked demo-only and not-production-approved.' },
    { id: 'audit-report', label: 'Generated audit report', status: 'ready', note: 'source:audit writes JSON and Markdown reports under content-pipeline/audit for local review.' },
    { id: 'production-gate', label: 'Production gate command', status: 'manual-gate', note: 'source:gate intentionally fails until all source records are production-approved.' },
    { id: 'real-source-import', label: 'Real source import adapters', status: 'future', note: 'Future sprint can add importer adapters after the selected Quran, tafseer and hadith sources are approved.' }
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
  requiredFields: [
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
  ],
  steps: [
    { id: 'quran-template', label: 'Quran intake template', status: 'ready', note: 'Captures canonical text source, translation source, license notes, attribution and reviewer requirements before importer work.' },
    { id: 'tafseer-template', label: 'Tafseer intake template', status: 'ready', note: 'Captures tafseer book, author/translator, source route, license and scholarly review requirements.' },
    { id: 'hadith-template', label: 'Hadith intake template', status: 'ready', note: 'Captures collection, grading/source metadata, source route, license and reviewer requirements.' },
    { id: 'candidate-registry', label: 'Candidate source registry', status: 'ready', note: 'Keeps real source candidates separate from the demo CDN registry until approval.' },
    { id: 'production-approval', label: 'Production approval', status: 'manual-gate', note: 'No candidate can become production-approved without license, attribution, checksum/import plan and reviewer sign-off.' },
    { id: 'import-adapters', label: 'Importer adapters', status: 'future', note: 'Sprint 20 can begin Quran importer adapter work after candidate records are complete.' }
  ] satisfies NoorSourceIntakeStep[]
};
