# Sprint 28.7-08 — Talab Library UX and Quran/Tafseer Source Polish

**Project:** NOOR  
**Sprint:** 28.7  
**Patch:** 28.7-08

---

## 1. Purpose

Patch 28.7-08 improves Talab an-Noor after the first save-to-library foundation.

The goal is to make saved Talab notes easier to find, and to make the Quran/Tafseer source drawers safer and cleaner for mobile learning.

---

## 2. Included Stabilization

Your previous local status showed Patch 28.7-06 Quran Reader cleanup files were still uncommitted. This patch intentionally includes the Quran Reader cleanup again so the old static panel is removed from version control.

Removed from Quran Reader Talab:

```text
Understand this ayah
Pure tawhid
Read / Understand / Respond
One action today
Open tafseer library
Return to ayah
```

---

## 3. Talab Library UX

The `/library` Saved Talab notes panel now supports:

```text
Search
Filter by type
Filter by source surface
Latest saved summary
Matched count
Clear filters
```

Type filters:

```text
Reflection
Ishraq notes
Lesson
```

Source filters:

```text
Quran Reader
Tafseer
```

---

## 4. Source Drawer Polish

Talab an-Noor source drawers now include:

```text
Quran passage
Meaning translation
Tafseer source sent to AI
Relationship status
```

The Tafseer source is collapsed by default and long tafseer text is shortened first with:

```text
Show full source
Show shorter source
```

This avoids a huge blocking source block on mobile.

---

## 5. Open Library Link

After generation, the result action row now includes:

```text
Open Library
```

This makes it clearer that `Save in browser` is linked to the Library.

---

## 6. Mojibake QA

Added:

```text
scripts/check-noor-ui-mojibake.ps1
```

It checks common broken text fragments:

```text
Â
Ã
â€
âœ
�
```

Run:

```powershell
.\scripts\check-noor-ui-mojibake.ps1
```

---

## 7. QA Checklist

Build:

```powershell
pnpm --filter @noor/web build
```

Browser:

```text
/learn/quran/112
/learn/tafseer?surah=112
/library
```

Check:

- Quran Reader Talab no longer shows old `Understand this ayah`.
- Source drawers are collapsed and expandable.
- Tafseer source has `Show full source` when long.
- `Open Library` appears after generation.
- Save in browser appears in Library.
- Library search works.
- Library type filter works.
- Library Quran/Tafseer filter works.
- Mojibake script passes.
