# Local Testing — Sprint 19

Run these from the NOOR repo root.

```powershell
pnpm install
pnpm source:intake
pnpm check:source-intake
pnpm roadmap:status
pnpm check:roadmap
pnpm check:pack
pnpm check:content
pnpm check:release
pnpm check:runtime
pnpm content:validate
pnpm content:prepare
pnpm cdn:pack
pnpm cdn:verify
pnpm check:cdn-smoke
pnpm cdn:promote
pnpm check:cdn-promotion
pnpm source:audit
pnpm check:source-audit
pnpm typecheck
pnpm build
```

Optional manual production gate check:

```powershell
pnpm source:gate
```

Expected result: this should still fail while demo/unapproved sources remain blocked from production.

---

## Browser checks

```powershell
pnpm dev
```

Open:

- `http://localhost:3200/settings`
- `http://localhost:3200/explore`
- `http://localhost:3200/learn/quran/1`

Confirm:

- Settings shows `NOOR v0.19.0`.
- Settings shows the Source Intake card.
- Roadmap Control shows Sprint 19 as current and Sprint 20 as next.
- Existing Quran, Tafseer, Hadith, CDN and source governance cards still render.

---

## Commit suggestion

```powershell
git status
git add .
git commit -m "feat: add sprint 19 source intake templates"
git push origin main
```

