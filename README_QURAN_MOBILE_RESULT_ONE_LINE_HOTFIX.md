# Quran Mobile Result One-Line Hotfix

Bismillah.

This patch keeps each mobile Quran navigator search result on one line.

## Apply

```powershell
cd "C:\Users\user\Documents\00 Combo3\Noor"

.\scripts\apply-sprint28-6a2-quran-mobile-result-one-line-hotfix.ps1
node .\scripts\validate-sprint28-6a2-quran-mobile-result-one-line-hotfix.mjs
pnpm --filter @noor/web build
```

If PowerShell blocks the script:

```powershell
powershell -ExecutionPolicy Bypass -File .\scripts\apply-sprint28-6a2-quran-mobile-result-one-line-hotfix.ps1
```

## Commit

```powershell
git status
git add README_QURAN_MOBILE_RESULT_ONE_LINE_HOTFIX.md docs/SPRINT_28_6A_2_QURAN_MOBILE_RESULT_ONE_LINE_HOTFIX.md patches/sprint28-6a2-quran-mobile-result-one-line-hotfix.css scripts/apply-sprint28-6a2-quran-mobile-result-one-line-hotfix.ps1 scripts/validate-sprint28-6a2-quran-mobile-result-one-line-hotfix.mjs apps/web/app/globals.css
git commit -m "Hotfix Quran mobile navigator result row"
git pull --rebase origin main
git push origin main
```
