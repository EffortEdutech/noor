# NOOR Release Notes

## v0.21.0 — Sprint 21 Quran Production Source Selection Gate

Quran production source selection gate.

Sprint 21 adds a Quran-specific production source gate. The app now records the selected Quran source candidate, evaluates whether it can be used for production import, and generates an audit file. The default state remains intentionally blocked because the current candidate is still a placeholder.

### Added

- `pnpm quran:gate` to validate the selected Quran source candidate.
- `pnpm check:quran-source-gate` for local and CI validation.
- `content-pipeline/source-gates/quran/quran-production-source-selection.json` as the decision record.
- Generated Quran source gate audit JSON and Markdown output.
- Settings Quran Source Gate card.
- Roadmap update: Sprint 21 current, Sprint 22 tafseer importer adapter v1 next.

### Production rule

Production Quran import remains blocked until the source URL/file, redistribution permission, attribution wording, checksum/import plan and reviewer sign-off are complete.

## v0.20.0 — Sprint 20 Quran Importer Adapter v1

Sprint 20 introduced the first Quran importer adapter path using a non-production fixture. It generated NOOR CDN-style surah index and per-surah JSON output while keeping production release blocked.

## v0.19.0 — Sprint 19 Production Source Intake Templates

Sprint 19 added Quran, tafseer and hadith source intake templates and a validation path before importer work begins.
