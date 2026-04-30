export type NoorReleaseNote = {
  version: string;
  date: string;
  title: string;
  summary: string;
  highlights: string[];
};

export const NOOR_RELEASE_NOTES: NoorReleaseNote[] = [
  {
    version: '0.23.0',
    date: '2026-04-30',
    title: 'Sprint 23 — Hadith importer adapter v1',
    summary:
      'Adds the first hadith importer adapter path using a non-production fixture, generated NOOR CDN-style hadith routes, audit report and production gate checks.',
    highlights: [
      'hadith:import command to normalize hadith fixture data into NOOR CDN-style collection and item routes',
      'check:hadith-import command for local and CI validation',
      'Generated hadith import report and audit markdown under content-pipeline/imported',
      'Settings Hadith Import card showing adapter status and production gate',
      'Roadmap updated: Sprint 23 current, Sprint 24 next for scholarly review console'
    ]
  },
  {
    version: '0.22.0',
    date: '2026-04-30',
    title: 'Sprint 22 — Tafseer importer adapter v1',
    summary:
      'Adds the first tafseer importer adapter path using a non-production fixture, generated NOOR CDN-style tafseer routes, audit report and production gate checks.',
    highlights: [
      'tafseer:import command to normalize tafseer fixture data into NOOR CDN-style book and per-surah routes',
      'check:tafseer-import command for local and CI validation',
      'Generated tafseer import report and audit markdown under content-pipeline/imported',
      'Settings Tafseer Import card showing adapter status and production gate',
      'Roadmap updated: Sprint 22 current, Sprint 23 next for hadith importer adapter v1'
    ]
  },
  {
    version: '0.21.0',
    date: '2026-04-30',
    title: 'Sprint 21 — Quran production source selection gate',
    summary:
      'Adds a Quran-specific production source decision gate so real Quran import remains blocked until a verified source, redistribution permission, attribution, checksum plan and reviewer sign-off are complete.',
    highlights: [
      'quran:gate command to evaluate the selected Quran source candidate and write audit reports',
      'check:quran-source-gate command for local and CI validation',
      'Quran source selection JSON record under content-pipeline/source-gates/quran',
      'Settings Quran Source Gate card showing the blocked production decision',
      'Roadmap updated: Sprint 21 current, Sprint 22 next for tafseer importer adapter v1'
    ]
  },
  {
    version: '0.20.0',
    date: '2026-04-30',
    title: 'Sprint 20 — Quran importer adapter v1',
    summary:
      'Adds the first Quran import adapter path using a non-production fixture, generated CDN-style output, audit report and production gate checks.',
    highlights: [
      'quran:import command to normalize Quran fixture data into NOOR CDN-style routes',
      'check:quran-import command to validate output counts, ayah keys, source gate and generated audit files',
      'Settings Quran Import card showing adapter status and production gate',
      'Generated import report, surah index and per-surah JSON output under content-pipeline/imported',
      'Production Quran import remains blocked until license, attribution and reviewer sign-off are complete'
    ]
  },
  {
    version: '0.19.0',
    date: '2026-04-30',
    title: 'Sprint 19 — Production source intake templates',
    summary:
      'Adds structured source intake templates and validation before NOOR begins real Quran, tafseer or hadith importer work.',
    highlights: [
      'Quran, tafseer and hadith source intake templates',
      'Candidate source registry separated from the demo CDN registry',
      'source:intake command to validate candidate records and generate an intake audit',
      'check:source-intake command for local and CI validation',
      'Settings Source Intake card and Sprint 19 documentation'
    ]
  },
  {
    version: '0.18.0',
    date: '2026-04-30',
    title: 'Sprint 18 — Master roadmap and release control center',
    summary:
      'Adds a visible roadmap control layer so the completed NOOR foundation, current sprint and future production-content path are documented in code, Settings and CI.',
    highlights: [
      'Master roadmap data model for completed, current and future sprints',
      'Settings Roadmap Control card',
      'roadmap:status command to generate JSON and Markdown roadmap outputs',
      'check:roadmap command for local and CI validation',
      'Future sprint plan from production source intake through first production CDN release candidate'
    ]
  },
  {
    version: '0.17.0',
    date: '2026-04-30',
    title: 'Sprint 17 — Source governance and production approval gate',
    summary:
      'Adds a source governance audit layer so demo Quran, tafseer and hadith content remains blocked from production until licensing, attribution and scholarly review are complete.',
    highlights: [
      'source:audit command to generate JSON and Markdown source governance reports',
      'source:gate command that intentionally blocks demo-only content from production promotion',
      'check:source-audit command for local and CI validation',
      'Settings Source Governance card with registry, audit outputs and gate commands',
      'Documentation for production approval rules before real content import'
    ]
  }
];

export function getCurrentReleaseNote() {
  return NOOR_RELEASE_NOTES[0];
}
