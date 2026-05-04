# Sprint 28.5M Patch

This patch resets the Quran reader UX so `/learn/quran` behaves like a proper navigation page and `/learn/quran/[surah]` behaves like a focused reader with a floating Surah/Ayah navigator.

## Apply

```powershell
cd "C:\Users\user\Documents\00 Combo3\Noor"
Expand-Archive -Path "$env:USERPROFILE\Downloads\noor-sprint-28-5m-quran-navigation-reader.zip" -DestinationPath . -Force
powershell -ExecutionPolicy Bypass -File .\scripts\apply-sprint28-5m-quran-navigation-reader.ps1
pnpm typecheck
pnpm build
```

Restart dev:

```powershell
Get-Process node -ErrorAction SilentlyContinue | Stop-Process -Force
Remove-Item -Recurse -Force .\apps\web\.next -ErrorAction SilentlyContinue
pnpm dev
```
