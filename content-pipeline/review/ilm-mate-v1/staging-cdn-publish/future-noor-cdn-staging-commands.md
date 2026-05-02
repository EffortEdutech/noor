# NOOR Sprint 27.4 — Future Staging noor-cdn Commands

These commands are intentionally **not active yet** because canPushNoorCdnStaging is false.

## Current status

- Domains ready for staging: 0/3
- Production approved: false
- Can promote to production: false

## Future workflow after all staging evidence is accepted

From the NOOR app repo:

```powershell
cd "C:\Users\user\Documents\00 Combo3\Noor"

pnpm ilm:staging-cdn-pack
pnpm check:ilm-staging-cdn-pack
```

Then, only after the check says canPushNoorCdnStaging=true, use a **staging branch** in the noor-cdn repo:

```powershell
cd "C:\Users\user\Documents\00 Combo3\noor-cdn"

git checkout -b staging-ilm-mate-v1
# copy approved staging CDN files here only after a future sprint unlocks the pack
git status
git add .
git commit -m "Add ilm-mate v1 staging CDN candidate"
git push -u origin staging-ilm-mate-v1
```

Do not push `noor-cdn/main` until a future production promotion sprint.
