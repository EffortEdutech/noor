# Sprint 16 — CDN Promotion Bundle and Environment Handoff

## Goal

Sprint 16 adds the final local handoff step after CDN smoke testing. Sprint 15 proves that a published CDN URL works; Sprint 16 converts that verified URL into a repeatable promotion bundle for local `.env.local` and Vercel environment variables.

## Added

- `pnpm cdn:promote <published-cdn-base>`
- `pnpm check:cdn-promotion`
- Settings CDN Promotion card
- Generated local promotion files:
  - `content-pipeline/promotion/noor-cdn-promotion.json`
  - `content-pipeline/promotion/noor-cdn.env.local`
  - `content-pipeline/promotion/noor-cdn-promotion-checklist.md`
- CI promotion validation
- NOOR v0.16.0 release metadata

## Promotion rule

Do not promote a CDN base until this passes:

```powershell
pnpm cdn:smoke <published-cdn-base>
```

Then generate the handoff:

```powershell
pnpm cdn:promote <published-cdn-base>
```

## Manual gate

The generated files are intentionally ignored by git. They are local handoff artefacts, not source code.

Copy the generated environment values into:

1. local `.env.local`, or
2. Vercel Project Settings → Environment Variables.

Then rebuild/redeploy.

## Not included yet

- Automatic Vercel environment mutation
- Automatic deployment to the external `noor-cdn` repository
- Production Quran/Tafseer/Hadith content promotion
- Scholarly approval workflow
