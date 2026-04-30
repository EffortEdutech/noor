# Local Testing — Sprint 25

From repo root:

```powershell
pnpm install
pnpm production:promote
pnpm check:production-promotion
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

- NOOR shows v0.25.0.
- Sprint 25 release note appears.
- Production CDN card appears.
- Production CDN status remains blocked.
- Runtime default remains bundled.
- Build remains green.
