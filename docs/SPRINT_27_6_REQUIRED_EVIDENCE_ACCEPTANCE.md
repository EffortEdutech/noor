# NOOR Sprint 27.6 — Required Evidence Reviewer Acceptance

## Purpose

Sprint 27.6 accepts the remaining non-production ilm-mate evidence records for staging candidate review.

This sprint is not production promotion. It does not allow `noor-cdn/main` publication.

## Accepted evidence records

Sprint 27.6 accepts 12 records:

- Quran license or permission
- Quran attribution wording
- Quran checksum / integrity plan
- Quran scholarly reviewer sign-off
- Tafseer license or permission
- Tafseer attribution wording
- Tafseer checksum / integrity plan
- Tafseer scholarly reviewer sign-off
- Hadith license or permission
- Hadith attribution wording
- Hadith checksum / integrity plan
- Hadith scholarly reviewer sign-off

Together with the 3 source identity records accepted in Sprint 27.3, this means all 15 non-production evidence records are accepted for staging review.

## Gate result

Expected after running `pnpm ilm:required-evidence-acceptance`:

- Required evidence reviewed: 12
- Accepted for staging: 15
- Domains ready for staging: 3/3
- Can push noor-cdn staging branch: true
- Can push noor-cdn main: false
- Production approved: false
- Can promote to production: false

## Commands

```powershell
pnpm ilm:required-evidence-acceptance
pnpm check:ilm-required-evidence-acceptance
pnpm check:ilm-staging-cdn-pack
pnpm check:ilm-evidence-records
pnpm check:ilm-evidence-helper
pnpm typecheck
pnpm build
```

## Guardrails

- `production_promotion_approval` records remain blocked.
- `productionApproved` remains false.
- `canPromoteToProduction` remains false.
- `noor-cdn/main` must not be pushed.
- The next safe CDN step is a staging branch candidate only.
