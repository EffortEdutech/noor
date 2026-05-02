# Sprint 27.15 — Production CDN Runtime Verification / Browser QA

## Status

Post-production-promotion QA sprint.

## Purpose

Sprint 27.15 verifies that the production CDN branch is reachable from public runtime URLs after Sprint 27.14 promoted `noor-cdn/staging-ilm-mate-v1` into `noor-cdn/main`.

## Scope

- Smoke-test production CDN JSON endpoints.
- Verify Quran production CDN runtime.
- Verify Tafseer production CDN runtime.
- Verify Hadith production CDN runtime.
- Verify Explore production CDN search index.
- Record manual browser QA acceptance.

## Production CDN bases

- jsDelivr: `https://cdn.jsdelivr.net/gh/EffortEdutech/noor-cdn@main/noor-cdn`
- Raw GitHub: `https://raw.githubusercontent.com/EffortEdutech/noor-cdn/main/noor-cdn`
- GitHub Pages optional: `https://effortedutech.github.io/noor-cdn/noor-cdn`

## Commands

```powershell
pnpm production:cdn-smoke-test
pnpm check:production-cdn-smoke-test
pnpm production:browser-qa
pnpm production:browser-qa:update -- --all --status pass --reviewer "Darya Malak" --note "Manual production browser QA completed on localhost:3200 against noor-cdn/main."
pnpm check:production-browser-qa
pnpm check:sprint27-15
pnpm typecheck
pnpm build
```

## Outcome

Sprint 27.15 is complete when production smoke test and production browser QA both pass.
