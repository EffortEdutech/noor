# NOOR CDN Setup Guide for Founder

## Goal

This guide connects the NOOR app to a separate public CDN content repository:

```text
https://github.com/EffortEdutech/noor-cdn
```

The NOOR app remains the application.
The `noor-cdn` repo becomes the static content hosting layer.

## Why this is needed

The app already supports three content modes:

| Mode | Meaning |
|---|---|
| `mock` | bundled demo fallback |
| `local-cdn` | generated CDN files served from `apps/web/public/noor-cdn` |
| `cdn` | files loaded from the external `noor-cdn` repo |

Use this order:

```text
mock → local-cdn → cdn
```

## Step 1 — Create `noor-cdn`

Create this repository on GitHub:

```text
EffortEdutech/noor-cdn
```

Recommended settings:

- Public repository
- README enabled
- GitHub Pages enabled from `main` branch root

## Step 2 — Build content inside NOOR

From the NOOR app repo:

```powershell
pnpm install
pnpm content:prepare
pnpm cdn:pack
pnpm cdn:verify
```

Expected generated folder:

```text
content-pipeline/publish/noor-cdn-gh-pages
```

## Step 3 — Publish content

Copy everything from:

```text
content-pipeline/publish/noor-cdn-gh-pages
```

into the `noor-cdn` repo.

Then run:

```powershell
git add .
git commit -m "Publish NOOR CDN content"
git push origin main
```

## Step 4 — Test the published CDN

Open these URLs:

```text
https://effortedutech.github.io/noor-cdn/noor-cdn/index.json
https://effortedutech.github.io/noor-cdn/noor-cdn/metadata/surah-index.json
https://effortedutech.github.io/noor-cdn/noor-cdn/search/search-index.json
```

Alternative jsDelivr URLs:

```text
https://cdn.jsdelivr.net/gh/EffortEdutech/noor-cdn@main/noor-cdn/index.json
https://cdn.jsdelivr.net/gh/EffortEdutech/noor-cdn@main/noor-cdn/metadata/surah-index.json
https://cdn.jsdelivr.net/gh/EffortEdutech/noor-cdn@main/noor-cdn/search/search-index.json
```

## Step 5 — Run NOOR using local CDN

This is the safest first test:

```powershell
pnpm content:prepare
$env:NEXT_PUBLIC_NOOR_DATA_MODE="local-cdn"
pnpm dev
```

Open:

```text
http://localhost:3200
```

## Step 6 — Run NOOR using external CDN

After the `noor-cdn` repo is published:

```powershell
$env:NEXT_PUBLIC_NOOR_DATA_MODE="cdn"
$env:NEXT_PUBLIC_NOOR_QURAN_CDN_BASE="https://cdn.jsdelivr.net/gh/EffortEdutech/noor-cdn@main/noor-cdn"
$env:NEXT_PUBLIC_NOOR_TAFSEER_CDN_BASE="https://cdn.jsdelivr.net/gh/EffortEdutech/noor-cdn@main/noor-cdn"
$env:NEXT_PUBLIC_NOOR_HADITH_CDN_BASE="https://cdn.jsdelivr.net/gh/EffortEdutech/noor-cdn@main/noor-cdn"
$env:NEXT_PUBLIC_NOOR_MANIFEST_CDN_BASE="https://cdn.jsdelivr.net/gh/EffortEdutech/noor-cdn@main/noor-cdn"
pnpm dev
```

## Sprint 26 test commands

```powershell
pnpm content:prepare
pnpm search:build-cdn-index
pnpm cdn:pack
pnpm cdn:verify
pnpm typecheck
pnpm build
```

## Expected Sprint 26 result

The CDN pack should include:

```text
noor-cdn/search/search-index.json
noor-cdn/manifest/search-index-manifest.json
```

The Explore page should show whether results are coming from:

```text
CDN search index
```

or fallback:

```text
bundled demo content
```

## Safety note

Do not publish production content unless it passed the existing production promotion/review gate.
