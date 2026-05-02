export type NoorRoadmapSprintStatus = 'complete' | 'current' | 'next' | 'future';

export type NoorRoadmapSprint = {
  sprint: string;
  title: string;
  status: NoorRoadmapSprintStatus;
  objective: string;
};

export const NOOR_MASTER_ROADMAP = {
  version: '0.27.12',
  label: 'NOOR Master Blueprint & Roadmap',
  currentPhase: 'Phase 3 — Staging CDN validation and release governance',
  generatedRoot: 'content-pipeline/roadmap',
  currentSprint: {
    sprint: 'Sprint 27.12',
    title: 'Release metadata and staging CDN QA',
    status: 'current',
    objective: 'Update NOOR version metadata, changelog, release notes and roadmap after staging CDN acceptance and browser QA, while keeping production CDN promotion blocked.'
  } satisfies NoorRoadmapSprint,
  completedSprints: [
    { sprint: 'Sprint 27.11', title: 'Staging browser QA', status: 'complete', objective: 'Verify Quran, Tafseer, Hadith and Explore browser behavior against staging CDN.' },
    { sprint: 'Sprint 27.10', title: 'Staging CDN acceptance checklist', status: 'complete', objective: 'Accept staging CDN for reviewer/runtime testing while production remains blocked.' },
    { sprint: 'Sprint 27.9.3', title: 'Tafseer/Hadith CDN reader stabilization', status: 'complete', objective: 'Add Tafseer CDN index support and Hadith view model verification.' },
    { sprint: 'Sprint 27.9.2', title: 'Hadith view model navigation', status: 'complete', objective: 'Separate Hadith by-book and by-chapter behavior to avoid duplicate display keys.' },
    { sprint: 'Sprint 26', title: 'CDN search index', status: 'complete', objective: 'Generate and consume a lightweight search index from published CDN Quran, tafseer and hadith content while preserving bundled fallback safety.' },
    { sprint: 'Sprint 25', title: 'Production CDN v1 promotion', status: 'complete', objective: 'Generate a safe production CDN v1 promotion candidate and environment preview while keeping runtime defaults bundled until scholarly review and source gates are approved.' },
    { sprint: 'Sprint 24', title: 'Scholarly review console', status: 'complete', objective: 'Add reviewer checklist, sign-off metadata and source approval evidence UI.' },
    { sprint: 'Sprint 23', title: 'Hadith importer adapter v1', status: 'complete', objective: 'Normalize hadith fixture output while production remains blocked.' },
    { sprint: 'Sprint 22', title: 'Tafseer importer adapter v1', status: 'complete', objective: 'Normalize tafseer fixture output while production remains blocked.' },
    { sprint: 'Sprint 21', title: 'Quran production source selection gate', status: 'complete', objective: 'Keep production Quran import blocked until source approval is complete.' },
    { sprint: 'Sprint 20', title: 'Quran importer adapter v1', status: 'complete', objective: 'Normalize Quran fixture output while production remains blocked.' },
    { sprint: 'Sprint 19', title: 'Production source intake templates', status: 'complete', objective: 'Capture Quran, tafseer and hadith candidate source records before importer work.' },
    { sprint: 'Sprint 18', title: 'Roadmap control center', status: 'complete', objective: 'Make roadmap status visible and testable.' }
  ] satisfies NoorRoadmapSprint[],
  futureSprints: [
    { sprint: 'Sprint 28', title: 'Quality assurance and regression hardening', status: 'next', objective: 'Add deeper content QA reports, route regression checks, deduplication audits and release hardening.' },
    { sprint: 'Sprint 29', title: 'Public beta release candidate', status: 'future', objective: 'Prepare NOOR for controlled public beta.' },
    { sprint: 'Sprint 30', title: 'Production content promotion review', status: 'future', objective: 'Prepare production promotion only after reviewer/source gates are formally approved.' }
  ] satisfies NoorRoadmapSprint[],
  docs: [
    'docs/NOOR_MASTER_ROADMAP.md',
    'docs/NOOR_PRODUCTION_CDN_PROMOTION.md',
    'docs/SPRINT_27_10_STAGING_CDN_ACCEPTANCE.md',
    'docs/SPRINT_27_11_STAGING_BROWSER_QA.md',
    'docs/SPRINT_27_12_RELEASE_METADATA.md'
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
