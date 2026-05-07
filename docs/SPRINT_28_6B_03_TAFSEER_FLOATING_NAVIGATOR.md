# Sprint 28.6B-03 - Tafseer Floating Navigator and Study Workspace

## 1. Purpose

This task begins the actual Tafseer UI refactoring foundation.

The goal is to stop presenting tafseer as a flat list of cards and start presenting it as a learning workspace:

```text
Quran passage -> Tafseer source -> Coverage range -> Understanding -> Next step
```

## 2. UX problem being solved

The old Tafseer page had useful data, but the user still had to infer:

- which Quran passage is being explained
- whether the explanation is for one ayah or a range of ayat
- which tafseer source and language are active
- how to move between Quran reading and tafseer study
- how to continue to topic or hadith exploration

This patch makes those relationships visible.

## 3. Added page structure

The new `/learn/tafseer` page is organized as:

```text
Tafseer study header
Study hub cards
Current source summary
Current passage summary
Language chips
Source picker
Surah picker
Quran context side panel
Tafseer entry workspace
Floating Tafseer navigator
```

## 4. Added floating navigator

A new `FloatingTafseerNavigator` component provides a round floating button similar to the Quran reader navigator.

It supports:

- source selection
- Surah selection
- Ayah selection
- visible tafseer coverage match
- jump to visible tafseer card
- open Quran context
- mobile command-sheet layout

The floating button uses plain text and CSS styling. It does not use risky Unicode icons.

## 5. Coverage awareness

Every tafseer entry now shows a coverage notice.

Examples:

```text
Ayah 1
Ayah 1-5
Surah-level note
```

This protects the user from assuming that every tafseer item maps exactly one-to-one with one ayah.

## 6. Quran context

Each tafseer card can show the Quran passage context when Quran content is available.

This supports the preferred NOOR learning flow:

```text
Read Quran first.
Then understand through tafseer.
Then continue to topic, hadith, reflection, or Ishraq.
```

## 7. Mobile UX

The floating navigator becomes a bottom command sheet on smaller screens.

The mobile goal is:

- no double-scroll panels inside the main reading flow
- important navigation reachable without returning to the top
- source and passage selection available with one floating button

## 8. Encoding safety

New UI text avoids:

- mojibake-prone symbols
- decorative Unicode arrows
- Unicode chevrons
- random special glyphs

Expandable sections use a CSS triangle through borders.

## 9. Files changed

```text
apps/web/app/learn/tafseer/page.tsx
apps/web/app/learn/tafseer/TafseerPage.module.css
apps/web/components/FloatingTafseerNavigator.tsx
apps/web/components/FloatingTafseerNavigator.module.css
```

## 10. Test command

```powershell
pnpm --filter @noor/web build
```

## 11. Done criteria

This task is done when:

- `/learn/tafseer` builds successfully
- source, language, Surah, and coverage are visible
- tafseer entries show ayah or range coverage clearly
- Quran context can be opened from tafseer cards
- floating Tafseer navigator works on desktop and mobile
- no new mojibake appears
- no risky Unicode icons are introduced in the new Tafseer UI code

