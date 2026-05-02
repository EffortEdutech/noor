# NOOR Sprint 27.11 — Staging Browser QA Report

Generated: 2026-05-02T13:51:19.479Z
Overall status: ACCEPTED_FOR_STAGING_BROWSER_QA
Production promotion: BLOCKED

## Preflight

| Status | Severity | Check | Details |
|---|---|---|---|
| ✅ pass | required | Sprint 27.10 staging acceptance report exists and is accepted | exists: true<br>acceptedForStaging: true<br>requiredFailures: [] |
| ✅ pass | required | Runtime env references staging-ilm-mate-v1 and avoids noor-cdn main | envFiles: [".env.local","apps/web/.env.local",".env.local.staging-ilm-mate-v1"]<br>containsStagingBranch: true<br>containsNoorCdnMain: false |
| ✅ pass | required | Production CDN remains blocked | noorCdnMainTouched: false<br>productionPromotion: blocked |

## Manual browser checklist

| Status | Severity | ID | Page | Expected | Evidence / Notes |
|---|---|---|---|---|---|
| ✅ pass | required | settings-runtime-source | http://localhost:3200/settings | Data mode is cdn / External CDN and CDN bases point to staging-ilm-mate-v1. Production remains blocked. | Manual browser QA completed on localhost:3200 against staging CDN. |
| ✅ pass | required | settings-production-block | http://localhost:3200/settings | Production CDN remains blocked and noor-cdn/main is not promoted. | Manual browser QA completed on localhost:3200 against staging CDN. |
| ✅ pass | required | quran-index-cdn | http://localhost:3200/learn/quran | Page says Runtime content source: cdn and displays the Surah index. | Manual browser QA completed on localhost:3200 against staging CDN. |
| ✅ pass | required | quran-surah-001 | http://localhost:3200/learn/quran/001 | Surah Al-Fatihah opens with ayat content from CDN. | Manual browser QA completed on localhost:3200 against staging CDN. |
| ✅ pass | required | quran-surah-114 | http://localhost:3200/learn/quran/114 | Surah An-Nas opens with ayat content from CDN. | Manual browser QA completed on localhost:3200 against staging CDN. |
| ✅ pass | required | tafseer-library-cdn | http://localhost:3200/learn/tafseer | Tafseer CDN library appears with selectable Tafseer sources/books. | Manual browser QA completed on localhost:3200 against staging CDN. |
| ✅ pass | required | tafseer-sample-entry | http://localhost:3200/learn/tafseer | At least one Tafseer source and Surah sample displays entries. | Manual browser QA completed on localhost:3200 against staging CDN. |
| ✅ pass | required | hadith-by-book | http://localhost:3200/learn/hadith | View by book count is greater than 0 and collections render. | Manual browser QA completed on localhost:3200 against staging CDN. |
| ✅ pass | required | hadith-by-chapter | http://localhost:3200/learn/hadith | View by chapter count is greater than 0 and chapter collections render. | Manual browser QA completed on localhost:3200 against staging CDN. |
| ✅ pass | required | hadith-no-duplicate-key | http://localhost:3200/learn/hadith | Browser console has no duplicate key `all` warning/error. | Manual browser QA completed on localhost:3200 against staging CDN. |
| ✅ pass | required | explore-search-cdn | http://localhost:3200/explore | Search source shows External CDN search index and returns results. | Manual browser QA completed on localhost:3200 against staging CDN. |
| ✅ pass | recommended | explore-hadith-dedup-observation | http://localhost:3200/explore | If the same canonical Hadith appears by book and by chapter, note it for Sprint 27.12 dedup/search refinement. | Manual browser QA completed on localhost:3200 against staging CDN. |
| ✅ pass | required | network-no-critical-errors | Chrome DevTools → Network / Console | No repeated 404/CORS failures for manifest, Quran, Tafseer, Hadith, or search files. | Manual browser QA completed on localhost:3200 against staging CDN. |

## Summary

```json
{
  "totalTasks": 13,
  "requiredTasks": 12,
  "requiredPassed": 12,
  "requiredPending": 0,
  "requiredFailed": 0,
  "recommendedPending": 0,
  "recommendedFailed": 0,
  "autoRequiredFailures": [],
  "requiredPendingIds": [],
  "requiredFailedIds": [],
  "recommendedPendingIds": [],
  "recommendedFailedIds": []
}
```

Production CDN remains blocked. noor-cdn/main must not be updated by Sprint 27.11.
