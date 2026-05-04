# Sprint 28.6-28.9 — Guidance GUI Delivery

Bismillah.

This combined delivery intentionally moves NOOR from search-only discovery toward a user-facing guidance journey.

## Included sprint outcomes

### Sprint 28.6 — Guidance Topic Detail / Explore-to-Reader Journey

Adds detail pages for:

- `/explore/mercy`
- `/explore/patience`
- `/explore/rizq`
- `/explore/intention`
- `/explore/protection`
- `/explore/prayer`
- `/explore/repentance`

Each page presents:

1. The user need
2. A topic intention
3. A four-step journey
4. Connected Quran, Tafseer and Hadith results
5. Deep links to the existing readers

### Sprint 28.7 — Reflection Notes + Save Guidance Path

Adds local-first reflection and progress storage:

- `noor.reflectionNotes.v1`
- `noor.guidancePaths.v1`

Users can save:

- reflection prompt
- personal reflection
- one action for today
- topic path progress

Reflection notes appear in `/library`.

### Sprint 28.8 — Daily Guided Reading Session

Adds a daily guided session card to `/today`.

The card chooses one guidance topic and gives the user a short daily path:

1. Open topic path
2. Read Quran
3. Understand Tafseer
4. Reflect with Hadith
5. Save as current path

### Sprint 28.9 — Home Dashboard / Continue My Journey

Adds a dashboard to `/today` showing:

- latest guidance path
- path completion progress
- reading moments
- guidance paths
- reflection notes
- bookmarks
- latest reflection

## Product decision

This is a GUI/product sprint. It does not modify the CDN repository and does not run production content gates.

The content remains where it is. The focus here is delivering knowledge through the NOOR user interface.

## Technical files

```text
apps/web/app/explore/page.tsx
apps/web/app/explore/[topic]/page.tsx
apps/web/app/today/page.tsx
apps/web/app/library/page.tsx
apps/web/components/GuidanceTopicJourneyClient.tsx
apps/web/components/ReflectionNotesPanel.tsx
apps/web/components/ContinueGuidancePathCard.tsx
apps/web/components/DailyGuidedSessionCard.tsx
apps/web/components/NoorHomeDashboard.tsx
apps/web/lib/guidance-topics.ts
apps/web/lib/local-store.ts
apps/web/app/globals.css
scripts/check-sprint28-6-to-28-9-guidance-gui-delivery.mjs
scripts/register-sprint28-6-to-28-9-guidance-gui.mjs
```

## Acceptance criteria

- `/explore` shows guided topic journeys.
- Each topic journey page opens successfully.
- Topic pages link into Quran, Tafseer and Hadith readers.
- User can save reflection notes locally.
- User can mark journey steps complete.
- `/today` shows Continue My Journey dashboard.
- `/today` shows daily guided session.
- `/library` shows reflection notes.
- Technical/CDN wording remains out of user-facing UI.
