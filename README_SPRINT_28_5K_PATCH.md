# Sprint 28.5K — Production Learning Theme Reset

This patch is a hard reset for the NOOR learning UI.

It replaces the accumulated theme CSS instead of appending more CSS on top of old patches. This is important because earlier sprint CSS caused text contrast conflicts and row collisions.

## Updated files

- `apps/web/app/globals.css`
- `apps/web/app/today/page.tsx`
- `apps/web/app/explore/page.tsx`
- `apps/web/app/explore/[topic]/page.tsx`
- `apps/web/app/learn/page.tsx`
- `apps/web/app/learn/quran/page.tsx`
- `apps/web/app/learn/quran/[surah]/page.tsx`
- `apps/web/components/QuranReadingExperience.tsx`
- `apps/web/components/FloatingQuranNavigator.tsx`
- `packages/noor-ui/src/components/KnowledgeSettingsPanel.tsx`
- `packages/noor-ui/src/index.ts`

## Design rule

NOOR must show structure first and detail second.

Each learning page uses the same production layout:

1. Page purpose
2. Recommended first action
3. Collapsed learning sections
4. Clear paragraph spacing
5. Readable text contrast
6. Consistent surface, button, badge and row styles
