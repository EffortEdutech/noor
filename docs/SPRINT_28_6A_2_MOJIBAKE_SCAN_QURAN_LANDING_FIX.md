# Sprint 28.6A.2 Hotfix — Mojibake Scan and Quran Landing Fix

## Problem

The Quran landing rendered:

```txt
As-Saff Â· Ayah 1
The Ranks Â· 14 ayat
```

`Â` is a mojibake artifact. It appears when UTF-8 characters such as middot are interpreted or saved with the wrong encoding.

The same file also had a broken Arabic fallback string for Al-Fatihah.

## Fix

`apps/web/components/QuranLastVisitLanding.tsx`

- Replace broken separator with ASCII-safe ` - `
- Replace broken Arabic fallback with `Al-Fatihah`
- Add `scripts/scan-mojibake.mjs` to detect future broken text

## Scan

Run:

```powershell
node .\scripts\scan-mojibake.mjs
```

The scanner returns non-zero if it finds suspicious text. Review results before committing.
