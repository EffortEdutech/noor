# NOOR Scholarly Review Console

Version: 0.24.0  
Sprint: Sprint 24

## Purpose

The scholarly review console is NOOR's first formal review-control layer before production Quran, tafseer or hadith content can be promoted.

It records:

- which domain is being reviewed,
- which generated/imported artifacts are linked to the review,
- what evidence is required,
- whether a named reviewer has signed off,
- whether production promotion is allowed.

## Critical rule

Sprint 24 does **not** approve any source automatically.

All review cases remain blocked until the following evidence is complete:

1. source identity,
2. license or redistribution permission,
3. attribution wording,
4. checksum / integrity plan,
5. scholarly reviewer sign-off.

## Files

- `content-pipeline/review/noor-scholarly-review-console.json`
- `content-pipeline/review/audit/noor-scholarly-review-audit.json`
- `content-pipeline/review/audit/noor-scholarly-review-audit.md`
- `apps/web/components/ScholarlyReviewConsoleCard.tsx`

## Commands

```bash
pnpm review:console
pnpm check:review-console
```

## Production decision

`productionPromotionAllowed` must remain `false` until all review cases have complete evidence and reviewer sign-off.
