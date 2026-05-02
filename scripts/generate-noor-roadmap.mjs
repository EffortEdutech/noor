import { mkdirSync, writeFileSync } from 'node:fs';
import path from 'node:path';

const roadmap = {
  version: '0.27.12',
  generatedAt: new Date().toISOString(),
  currentPhase: 'Phase 3 — Staging CDN validation and release governance',
  currentSprint: {
    sprint: 'Sprint 27.12',
    title: 'Release metadata and staging CDN QA',
    status: 'current',
    objective: 'Update NOOR version metadata, changelog, release notes and roadmap after staging CDN acceptance and browser QA, while keeping production CDN promotion blocked.'
  },
  completedSprints: [
    'Sprint 18',
    'Sprint 19',
    'Sprint 20',
    'Sprint 21',
    'Sprint 22',
    'Sprint 23',
    'Sprint 24',
    'Sprint 25',
    'Sprint 26',
    'Sprint 27.9.2',
    'Sprint 27.9.3',
    'Sprint 27.10',
    'Sprint 27.11'
  ],
  futureSprints: [
    { sprint: 'Sprint 28', title: 'Quality assurance and regression hardening', status: 'next' },
    { sprint: 'Sprint 29', title: 'Public beta release candidate', status: 'future' },
    { sprint: 'Sprint 30', title: 'Production content promotion review', status: 'future' }
  ],
  commands: [
    'pnpm roadmap:status',
    'pnpm check:release',
    'pnpm check:roadmap',
    'pnpm check:pack',
    'pnpm check:sprint27-10',
    'pnpm check:sprint27-11',
    'pnpm check:sprint27-12'
  ]
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
console.log('NOOR Sprint 27.12 roadmap status generated.');
