# NOOR Release Notes

## v0.22.0 — Sprint 22 Tafseer Importer Adapter v1

Sprint 22 adds the first tafseer importer adapter. It normalizes a structured tafseer fixture into NOOR CDN-style tafseer book metadata and per-surah route files while keeping production tafseer blocked until a real source is approved.

### Added

- Tafseer importer adapter v1 release marker for Sprint 22 release validation.
- `pnpm tafseer:import` to generate tafseer CDN-style output from a structured source JSON.
- `pnpm check:tafseer-import` for local and CI validation.
- `content-pipeline/importers/tafseer/samples/tafseer-import-sample.json` as a non-production fixture.
- `content-pipeline/imported/tafseer-v0.22/noor-cdn/manifest/noor-tafseer-import-report.json`.
- Generated tafseer books metadata, per-surah route and audit markdown.
- Settings Tafseer Import card.
- Roadmap update: Sprint 22 current, Sprint 23 hadith importer adapter v1 next.

### Production rule

Production tafseer import remains blocked until the source URL/file, redistribution permission, attribution wording, author/translator metadata, checksum/import plan and reviewer sign-off are complete.

## v0.21.0 — Sprint 21 Quran Production Source Selection Gate

Quran production source selection gate.

Sprint 21 adds a Quran-specific production source gate. The app now records the selected Quran source candidate, evaluates whether it can be used for production import, and generates an audit file. The default state remains intentionally blocked because the current candidate is still a placeholder.

## v0.20.0 — Sprint 20 Quran Importer Adapter v1

Sprint 20 introduced the first Quran importer adapter path using a non-production fixture. It generated NOOR CDN-style surah index and per-surah JSON output while keeping production release blocked.

## v0.19.0 — Sprint 19 Production Source Intake Templates

Sprint 19 added Quran, tafseer and hadith source intake templates and a validation path before importer work begins.
