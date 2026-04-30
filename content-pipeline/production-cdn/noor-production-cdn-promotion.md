# NOOR Production CDN v1 Promotion

Version: 0.25.0
Status: blocked
Production promotion allowed: false
Runtime default: bundled

## Gate summary

- Review console: blocked; approved cases 0/3
- Quran import: blocked
- Tafseer import: blocked
- Hadith import: blocked

## Blocked reasons

- Scholarly review cases are not fully approved.
- Imported Quran, tafseer and hadith reports are not approved for production.
- Review console summary does not allow production promotion.

## Environment preview

```env
NEXT_PUBLIC_NOOR_CONTENT_SOURCE=bundled
NEXT_PUBLIC_NOOR_QURAN_CDN_BASE=
NEXT_PUBLIC_NOOR_TAFSEER_CDN_BASE=
NEXT_PUBLIC_NOOR_HADITH_CDN_BASE=
NEXT_PUBLIC_NOOR_MANIFEST_CDN_BASE=
```

Sprint 25 does not silently switch NOOR to external CDN mode.
