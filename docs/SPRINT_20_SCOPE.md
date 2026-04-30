# Sprint 20 Scope — Quran Importer Adapter v1

## Objective

Build the first Quran importer adapter without bypassing the production source governance gate.

Sprint 20 proves that NOOR can normalize Quran source data into the CDN-shaped structure used by the runtime resolver:

- `metadata/surah-index.json`
- `quran/surahs/001.json`
- `quran/surahs/112.json`
- `quran/surahs/113.json`
- `quran/surahs/114.json`
- `manifest/noor-quran-import-report.json`

## What This Sprint Adds

1. Quran importer script: `scripts/import-noor-quran.mjs`
2. Quran import checker: `scripts/check-noor-quran-import.mjs`
3. Import source schema
4. Non-production Quran fixture
5. Generated import output and audit report
6. Settings Quran Import card
7. Roadmap update to Sprint 20
8. Release metadata update to v0.20.0

## What This Sprint Does Not Do

- It does not approve a production Quran source.
- It does not publish real Quran data to the external CDN.
- It does not switch runtime content to imported production content.
- It does not replace scholarly review.

## Production Gate

The generated report must remain blocked until Sprint 21 or later resolves:

- license approval,
- attribution approval,
- canonical source choice,
- checksum/import plan,
- reviewer sign-off.
