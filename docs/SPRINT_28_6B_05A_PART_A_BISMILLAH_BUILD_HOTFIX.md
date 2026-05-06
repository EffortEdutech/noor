# Sprint 28.6B-05A — Part A Bismillah Build Hotfix

Fixes the Part A build failure in `apps/web/lib/quran-bismillah.ts` by using a local Surah metadata adapter instead of requiring optional Bismillah fields to already exist on `SurahIndexEntry`.

Also includes a PowerShell script to replace `align-items: start;` with `align-items: flex-start;` in Tafseer CSS modules.

Run:

```powershell
.\scripts\fix-tafseer-css-autoprefixer-warnings.ps1
pnpm --filter @noor/web build
```
