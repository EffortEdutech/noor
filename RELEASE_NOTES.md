# NOOR Release Notes

## v0.27.12 — Sprint 27.12 Release metadata and staging CDN QA

Updates NOOR release metadata after the Sprint 27 staging CDN acceptance sequence. This release records that Quran, Tafseer, Hadith and Explore have passed staging/runtime/browser QA paths while keeping production content promotion blocked until formal review approval.

### Highlights

- Settings now reports `NOOR v0.27.12` and `Sprint 27.12 — Release metadata and staging CDN QA`.
- Release notes and changelog now reflect the Sprint 27.9–27.11 staging CDN work.
- Roadmap metadata is updated from Sprint 26 to Sprint 27.12.
- Sprint 27.10 staging CDN acceptance and Sprint 27.11 browser QA remain required checks.
- `noor-cdn/staging-ilm-mate-v1` remains the testing CDN branch.
- `noor-cdn/main` and production CDN promotion remain blocked.

## v0.26.0 — Sprint 26 CDN search index

Adds a lightweight CDN search index path so Explore can search Quran, Tafseer and Hadith content from the published `noor-cdn` repository while preserving bundled fallback safety.

### Highlights

- CDN search index available at `noor-cdn/search/search-index.json`.
- Explore now loads from the External CDN search index when runtime source is set to `cdn`.
- Explore follows the same browser runtime source setting used by Settings and reader pages.
- Confirmed 30 CDN search entries across Quran, Tafseer and Hadith demo/partial content.
- Production content promotion remains blocked until source licensing, attribution, checksum and scholarly review gates are approved.

## v0.25.0 — Sprint 25 Production CDN v1 promotion

Adds a safe production CDN v1 promotion candidate layer that generates promotion reports and environment previews while keeping runtime defaults bundled until all Quran, tafseer and hadith review gates are approved.

### Highlights

- `production:promote` command to generate production CDN promotion candidate JSON, Markdown and env preview.
- `check:production-promotion` command for local and CI validation.
- Settings Production CDN card showing blocked gate, output paths and safe runtime default.
- Roadmap updated: Sprint 25 current, Sprint 26 next for search index from production content.
- Production CDN v1 remains blocked because Quran, tafseer and hadith review cases are not approved yet.

## v0.24.0 — Sprint 24 Scholarly review console

Adds the first scholarly review console layer for Quran, tafseer and hadith source approval evidence while keeping all production promotion gates blocked until reviewer sign-off is complete.

## v0.23.0 — Sprint 23 Hadith importer adapter v1

Adds the first hadith importer adapter path using a non-production fixture, generated NOOR CDN-style hadith routes, audit report and production gate checks.

## v0.16.0 � Sprint 16 CDN promotion handoff

Records the CDN promotion handoff layer used by the NOOR content pipeline.

### Highlights

- Generated CDN promotion environment values.
- Added manual apply checklist after CDN smoke test.
- Preserved safe runtime switching through explicit environment settings.

## v0.21.0 � Sprint 21 Quran production source selection gate

Records the Quran production source selection gate used by the NOOR content pipeline.

### Highlights

- Added Quran production source selection gate.
- Preserved blocked production import status until formal approval.
- Required license, attribution, checksum and scholarly reviewer sign-off before Quran production import.
