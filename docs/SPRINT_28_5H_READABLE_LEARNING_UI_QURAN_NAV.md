# Sprint 28.5H — Readable Learning UI + Quran Navigation

## Purpose

Reset NOOR visual delivery so it becomes a serious learning interface.

The user should immediately see:

- where they are
- what can be opened
- what is recommended
- how to continue reading
- how to jump to Surah and Ayah

## Design Corrections

### 1. Contrast

All page surfaces now follow a readable light learning palette:

- background: soft slate
- cards: white
- primary text: dark slate
- secondary text: readable slate
- accent: restrained emerald
- identity accent: warm gold

### 2. Knowledge Delivery

NOOR should not show everything on one page.

The pattern is:

```text
Title
Short purpose
Collapsed learning sections
Preview pills
User expands only what they want to read
```

### 3. `/learn`

The `/learn` page is now a learning hub, not a grid.

Sections:

- Quran reading
- Tafseer understanding
- Hadith guidance
- Guided journeys

### 4. `/learn/quran`

The `/learn/quran` page is now a Quran entry screen.

Sections:

- Continue / recommended start
- Reader modes
- Surah list
- Reference jump note

### 5. `/learn/quran/[surah]`

The Surah reader now includes a floating Quran navigator:

- open with a floating button
- select Surah
- select Ayah
- go directly to that reference
- previous / next Surah
- jump within the current Surah

## Acceptance Checklist

```text
[ ] Text is readable on all updated pages
[ ] Page theme is consistent
[ ] /learn is not a content dump
[ ] /learn/quran is not a Surah-box grid first
[ ] Quran reader has floating Surah/Ayah navigation
[ ] User can jump to 32:15 and 55:71
[ ] User can read without UI clutter
[ ] Reader controls do not dominate the Quran text
```
