export type NoorRoadmapSprintStatus = 'complete' | 'current' | 'next' | 'future';

export type NoorRoadmapSprint = {
  sprint: string;
  title: string;
  status: NoorRoadmapSprintStatus;
  objective: string;
};

export const NOOR_MASTER_ROADMAP = {
  version: '0.21.0',
  label: 'NOOR Master Blueprint & Roadmap',
  currentPhase: 'Phase 3 — Production content pipeline and source governance',
  generatedRoot: 'content-pipeline/roadmap',
  currentSprint: {
    sprint: 'Sprint 21',
    title: 'Quran production source selection gate',
    status: 'current',
    objective: 'Create a Quran-specific source selection gate that keeps production import blocked until a real source, license, attribution, checksum plan and reviewer sign-off are complete.'
  } satisfies NoorRoadmapSprint,
  completedSprints: [
    { sprint: 'Sprint 0', title: 'Repo foundation + data contracts', status: 'complete', objective: 'Monorepo, packages and shared contracts.' },
    { sprint: 'Sprint 1', title: 'Design system + app shell', status: 'complete', objective: 'NOOR shell, navigation and foundation UI.' },
    { sprint: 'Sprint 2', title: 'Quran/Tafseer/Hadith CDN resolvers', status: 'complete', objective: 'Local-first resolver contracts.' },
    { sprint: 'Sprint 3', title: 'Quran reader foundation', status: 'complete', objective: 'Reader route and surah rendering.' },
    { sprint: 'Sprint 4', title: 'Explore/search foundation', status: 'complete', objective: 'Search and discovery surfaces.' },
    { sprint: 'Sprint 5', title: 'Journeys and reading progress', status: 'complete', objective: 'User journey flows and local progress.' },
    { sprint: 'Sprint 6', title: 'NOOR Studio reminder foundation', status: 'complete', objective: 'Reminder preview and bookmark source flow.' },
    { sprint: 'Sprint 7', title: 'PWA install and offline UX', status: 'complete', objective: 'Manifest, service worker and install prompts.' },
    { sprint: 'Sprint 8', title: 'Content integrity checks', status: 'complete', objective: 'Local content validation and pack checks.' },
    { sprint: 'Sprint 9', title: 'Release metadata and governance', status: 'complete', objective: 'Version, release notes and CI release checks.' },
    { sprint: 'Sprint 10', title: 'Reader preferences and settings polish', status: 'complete', objective: 'Personalized local reader settings.' },
    { sprint: 'Sprint 11', title: 'Content health settings dashboard', status: 'complete', objective: 'Content diagnostics in Settings.' },
    { sprint: 'Sprint 11.5', title: 'Master blueprint and roadmap consolidation', status: 'complete', objective: 'Roadmap documentation baseline.' },
    { sprint: 'Sprint 12', title: 'Production content pipeline/CDN source preparation', status: 'complete', objective: 'CDN source tree, validators and preparation scripts.' },
    { sprint: 'Sprint 13', title: 'Runtime CDN mode and source switching', status: 'complete', objective: 'Switch between bundled and external CDN source modes.' },
    { sprint: 'Sprint 14', title: 'Zero-budget CDN publish pack', status: 'complete', objective: 'Prepare publish-ready CDN folder for GitHub Pages/jsDelivr.' },
    { sprint: 'Sprint 15', title: 'CDN smoke testing', status: 'complete', objective: 'Validate CDN URLs and promotion readiness.' },
    { sprint: 'Sprint 16', title: 'CDN promotion bundle', status: 'complete', objective: 'Generate environment handoff and promotion checklist.' },
    { sprint: 'Sprint 17', title: 'Source governance', status: 'complete', objective: 'Audit source approval and production gates.' },
    { sprint: 'Sprint 18', title: 'Roadmap control center', status: 'complete', objective: 'Make roadmap status visible and testable.' },
    { sprint: 'Sprint 19', title: 'Production source intake templates', status: 'complete', objective: 'Capture Quran, tafseer and hadith candidate source records before import work.' },
    { sprint: 'Sprint 20', title: 'Quran importer adapter v1', status: 'complete', objective: 'Normalize a vetted Quran-like source fixture into NOOR CDN-style surah index and per-surah JSON while keeping production release blocked until source approval is complete.' }
  ] satisfies NoorRoadmapSprint[],
  futureSprints: [
    { sprint: 'Sprint 22', title: 'Tafseer importer adapter v1', status: 'next', objective: 'Normalize approved tafseer book data into NOOR CDN tafseer routes after source intake and approval gates are in place.' },
    { sprint: 'Sprint 23', title: 'Hadith importer adapter v1', status: 'future', objective: 'Normalize approved hadith collection data into NOOR CDN hadith routes.' },
    { sprint: 'Sprint 24', title: 'Scholarly review console', status: 'future', objective: 'Add reviewer checklist, sign-off metadata and source approval evidence UI.' },
    { sprint: 'Sprint 25', title: 'Production CDN v1 promotion', status: 'future', objective: 'Publish approved content bundle to external CDN and switch runtime defaults carefully.' },
    { sprint: 'Sprint 26', title: 'Search index from production content', status: 'future', objective: 'Generate a lightweight local search index from approved Quran, tafseer and hadith production content.' }
  ] satisfies NoorRoadmapSprint[],
  docs: [
    'docs/NOOR_MASTER_ROADMAP.md',
    'docs/NOOR_QURAN_IMPORTER.md',
    'docs/NOOR_QURAN_SOURCE_GATE.md',
    'docs/SPRINT_21_SCOPE.md',
    'docs/LOCAL_TESTING_SPRINT_21.md'
  ],
  commands: [
    'pnpm roadmap:status',
    'pnpm quran:gate',
    'pnpm check:quran-source-gate',
    'pnpm quran:import',
    'pnpm check:quran-import',
    'pnpm check:roadmap',
    'pnpm check:pack'
  ]
};
