# Changelog

## v0.26.0 — Sprint 26 CDN search index

- Added CDN search index support for Quran, Tafseer and Hadith content.
- Added external CDN search loading for `/explore` with bundled fallback protection.
- Added browser runtime source alignment so Explore follows the same `noor.contentSource.v1` setting as Settings and reader pages.
- Confirmed `/learn/quran` runs from external CDN content and `/explore` reports `External CDN search index` with 30 CDN entries.
- Kept production content promotion blocked until scholarly review and source approval gates are complete.

## v0.25.0 — Sprint 25 Production CDN v1 promotion

- Added `production:promote`.
- Added `check:production-promotion`.
- Added production CDN v1 promotion report, Markdown summary and env preview.
- Added Settings Production CDN card.
- Kept runtime default bundled while production promotion is blocked.
- Updated app version, release notes, roadmap and CI for Sprint 25.

## v0.24.0 — Sprint 24 Scholarly review console

- Added `review:console`.
- Added `check:review-console`.
- Added scholarly review console registry for Quran, tafseer and hadith approval cases.

## v0.23.0 — Sprint 23 Hadith importer adapter v1

- Added `hadith:import`.
- Added `check:hadith-import`.
- Added hadith import source schema and sample fixture.
