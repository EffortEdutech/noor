# Sprint 15 — CDN Smoke Testing and Promotion Gate

## Purpose

Sprint 15 verifies that a generated or published NOOR CDN target is actually usable by the runtime resolvers before the app is switched into external CDN mode.

## Added

1. `pnpm cdn:smoke`
2. `pnpm check:cdn-smoke`
3. Local publish-pack smoke test
4. Remote GitHub Pages / jsDelivr smoke test
5. Settings CDN Smoke Test card
6. CI smoke-test step
7. NOOR v0.15.0 release metadata

## Promotion rule

Do not set `NEXT_PUBLIC_NOOR_DATA_MODE=cdn` for production until the chosen CDN base passes:

```powershell
pnpm cdn:smoke https://effortedutech.github.io/noor-cdn/noor-cdn
```

or:

```powershell
pnpm cdn:smoke https://cdn.jsdelivr.net/gh/EffortEdutech/noor-cdn@main/noor-cdn
```

## Still not production content approval

This sprint only verifies runtime delivery. Real Quran, tafseer and hadith datasets still require licensing, attribution and scholarly review.
