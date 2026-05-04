# Sprint 28.5I — Contrast Hard Reset + Serious Learning Rows

Purpose: fix readability first.

This patch:

- Replaces `KnowledgeSettingsPanel` with a stricter, readable settings-style panel.
- Rewrites `/explore` copy into a more professional learning-entry structure.
- Appends a final contrast CSS reset with `!important` overrides so it wins over older sprint CSS.
- Fixes topic rows so icon, title, summary and action label no longer collide.

Test:

```powershell
pnpm typecheck
pnpm build
pnpm dev
```

Open:

- http://localhost:3200/explore
- http://localhost:3200/today
- http://localhost:3200/learn
- http://localhost:3200/learn/quran
