export type NoorRoadmapSprintStatus = 'complete' | 'current' | 'next' | 'future';

export type NoorRoadmapSprint = {
  sprint: string;
  title: string;
  status: NoorRoadmapSprintStatus;
  objective: string;
};

export const NOOR_MASTER_ROADMAP = {
  version: '0.25.0',
  label: 'NOOR Master Blueprint & Roadmap',
  currentPhase: 'Phase 3 — Production content pipeline and source governance',
  generatedRoot: 'content-pipeline/roadmap',
  currentSprint: {
    sprint: 'Sprint 25',
    title: 'Production CDN v1 promotion',
    status: 'current',
    objective: 'Generate a safe production CDN v1 promotion candidate and environment preview while keeping runtime defaults bundled until scholarly review and source gates are approved.'
  } satisfies NoorRoadmapSprint,
  completedSprints: [
    { sprint: 'Sprint 24', title: 'Scholarly review console', status: 'complete', objective: 'Add reviewer checklist, sign-off metadata and source approval evidence UI.' },
    { sprint: 'Sprint 23', title: 'Hadith importer adapter v1', status: 'complete', objective: 'Normalize hadith fixture output while production remains blocked.' },
    { sprint: 'Sprint 22', title: 'Tafseer importer adapter v1', status: 'complete', objective: 'Normalize tafseer fixture output while production remains blocked.' },
    { sprint: 'Sprint 21', title: 'Quran production source selection gate', status: 'complete', objective: 'Keep production Quran import blocked until source approval is complete.' },
    { sprint: 'Sprint 20', title: 'Quran importer adapter v1', status: 'complete', objective: 'Normalize Quran fixture output while production remains blocked.' },
    { sprint: 'Sprint 19', title: 'Production source intake templates', status: 'complete', objective: 'Capture Quran, tafseer and hadith candidate source records before importer work.' },
    { sprint: 'Sprint 18', title: 'Roadmap control center', status: 'complete', objective: 'Make roadmap status visible and testable.' }
  ] satisfies NoorRoadmapSprint[],
  futureSprints: [
    { sprint: 'Sprint 26', title: 'Search index from production content', status: 'next', objective: 'Generate a lightweight search index from approved Quran, tafseer and hadith production content.' },
    { sprint: 'Sprint 27', title: 'Reader experience from approved content', status: 'future', objective: 'Connect approved content into richer reading, tafseer and hadith study journeys.' },
    { sprint: 'Sprint 28', title: 'Quality assurance and regression hardening', status: 'future', objective: 'Add content QA reports, route regression checks and release hardening.' },
    { sprint: 'Sprint 29', title: 'Public beta release candidate', status: 'future', objective: 'Prepare NOOR for controlled public beta.' }
  ] satisfies NoorRoadmapSprint[],
  docs: [
    'docs/NOOR_MASTER_ROADMAP.md',
    'docs/NOOR_PRODUCTION_CDN_PROMOTION.md',
    'docs/SPRINT_25_SCOPE.md',
    'docs/LOCAL_TESTING_SPRINT_25.md'
  ],
  commands: [
    'pnpm roadmap:status',
    'pnpm review:console',
    'pnpm check:review-console',
    'pnpm production:promote',
    'pnpm check:production-promotion',
    'pnpm check:roadmap',
    'pnpm check:pack'
  ]
};
