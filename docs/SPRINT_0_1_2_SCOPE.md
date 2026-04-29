# NOOR Sprint 0–2 Scope

## Sprint 0 — Repo Foundation + Data Contracts

### Goal
Create the new NOOR repository foundation without migrating the old Ilm-Mate app blindly.

### Included
- pnpm workspace
- `apps/web` Next.js app
- shared packages
- local testing on port `3200`
- initial docs
- environment contracts

### Acceptance checklist
- [ ] `pnpm install` completes
- [ ] `pnpm dev` starts app on `http://localhost:3200`
- [ ] root route redirects to `/today`
- [ ] `pnpm check:pack` passes

---

## Sprint 1 — Design System + App Shell

### Goal
Make NOOR feel distinct from Ilm-Mate immediately.

### Included
- brand tokens
- dark Noor theme
- AppShell
- TopBar
- BottomNav
- NoorCard
- Badge
- BookmarkButton
- AyahCard
- Today cards

### Acceptance checklist
- [ ] mobile bottom navigation works
- [ ] Today, Learn, Explore, Studio, Library routes are accessible
- [ ] layout is responsive
- [ ] UI uses NOOR tokens

---

## Sprint 2 — Quran / Tafseer / Hadith CDN Resolvers

### Goal
Separate content fetching from UI.

### Included
- mock-first data mode
- future CDN-first data mode
- Quran surah index resolver
- Quran surah content resolver
- Tafseer resolver
- Hadith resolver
- Daily content resolver
- Local search over demo Quran/Tafseer/Hadith

### Acceptance checklist
- [ ] Quran surah list loads
- [ ] Surah reader displays Arabic, transliteration, English, Malay
- [ ] Tafseer sample displays
- [ ] Hadith sample displays
- [ ] Explore search returns Quran/Tafseer/Hadith results
- [ ] App still works when CDN is not configured
