# Sprint 18 Scope — Master Roadmap and Release Control Center

## Objective

Make the NOOR roadmap visible in the repo, Settings page and CI so we always know:

1. what has already been completed,
2. what Sprint we are currently building,
3. what the next production-content sprints are,
4. which gates must stay locked before real Islamic content is promoted.

## Included

- `apps/web/lib/roadmap.ts`
- `RoadmapControlCard` in Settings
- `docs/NOOR_MASTER_ROADMAP.md`
- `pnpm roadmap:status`
- `pnpm check:roadmap`
- CI roadmap status generation and validation
- Version bump to NOOR v0.18.0

## Not included

- Real Quran source import
- Real tafseer source import
- Real hadith source import
- Automatic production approval
- Any paid backend or paid CDN dependency

## Acceptance criteria

- `/settings` shows Roadmap Control.
- `pnpm roadmap:status` writes generated roadmap JSON and Markdown outputs.
- `pnpm check:roadmap` passes after `pnpm roadmap:status`.
- `pnpm check:pack`, `pnpm check:release`, `pnpm typecheck` and `pnpm build` stay green.
- NOOR shows v0.18.0.
