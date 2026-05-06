# Sprint 28.6A.2 Hotfix — Quran Mode Topbar Switcher

## Objective

Make Quran reader modes always accessible while the user is reading.

Modes:

- Read
- Meaning
- Study

## Solution

The AppShell topbar now has an empty slot before Settings. The Quran reader portals the mode switcher into that slot while mounted.

## Files

- `packages/noor-ui/src/components/AppShell.tsx`
- `apps/web/components/QuranReadingExperience.tsx`
- `apps/web/app/globals.css`
