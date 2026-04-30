# NOOR Release Notes

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
