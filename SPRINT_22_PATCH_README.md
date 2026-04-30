# NOOR Sprint 22 Patch Pack

Sprint: 22 — Tafseer importer adapter v1

## Apply

Copy/extract this zip into the NOOR repository root:

```text
C:\Users\user\Documents\00 Combo3\Noor
```

Allow overwrite when Windows asks.

## Test

```powershell
pnpm install
pnpm tafseer:import
pnpm check:tafseer-import
pnpm roadmap:status
pnpm check:pack
pnpm check:content
pnpm check:release
pnpm check:runtime
pnpm check:source-intake
pnpm check:quran-source-gate
pnpm check:quran-import
pnpm check:tafseer-import
pnpm check:roadmap
pnpm typecheck
pnpm build
```

## UI

```powershell
pnpm dev
```

Open `http://localhost:3200/settings` and confirm the Tafseer Import card appears and NOOR shows v0.22.0.
