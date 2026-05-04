# Sprint 28.5N Patch

This patch rebuilds `/learn/quran` and `/learn/quran/[surah]` around a clean Quran reader navigation model.

## Apply

```powershell
cd "C:\Users\user\Documents\00 Combo3\Noor"
Expand-Archive -Path "$env:USERPROFILE\Downloads\noor-sprint-28-5n-quran-clean-reader-navigation.zip" -DestinationPath . -Force
powershell -ExecutionPolicy Bypass -File .\scripts\apply-sprint28-5n-quran-clean-reader-navigation.ps1
```

## Test

```powershell
pnpm typecheck
pnpm build
Get-Process node -ErrorAction SilentlyContinue | Stop-Process -Force
Remove-Item -Recurse -Force .\apps\web\.next -ErrorAction SilentlyContinue
pnpm dev
```

Open:

- http://localhost:3200/learn/quran
- http://localhost:3200/learn/quran/1
- http://localhost:3200/learn/quran/55#ayah-71
