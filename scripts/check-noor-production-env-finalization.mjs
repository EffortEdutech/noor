import { existsSync, readFileSync } from 'node:fs';

const JSDELIVR_MAIN = 'https://cdn.jsdelivr.net/gh/EffortEdutech/noor-cdn@main/noor-cdn';

function fail(message) {
  console.error(message);
  process.exit(1);
}

function read(file) {
  if (!existsSync(file)) fail(`Missing required file: ${file}`);
  return readFileSync(file, 'utf8');
}

function readJson(file) {
  return JSON.parse(read(file));
}

const requiredFiles = [
  'docs/SPRINT_27_16_PRODUCTION_MODE_DEFAULT.md',
  'scripts/generate-noor-production-env-finalization.mjs',
  'scripts/check-noor-production-env-finalization.mjs',
  'content-pipeline/production-cdn/environment-finalization/noor-production-env-finalization.json',
  'content-pipeline/production-cdn/environment-finalization/noor-production-env-finalization.md',
  'content-pipeline/production-cdn/environment-finalization/.env.production.noor-cdn-main.example',
  'content-pipeline/production-cdn/environment-finalization/.env.local.production-noor-cdn-main.example',
  'content-pipeline/production-cdn/environment-finalization/vercel-production-env.md'
];

for (const file of requiredFiles) {
  if (!existsSync(file)) fail(`Missing Sprint 27.16 file: ${file}`);
}

const config = read('packages/noor-data/src/config.ts');
for (const expected of [
  `const DEFAULT_NOOR_CDN_BASE = '${JSDELIVR_MAIN}'`,
  "const PRODUCTION_NOOR_DATA_MODE: NoorDataMode = 'cdn'",
  "const DEVELOPMENT_NOOR_DATA_MODE: NoorDataMode = 'mock'",
  'function getDefaultNoorDataMode()',
  'process.env?.NODE_ENV',
  "sourceOverride ?? env('NEXT_PUBLIC_NOOR_DATA_MODE', getDefaultNoorDataMode())",
  'fallbackEnabled: true',
  'Production default'
]) {
  if (!config.includes(expected)) fail(`packages/noor-data/src/config.ts missing: ${expected}`);
}

const finalization = readJson('content-pipeline/production-cdn/environment-finalization/noor-production-env-finalization.json');
if (finalization.sprint !== '27.16') fail('Environment finalization report must declare Sprint 27.16.');
if (finalization.status !== 'production_runtime_default_finalized') fail('Production environment finalization must be finalized.');
if (finalization.productionRuntimeDefault !== 'cdn') fail('Production runtime default must be cdn.');
if (finalization.developmentRuntimeDefault !== 'mock') fail('Development runtime default must stay mock.');
if (finalization.canonicalProductionCdnBase !== JSDELIVR_MAIN) fail('Canonical production CDN must point to noor-cdn@main.');
if (finalization.productionFallbackEnabled !== true) fail('Production fallback must remain enabled.');
if (finalization.requiredFailures?.length > 0) fail(`Production environment finalization has failures: ${finalization.requiredFailures.join(', ')}`);

const envExample = read('content-pipeline/production-cdn/environment-finalization/.env.production.noor-cdn-main.example');
for (const expected of [
  'NEXT_PUBLIC_NOOR_DATA_MODE=cdn',
  `NEXT_PUBLIC_NOOR_MANIFEST_CDN_BASE=${JSDELIVR_MAIN}`,
  `NEXT_PUBLIC_NOOR_QURAN_CDN_BASE=${JSDELIVR_MAIN}`,
  `NEXT_PUBLIC_NOOR_TAFSEER_CDN_BASE=${JSDELIVR_MAIN}`,
  `NEXT_PUBLIC_NOOR_HADITH_CDN_BASE=${JSDELIVR_MAIN}`
]) {
  if (!envExample.includes(expected)) fail(`Production env example missing: ${expected}`);
}

const productionExecution = readJson('content-pipeline/production-cdn/promotion-execution/noor-cdn-production-promotion-execution.json');
if (productionExecution.promotionStatus !== 'production_promoted') fail('Sprint 27.14 production promotion must remain production_promoted.');
if (productionExecution.targetBranch !== 'noor-cdn/main') fail('Sprint 27.14 target branch must remain noor-cdn/main.');

console.log('NOOR Sprint 27.16 production environment finalization check passed.');
