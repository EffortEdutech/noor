# Sprint 27.9.3 — Tafseer CDN Reader + Hadith Navigation Verification

## Purpose

Sprint 27.9.3 is a stabilisation sprint before production CDN promotion.

It addresses two findings from the staging runtime test:

1. The Hadith reader showed `View by book (630)` and `View by chapter (0)`, even though the staging `noor-cdn` repository contains both `by_book` and `by_chapter` data.
2. The Tafseer page still used the old demo-only resolver path and did not expose migrated Tafseer CDN content through the UI.

## Decision

During staging, the NOOR app should use:

```text
https://raw.githubusercontent.com/EffortEdutech/noor-cdn/staging-ilm-mate-v1/noor-cdn
```

instead of jsDelivr.

Reason:

```text
jsDelivr is excellent for production CDN, but branch URLs can lag or cache while the staging branch changes frequently.
```

Production can later return to:

```text
https://cdn.jsdelivr.net/gh/EffortEdutech/noor-cdn@main/noor-cdn
```

after approval.

## Added files

```text
scripts/generate-noor-tafseer-index.mjs
scripts/check-noor-tafseer-index.mjs
scripts/apply-sprint27-9-3-package-scripts.mjs
docs/SPRINT_27_9_3_TAFSEER_HADITH_CDN.md
```

## Updated files

```text
apps/web/app/learn/hadith/page.tsx
apps/web/app/learn/tafseer/page.tsx
packages/noor-data/src/resolvers/tafseer.ts
scripts/write-noor-staging-cdn-env.mjs
```

## New commands

```text
pnpm tafseer:index
pnpm check:tafseer-index
pnpm check:sprint27-9-3
```

## Expected acceptance

Hadith:

```text
View by book > 0
View by chapter > 0
```

Tafseer:

```text
Tafseer book index loads from CDN metadata.
Tafseer entries load by selected book and Surah.
```

Settings:

```text
Runtime content source: cdn
CDN base: raw.githubusercontent.com/EffortEdutech/noor-cdn/staging-ilm-mate-v1/noor-cdn
```

## Production gate

This sprint does not approve production promotion.

Production promotion remains blocked until staging acceptance is green.
