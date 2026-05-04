# Sprint 28.5M — Quran Navigation and Reading Surface Reset

## Purpose

This sprint corrects the Quran learning flow. `/learn/quran` must not require the user to open and close unrelated accordions just to find a Surah. `/learn/quran/[surah]` must not behave like a dense study dashboard by default.

## Product Rule

Quran reading is the primary action. Navigation and study controls must support the reading, not compete with it.

## Changed Pages

- `/learn`
- `/learn/quran`
- `/learn/quran/[surah]`

## Changed Components

- `apps/web/components/QuranSurahNavigatorPanel.tsx`
- `apps/web/components/FloatingQuranNavigator.tsx`
- `apps/web/components/QuranReadingExperience.tsx`

## UX Changes

1. `/learn` becomes a simple source-selection hub.
2. `/learn/quran` becomes a real Quran navigation page with:
   - Direct Surah/Ayah jump
   - Searchable Surah list
   - Quick references
3. `/learn/quran/[surah]` becomes a calm reader with:
   - Arabic-focused reading surface
   - Read / Meaning / Study modes
   - Floating Surah/Ayah navigator
   - Tafseer and actions hidden inside Study mode
4. The user should no longer need to go back and forth to find the Surah list.

## Test URLs

- `/learn`
- `/learn/quran`
- `/learn/quran/1`
- `/learn/quran/32#ayah-15`
- `/learn/quran/55#ayah-71`
