# NOOR Sprint 5 — Guided Journeys

## Goal

Sprint 5 turns NOOR from a reader/search app into a guided learning companion.

The user can now open `/journeys`, choose a structured path, complete small steps, and continue progress later from Today or Library.

## Included

- `/journeys`
- `/journeys/[journey]`
- Demo journey content in `@noor/content`
- Journey resolver in `@noor/data`
- Local journey progress persistence
- Continue Journey card on Today
- Journey progress panel in Library
- Journey search integration in Explore
- Main bottom nav now includes Journeys

## Local-first storage

Journey progress is stored under:

```text
noor.journeyProgress.v1
```

The current storage is browser `localStorage` for the zero-budget starter phase.

## Demo journeys

1. Foundations of NOOR
2. Prayer and Guidance
3. Protection and Remembrance

## Future CDN contract

Later, journeys can be served as static JSON:

```text
/journeys/index.json
/journeys/{slug}.json
```

The app-facing resolver should remain:

```ts
getJourneyIndex()
getJourneyContent(slug)
getFeaturedJourney()
```

## Acceptance checklist

- `/journeys` shows journey cards
- `/journeys/foundations-of-noor` opens detail page
- User can mark steps complete
- Progress survives page refresh
- Today shows Continue Journey
- Library shows journey progress
- Explore can search journeys
- `pnpm check:pack` passes
- `pnpm typecheck` passes
- `pnpm build` passes
