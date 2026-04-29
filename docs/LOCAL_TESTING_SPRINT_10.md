# NOOR Sprint 10 Local Testing

Run:

```powershell
pnpm check:pack
pnpm check:content
pnpm typecheck
pnpm build
pnpm dev
```

Open:

```text
http://localhost:3200/settings
```

Test:

1. Save at least one Quran bookmark from `/learn/quran/1`.
2. Mark one ayah as current reading progress.
3. Complete one journey step from `/journeys/foundations-of-noor`.
4. Change reader preferences from `/settings` or `/learn/quran/1`.
5. Return to `/settings`.
6. Confirm the Backup & Restore card shows non-zero stats.
7. Click **Download backup**.
8. Click **Copy JSON**.
9. Click **Clear local data**.
10. Confirm the app refreshes and local stats reset.
11. Click **Import backup** and choose the downloaded JSON file.
12. Confirm the app refreshes and the local stats return.
13. Open `/library`, `/today`, `/learn/quran/1`, and `/journeys/foundations-of-noor` to verify restored data.
```
