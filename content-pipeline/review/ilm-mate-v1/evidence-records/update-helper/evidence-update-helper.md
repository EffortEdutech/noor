# NOOR Sprint 27.1 — ilm-mate Evidence Record Update Helper

Generated: 2026-05-01T23:29:30.061Z

## Gate status

- Status: **blocked**
- Production approved: **false**
- Can promote to production: **false**
- Evidence records: **18**

## Allowed update statuses

- `draft`
- `not-submitted`
- `submitted`
- `under-review`
- `accepted-for-staging`
- `needs-more-information`
- `rejected`

## Common commands

```powershell
pnpm ilm:evidence-helper
pnpm ilm:evidence:list
pnpm ilm:evidence:list -- --domain=quran
pnpm ilm:evidence:update -- --id=ilm-mate-v1-quran-source_identity-evidence-record --status=submitted --reviewer-name="Reviewer Name" --evidence-reference="Evidence reference"
pnpm ilm:evidence:update -- --domain=quran --evidence-key=source_identity --status=under-review --reviewer-name="Reviewer Name"
pnpm check:ilm-evidence-records && pnpm check:ilm-evidence-helper
```

## Policy

Sprint 27.1 may update staging evidence records only. It must not approve production CDN publication.
