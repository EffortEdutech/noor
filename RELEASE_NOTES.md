# NOOR Release Notes

## v0.24.0 — Sprint 24 Scholarly review console

Adds the first scholarly review console layer for Quran, tafseer and hadith source approval evidence while keeping all production promotion gates blocked until reviewer sign-off is complete.

### Highlights

- `review:console` command to generate review audit JSON and Markdown.
- `check:review-console` command for local and CI validation.
- Review registry covering Quran, tafseer and hadith production approval cases.
- Settings Scholarly Review Console card showing evidence requirements and blocked status.
- Roadmap updated: Sprint 24 current, Sprint 25 next for production CDN v1 promotion.

## v0.23.0 — Sprint 23 Hadith importer adapter v1

Adds the first hadith importer adapter path using a non-production fixture, generated NOOR CDN-style hadith routes, audit report and production gate checks.

### Highlights

- `hadith:import` command to normalize hadith fixture data into NOOR CDN-style collection and item routes.
- `check:hadith-import` command for local and CI validation.
- Generated hadith import report and audit markdown under `content-pipeline/imported`.
- Settings Hadith Import card showing adapter status and production gate.
- Roadmap updated: Sprint 23 current, Sprint 24 next for scholarly review console.

## v0.22.0 — Sprint 22 Tafseer importer adapter v1

Adds the first tafseer importer adapter path using a non-production fixture, generated NOOR CDN-style tafseer routes, audit report and production gate checks.

## v0.21.0 — Sprint 21 Quran production source selection gate

Adds a Quran-specific production source decision gate so real Quran import remains blocked until source approval is complete.

## v0.20.0 — Sprint 20 Quran importer adapter v1

Adds the first Quran import adapter path using a non-production fixture, generated CDN-style output, audit report and production gate checks.
