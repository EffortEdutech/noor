# NOOR Sprint 28.5C Patch

## Sprint

Sprint 28.5C — In-Page Knowledge Navigation & Dopamine UX

## What this patch does

This patch improves GUI/UX by adding page-level knowledge navigation.

It adds:

```text
packages/noor-ui/src/components/KnowledgePageCompass.tsx
```

And updates:

```text
apps/web/app/today/page.tsx
apps/web/app/explore/page.tsx
apps/web/app/explore/[topic]/page.tsx
packages/noor-ui/src/components/SourceConnectionsPanel.tsx
packages/noor-ui/src/index.ts
```

It also includes CSS and documentation.

## Install

```powershell
cd "C:\Users\user\Documents\00 Combo3\Noor"

Expand-Archive -Path "$env:USERPROFILE\Downloads\noor-sprint-28-5c-in-page-navigation-patch.zip" -DestinationPath . -Force

powershell -ExecutionPolicy Bypass -File .\scripts\apply-sprint28-5c-in-page-navigation.ps1
```

## Test

```powershell
pnpm typecheck
pnpm build
pnpm dev
```

## Open

```text
http://localhost:3200/today
http://localhost:3200/explore
http://localhost:3200/explore/patience
```
