# NOOR Sprint 27.7 — Staging CDN Candidate Pack

## Purpose

Sprint 27.7 creates the first staging-only CDN candidate pack for migrated ilm-mate content.

This sprint is allowed because Sprint 27.6 made all three domains staging-ready:

- Quran
- Tafseer
- Hadith

## What this sprint allows

- Generate a local staging CDN candidate folder.
- Verify candidate files and checksums.
- Prepare exact commands for `noor-cdn/staging-ilm-mate-v1`.

## What this sprint does not allow

- Do not push `noor-cdn/main`.
- Do not approve production.
- Do not set `canPromoteToProduction` to true.
- Do not modify production CDN settings.

## Commands

```powershell
pnpm ilm:staging-cdn-candidate
pnpm check:ilm-staging-cdn-candidate
```

## Generated output

Review/report output:

```text
content-pipeline/review/ilm-mate-v1/staging-cdn-candidate/
```

Local candidate output:

```text
content-pipeline/publish/ilm-mate-v1-staging-cdn/noor-cdn/
```

The `content-pipeline/publish/` folder is ignored by Git in the NOOR app repo because it can contain large generated CDN artifacts.

## noor-cdn target

Only this branch is allowed:

```text
EffortEdutech/noor-cdn
branch: staging-ilm-mate-v1
```

Production branch remains blocked:

```text
EffortEdutech/noor-cdn
branch: main
```
