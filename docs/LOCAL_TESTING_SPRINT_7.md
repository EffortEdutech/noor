# Local Testing — NOOR Sprint 7

## 1. Apply patch

Copy the inner `noor` folder into your local repo root.

## 2. Run checks

```powershell
cd "C:\Users\user\Documents\00 Combo3\Noor"
pnpm check:pack
pnpm typecheck
pnpm build
```

## 3. Run production local server

```powershell
pnpm start
```

Open:

```text
http://localhost:3200
```

## 4. Test PWA install/status

1. Open `/settings`
2. Confirm version shows `NOOR v0.7.0`
3. Confirm PWA status card appears
4. Open browser DevTools → Application → Service Workers
5. Confirm `/sw.js` is registered after running `pnpm start`
6. Open `/today`
7. Use browser install icon if available

## 5. Test offline fallback

1. Open DevTools → Network
2. Set network to Offline
3. Visit a route not already loaded, for example `/unknown-test-route`
4. Confirm NOOR offline page or cached app shell appears
5. Set network back to Online

## 6. Test update banner manually

1. Keep the app open under `pnpm start`
2. Edit `apps/web/public/sw.js` and change `NOOR_SW_VERSION` locally, for example from `0.7.0` to `0.7.1-test`
3. Stop server and run:

```powershell
pnpm build
pnpm start
```

4. Refresh the open browser tab once
5. Confirm the update banner appears
6. Click **Refresh now**

## 7. Commit

```powershell
git status
git add .
git commit -m "feat: add PWA install offline and update lifecycle"
git push origin main
```
