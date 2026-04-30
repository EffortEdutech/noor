# Local Testing — Sprint 16

Run from repo root:

```powershell
pnpm install
pnpm content:validate
pnpm content:prepare
pnpm cdn:pack
pnpm cdn:verify
pnpm cdn:smoke
pnpm cdn:promote
pnpm check:cdn-promotion
pnpm check:cdn-publish
pnpm check:cdn-smoke
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

1. NOOR shows v0.16.0.
2. Sprint 16 release note appears.
3. CDN Promotion card appears.
4. `content-pipeline/promotion/noor-cdn.env.local` is generated after `pnpm cdn:promote`.
5. Build remains green.

## Optional published CDN test

After the separate `noor-cdn` data repository is published:

```powershell
pnpm cdn:smoke https://effortedutech.github.io/noor-cdn/noor-cdn
pnpm cdn:promote https://effortedutech.github.io/noor-cdn/noor-cdn
```

Then copy `content-pipeline/promotion/noor-cdn.env.local` into local `.env.local` or Vercel environment variables.
