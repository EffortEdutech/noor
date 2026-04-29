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
  'apps/web/lib/local-store.ts',
  'apps/web/lib/use-bookmarks.ts',
  'apps/web/lib/use-reading-progress.ts',
  'apps/web/lib/use-journey-progress.ts',
  'apps/web/components/ContinueReadingCard.tsx',
  'apps/web/components/ContinueJourneyCard.tsx',
  'apps/web/components/ReadingProgressPanel.tsx',
  'apps/web/components/JourneyList.tsx',
  'apps/web/components/JourneyStepCard.tsx',
  'apps/web/components/JourneyProgressSummary.tsx',
  'apps/web/components/JourneyProgressPanel.tsx',
  'apps/web/components/SearchPanel.tsx',
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
  'docs/SPRINT_5_SCOPE.md'
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

console.log('NOOR Sprint 0-5 pack check passed.');
