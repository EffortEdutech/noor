import { existsSync, readFileSync } from 'node:fs';

const required = [
  'package.json',
  'pnpm-workspace.yaml',
  'apps/web/package.json',
  'apps/web/app/layout.tsx',
  'apps/web/app/today/page.tsx',
  'apps/web/app/learn/page.tsx',
  'apps/web/app/learn/quran/page.tsx',
  'apps/web/app/learn/quran/[surah]/page.tsx',
  'apps/web/app/explore/page.tsx',
  'apps/web/app/journeys/page.tsx',
  'apps/web/app/journeys/[journey]/page.tsx',
  'apps/web/app/library/page.tsx',
  'apps/web/app/settings/page.tsx',
  'apps/web/app/studio/page.tsx',
  'apps/web/app/changelog/page.tsx',
  'apps/web/lib/local-store.ts',
  'apps/web/lib/local-backup.ts',
  'apps/web/lib/use-bookmarks.ts',
  'apps/web/lib/use-reading-progress.ts',
  'apps/web/lib/use-journey-progress.ts',
  'apps/web/lib/app-version.ts',
  'apps/web/lib/reader-preferences.ts',
  'apps/web/lib/release-notes.ts',
  'apps/web/lib/content-pipeline.ts',
  'apps/web/lib/roadmap.ts',
  'apps/web/lib/runtime-content-source.ts',
  'apps/web/lib/runtime-content-source-constants.ts',
  'apps/web/components/ContinueReadingCard.tsx',
  'apps/web/components/ContinueJourneyCard.tsx',
  'apps/web/components/ReadingProgressPanel.tsx',
  'apps/web/components/ReaderPreferencesPanel.tsx',
  'apps/web/components/LocalBackupCard.tsx',
  'apps/web/components/ReleaseNotesCard.tsx',
  'apps/web/components/ContentPipelineCard.tsx',
  'apps/web/components/RuntimeContentSourceCard.tsx',
  'apps/web/components/CdnPublishCard.tsx',
  'apps/web/components/CdnSmokeTestCard.tsx',
  'apps/web/components/CdnPromotionCard.tsx',
  'apps/web/components/SourceGovernanceCard.tsx',
  'apps/web/components/RoadmapControlCard.tsx',
  'apps/web/components/JourneyList.tsx',
  'apps/web/components/JourneyStepCard.tsx',
  'apps/web/components/JourneyProgressSummary.tsx',
  'apps/web/components/JourneyProgressPanel.tsx',
  'apps/web/components/SearchPanel.tsx',
  'apps/web/components/PwaLifecycleManager.tsx',
  'apps/web/components/PwaStatusCard.tsx',
  'apps/web/components/ContentHealthCard.tsx',
  'apps/web/public/sw.js',
  'apps/web/public/offline.html',
  'apps/web/public/version.json',
  'apps/web/public/noor-cdn/manifest/noor-content-manifest.json',
  'apps/web/public/noor-cdn/metadata/surah-index.json',
  'packages/noor-data/src/index.ts',
  'packages/noor-data/src/config.ts',
  'packages/noor-data/src/fetch-json.ts',
  'packages/noor-data/src/resolvers/daily.ts',
  'packages/noor-data/src/resolvers/journeys.ts',
  'packages/noor-data/src/resolvers/content-health.ts',
  'packages/noor-data/src/resolvers/diagnostics.ts',
  'packages/noor-ui/src/index.ts',
  'packages/noor-ui/src/components/BookmarkButton.tsx',
  'packages/noor-content/src/index.ts',
  'packages/noor-content/src/demo/journeys.ts',
  'packages/noor-content/src/demo/content-manifest.ts',
  'packages/noor-content/src/demo/content-health.ts',
  'packages/noor-search/src/index.ts',
  '.github/workflows/noor-ci.yml',
  '.github/workflows/noor-release.yml',
  'CHANGELOG.md',
  'RELEASE_NOTES.md',
  'docs/DATA_CONTRACTS.md',
  'docs/NOOR_CONTENT_PIPELINE.md',
  'docs/NOOR_RUNTIME_CDN_MODE.md',
  'docs/NOOR_CDN_PUBLISHING.md',
  'docs/NOOR_CDN_SMOKE_TESTING.md',
  'docs/NOOR_CDN_PROMOTION.md',
  'docs/NOOR_SOURCE_GOVERNANCE.md',
  'docs/NOOR_MASTER_ROADMAP.md',
  'docs/SPRINT_3_SCOPE.md',
  'docs/SPRINT_4_SCOPE.md',
  'docs/SPRINT_5_SCOPE.md',
  'docs/SPRINT_6_SCOPE.md',
  'docs/SPRINT_7_SCOPE.md',
  'docs/SPRINT_8_SCOPE.md',
  'docs/SPRINT_9_SCOPE.md',
  'docs/SPRINT_10_SCOPE.md',
  'docs/SPRINT_11_SCOPE.md',
  'docs/SPRINT_12_SCOPE.md',
  'docs/SPRINT_13_SCOPE.md',
  'docs/SPRINT_14_SCOPE.md',
  'docs/SPRINT_15_SCOPE.md',
  'docs/SPRINT_16_SCOPE.md',
  'docs/SPRINT_17_SCOPE.md',
  'docs/SPRINT_18_SCOPE.md',
  'docs/LOCAL_TESTING_SPRINT_12.md',
  'docs/LOCAL_TESTING_SPRINT_13.md',
  'docs/LOCAL_TESTING_SPRINT_14.md',
  'docs/LOCAL_TESTING_SPRINT_15.md',
  'docs/LOCAL_TESTING_SPRINT_16.md',
  'docs/LOCAL_TESTING_SPRINT_17.md',
  'docs/LOCAL_TESTING_SPRINT_18.md',
  'content-pipeline/README.md',
  'content-pipeline/source/noor-demo-v0.12/manifest/noor-content-manifest.json',
  'content-pipeline/source/noor-demo-v0.12/manifest/noor-source-registry.json',
  'content-pipeline/source/noor-demo-v0.12/metadata/surah-index.json',
  'content-pipeline/schemas/noor-content-manifest.schema.json',
  'scripts/validate-noor-cdn.mjs',
  'scripts/prepare-noor-cdn.mjs',
  'scripts/check-noor-runtime.mjs',
  'scripts/build-noor-cdn-publish-pack.mjs',
  'scripts/verify-noor-cdn-publish-pack.mjs',
  'scripts/check-noor-cdn-publish.mjs',
  'scripts/smoke-noor-cdn.mjs',
  'scripts/promote-noor-cdn.mjs',
  'scripts/check-noor-cdn-promotion.mjs',
  'scripts/audit-noor-sources.mjs',
  'scripts/check-noor-source-audit.mjs',
  'scripts/generate-noor-roadmap.mjs',
  'scripts/check-noor-roadmap.mjs',
  '.env.example'
];

const missing = required.filter((file) => !existsSync(file));
if (missing.length > 0) {
  console.error('Missing required files:');
  for (const file of missing) console.error(`- ${file}`);
  process.exit(1);
}

const rootPkg = JSON.parse(readFileSync('package.json', 'utf8'));
for (const script of [
  'check:content',
  'check:release',
  'check:runtime',
  'check:cdn-publish',
  'check:cdn-smoke',
  'check:cdn-promotion',
  'check:source-audit',
  'check:roadmap',
  'content:validate',
  'content:prepare',
  'cdn:pack',
  'cdn:verify',
  'cdn:smoke',
  'cdn:promote',
  'source:audit',
  'source:gate',
  'roadmap:status'
]) {
  if (!rootPkg.scripts?.[script]) {
    console.error(`Root package.json must include ${script} script.`);
    process.exit(1);
  }
}

const webPkg = JSON.parse(readFileSync('apps/web/package.json', 'utf8'));
if (!webPkg.scripts?.dev?.includes('-p 3200')) {
  console.error('apps/web dev script must use port 3200.');
  process.exit(1);
}

const appVersion = readFileSync('apps/web/lib/app-version.ts', 'utf8');
if (!appVersion.includes("NOOR_APP_VERSION = '0.18.0'")) {
  console.error('Sprint 18 must update NOOR app version to 0.18.0.');
  process.exit(1);
}

const versionJson = JSON.parse(readFileSync('apps/web/public/version.json', 'utf8'));
if (versionJson.version !== '0.18.0') {
  console.error('version.json must be updated to 0.18.0.');
  process.exit(1);
}

const runtimeSource = readFileSync('apps/web/lib/runtime-content-source.ts', 'utf8');
const runtimeSourceConstants = readFileSync('apps/web/lib/runtime-content-source-constants.ts', 'utf8');
if (!runtimeSource.includes('NOOR_CONTENT_SOURCE_COOKIE') || !runtimeSourceConstants.includes('noor.contentSource.v1')) {
  console.error('Sprint 13 runtime content source cookie must be configured.');
  process.exit(1);
}

const dataConfig = readFileSync('packages/noor-data/src/config.ts', 'utf8');
if (!dataConfig.includes("'local-cdn'") || !dataConfig.includes('NEXT_PUBLIC_NOOR_LOCAL_CDN_BASE')) {
  console.error('Sprint 13 data config must support local-cdn mode.');
  process.exit(1);
}

const contentPipeline = readFileSync('apps/web/lib/content-pipeline.ts', 'utf8');
for (const expected of [
  'NOOR_CDN_PUBLISHING',
  'NOOR_CDN_SMOKE_TESTING',
  'NOOR_CDN_PROMOTION',
  'NOOR_SOURCE_GOVERNANCE',
  'cdn:smoke',
  'cdn:promote',
  'source:audit'
]) {
  if (!contentPipeline.includes(expected)) {
    console.error(`content-pipeline.ts must include ${expected}.`);
    process.exit(1);
  }
}

const smokeScript = readFileSync('scripts/smoke-noor-cdn.mjs', 'utf8');
if (!smokeScript.includes('REQUIRED_PATHS') || !smokeScript.includes('manifest/noor-content-health.json')) {
  console.error('Sprint 15 CDN smoke script must verify required resolver paths.');
  process.exit(1);
}

const promoteScript = readFileSync('scripts/promote-noor-cdn.mjs', 'utf8');
if (!promoteScript.includes('noor-cdn.env.local') || !promoteScript.includes('NEXT_PUBLIC_NOOR_DATA_MODE')) {
  console.error('Sprint 16 CDN promotion script must generate environment handoff files.');
  process.exit(1);
}

const sourceAuditScript = readFileSync('scripts/audit-noor-sources.mjs', 'utf8');
if (!sourceAuditScript.includes('noor-source-audit.json') || !sourceAuditScript.includes('--require-production')) {
  console.error('Sprint 17 source governance script must generate audit reports and support a production gate.');
  process.exit(1);
}

const settingsPage = readFileSync('apps/web/app/settings/page.tsx', 'utf8');
if (!settingsPage.includes('SourceGovernanceCard')) {
  console.error('Settings page must render the Sprint 17 source governance card.');
  process.exit(1);
}
if (!settingsPage.includes('RoadmapControlCard')) {
  console.error('Settings page must render the Sprint 18 roadmap control card.');
  process.exit(1);
}

const roadmapLib = readFileSync('apps/web/lib/roadmap.ts', 'utf8');
if (!roadmapLib.includes('NOOR_MASTER_ROADMAP') || !roadmapLib.includes('Sprint 19')) {
  console.error('Sprint 18 roadmap library must define the master roadmap and Sprint 19 next step.');
  process.exit(1);
}

const releaseWorkflow = readFileSync('.github/workflows/noor-release.yml', 'utf8');
if (!releaseWorkflow.includes('gh release create')) {
  console.error('Sprint 11 release workflow must create a GitHub Release.');
  process.exit(1);
}

const ciWorkflow = readFileSync('.github/workflows/noor-ci.yml', 'utf8');
for (const expected of [
  'pnpm check:runtime',
  'pnpm check:cdn-publish',
  'pnpm check:cdn-smoke',
  'pnpm check:cdn-promotion',
  'pnpm source:audit',
  'pnpm check:source-audit',
  'pnpm roadmap:status',
  'pnpm check:roadmap'
]) {
  if (!ciWorkflow.includes(expected)) {
    console.error(`NOOR CI must run ${expected}.`);
    process.exit(1);
  }
}

const cdnManifest = JSON.parse(readFileSync('content-pipeline/source/noor-demo-v0.12/manifest/noor-content-manifest.json', 'utf8'));
if (cdnManifest.mode !== 'cdn-ready') {
  console.error('Sprint 12 CDN manifest must be cdn-ready.');
  process.exit(1);
}

const sourceRegistry = JSON.parse(readFileSync('content-pipeline/source/noor-demo-v0.12/manifest/noor-source-registry.json', 'utf8'));
if (!sourceRegistry.productionGate?.includes('Scholar/reviewer sign-off recorded')) {
  console.error('Source registry must include scholarly/reviewer sign-off in production gate.');
  process.exit(1);
}

console.log('NOOR Sprint 0-18 pack check passed.');
