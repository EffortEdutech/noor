export type NoorReleaseNote = {
  version: string;
  date: string;
  title: string;
  summary: string;
  highlights: string[];
};

export const NOOR_RELEASE_NOTES: NoorReleaseNote[] = [
  {
    version: '0.25.0',
    date: '2026-04-30',
    title: 'Sprint 25 — Production CDN v1 promotion',
    summary:
      'Adds a safe production CDN v1 promotion candidate layer that generates promotion reports and environment previews while keeping runtime defaults bundled until all review gates are approved.',
    highlights: [
      'production:promote command to generate production CDN promotion candidate JSON, Markdown and env preview',
      'check:production-promotion command for local and CI validation',
      'Settings Production CDN card showing blocked gate, output paths and safe runtime default',
      'Roadmap updated: Sprint 25 current, Sprint 26 next for search index from production content',
      'Production CDN v1 remains blocked because Quran, tafseer and hadith review cases are not approved yet'
    ]
  },
  {
    version: '0.24.0',
    date: '2026-04-30',
    title: 'Sprint 24 — Scholarly review console',
    summary:
      'Adds the first scholarly review console layer for Quran, tafseer and hadith source approval evidence while keeping all production promotion gates blocked until reviewer sign-off is complete.',
    highlights: [
      'review:console command to generate review audit JSON and Markdown',
      'check:review-console command for local and CI validation',
      'Review registry covering Quran, tafseer and hadith production approval cases',
      'Settings Scholarly Review Console card showing review evidence requirements',
      'Roadmap updated: Sprint 24 current, Sprint 25 next for production CDN v1 promotion'
    ]
  },
  {
    version: '0.23.0',
    date: '2026-04-30',
    title: 'Sprint 23 — Hadith importer adapter v1',
    summary:
      'Adds the first hadith importer adapter path using a non-production fixture, generated NOOR CDN-style hadith routes, audit report and production gate checks.',
    highlights: [
      'hadith:import command to normalize hadith fixture data into NOOR CDN-style collection and item routes',
      'check:hadith-import command for local and CI validation',
      'Generated hadith import report and audit markdown under content-pipeline/imported'
    ]
  }
];

export function getCurrentReleaseNote() {
  return NOOR_RELEASE_NOTES[0];
}
