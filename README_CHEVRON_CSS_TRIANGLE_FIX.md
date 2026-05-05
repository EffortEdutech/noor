# Chevron CSS Triangle Fix

Bismillah.

This hotfix fixes the broken expand/collapse arrow text by using CSS-drawn triangles instead of Unicode glyphs.

## Apply

```powershell
cd "C:\Users\user\Documents\00 Combo3\Noor"

.\scripts\apply-sprint28-6a2-chevron-css-triangle-fix.ps1
node .\scripts\validate-sprint28-6a2-chevron-css-triangle-fix.mjs
pnpm --filter @noor/web build
```

If PowerShell blocks the script:

```powershell
powershell -ExecutionPolicy Bypass -File .\scripts\apply-sprint28-6a2-chevron-css-triangle-fix.ps1
```

## Commit

```powershell
git status
git add README_CHEVRON_CSS_TRIANGLE_FIX.md docs/SPRINT_28_6A_2_CHEVRON_CSS_TRIANGLE_FIX.md patches/sprint28-6a2-chevron-css-triangle-fix.css scripts/apply-sprint28-6a2-chevron-css-triangle-fix.ps1 scripts/validate-sprint28-6a2-chevron-css-triangle-fix.mjs apps/web/app/globals.css
git commit -m "Fix learning chevrons with CSS triangles"
git pull --rebase origin main
git push origin main
```
