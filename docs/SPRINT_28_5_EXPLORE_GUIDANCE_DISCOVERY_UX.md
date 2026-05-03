# Sprint 28.5 — Explore Guidance Discovery UX

## Status

Ready for manual patch application on:

```text
sprint/28-5-explore-guidance-discovery-ux
```

## Purpose

Sprint 28.5 turns `/explore` into a real guidance discovery experience, not only a search input.

The page now helps the user begin from a spiritual need, choose a topic prompt, see grouped results, and continue into the correct reading experience.

## Product direction

NOOR’s Explore pillar should support cross-reference discovery across Quran, Tafseer and Hadith. The page should feel user-intent-first:

```text
Need / topic → Quran ayah → Tafseer understanding → Hadith reflection
```

## Implemented UX

### 1. Improved Explore hero

`/explore` now explains the user journey:

```text
Discover guidance by need, topic, and source.
```

It gives direct paths to:

- Quran reader
- Tafseer
- Hadith reader

### 2. Topic prompt cards

The search panel now includes topic prompt cards for:

- Mercy
- Patience
- Rizq
- Intention
- Protection
- Prayer
- Repentance

Each card has:

- Arabic-style visual cue
- user-need prompt
- short explanation
- one-click search activation

### 3. Grouped results

Results are grouped into:

```text
Quran
Tafseer
Hadith
```

Each group has a short helper sentence so the user understands what to do next.

### 4. Deep links

Search results now include context-aware actions:

| Result type | Primary action | Supporting action |
|---|---|---|
| Quran | Open Quran reader | Understand with Tafseer / Hadith reminders |
| Tafseer | Open Tafseer understanding | Read Quran context |
| Hadith | Open Hadith reader | Explore Quran and Tafseer |

### 5. Better empty state

The empty state now guides the user toward broader searches and topic prompts instead of only saying no results were found.

### 6. User-facing language cleanup

Technical wording is kept out of the user interface. The user sees guidance language, not implementation language.

## Files changed

```text
apps/web/app/explore/page.tsx
apps/web/components/SearchPanel.tsx
packages/noor-search/src/index.ts
apps/web/app/globals.css
docs/SPRINT_28_5_EXPLORE_GUIDANCE_DISCOVERY_UX.md
docs/LOCAL_TESTING_SPRINT_28_5.md
scripts/register-sprint28-5-scripts-and-css.mjs
scripts/check-sprint28-5-explore-guidance-discovery-ux.mjs
package.json
```

## Package scripts added

```json
{
  "check:explore-guidance-discovery-ux": "node scripts/check-sprint28-5-explore-guidance-discovery-ux.mjs",
  "check:sprint28-5": "pnpm check:sprint28-4 && pnpm check:explore-guidance-discovery-ux && pnpm typecheck && pnpm build"
}
```

## Acceptance criteria

- `/explore` has improved hero copy and user journey.
- Topic prompt cards exist for mercy, patience, rizq, intention, protection, prayer and repentance.
- Results are grouped by Quran, Tafseer and Hadith.
- Result actions deep-link into Quran reader, Tafseer and Hadith reader.
- Empty state suggests broader searches and topic prompts.
- User-facing UI avoids technical content-source wording.
- Sprint checker passes.
- Typecheck passes.
- Build passes.
- Full local CI mirror passes before push.
