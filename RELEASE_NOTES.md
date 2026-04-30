# NOOR v0.12.0

Sprint 12 — Production content pipeline and CDN source preparation.

Released: 2026-04-30

## Highlights

- Added a CDN-ready source folder under `content-pipeline/source/noor-demo-v0.12`.
- Added a source registry and production promotion gate for licensing, attribution and scholarly review.
- Added `pnpm content:validate` to validate the source pack.
- Added `pnpm content:prepare` to generate local CDN output under `content-pipeline/dist/noor-cdn` and `apps/web/public/noor-cdn`.
- Added a Settings content pipeline card.
- Added `docs/NOOR_CONTENT_PIPELINE.md`.

## Important production note

Sprint 12 does not claim the demo data is production-ready. It only makes the data packaging workflow production-shaped. Real Quran, tafseer and hadith datasets must pass licensing, source attribution, checksum and scholarly/reviewer gates before being marked as production.
