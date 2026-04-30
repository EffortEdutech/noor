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

export const NOOR_CONTENT_PIPELINE = {
  version: '0.12.0',
  label: 'Sprint 12 — Production content pipeline / CDN source preparation',
  sourceRoot: 'content-pipeline/source/noor-demo-v0.12',
  distRoot: 'content-pipeline/dist/noor-cdn',
  publicRoot: 'apps/web/public/noor-cdn',
  localCdnBase: '/noor-cdn',
  commands: ['pnpm content:validate', 'pnpm content:prepare', 'pnpm check:content'],
  steps: [
    {
      id: 'source-registry',
      label: 'Source registry',
      status: 'ready',
      note: 'Records Quran, tafseer and hadith source status before production promotion.'
    },
    {
      id: 'cdn-layout',
      label: 'CDN folder layout',
      status: 'ready',
      note: 'Matches existing resolver paths for metadata, surah files, tafseer book files and hadith collections.'
    },
    {
      id: 'validation',
      label: 'Local validation scripts',
      status: 'ready',
      note: 'Checks manifest, source registry, surah counts, ayah keys, tafseer routes and hadith routes.'
    },
    {
      id: 'scholarly-gate',
      label: 'Scholarly and licensing gate',
      status: 'manual-gate',
      note: 'Required before any real Quran, tafseer or hadith dataset is labelled production.'
    },
    {
      id: 'production-importers',
      label: 'Production importers',
      status: 'future',
      note: 'Next sprint can add import transformers for chosen verified source datasets.'
    }
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
    {
      id: 'prepare-local-cdn',
      label: 'Prepare local CDN files',
      status: 'ready',
      note: 'Uses the Sprint 12 content:prepare path to produce a clean noor-cdn folder.'
    },
    {
      id: 'generate-publish-pack',
      label: 'Generate publish pack',
      status: 'ready',
      note: 'Creates a GitHub Pages/jsDelivr-ready folder with checksums and deployment notes.'
    },
    {
      id: 'verify-pack',
      label: 'Verify publish pack',
      status: 'ready',
      note: 'Checks required resolver paths and SHA-256 values before any upload.'
    },
    {
      id: 'external-hosting',
      label: 'External zero-budget hosting',
      status: 'manual-gate',
      note: 'Manual copy to a separate noor-cdn repository, then enable GitHub Pages or use jsDelivr.'
    },
    {
      id: 'production-dataset',
      label: 'Production dataset promotion',
      status: 'future',
      note: 'Real Quran, tafseer and hadith datasets still require licensing, attribution and scholarly review.'
    }
  ] satisfies NoorCdnPublishingStep[]
};
