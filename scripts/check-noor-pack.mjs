import { existsSync, readFileSync } from 'node:fs';

const required = [
  'package.json',
  'pnpm-workspace.yaml',
  'apps/web/package.json',
  'apps/web/app/layout.tsx',
  'apps/web/app/today/page.tsx',
  'apps/web/app/learn/quran/page.tsx',
  'apps/web/app/learn/quran/[surah]/page.tsx',
  'apps/web/app/explore/page.tsx',
  'apps/web/app/library/page.tsx',
  'apps/web/app/studio/page.tsx',
  'apps/web/app/settings/page.tsx',
  'apps/web/app/journeys/page.tsx',
  'apps/web/app/journeys/[journey]/page.tsx',
  'apps/web/lib/local-store.ts',
  'apps/web/lib/use-bookmarks.ts',
  'apps/web/lib/use-reading-progress.ts',
  'apps/web/lib/use-journey-progress.ts',
  'apps/web/lib/studio-share.ts',
  'apps/web/lib/app-version.ts',
  'apps/web/components/ClientShell.tsx',
  'apps/web/components/PwaLifecycleManager.tsx',
  'apps/web/components/PwaStatusCard.tsx',
  'apps/web/components/ContinueReadingCard.tsx',
  'apps/web/components/ContinueJourneyCard.tsx',
  'apps/web/components/ReadingProgressPanel.tsx',
  'apps/web/components/JourneyProgressPanel.tsx',
  'apps/web/components/BookmarkList.tsx',
  'apps/web/components/AyahStudyCard.tsx',
  'apps/web/components/MarkReadingProgressButton.tsx',
  'apps/web/components/SearchPanel.tsx',
  'apps/web/components/JourneyList.tsx',
  'apps/web/components/JourneyStepCard.tsx',
  'apps/web/components/StudioShareComposer.tsx',
  'apps/web/public/manifest.json',
  'apps/web/public/sw.js',
  'apps/web/public/offline.html',
  'apps/web/public/version.json',
  'packages/noor-data/src/index.ts',
  'packages/noor-data/src/resolvers/daily.ts',
  'packages/noor-data/src/resolvers/journeys.ts',
  'packages/noor-ui/src/index.ts',
  'packages/noor-ui/src/components/BookmarkButton.tsx',
  'packages/noor-content/src/index.ts',
  'packages/noor-content/src/demo/journeys.ts',
  'packages/noor-search/src/index.ts',
  'docs/DATA_CONTRACTS.md',
  'docs/SPRINT_3_SCOPE.md',
  'docs/SPRINT_4_SCOPE.md',
  'docs/SPRINT_5_SCOPE.md',
  'docs/SPRINT_6_SCOPE.md',
  'docs/SPRINT_7_SCOPE.md'
];

const missing = required.filter((file) => !existsSync(file));
if (missing.length > 0) {
  console.error('Missing required files:');
  for (const file of missing) console.error(`- ${file}`);
  process.exit(1);
}

const webPkg = JSON.parse(readFileSync('apps/web/package.json', 'utf8'));
if (!webPkg.scripts?.dev?.includes('-p 3200')) {
  console.error('apps/web dev script must use port 3200.');
  process.exit(1);
}

const manifest = JSON.parse(readFileSync('apps/web/public/manifest.json', 'utf8'));
if (manifest.start_url !== '/today' || manifest.display !== 'standalone') {
  console.error('manifest.json must start at /today and use standalone display mode.');
  process.exit(1);
}

const sw = readFileSync('apps/web/public/sw.js', 'utf8');
if (!sw.includes('SKIP_WAITING') || !sw.includes('offline.html')) {
  console.error('sw.js must support SKIP_WAITING updates and offline fallback.');
  process.exit(1);
}

console.log('NOOR Sprint 0-7 pack check passed.');
