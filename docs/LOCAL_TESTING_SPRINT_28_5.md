# Local Testing — Sprint 28.5 Explore Guidance Discovery UX

## Branch

You already created the branch. Confirm it before applying the patch:

```powershell
cd "C:\Users\user\Documents\00 Combo3\Noor"

git status
git branch --show-current
```

Expected branch:

```text
sprint/28-5-explore-guidance-discovery-ux
```

If needed:

```powershell
git checkout sprint/28-5-explore-guidance-discovery-ux
```

## Apply patch

```powershell
Expand-Archive -Path "$env:USERPROFILE\Downloads\noor-sprint28-5-explore-guidance-discovery-ux-patch-pack.zip" -DestinationPath "$env:USERPROFILE\Downloads" -Force

$Patch = "$env:USERPROFILE\Downloads\noor-sprint28-5-explore-guidance-discovery-ux\files"
$Repo = "C:\Users\user\Documents\00 Combo3\Noor"

Copy-Item -Path "$Patch\*" -Destination $Repo -Recurse -Force
cd $Repo

node scripts/register-sprint28-5-scripts-and-css.mjs
```

## Direct sprint checks

```powershell
pnpm check:explore-guidance-discovery-ux
pnpm typecheck
pnpm build
```

Clean build output:

```powershell
git restore apps/web/tsconfig.tsbuildinfo
git status
```

## Browser checks

Start the app:

```powershell
pnpm dev
```

Open:

```powershell
Start-Process "http://localhost:3200/explore"
Start-Process "http://localhost:3200/explore?topic=mercy"
Start-Process "http://localhost:3200/learn/quran"
Start-Process "http://localhost:3200/learn/tafseer"
Start-Process "http://localhost:3200/learn/hadith"
```

Manual checks:

```text
- /explore loads without error.
- Hero copy explains guidance discovery, not technical search/index wording.
- Topic prompt cards appear for mercy, patience, rizq, intention, protection, prayer and repentance.
- Clicking a topic prompt changes the search query and active topic state.
- Results are grouped under Quran, Tafseer and Hadith.
- Quran result primary action opens the Quran reader.
- Quran result supporting action opens Tafseer.
- Tafseer result primary action opens the Tafseer understanding page.
- Tafseer result supporting action opens Quran context.
- Hadith result primary action opens the Hadith reader.
- Empty state gives suggested broader searches.
- Mobile layout remains readable.
```

## Full local CI mirror

Run this before push:

```powershell
pnpm content:validate
pnpm content:prepare
pnpm cdn:pack
pnpm cdn:verify
pnpm cdn:smoke
pnpm cdn:promote
pnpm check:cdn-promotion
pnpm source:audit
pnpm check:source-audit
pnpm source:intake
pnpm check:source-intake
pnpm quran:gate
pnpm check:quran-source-gate
pnpm quran:import
pnpm check:quran-import
pnpm tafseer:import
pnpm check:tafseer-import
pnpm hadith:import
pnpm check:hadith-import
pnpm review:console
pnpm check:review-console
pnpm production:promote
pnpm check:production-promotion
pnpm roadmap:status
pnpm check:pack
pnpm check:content
pnpm check:release
pnpm check:runtime
pnpm check:cdn-publish
pnpm check:cdn-smoke
pnpm check:roadmap
pnpm check:explore-guidance-discovery-ux
pnpm check:sprint28-5
```

## Clean generated files after full CI mirror

```powershell
git restore apps/web/tsconfig.tsbuildinfo

git restore apps/web/public/noor-cdn/manifest/file-index.json
git restore apps/web/public/noor-cdn/manifest/noor-content-health.json
git restore apps/web/public/noor-cdn/manifest/search-index-manifest.json

git restore content-pipeline/imported/hadith-v0.23/noor-cdn/manifest/noor-hadith-import-report.json

git restore content-pipeline/imported/quran-v0.20/audit/noor-quran-import-audit.md
git restore content-pipeline/imported/quran-v0.20/noor-cdn/manifest/noor-quran-import-report.json
git restore content-pipeline/imported/quran-v0.20/noor-cdn/metadata/surah-index.json
git restore content-pipeline/imported/quran-v0.20/noor-cdn/quran/surahs/001.json
git restore content-pipeline/imported/quran-v0.20/noor-cdn/quran/surahs/112.json
git restore content-pipeline/imported/quran-v0.20/noor-cdn/quran/surahs/113.json
git restore content-pipeline/imported/quran-v0.20/noor-cdn/quran/surahs/114.json

git restore content-pipeline/imported/tafseer-v0.22/audit/noor-tafseer-import-audit.md
git restore content-pipeline/imported/tafseer-v0.22/noor-cdn/manifest/noor-tafseer-import-report.json
git restore content-pipeline/imported/tafseer-v0.22/noor-cdn/metadata/tafseer-books.json
git restore content-pipeline/imported/tafseer-v0.22/noor-cdn/tafseer/demo-tafseer-import/surahs/001.json

git restore content-pipeline/production-cdn/noor-production-cdn-promotion.json
git restore content-pipeline/production-cdn/environment-finalization/.env.local.production-noor-cdn-main.example
git restore content-pipeline/production-cdn/environment-finalization/.env.production.noor-cdn-main.example
git restore content-pipeline/production-cdn/environment-finalization/noor-production-env-finalization.json
git restore content-pipeline/production-cdn/environment-finalization/noor-production-env-finalization.md
git restore content-pipeline/production-cdn/environment-finalization/vercel-production-env.md

git restore content-pipeline/review/audit/noor-scholarly-review-audit.json
git restore content-pipeline/review/audit/noor-scholarly-review-audit.md
git restore content-pipeline/source-gates/quran/audit/noor-quran-source-gate-audit.json
git restore content-pipeline/source-gates/quran/audit/noor-quran-source-gate-audit.md

git status
```

## Final status check before commit

```powershell
git status
git diff -- apps/web/app/explore/page.tsx
git diff -- apps/web/components/SearchPanel.tsx
git diff -- packages/noor-search/src/index.ts
git diff -- apps/web/app/globals.css
git diff -- package.json
```

## Commit and push

```powershell
git add apps/web/app/explore/page.tsx `
        apps/web/components/SearchPanel.tsx `
        packages/noor-search/src/index.ts `
        apps/web/app/globals.css `
        docs/LOCAL_TESTING_SPRINT_28_5.md `
        docs/SPRINT_28_5_EXPLORE_GUIDANCE_DISCOVERY_UX.md `
        scripts/register-sprint28-5-scripts-and-css.mjs `
        scripts/check-sprint28-5-explore-guidance-discovery-ux.mjs `
        package.json

git commit -m "feat: improve explore guidance discovery ux"
git push -u origin sprint/28-5-explore-guidance-discovery-ux
```

## Manual PR

Open:

```text
https://github.com/EffortEdutech/noor/pull/new/sprint/28-5-explore-guidance-discovery-ux
```

PR title:

```text
Sprint 28.5 — Explore Guidance Discovery UX
```

PR body:

```markdown
## Summary

Sprint 28.5 upgrades `/explore` from a search-only page into a guidance discovery experience.

## Changes

- Improve Explore hero copy and journey framing
- Add topic prompt cards for mercy, patience, rizq, intention, protection, prayer and repentance
- Group results by Quran, Tafseer and Hadith
- Add context-aware deep links into Quran reader, Tafseer and Hadith reader
- Improve empty state with broader suggested searches
- Keep technical/CDN wording out of user-facing UI
- Add Sprint 28.5 checker, docs, local testing guide and package scripts

## Local checks

- [ ] pnpm check:explore-guidance-discovery-ux
- [ ] pnpm typecheck
- [ ] pnpm build
- [ ] pnpm check:sprint28-5
- [ ] Full local CI mirror completed before push
- [ ] Generated files restored before commit

## Browser checks

- [ ] /explore loads
- [ ] Topic prompt cards work
- [ ] Results group by Quran, Tafseer and Hadith
- [ ] Quran result opens Quran reader
- [ ] Tafseer result opens Tafseer understanding
- [ ] Hadith result opens Hadith reader
- [ ] Empty state suggests useful searches
- [ ] Mobile layout remains readable
```
