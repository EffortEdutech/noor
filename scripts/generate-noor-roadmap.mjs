import { mkdirSync, writeFileSync } from 'node:fs';
import path from 'node:path';

const roadmap = {
  version: '0.24.0',
  generatedAt: new Date().toISOString(),
  currentPhase: 'Phase 3 — Production content pipeline and source governance',
  currentSprint: {
    sprint: 'Sprint 24',
    title: 'Scholarly review console',
    status: 'current',
    objective: 'Add reviewer checklist, sign-off metadata and source approval evidence UI so production Quran, tafseer and hadith promotion stays blocked until documented review evidence is complete.'
  },
  completedSprints: [
    'Sprint 0','Sprint 1','Sprint 2','Sprint 3','Sprint 4','Sprint 5','Sprint 6','Sprint 7','Sprint 8','Sprint 9','Sprint 10','Sprint 11','Sprint 11.5','Sprint 12','Sprint 13','Sprint 14','Sprint 15','Sprint 16','Sprint 17','Sprint 18','Sprint 19','Sprint 20','Sprint 21','Sprint 22','Sprint 23'
  ],
  futureSprints: [
    { sprint: 'Sprint 25', title: 'Production CDN v1 promotion', status: 'next' },
    { sprint: 'Sprint 26', title: 'Search index from production content', status: 'future' },
    { sprint: 'Sprint 27', title: 'Reader experience from approved content', status: 'future' },
    { sprint: 'Sprint 28', title: 'Quality assurance and regression hardening', status: 'future' }
  ],
  commands: ['pnpm roadmap:status', 'pnpm review:console', 'pnpm check:review-console', 'pnpm quran:gate', 'pnpm check:quran-source-gate', 'pnpm quran:import', 'pnpm check:quran-import', 'pnpm tafseer:import', 'pnpm check:tafseer-import', 'pnpm hadith:import', 'pnpm check:hadith-import', 'pnpm check:roadmap', 'pnpm check:pack']
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
console.log('NOOR Sprint 24 roadmap status generated.');
