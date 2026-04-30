export type NoorProductionPromotionStep = {
  id: string;
  label: string;
  status: 'ready' | 'blocked' | 'manual';
  note: string;
};

export const NOOR_PRODUCTION_CDN_PROMOTION = {
  version: '0.25.0',
  promotionId: 'noor-production-cdn-v1-promotion',
  label: 'Production CDN v1 promotion candidate',
  promotionRoot: 'content-pipeline/production-cdn',
  generatedPromotionFile: 'content-pipeline/production-cdn/noor-production-cdn-promotion.json',
  generatedPromotionMarkdown: 'content-pipeline/production-cdn/noor-production-cdn-promotion.md',
  generatedEnvFile: 'content-pipeline/production-cdn/.env.noor-production-cdn.example',
  defaultRuntimeSource: 'bundled',
  preferredExternalBase: 'https://effortedutech.github.io/noor-cdn',
  fallbackExternalBase: 'https://cdn.jsdelivr.net/gh/EffortEdutech/noor-cdn@main',
  commands: ['pnpm production:promote', 'pnpm check:production-promotion'],
  requiredArtifacts: [
    'content-pipeline/review/noor-scholarly-review-console.json',
    'content-pipeline/imported/quran-v0.20/noor-cdn/manifest/noor-quran-import-report.json',
    'content-pipeline/imported/tafseer-v0.22/noor-cdn/manifest/noor-tafseer-import-report.json',
    'content-pipeline/imported/hadith-v0.23/noor-cdn/manifest/noor-hadith-import-report.json'
  ],
  steps: [
    { id: 'review-gate', label: 'Review gate', status: 'blocked', note: 'Production promotion remains blocked until Quran, tafseer and hadith review cases are approved.' },
    { id: 'promotion-candidate', label: 'Promotion candidate', status: 'ready', note: 'Generate promotion report and environment preview without switching runtime defaults.' },
    { id: 'runtime-switch', label: 'Runtime switch', status: 'manual', note: 'External CDN runtime mode must only be enabled after source review, smoke test and final approval.' }
  ] satisfies NoorProductionPromotionStep[]
};
