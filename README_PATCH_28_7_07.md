# NOOR Patch Pack 28.7-07 — Saved Talab Library and Save Toast

Apply after Patch Pack 28.7-06.

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
- Generate Reflection / Ishraq Notes / Prepare Lesson.
- Click Save in browser.
- Toast popup appears.
- Toast has View in Library.
- /library shows Saved Talab notes.
- Copy saved note works.
- Download .txt works.
- Reopen source works.
- Remove works.
- Clear saved Talab notes works.
```

## Commit and push main after green

```powershell
git add apps/web/app/library/page.tsx `
        apps/web/components/AiSourceAssistant.tsx `
        apps/web/components/AiSourceAssistant.module.css `
        apps/web/components/TalabSavedResultsPanel.tsx `
        apps/web/lib/talab-store.ts `
        docs/SPRINT_28_7_07_SAVED_TALAB_LIBRARY_TOAST.md `
        README_PATCH_28_7_07.md

git commit -m "feat: add saved Talab library and save toast"
git push origin main
```

Do not add:

```text
apps/web/.env.local
apps/web/public/noor-cdn/
```
