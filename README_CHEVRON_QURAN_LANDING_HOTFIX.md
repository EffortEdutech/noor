# Chevron and Quran Landing Hotfix

Bismillah.

## Apply

```powershell
cd "C:\Users\user\Documents\00 Combo3\Noor"

.\scripts\apply-sprint28-6a2-chevron-quran-landing-hotfix.ps1
node .\scripts\validate-sprint28-6a2-chevron-quran-landing-hotfix.mjs
pnpm --filter @noor/web build
```

If PowerShell blocks the script:

```powershell
powershell -ExecutionPolicy Bypass -File .\scripts\apply-sprint28-6a2-chevron-quran-landing-hotfix.ps1
```

## Commit

```powershell
git status
git add README_CHEVRON_QURAN_LANDING_HOTFIX.md docs/SPRINT_28_6A_2_CHEVRON_QURAN_LANDING_HOTFIX.md patches/sprint28-6a2-chevron-quran-landing-hotfix.css scripts/apply-sprint28-6a2-chevron-quran-landing-hotfix.ps1 scripts/validate-sprint28-6a2-chevron-quran-landing-hotfix.mjs apps/web/app/globals.css apps/web/components/QuranLastVisitLanding.tsx
git commit -m "Hotfix learning chevrons and Quran landing continuation"
git pull --rebase origin main
git push origin main
```
