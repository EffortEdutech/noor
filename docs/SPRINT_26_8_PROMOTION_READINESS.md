# Sprint 26.8 — ilm-mate Promotion Readiness Gate

## Purpose

Sprint 26.8 adds a promotion-readiness report for migrated ilm-mate content.

This sprint does **not** publish the migrated content to `noor-cdn`.

It reads Sprint 26.7 review actions and evidence registers, then produces a controlled gate report that keeps production blocked until the required review evidence is complete.

## Commands

```powershell
pnpm ilm:promotion-readiness
pnpm check:ilm-promotion-readiness
pnpm typecheck
pnpm build
```

## Inputs

```text
content-pipeline/review/ilm-mate-v1/actions/review-actions-register.json
content-pipeline/review/ilm-mate-v1/actions/review-evidence-register.json
```

## Outputs

```text
content-pipeline/review/ilm-mate-v1/promotion-readiness/
├── promotion-readiness-report.json
├── promotion-readiness-report.md
├── promotion-readiness-domains.csv
└── promotion-readiness-evidence.csv
```

## Gate policy

```text
productionGateStatus: blocked
productionApproved: false
canPromoteToProduction: false
```

## Review domains

```text
quran
tafseer
hadith
```

## Evidence controls

```text
source identity
license or written redistribution permission
attribution wording
checksum / integrity plan
scholarly reviewer sign-off
production promotion approval
```

## Production status

Production promotion remains blocked. A future sprint may add an explicit approval workflow, but this sprint is only a readiness calculation and evidence gate report.
