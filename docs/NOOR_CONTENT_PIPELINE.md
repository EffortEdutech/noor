# NOOR Content Pipeline

Status: Sprint 12 foundation.

## Purpose

NOOR must not depend on huge content bundles inside the main app repo. The app should be able to read Quran, tafseer, hadith and search data from a low-cost static CDN while keeping a safe demo fallback for development.

Sprint 12 prepares the production-shaped content pipeline without claiming production authenticity yet.

## Current pipeline

```text
content-pipeline/source/noor-demo-v0.12
        ↓ validate
content-pipeline/dist/noor-cdn
        ↓ local public copy
apps/web/public/noor-cdn
```

## Resolver-compatible paths

```text
metadata/surah-index.json
quran/surahs/001.json
tafseer/demo-tafseer/surahs/001.json
hadith/collections.json
hadith/demo-nawawi/items.json
manifest/noor-content-manifest.json
manifest/noor-content-health.json
manifest/file-index.json
search/index.json
```

## Local commands

```powershell
pnpm content:validate
pnpm content:prepare
pnpm check:content
```

## Local CDN test idea

Create `.env.local` only when testing CDN mode:

```env
NEXT_PUBLIC_NOOR_DATA_MODE=cdn
NEXT_PUBLIC_NOOR_QURAN_CDN_BASE=http://localhost:3200/noor-cdn
NEXT_PUBLIC_NOOR_TAFSEER_CDN_BASE=http://localhost:3200/noor-cdn
NEXT_PUBLIC_NOOR_HADITH_CDN_BASE=http://localhost:3200/noor-cdn
```

Then run:

```powershell
pnpm dev
```

Open:

```text
http://localhost:3200/settings
http://localhost:3200/learn/quran/1
```

## Production gate

Before any real production data is used:

1. Text source must be identified.
2. License or permission must be recorded.
3. Attribution label must be approved.
4. Import transform must be reviewed.
5. Validator must pass.
6. Scholar/reviewer sign-off must be recorded.
7. Manifest status may then move from `cdn-ready` to `production`.

## Next recommended sprint

Sprint 13 should select the first real source dataset and build importer scripts without yet removing the demo fallback.
