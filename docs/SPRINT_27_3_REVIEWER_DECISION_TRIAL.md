# Sprint 27.3 — Evidence Reviewer Decision Trial

## Purpose

Sprint 27.3 proves the reviewer decision workflow after Sprint 27.2 sample evidence submissions.

It changes the three source-identity records from submitted/pending to accepted-for-staging:

- Quran / source identity
- Tafseer / source identity
- Hadith / source identity

## Non-goals

Sprint 27.3 does not publish migrated content to noor-cdn.
Sprint 27.3 does not approve production promotion.
Sprint 27.3 does not unlock production_promotion_approval records.

## Commands

```powershell
pnpm ilm:reviewer-decision-trial
pnpm check:ilm-reviewer-decision-trial
pnpm ilm:evidence:list -- --status=accepted-for-staging
```

## Expected result

```text
Accepted for staging: 3
Domains ready for staging: 0/3
Status: blocked
productionApproved: false
canPromoteToProduction: false
```

## Output

```text
content-pipeline/review/ilm-mate-v1/evidence-records/reviewer-decisions/
├── reviewer-decision-trial-report.json
├── reviewer-decision-trial-report.md
├── reviewer-decision-trial-updates.csv
└── sample-reviewer-decision-commands.md
```

## Policy

Accepted-for-staging means the evidence can be used in later staging-readiness calculations.
It does not mean production approval.
Production CDN promotion remains blocked until all required evidence is complete and a future explicit promotion sprint unlocks the production gate.
