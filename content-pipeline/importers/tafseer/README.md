# NOOR Tafseer Importer

Sprint 22 adds the first tafseer importer adapter.

The adapter accepts a structured tafseer source JSON and writes NOOR CDN-style output:

- `metadata/tafseer-books.json`
- `tafseer/<bookId>/surahs/<surah>.json`
- `manifest/noor-tafseer-import-report.json`
- `content-pipeline/imported/tafseer-v0.22/audit/noor-tafseer-import-audit.md`

## Commands

```bash
pnpm tafseer:import
pnpm check:tafseer-import
```

## Production rule

The included fixture is not production content. It remains blocked until a real tafseer source candidate has:

1. approved redistribution license or written permission,
2. approved attribution text,
3. author/translator/source metadata,
4. checksum/import plan,
5. scholar/reviewer sign-off.
