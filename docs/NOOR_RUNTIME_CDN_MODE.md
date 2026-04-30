# NOOR Runtime CDN Mode

## Objective

NOOR must be able to use large Islamic content datasets without placing those datasets directly inside the application bundle.

Sprint 13 introduces runtime source switching so the same resolver layer can read from mock content, local prepared CDN files or external CDN URLs.

## Runtime source hierarchy

```text
NOOR UI
  ↓
Runtime source cookie / environment default
  ↓
@noor/data config
  ↓
Quran / Tafseer / Hadith / Content Health resolvers
  ↓
mock fallback OR local-cdn OR external cdn
```

## Source modes

| Mode | Purpose | Network | Recommended use |
|---|---|---:|---|
| `mock` | Bundled demo fallback | No | Default development and offline testing |
| `local-cdn` | Prepared files in public folder | Localhost | Testing Sprint 12 CDN output |
| `cdn` | External configured CDN | Yes | Future production after content approval |

## Persistence

Runtime source selection is stored in a cookie:

```text
noor.contentSource.v1
```

The client also mirrors the value into localStorage for future UI use:

```text
noor.contentSource.v1
```

## Local CDN base

Default:

```text
http://localhost:3200/noor-cdn
```

Configured by:

```text
NEXT_PUBLIC_NOOR_LOCAL_CDN_BASE
```

## External CDN bases

```text
NEXT_PUBLIC_NOOR_MANIFEST_CDN_BASE
NEXT_PUBLIC_NOOR_QURAN_CDN_BASE
NEXT_PUBLIC_NOOR_TAFSEER_CDN_BASE
NEXT_PUBLIC_NOOR_HADITH_CDN_BASE
```

## Fallback behavior

The resolver layer remains fallback-safe.

If `local-cdn` or `cdn` is selected and an endpoint fails, NOOR returns bundled demo content instead of breaking the app.

## Diagnostic endpoints

Sprint 13 checks:

```text
manifest/noor-content-manifest.json
manifest/noor-content-health.json
metadata/surah-index.json
quran/surahs/001.json
tafseer/demo-tafseer/surahs/001.json
hadith/collections.json
```

## Production rule

External CDN mode is a runtime capability only. It does not mean the content is production-approved.

Production approval still requires:

1. verified source,
2. permitted license,
3. attribution record,
4. checksum/integrity record,
5. scholarly or reviewer sign-off.
