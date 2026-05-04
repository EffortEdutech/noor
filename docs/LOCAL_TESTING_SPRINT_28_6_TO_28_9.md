# Local Testing — Sprint 28.6-28.9 Guidance GUI Delivery

## Scope

This is a combined GUI delivery sprint. Do not run content/CDN promotion gates unless files under content pipeline or CDN publishing are intentionally changed.

## Direct checks

```powershell
cd "C:\Users\user\Documents\00 Combo3\Noor"

pnpm check:guidance-gui-delivery
pnpm typecheck
pnpm build
```

## Browser testing

```powershell
pnpm dev
```

Open these pages:

```text
http://localhost:3200/explore
http://localhost:3200/explore/mercy
http://localhost:3200/explore/patience
http://localhost:3200/explore/rizq
http://localhost:3200/explore/intention
http://localhost:3200/explore/protection
http://localhost:3200/explore/prayer
http://localhost:3200/explore/repentance
http://localhost:3200/today
http://localhost:3200/library
```

## Manual browser checklist

- `/explore` has guided topic journey cards.
- Each topic card opens its topic detail page.
- Each topic page shows a four-step path.
- Quran, Tafseer and Hadith links open existing readers.
- Journey checklist can be toggled.
- Reflection note can be saved.
- Saved reflection appears in `/library`.
- `/today` shows Continue My Journey.
- `/today` shows Daily Guided Session.
- No CDN/technical wording appears in the user UI.

## No generated-file restore required by default

This sprint does not run generated content commands. If generated files appear anyway, inspect first:

```powershell
git status
```

Only restore generated files if they are unrelated to this GUI sprint.

## Commit and push

```powershell
git add apps/web/app/explore/page.tsx `
        "apps/web/app/explore/[topic]/page.tsx" `
        apps/web/app/today/page.tsx `
        apps/web/app/library/page.tsx `
        apps/web/components/GuidanceTopicJourneyClient.tsx `
        apps/web/components/ReflectionNotesPanel.tsx `
        apps/web/components/ContinueGuidancePathCard.tsx `
        apps/web/components/DailyGuidedSessionCard.tsx `
        apps/web/components/NoorHomeDashboard.tsx `
        apps/web/lib/guidance-topics.ts `
        apps/web/lib/local-store.ts `
        apps/web/app/globals.css `
        package.json `
        scripts/check-sprint28-6-to-28-9-guidance-gui-delivery.mjs `
        scripts/register-sprint28-6-to-28-9-guidance-gui.mjs `
        docs/SPRINT_28_6_TO_28_9_GUIDANCE_GUI_DELIVERY.md `
        docs/LOCAL_TESTING_SPRINT_28_6_TO_28_9.md

git commit -m "feat: deliver guidance gui journey"
git push -u origin sprint/28-6-to-28-9-guidance-gui-delivery
```

## Manual PR title

```text
feat: deliver guidance gui journey
```

## Manual PR body

```markdown
## Summary
- Add guided topic detail pages for mercy, patience, rizq, intention, protection, prayer and repentance
- Add Explore-to-reader journeys connecting Quran, Tafseer, Hadith and response action
- Add local reflection notes and saved guidance path progress
- Add daily guided session card
- Add Today dashboard with Continue My Journey and saved light stats
- Add reflection notes into Library

## Checks
- [ ] pnpm check:guidance-gui-delivery
- [ ] pnpm typecheck
- [ ] pnpm build

## Browser checks
- [ ] /explore
- [ ] /explore/mercy
- [ ] /explore/patience
- [ ] /explore/rizq
- [ ] /explore/intention
- [ ] /explore/protection
- [ ] /explore/prayer
- [ ] /explore/repentance
- [ ] /today
- [ ] /library
```
