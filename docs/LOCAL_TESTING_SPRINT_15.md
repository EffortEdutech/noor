# Local Testing — Sprint 15

Run from repo root:

```powershell
pnpm install
pnpm content:validate
pnpm content:prepare
pnpm cdn:pack
pnpm cdn:verify
pnpm cdn:smoke
pnpm check:cdn-smoke
pnpm check:cdn-publish
pnpm check:runtime
pnpm check:pack
pnpm check:content
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

1. NOOR shows v0.15.0.
2. Sprint 15 release note appears.
3. CDN Smoke Test card appears.
4. `pnpm cdn:smoke` passes locally after `pnpm cdn:pack`.
5. Build remains green.

Optional remote test after publishing `noor-cdn`:

```powershell
pnpm cdn:smoke https://effortedutech.github.io/noor-cdn/noor-cdn
pnpm cdn:smoke https://cdn.jsdelivr.net/gh/EffortEdutech/noor-cdn@main/noor-cdn
```
