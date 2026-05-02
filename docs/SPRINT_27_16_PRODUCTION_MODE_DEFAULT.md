# Sprint 27.16 — Production Mode Default / Environment Finalization

## Status

Ready for implementation after Sprint 27.15 production runtime QA is merged to `main`.

## Purpose

Sprint 27.16 finalizes NOOR runtime behaviour now that the approved CDN content has been promoted to `noor-cdn/main` and production runtime QA has passed.

Before this sprint, NOOR was deliberately conservative: local and production defaults were kept close to mock/bundled fallback while we completed source review, staging QA, approval, promotion, and production runtime checks.

This sprint changes only the runtime default policy:

- production builds default to the external production CDN;
- local development remains safe on mock fallback by default;
- manual source switching remains available in Settings;
- bundled fallback remains enabled for safety.

## Canonical production CDN base

```text
https://cdn.jsdelivr.net/gh/EffortEdutech/noor-cdn@main/noor-cdn
```

## Runtime default policy

| Environment | Default source | Notes |
|---|---|---|
| Production build | External CDN | Reads approved content from `noor-cdn/main`. |
| Local development | Mock fallback | Safe for offline/local testing. |
| Local CDN test | Manual switch | Still available through Settings. |
| Staging branch test | Manual environment file | Still possible when future content review cycles need it. |

## Production environment variables

Use these values in Vercel Production if you want the production behaviour to be explicit instead of relying only on code defaults.

```text
NEXT_PUBLIC_NOOR_DATA_MODE=cdn
NEXT_PUBLIC_NOOR_MANIFEST_CDN_BASE=https://cdn.jsdelivr.net/gh/EffortEdutech/noor-cdn@main/noor-cdn
NEXT_PUBLIC_NOOR_QURAN_CDN_BASE=https://cdn.jsdelivr.net/gh/EffortEdutech/noor-cdn@main/noor-cdn
NEXT_PUBLIC_NOOR_TAFSEER_CDN_BASE=https://cdn.jsdelivr.net/gh/EffortEdutech/noor-cdn@main/noor-cdn
NEXT_PUBLIC_NOOR_HADITH_CDN_BASE=https://cdn.jsdelivr.net/gh/EffortEdutech/noor-cdn@main/noor-cdn
```

## Safety controls retained

- Bundled fallback remains enabled.
- Development default remains `mock`.
- Preview/staging testing can still override the CDN base by environment variables.
- Production CDN branch is `noor-cdn/main`, not the previous staging branch.

## Acceptance commands

```powershell
pnpm production:env-finalization
pnpm check:production-env-finalization
pnpm check:sprint27-16
pnpm typecheck
pnpm build
```

## Result expected

After this sprint, deployed production NOOR should naturally show:

```text
Data mode
cdn · External CDN
```

with CDN bases pointing to:

```text
https://cdn.jsdelivr.net/gh/EffortEdutech/noor-cdn@main/noor-cdn
```
