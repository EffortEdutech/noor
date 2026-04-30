# NOOR Hadith Importer Adapter v1

Sprint 23 adds the first NOOR Hadith importer contract.

This importer is intentionally fixture-only. It proves how a structured hadith collection can be normalized into NOOR CDN resolver routes without approving any real production hadith source yet.

## Commands

```bash
pnpm hadith:import
pnpm check:hadith-import
pnpm check:pack
```

## Input

`content-pipeline/importers/hadith/samples/hadith-import-sample.json`

## Output

`content-pipeline/imported/hadith-v0.23/noor-cdn`

Generated resolver routes:

- `hadith/collections.json`
- `hadith/demo-hadith-import/items.json`
- `manifest/noor-hadith-import-report.json`

## Production rule

Do not use the fixture as production content. Real hadith import remains blocked until:

1. a real source candidate is selected;
2. license and redistribution permission are approved;
3. attribution wording is approved;
4. collection, book, chapter, numbering and grading policy are checked;
5. reviewer sign-off is recorded.
