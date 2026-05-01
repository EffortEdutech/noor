# NOOR Sprint 27 — Evidence Completion Workflow / Editable Review Records

## Purpose

Sprint 27 turns the Sprint 26.9 reviewer submission templates into editable evidence completion records.

This sprint is still governance-only. It does not approve production content and does not publish migrated ilm-mate content to `noor-cdn`.

## Inputs

- `content-pipeline/review/ilm-mate-v1/evidence-intake/evidence-intake-pack.json`
- `content-pipeline/review/ilm-mate-v1/evidence-intake/reviewer-submission-forms.json`

## Outputs

- `content-pipeline/review/ilm-mate-v1/evidence-records/evidence-completion-workflow.json`
- `content-pipeline/review/ilm-mate-v1/evidence-records/evidence-completion-workflow.md`
- `content-pipeline/review/ilm-mate-v1/evidence-records/evidence-completion-records.json`
- `content-pipeline/review/ilm-mate-v1/evidence-records/evidence-completion-register.csv`
- `content-pipeline/review/ilm-mate-v1/evidence-records/reviewer-decision-register.json`
- `content-pipeline/review/ilm-mate-v1/evidence-records/reviewer-decision-register.csv`
- `content-pipeline/review/ilm-mate-v1/evidence-records/editable-evidence-record-template.json`

## Commands

```powershell
pnpm ilm:evidence-records
pnpm check:ilm-evidence-records
pnpm typecheck
pnpm build
```

## Editable states

Review records support:

- `not-submitted`
- `submitted`
- `under-review`
- `accepted-for-staging`
- `needs-more-information`
- `rejected`
- `blocked`

Production approval records must remain `blocked`.

## Production safety

Sprint 27 must keep these values false:

- `productionApproved`
- `canPromoteToProduction`
- `canApproveProduction`

Accepted staging evidence is not production approval.
