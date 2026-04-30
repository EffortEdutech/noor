import { mkdirSync, writeFileSync } from 'node:fs';
import path from 'node:path';

const roadmap = {
  version: '0.20.0',
  generatedAt: new Date().toISOString(),
  currentPhase: 'Phase 3 — Production content pipeline and source governance',
  currentSprint: {
    sprint: 'Sprint 20',
    title: 'Quran importer adapter v1',
    status: 'current',
    objective: 'Normalize a vetted Quran-like source fixture into NOOR CDN-style surah index and per-surah JSON while keeping production release blocked until source approval is complete.'
  },
  completedSprints: [
    'Sprint 0','Sprint 1','Sprint 2','Sprint 3','Sprint 4','Sprint 5','Sprint 6','Sprint 7','Sprint 8','Sprint 9','Sprint 10','Sprint 11','Sprint 11.5','Sprint 12','Sprint 13','Sprint 14','Sprint 15','Sprint 16','Sprint 17','Sprint 18','Sprint 19'
  ],
  futureSprints: [
    { sprint: 'Sprint 21', title: 'Quran production source selection gate', status: 'next' },
    { sprint: 'Sprint 22', title: 'Tafseer importer adapter v1', status: 'future' },
    { sprint: 'Sprint 23', title: 'Hadith importer adapter v1', status: 'future' },
    { sprint: 'Sprint 24', title: 'Scholarly review console', status: 'future' },
    { sprint: 'Sprint 25', title: 'Production CDN v1 promotion', status: 'future' }
  ],
  commands: ['pnpm roadmap:status', 'pnpm quran:import', 'pnpm check:quran-import', 'pnpm check:roadmap', 'pnpm check:pack']
};

const outputRoot = 'content-pipeline/roadmap';
mkdirSync(outputRoot, { recursive: true });
writeFileSync(path.join(outputRoot, 'noor-roadmap-status.json'), `${JSON.stringify(roadmap, null, 2)}\n`, 'utf8');

const markdown = `# NOOR Roadmap Status

Version: ${roadmap.version}
Generated: ${roadmap.generatedAt}
Current phase: ${roadmap.currentPhase}

## Current Sprint

${roadmap.currentSprint.sprint} — ${roadmap.currentSprint.title}

Status: ${roadmap.currentSprint.status}

${roadmap.currentSprint.objective}

## Completed

${roadmap.completedSprints.map((sprint) => `- ${sprint}`).join('\n')}

## Future

${roadmap.futureSprints.map((sprint) => `- ${sprint.sprint} — ${sprint.title} (${sprint.status})`).join('\n')}

## Commands

${roadmap.commands.map((command) => `- \`${command}\``).join('\n')}
`;
writeFileSync(path.join(outputRoot, 'noor-roadmap-status.md'), markdown, 'utf8');
console.log('NOOR Sprint 20 roadmap status generated.');
