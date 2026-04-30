# NOOR Release Notes

## v0.20.0 — Sprint 20 Quran importer adapter v1

Sprint 20 starts the real content-import architecture safely. It does **not** promote real Quran data yet. It proves the adapter contract using a fixture, writes generated CDN-style output, and keeps the source governance gate blocked until a verified production source is approved.

### Included

- `pnpm quran:import`
- `pnpm check:quran-import`
- Quran importer schema and fixture
- Generated import report
- Generated surah index and per-surah JSON output
- Settings Quran Import card
- Roadmap update from Sprint 19 complete to Sprint 20 current

### Production note

The Quran fixture is not production-approved. A real source must pass licensing, attribution, checksum/import-plan and reviewer sign-off before production import.

## v0.19.0 — Sprint 19 Production source intake templates

Source intake templates and candidate registry were added for Quran, tafseer and hadith.

## v0.18.0 — Sprint 18 Roadmap control center

Roadmap status was made visible in code, Settings and generated roadmap files.
