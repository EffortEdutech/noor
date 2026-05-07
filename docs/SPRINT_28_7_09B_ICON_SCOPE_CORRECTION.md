# Sprint 28.7-09B — Icon Scope Correction and Layout Import Hotfix

**Project:** NOOR  
**Sprint:** 28.7  
**Patch:** 28.7-09B

## Correct Scope

The previous 28.7-09 patch used `09-spread-mark.png` too broadly.

Correct rule:

```text
App icon / HTML icon / AppShell logo:
  /icons/noor-mark.svg

Quran Reader floating navigator:
  /icons/09-spread-mark.png

Tafseer floating navigator:
  /icons/09-spread-mark.png
```

## Layout Import Hardening

The build reported:

```text
Cannot find module '../components/ClientShell'
```

The file exists, so this patch changes the import to:

```text
@/components/ClientShell
```

The app `tsconfig.json` already maps `@/*` to the app root.
