# Sprint 28.2 — Quran Reader UX v2

## Status

Ready for implementation after Sprint 28.1 real reading UX foundation is applied and green.

## Purpose

Sprint 28.1 changed the direction of NOOR from technical content pages into a real reading experience. Sprint 28.2 now improves the Quran reader itself.

The goal is not to add more backend infrastructure. The goal is to make the Quran page easier for a normal user to read, study, memorise, save, copy, and continue.

## Product goal

A user opening a Surah should immediately be able to:

1. choose the intention: Read, Study, or Memorise;
2. jump directly to any ayah;
3. move to previous or next Surah;
4. copy an ayah or only its reference;
5. read tafseer where available;
6. save the current reading point;
7. return later without losing the preferred reader mode.

## Scope

### Included

- Persistent reader mode using localStorage.
- Sticky reader toolbar with Read / Study / Memorise.
- Jump-to-ayah input.
- Surah ayah map shortcuts.
- Previous Surah and Next Surah actions.
- Copy ayah action.
- Copy reference action.
- Study-mode reflection prompt under tafseer.
- Improved reader copy and mobile toolbar behaviour.
- Automated Sprint 28.2 check script.

### Not included

- Audio recitation.
- Word-by-word Quran.
- Memorisation testing/quiz engine.
- User account sync.
- Cross-device reading progress.
- Tafseer source expansion.

These should be handled in later sprints after the reader UX is stable.

## Files changed

```text
apps/web/app/learn/quran/[surah]/page.tsx
apps/web/app/globals.css
apps/web/components/QuranReadingExperience.tsx
apps/web/components/AyahStudyCard.tsx
docs/SPRINT_28_2_QURAN_READER_UX_V2.md
docs/LOCAL_TESTING_SPRINT_28_2.md
scripts/apply-sprint28-2-package-scripts.mjs
scripts/check-sprint28-2-quran-reader-ux-v2.mjs
package.json
```

`package.json` is updated by running:

```powershell
node scripts/apply-sprint28-2-package-scripts.mjs
```

## User-facing changes

### Quran reader toolbar

The reader toolbar now has three permanent intentions:

- Read
- Study
- Memorise

The selected mode is saved locally so the user does not need to choose again on every visit.

### Jump to ayah

The reader toolbar now includes an ayah number input and Jump button. The user can jump to a specific ayah inside the current Surah.

### Surah map

The side panel now includes ayah shortcut buttons. This helps short Surahs and long Surahs feel navigable without forcing the user to scroll blindly.

### Ayah actions

Each ayah now has:

- Save bookmark;
- Mark current;
- Copy ayah;
- Copy reference;
- Create share card.

### Study reflection

When tafseer is shown in Study mode, NOOR also asks a short reflection prompt:

```text
What is one action, du‘a, or correction this ayah invites from me today?
```

This supports the original purpose of NOOR: not merely storing Islamic content, but helping the user benefit from it.

## Acceptance checklist

- [ ] `/learn/quran/1` opens without error.
- [ ] Read / Study / Memorise mode buttons work.
- [ ] Selected mode remains after refreshing the page.
- [ ] Jump-to-ayah works.
- [ ] Surah map ayah buttons work.
- [ ] Previous/Next Surah buttons work where applicable.
- [ ] Copy ayah works in browser.
- [ ] Copy reference works in browser.
- [ ] Study mode shows tafseer where available.
- [ ] Memorise mode hides translation and tafseer.
- [ ] Mobile layout remains usable.
- [ ] `pnpm check:quran-reader-ux-v2` passes.
- [ ] `pnpm typecheck` passes.
- [ ] `pnpm build` passes.

## Test commands

```powershell
node scripts/apply-sprint28-2-package-scripts.mjs
pnpm check:quran-reader-ux-v2
pnpm typecheck
pnpm build
pnpm check:sprint28-2
```

## Next sprint recommendation

Sprint 28.3 should focus on Tafseer as an understanding layer inside Quran reading:

```text
Sprint 28.3 — Tafseer Understanding Panel
```

Target: make Tafseer feel like the explanation of the ayah being read, not a separate database page.
