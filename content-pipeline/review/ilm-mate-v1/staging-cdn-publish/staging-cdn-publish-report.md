# NOOR Sprint 27.4 — ilm-mate Staging CDN Publish Pack Gate

Generated: 2026-05-02T00:09:53.107Z

## Gate status

- Status: **blocked**
- Target noor-cdn staging branch: `staging-ilm-mate-v1`
- Can push noor-cdn staging branch: **false**
- Can push noor-cdn main: **false**
- Production approved: **false**
- Can promote to production: **false**
- Domains ready for staging: **0/3**

## Domain readiness

### Quran

- Accepted for staging: **1/5**
- Staging ready: **false**
- Missing: `license_or_permission`, `attribution_wording`, `checksum_integrity_plan`, `scholarly_reviewer_signoff`
- Production approved: **false**

### Tafseer

- Accepted for staging: **1/5**
- Staging ready: **false**
- Missing: `license_or_permission`, `attribution_wording`, `checksum_integrity_plan`, `scholarly_reviewer_signoff`
- Production approved: **false**

### Hadith

- Accepted for staging: **1/5**
- Staging ready: **false**
- Missing: `license_or_permission`, `attribution_wording`, `checksum_integrity_plan`, `scholarly_reviewer_signoff`
- Production approved: **false**


## Current decision

Sprint 27.4 generates the staging CDN publish gate and command pack only. It does **not** publish migrated ilm-mate content because not all non-production evidence is accepted for staging.

## Safe noor-cdn rule

- Allowed later: `noor-cdn/staging-ilm-mate-v1` after all three domains are staging-ready.
- Not allowed now: `noor-cdn/main`.
- Production CDN remains blocked until a future explicit production promotion sprint.

## Required next evidence

- Quran: `license_or_permission`
- Quran: `attribution_wording`
- Quran: `checksum_integrity_plan`
- Quran: `scholarly_reviewer_signoff`
- Tafseer: `license_or_permission`
- Tafseer: `attribution_wording`
- Tafseer: `checksum_integrity_plan`
- Tafseer: `scholarly_reviewer_signoff`
- Hadith: `license_or_permission`
- Hadith: `attribution_wording`
- Hadith: `checksum_integrity_plan`
- Hadith: `scholarly_reviewer_signoff`

