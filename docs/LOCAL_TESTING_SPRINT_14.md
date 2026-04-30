# Local Testing — Sprint 14

Run from repository root:

```powershell
pnpm install
pnpm content:validate
pnpm content:prepare
pnpm cdn:pack
pnpm cdn:verify
pnpm check:cdn-publish
pnpm check:pack
pnpm check:content
pnpm check:release
pnpm check:runtime
pnpm typecheck
pnpm build
pnpm dev
```

Open:

```text
http://localhost:3200/settings
```

Confirm:

1. NOOR shows `v0.14.0`.
2. Sprint 14 release note appears.
3. CDN publishing card appears.
4. Content Pipeline card still appears.
5. Runtime Content Source card still appears.
6. `content-pipeline/publish/noor-cdn-gh-pages` is generated locally.
7. `publish-manifest.json` exists inside the generated publish folder.
8. Build remains green.

The generated publish folder is ignored by Git in this app repository. Copy it manually to a separate data repository when testing external CDN hosting.
