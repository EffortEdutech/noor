# Sprint 28.5D — Simple Knowledge Accordion UX

## Purpose

The previous UI direction improved page navigation, but the pages still exposed too much knowledge at once. Users had to scroll before understanding what each page contained.

This sprint introduces a simpler learning delivery model:

```text
Page purpose
→ page compass
→ expandable knowledge sections
→ one open section at a time
→ visible collapse/expand control while reading
```

## Product rule

```text
NOOR does not show everything in one page scroll.
NOOR shows section titles and short summaries first.
The user expands only the knowledge they want to read now.
```

## Learning psychology principle

Human learners absorb knowledge better when information is:

1. Chunked into small sections.
2. Presented in a predictable order.
3. Hidden until needed.
4. Summarised before detail.
5. Easy to close after reading.
6. Connected to the next action.

This sprint applies that principle to Today, Explore and Topic pages.

## New component

```text
packages/noor-ui/src/components/KnowledgeAccordion.tsx
```

The component renders expandable knowledge sections with:

- section number
- section kicker
- title
- short summary
- sticky expand/collapse trigger
- one section open at a time by default

## Updated pages

### Today

Sections:

1. Continue one path
2. Read one ayah and one hadith
3. Reflect and review
4. Go deeper only when ready

### Explore

Sections:

1. Choose by need or topic
2. Jump by reference or known source
3. Search by question or meaning

### Topic Page

Sections:

1. Begin with the need and intention
2. Quran foundation
3. Tafseer insight
4. Hadith guidance
5. Reflect and respond
6. Continue gently

## Acceptance checklist

```text
[ ] User can see page structure without scrolling deeply
[ ] User can open one section and focus on it
[ ] User can collapse the current section while reading
[ ] Topic pages do not show Quran, Tafseer, Hadith, Reflection and Related Topics all at once
[ ] Today page no longer feels like a crowded dashboard
[ ] Explore page behaves like a doorway selector, not a content dump
[ ] Bottom navigation remains for main pages only
[ ] In-page accordion handles knowledge inside the page
```

## Out of scope

```text
[ ] No CDN work
[ ] No Git workflow change
[ ] No data importer work
[ ] No new source datasets
[ ] No admin or review changes
```
