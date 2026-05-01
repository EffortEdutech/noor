# Sprint 26.6 — ilm-mate Migrated Content Review Console

## Purpose

Sprint 26.5 migrated old ilm-mate content into NOOR staging format. Sprint 26.6 adds a review console so the migrated staging content can be inspected safely before any production CDN promotion.

## Input

```text
content-pipeline/imported/ilm-mate-v1/noor-cdn
```

## Output

```text
content-pipeline/review/ilm-mate-v1/
├── review-console.json
├── review-console.md
├── review-sample-queue.json
├── review-sample-queue.md
└── review-action-register.csv
```

## Commands

```powershell
pnpm ilm:review-console
pnpm check:ilm-review-console
pnpm typecheck
pnpm build
```

## Required evidence before production

- Source identity
- License or written redistribution permission
- Attribution wording
- Checksum/integrity plan
- Scholarly reviewer sign-off
- Production promotion approval

## Gate status

```text
status: blocked
productionApproved: false
```

This sprint does not publish to `noor-cdn`, approve old ilm-mate data, bypass scholarly review, or change production CDN promotion.
