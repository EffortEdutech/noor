# NOOR Sprint 27.4 — ilm-mate Staging CDN Publish Pack Gate

Generated: 2026-05-02T02:53:56.394Z

## Gate status

- Status: **blocked**
- Target noor-cdn staging branch: `staging-ilm-mate-v1`
- Can push noor-cdn staging branch: **true**
- Can push noor-cdn main: **false**
- Production approved: **false**
- Can promote to production: **false**
- Domains ready for staging: **3/3**

## Domain readiness

### Quran

- Accepted for staging: **5/5**
- Staging ready: **true**
- Missing: none
- Production approved: **false**

### Tafseer

- Accepted for staging: **5/5**
- Staging ready: **true**
- Missing: none
- Production approved: **false**

### Hadith

- Accepted for staging: **5/5**
- Staging ready: **true**
- Missing: none
- Production approved: **false**


## Current decision

Sprint 27.4 generates the staging CDN publish gate and command pack only. It does **not** publish migrated ilm-mate content because not all non-production evidence is accepted for staging.

## Safe noor-cdn rule

- Allowed later: `noor-cdn/staging-ilm-mate-v1` after all three domains are staging-ready.
- Not allowed now: `noor-cdn/main`.
- Production CDN remains blocked until a future explicit production promotion sprint.

## Required next evidence



