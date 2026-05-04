# NOOR Sprint 28.5B — Topic Page v1 Patch

This patch upgrades `/explore/[topic]` into a guided Topic Page v1.

It focuses only on GUI and knowledge navigation.

## Files included

```text
apps/web/app/explore/[topic]/page.tsx
packages/noor-ui/src/components/SourceConnectionsPanel.tsx
packages/noor-ui/src/index.ts
patches/sprint28-5b-topic-page-v1.css
scripts/apply-sprint28-5b-topic-page-v1.ps1
docs/SPRINT_28_5B_TOPIC_PAGE_V1.md
docs/LOCAL_TESTING_SPRINT_28_5B_TOPIC_PAGE_V1.md
```

## Install

```powershell
cd "C:\Users\user\Documents\00 Combo3\Noor"
Expand-Archive -Path "$env:USERPROFILE\Downloads\noor-sprint-28-5b-topic-page-v1-patch.zip" -DestinationPath . -Force
powershell -ExecutionPolicy Bypass -File .\scripts\apply-sprint28-5b-topic-page-v1.ps1
pnpm typecheck
pnpm build
pnpm dev
```
