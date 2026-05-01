# Sprint 27.1 — Evidence Record Update Helper

## Purpose

Sprint 27 created editable evidence records. Sprint 27.1 adds a safer helper so the team does not need to manually edit JSON files.

The helper can:

- list evidence records by domain/status
- update one non-production evidence record
- sync the JSON workflow summary
- sync the CSV register
- sync the reviewer decision register
- keep production approval locked

## Evidence status flow

Allowed update statuses:

- `draft`
- `not-submitted`
- `submitted`
- `under-review`
- `accepted-for-staging`
- `needs-more-information`
- `rejected`

Production approval evidence records remain locked as:

- `completionStatus: blocked`
- `submissionStatus: blocked`
- `productionApproved: false`
- `canApproveProduction: false`

## Files touched by update helper

```text
content-pipeline/review/ilm-mate-v1/evidence-records/evidence-completion-records.json
content-pipeline/review/ilm-mate-v1/evidence-records/evidence-completion-workflow.json
content-pipeline/review/ilm-mate-v1/evidence-records/evidence-completion-workflow.md
content-pipeline/review/ilm-mate-v1/evidence-records/evidence-completion-register.csv
content-pipeline/review/ilm-mate-v1/evidence-records/reviewer-decision-register.json
content-pipeline/review/ilm-mate-v1/evidence-records/reviewer-decision-register.csv
```

## List records

```powershell
pnpm ilm:evidence:list
pnpm ilm:evidence:list -- --domain=quran
pnpm ilm:evidence:list -- --status=not-submitted
pnpm ilm:evidence:list -- --domain=tafseer --status=submitted
```

## Update by record id

```powershell
pnpm ilm:evidence:update -- --id=ilm-mate-v1-quran-source_identity-evidence-record --status=submitted --reviewer-name="Darya Malak" --reviewer-role="Founder" --evidence-reference="Source identity received" --source-url-or-document="Local evidence folder / document link" --notes="Ready for reviewer checking"
```

## Update by domain and evidence key

```powershell
pnpm ilm:evidence:update -- --domain=quran --evidence-key=source_identity --status=under-review --reviewer-name="Reviewer Name" --reviewer-role="Content Reviewer" --notes="Review started"
```

## Accept for staging

Only use this after evidence has been checked.

```powershell
pnpm ilm:evidence:update -- --domain=quran --evidence-key=source_identity --status=accepted-for-staging --reviewer-name="Reviewer Name" --reviewer-role="Scholarly Reviewer" --evidence-reference="Evidence packet QUR-SRC-001" --date-reviewed=2026-05-02 --notes="Accepted for staging only"
```

This does not approve production.

## Reject or request more information

```powershell
pnpm ilm:evidence:update -- --domain=hadith --evidence-key=license_or_permission --status=needs-more-information --reviewer-name="Reviewer Name" --rejection-reason="License wording unclear"
```

```powershell
pnpm ilm:evidence:update -- --domain=tafseer --evidence-key=attribution_wording --status=rejected --reviewer-name="Reviewer Name" --rejection-reason="Attribution text not acceptable"
```

## Validation

```powershell
pnpm check:ilm-evidence-records
pnpm check:ilm-evidence-helper
pnpm typecheck
pnpm build
```

## Non-goal

Sprint 27.1 does not publish content to `noor-cdn`.
