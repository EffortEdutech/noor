# Sprint 17 Scope — Source Governance and Production Approval Gate

## Objective

Add a source governance layer so NOOR can distinguish between infrastructure-ready content and production-approved Islamic content.

## Included

- `pnpm source:audit`
- `pnpm check:source-audit`
- `pnpm source:gate`
- Source Governance card in Settings
- Audit JSON and Markdown report generation
- CI validation for source governance
- Version bump to NOOR v0.17.0

## Not included

- Real Quran import
- Real tafseer import
- Real hadith import
- Automatic scholarly approval
- Production content replacement

## Acceptance criteria

- `pnpm source:audit` passes and writes audit reports.
- `pnpm check:source-audit` passes.
- `/settings` shows Source Governance.
- NOOR shows v0.17.0.
- `pnpm build` remains green.
