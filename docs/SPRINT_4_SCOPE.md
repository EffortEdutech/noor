# NOOR Sprint 4 — Explore Search

Bismillah.

Sprint 4 upgrades the Explore page from a simple demo text search into a structured local search experience. It is still zero-budget and offline-ready, but the contracts are now closer to what NOOR will need when the full Quran, Tafseer and Hadith data index is connected.

## Goals

1. Improve `/explore` into a usable search surface.
2. Search across Quran, Tafseer and Hadith demo content.
3. Add ranked results instead of simple substring matching.
4. Add content filters.
5. Add quick topic discovery.
6. Store recent searches locally.
7. Keep the same interface ready for future CDN-backed index search.

## User experience

The Explore page now supports:

- Search input
- Search button
- Enter-to-save recent query
- Quran / Tafseer / Hadith filters
- Quick topics
- Recent searches
- Ranked result cards
- Matched field badges
- Tags
- Open result action

## Files changed

```text
apps/web/app/explore/page.tsx
apps/web/components/SearchPanel.tsx
packages/noor-search/src/index.ts
scripts/check-noor-pack.mjs
docs/SPRINT_4_SCOPE.md
docs/LOCAL_TESTING_SPRINT_4.md
```

## Search package contract

```ts
export type NoorSearchType = 'quran' | 'tafseer' | 'hadith';

export type NoorSearchResult = {
  id: string;
  type: NoorSearchType;
  title: string;
  excerpt: string;
  reference: string;
  href?: string;
  sourceLabel?: string;
  tags: string[];
  matchedFields: string[];
  score: number;
};

export function searchNoorLocal(query: string, options?: NoorSearchOptions): NoorSearchResult[];
```

## Future CDN search direction

Sprint 4 keeps search local for zero-budget MVP testing.

Future search path:

```text
NOOR Explore UI
  ↓
@noor/search interface
  ↓
local search / offline index first
  ↓
CDN static index fallback
  ↓
optional server search later
```

Recommended future static search files:

```text
/search/index-quran.en.json
/search/index-quran.ms.json
/search/index-tafseer.ms.json
/search/index-hadith.en.json
/search/topics.json
```

## Done criteria

Sprint 4 is done when:

- `/explore` loads.
- Search returns ranked Quran, Tafseer and Hadith results.
- Filters work.
- Quick topics work.
- Recent searches persist after refresh.
- `pnpm check:pack` passes.
- `pnpm typecheck` passes.
- `pnpm build` passes.
