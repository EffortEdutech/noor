# NOOR Source Governance

Sprint 17 adds a source governance layer before any real Quran, tafseer or hadith dataset can be promoted to production.

## Why this exists

NOOR must not accidentally label demo, placeholder or unreviewed Islamic content as production content.

The current content pack is intentionally still pre-production/demo. It is useful for testing CDN layout, resolver paths and app UX, but it is not a final scholarly content source.

## Commands

```powershell
pnpm source:audit
pnpm check:source-audit
```

The audit command writes generated files to:

```text
content-pipeline/audit/noor-source-audit.json
content-pipeline/audit/noor-source-audit.md
```

These files are ignored by Git because they are generated.

## Production gate

```powershell
pnpm source:gate
```

This command is intentionally stricter. It should fail while the source registry contains demo-only or not-production-approved records.

Do not add `pnpm source:gate` to the normal green local test list until a real production source registry is ready.

## Required source domains

1. Quran
2. Tafseer
3. Hadith

## Minimum production approval checklist

1. Verified canonical/source text.
2. Clear redistribution license or written permission.
3. Attribution wording approved.
4. Import transform checked against source sample.
5. Content validator passes after import.
6. Scholar/reviewer sign-off recorded.

## Current decision

The Sprint 17 decision is:

```text
NOOR may test runtime/CDN infrastructure with demo content.
NOOR must not promote demo content as production Islamic content.
```
