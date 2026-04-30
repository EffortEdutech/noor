# Sprint 12 — Production Content Pipeline / CDN Data Source Preparation

## Objective

Prepare NOOR for production-shaped static content delivery while preserving the current demo fallback.

## Added

- CDN-ready source folder.
- Source registry and production gate checklist.
- Validator script.
- Prepare script.
- Local public `/noor-cdn` output.
- Settings content pipeline card.
- Version bump to NOOR v0.12.0.

## Not included

- No real production Quran dataset yet.
- No scholarly tafseer import yet.
- No hadith source import yet.
- No claim that the demo pack is production-approved.

## Acceptance criteria

```powershell
pnpm content:validate
pnpm content:prepare
pnpm check:pack
pnpm check:content
pnpm check:release
pnpm typecheck
pnpm build
```

All commands must pass.
