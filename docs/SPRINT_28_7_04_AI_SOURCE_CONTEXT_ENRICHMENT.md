# Sprint 28.7-04 — AI Source Context Enrichment and Talab an-Noor UI Cleanup

**Project:** NOOR  
**Sprint:** 28.7  
**Patch:** 28.7-04  
**Scope:** Source context collector, UI wording cleanup, Ishraq copy action, and mojibake-safe separators.

---

## 1. Product Rule

Talab an-Noor must generate only from gathered NOOR sources.

If related ayat or related hadith are not supplied by verified NOOR data, the UI and prompt context must say they are not supplied.

The AI must not invent:

- related Quran ayat
- hadith
- hadith authenticity
- tafseer source references

---

## 2. UI Changes

### Tafseer

Changed:

```text
Open Talab an-Noor
```

to:

```text
Talab an-Noor
```

Removed static prep rows:

```text
Main point
Key ayah phrase
Lesson note
```

Kept:

```text
Generate Reflection
Generate Teaching Notes
Prepare Lesson
Copy Ishraq note
```

The **Copy Ishraq note** button now copies a source-based Ishraq note with:

- reference
- Quran passage
- tafseer quote
- related source status

### Quran Reader

Changed:

```text
Open Talab an-Noor for this ayah
```

to:

```text
Talab an-Noor
```

The topbar mode remains short:

```text
Talab
```

---

## 3. Broken Text Fix

The AI source summary no longer uses risky middle-dot separators.

Changed from a pattern like:

```text
87:1 · Tafseer: ... · 0 related ayat · 0 related hadith
```

to ASCII-safe separators:

```text
87:1 | Tafseer: ... | Related ayat: not supplied | Related hadith: not supplied
```

A small text cleaner also removes common mojibake fragments such as:

```text
Â
Ã
â€“
â€”
â€™
â€œ
â€�
```

---

## 4. Source Context Collector

Added shared file:

```text
apps/web/lib/ai/source-context.ts
```

This provides:

- Quran ayah AI context builder
- Tafseer AI context builder
- Bismillah stripping for source context
- translation gathering
- source summary labels
- verified related ayah placeholder
- verified related hadith placeholder
- Ishraq note text builder
- mojibake-safe UI text cleaner

Current related-source status:

```text
Related ayat: not supplied unless verified by NOOR.
Related hadith: not supplied unless verified by NOOR.
```

This is intentional until the CDN contains verified relationship data.

---

## 5. QA Checklist

Build:

```powershell
pnpm --filter @noor/web build
```

Browser:

```text
/settings
/learn/quran/112
/learn/tafseer?surah=112
/learn/tafseer?surah=87
```

Check:

- No `Open Talab an-Noor` wording remains.
- Quran reader says `Talab an-Noor`.
- Tafseer says `Talab an-Noor`.
- Main point / Key ayah phrase / Lesson note rows are gone from Tafseer.
- Copy Ishraq note works.
- Source summary uses `|`, not mojibake `Â·`.
- Related ayat and related hadith are labelled as not supplied.
- Generate Reflection, Generate Teaching Notes, and Prepare Lesson still work.
