# Sprint 28.5J Patch

This patch replaces `apps/web/app/explore/page.tsx` with a readable inline-row layout for expanded Explore sections.

Apply:

```powershell
cd "C:\Users\user\Documents\00 Combo3\Noor"
Expand-Archive -Path "$env:USERPROFILE\Downloads\noor-sprint-28-5j-explore-readable-rows.zip" -DestinationPath . -Force
powershell -ExecutionPolicy Bypass -File .\scripts\apply-sprint28-5j-explore-readable-rows.ps1
pnpm typecheck
pnpm build
```
