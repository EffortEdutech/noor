# NOOR Sprint 28.5E Patch — Clean Learning UI Reset

This patch resets NOOR from crowded dark dashboard UI into a clean settings-style learning interface.

## Install

Stop `pnpm dev` first.

```powershell
cd "C:\Users\user\Documents\00 Combo3\Noor"

Expand-Archive -Path "$env:USERPROFILE\Downloads\noor-sprint-28-5e-clean-learning-ui-reset-patch.zip" -DestinationPath . -Force

powershell -ExecutionPolicy Bypass -File .\scripts\apply-sprint28-5e-clean-learning-ui.ps1
```

## Test

```powershell
pnpm typecheck
pnpm build
pnpm dev
```

Open:

```text
http://localhost:3200/today
http://localhost:3200/explore
http://localhost:3200/explore/patience
```
