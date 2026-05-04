# Sprint 28.5G Patch

This patch resets the NOOR learning accordion to follow the Myexpensio settings page display style.

Apply:

```powershell
cd "C:\Users\user\Documents\00 Combo3\Noor"
Expand-Archive -Path "$env:USERPROFILE\Downloads\noor-sprint-28-5g-myexpensio-style-accordion.zip" -DestinationPath . -Force
powershell -ExecutionPolicy Bypass -File .\scripts\apply-sprint28-5g-myexpensio-style-accordion.ps1
pnpm typecheck
pnpm build
pnpm dev
```
