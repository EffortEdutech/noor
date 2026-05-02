# Sprint 27.9.2 — Hadith View Model / by_book + by_chapter Normalization

## Purpose

Hadith content is not shaped like Quran and Tafseer.

The same Hadith may legitimately appear in both:

- `by_book`
- `by_chapter`

Therefore, duplicate canonical Hadith references across views are allowed. What is not allowed is a duplicate NOOR CDN collection id such as `all`, because React rendering and CDN folder paths require unique collection identities.

## Sprint 27.9.2 model

- `collection.id` is generated from the full source path and must be globally unique.
- `collection.sourceView` is either `by_book` or `by_chapter`.
- `item.canonicalHadithId` may repeat across views.
- `item.viewItemId` is unique for the active navigation view.
- UI lets users choose View by book or View by chapter.
- noor-cdn/main remains blocked.
- Production CDN remains blocked.

## Commands

```powershell
pnpm ilm:hadith:view-model
pnpm check:ilm-hadith-view-model
pnpm ilm:staging-cdn-candidate
pnpm check:ilm-staging-cdn-candidate
pnpm cdn:staging-git-safe
pnpm check:cdn-staging-git-safe
pnpm check:cdn-staging-runtime
pnpm typecheck
pnpm build
```

## CDN target

Allowed after checks pass:

- `noor-cdn/staging-ilm-mate-v1`

Blocked:

- `noor-cdn/main`
- Production CDN promotion
