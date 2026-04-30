export type NoorContentPipelineStep = {
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
