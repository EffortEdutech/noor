# Changelog

## v0.20.0 — Sprint 20 Quran importer adapter v1

- Added `pnpm quran:import` to normalize a Quran fixture into NOOR CDN-style surah index and per-surah JSON routes.
- Added `pnpm check:quran-import` to validate import output, count integrity, ayah keys and production gate status.
- Added Settings Quran Import card.
- Added Quran importer schema, fixture, generated import report and audit Markdown.
- Kept production Quran import blocked until a real source candidate has approved license, attribution and reviewer sign-off.

## v0.19.0 — Sprint 19 Production source intake templates

- Added Quran, tafseer and hadith source candidate templates.
- Added source candidate registry and intake validation.
- Added Settings Source Intake card and source:intake checks.

## v0.18.0 — Sprint 18 Master roadmap and release control center

- Added roadmap data model, Settings Roadmap Control card and generated roadmap status output.

## v0.17.0 — Sprint 17 Source governance and production approval gate

- Added source governance audits and production gate command.
