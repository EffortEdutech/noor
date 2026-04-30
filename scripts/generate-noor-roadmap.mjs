import { mkdirSync, writeFileSync } from 'node:fs';
import path from 'node:path';

const roadmap = {
  version: '0.25.0',
  generatedAt: new Date().toISOString(),
  currentPhase: 'Phase 3 — Production content pipeline and source governance',
  currentSprint: {
    sprint: 'Sprint 25',
    title: 'Production CDN v1 promotion',
    status: 'current',
    objective: 'Generate a safe production CDN v1 promotion candidate and environment preview while keeping runtime defaults bundled until scholarly review and source gates are approved.'
  },
  completedSprints: ['Sprint 18','Sprint 19','Sprint 20','Sprint 21','Sprint 22','Sprint 23','Sprint 24'],
  futureSprints: [
    { sprint: 'Sprint 26', title: 'Search index from production content', status: 'next' },
    { sprint: 'Sprint 27', title: 'Reader experience from approved content', status: 'future' },
    { sprint: 'Sprint 28', title: 'Quality assurance and regression hardening', status: 'future' },
    { sprint: 'Sprint 29', title: 'Public beta release candidate', status: 'future' }
  ],
  commands: ['pnpm roadmap:status','pnpm review:console','pnpm check:review-console','pnpm production:promote','pnpm check:production-promotion','pnpm check:roadmap','pnpm check:pack']
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
console.log('NOOR Sprint 25 roadmap status generated.');
