import { existsSync, readFileSync } from 'node:fs';

const EXPECTED_VERSION = '0.20.0';

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
for (const expected of ['Sprint 20', 'Quran importer adapter v1', 'Sprint 21', 'Tafseer importer adapter v1', 'Hadith importer adapter v1']) {
  if (!roadmapTs.includes(expected)) fail(`roadmap.ts missing ${expected}`);
}

const generated = JSON.parse(read('content-pipeline/roadmap/noor-roadmap-status.json'));
if (generated.version !== EXPECTED_VERSION) fail(`Roadmap generated version must be ${EXPECTED_VERSION}.`);
if (generated.currentSprint?.sprint !== 'Sprint 20') fail('Current roadmap sprint must be Sprint 20.');
if (!generated.completedSprints?.includes('Sprint 19')) fail('Roadmap must mark Sprint 19 complete.');
if (generated.futureSprints?.[0]?.sprint !== 'Sprint 21') fail('Roadmap next sprint must be Sprint 21.');
if (!generated.commands?.includes('pnpm quran:import')) fail('Roadmap commands must include pnpm quran:import.');

const docs = read('docs/NOOR_MASTER_ROADMAP.md');
if (!docs.includes('Sprint 20') || !docs.includes('Sprint 21')) {
  fail('NOOR_MASTER_ROADMAP.md must include Sprint 20 and Sprint 21.');
}

console.log('NOOR Sprint 20 roadmap check passed.');
