# Sprint 28.6B â€” Tafseer UI Refactoring Foundation

**Project:** NOOR  
**Sprint:** 28.6B  
**Focus:** Tafseer UI refactoring, Quran-to-tafseer relationship, and serious learning workflow  
**Status:** Draft control document  
**Local intended path:** `docs/SPRINT_28_6B_TAFSEER_UI_REFACTORING_FOUNDATION.md`

---

## 1. Sprint Purpose

Sprint 28.6B upgrades the Tafseer experience from a simple browse/list page into a serious learning and teaching interface.

The current user need is not only:

```text
Show me a tafseer list.
```

The target user need is:

```text
I am reading Quran.
I want to understand this ayah or passage.
I want to know which tafseer source explains it.
I want to continue, copy, teach, save, or connect it to hadith and topics.
```

This sprint must make the Quran-to-tafseer relationship clear and usable.

---

## 2. Sprint Scope Lock

### 2.1 In Scope

```text
[ ] Tafseer Study Hub structure
[ ] Tafseer workspace layout
[ ] Surah / ayah / ayah range navigation model
[ ] Tafseer source/book selection model
[ ] Language and source awareness
[ ] Coverage display for ayah, ayah range, or surah-level commentary
[ ] Mobile command sheet / bottom sheet pattern
[ ] Copy reference action planning
[ ] Save/bookmark action planning using existing BookmarkButton where possible
[ ] Connections panel refinement for Quran, topic, hadith, and source relationships
[ ] Helpful empty states
[ ] No mojibake UI strings
[ ] No risky Unicode icons for chevrons or controls
[ ] Documentation of Tafseer UI model
```

### 2.2 Out of Scope

```text
[ ] CDN publishing
[ ] Tafseer importer changes
[ ] Production content promotion
[ ] Admin review console changes
[ ] Tafseer content certification
[ ] AI generated tafseer summaries
[ ] Authentication or cloud bookmark sync
[ ] Social sharing backend
[ ] GitHub PR creation or auto-merge
[ ] Infrastructure hardening
```

---

## 3. Product Principle

Tafseer must not be presented as an isolated database.

The product model is:

```text
Quran is the source text.
Tafseer explains the ayah or passage.
Hadith gives prophetic application.
Topics connect the guidance to real needs.
Library and progress preserve the learning journey.
```

Therefore the Tafseer UI should answer:

```text
What ayah or passage is being explained?
Which source explains it?
What language is this source?
How much coverage is available?
Where can I go next?
How can I use this for learning or teaching?
```

---

## 4. Current UI Diagnosis

### 4.1 Current Strengths

```text
[ ] /learn/tafseer already loads tafseer book metadata.
[ ] /learn/tafseer already supports book and surah query params.
[ ] Tafseer entries already have bookId, language, surah, fromAyah, toAyah, title, body, sourceLabel, and tags.
[ ] Quran reader already has Read, Meaning, and Study modes.
[ ] Study mode already displays a TafseerUnderstandingPanel.
[ ] SourceConnectionsPanel already exists and can be reused.
[ ] AppShell already has a topbar slot for Quran reader mode controls before Settings.
```

### 4.2 Current Weaknesses

```text
[ ] Standalone Tafseer page feels like a book/card browser, not a study workspace.
[ ] Source selection appears before a clear ayah/passage workflow.
[ ] Surah navigation uses many number buttons and is weak on mobile.
[ ] Ayah/range navigation is not first-class.
[ ] Range-aware data exists but the UI language can still imply every tafseer is one ayah only.
[ ] Quran reader Study mode is still structurally tied to a hardcoded tafseer source.
[ ] Mobile needs a cleaner command sheet instead of large blocking panels.
[ ] Teaching workflow is only suggested in copy, not built into layout.
[ ] Copy/share reference workflow is not yet visible enough.
[ ] Missing tafseer/language states need to guide users rather than block them.
```

---

## 5. Tafseer Information Architecture

### 5.1 Primary Flow

```text
Choose passage
-> choose source
-> read Quran context
-> read tafseer explanation
-> connect, copy, save, teach, or continue
```

### 5.2 URL Model for Sprint 28.6B

Keep query params for lower routing risk:

```text
/learn/tafseer
/learn/tafseer?surah=1
/learn/tafseer?surah=1&ayah=1
/learn/tafseer?surah=1&from=1&to=7
/learn/tafseer?book=en-al-jalalayn&surah=1&ayah=1
/learn/tafseer?book=en-al-jalalayn&surah=1&from=1&to=7
```

Future clean routes can be considered later:

```text
/learn/tafseer/[book]/[surah]
/learn/tafseer/[book]/[surah]/[ayah]
```

---

## 6. Page Design

### 6.1 Tafseer Study Hub

The default `/learn/tafseer` page should become a guided study hub.

Required sections:

```text
[ ] Header: "Understand the Quran"
[ ] Short explanation of tafseer as source-based understanding
[ ] Quick passage navigator
[ ] Source selector
[ ] Language selector
[ ] Continue understanding card
[ ] Available source overview
[ ] Empty-state guidance for missing languages
```

Suggested layout:

```text
Tafseer
Understand Quran through trusted explanations.

[ Surah selector        ]
[ Ayah / range selector ]
[ Source selector       ]
[ Language selector     ]
[ Open Tafseer          ]

Continue Understanding
- Last viewed passage later

Available Sources
- Arabic
- English
- Urdu
- Other languages later
```

### 6.2 Tafseer Workspace

When a passage is selected, the page should show a workspace.

Required sections:

```text
[ ] Passage header
[ ] Quran context card
[ ] Tafseer source meta bar
[ ] Coverage badge
[ ] Tafseer body
[ ] Ishraqaration prompt
[ ] Action bar
[ ] Connections panel
```

Suggested desktop layout:

```text
Main column:
- Quran passage context
- Tafseer source + coverage
- Tafseer body
- Ishraq notes prompt

Side/lower column:
- Copy reference
- Save
- Open Quran context
- Related hadith
- Explore topic
```

### 6.3 Entry Card Language

Use clear wording:

```text
Understand this ayah
```

Only when:

```text
fromAyah === toAyah
```

Use:

```text
Understand this passage
```

When:

```text
fromAyah !== toAyah
```

Use:

```text
Surah-level commentary
```

Later, when surah-level entries are introduced.

---

## 7. Mobile UX Pattern

### 7.1 Command Sheet

Mobile should use a compact command sheet or bottom sheet for tafseer navigation.

The bottom command should allow:

```text
[ ] Change passage
[ ] Change source
[ ] Copy
[ ] Save
```

The sheet should contain:

```text
[ ] Surah search or select
[ ] Ayah selector
[ ] Range selector
[ ] Source selector
[ ] Language selector
[ ] Open selected tafseer
```

### 7.2 Mobile Rules

```text
[ ] Avoid 114 inline Surah number buttons on mobile.
[ ] Avoid nested double scroll.
[ ] Avoid huge blocking panels.
[ ] Keep important navigation reachable without returning to top.
[ ] Use plain text and CSS/SVG indicators.
[ ] Do not use risky Unicode chevrons or symbols.
```

---

## 8. Component Plan

### 8.1 New Components

```text
apps/web/components/TafseerStudyHub.tsx
apps/web/components/TafseerNavigator.tsx
apps/web/components/TafseerCommandSheet.tsx
apps/web/components/TafseerWorkspace.tsx
apps/web/components/TafseerContextCard.tsx
apps/web/components/TafseerSourceMeta.tsx
apps/web/components/TafseerCoverageBadge.tsx
apps/web/components/TafseerActionBar.tsx
apps/web/components/TafseerEmptyState.tsx
```

### 8.2 Components to Reuse or Refine

```text
apps/web/components/TafseerUnderstandingPanel.tsx
apps/web/components/QuranReadingExperience.tsx
packages/noor-ui/src/components/SourceConnectionsPanel.tsx
packages/noor-ui/src/components/BookmarkButton.tsx
```

---

## 9. Data and Source Awareness

### 9.1 Existing Data Shape

Tafseer entries already support:

```text
id
bookId
language
surah
fromAyah
toAyah
title
body
sourceLabel
tags
```

This is enough for Sprint 28.6B UI refactoring.

### 9.2 Source Display Requirements

Every tafseer reading surface should show:

```text
[ ] Tafseer source/book
[ ] Language
[ ] Coverage: ayah, ayah range, or surah-level later
[ ] Source status if available
[ ] Link back to Quran context
```

### 9.3 Missing Language Handling

When tafseer is not available in a selected language:

```text
Tafseer is not available in this language yet.
You can read an available source or continue with Quran translation.
```

Actions:

```text
[ ] View available sources
[ ] Open Quran context
[ ] Try English source
```

---

## 10. Teaching Workflow

Tafseer should support teachers and halaqah preparation.

Required teaching-friendly actions:

```text
[ ] Copy tafseer reference
[ ] Copy Quran passage reference
[ ] Copy short teaching outline later
[ ] Save for later
[ ] Open related hadith
[ ] Explore topic
```

Teaching prompt:

```text
Ishraqaration:
What is the main point of this explanation?
Which ayah phrase should be highlighted?
What action or reflection should learners take?
```

No AI-generated summary is introduced in this sprint.

---

## 11. Encoding and UI Safety Rules

```text
[ ] Do not add mojibake strings such as Ã‚, Ãƒ, Ã¢, Ã¢Å“, or Ã¢â‚¬.
[ ] Do not use risky Unicode chevrons or decorative glyphs.
[ ] Use plain words such as Open, Close, Change, Copy, Save.
[ ] Use CSS triangles or inline SVG for indicators.
[ ] Keep Arabic source text as provided by data.
[ ] If source data contains mojibake, do not hide it silently. Data cleanup belongs to a separate content quality task.
```

---

## 12. Implementation Breakdown

### Task 28.6B-01 â€” Sprint Documentation

```text
[ ] Add Sprint 28.6B control document.
[ ] Confirm branch setup.
[ ] Confirm build remains green.
```

### Task 28.6B-02 â€” Tafseer Study Hub

```text
[ ] Refactor /learn/tafseer header into a study hub.
[ ] Add quick passage/source/language navigation.
[ ] Keep existing data fetching.
[ ] Avoid changing CDN/data resolver logic.
```

### Task 28.6B-03 â€” Tafseer Workspace

```text
[ ] Add Quran context card.
[ ] Add source meta bar.
[ ] Add coverage badge.
[ ] Improve tafseer body reading layout.
[ ] Add Ishraqaration prompt.
```

### Task 28.6B-04 â€” Mobile Command Sheet Foundation

```text
[ ] Add mobile-friendly command sheet.
[ ] Replace large mobile number-button navigation.
[ ] Ensure no double scroll.
```

### Task 28.6B-05 â€” Quran Reader Bridge

```text
[ ] Improve "Open Tafseer" link from Study mode.
[ ] Prepare for source-aware tafseer selection.
[ ] Do not overhaul Quran reader yet.
```

### Task 28.6B-06 â€” Polish and QA

```text
[ ] Empty states.
[ ] Source/language labels.
[ ] Encoding-safe UI copy.
[ ] Desktop/mobile visual check.
[ ] Build verification.
```

---

## 13. QA Checklist

Run:

```powershell
pnpm --filter @noor/web build
```

Manual checks:

```text
[ ] /learn/tafseer loads.
[ ] /learn/tafseer?surah=1 loads.
[ ] /learn/tafseer?book=en-al-jalalayn&surah=1 loads when CDN/local data is available.
[ ] Mobile layout does not show a huge 114-button wall as primary navigation.
[ ] Tafseer source and language are visible.
[ ] Coverage text is correct for one ayah vs range.
[ ] Quran context link works.
[ ] Connections panel works.
[ ] No new mojibake UI copy.
[ ] No risky Unicode chevrons.
```

---

## 14. Definition of Done

Sprint 28.6B is complete when:

```text
[ ] Tafseer is clearly connected to Quran passage context.
[ ] User can navigate by Surah, ayah/range, source, and language.
[ ] Tafseer entries show source, language, and coverage.
[ ] Mobile uses a command-sheet style pattern.
[ ] Tafseer page supports learning and teaching workflow.
[ ] Quran reader can open the related tafseer experience.
[ ] Empty states are helpful.
[ ] UI text is encoding-safe.
[ ] Build passes.
```

---

## 15. Final Sprint Statement

Sprint 28.6B should make Tafseer feel like guided understanding.

Not:

```text
A list of tafseer cards.
```

But:

```text
A serious workspace where Quran passage, tafseer source, explanation, reflection, teaching, and next-step connections are clear.
```

