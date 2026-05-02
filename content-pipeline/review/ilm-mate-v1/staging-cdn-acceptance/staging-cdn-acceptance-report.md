# NOOR Sprint 27.10 — Staging CDN Acceptance Report

Generated: 2026-05-02T10:53:09.219Z
Selected CDN root: ../noor-cdn/noor-cdn
Staging accepted: YES
Production promotion: BLOCKED

## Checklist

| Status | Severity | Check | Notes |
|---|---|---|---|
| ✅ pass | required | A staging CDN folder is available locally | selected: ../noor-cdn/noor-cdn<br>label: sibling noor-cdn repository |
| ✅ pass | required | Local noor-cdn repository is on staging branch | branch: staging-ilm-mate-v1<br>expected: staging-ilm-mate-v1 |
| ✅ pass | recommended | Local noor-cdn working tree is clean | statusShort: (clean) |
| ✅ pass | required | Manifest and health files exist | exists: true<br>healthExists: true<br>fileIndexExists: true<br>version: 0.26.5<br>status: null |
| ✅ pass | required | Quran staging CDN has 114 surahs and 6,236 ayat | surahIndexCount: 114<br>surahFiles: 114<br>ayat: 6236 |
| ✅ pass | required | Tafseer staging CDN index and files are present | indexExists: true<br>indexEntries: 6<br>tafseerFiles: 684<br>sampledEntryCount: 15145<br>sampleFilesChecked: 250 |
| ✅ pass | required | Hadith collections include both by_book and by_chapter views | collections: 630<br>byBook: 627<br>byChapter: 607 |
| ✅ pass | required | Hadith collection IDs are globally unique | duplicateCollectionIds: [] |
| ✅ pass | required | Hadith sampled item IDs are unique inside each CDN collection | sampledItemFiles: 630<br>duplicateItemIdSamples: []<br>emptyItemFileCountInSample: 0<br>emptyItemFileSamples: [] |
| ✅ pass | required | Search index exists and has entries | path: search/search-index-lite.json<br>exists: true<br>entries: 5000<br>sourceTypes: ["hadith"] |
| ✅ pass | required | Runtime env points to staging CDN branch, not noor-cdn main | envFiles: [".env.local","apps/web/.env.local"]<br>containsStagingBranch: true<br>containsNoorCdnMain: false |
| ✅ pass | required | Production promotion remains blocked until explicit final approval | noorCdnMainTouched: false<br>productionBranch: main<br>requiredNextStepBeforeProduction: Manual review sign-off + explicit promotion sprint |

## Summary

```json
{
  "quran": {
    "surahIndexCount": 114,
    "surahFiles": 114,
    "ayat": 6236
  },
  "tafseer": {
    "indexExists": true,
    "indexEntries": 6,
    "tafseerFiles": 684,
    "sampledEntryCount": 15145,
    "sampleFilesChecked": 250
  },
  "hadith": {
    "collections": 630,
    "byBook": 627,
    "byChapter": 607,
    "duplicateCollectionIds": 0
  },
  "search": {
    "path": "search/search-index-lite.json",
    "exists": true,
    "entries": 5000,
    "sourceTypes": [
      "hadith"
    ]
  },
  "requiredFailures": [],
  "recommendedFailures": []
}
```

## Decision

Staging CDN is accepted for reviewer/runtime testing only. Do not promote noor-cdn/main yet.

Production CDN remains blocked. noor-cdn/main must not be updated by this sprint.
