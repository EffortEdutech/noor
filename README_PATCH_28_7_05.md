# NOOR Patch Pack 28.7-05 — Talab an-Noor Result Actions

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
```

Check:

```text
- Generate Reflection works.
- Generate Ishraq Notes works.
- Prepare Lesson works.
- Copy Talab result copies a complete note with sources and governance reminder.
- Save locally shows success message.
- Clear removes the current result.
```

## Commit and push current branch/main

```powershell
git add apps/web/components/AiSourceAssistant.tsx `
        apps/web/components/AiSourceAssistant.module.css `
        docs/SPRINT_28_7_05_TALAB_RESULT_ACTIONS.md `
        README_PATCH_28_7_05.md

git commit -m "feat: add Talab an-Noor result actions"
git push
```

## Standard green-to-main flow for future patch branches

Use this when you are on a sprint branch and the branch is green:

```powershell
git status
pnpm --filter @noor/web build

git add <changed-files>
git commit -m "<commit message>"
git push -u origin <branch-name>

git checkout main
git pull origin main
git merge <branch-name>
pnpm --filter @noor/web build
git push origin main
```

If you are already on `main` and green:

```powershell
git status
pnpm --filter @noor/web build

git add <changed-files>
git commit -m "<commit message>"
git push origin main
```

Never add:

```text
apps/web/.env.local
apps/web/public/noor-cdn/
```
