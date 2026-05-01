import { existsSync, readFileSync } from 'node:fs';

const EXPECTED_VERSION = '0.26.0';

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
for (const expected of ['Sprint 26', 'CDN search index', 'Sprint 27', 'Reader experience from approved content']) {
  if (!roadmapTs.includes(expected)) fail(`roadmap.ts missing ${expected}`);
}

const generated = JSON.parse(read('content-pipeline/roadmap/noor-roadmap-status.json'));
if (generated.version !== EXPECTED_VERSION) fail(`Roadmap generated version must be ${EXPECTED_VERSION}.`);
if (generated.currentSprint?.sprint !== 'Sprint 26') fail('Current roadmap sprint must be Sprint 26.');
if (!generated.completedSprints?.includes('Sprint 25')) fail('Roadmap must mark Sprint 25 complete.');
if (generated.futureSprints?.[0]?.sprint !== 'Sprint 27') fail('Roadmap next sprint must be Sprint 27.');
for (const command of ['pnpm search:build-cdn-index', 'pnpm production:promote', 'pnpm check:production-promotion', 'pnpm review:console']) {
  if (!generated.commands?.includes(command)) fail(`Roadmap commands must include ${command}.`);
}

console.log('NOOR Sprint 26 roadmap check passed.');
