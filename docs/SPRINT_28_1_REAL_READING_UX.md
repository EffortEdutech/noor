# Sprint 28.1 — Real Reading UX Foundation

## Status

Ready for implementation after Sprint 27.16 production CDN default.

## Reason for pivot

NOOR already has the data foundation: Quran, Tafseer, Hadith, search index, CDN mode, source switching, review console and production CDN promotion.

The product problem is now different. The app should no longer feel like a content pipeline or a technical console. It must become useful for a normal Muslim user who wants to read, understand, save and return.

Sprint 28.1 therefore skips the audit-only track and moves directly into the first real reading UX implementation.

## Product target

A user should be able to open NOOR and quickly answer:

- What should I read today?
- Where did I stop?
- What does this ayah mean?
- Can I save this reminder?
- Can I share it beautifully?
- Can I return tomorrow without confusion?

## Scope

This sprint changes the reading-facing experience. It does not change the content CDN or the production CDN repo.

### Changed user experience

1. Bottom navigation becomes:
   - Today
   - Learn
   - Explore
   - Studio
   - Library

2. Today becomes a daily companion page.

3. Learn becomes a guided entry point instead of only a module list.

4. Quran index becomes a reader-first Surah entry page.

5. Quran Surah page gets a new reading experience wrapper:
   - Read mode
   - Study mode
   - Memorise mode
   - sticky reader controls
   - reader preferences side panel
   - progress panel
   - previous / next Surah actions

6. Ayah cards become mode-aware:
   - Read mode shows Arabic and translation calmly.
   - Study mode shows tafseer notes where available.
   - Memorise mode reduces distractions.

7. Tafseer page is reframed as understanding support for Quran reading.

8. Hadith page is reframed as practical Sunnah guidance.

9. Explore page is reframed as topic guidance search.

10. Library copy is simplified for saved reminders and progress.

## Files changed

```text
packages/noor-config/src/index.ts
packages/noor-ui/src/components/HadithCard.tsx
apps/web/app/today/page.tsx
apps/web/app/learn/page.tsx
apps/web/app/learn/quran/page.tsx
apps/web/app/learn/quran/[surah]/page.tsx
apps/web/app/learn/tafseer/page.tsx
apps/web/app/learn/hadith/page.tsx
apps/web/app/explore/page.tsx
apps/web/app/library/page.tsx
apps/web/app/globals.css
apps/web/components/QuranReadingExperience.tsx
apps/web/components/AyahStudyCard.tsx
apps/web/components/ReaderPreferencesPanel.tsx
apps/web/components/SearchPanel.tsx
```

## Acceptance criteria

- User-facing pages should not show sprint labels or CDN/source debugging copy.
- The Quran reader should offer Read, Study and Memorise modes.
- Study mode should show inline tafseer notes where available.
- Memorise mode should hide translation and tafseer to reduce distraction.
- The bottom nav should include Studio instead of Journeys.
- Journeys remains accessible from Learn and Today, but it is no longer one of the five main bottom tabs.
- Typecheck and build must pass.

## Commands

```powershell
node scripts/apply-sprint28-1-package-scripts.mjs
pnpm check:real-reading-ux
pnpm check:sprint28-1
```

## Next sprint direction

Sprint 28.2 should focus on Quran Reader UX v2:

- better ayah jump controls,
- persistent selected reading mode,
- actual Tafseer source selection,
- copy/share for exact ayah,
- better mobile spacing,
- optional reading session summary.
