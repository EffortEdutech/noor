# Sprint 28.5L Patch

This patch fixes spacing, readable contrast, row layout, and expand/collapse state across the learning UI.

## Apply

```powershell
cd "C:\Users\user\Documents\00 Combo3\Noor"
Expand-Archive -Path "$env:USERPROFILE\Downloads\noor-sprint-28-5l-production-spacing-hardening.zip" -DestinationPath . -Force
powershell -ExecutionPolicy Bypass -File .\scripts\apply-sprint28-5l-production-spacing-hardening.ps1
pnpm typecheck
pnpm build
```

Restart dev after build:

```powershell
Get-Process node -ErrorAction SilentlyContinue | Stop-Process -Force
Remove-Item -Recurse -Force .\apps\web\.next -ErrorAction SilentlyContinue
pnpm dev
```
