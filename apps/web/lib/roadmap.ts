export type NoorRoadmapStatus = 'complete' | 'current' | 'next' | 'future' | 'manual-gate';

export type NoorRoadmapSprint = {
  sprint: string;
  version: string;
  title: string;
  phase: string;
  status: NoorRoadmapStatus;
  objective: string;
  acceptance: string[];
};

export const NOOR_MASTER_ROADMAP = {
  version: '0.18.0',
  label: 'Sprint 18 — Master roadmap and release control center',
  currentPhase: 'Phase 3 — Production content readiness',
  commandRoot: 'scripts/generate-noor-roadmap.mjs',
  generatedRoot: 'content-pipeline/roadmap',
  docs: [
    'docs/NOOR_MASTER_ROADMAP.md',
    'docs/SPRINT_18_SCOPE.md',
    'docs/LOCAL_TESTING_SPRINT_18.md'
  ],
  commands: [
    'pnpm roadmap:status',
    'pnpm check:roadmap',
    'pnpm check:pack',
    'pnpm check:release',
    'pnpm typecheck',
    'pnpm build'
  ],
  completedSprints: [
    {
      sprint: 'Sprint 0-2',
      version: '0.2.x',
      title: 'Repo foundation, app shell and data contracts',
      phase: 'Foundation',
      status: 'complete',
      objective: 'Create the NOOR monorepo, design system shell and Quran/Tafseer/Hadith resolver contracts.',
      acceptance: ['Local app runs on port 3200', 'Data package boundaries exist', 'Foundation pages render']
    },
    {
      sprint: 'Sprint 3-8',
      version: '0.8.0',
      title: 'Reader, search, journeys, studio, PWA and content integrity',
      phase: 'Core learning experience',
      status: 'complete',
      objective: 'Build the first complete local-first NOOR learning experience using safe demo content.',
      acceptance: ['Search, journeys, library and studio work', 'PWA/offline shell exists', 'Content health checks pass']
    },
    {
      sprint: 'Sprint 9-11',
      version: '0.11.0',
      title: 'Reader preferences, local backup and release automation',
      phase: 'Release discipline',
      status: 'complete',
      objective: 'Add user preferences, backup/reset, changelog and release automation.',
      acceptance: ['Settings has backup and release notes', 'CI/release workflow exists', 'Build remains green']
    },
    {
      sprint: 'Sprint 12-17',
      version: '0.17.0',
      title: 'Production content pipeline, CDN runtime and source governance',
      phase: 'Production content readiness',
      status: 'complete',
      objective: 'Prepare repeatable CDN packaging, runtime source switching, promotion handoff and source approval gates.',
      acceptance: ['CDN pack, smoke and promotion scripts pass', 'Source audit passes', 'Demo content is blocked from production']
    }
  ] satisfies NoorRoadmapSprint[],
  currentSprint: {
    sprint: 'Sprint 18',
    version: '0.18.0',
    title: 'Master roadmap and release control center',
    phase: 'Roadmap governance',
    status: 'current',
    objective: 'Make the roadmap visible in code, docs, Settings and CI so future work is not lost between sprints.',
    acceptance: [
      'Settings shows Roadmap Control',
      'docs/NOOR_MASTER_ROADMAP.md exists',
      'pnpm roadmap:status generates roadmap JSON and Markdown',
      'pnpm check:roadmap passes',
      'NOOR shows v0.18.0'
    ]
  } satisfies NoorRoadmapSprint,
  futureSprints: [
    {
      sprint: 'Sprint 19',
      version: '0.19.0',
      title: 'Production source intake templates',
      phase: 'Content intake',
      status: 'next',
      objective: 'Create structured source intake records for real Quran, tafseer and hadith candidates before importer work starts.',
      acceptance: ['Source intake template exists', 'Candidate source registry validates', 'No source can be promoted without license and reviewer fields']
    },
    {
      sprint: 'Sprint 20',
      version: '0.20.0',
      title: 'Quran importer adapter v1',
      phase: 'Content import',
      status: 'future',
      objective: 'Add the first production Quran importer adapter behind the source governance gate.',
      acceptance: ['Importer normalizes surah/ayah JSON', 'Counts match manifest', 'Source gate remains enforced']
    },
    {
      sprint: 'Sprint 21',
      version: '0.21.0',
      title: 'Tafseer importer adapter v1',
      phase: 'Content import',
      status: 'future',
      objective: 'Add tafseer import preparation for selected approved tafseer datasets.',
      acceptance: ['Tafseer book metadata validates', 'Surah tafseer files resolve', 'Attribution appears in manifest']
    },
    {
      sprint: 'Sprint 22',
      version: '0.22.0',
      title: 'Hadith importer adapter v1',
      phase: 'Content import',
      status: 'future',
      objective: 'Add hadith collection import preparation for selected approved hadith datasets.',
      acceptance: ['Collection metadata validates', 'Hadith route files resolve', 'Grade/source fields are preserved']
    },
    {
      sprint: 'Sprint 23',
      version: '0.23.0',
      title: 'Scholarly review workflow',
      phase: 'Review operations',
      status: 'future',
      objective: 'Add manual reviewer checklist outputs for each source before production approval.',
      acceptance: ['Reviewer checklist is generated', 'Approval record links to source registry', 'Production gate checks reviewer sign-off']
    },
    {
      sprint: 'Sprint 24',
      version: '0.24.0',
      title: 'Production CDN release candidate',
      phase: 'Release candidate',
      status: 'future',
      objective: 'Package the first production-content release candidate after sources are approved.',
      acceptance: ['Production CDN smoke passes', 'Promotion bundle generated', 'Runtime CDN mode uses approved source']
    },
    {
      sprint: 'Sprint 25',
      version: '0.25.0',
      title: 'Learner accounts and sync planning',
      phase: 'Optional backend',
      status: 'future',
      objective: 'Design optional Supabase sync without breaking local-first usage.',
      acceptance: ['Local-first remains default', 'Sync schema is documented', 'Privacy and account boundaries are defined']
    }
  ] satisfies NoorRoadmapSprint[],
  guardrails: [
    'Local-first NOOR remains usable without paid services.',
    'Demo content must never be labelled production-approved.',
    'Real Quran, tafseer and hadith datasets require license, attribution and scholarly sign-off.',
    'Every sprint must update app version, release notes, docs, local test steps and pack checks.',
    'Port 3200 remains the local development port.'
  ]
} as const;

export function getNoorRoadmapSummary() {
  return {
    version: NOOR_MASTER_ROADMAP.version,
    label: NOOR_MASTER_ROADMAP.label,
    completedCount: NOOR_MASTER_ROADMAP.completedSprints.length,
    nextSprint: NOOR_MASTER_ROADMAP.futureSprints[0]
  };
}
