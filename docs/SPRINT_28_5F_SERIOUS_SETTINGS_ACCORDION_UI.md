# Sprint 28.5F — Serious Settings-Style Accordion UI

## Purpose

Reset NOOR's expandable learning page presentation into a serious, clean, settings-style interface.

## Problem Fixed

The previous accordion looked amateur because it exposed numbered headings awkwardly and still felt like a crowded knowledge dump.

## UX Rule

NOOR should show the learning structure first, then let the user open one section at a time.

## Visual Direction

- light professional background
- white rounded cards
- strong title hierarchy
- muted summary text
- restrained chips
- no oversized decorative blocks
- no numbered heading clutter
- sticky section headers while reading

## Acceptance Checklist

- [ ] `/today` looks clean and serious on first view
- [ ] `/explore` looks like a decision screen, not a wall of cards
- [ ] `/explore/patience` shows clear learning sections
- [ ] collapsed rows show title, summary and useful chips
- [ ] expanded content does not force the user to scroll back to close
- [ ] `pnpm typecheck` passes
- [ ] `pnpm build` passes
