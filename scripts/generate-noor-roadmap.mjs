import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

const outDir = join('content-pipeline', 'roadmap');
const versionText = readFileSync('apps/web/lib/app-version.ts', 'utf8');
const versionMatch = versionText.match(/NOOR_APP_VERSION = '([^']+)'/);
const labelMatch = versionText.match(/NOOR_APP_BUILD_LABEL = '([^']+)'/);
const currentVersion = versionMatch?.[1] ?? 'unknown';
const buildLabel = labelMatch?.[1] ?? 'unknown';

const roadmap = {
  generatedAt: new Date().toISOString(),
  currentVersion,
  buildLabel,
  currentSprint: 'Sprint 18',
  currentPhase: 'Phase 3 — Production content readiness',
  completed: [
    'Sprint 0-2 — Repo foundation, data contracts, design system and app shell',
    'Sprint 3-8 — Core reader, search, journeys, studio, PWA and content integrity',
    'Sprint 9-11 — Reader preferences, local backup, release automation and changelog',
    'Sprint 12-17 — Content pipeline, CDN runtime, publish/smoke/promotion and source governance'
  ],
  next: 'Sprint 19 — Production source intake templates',
  future: [
    'Sprint 20 — Quran importer adapter v1',
    'Sprint 21 — Tafseer importer adapter v1',
    'Sprint 22 — Hadith importer adapter v1',
    'Sprint 23 — Scholarly review workflow',
    'Sprint 24 — Production CDN release candidate',
    'Sprint 25 — Optional learner accounts and sync planning'
  ],
  guardrails: [
    'Zero-budget/local-first stays the Phase 1 default.',
    'Demo content stays blocked from production promotion.',
    'Production Quran, tafseer and hadith sources require licensing, attribution and scholarly sign-off.',
    'Every sprint updates version, release notes, docs and validation checks.'
  ],
  commands: [
    'pnpm roadmap:status',
    'pnpm check:roadmap',
    'pnpm check:pack',
    'pnpm check:release',
    'pnpm typecheck',
    'pnpm build'
  ]
};

mkdirSync(outDir, { recursive: true });
writeFileSync(join(outDir, 'noor-roadmap-status.json'), JSON.stringify(roadmap, null, 2) + '\n');

const md = `# NOOR Roadmap Status\n\nGenerated: ${roadmap.generatedAt}\n\nCurrent version: **v${roadmap.currentVersion}**\n\nBuild label: **${roadmap.buildLabel}**\n\n## Current Sprint\n\n${roadmap.currentSprint}\n\n## Completed\n\n${roadmap.completed.map((item) => `- ${item}`).join('\n')}\n\n## Next\n\n- ${roadmap.next}\n\n## Future\n\n${roadmap.future.map((item) => `- ${item}`).join('\n')}\n\n## Guardrails\n\n${roadmap.guardrails.map((item) => `- ${item}`).join('\n')}\n`;
writeFileSync(join(outDir, 'noor-roadmap-status.md'), md);

console.log(`NOOR roadmap status generated for v${currentVersion}.`);
console.log(`- ${join(outDir, 'noor-roadmap-status.json')}`);
console.log(`- ${join(outDir, 'noor-roadmap-status.md')}`);
