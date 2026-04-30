# Local Testing — Sprint 20

Run from repo root:

```powershell
pnpm install
pnpm quran:import
pnpm check:quran-import
pnpm check:pack
pnpm check:content
pnpm check:release
pnpm check:runtime
pnpm check:source-intake
pnpm check:roadmap
pnpm typecheck
pnpm build
```

## Manual UI Check

```powershell
pnpm dev
```

Open:

- `http://localhost:3200/settings`

Confirm:

- NOOR shows `v0.20.0`
- Sprint 20 release note appears
- Roadmap card shows Sprint 20 current and Sprint 21 next
- Quran importer card appears
- Quran importer card shows fixture output and production gate
- Build remains green

## Expected Import Output

After `pnpm quran:import`, confirm these files exist:

- `content-pipeline/imported/quran-v0.20/noor-cdn/manifest/noor-quran-import-report.json`
- `content-pipeline/imported/quran-v0.20/noor-cdn/metadata/surah-index.json`
- `content-pipeline/imported/quran-v0.20/noor-cdn/quran/surahs/001.json`
- `content-pipeline/imported/quran-v0.20/noor-cdn/quran/surahs/112.json`
- `content-pipeline/imported/quran-v0.20/noor-cdn/quran/surahs/113.json`
- `content-pipeline/imported/quran-v0.20/noor-cdn/quran/surahs/114.json`

The import report should say:

- `importedSurahCount: 4`
- `importedAyahCount: 22`
- `productionReady: false`
- `productionGate.status: blocked`
