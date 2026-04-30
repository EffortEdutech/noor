# NOOR CDN Smoke Testing

## Why this exists

NOOR can now prepare and package CDN content. Sprint 15 adds the final delivery check before a published CDN URL is trusted by runtime resolvers.

## Local smoke test

```powershell
pnpm cdn:pack
pnpm cdn:smoke
```

Default target:

```text
content-pipeline/publish/noor-cdn-gh-pages/noor-cdn
```

## Remote smoke test

After copying the publish pack into `EffortEdutech/noor-cdn` and enabling GitHub Pages:

```powershell
pnpm cdn:smoke https://effortedutech.github.io/noor-cdn/noor-cdn
```

For jsDelivr:

```powershell
pnpm cdn:smoke https://cdn.jsdelivr.net/gh/EffortEdutech/noor-cdn@main/noor-cdn
```

## Required resolver files

The smoke test checks:

```text
manifest/noor-content-manifest.json
manifest/noor-content-health.json
metadata/surah-index.json
quran/surahs/001.json
tafseer/demo-tafseer/surahs/001.json
hadith/collections.json
```

## Promotion gate

Only switch NOOR to external CDN mode after the exact CDN base passes `pnpm cdn:smoke <base-url>`.
