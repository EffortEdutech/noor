# NOOR Sprint 27.16 — Vercel Production Environment

Use these values in Vercel → Project → Settings → Environment Variables → Production.

```text
NEXT_PUBLIC_NOOR_DATA_MODE=cdn
NEXT_PUBLIC_NOOR_MANIFEST_CDN_BASE=https://cdn.jsdelivr.net/gh/EffortEdutech/noor-cdn@main/noor-cdn
NEXT_PUBLIC_NOOR_QURAN_CDN_BASE=https://cdn.jsdelivr.net/gh/EffortEdutech/noor-cdn@main/noor-cdn
NEXT_PUBLIC_NOOR_TAFSEER_CDN_BASE=https://cdn.jsdelivr.net/gh/EffortEdutech/noor-cdn@main/noor-cdn
NEXT_PUBLIC_NOOR_HADITH_CDN_BASE=https://cdn.jsdelivr.net/gh/EffortEdutech/noor-cdn@main/noor-cdn
```

Safety rule: keep Preview and Development environments flexible. Production uses noor-cdn/main. Local development can remain mock fallback.

Fallback remains enabled in code so the app can still show bundled demo content if a CDN request fails.
