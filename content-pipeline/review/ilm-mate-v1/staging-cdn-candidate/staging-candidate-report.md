# NOOR Sprint 27.7 — ilm-mate Staging CDN Candidate Pack

Generated: 2026-05-02T02:53:59.580Z

## Decision

- Can push noor-cdn staging branch: **true**
- Target repository: `EffortEdutech/noor-cdn`
- Target branch: `staging-ilm-mate-v1`
- Candidate source folder: `content-pipeline/publish/ilm-mate-v1-staging-cdn/noor-cdn`
- Candidate files: **941**
- Candidate JSON files: **940**
- Candidate bytes: **591585323**
- Production approved: **false**
- Can push noor-cdn main: **false**
- Can promote to production: **false**

## Domain readiness

- Quran: stagingReady=true, accepted=5/5
- Tafseer: stagingReady=true, accepted=5/5
- Hadith: stagingReady=true, accepted=5/5

## Required next action

Use this candidate only for a separate `noor-cdn/staging-ilm-mate-v1` branch.

Do **not** push to `noor-cdn/main` in Sprint 27.7.

## Guardrails

- noor-cdn/main must not be updated in Sprint 27.7.
- Only noor-cdn/staging-ilm-mate-v1 is allowed for this candidate.
- Production CDN remains blocked.
- production_promotion_approval records must remain blocked.
- Candidate files are generated under content-pipeline/publish and are intentionally ignored by Git in the noor app repo.

