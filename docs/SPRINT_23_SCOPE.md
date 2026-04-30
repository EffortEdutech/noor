# Sprint 23 Scope — Hadith importer adapter v1

## Objective

Build the first hadith import adapter that normalizes a structured hadith fixture into NOOR CDN-style hadith routes while keeping production content blocked.

## Included

- `hadith:import` command
- `check:hadith-import` command
- Hadith import schema
- Hadith import sample fixture
- Generated imported hadith CDN route files
- Generated import report
- Generated audit markdown
- Settings Hadith Import card
- Roadmap and release metadata update to v0.23.0
- CI update to run hadith import checks

## Not included

- Real production hadith source approval
- Real hadith collection ingestion
- Scholarly review console
- Production CDN switch

## Acceptance

All should pass:

```bash
pnpm hadith:import
pnpm check:hadith-import
pnpm roadmap:status
pnpm check:pack
pnpm check:content
pnpm check:release
pnpm check:runtime
pnpm check:roadmap
pnpm typecheck
pnpm build
```
