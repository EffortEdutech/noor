# Sprint 22 Scope — Tafseer Importer Adapter v1

## Objective

Create a first tafseer importer adapter that normalizes structured tafseer source data into NOOR CDN-style output while keeping production content blocked until source approval is complete.

## Included

- `tafseer:import` command.
- `check:tafseer-import` command.
- Non-production tafseer source fixture.
- Tafseer import source schema.
- Generated tafseer books metadata.
- Generated per-surah tafseer route.
- Generated import report and audit markdown.
- Settings Tafseer Import card.
- Release metadata and roadmap update to v0.22.0.
- CI workflow update.

## Not Included

- No real production tafseer source is approved in this sprint.
- No external CDN promotion of imported tafseer output.
- No scholar/reviewer console yet.
- No hadith importer yet.

## Acceptance Criteria

The sprint is complete when these commands pass:

```bash
pnpm tafseer:import
pnpm check:tafseer-import
pnpm roadmap:status
pnpm check:pack
pnpm check:release
pnpm check:roadmap
pnpm typecheck
pnpm build
```
