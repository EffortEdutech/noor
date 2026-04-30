# NOOR v0.14.0

Sprint 14 — Zero-budget CDN publish pack.

Released: 2026-04-30

## Highlights

- Added `pnpm cdn:pack` to generate a clean CDN publish folder.
- Added `pnpm cdn:verify` to verify resolver files and SHA-256 checksums.
- Added `pnpm check:cdn-publish` for local and CI validation.
- Added a Settings CDN publishing card.
- Added documentation for GitHub Pages and jsDelivr zero-budget hosting.

## Local publish flow

1. Run `pnpm content:validate`.
2. Run `pnpm content:prepare`.
3. Run `pnpm cdn:pack`.
4. Run `pnpm cdn:verify`.
5. Copy `content-pipeline/publish/noor-cdn-gh-pages` into a separate data repository such as `EffortEdutech/noor-cdn`.

## External CDN mode

After publishing the pack, configure one of these bases in `.env.local`:

```env
NEXT_PUBLIC_NOOR_DATA_MODE=cdn
NEXT_PUBLIC_NOOR_MANIFEST_CDN_BASE=https://effortedutech.github.io/noor-cdn/noor-cdn
NEXT_PUBLIC_NOOR_QURAN_CDN_BASE=https://effortedutech.github.io/noor-cdn/noor-cdn
NEXT_PUBLIC_NOOR_TAFSEER_CDN_BASE=https://effortedutech.github.io/noor-cdn/noor-cdn
NEXT_PUBLIC_NOOR_HADITH_CDN_BASE=https://effortedutech.github.io/noor-cdn/noor-cdn
```

or:

```env
NEXT_PUBLIC_NOOR_DATA_MODE=cdn
NEXT_PUBLIC_NOOR_MANIFEST_CDN_BASE=https://cdn.jsdelivr.net/gh/EffortEdutech/noor-cdn@main/noor-cdn
NEXT_PUBLIC_NOOR_QURAN_CDN_BASE=https://cdn.jsdelivr.net/gh/EffortEdutech/noor-cdn@main/noor-cdn
NEXT_PUBLIC_NOOR_TAFSEER_CDN_BASE=https://cdn.jsdelivr.net/gh/EffortEdutech/noor-cdn@main/noor-cdn
NEXT_PUBLIC_NOOR_HADITH_CDN_BASE=https://cdn.jsdelivr.net/gh/EffortEdutech/noor-cdn@main/noor-cdn
```

## Important production note

This sprint only prepares the zero-budget publishing mechanism. Real Quran, tafseer and hadith datasets must still pass licensing, attribution, checksum and scholarly review gates before they are promoted to production.
