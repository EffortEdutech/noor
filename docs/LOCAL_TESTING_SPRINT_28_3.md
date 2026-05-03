# Local Testing — Sprint 28.3

## Start clean

```powershell
git status
```

## Check

```powershell
pnpm check:tafseer-understanding-panel
pnpm typecheck
pnpm build
```

## Browser

```powershell
pnpm dev
Start-Process "http://localhost:3200/learn/quran/1"
Start-Process "http://localhost:3200/learn/tafseer"
```

## Generated files to restore after full CI mirror

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
