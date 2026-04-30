# Sprint 13 — Runtime CDN Mode + Source Switching

Status: Implemented  
Version: NOOR v0.13.0  
Date: 2026-04-30

## Purpose

Sprint 12 prepared CDN-shaped content files. Sprint 13 connects NOOR to a runtime source selection layer so the app can safely switch between:

1. `mock` — bundled demo fallback content.
2. `local-cdn` — prepared JSON files served from `apps/web/public/noor-cdn`.
3. `cdn` — configured external CDN endpoints.

This keeps NOOR zero-budget and offline-safe while preparing for future production datasets.

## Added

- Runtime data source config in `packages/noor-data/src/config.ts`.
- Source-aware Quran, Tafseer, Hadith and content health resolvers.
- Resolver diagnostics in `packages/noor-data/src/resolvers/diagnostics.ts`.
- Server cookie reader in `apps/web/lib/runtime-content-source.ts`.
- Settings source switcher in `apps/web/components/RuntimeContentSourceCard.tsx`.
- `pnpm check:runtime` validation command.
- Version bump to `NOOR v0.13.0`.

## Runtime modes

### mock

Uses bundled demo content. No network request is required. This is the safest default.

### local-cdn

Uses prepared files under:

```text
apps/web/public/noor-cdn
```

Default local base:

```text
http://localhost:3200/noor-cdn
```

### cdn

Uses configured external bases:

```text
NEXT_PUBLIC_NOOR_MANIFEST_CDN_BASE
NEXT_PUBLIC_NOOR_QURAN_CDN_BASE
NEXT_PUBLIC_NOOR_TAFSEER_CDN_BASE
NEXT_PUBLIC_NOOR_HADITH_CDN_BASE
```

## Acceptance criteria

- `pnpm check:runtime` passes.
- `pnpm check:pack` passes.
- `pnpm check:content` passes.
- `pnpm check:release` passes.
- `pnpm typecheck` passes.
- `pnpm build` passes.
- Settings shows Runtime Content Source card.
- Switching to Local CDN reloads the app and diagnostics show local files can resolve.
- `/learn/quran/1`, `/learn/tafseer` and `/learn/hadith` open after switching modes.

## Production gate

This sprint does not approve any real external dataset. External CDN mode must stay fallback-safe until production content passes:

- source verification,
- licensing review,
- attribution review,
- checksum/integrity review,
- scholarly/reviewer approval.
