# Sprint 28.6B-05B — Bismillah Display Hotfix

**Project:** NOOR  
**Parent sprint:** 28.6B — Tafseer UI Refactoring Foundation  
**Task:** 28.6B-05B  
**Scope:** Stop Surah-level Bismillah metadata from appearing inside ayah/passage display surfaces.

## 1. Problem

After CDN normalization, Surah JSON may contain clean ayah text and Surah-level Bismillah metadata.

The app must not render the Surah-level metadata as if it belongs to `112:1`.

## 2. Correct Rule

For ayah-level and passage-level surfaces:

```text
Displayed ayah text must come from ayah.arabic after app-side Bismillah safety stripping.
Do not prepend surah.bismillah to ayah 1.
Do not show surah.bismillah inside Tafseer passage preview cards.
Do not show surah.bismillah inside Quran ayah cards.
```

Surah-level Bismillah display may be designed later as a clearly separate Surah opening element, but it must never be visually attached to the ayah reference.

## 3. Files Changed by Script

```text
apps/web/components/QuranReadingExperience.tsx
apps/web/app/learn/tafseer/page.tsx
apps/web/app/learn/tafseer/TafseerPage.module.css
```

## 4. QA

Run:

```powershell
pnpm --filter @noor/web build
```

Manual checks:

```text
/learn/quran/112
- 112:1 must show only: قُلْ هُوَ ٱللَّهُ أَحَدٌ
- It must not show Bismillah before 112:1.

/learn/tafseer?surah=112
- Tafseer Quran passage preview must not show Bismillah inside the 112:1 passage.

/learn/quran/1
- Al-Fatihah 1:1 must still show Bismillah because it is the actual ayah text.

/learn/quran/9
- No Bismillah header.
```

## 5. Important Note

The CDN metadata is not wrong.

The display bug was caused by the app rendering metadata Bismillah too close to ayah/passage content.

This hotfix keeps the app-side stripping guard but removes metadata Bismillah rendering from ayah/passage surfaces.
