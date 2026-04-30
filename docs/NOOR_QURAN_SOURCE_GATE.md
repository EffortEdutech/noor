# NOOR Quran Production Source Selection Gate

Version: v0.21.0  
Sprint: Sprint 21  
Status: Manual gate, blocked by default

## Purpose

Sprint 21 prevents NOOR from accidentally treating a placeholder Quran dataset as production content.

The Quran importer from Sprint 20 can already normalize a fixture into CDN-style files, but a real Quran source must not be promoted until the source itself is approved. This gate records the selected Quran candidate and checks whether it has the minimum approval evidence.

## Gate Files

| File | Purpose |
|---|---|
| `content-pipeline/source-gates/quran/quran-production-source-selection.json` | Manual decision record for the selected Quran candidate. |
| `content-pipeline/source-gates/quran/audit/noor-quran-source-gate-audit.json` | Generated machine-readable gate audit. |
| `content-pipeline/source-gates/quran/audit/noor-quran-source-gate-audit.md` | Generated human-readable gate audit. |
| `scripts/validate-noor-quran-source-gate.mjs` | Validator used by `pnpm quran:gate`. |
| `scripts/check-noor-quran-source-gate.mjs` | CI/local guard used by `pnpm check:quran-source-gate`. |

## Current Decision

Selected candidate:

```text
quran-production-candidate-placeholder
```

Production import:

```text
blocked
```

The placeholder candidate is intentionally not approved.

## Minimum Approval Requirements

Before a Quran source can be used for production import, the selected candidate must have:

1. Real source URL or source file path.
2. Redistribution license or written permission approved.
3. Attribution wording recorded and approved.
4. Checksum/import plan recorded.
5. Reviewer role assigned.
6. Scholar/reviewer sign-off recorded.
7. Candidate `approvalStatus` set to `production-approved` only after manual review.
8. Quran importer output validated after import.

## Commands

```powershell
pnpm quran:gate
pnpm check:quran-source-gate
pnpm quran:import
pnpm check:quran-import
pnpm check:pack
```

## Expected Sprint 21 Result

`pnpm quran:gate` should pass the command but report that the gate is blocked:

```text
NOOR Quran production source gate blocked.
Approved for production import: no
```

This is correct. The command passes because the system correctly detects that production import is not approved.

## When We Are Ready Later

When a real Quran source is selected:

1. Update `content-pipeline/source-intake/noor-source-candidates.json` with the real source details.
2. Update `content-pipeline/source-gates/quran/quran-production-source-selection.json` to point to that candidate.
3. Record license, attribution, checksum plan and reviewer sign-off.
4. Run `pnpm quran:gate`.
5. Only after the gate passes, run production Quran import and CDN promotion checks.
