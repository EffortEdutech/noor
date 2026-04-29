# Sprint 8 — Content Integrity + Expanded Demo Content

## Goal

Sprint 8 strengthens NOOR's content foundation before moving from demo data into full Quran, Tafseer and Hadith datasets.

The target is not to claim production-grade religious content yet. The target is to make the app safer and more inspectable by adding:

1. Better demo content coverage.
2. A content manifest.
3. A content health report.
4. A local content checker.
5. A Settings UI section that shows content readiness.

## Added

- Added full demo content for:
  - Surah Al-Fatihah
  - Surah Al-Ikhlas
  - Surah Al-Falaq
  - Surah An-Nas
- Added demo tafseer summaries for Al-Falaq and An-Nas.
- Added content manifest types.
- Added content health report types.
- Added `getContentManifest()`.
- Added `getContentHealthReport()`.
- Added Settings content integrity card.
- Added `pnpm check:content`.
- Updated app version to `0.8.0`.

## Important production note

The current content remains demo content. Before public production release, Quran text, translations, tafseer and hadith datasets must be replaced with properly verified and licensed sources.

## Files

```text
apps/web/app/settings/page.tsx
apps/web/components/ContentHealthCard.tsx
apps/web/lib/app-version.ts
apps/web/public/version.json
packages/noor-content/src/types.ts
packages/noor-content/src/index.ts
packages/noor-content/src/demo/quran.ts
packages/noor-content/src/demo/tafseer.ts
packages/noor-content/src/demo/content-manifest.ts
packages/noor-content/src/demo/content-health.ts
packages/noor-data/src/index.ts
packages/noor-data/src/resolvers/content-health.ts
scripts/check-noor-content.mjs
scripts/check-noor-pack.mjs
package.json
```
