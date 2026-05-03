# Local Testing — Sprint 28.4 Hadith Reader UX v1

## Branch

```powershell
cd "C:\Users\user\Documents\00 Combo3\Noor"

git checkout main
git pull origin main
git checkout -b sprint/28-4-hadith-reader-ux-v1
```

## Apply patch

```powershell
Expand-Archive -Path "$env:USERPROFILE\Downloads\noor-sprint28-4-hadith-reader-ux-v1-patch-pack.zip" -DestinationPath "$env:USERPROFILE\Downloads" -Force

$Patch = "$env:USERPROFILE\Downloads\noor-sprint28-4-hadith-reader-ux-v1\files"
$Repo = "C:\Users\user\Documents\00 Combo3\Noor"

Copy-Item -Path "$Patch\*" -Destination $Repo -Recurse -Force
cd $Repo

node scripts/register-sprint28-4-scripts-and-css.mjs
```

## Sprint checks

```powershell
pnpm check:hadith-reader-ux-v1
pnpm typecheck
pnpm build
```

Clean build output:

```powershell
git restore apps/web/tsconfig.tsbuildinfo
git status
```

## Browser checks

```powershell
pnpm dev
```

Open:

```powershell
Start-Process "http://localhost:3200/learn/hadith"
Start-Process "http://localhost:3200/learn/hadith?mode=reflect"
Start-Process "http://localhost:3200/learn/hadith?mode=practice"
```

Manual checks:

```text
- Hadith page loads
- Read / Reflect / Practise buttons work
- Collection selection works
- Topic chips appear when tags exist
- Topic chip filtering works
- Hadith cards show reflection/practice prompt
- Save button works
- Copy Hadith works
- Copy reference works
- Explore topic link opens /explore
- Mobile layout remains readable
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
pnpm check:hadith-reader-ux-v1
pnpm typecheck
pnpm build
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

## Commit and push

```powershell
git add apps/web/app/globals.css `
        apps/web/app/learn/hadith/page.tsx `
        packages/noor-ui/src/components/HadithCard.tsx `
        packages/noor-ui/src/components/HadithActionButtons.tsx `
        docs/LOCAL_TESTING_SPRINT_28_4.md `
        docs/SPRINT_28_4_HADITH_READER_UX_V1.md `
        scripts/register-sprint28-4-scripts-and-css.mjs `
        scripts/check-sprint28-4-hadith-reader-ux-v1.mjs `
        package.json

git commit -m "feat: improve hadith reader ux v1"
git push -u origin sprint/28-4-hadith-reader-ux-v1
```

Manual PR URL:

```text
https://github.com/EffortEdutech/noor/pull/new/sprint/28-4-hadith-reader-ux-v1
```
