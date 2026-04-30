# NOOR Quran Importer

Sprint 20 adds the first Quran importer adapter contract.

This importer is intentionally safe:

- it imports only the local fixture at `content-pipeline/importers/quran/samples/quran-import-sample.json`
- it writes CDN-style output under `content-pipeline/imported/quran-v0.20/noor-cdn`
- it records a production gate report under `manifest/noor-quran-import-report.json`
- it keeps `productionReady: false` until source governance approves a real source

## Commands

```bash
pnpm quran:import
pnpm check:quran-import
```

## Production Rule

Do not replace NOOR runtime content with imported Quran output until:

1. source candidate is real and complete,
2. redistribution license is approved,
3. attribution text is approved,
4. source checksum/import plan is recorded,
5. qualified reviewer sign-off is recorded,
6. all local checks pass.
