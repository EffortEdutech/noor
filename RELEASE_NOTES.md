# NOOR Release Notes

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
