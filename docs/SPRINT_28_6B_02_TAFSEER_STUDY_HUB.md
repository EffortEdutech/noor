# Sprint 28.6B-02 â€” Tafseer Study Hub Layout

**Project:** NOOR  
**Parent sprint:** 28.6B â€” Tafseer UI Refactoring Foundation  
**Task:** 28.6B-02  
**Status:** Patch pack ready  
**Scope:** Study hub page layout only

---

## 1. Purpose

This task refactors `/learn/tafseer` from a basic tafseer browse page into a guided Tafseer Study Hub.

The goal is to make the first Tafseer screen answer:

```text
Which Quran passage am I studying?
Which tafseer source explains it?
What language is this source?
What coverage is available?
How do I return to Quran context?
Where can I continue next?
```

---

## 2. Files Changed

```text
apps/web/app/learn/tafseer/page.tsx
apps/web/app/learn/tafseer/tafseer.module.css
```

---

## 3. What Changed

```text
[ ] Added a study-oriented Tafseer hero.
[ ] Added quick passage and source navigator.
[ ] Replaced the old Surah number button wall with Surah select navigation.
[ ] Added language selection.
[ ] Added tafseer source selection.
[ ] Added ayah and ayah range inputs.
[ ] Added Quran passage context card.
[ ] Added source awareness card.
[ ] Added source/language/entry/coverage metadata.
[ ] Improved tafseer entry cards.
[ ] Added available source groups by language.
[ ] Kept query-param routing to reduce risk.
[ ] Avoided risky Unicode symbols in UI strings.
[ ] Avoided CDN/importer changes.
```

---

## 4. URL Examples

```text
/learn/tafseer
/learn/tafseer?surah=1
/learn/tafseer?book=en-al-jalalayn&surah=1&ayah=1
/learn/tafseer?book=en-al-jalalayn&surah=1&from=1&to=7
```

---

## 5. Out of Scope

```text
[ ] Mobile command sheet JavaScript behavior.
[ ] Quran reader source-aware tafseer bridge.
[ ] CDN content cleanup.
[ ] Tafseer importer changes.
[ ] Bookmark sync.
[ ] AI summary or teaching generation.
```

---

## 6. QA Checklist

Run:

```powershell
pnpm --filter @noor/web build
```

Manual checks:

```text
[ ] /learn/tafseer loads.
[ ] Language selector appears.
[ ] Source selector appears.
[ ] Surah selector appears.
[ ] Ayah and range inputs appear.
[ ] Quran context link works.
[ ] Tafseer source metadata is visible.
[ ] Tafseer entries show ayah or range reference.
[ ] Available sources are grouped by language.
[ ] Mobile layout stacks cleanly.
[ ] No new mojibake UI strings.
```

---

## 7. Next Task

After this task is stable, continue with:

```text
Task 28.6B-03 â€” Tafseer Workspace and Teaching Actions
```

This next task should improve copy reference, save/bookmark placement, Ishraqaration prompts, and the focused workspace behavior.

