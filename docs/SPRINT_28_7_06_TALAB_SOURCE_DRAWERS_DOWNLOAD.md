# Sprint 28.7-06 — Talab Source Drawers and Result Download

**Project:** NOOR  
**Sprint:** 28.7  
**Patch:** 28.7-06

---

## 1. Purpose

This patch clarifies the difference between browser-local saving and file download, then improves Quran Reader Talab an-Noor so it uses the same source-aware workflow as Tafseer.

---

## 2. Save Behaviour

Previous label:

```text
Save locally
```

was technically correct but confusing.

New labels:

```text
Download .txt
Save in browser
```

- **Download .txt** creates a real text file download.
- **Save in browser** stores the result in browser local storage for the NOOR Library.

---

## 3. Quran Reader Talab Cleanup

Removed the old static panel from Quran Reader Talab:

```text
Understand this ayah
Pure tawhid
Read / Understand / Respond
One action today
Save
Open tafseer library
Return to ayah
```

Talab an-Noor in Quran Reader now focuses on:

- Quran passage
- meaning translation
- tafseer source sent to AI
- source gathering status
- Generate Reflection
- Generate Ishraq Notes
- Prepare Lesson
- Copy / download / save result

---

## 4. QA Checklist

Build:

```powershell
pnpm --filter @noor/web build
```

Browser:

```text
/learn/quran/112
/learn/tafseer?surah=112
```
