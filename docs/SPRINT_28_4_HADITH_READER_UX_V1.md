# Sprint 28.4 — Hadith Reader UX v1

## Purpose

Sprint 28.4 makes the Hadith area more useful as a real reading experience. The goal is to move from a raw list of narrations into a guided Sunnah reading flow.

Core product direction:

```text
Read → Reflect → Practise
```

The user should be able to browse a collection, read Hadith with clearer context, reflect on what the narration teaches, save it, copy it, copy the reference, and continue exploring related topics.

## Scope

This sprint changes the NOOR web app only. It does not change the `noor-cdn` repository and does not change production content.

Files added or changed:

```text
apps/web/app/learn/hadith/page.tsx
apps/web/app/globals.css
packages/noor-ui/src/components/HadithCard.tsx
packages/noor-ui/src/components/HadithActionButtons.tsx
docs/SPRINT_28_4_HADITH_READER_UX_V1.md
docs/LOCAL_TESTING_SPRINT_28_4.md
scripts/register-sprint28-4-scripts-and-css.mjs
scripts/check-sprint28-4-hadith-reader-ux-v1.mjs
package.json
```

## UX changes

### 1. Hadith reader mode

The Hadith page now supports three reading intentions:

```text
Read
Reflect
Practise
```

The mode is passed through the page query string and reflected in Hadith cards.

### 2. Guided reader flow

The Hadith page now explains the user journey:

```text
Read      → know the source, narrator, book and chapter
Reflect   → notice the value, warning or encouragement
Practise  → choose one Sunnah action to live today
```

### 3. Topic chips

Hadith tags are surfaced as topic chips. Users can filter the current collection by topic and can jump into Explore from a Hadith card.

### 4. Better Hadith cards

Hadith cards now show:

```text
- Hadith reference
- Reader item number
- narrator line
- Arabic text if available
- English and Malay text if available
- mode-specific reflection/practice prompt
- topic chips
- save button
- copy Hadith
- copy reference
- explore topic
- create share card
```

### 5. Client-side action buttons

A new `HadithActionButtons` client component handles clipboard copy and local bookmark actions without turning the whole Hadith card into a client component.

## Acceptance criteria

```text
- /learn/hadith loads successfully
- Read / Reflect / Practise buttons update the URL and page state
- Collection switching still works
- Topic chips filter the visible Hadith cards
- Hadith card save button still works
- Copy Hadith works
- Copy reference works
- Explore topic link exists when a tag is available
- Typecheck passes
- Build passes
- Full local CI mirror passes before push
```

## Next sprint recommendation

Sprint 28.5 should focus on:

```text
Daily Guidance UX v1
```

That sprint should connect Quran, Tafseer and Hadith into a daily guided flow on `/today`.
