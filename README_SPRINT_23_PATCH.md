# NOOR Sprint 23 Patch Pack

Sprint 23 adds:

- Hadith importer adapter v1
- Hadith fixture schema/sample
- Generated imported hadith CDN route files
- Hadith import check script
- Settings Hadith Import card
- v0.23.0 release metadata
- Roadmap update: Sprint 23 current, Sprint 24 next
- CI update

## Apply

Extract this zip into the NOOR repo root:

`C:\Users\user\Documents\00 Combo3\Noor`

Allow overwrite/replace.

## Test

```powershell
pnpm install
pnpm hadith:import
pnpm check:hadith-import
pnpm roadmap:status
pnpm check:pack
pnpm check:content
pnpm check:release
pnpm check:runtime
pnpm check:roadmap
pnpm typecheck
pnpm build
pnpm dev
```

Open:

```text
http://localhost:3200/settings
```

Confirm YES:

- NOOR shows v0.23.0.
- Sprint 23 release note appears.
- Hadith Import card appears.
- Build remains green.
