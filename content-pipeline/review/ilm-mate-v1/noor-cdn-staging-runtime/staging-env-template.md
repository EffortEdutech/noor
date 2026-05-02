# NOOR Sprint 27.9 staging env template

Generated file:

```text
.env.local.staging-ilm-mate-v1
```

Staging base:

```text
https://raw.githubusercontent.com/EffortEdutech/noor-cdn/staging-ilm-mate-v1/noor-cdn
```

To run local app against staging CDN:

```powershell
pnpm cdn:staging-env -- --write-local
Remove-Item -Recurse -Force ".next" -ErrorAction SilentlyContinue
pnpm dev -- --port 3200
```

Then open http://localhost:3200/settings and choose External CDN if the cookie is not already set to cdn.

For staging tests, raw.githubusercontent.com is preferred because jsDelivr can cache a branch snapshot while the staging branch is changing.
