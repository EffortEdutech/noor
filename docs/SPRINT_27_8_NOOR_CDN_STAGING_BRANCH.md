# Sprint 27.8 — Push noor-cdn Staging Branch

## Purpose

Sprint 27.8 prepares and verifies the handoff for publishing migrated ilm-mate content to a dedicated staging branch in `EffortEdutech/noor-cdn`.

## Allowed target

```text
EffortEdutech/noor-cdn
branch: staging-ilm-mate-v1
```

## Blocked targets

```text
EffortEdutech/noor-cdn/main
production CDN
```

## Commands

```powershell
pnpm cdn:staging-handoff
pnpm check:cdn-staging-handoff
```

Then follow:

```text
content-pipeline/review/ilm-mate-v1/noor-cdn-staging-branch/push-noor-cdn-staging-branch.md
```

## Governance

This sprint does not approve production publishing. Production remains blocked until explicit production approval evidence is accepted.
