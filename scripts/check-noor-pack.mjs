import { existsSync, readFileSync } from 'node:fs';

const required = [
  'package.json',
  'pnpm-workspace.yaml',
  'apps/web/package.json',
  'apps/web/app/layout.tsx',
  'apps/web/app/today/page.tsx',
  'apps/web/app/learn/quran/page.tsx',
  'apps/web/app/learn/quran/[surah]/page.tsx',
  'packages/noor-data/src/index.ts',
  'packages/noor-ui/src/index.ts',
  'packages/noor-content/src/index.ts',
  'packages/noor-search/src/index.ts',
  'docs/DATA_CONTRACTS.md'
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

console.log('NOOR Sprint 0-2 pack check passed.');
