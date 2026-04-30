# NOOR CDN Publishing

Status: Sprint 14 foundation  
Mode: zero-budget, manual-publish first  
App version: NOOR v0.14.0

## Purpose

Sprint 12 prepared a CDN-shaped content folder. Sprint 13 allowed NOOR to switch between mock, local CDN and external CDN sources. Sprint 14 adds the missing operational bridge: a repeatable publish pack that can be copied to a separate data repository and served for free.

The goal is to avoid storing large future datasets inside the application repository while keeping a simple deployment path for Phase 1.

## Commands

```powershell
pnpm content:validate
pnpm content:prepare
pnpm cdn:pack
pnpm cdn:verify
pnpm check:cdn-publish
```

## Output

`pnpm cdn:pack` generates:

```text
content-pipeline/publish/noor-cdn-gh-pages/
├─ .nojekyll
├─ README.md
├─ publish-manifest.json
└─ noor-cdn/
   ├─ index.json
   ├─ manifest/
   ├─ metadata/
   ├─ quran/
   ├─ tafseer/
   └─ hadith/
```

The publish folder is intentionally ignored by Git in the app repository. It is a generated artifact for copying into a separate data repository.

## Recommended zero-budget data repository

Recommended repository:

```text
https://github.com/EffortEdutech/noor-cdn
```

Recommended folder inside that repository:

```text
noor-cdn/
```

## Option A — GitHub Pages

1. Create or open `EffortEdutech/noor-cdn`.
2. Copy everything inside `content-pipeline/publish/noor-cdn-gh-pages` into the data repository root.
3. Commit and push to `main`.
4. Enable GitHub Pages using the `main` branch root.
5. Configure NOOR external CDN mode:

```env
NEXT_PUBLIC_NOOR_DATA_MODE=cdn
NEXT_PUBLIC_NOOR_MANIFEST_CDN_BASE=https://effortedutech.github.io/noor-cdn/noor-cdn
NEXT_PUBLIC_NOOR_QURAN_CDN_BASE=https://effortedutech.github.io/noor-cdn/noor-cdn
NEXT_PUBLIC_NOOR_TAFSEER_CDN_BASE=https://effortedutech.github.io/noor-cdn/noor-cdn
NEXT_PUBLIC_NOOR_HADITH_CDN_BASE=https://effortedutech.github.io/noor-cdn/noor-cdn
```

## Option B — jsDelivr from GitHub

After pushing to the `noor-cdn` repository, configure:

```env
NEXT_PUBLIC_NOOR_DATA_MODE=cdn
NEXT_PUBLIC_NOOR_MANIFEST_CDN_BASE=https://cdn.jsdelivr.net/gh/EffortEdutech/noor-cdn@main/noor-cdn
NEXT_PUBLIC_NOOR_QURAN_CDN_BASE=https://cdn.jsdelivr.net/gh/EffortEdutech/noor-cdn@main/noor-cdn
NEXT_PUBLIC_NOOR_TAFSEER_CDN_BASE=https://cdn.jsdelivr.net/gh/EffortEdutech/noor-cdn@main/noor-cdn
NEXT_PUBLIC_NOOR_HADITH_CDN_BASE=https://cdn.jsdelivr.net/gh/EffortEdutech/noor-cdn@main/noor-cdn
```

## Verification

Before copying the generated folder anywhere, run:

```powershell
pnpm cdn:verify
```

This checks:

1. required resolver files exist;
2. byte sizes match;
3. SHA-256 checksums match;
4. the publish manifest is readable.

## Production gate

Do not label any external content as production until the dataset has passed:

1. source licensing review;
2. attribution review;
3. checksum/hash capture;
4. scholarly review;
5. Arabic text integrity check;
6. translation/tafseer source review;
7. hadith collection/source mapping review.

Sprint 14 publishes demo-shaped content only. It does not solve production authenticity by itself.
