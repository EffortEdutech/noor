# Local Testing — Sprint 23

Run from repo root:

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

Confirm:

1. NOOR shows v0.23.0.
2. Sprint 23 release note appears.
3. Hadith Import card appears.
4. Production gate shows blocked/fixture-only wording.
5. Build remains green.
