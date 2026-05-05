# Quran Mobile Command Sheet Hotfix

Bismillah.

This patch fixes the mobile Quran navigator so only the Surah result list scrolls.

## Apply

```powershell
cd "C:\Users\user\Documents\00 Combo3\Noor"

.\scripts\apply-sprint28-6a2-quran-mobile-command-sheet-hotfix.ps1
node .\scripts\validate-sprint28-6a2-quran-mobile-command-sheet-hotfix.mjs
pnpm --filter @noor/web build
```

If PowerShell blocks the script:

```powershell
powershell -ExecutionPolicy Bypass -File .\scripts\apply-sprint28-6a2-quran-mobile-command-sheet-hotfix.ps1
```

## Commit

```powershell
git status
git add README_QURAN_MOBILE_COMMAND_SHEET_HOTFIX.md docs/SPRINT_28_6A_2_QURAN_MOBILE_COMMAND_SHEET_HOTFIX.md patches/sprint28-6a2-quran-mobile-command-sheet-hotfix.css scripts/apply-sprint28-6a2-quran-mobile-command-sheet-hotfix.ps1 scripts/validate-sprint28-6a2-quran-mobile-command-sheet-hotfix.mjs apps/web/app/globals.css
git commit -m "Hotfix Quran mobile navigator command sheet"
git pull --rebase origin main
git push origin main
```
