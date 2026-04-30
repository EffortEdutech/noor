# NOOR Quran Importer Blueprint

## Purpose

The Quran importer is the bridge between approved source material and the NOOR runtime CDN format.

Sprint 20 delivers adapter v1 using a non-production fixture. This protects the project from accidentally treating demo data or unapproved content as production Quran content.

## Import Flow

```text
Source Candidate Registry
        ↓
Quran Import Fixture / Future Approved Source
        ↓
scripts/import-noor-quran.mjs
        ↓
Generated CDN-style Quran Output
        ↓
scripts/check-noor-quran-import.mjs
        ↓
Production Gate Report
```

## Output Contract

The importer writes:

```text
content-pipeline/imported/quran-v0.20/noor-cdn/
├─ manifest/
│  └─ noor-quran-import-report.json
├─ metadata/
│  └─ surah-index.json
└─ quran/
   └─ surahs/
      ├─ 001.json
      ├─ 112.json
      ├─ 113.json
      └─ 114.json
```

## Source Governance Rule

`productionReady` must stay false until all of these are true:

1. source candidate is real,
2. source candidate is approved,
3. redistribution license is approved,
4. attribution is recorded,
5. checksum/import plan is recorded,
6. reviewer sign-off is recorded,
7. import output passes validation.

## Sprint 21 Direction

Sprint 21 should decide the real Quran production source path:

- approve a specific canonical Quran text and translation source, or
- keep production import blocked and document the blockers,
- define exact attribution language,
- define checksum and source-file archive requirements.
