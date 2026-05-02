# Sprint 27.5 — Required Evidence Submission Trial

## Purpose

Sprint 27.5 submits the remaining non-production evidence records into the reviewer workflow.

It does not accept the evidence.
It does not push `noor-cdn`.
It does not approve production.

## Records submitted

For each domain:

- Quran
- Tafseer
- Hadith

Sprint 27.5 submits:

- `license_or_permission`
- `attribution_wording`
- `checksum_integrity_plan`
- `scholarly_reviewer_signoff`

Total:

```text
3 domains × 4 records = 12 submitted trial records
```

## Commands

```powershell
pnpm ilm:required-evidence-trial
pnpm check:ilm-required-evidence-trial
pnpm ilm:evidence:list -- --status=submitted
```

## Output

```text
content-pipeline/review/ilm-mate-v1/required-evidence-trial/
├── required-evidence-trial-report.json
├── required-evidence-trial-report.md
├── required-evidence-trial-submissions.csv
└── required-evidence-domain-status.csv
```

## Gate status

```text
productionApproved: false
canPromoteToProduction: false
canPushNoorCdnStaging: false
canPushNoorCdnMain: false
```

## Next sprint

Sprint 27.6 should perform reviewer decisions on the submitted records.
Only accepted-for-staging evidence can make domains ready for the future `noor-cdn` staging branch.
