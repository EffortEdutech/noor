# NOOR Sprint 3 — Today, Reading Progress & Local Bookmarks

Bismillah.

Sprint 3 turns the Sprint 0–2 foundation into a usable daily companion experience.

## Scope

- Today dashboard now includes a Continue Reading card.
- Quran reader now allows each ayah to be marked as the current reading point.
- Reading progress is stored locally on the user's device.
- Bookmarks are readable, removable, and visible in Library.
- Library now shows both reading progress and saved bookmarks.
- Bookmark updates dispatch a browser event so Today and Library panels refresh instantly.
- Daily ayah rotation now uses all demo ayahs instead of only Surah Al-Fatihah.

## Local persistence keys

```text
noor.bookmarks.v1
noor.readingProgress.v1
noor.readingHistory.v1
```

## Browser events

```text
noor:bookmarks-updated
noor:reading-progress-updated
```

## New files

```text
apps/web/lib/local-store.ts
apps/web/lib/use-bookmarks.ts
apps/web/lib/use-reading-progress.ts
apps/web/components/AyahStudyCard.tsx
apps/web/components/BookmarkList.tsx
apps/web/components/ContinueReadingCard.tsx
apps/web/components/MarkReadingProgressButton.tsx
apps/web/components/ReadingProgressPanel.tsx
```

## Updated files

```text
apps/web/app/today/page.tsx
apps/web/app/library/page.tsx
apps/web/app/learn/quran/[surah]/page.tsx
apps/web/app/globals.css
apps/web/components/BookmarksPanel.tsx
packages/noor-data/src/resolvers/daily.ts
packages/noor-ui/src/components/BookmarkButton.tsx
```

## Manual QA

1. Run `pnpm dev`.
2. Open `http://localhost:3200/today`.
3. Click `Start with Al-Fatihah`.
4. On any ayah, click `Mark current`.
5. Return to `/today` and confirm Continue Reading shows the marked ayah.
6. Save an ayah or hadith.
7. Open `/library` and confirm the bookmark appears.
8. Remove the bookmark and confirm the list updates.
9. Run `pnpm typecheck` and `pnpm build`.

## Current limitation

This sprint uses browser localStorage for zero-budget local persistence. The storage API is isolated in `apps/web/lib/local-store.ts`, so the next upgrade can replace it with IndexedDB without rewriting the UI components.
