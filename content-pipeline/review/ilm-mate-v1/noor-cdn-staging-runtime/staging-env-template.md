# NOOR Sprint 27.9 staging env template

Generated file:

```text
.env.local.staging-ilm-mate-v1
```

Staging base:

```text
https://cdn.jsdelivr.net/gh/EffortEdutech/noor-cdn@staging-ilm-mate-v1/noor-cdn
```

To run local app against staging CDN:

```powershell
pnpm cdn:staging-env -- --write-local
pnpm dev
```

Then open http://localhost:3200/settings and choose External CDN if the cookie is not already set to cdn.
