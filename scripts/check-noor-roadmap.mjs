import { existsSync, readFileSync } from 'node:fs';

const EXPECTED_VERSION = '0.27.12';

function fail(message) {
  console.error(message);
  process.exit(1);
}
function read(file) { return readFileSync(file, 'utf8'); }

for (const file of [
  'apps/web/lib/roadmap.ts',
  'scripts/generate-noor-roadmap.mjs',
  'content-pipeline/roadmap/noor-roadmap-status.json',
  'content-pipeline/roadmap/noor-roadmap-status.md',
  'docs/NOOR_MASTER_ROADMAP.md',
  'docs/NOOR_PRODUCTION_CDN_PROMOTION.md'
]) {
  if (!existsSync(file)) fail(`Missing roadmap file: ${file}`);
}

const roadmapTs = read('apps/web/lib/roadmap.ts');
for (const expected of ['Sprint 27.12', 'Release metadata', 'staging CDN QA', 'Sprint 28']) {
  if (!roadmapTs.includes(expected)) fail(`roadmap.ts missing ${expected}`);
}

const generated = JSON.parse(read('content-pipeline/roadmap/noor-roadmap-status.json'));
if (generated.version !== EXPECTED_VERSION) fail(`Roadmap generated version must be ${EXPECTED_VERSION}.`);
if (generated.currentSprint?.sprint !== 'Sprint 27.12') fail('Current roadmap sprint must be Sprint 27.12.');
if (!generated.completedSprints?.includes('Sprint 27.11')) fail('Roadmap must mark Sprint 27.11 complete.');
if (!generated.completedSprints?.includes('Sprint 26')) fail('Roadmap must preserve Sprint 26 as complete.');
if (generated.futureSprints?.[0]?.sprint !== 'Sprint 28') fail('Roadmap next sprint must be Sprint 28.');
for (const command of ['pnpm check:release', 'pnpm check:roadmap', 'pnpm check:pack', 'pnpm check:sprint27-11']) {
  if (!generated.commands?.includes(command)) fail(`Roadmap commands must include ${command}.`);
}

console.log('NOOR Sprint 27.12 roadmap check passed.');
