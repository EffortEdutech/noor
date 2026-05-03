# Local Testing — Sprint 28.6 Guidance Topic Detail / Explore-to-Reader Journey

## 1. Confirm baseline before applying patch

```powershell
cd "C:\Users\user\Documents\00 Combo3\Noor"

git checkout main
git pull origin main
git status
git log --oneline -5
```

Expected baseline:

```text
main is current at Sprint 28.5 merge
working tree clean
```

## 2. Create Sprint 28.6 branch

```powershell
git checkout -b sprint/28-6-guidance-topic-detail-journey
```

## 3. Apply patch pack

```powershell
Expand-Archive -Path "$env:USERPROFILE\Downloads\noor-sprint28-6-guidance-topic-detail-journey-patch-pack.zip" -DestinationPath "$env:USERPROFILE\Downloads" -Force

$Patch = "$env:USERPROFILE\Downloads\noor-sprint28-6-guidance-topic-detail-journey-patch-pack\files"
$Repo = "C:\Users\user\Documents\00 Combo3\Noor"

Copy-Item -Path "$Patch\*" -Destination $Repo -Recurse -Force
cd $Repo

node scripts/register-sprint28-6-topic-journey.mjs
```

## 4. Direct Sprint 28.6 checks

```powershell
pnpm check:guidance-topic-detail-journey
pnpm typecheck
pnpm build
pnpm check:sprint28-6
```

## 5. Browser test steps

Start the dev server:

```powershell
pnpm dev
```

Open:

```text
http://localhost:3200/explore
```

Confirm:

```text
- Explore hero copy is still user-facing and non-technical.
- Guided topic paths section appears.
- Topic cards open detail pages.
- Existing Explore search still works.
- Results still group by Quran, Tafseer and Hadith.
```

Open and test each topic:

```text
http://localhost:3200/explore/mercy
http://localhost:3200/explore/patience
http://localhost:3200/explore/rizq
http://localhost:3200/explore/intention
http://localhost:3200/explore/protection
http://localhost:3200/explore/prayer
http://localhost:3200/explore/repentance
```

For each topic, confirm:

```text
- topic hero loads
- Read → Understand → Reflect → Respond badge appears
- Search this topic returns to /explore?topic=<topic>
- Quran reader action opens
- Tafseer understanding action opens
- Hadith reader action opens
- Back to Explore works
- mobile layout is readable
```

Stop the dev server with:

```powershell
Ctrl+C
```

## 6. Full local CI mirror before push

Run this before committing or pushing:

```powershell
pnpm check:pack
pnpm check:content
pnpm check:runtime
pnpm check:cdn-publish
pnpm content:validate
pnpm content:prepare
pnpm search:build-cdn-index
pnpm cdn:pack
pnpm cdn:verify
pnpm check:cdn-smoke
pnpm check:cdn-promotion
pnpm check:source-audit
pnpm check:source-intake
pnpm check:quran-import
pnpm check:quran-source-gate
pnpm check:tafseer-import
pnpm check:hadith-import
pnpm check:review-console
pnpm check:production-promotion
pnpm roadmap:status
pnpm check:release
pnpm check:roadmap
pnpm check:sprint28-6
```

Production-content related scripts may print that production status is blocked or gated. That is acceptable when the command exits successfully.

## 7. Generated-file restore block

After the full local CI mirror, restore generated files before committing:

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
```

If a file did not change, Git may print nothing. That is normal.

## 8. Final status check

```powershell
git status
git diff --name-only
git diff --cached --name-only
```

Expected changed files:

```text
apps/web/app/explore/page.tsx
apps/web/app/explore/[topic]/page.tsx
apps/web/app/globals.css
packages/noor-search/src/index.ts
package.json
scripts/check-sprint28-6-guidance-topic-detail-journey.mjs
scripts/register-sprint28-6-topic-journey.mjs
docs/SPRINT_28_6_GUIDANCE_TOPIC_DETAIL_JOURNEY.md
docs/LOCAL_TESTING_SPRINT_28_6.md
```

## 9. Commit and push

```powershell
git add apps/web/app/explore/page.tsx `
        "apps/web/app/explore/[topic]/page.tsx" `
        apps/web/app/globals.css `
        packages/noor-search/src/index.ts `
        package.json `
        scripts/check-sprint28-6-guidance-topic-detail-journey.mjs `
        scripts/register-sprint28-6-topic-journey.mjs `
        docs/SPRINT_28_6_GUIDANCE_TOPIC_DETAIL_JOURNEY.md `
        docs/LOCAL_TESTING_SPRINT_28_6.md

git commit -m "feat: add guidance topic detail journey"
git push -u origin sprint/28-6-guidance-topic-detail-journey
```

## 10. Manual PR

Open:

```text
https://github.com/EffortEdutech/noor/pull/new/sprint/28-6-guidance-topic-detail-journey
```

PR title:

```text
feat: add guidance topic detail journey
```

PR body:

```markdown
## Summary

Sprint 28.6 adds guided topic detail pages that connect Explore discovery to the Quran reader, Tafseer understanding and Hadith reader.

## Changes

- Adds `/explore/[topic]` topic detail route.
- Adds guided topic cards on `/explore`.
- Adds shared `NOOR_GUIDANCE_TOPIC_JOURNEYS` topic journey model.
- Adds reader path actions for Quran, Tafseer and Hadith.
- Adds Sprint 28.6 checker, docs and local testing guide.
- Keeps technical/runtime wording out of user-facing topic pages.

## Local checks

- [ ] `pnpm check:guidance-topic-detail-journey`
- [ ] `pnpm typecheck`
- [ ] `pnpm build`
- [ ] `pnpm check:sprint28-6`
- [ ] Full local CI mirror completed
- [ ] Generated files restored before commit

## Browser QA

- [ ] `/explore`
- [ ] `/explore/mercy`
- [ ] `/explore/patience`
- [ ] `/explore/rizq`
- [ ] `/explore/intention`
- [ ] `/explore/protection`
- [ ] `/explore/prayer`
- [ ] `/explore/repentance`
```
