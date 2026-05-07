# NOOR Patch Pack 28.7-08 — Talab Library UX and Quran/Tafseer Source Polish

## Important

This patch also includes the pending Quran Reader cleanup from 28.7-06 because your earlier status showed:

```text
modified: apps/web/components/QuranReadingExperience.tsx
untracked: README_PATCH_28_7_06.md
untracked: docs/SPRINT_28_7_06_TALAB_SOURCE_DRAWERS_DOWNLOAD.md
```

So this patch can be committed together as one integrated stabilization.

## Apply

```powershell
cd "C:\Users\user\Documents\00 Combo3\Noor"

git status
```

Extract this ZIP into the NOOR repo root.

## Build

```powershell
pnpm --filter @noor/web build
```

## Optional mojibake QA

If Windows warns you, choose `R` for Run once.

```powershell
.\scripts\check-noor-ui-mojibake.ps1
```

## Browser QA

```powershell
pnpm --filter @noor/web dev -- --port 3200
```

Open:

```text
http://localhost:3200/learn/quran/112
http://localhost:3200/learn/tafseer?surah=112
http://localhost:3200/library
```

Check:

```text
- Quran Reader Talab no longer shows "Understand this ayah".
- Talab source drawers are collapsed and expandable.
- Tafseer source drawer can show shorter/full source.
- Generate Reflection works.
- Generate Ishraq Notes works.
- Prepare Lesson works.
- Save in browser appears in Library.
- Open Library appears beside result actions.
- Library search works.
- Library type filter works.
- Library Quran/Tafseer filter works.
- No mojibake such as Â or Ã appears in tested UI.
```

## Commit and push main after green

```powershell
git add apps/web/components/AiSourceAssistant.tsx `
        apps/web/components/AiSourceAssistant.module.css `
        apps/web/components/QuranReadingExperience.tsx `
        apps/web/components/TalabSavedResultsPanel.tsx `
        apps/web/components/TalabSavedResultsPanel.module.css `
        scripts/check-noor-ui-mojibake.ps1 `
        docs/SPRINT_28_7_06_TALAB_SOURCE_DRAWERS_DOWNLOAD.md `
        docs/SPRINT_28_7_08_TALAB_LIBRARY_UX_SOURCE_POLISH.md `
        README_PATCH_28_7_06.md `
        README_PATCH_28_7_08.md

git commit -m "feat: polish Talab library and source drawers"
git push origin main
```

Do not add:

```text
apps/web/.env.local
apps/web/public/noor-cdn/
```
