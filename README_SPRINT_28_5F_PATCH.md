# Sprint 28.5F — Serious Settings-Style Accordion UI Hotfix

This hotfix replaces the weak accordion implementation with a cleaner settings-style learning panel:

- no visible step-number clutter
- clean white cards
- proper title + short summary structure
- chip summaries below each collapsed header
- single-section focus by default
- sticky section trigger while reading
- exports `KnowledgeSettingsPanel` from `@noor/ui`

## Apply

```powershell
cd "C:\Users\user\Documents\00 Combo3\Noor"
Expand-Archive -Path "$env:USERPROFILE\Downloads\noor-sprint-28-5f-serious-settings-accordion-ui.zip" -DestinationPath . -Force
powershell -ExecutionPolicy Bypass -File .\scripts\apply-sprint28-5f-serious-settings-accordion-ui.ps1
pnpm typecheck
pnpm build
```
