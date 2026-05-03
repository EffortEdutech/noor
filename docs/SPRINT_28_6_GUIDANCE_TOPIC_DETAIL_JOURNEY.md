# Sprint 28.6 — Guidance Topic Detail / Explore-to-Reader Journey

## Status

Implemented as a manual patch pack for branch:

```text
sprint/28-6-guidance-topic-detail-journey
```

## Purpose

Sprint 28.5 made `/explore` a real guidance discovery page. Sprint 28.6 extends that discovery flow into guided topic detail pages so a user can move from a need such as mercy, patience, rizq, intention, protection, prayer or repentance into a connected reader journey.

The desired product movement is:

```text
Explore topic → Read Quran → Understand Tafseer → Reflect with Hadith → Respond today
```

## User-facing changes

### 1. Guided topic paths on `/explore`

`/explore` now includes a dedicated “Guided topic paths” section. Each topic card opens a detail page:

```text
/explore/mercy
/explore/patience
/explore/rizq
/explore/intention
/explore/protection
/explore/prayer
/explore/repentance
```

The page keeps technical/runtime wording out of user-facing copy.

### 2. Topic detail pages

A new dynamic route was added:

```text
apps/web/app/explore/[topic]/page.tsx
```

Each topic detail page includes:

- topic hero copy
- a heart-level question
- one practical action for today
- a three-step reader path
- source entry points grouped from existing guidance search results
- deep links into Quran reader, Tafseer understanding and Hadith reader

### 3. Shared guidance topic model

A shared guidance journey model was added to:

```text
packages/noor-search/src/index.ts
```

The shared model exports:

```ts
NOOR_GUIDANCE_TOPIC_JOURNEYS
getNoorGuidanceTopicJourney(topicId)
```

This keeps topic detail pages and `/explore` aligned from one shared source.

## Files changed

```text
apps/web/app/explore/page.tsx
apps/web/app/explore/[topic]/page.tsx
apps/web/app/globals.css
packages/noor-search/src/index.ts
package.json
scripts/check-sprint28-6-guidance-topic-detail-journey.mjs
scripts/register-sprint28-6-topic-journey.mjs
docs/SPRINT_28_6_GUIDANCE_TOPIC_DETAIL_JOURNEY.md
docs/LOCAL_TESTING_SPRINT_28_6.md
```

## New package scripts

```json
{
  "check:guidance-topic-detail-journey": "node scripts/check-sprint28-6-guidance-topic-detail-journey.mjs",
  "check:sprint28-6": "pnpm check:sprint28-5 && pnpm check:guidance-topic-detail-journey && pnpm typecheck && pnpm build"
}
```

## Acceptance criteria

- `/explore` shows guided topic path cards.
- Topic cards open `/explore/[topic]` detail pages.
- Supported topic detail pages generate statically.
- Topic detail pages include Quran, Tafseer and Hadith reader path actions.
- Topic detail pages include a practical “Respond today” action.
- Topic detail pages use user-facing guidance language only.
- Direct Sprint 28.6 check passes.
- Full chained Sprint 28.6 local check passes.
- Typecheck passes.
- Build passes.
- Generated files are restored before commit.

## Browser QA

Run the app locally and test:

```powershell
pnpm dev
```

Open:

```text
http://localhost:3200/explore
http://localhost:3200/explore/mercy
http://localhost:3200/explore/patience
http://localhost:3200/explore/rizq
http://localhost:3200/explore/intention
http://localhost:3200/explore/protection
http://localhost:3200/explore/prayer
http://localhost:3200/explore/repentance
```

Confirm:

- `/explore` still works as a search and discovery page.
- each guided topic path opens correctly.
- the Quran reader action opens `/learn/quran` or a specific ayah anchor.
- the Tafseer action opens `/learn/tafseer` with context when available.
- the Hadith action opens `/learn/hadith` in reflection mode.
- the Back to Explore action works.
- the page remains mobile-friendly.
