# NOOR Sprint 9 — Reader Preferences + Quran Study Controls

## Objective

Sprint 9 improves the Quran reader so NOOR starts feeling like a real daily study app instead of a static content page.

## Added

1. Local reader preferences
2. Quran reader preference panel
3. Translation mode:
   - English + Malay
   - English only
   - Malay only
4. Arabic size:
   - Compact
   - Comfortable
   - Large
5. Toggle transliteration display
6. Toggle tafseer notes
7. Focus mode card highlight
8. Reader preference panel in Settings
9. App version update to `0.9.0`

## Files

```text
apps/web/lib/reader-preferences.ts
apps/web/components/ReaderPreferencesPanel.tsx
apps/web/components/AyahStudyCard.tsx
apps/web/app/learn/quran/[surah]/page.tsx
apps/web/app/settings/page.tsx
apps/web/lib/app-version.ts
apps/web/public/version.json
scripts/check-noor-pack.mjs
```

## Local storage key

```text
noor.readerPreferences.v1
```

## Test checklist

1. Open `/learn/quran/1`
2. Change translation mode to English only
3. Confirm Malay translation hides
4. Change translation mode to Malay only
5. Confirm English translation hides
6. Change Arabic size to Large
7. Confirm Arabic text becomes bigger
8. Toggle tafseer off
9. Confirm tafseer cards hide
10. Turn focus mode on
11. Confirm ayah cards use the gold-highlight card style
12. Refresh page
13. Confirm preferences remain saved
14. Open `/settings`
15. Confirm reader preference panel appears there too
