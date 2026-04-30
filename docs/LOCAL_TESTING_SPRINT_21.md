# Local Testing — Sprint 21

Run from the repo root:

```powershell
pnpm install
pnpm quran:gate
pnpm check:quran-source-gate
pnpm quran:import
pnpm check:quran-import
pnpm roadmap:status
pnpm check:roadmap
pnpm check:pack
pnpm check:content
pnpm check:release
pnpm check:runtime
pnpm typecheck
pnpm build
```

## Expected Quran Gate Output

`pnpm quran:gate` should complete successfully and report:

```text
NOOR Quran production source gate blocked.
Approved for production import: no
```

This is green for Sprint 21. It means NOOR is correctly blocking production Quran import until the real source approval evidence is complete.

## UI Check

Start dev server:

```powershell
pnpm dev
```

Open:

```text
http://localhost:3200/settings
```

Confirm:

- NOOR shows v0.21.0.
- Sprint 21 release note appears.
- Quran Source Gate card appears.
- Gate status shows blocked.
- Approved shows No.
- Quran Import card still appears.
- Build remains green.
