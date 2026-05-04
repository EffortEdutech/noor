# Sprint 28.5E — Clean Learning UI Reset

## Reason

The previous NOOR UI showed too much knowledge at once, used heavy dark colours, and felt crowded instead of serious, calm and learnable.

This sprint resets the visual and learning delivery direction.

## Product Rule

NOOR must not dump knowledge into long pages.

NOOR must show the learning structure first, then allow the user to expand one section at a time.

## UX Model

Each main knowledge page should use a settings-style learning layout:

1. Page title and purpose
2. Learning map
3. Expand/collapse sections
4. Short summary for each section
5. Detail hidden until opened
6. Sticky section header while reading

## Visual Direction

- Light warm background
- White panels
- Charcoal text
- Muted secondary text
- Restrained emerald accent
- Warm gold only for subtle Islamic identity
- No heavy dark gradients
- No equal-weight dashboard card clutter

## Pages Updated

- `/today`
- `/explore`
- `/explore/[topic]`

## New Component

`packages/noor-ui/src/components/KnowledgeSettingsPanel.tsx`

## Acceptance Checklist

- [ ] User can see the page structure without scrolling deeply
- [ ] Page does not feel crowded on first view
- [ ] Details are collapsed until the user chooses to read
- [ ] Section header remains visible when scrolling inside a long section
- [ ] Quran, Tafseer, Hadith and Reflection are separated by learning role
- [ ] Theme looks serious, clean and suitable for learning
- [ ] Bottom navigation remains only for main app areas
- [ ] In-page navigation handles the knowledge inside each page
