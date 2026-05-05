# Sprint 28.6A.2 Hotfix — Quran Mobile Command Sheet

## Objective

Fix the mobile Quran navigator so the user does not face double scrolling.

## UX Decision

On mobile, the opened Quran navigator behaves like a command sheet:

- Header and close button remain visible
- Surah/Ayah controls remain visible
- Search input remains visible
- Only the Surah result list scrolls
- Go / Previous / Next actions remain visible at the bottom
- The Quran page behind is covered by the scrim while navigation is open

## Why

Double scroll is confusing in Quran reading mode. The user should have one clear scrollable area: the result list.
