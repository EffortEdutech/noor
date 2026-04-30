export type NoorReleaseNote = {
  version: string;
  date: string;
  title: string;
  summary: string;
  highlights: string[];
};

export const NOOR_RELEASE_NOTES: NoorReleaseNote[] = [
  {
    version: '0.15.0',
    date: '2026-04-30',
    title: 'Sprint 15 — CDN smoke testing and promotion gate',
    summary:
      'Adds local and remote CDN smoke testing so NOOR content can be verified before switching runtime mode to an external CDN.',
    highlights: [
      'cdn:smoke command to verify the generated local publish pack',
      'Remote URL smoke testing for GitHub Pages or jsDelivr CDN bases',
      'Settings CDN smoke testing card with required resolver paths',
      'CI check for CDN smoke validation after cdn:pack and cdn:verify',
      'Documentation for the external CDN promotion gate'
    ]
  },
  {
    version: '0.14.0',
    date: '2026-04-30',
    title: 'Sprint 14 — Zero-budget CDN publish pack',
    summary:
      'Adds a repeatable local CDN publish pack so NOOR content can be copied to a separate zero-budget GitHub Pages or jsDelivr data repository.',
    highlights: [
      'cdn:pack command to generate a publish-ready noor-cdn folder',
      'cdn:verify command with required resolver path and SHA-256 checks',
      'Settings CDN publishing card with GitHub Pages and jsDelivr target bases',
      'Sprint 14 CDN deployment documentation',
      'CI and local checks updated for runtime and CDN publishing validation'
    ]
  },
  {
    version: '0.13.0',
    date: '2026-04-30',
    title: 'Sprint 13 — Runtime CDN mode and source switching',
    summary:
      'Adds runtime content source switching so NOOR can move safely between bundled mock content, local prepared CDN files and configured external CDN endpoints.',
    highlights: [
      'Runtime source modes: mock, local-cdn and cdn',
      'Settings source switcher with cookie-based persistence',
      'Resolver diagnostics for manifest, Quran, Tafseer and Hadith endpoints',
      'Quran, Tafseer, Hadith and Settings pages now use the selected runtime content source',
      'Fallback-safe fetch behavior when CDN endpoints are unavailable'
    ]
  },
  {
    version: '0.12.0',
    date: '2026-04-30',
    title: 'Sprint 12 — Production content pipeline and CDN source preparation',
    summary:
      'Adds the first repeatable source-to-CDN content preparation path, with local validation, source registry, CDN-ready folder structure and Settings visibility.',
    highlights: [
      'CDN-ready content-pipeline/source folder using existing demo Quran, tafseer and hadith records',
      'Source registry and production gate checklist for licensing and scholarly review',
      'content:validate and content:prepare commands',
      'Local /noor-cdn public output for resolver testing',
      'Settings content pipeline card'
    ]
  },
  {
    version: '0.11.0',
    date: '2026-04-30',
    title: 'Sprint 11 — Release automation and changelog center',
    summary:
      'Adds CI checks, GitHub release automation, local release validation, visible changelog and a repeatable version bump command.',
    highlights: [
      'GitHub Actions CI for pack, content, release, typecheck and build checks',
      'Automatic GitHub release creation when a new version is pushed to main',
      'Changelog page and Settings release card',
      'Local check:release command to verify version metadata before push',
      'release:bump helper for future version updates'
    ]
  },
  {
    version: '0.10.0',
    date: '2026-04-29',
    title: 'Sprint 10 — Local backup restore and reset center',
    summary:
      'Added export, copy, import and clear-local-data tools so local progress can be preserved before testing or deployment.',
    highlights: [
      'Backup and restore card in Settings',
      'JSON export and clipboard copy',
      'Local reset flow for bookmarks, progress, preferences and search history'
    ]
  },
  {
    version: '0.9.0',
    date: '2026-04-29',
    title: 'Sprint 9 — Reader preferences and Quran study controls',
    summary:
      'Added reader preferences for translation mode, Arabic size, transliteration, tafseer notes and focus mode.',
    highlights: [
      'Reader preference panel in Quran reader and Settings',
      'Local persistence of study controls',
      'English/Malay translation display modes'
    ]
  },
  {
    version: '0.8.0',
    date: '2026-04-29',
    title: 'Sprint 8 — Content integrity and expanded demo content',
    summary:
      'Added content manifest, integrity checks, Settings health card and expanded demo Quran content.',
    highlights: [
      'Content health report',
      'check:content command',
      'Demo content for Al-Fatihah, Al-Ikhlas, Al-Falaq and An-Nas'
    ]
  }
];

export function getCurrentReleaseNote() {
  return NOOR_RELEASE_NOTES[0];
}
