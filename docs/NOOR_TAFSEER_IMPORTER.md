# NOOR Tafseer Importer

Status: Sprint 22  
Version: v0.22.0  
Adapter: `noor-tafseer-importer-v1`

## Purpose

The tafseer importer prepares NOOR for production tafseer data without mixing unapproved content into the app. It converts a structured tafseer source JSON into the same CDN-style route pattern already used by the NOOR runtime resolver.

## Generated Output

```text
content-pipeline/imported/tafseer-v0.22/noor-cdn/
├─ metadata/tafseer-books.json
├─ tafseer/demo-tafseer-import/surahs/001.json
└─ manifest/noor-tafseer-import-report.json
```

The audit file is generated here:

```text
content-pipeline/imported/tafseer-v0.22/audit/noor-tafseer-import-audit.md
```

## Commands

```bash
pnpm tafseer:import
pnpm check:tafseer-import
```

## Production Gate

The fixture is intentionally blocked from production. Before any real tafseer source can be used, NOOR must record:

1. verified tafseer source URL or file path,
2. approved redistribution license or written permission,
3. approved attribution wording,
4. author, translator and publisher metadata,
5. checksum/import plan,
6. scholar or reviewer sign-off,
7. successful importer and CDN validation.

## Next Step

Sprint 23 should add the same adapter discipline for hadith collections.
