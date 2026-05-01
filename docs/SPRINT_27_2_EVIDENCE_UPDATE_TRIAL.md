# NOOR Sprint 27.2 — Evidence Update Trial / Sample Record Submission

## Purpose

Sprint 27.2 verifies that the Sprint 27.1 evidence update helper can safely move selected migrated ilm-mate evidence records into a submitted state.

This sprint does **not** approve evidence for staging and does **not** publish anything to `noor-cdn`.

## Sample records submitted

The trial submits one source identity evidence record for each content domain:

1. Quran source identity
2. Tafseer source identity
3. Hadith source identity

Each record is moved to:

```text
completionStatus: submitted
submissionStatus: submitted
reviewerDecision: pending
acceptedForStaging: false
productionApproved: false
canApproveProduction: false
```

## Generated outputs

```text
content-pipeline/review/ilm-mate-v1/evidence-records/trial/
├── evidence-update-trial-report.json
├── evidence-update-trial-report.md
├── evidence-update-trial-updates.csv
└── sample-submission-commands.md
```

The main evidence records and workflow are also synced by the existing Sprint 27.1 evidence record utilities.

## Commands

```powershell
pnpm ilm:evidence-trial
pnpm ilm:evidence:list -- --status=submitted
pnpm check:ilm-evidence-trial
pnpm check:ilm-evidence-records
pnpm check:ilm-evidence-helper
pnpm typecheck
pnpm build
```

## Gate policy

Production remains blocked:

```text
productionApproved: false
canPromoteToProduction: false
noor-cdn: unchanged
```

## Next sprint

Sprint 27.3 should add the reviewer decision flow to move submitted records to `under-review`, `accepted-for-staging`, `needs-more-information`, or `rejected` while recalculating readiness.
