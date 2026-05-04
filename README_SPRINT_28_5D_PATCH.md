# Sprint 28.5D Patch — Simple Knowledge Accordion UX

This patch changes the NOOR learning UI from long stacked knowledge pages into simple expandable knowledge sections.

## Goal

A user should immediately know:

1. What is inside the page.
2. Which section to open first.
3. What each section contains from its title and short summary.
4. How to collapse the section without scrolling back to the top.
5. How to continue one topic at a time.

## Changed files

- `apps/web/app/today/page.tsx`
- `apps/web/app/explore/page.tsx`
- `apps/web/app/explore/[topic]/page.tsx`
- `packages/noor-ui/src/components/KnowledgeAccordion.tsx`
- `packages/noor-ui/src/index.ts`
- `patches/sprint28-5d-simple-knowledge-accordion.css`
- `scripts/apply-sprint28-5d-simple-knowledge-accordion.ps1`
- `docs/SPRINT_28_5D_SIMPLE_KNOWLEDGE_ACCORDION_UX.md`
- `docs/LOCAL_TESTING_SPRINT_28_5D_SIMPLE_KNOWLEDGE_ACCORDION_UX.md`

## Install

Stop `pnpm dev` first.

```powershell
cd "C:\Users\user\Documents\00 Combo3\Noor"

Expand-Archive -Path "$env:USERPROFILE\Downloads\noor-sprint-28-5d-simple-knowledge-accordion-patch.zip" -DestinationPath . -Force

powershell -ExecutionPolicy Bypass -File .\scripts\apply-sprint28-5d-simple-knowledge-accordion.ps1
```

## Test

```powershell
pnpm typecheck
pnpm build
pnpm dev
```

Open:

- `http://localhost:3200/today`
- `http://localhost:3200/explore`
- `http://localhost:3200/explore/patience`
- `http://localhost:3200/explore/mercy`
- `http://localhost:3200/explore/rizq`

## UX principle

NOOR should not show knowledge all at once. NOOR should deliver knowledge one section at a time.
