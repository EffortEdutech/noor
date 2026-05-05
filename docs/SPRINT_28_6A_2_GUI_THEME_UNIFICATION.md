# Sprint 28.6A.2 — GUI Theme Unification

## Objective

Unify the active NOOR app theme before building the next Quran navigation features.

This sprint does not redesign navigation logic yet. It repairs the visual foundation so all existing pages render under one consistent NOOR design language.

## Why this is needed

The active app stylesheet is:

```txt
apps/web/app/globals.css
```

Several active components/pages already use newer GUI class names:

- `noor-learn-hub-hero`
- `noor-learn-path-card`
- `noor-learning-action-row`
- `noor-quran-v2-page`
- `noor-quran-v2-reader`
- `noor-quran-v2-float`
- `noor-quran-v2-panel`

But some of these styles were only present in previous patch CSS files, not in the active global stylesheet. This caused the app to render inconsistently even when JSX was already improved.

## Scope

### Included

- Unified NOOR theme variables
- Shared cards, headers, badges and action row polish
- Learn hub styles
- Today / Explore expandable learning section styles
- Quran v2 landing page styles
- Quran reader v2 styles
- Floating Quran navigator styles
- Mobile responsive fixes
- Idempotent apply script
- Validation script

### Not included

- No Quran Juz/Page navigation logic yet
- No route changes
- No CDN/content pipeline changes
- No Settings page IA split yet
- No direct GitHub changes

## Files added by patch pack

```txt
README_SPRINT_28_6A_2.md
docs/SPRINT_28_6A_2_GUI_THEME_UNIFICATION.md
patches/sprint28-6a2-gui-theme-unification.css
scripts/apply-sprint28-6a2-gui-theme-unification.ps1
scripts/validate-sprint28-6a2-gui-theme-unification.mjs
```

## Validation commands

```powershell
.\scripts\apply-sprint28-6a2-gui-theme-unification.ps1
node .\scripts\validate-sprint28-6a2-gui-theme-unification.mjs
pnpm --filter @noor/web lint
pnpm --filter @noor/web build
```

## Next sprint

After this is merged:

```txt
Sprint 28.6A.3 — Quran Navigation UI Foundation
```

That next sprint should use the metadata imported in Sprint 28.6A.1 to add:

- Surah tab
- Verse tab
- Juz tab
- Page tab
