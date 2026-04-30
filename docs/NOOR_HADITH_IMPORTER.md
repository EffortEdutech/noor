# NOOR Hadith Importer Adapter v1

Sprint: 23  
Version: v0.23.0  
Status: Fixture-only, production blocked

## Purpose

Sprint 23 introduces the first hadith importer adapter contract for NOOR.

The adapter converts a structured hadith source JSON into NOOR CDN resolver routes:

- `hadith/collections.json`
- `hadith/<collection-id>/items.json`
- `manifest/noor-hadith-import-report.json`

## Why this sprint matters

NOOR already has Quran and tafseer importer contracts. Hadith needs the same controlled path so we can later import approved production collections without bypassing source governance.

## Current fixture

The current fixture is:

`content-pipeline/importers/hadith/samples/hadith-import-sample.json`

It uses:

- adapter: `noor-hadith-importer-v1`
- source candidate: `hadith-production-candidate-placeholder`
- collection: `demo-hadith-import`
- items: 3

## Production gate

Production remains blocked until the hadith source has:

1. approved redistribution license;
2. approved attribution wording;
3. collection, book, chapter and numbering metadata checked;
4. grading policy recorded when applicable;
5. reviewer sign-off recorded;
6. import output validated and audited.

## Commands

```bash
pnpm hadith:import
pnpm check:hadith-import
pnpm check:pack
pnpm check:release
pnpm check:roadmap
pnpm typecheck
pnpm build
```
