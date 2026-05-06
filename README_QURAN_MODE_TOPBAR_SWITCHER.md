# Quran Mode Topbar Switcher Hotfix

Bismillah.

## Apply

```powershell
cd "C:\Users\user\Documents\00 Combo3\Noor"

.\scripts\apply-sprint28-6a2-quran-mode-topbar-switcher.ps1
node .\scripts\validate-sprint28-6a2-quran-mode-topbar-switcher.mjs
pnpm --filter @noor/web build
```

If PowerShell blocks it:

```powershell
powershell -ExecutionPolicy Bypass -File .\scripts\apply-sprint28-6a2-quran-mode-topbar-switcher.ps1
```

## Commit

```powershell
git status
git add README_QURAN_MODE_TOPBAR_SWITCHER.md docs/SPRINT_28_6A_2_QURAN_MODE_TOPBAR_SWITCHER.md patches/sprint28-6a2-quran-mode-topbar-switcher.css scripts/apply-sprint28-6a2-quran-mode-topbar-switcher.ps1 scripts/validate-sprint28-6a2-quran-mode-topbar-switcher.mjs apps/web/app/globals.css apps/web/components/QuranReadingExperience.tsx packages/noor-ui/src/components/AppShell.tsx
git commit -m "Add Quran reader mode switcher to topbar"
git pull --rebase origin main
git push origin main
```
