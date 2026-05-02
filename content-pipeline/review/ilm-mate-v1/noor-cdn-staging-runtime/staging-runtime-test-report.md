# NOOR Sprint 27.9 staging CDN runtime test

Base URL:

```text
https://cdn.jsdelivr.net/gh/EffortEdutech/noor-cdn@staging-ilm-mate-v1/noor-cdn
```

## Result

- Passed: true
- Required endpoints passed: 10/10
- Target branch: staging-ilm-mate-v1
- noor-cdn main allowed: false
- Production promotion allowed: false

| Endpoint | Result | HTTP | Bytes | Path |
|---|---:|---:|---:|---|
| manifest | PASS | 200 | 1765 | manifest/noor-content-manifest.json |
| health | PASS | 200 | 2540 | manifest/noor-content-health.json |
| search_manifest | PASS | 200 | 4645 | manifest/search-index-manifest.json |
| surah_index | PASS | 200 | 23739 | metadata/surah-index.json |
| quran_001 | PASS | 200 | 3910 | quran/surahs/001.json |
| quran_002 | PASS | 200 | 497064 | quran/surahs/002.json |
| tafseer_001 | PASS | 200 | 129558 | tafseer/ar-tafsir-ibn-kathir/surahs/001.json |
| hadith_collections | PASS | 200 | 108238 | hadith/collections.json |
| hadith_01 | PASS | 200 | 276681 | hadith/01/items.json |
| search_lite | PASS | 200 | 7153427 | search/search-index-lite.json |

## Next browser test

Run:

```powershell
pnpm cdn:staging-env -- --write-local
pnpm dev
```

Open:

- http://localhost:3200/settings
- http://localhost:3200/learn/quran
- http://localhost:3200/explore

Production CDN remains blocked.
