# NOOR Patch Pack 28.7-06 — Talab Source Drawers and Result Download

This file is included in Patch 28.7-08 because your local status showed the 28.7-06 Quran Reader cleanup docs were still untracked.

## Key Result

Quran Reader Talab should no longer show the old static `Understand this ayah` panel.

## Main QA

```powershell
pnpm --filter @noor/web build
```

Check:

```text
http://localhost:3200/learn/quran/112
http://localhost:3200/learn/tafseer?surah=112
```
