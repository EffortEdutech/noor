# Sprint 28.6B-04 — Tafseer Reading Surface Cleanup

**Project:** NOOR  
**Parent sprint:** 28.6B — Tafseer UI Refactoring Foundation  
**Task:** 28.6B-04  
**Scope:** Simplify Tafseer page into a knowledge delivery surface

---

## 1. Purpose

The previous Tafseer page became too full. It had multiple places doing navigation, source summary, workflow explanation, and content listing.

This task moves navigation responsibility into the floating Tafseer navigator and leaves the page itself as the reading surface.

---

## 2. Changed UI Direction

Old direction:

```text
Hero
Workflow card
Source cards
Source picker
Surah picker
Side panel
Mini map
Tafseer cards
Connections panel
Floating navigator
```

New direction:

```text
Compact current context
Small reader actions
Tafseer knowledge content
Floating navigator for all navigation
```

---

## 3. What Changed

```text
[ ] Removed large hero/workflow blocks from the Tafseer page.
[ ] Removed duplicate source and Surah picker sections from the page body.
[ ] Removed side mini-map panel because the floating navigator owns structure navigation.
[ ] Removed repeated connection panel from every tafseer entry.
[ ] Kept compact source and coverage summary.
[ ] Kept Quran context inside the knowledge card.
[ ] Added RTL alignment for Arabic Quran text.
[ ] Added RTL alignment for Arabic and Urdu tafseer bodies.
[ ] Limited very long Quran passage previews to avoid huge blocking panels.
[ ] Improved floating navigator wording to make it the main navigation tool.
```

---

## 4. RTL Rule

The page now applies:

```text
dir="rtl"
text-align: right
unicode-bidi: plaintext
```

For:

```text
[ ] Quran Arabic passage
[ ] Arabic tafseer body
[ ] Urdu tafseer body
```

English, Malay, Indonesian, Chinese, and Tamil tafseer remain left-to-right.

---

## 5. Files Changed

```text
apps/web/app/learn/tafseer/page.tsx
apps/web/app/learn/tafseer/TafseerPage.module.css
apps/web/components/FloatingTafseerNavigator.tsx
apps/web/components/FloatingTafseerNavigator.module.css
docs/SPRINT_28_6B_04_TAFSEER_READING_SURFACE_CLEANUP.md
```

---

## 6. Optional Cleanup

If the old CSS module from Task 28.6B-02 still exists and is no longer imported, it can be removed:

```powershell
Remove-Item apps\web\app\learn\tafseer\tafseer.module.css -ErrorAction SilentlyContinue
```

Only do this after confirming `page.tsx` imports `TafseerPage.module.css`.

---

## 7. QA Checklist

Run:

```powershell
pnpm --filter @noor/web build
```

Manual checks:

```text
[ ] /learn/tafseer loads.
[ ] Page is no longer crowded with duplicate navigation sections.
[ ] Floating Tafseer button opens the source/Surah/ayah navigator.
[ ] Tafseer content is the main focus.
[ ] Quran Arabic passage is right-aligned.
[ ] Arabic tafseer body is right-aligned when source language is Arabic.
[ ] Urdu tafseer body is right-aligned when source language is Urdu.
[ ] English/Malay tafseer body remains left-aligned.
[ ] Long Quran context does not create double scroll.
[ ] Mobile layout remains clean.
```

---

## 8. Next Task

Suggested next task:

```text
Task 28.6B-05 — Tafseer Teaching Actions and Copy Reference
```

This should add copy reference and teaching-prep actions without crowding the reading surface.
