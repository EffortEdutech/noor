# Sprint 26.7 — ilm-mate Review Workflow Actions / Evidence Register

## Purpose

Sprint 26.7 turns the Sprint 26.6 review console into a practical reviewer workflow.

It creates small review-action and evidence-register files for the migrated ilm-mate staging content.

## What this sprint does

- Creates per-domain review actions for Quran, Tafseer and Hadith.
- Creates required evidence controls: source identity, license/permission, attribution wording, checksum/integrity, scholarly reviewer sign-off, and production promotion approval.
- Keeps production approval blocked.
- Adds a Settings card for founder/reviewer visibility.

## What this sprint does not do

- It does not approve migrated content.
- It does not publish migrated content to `EffortEdutech/noor-cdn`.
- It does not replace current production CDN demo content.
- It does not bypass scholarly review.

## Commands

```powershell
pnpm ilm:review-actions
pnpm check:ilm-review-actions
pnpm typecheck
pnpm build
```

## Outputs

```text
content-pipeline/review/ilm-mate-v1/actions/
├── review-actions-register.json
├── review-actions-register.md
├── review-actions-register.csv
├── review-evidence-register.json
├── review-evidence-register.md
└── review-evidence-register.csv
```

## Gate rule

Production remains blocked:

```text
productionApproved: false
status: blocked
```

No Quran, Tafseer or Hadith domain may become production approved until all required evidence is complete and manually approved.
