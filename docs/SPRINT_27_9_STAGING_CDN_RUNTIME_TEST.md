# Sprint 27.9 — Test NOOR App Against noor-cdn Staging Branch

## Goal

Sprint 27.9 verifies that the NOOR web app can read runtime content from the staging CDN branch:

```text
https://cdn.jsdelivr.net/gh/EffortEdutech/noor-cdn@staging-ilm-mate-v1/noor-cdn
```

This sprint is staging-only.

## Allowed

- Test `noor-cdn/staging-ilm-mate-v1`.
- Generate a local `.env.local.staging-ilm-mate-v1` template.
- Optionally write `.env.local` for local runtime testing.
- Run CDN smoke checks against staging branch URLs.
- Run the NOOR app locally with runtime source set to `cdn`.

## Blocked

- Do not push `noor-cdn/main`.
- Do not promote production CDN.
- Do not mark production approval as true.

## Commands

```powershell
node scripts/apply-sprint27-9-package-scripts.mjs
pnpm cdn:staging-env
pnpm cdn:test-staging
pnpm check:cdn-staging-runtime
pnpm typecheck
pnpm build
```

For local browser testing, write staging settings into `.env.local`:

```powershell
pnpm cdn:staging-env -- --write-local
pnpm dev
```

Then open:

```text
http://localhost:3200/settings
http://localhost:3200/learn/quran
http://localhost:3200/explore
```

Expected Settings result:

```text
Runtime content source: cdn
External CDN: Active
Manifest CDN: https://cdn.jsdelivr.net/gh/EffortEdutech/noor-cdn@staging-ilm-mate-v1/noor-cdn
```

## Production remains blocked

Sprint 27.9 proves that staging content can be tested. It does not approve production.
