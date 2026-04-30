import { existsSync, readFileSync } from 'node:fs';

const EXPECTED_VERSION = '0.24.0';

function fail(message) {
  console.error(message);
  process.exit(1);
}

function read(file) {
  return readFileSync(file, 'utf8');
}

for (const file of [
  'apps/web/lib/roadmap.ts',
  'apps/web/components/RoadmapControlCard.tsx',
  'scripts/generate-noor-roadmap.mjs',
  'content-pipeline/roadmap/noor-roadmap-status.json',
  'content-pipeline/roadmap/noor-roadmap-status.md',
  'docs/NOOR_MASTER_ROADMAP.md'
]) {
  if (!existsSync(file)) fail(`Missing roadmap file: ${file}`);
}

const roadmapTs = read('apps/web/lib/roadmap.ts');
for (const expected of ['Sprint 24', 'Scholarly review console', 'Sprint 25', 'Production CDN v1 promotion']) {
  if (!roadmapTs.includes(expected)) fail(`roadmap.ts missing ${expected}`);
}

const generated = JSON.parse(read('content-pipeline/roadmap/noor-roadmap-status.json'));
if (generated.version !== EXPECTED_VERSION) fail(`Roadmap generated version must be ${EXPECTED_VERSION}.`);
if (generated.currentSprint?.sprint !== 'Sprint 24') fail('Current roadmap sprint must be Sprint 24.');
if (!generated.completedSprints?.includes('Sprint 23')) fail('Roadmap must mark Sprint 23 complete.');
if (generated.futureSprints?.[0]?.sprint !== 'Sprint 25') fail('Roadmap next sprint must be Sprint 25.');
for (const command of ['pnpm review:console', 'pnpm check:review-console', 'pnpm hadith:import']) {
  if (!generated.commands?.includes(command)) fail(`Roadmap commands must include ${command}.`);
}

const docs = read('docs/NOOR_MASTER_ROADMAP.md');
if (!docs.includes('Sprint 24') || !docs.includes('Sprint 25')) {
  fail('NOOR_MASTER_ROADMAP.md must include Sprint 24 and Sprint 25.');
}

console.log('NOOR Sprint 24 roadmap check passed.');
