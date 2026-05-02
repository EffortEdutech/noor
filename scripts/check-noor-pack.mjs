import { existsSync, readFileSync } from 'node:fs';

const EXPECTED_VERSION = '0.27.12';

function fail(message) {
  console.error(message);
  process.exit(1);
}

function read(file) {
  return readFileSync(file, 'utf8');
}

function readJson(file) {
  return JSON.parse(read(file));
}

function includesAny(source, expectedValues) {
  return expectedValues.some((value) => source.includes(value));
}

const requiredFiles = [
  'package.json',
  'apps/web/app/settings/page.tsx',
  'apps/web/app/explore/page.tsx',
  'apps/web/app/learn/hadith/page.tsx',
  'apps/web/app/learn/tafseer/page.tsx',
  'apps/web/components/SearchPanel.tsx',
  'apps/web/components/ProductionCdnPromotionCard.tsx',
  'apps/web/components/ProductionCdnApprovalGateCard.tsx',
  'apps/web/components/NoorCdnStagingAcceptanceCard.tsx',
  'apps/web/components/NoorStagingBrowserQaCard.tsx',
  'apps/web/lib/app-version.ts',
  'apps/web/lib/production-cdn-promotion.ts',
  'apps/web/lib/production-cdn-approval-gate.ts',
  'apps/web/lib/release-notes.ts',
  'apps/web/lib/roadmap.ts',
  'apps/web/public/version.json',
  'packages/noor-search/src/index.ts',
  'packages/noor-data/src/config.ts',
  'scripts/build-noor-cdn-search-index.mjs',
  'scripts/promote-noor-production-cdn.mjs',
  'scripts/check-noor-production-promotion.mjs',
  'scripts/run-production-cdn-approval-gate.mjs',
  'scripts/check-production-cdn-approval-gate.mjs',
  'scripts/generate-noor-production-cdn-promotion-plan.mjs',
  'scripts/check-noor-production-cdn-promotion-plan.mjs',
  'scripts/record-noor-production-cdn-promotion.mjs',
  'scripts/check-noor-production-cdn-promoted.mjs',
  'scripts/apply-sprint27-14-package-scripts.mjs',
  'scripts/check-noor-pack.mjs',
  'scripts/check-noor-release.mjs',
  'scripts/generate-noor-roadmap.mjs',
  'scripts/check-noor-roadmap.mjs',
  'scripts/check-staging-cdn-acceptance-checklist.mjs',
  'scripts/check-staging-browser-qa-checklist.mjs',
  'content-pipeline/review/noor-scholarly-review-console.json',
  'content-pipeline/imported/quran-v0.20/noor-cdn/manifest/noor-quran-import-report.json',
  'content-pipeline/imported/tafseer-v0.22/noor-cdn/manifest/noor-tafseer-import-report.json',
  'content-pipeline/imported/hadith-v0.23/noor-cdn/manifest/noor-hadith-import-report.json',
  'content-pipeline/production-cdn/noor-production-cdn-promotion.json',
  'content-pipeline/production-cdn/noor-production-cdn-promotion.md',
  'content-pipeline/production-cdn/.env.noor-production-cdn.example',
  'content-pipeline/production-cdn/approval-gate/noor-production-cdn-approval-gate.json',
  'content-pipeline/production-cdn/approval-gate/noor-production-cdn-approval-gate.md',
  'content-pipeline/production-cdn/promotion-execution/noor-cdn-production-promotion-plan.json',
  'content-pipeline/production-cdn/promotion-execution/noor-cdn-production-promotion-plan.md',
  'content-pipeline/production-cdn/promotion-execution/noor-cdn-production-promotion-execution.json',
  'content-pipeline/production-cdn/promotion-execution/noor-cdn-production-promotion-execution.md',
  'content-pipeline/roadmap/noor-roadmap-status.json',
  'content-pipeline/roadmap/noor-roadmap-status.md',
  'content-pipeline/review/ilm-mate-v1/staging-cdn-acceptance/staging-cdn-acceptance-report.json',
  'content-pipeline/review/ilm-mate-v1/staging-browser-qa/staging-browser-qa-report.json',
  'docs/NOOR_MASTER_ROADMAP.md',
  'docs/NOOR_PRODUCTION_CDN_PROMOTION.md',
  'docs/SPRINT_25_SCOPE.md',
  'docs/LOCAL_TESTING_SPRINT_25.md',
  'docs/SPRINT_27_10_STAGING_CDN_ACCEPTANCE.md',
  'docs/SPRINT_27_11_STAGING_BROWSER_QA.md',
  'docs/SPRINT_27_12_RELEASE_METADATA.md',
  'docs/SPRINT_27_13_PRODUCTION_CDN_APPROVAL_GATE.md',
  'docs/SPRINT_27_14_PRODUCTION_CDN_PROMOTION.md',
  '.github/workflows/noor-ci.yml',
  'RELEASE_NOTES.md',
  'CHANGELOG.md',
  'docs/SPRINT_27_15_PRODUCTION_CDN_RUNTIME_QA.md',
  'docs/SPRINT_27_16_PRODUCTION_MODE_DEFAULT.md',
  'scripts/generate-noor-production-env-finalization.mjs',
  'scripts/check-noor-production-env-finalization.mjs',
  'scripts/apply-sprint27-16-package-scripts.mjs',
  'content-pipeline/production-cdn/environment-finalization/noor-production-env-finalization.json',
  'content-pipeline/production-cdn/environment-finalization/noor-production-env-finalization.md',
  'content-pipeline/production-cdn/environment-finalization/.env.production.noor-cdn-main.example',
  'content-pipeline/production-cdn/environment-finalization/.env.local.production-noor-cdn-main.example',
  'content-pipeline/production-cdn/environment-finalization/vercel-production-env.md'
];

const missing = requiredFiles.filter((file) => !existsSync(file));
if (missing.length > 0) {
  console.error('Missing required NOOR Sprint 0-27.14 files:');
  for (const file of missing) console.error(`- ${file}`);
  process.exit(1);
}

const pkg = readJson('package.json');
for (const script of [
  'check:pack',
  'check:content',
  'check:release',
  'check:runtime',
  'check:review-console',
  'check:production-promotion',
  'check:roadmap',
  'review:console',
  'production:promote',
  'roadmap:status',
  'search:build-cdn-index',
  'cdn:pack',
  'cdn:verify',
  'check:sprint27-10',
  'check:sprint27-11',
  'check:sprint27-12',
  'production:approval-gate',
  'check:production-approval-gate',
  'check:sprint27-13',
  'production:cdn-promotion-plan',
  'check:production-cdn-promotion-plan',
  'production:cdn-record-promotion',
  'check:production-cdn-promoted',
  'check:sprint27-14',
  'production:env-finalization',
  'check:production-env-finalization',
  'check:sprint27-16'
]) {
  if (!pkg.scripts?.[script]) fail(`package.json missing script: ${script}`);
}

const appVersion = read('apps/web/lib/app-version.ts');
if (!appVersion.includes(`NOOR_APP_VERSION = '${EXPECTED_VERSION}'`)) fail(`NOOR app version must be ${EXPECTED_VERSION}.`);
if (!appVersion.includes('Sprint 27.12') || !appVersion.includes('Release metadata')) {
  fail('NOOR app version metadata must mention Sprint 27.12 release metadata.');
}

const versionJson = readJson('apps/web/public/version.json');
if (versionJson.version !== EXPECTED_VERSION) fail(`version.json must be ${EXPECTED_VERSION}.`);
if (!String(versionJson.label ?? '').includes('Sprint 27.12')) fail('version.json label must mention Sprint 27.12.');

const settings = read('apps/web/app/settings/page.tsx');
for (const expected of [
  'RoadmapControlCard',
  'ProductionCdnPromotionCard',
  'ProductionCdnApprovalGateCard',
  'ScholarlyReviewConsoleCard',
  'QuranSourceGateCard',
  'QuranImportCard',
  'TafseerImportCard',
  'HadithImportCard',
  'SourceIntakeCard',
  'RuntimeContentSourceCard',
  'NoorCdnStagingAcceptanceCard',
  'NoorStagingBrowserQaCard'
]) {
  if (!settings.includes(expected)) fail(`settings page must render ${expected}`);
}

const promotion = readJson('content-pipeline/production-cdn/noor-production-cdn-promotion.json');
if (promotion.status !== 'blocked') fail('Production CDN promotion must remain blocked.');
if (promotion.productionPromotionAllowed !== false || promotion.runtimeDefault !== 'bundled') {
  fail('Production CDN promotion must keep bundled runtime default until review approval.');
}


const productionApprovalGate = readJson('content-pipeline/production-cdn/approval-gate/noor-production-cdn-approval-gate.json');
if (productionApprovalGate.sprint !== '27.13') fail('Sprint 27.13 approval gate file must declare sprint 27.13.');
if (productionApprovalGate.approvalStatus !== 'approved_for_promotion') fail('Sprint 27.13 production approval gate must be approved before check:pack passes.');
if (productionApprovalGate.productionPromotionAllowed !== true) fail('Sprint 27.13 production promotion approval must allow the next promotion sprint.');
if (productionApprovalGate.promotionExecuted !== false || productionApprovalGate.noorCdnMainTouched !== false) {
  fail('Sprint 27.13 must approve promotion without touching noor-cdn/main.');
}


const productionExecution = readJson('content-pipeline/production-cdn/promotion-execution/noor-cdn-production-promotion-execution.json');
if (productionExecution.sprint !== '27.14') fail('Sprint 27.14 production CDN execution file must declare sprint 27.14.');
if (productionExecution.promotionStatus !== 'production_promoted') fail('Sprint 27.14 production CDN execution must be production_promoted.');
if (productionExecution.promotionExecuted !== true || productionExecution.noorCdnMainTouched !== true) {
  fail('Sprint 27.14 must record that noor-cdn/main was touched and promoted.');
}
if (productionExecution.sourceBranch !== 'noor-cdn/staging-ilm-mate-v1') fail('Sprint 27.14 source branch must be noor-cdn/staging-ilm-mate-v1.');
if (productionExecution.targetBranch !== 'noor-cdn/main') fail('Sprint 27.14 target branch must be noor-cdn/main.');
if (productionExecution.requiredFailures?.length > 0) fail('Sprint 27.14 production execution must have no required failures.');
if (productionExecution.gitComparison?.stagingCommitsMissingFromMain !== 0) fail('noor-cdn/main must contain all staging branch commits.');

const stagingAcceptance = readJson('content-pipeline/review/ilm-mate-v1/staging-cdn-acceptance/staging-cdn-acceptance-report.json');
if (stagingAcceptance.acceptedForStaging !== true) fail('Sprint 27.10 staging CDN acceptance must remain accepted for staging.');

const browserQa = readJson('content-pipeline/review/ilm-mate-v1/staging-browser-qa/staging-browser-qa-report.json');
if (browserQa.status !== 'accepted_for_staging_browser_qa') fail('Sprint 27.11 browser QA must remain accepted for staging browser QA.');

const roadmap = read('apps/web/lib/roadmap.ts');
for (const expected of ['currentSprint', 'Sprint 27.12', 'Release metadata', 'Sprint 28']) {
  if (!roadmap.includes(expected)) fail(`roadmap.ts missing ${expected}`);
}

const generatedRoadmap = readJson('content-pipeline/roadmap/noor-roadmap-status.json');
if (generatedRoadmap.version !== EXPECTED_VERSION) fail(`Roadmap generated version must be ${EXPECTED_VERSION}.`);
if (generatedRoadmap.currentSprint?.sprint !== 'Sprint 27.12') fail('Current roadmap sprint must be Sprint 27.12.');
if (!generatedRoadmap.completedSprints?.includes('Sprint 27.11')) fail('Roadmap must mark Sprint 27.11 complete.');
if (generatedRoadmap.futureSprints?.[0]?.sprint !== 'Sprint 28') fail('Roadmap next sprint must be Sprint 28.');

const ci = read('.github/workflows/noor-ci.yml');
for (const expected of [
  'pnpm review:console',
  'pnpm check:review-console',
  'pnpm production:promote',
  'pnpm check:production-promotion',
  'pnpm roadmap:status',
  'pnpm check:roadmap'
]) {
  if (!ci.includes(expected)) fail(`CI workflow missing ${expected}`);
}

const releaseNotes = read('RELEASE_NOTES.md') + read('CHANGELOG.md') + read('apps/web/lib/release-notes.ts');
if (!releaseNotes.includes('0.27.12') || !releaseNotes.includes('Sprint 27.12')) {
  fail('Release notes/changelog must include v0.27.12 Sprint 27.12 entry.');
}
if (!includesAny(releaseNotes, ['Release metadata', 'staging CDN QA', 'Staging CDN'])) {
  fail('Release notes/changelog must mention Sprint 27.12 release metadata and staging CDN QA.');
}
if (!releaseNotes.includes('0.26.0') || !releaseNotes.includes('CDN search index')) {
  fail('Release notes/changelog must preserve v0.26.0 Sprint 26 history.');
}

const searchPanel = read('apps/web/components/SearchPanel.tsx');
const searchPackage = read('packages/noor-search/src/index.ts');
const searchIndexBuilder = read('scripts/build-noor-cdn-search-index.mjs');
if (!includesAny(searchPanel, [
  'External CDN search index',
  'CDN search index',
  'search/search-index.json',
  'noor.contentSource.v1',
  'NOOR_CONTENT_SOURCE_LOCAL_STORAGE_KEY',
  'loadNoorSearchIndex'
])) {
  fail('SearchPanel must include CDN search support.');
}
if (!includesAny(searchPackage, ['searchNoor', 'searchNoorLocal', 'NoorSearchIndex', 'NoorSearchEntry', 'rank'])) {
  fail('packages/noor-search must expose NOOR search helpers.');
}
if (!includesAny(searchIndexBuilder, ['search-index.json', 'quran', 'tafseer', 'hadith'])) {
  fail('CDN search index builder must generate Quran, tafseer and hadith search index data.');
}

const cdnSearchCandidates = [
  'content-pipeline/dist/noor-cdn/search/search-index.json',
  'content-pipeline/publish/noor-cdn-gh-pages/noor-cdn/search/search-index.json',
  'apps/web/public/noor-cdn/search/search-index.json'
];
if (!cdnSearchCandidates.some((file) => existsSync(file))) {
  fail('Generated CDN search index missing. Run pnpm content:prepare and pnpm search:build-cdn-index.');
}


const productionEnvFinalization = readJson('content-pipeline/production-cdn/environment-finalization/noor-production-env-finalization.json');
if (productionEnvFinalization.sprint !== '27.16') fail('Sprint 27.16 production environment finalization file must declare sprint 27.16.');
if (productionEnvFinalization.status !== 'production_runtime_default_finalized') fail('Sprint 27.16 production environment finalization must be finalized.');
if (productionEnvFinalization.productionRuntimeDefault !== 'cdn') fail('Sprint 27.16 production runtime default must be cdn.');
if (productionEnvFinalization.developmentRuntimeDefault !== 'mock') fail('Sprint 27.16 development runtime default must remain mock.');
if (productionEnvFinalization.requiredFailures?.length > 0) fail('Sprint 27.16 production environment finalization must have no required failures.');

const noorDataConfigSource = read('packages/noor-data/src/config.ts');
for (const expected of [
  "const PRODUCTION_NOOR_DATA_MODE: NoorDataMode = 'cdn'",
  "const DEVELOPMENT_NOOR_DATA_MODE: NoorDataMode = 'mock'",
  'function getDefaultNoorDataMode()',
  'process.env?.NODE_ENV',
  "sourceOverride ?? env('NEXT_PUBLIC_NOOR_DATA_MODE', getDefaultNoorDataMode())",
  'https://cdn.jsdelivr.net/gh/EffortEdutech/noor-cdn@main/noor-cdn'
]) {
  if (!noorDataConfigSource.includes(expected)) fail(`Sprint 27.16 production mode default missing: ${expected}`);
}


console.log('NOOR Sprint 0-27.16 pack check passed.');
