# Local Testing — Sprint 24 Scholarly Review Console

From repository root:

```powershell
pnpm install
pnpm review:console
pnpm check:review-console
pnpm roadmap:status
pnpm check:roadmap
pnpm check:pack
pnpm check:release
pnpm typecheck
pnpm build
pnpm dev
```

Open:

```text
http://localhost:3200/settings
```

Confirm:

- NOOR shows v0.24.0.
- Sprint 24 release note appears.
- Scholarly Review Console card appears.
- Review status is blocked.
- Quran, tafseer and hadith review cases are visible in the registry/audit files.
- Build remains green.
