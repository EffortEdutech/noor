# Sprint 28.6A.2 Final Fix - Quran Mode in App Topbar

## Required behavior

On Quran reader pages:

```txt
[NOOR]                         [Read] [Meaning] [Study] [Settings]
```

## Fix

- Adds a mode slot in AppShell before Settings.
- Replaces QuranReadingExperience with a clean topbar-only mode implementation.
- Removes the old sticky modebar from the Quran reader.
- Hides any old `.noor-quran-v2-modebar` by CSS as a safety net.
- Uses ASCII-safe separators to avoid mojibake.
