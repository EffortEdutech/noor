# Local Testing — Sprint 17

Run from the NOOR repo root.

```powershell
pnpm install
pnpm content:validate
pnpm content:prepare
pnpm cdn:pack
pnpm cdn:verify
pnpm cdn:smoke
pnpm cdn:promote
pnpm source:audit
pnpm check:source-audit
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

- NOOR shows v0.17.0.
- Sprint 17 release note appears.
- Source Governance card appears.
- `content-pipeline/audit/noor-source-audit.json` is generated.
- `content-pipeline/audit/noor-source-audit.md` is generated.
- Build remains green.

## Important

Do not include this command in the normal green test list yet:

```powershell
pnpm source:gate
```

It is expected to fail until the source registry contains production-approved content.
