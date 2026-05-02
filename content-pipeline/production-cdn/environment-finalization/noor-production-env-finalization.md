# NOOR Sprint 27.16 — Production Mode Default / Environment Finalization

## Status

✅ Production runtime default finalized.

## Runtime default

| Environment | Default source | Notes |
|---|---|---|
| Production build | External CDN | Uses noor-cdn/main by default. |
| Local development | Mock fallback | Safe offline/dev mode unless switched manually. |
| Manual source switch | Allowed | Settings source switch remains available. |

## Canonical production CDN

```text
https://cdn.jsdelivr.net/gh/EffortEdutech/noor-cdn@main/noor-cdn
```

## Required checks

- ✅ promotion-executed: noor-cdn/main has been promoted from the approved staging branch.
- ✅ smoke-test-passed: Production CDN public endpoints have passed the Sprint 27.15 smoke test.
- ✅ browser-qa-passed: Production browser QA has been accepted for runtime usage.
- ✅ production-default-cdn: Production builds default to external CDN while development remains mock fallback.
- ✅ main-cdn-base: Default production CDN base points to noor-cdn@main.
- ✅ fallback-safety: Bundled fallback remains enabled for runtime safety.

## Required failures

None.

## Production environment variables

```text
NEXT_PUBLIC_NOOR_DATA_MODE=cdn
NEXT_PUBLIC_NOOR_MANIFEST_CDN_BASE=https://cdn.jsdelivr.net/gh/EffortEdutech/noor-cdn@main/noor-cdn
NEXT_PUBLIC_NOOR_QURAN_CDN_BASE=https://cdn.jsdelivr.net/gh/EffortEdutech/noor-cdn@main/noor-cdn
NEXT_PUBLIC_NOOR_TAFSEER_CDN_BASE=https://cdn.jsdelivr.net/gh/EffortEdutech/noor-cdn@main/noor-cdn
NEXT_PUBLIC_NOOR_HADITH_CDN_BASE=https://cdn.jsdelivr.net/gh/EffortEdutech/noor-cdn@main/noor-cdn
```

## Safety

Production CDN is now the default for production builds only. Local development remains safe on mock fallback by default.
