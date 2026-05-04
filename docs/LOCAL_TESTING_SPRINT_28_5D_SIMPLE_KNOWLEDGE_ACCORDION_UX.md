# Local Testing — Sprint 28.5D Simple Knowledge Accordion UX

## Commands

```powershell
pnpm typecheck
pnpm build
pnpm dev
```

## Pages to open

```text
http://localhost:3200/today
http://localhost:3200/explore
http://localhost:3200/explore/patience
http://localhost:3200/explore/mercy
http://localhost:3200/explore/rizq
```

## Today checklist

```text
[ ] Page shows a compact compass
[ ] Page shows four accordion section headers
[ ] Only one main section is open by default
[ ] Continue section opens first
[ ] User can collapse Continue and open Daily
[ ] Daily ayah/hadith are not visible until Daily is opened
[ ] Deeper readers are hidden until Deeper is opened
```

## Explore checklist

```text
[ ] Page shows three simple sections
[ ] Need/topic section opens first
[ ] Reference jump is hidden until opened
[ ] Search is hidden until opened
[ ] Topic cards are more compact and less crowded
```

## Topic page checklist

```text
[ ] Begin section opens first
[ ] Quran, Tafseer, Hadith, Reflect and Continue are collapsed by default
[ ] Each accordion header shows title and summary
[ ] While scrolling an open section, the header stays visible
[ ] User can collapse the section without returning to the very top
[ ] The page feels like topic-by-topic knowledge delivery
```

## UX fail conditions

```text
[ ] Page still feels like a long knowledge dump
[ ] User must scroll far before knowing what is inside the page
[ ] Quran, Tafseer, Hadith and Reflection all compete visually at once
[ ] Expand/collapse controls disappear while reading a section
```
