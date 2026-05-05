# Sprint 28.6A.2 — GUI Theme Unification Patch Pack

Bismillah.

This patch pack applies the active NOOR GUI theme repair for the `noor` app repo.

## Apply

From your local `noor` repo root:

```powershell
cd "C:\Users\user\Documents\00 Combo3\Noor"

git checkout main
git pull

git checkout -b sprint/28-6a-2-gui-theme-unification
```

Extract this patch pack into the repo root, then run:

```powershell
.\scripts\apply-sprint28-6a2-gui-theme-unification.ps1
node .\scripts\validate-sprint28-6a2-gui-theme-unification.mjs
```

Then test:

```powershell
pnpm --filter @noor/web lint
pnpm --filter @noor/web build
```

If your workspace package name is different, use the existing build command you normally use for the NOOR web app.

## Commit

```powershell
git status
git add README_SPRINT_28_6A_2.md docs patches scripts apps/web/app/globals.css
git commit -m "Sprint 28.6A.2 unify GUI theme"
git push -u origin sprint/28-6a-2-gui-theme-unification
```

Open PR:

```txt
https://github.com/EffortEdutech/noor/compare/main...sprint/28-6a-2-gui-theme-unification?expand=1
```

## Notes

This is a CSS/theme foundation sprint only. It intentionally does not add Quran Juz/Page navigation yet. That belongs to Sprint 28.6A.3.
