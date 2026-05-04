# NOOR Sprint 28.5A Patch Pack

This patch starts the new NOOR Knowledge Navigation UI/UX.

## Files included

```text
docs/SPRINT_28_5_KNOWLEDGE_NAVIGATION_UX_FOUNDATION.md
docs/LOCAL_TESTING_SPRINT_28_5A_UIUX.md
apps/web/components/UniversalKnowledgeBar.tsx
apps/web/app/today/page.tsx
apps/web/app/explore/page.tsx
apps/web/components/AyahStudyCard.tsx
apps/web/app/learn/tafseer/page.tsx
packages/noor-ui/src/components/SourceConnectionsPanel.tsx
packages/noor-ui/src/components/HadithCard.tsx
packages/noor-ui/src/index.ts
patches/sprint28-5a-uiux.css
scripts/apply-sprint28-5a-uiux.ps1
```

## Install

```powershell
cd "C:\Users\user\Documents\00 Combo3\Noor"
Expand-Archive -Path "$env:USERPROFILE\Downloads\noor-sprint-28-5a-knowledge-navigation-uiux-patch.zip" -DestinationPath . -Force
powershell -ExecutionPolicy Bypass -File .\scripts\apply-sprint28-5a-uiux.ps1
pnpm typecheck
pnpm build
pnpm dev
```

## Open

```text
http://localhost:3200/today
http://localhost:3200/explore
http://localhost:3200/learn/quran/1
http://localhost:3200/learn/tafseer
http://localhost:3200/learn/hadith
```
