# Sprint 14 Scope — Zero-budget CDN Publish Pack

## Goal

Prepare NOOR content for external zero-budget hosting without moving the app away from its offline-first and fallback-safe architecture.

## Added

1. `pnpm cdn:pack`
2. `pnpm cdn:verify`
3. `pnpm check:cdn-publish`
4. CDN publish metadata in `apps/web/lib/content-pipeline.ts`
5. Settings CDN publishing card
6. GitHub Pages/jsDelivr deployment guide
7. CI steps for runtime and CDN publish validation
8. App version bump to NOOR v0.14.0

## Not included

1. No real production Quran dataset import.
2. No real production tafseer dataset import.
3. No real production hadith dataset import.
4. No automatic push to a separate CDN repository.
5. No paid hosting.

## Acceptance criteria

The sprint is accepted when:

```powershell
pnpm content:validate
pnpm content:prepare
pnpm cdn:pack
pnpm cdn:verify
pnpm check:cdn-publish
pnpm check:pack
pnpm check:content
pnpm check:release
pnpm check:runtime
pnpm typecheck
pnpm build
```

all pass locally, and `/settings` shows NOOR v0.14.0 with the CDN publishing card.
