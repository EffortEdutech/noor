# Sprint 28.7-05 — Talab an-Noor Result Actions

**Project:** NOOR  
**Sprint:** 28.7  
**Patch:** 28.7-05  
**Scope:** Copy, save, and clear generated AI results.

---

## 1. Purpose

Talab an-Noor is now useful for real learning and teaching preparation. After generating output, the user needs to take the result into their workflow.

This patch adds result actions:

```text
Copy Talab result
Save locally
Clear
```

These actions apply to:

- Generate Reflection
- Generate Ishraq Notes
- Prepare Lesson

---

## 2. Copy Result

`Copy Talab result` copies a structured note containing:

- Talab an-Noor title
- AI action
- selected reference
- Quran/Tafseer surface
- output language
- writing style
- generated note
- sources used
- governance reminder

This is safer than copying only the raw AI response because it preserves source context.

---

## 3. Save Locally

`Save locally` stores the generated result in browser local storage:

```text
noor.talab.results.v1
```

The saved list is capped at 20 recent results to avoid uncontrolled storage growth.

This is a foundation only. A future patch can add a proper saved Talab results page.

---

## 4. Clear

`Clear` removes the current generated result from the screen without affecting saved local results.

---

## 5. Governance Reminder

Every copied result includes:

```text
This is AI-assisted reflection or teaching preparation from supplied NOOR context.
It is not tafseer, not fatwa, and not a substitute for qualified scholarship.
```

---

## 6. QA Checklist

Build:

```powershell
pnpm --filter @noor/web build
```

Browser:

```text
/learn/quran/112
/learn/tafseer?surah=112
```

Check:

- Generate Reflection works.
- Generate Ishraq Notes works.
- Prepare Lesson works.
- Copy Talab result copies full structured note.
- Save locally shows success message.
- Clear removes the result.
- Mobile buttons stack cleanly.
