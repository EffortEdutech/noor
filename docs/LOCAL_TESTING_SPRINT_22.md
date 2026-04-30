# Local Testing — Sprint 22

Run from the repository root.

## 1. Install

```powershell
pnpm install
```

## 2. Generate tafseer import output

```powershell
pnpm tafseer:import
```

Expected result:

```text
NOOR Tafseer import completed: 1 book, 1 surah, 3 entries.
Production gate: blocked
```

## 3. Validate tafseer importer

```powershell
pnpm check:tafseer-import
```

Expected result:

```text
NOOR Tafseer importer check passed for import adapter v0.22.0 under NOOR v0.22.0.
```

## 4. Regenerate roadmap

```powershell
pnpm roadmap:status
```

## 5. Full local checks

```powershell
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

## 6. UI smoke test

```powershell
pnpm dev
```

Open:

```text
http://localhost:3200/settings
```

Confirm:

- NOOR shows v0.22.0.
- Sprint 22 release note appears.
- Tafseer Import card appears.
- Existing Quran Source Gate and Quran Import cards still appear.
- Build remains green.
