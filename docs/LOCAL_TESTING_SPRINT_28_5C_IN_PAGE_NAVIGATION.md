# Local Testing — Sprint 28.5C In-Page Knowledge Navigation

Run from repo root:

```powershell
pnpm typecheck
pnpm build
pnpm dev
```

Open:

```text
http://localhost:3200/today
http://localhost:3200/explore
http://localhost:3200/explore/patience
http://localhost:3200/explore/mercy
http://localhost:3200/explore/rizq
```

---

## Visual Checklist

### Today

```text
[ ] Page compass appears near the top.
[ ] User can see Continue / Daily / Reflect / Deeper without scrolling far.
[ ] Continue cards are the primary first action.
[ ] Reader links are secondary, not competing with the first action.
```

### Explore

```text
[ ] Explore feels like a decision screen.
[ ] User sees Need / Question / Reference entry modes.
[ ] Topic journeys are clearly under "Need".
[ ] Search is under "Question".
[ ] Universal Knowledge Bar is under "Reference".
```

### Topic Page

```text
[ ] Topic page compass appears near the top.
[ ] User sees Begin / Quran / Tafseer / Hadith / Reflect.
[ ] Source sections are grouped by role.
[ ] Reflection/completion appears after source sections.
[ ] Related topics are at the bottom as optional continuation.
```

---

## UX Acceptance

```text
[ ] User knows what is inside each page without scrolling through all content.
[ ] The page says "start here".
[ ] Secondary knowledge does not compete with primary action.
[ ] The UI feels more guided and less like a content dump.
```
