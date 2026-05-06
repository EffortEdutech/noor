# Sprint 28.6B-05 — Quran Bismillah Display Rule Lock

**Project:** NOOR  
**Parent sprint:** 28.6B — Tafseer UI Refactoring Foundation  
**Task:** 28.6B-05  
**Scope:** Lock Quran Bismillah display rule and add app-side safety helper

---

## 1. Purpose

The current Quran CDN JSON may include Bismillah at the beginning of ayah 1 for every Surah.

This task locks the rule that Bismillah must not be treated as part of ayah 1 except in Surah 1, Al-Fatihah.

---

## 2. Files Added

```text
docs/content/QURAN_BISMILLAH_DISPLAY_RULE.md
docs/SPRINT_28_6B_05_QURAN_BISMILLAH_DISPLAY_RULE_LOCK.md
apps/web/lib/quran-bismillah.ts
```

---

## 3. What This Locks

```text
[ ] Surah 1: Bismillah is ayah 1.
[ ] Surah 2 to 114 except Surah 9: Bismillah is not part of ayah 1.
[ ] Surah 9: no Bismillah header.
[ ] App surfaces must use the display helper or equivalent logic.
[ ] CDN normalization should remove embedded non-Fatihah Bismillah from ayah 1.
```

---

## 4. Helper

```text
apps/web/lib/quran-bismillah.ts
```

Exports:

```text
QURAN_BISMILLAH
hasBismillahPrefix
stripNonFatihahBismillahFromAyah
getDisplayArabicForAyah
getSurahBismillahHeader
```

---

## 5. Next App Wiring Rule

Any Quran Arabic display should call:

```ts
getDisplayArabicForAyah(ayah)
```

Any Surah-level display that wants a separate Bismillah header should call:

```ts
getSurahBismillahHeader(content, content.ayahs[0])
```

---

## 6. QA Checklist

```text
[ ] /learn/quran/1 keeps Al-Fatihah ayah 1 as Bismillah.
[ ] /learn/quran/2 does not show Bismillah inside 2:1.
[ ] /learn/quran/9 does not show Bismillah header.
[ ] Tafseer passage previews use the same rule.
[ ] Copy/share uses the same rule.
[ ] Arabic remains RTL aligned.
```

---

## 7. Related CDN Patch

This is paired with:

```text
CDN-QURAN-01 — Normalize Quran Bismillah in noor-cdn
```

The app-side helper must remain even after CDN normalization.
