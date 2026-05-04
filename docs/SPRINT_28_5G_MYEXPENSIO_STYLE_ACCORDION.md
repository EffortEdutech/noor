# Sprint 28.5G — Myexpensio-Style Accordion Reset

## Purpose

Reset the NOOR knowledge page accordion to follow the proven Myexpensio settings page pattern:

- clean white sections
- short title and description
- preview pills
- simple chevron
- no numbering
- no heavy dark theme
- no default expanded knowledge dump

## Updated pages

- `/today`
- `/explore`
- `/explore/[topic]`

## Updated component

- `packages/noor-ui/src/components/KnowledgeSettingsPanel.tsx`

The component uses inline styles so it does not depend on fragile global class styling for the main accordion layout.

## Acceptance checklist

- [ ] First screen shows clear collapsed sections
- [ ] User can understand the page without scrolling deeply
- [ ] No numbered accordion titles
- [ ] No dark/crowded knowledge dump
- [ ] Preview pills are visible before expanding
- [ ] Details are hidden until the user chooses to open a section
- [ ] `pnpm typecheck` passes
- [ ] `pnpm build` passes
