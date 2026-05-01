import { mkdirSync, writeFileSync } from 'node:fs';
import path from 'node:path';

const roadmap = {
  version: '0.26.0',
  generatedAt: new Date().toISOString(),
  currentPhase: 'Phase 3 — Production content pipeline and source governance',
  currentSprint: {
    sprint: 'Sprint 26',
    title: 'CDN search index',
    status: 'current',
    objective: 'Generate and consume a lightweight search index from published CDN Quran, tafseer and hadith content while preserving bundled fallback safety.'
  },
  completedSprints: ['Sprint 18','Sprint 19','Sprint 20','Sprint 21','Sprint 22','Sprint 23','Sprint 24','Sprint 25'],
  futureSprints: [
    { sprint: 'Sprint 27', title: 'Reader experience from approved content', status: 'next' },
    { sprint: 'Sprint 28', title: 'Quality assurance and regression hardening', status: 'future' },
    { sprint: 'Sprint 29', title: 'Public beta release candidate', status: 'future' }
  ],
  commands: ['pnpm roadmap:status','pnpm review:console','pnpm check:review-console','pnpm production:promote','pnpm check:production-promotion','pnpm search:build-cdn-index','pnpm check:release','pnpm check:roadmap','pnpm check:pack']
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
console.log('NOOR Sprint 26 roadmap status generated.');
