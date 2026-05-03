# Changelog

## v0.27.12 — Sprint 27.12 Release metadata and staging CDN QA

- Updated NOOR app version metadata from Sprint 26 to Sprint 27.12.
- Added release notes for the Sprint 27 staging CDN acceptance sequence.
- Confirmed staging CDN acceptance, staging runtime checks and browser QA are part of the release gate.
- Preserved production safety: `noor-cdn/main` remains untouched and production CDN promotion remains blocked.
- Updated roadmap metadata so Sprint 27.12 is current, Sprint 27.11 is complete and Sprint 28 is next.

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

## v0.16.0 � Sprint 16 CDN promotion handoff

- Added CDN promotion handoff support.
- Added promotion environment handoff metadata.
- Added CDN promotion validation for manual runtime switching.
