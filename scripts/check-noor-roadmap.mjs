import { existsSync, readFileSync } from 'node:fs';

const EXPECTED_VERSION = '0.21.0';

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
for (const expected of ['Sprint 21', 'Quran production source selection gate', 'Sprint 22', 'Tafseer importer adapter v1', 'Hadith importer adapter v1']) {
  if (!roadmapTs.includes(expected)) fail(`roadmap.ts missing ${expected}`);
}

const generated = JSON.parse(read('content-pipeline/roadmap/noor-roadmap-status.json'));
if (generated.version !== EXPECTED_VERSION) fail(`Roadmap generated version must be ${EXPECTED_VERSION}.`);
if (generated.currentSprint?.sprint !== 'Sprint 21') fail('Current roadmap sprint must be Sprint 21.');
if (!generated.completedSprints?.includes('Sprint 20')) fail('Roadmap must mark Sprint 20 complete.');
if (generated.futureSprints?.[0]?.sprint !== 'Sprint 22') fail('Roadmap next sprint must be Sprint 22.');
for (const command of ['pnpm quran:gate', 'pnpm check:quran-source-gate', 'pnpm quran:import']) {
  if (!generated.commands?.includes(command)) fail(`Roadmap commands must include ${command}.`);
}

const docs = read('docs/NOOR_MASTER_ROADMAP.md');
if (!docs.includes('Sprint 21') || !docs.includes('Sprint 22')) {
  fail('NOOR_MASTER_ROADMAP.md must include Sprint 21 and Sprint 22.');
}

console.log('NOOR Sprint 21 roadmap check passed.');
