# Sprint 27.13 - Production CDN Promotion Approval Gate

## Status

Approval gate sprint.

Sprint 27.13 may approve the staging CDN candidate for production promotion, but it does **not** promote `noor-cdn/main`.

## Purpose

Sprint 27.13 creates an explicit production approval record after:

- Sprint 27.10 staging CDN acceptance passed.
- Sprint 27.11 browser QA passed.
- Sprint 27.12 release metadata was updated.
- `noor-cdn/staging-ilm-mate-v1` remains the tested CDN branch.

## Safety Rule

This sprint only records approval.

It must not:

- copy staging CDN files into `noor-cdn/main`,
- push `noor-cdn/main`,
- change production runtime default,
- remove the review/audit trail.

Actual production promotion belongs to:

```text
Sprint 27.14 - Promote noor-cdn staging to production main
```

## Required Approval Command

```powershell
pnpm production:approval-gate -- --approve --approver "Darya Malak" --note "Founder approval for Sprint 27.14 production CDN promotion."
```

## Required Checks

```powershell
pnpm check:production-approval-gate
pnpm check:sprint27-13
pnpm check:pack
pnpm typecheck
pnpm build
```

## Output Files

```text
content-pipeline/production-cdn/approval-gate/noor-production-cdn-approval-gate.json
content-pipeline/production-cdn/approval-gate/noor-production-cdn-approval-gate.md
```

## Production Branch State

Allowed source branch:

```text
noor-cdn/staging-ilm-mate-v1
```

Blocked target branch until Sprint 27.14:

```text
noor-cdn/main
```

## Outcome

When Sprint 27.13 passes, NOOR is approved for the next production promotion sprint.

Production CDN is still not live until Sprint 27.14 pushes `noor-cdn/main`.
