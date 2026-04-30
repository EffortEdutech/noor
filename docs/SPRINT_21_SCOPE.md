# Sprint 21 Scope — Quran Production Source Selection Gate

## Objective

Add a Quran-specific source selection and approval gate so NOOR cannot promote a Quran production dataset before source evidence and reviewer sign-off are complete.

## Included

- Quran source selection JSON record.
- Quran source gate validator command: `pnpm quran:gate`.
- Quran source gate check command: `pnpm check:quran-source-gate`.
- Generated source gate audit JSON and Markdown.
- Settings page Quran Source Gate card.
- CI update to run Quran source gate before Quran import checks.
- Release metadata updated to v0.21.0.
- Roadmap updated to Sprint 21 current and Sprint 22 next.

## Not Included

- Real Quran source ingestion.
- Tafseer importer adapter.
- Hadith importer adapter.
- Scholar/reviewer console UI.
- Production CDN promotion of real content.

## Default Gate State

The gate is blocked by design. The current candidate is still:

```text
quran-production-candidate-placeholder
```

This sprint only prepares the approval control. It does not approve any production Quran source.

## Acceptance Criteria

All of these should pass:

```powershell
pnpm quran:gate
pnpm check:quran-source-gate
pnpm quran:import
pnpm check:quran-import
pnpm roadmap:status
pnpm check:roadmap
pnpm check:pack
pnpm check:content
pnpm check:release
pnpm check:runtime
pnpm typecheck
pnpm build
```

Expected note: `pnpm quran:gate` should say the gate is blocked and approved for production import is no.
