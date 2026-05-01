# NOOR Release Notes

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
