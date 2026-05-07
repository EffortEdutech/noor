# Sprint 28.6B-07 to 28.6B-11 - Tafseer UI Refactoring Integrated Pack

**Project:** NOOR  
**Sprint range:** 28.6B-07 to 28.6B-11  
**Focus:** Tafseer reading surface, floating navigator, teaching actions, source awareness, RTL typography QA  
**Patch type:** Integrated UI patch pack  
**Status:** Ready for local apply and test

---

## 1. Purpose

This integrated patch moves the Tafseer page away from a crowded navigation page and toward a serious learning and teaching interface.

The Tafseer page body is now treated as the knowledge delivery space. Main navigation is handled by the floating Tafseer button.

---

## 2. Scope Covered

### 2.1 28.6B-07 - Tafseer Reading Surface v2

Implemented:

- Compact context header.
- Quran passage preview inside each tafseer entry.
- Clear tafseer body reading surface.
- Source/reference footer.
- Minimal action row.
- Reduced duplicate page-level navigation.

### 2.2 28.6B-08 - Floating Tafseer Navigator v2

Implemented:

- Floating round T button.
- Language selection.
- Source/book selection.
- Surah selection.
- Ayah selection.
- Visible structure map.
- Selected coverage summary.
- Jump to visible entry.
- Open Quran context.
- Mobile bottom command-sheet behaviour.
- Desktop floating panel behaviour.

### 2.3 28.6B-09 - Tafseer Teaching Actions

Implemented:

- Copy reference.
- Copy Quran passage.
- Copy tafseer quote.
- Open Quran context.
- Save locally on this device.
- Collapsible Ishraq section.
- Ishraq fields:
  - Main point.
  - Key ayah phrase.
  - Lesson note.
  - Action/reflection.

No AI summary is added in this patch.

### 2.4 28.6B-10 - Source Awareness and Compare Foundation

Implemented:

- Source display.
- Language display.
- Ayah coverage display.
- Range type display:
  - ayah
  - passage
  - surah
- Compare foundation note using the same Surah and ayah coverage.

This is not a full compare feature yet.

### 2.5 28.6B-11 - RTL and Typography QA

Implemented:

- Quran Arabic preview uses RTL direction and right alignment.
- Arabic and Urdu tafseer bodies use RTL direction and right alignment.
- English, Malay, Indonesian, Chinese, Tamil bodies remain LTR by default.
- Mixed UI labels remain LTR.
- CSS triangle is used for the Ishraq disclosure indicator.
- No risky Unicode chevrons are used.
- Tafseer Quran passage preview strips a wrongly attached Bismillah from ayah text for non-Fatihah ayah 1.

---

## 3. Files Changed

```text
apps/web/app/learn/tafseer/page.tsx
apps/web/app/learn/tafseer/TafseerPage.module.css
apps/web/components/FloatingTafseerNavigator.tsx
apps/web/components/FloatingTafseerNavigator.module.css
apps/web/components/TafseerTeachingActions.tsx
apps/web/components/TafseerTeachingActions.module.css
docs/SPRINT_28_6B_07_TO_11_TAFSEER_UI_REFACTORING_INTEGRATED.md
README_PATCH_28_6B_07_TO_11.md
```

---

## 4. Bismillah Display Rule Reminder

For Quran display:

- Surah Al-Fatihah 1:1 keeps Bismillah as ayah text.
- Other Surahs must not display Bismillah as part of ayah 1.
- If legacy CDN/cache data still attaches Bismillah to ayah 1, UI should strip the leading Bismillah at display time as a safety layer.

This patch applies that safety layer in Tafseer Quran passage previews.

---

## 5. Browser QA Checklist

Test these pages after build:

```text
http://localhost:3200/learn/tafseer
http://localhost:3200/learn/tafseer?surah=112
http://localhost:3200/learn/quran/112
```

Check:

```text
[ ] Build is green.
[ ] Tafseer page is not crowded.
[ ] Floating T button opens and closes.
[ ] Navigator can change language, source, Surah, and ayah.
[ ] Visible structure map jumps to entries.
[ ] Open Quran context works.
[ ] Quran Arabic is RTL and right aligned.
[ ] Arabic/Urdu tafseer body is RTL and right aligned when available.
[ ] English/Malay/Indonesian tafseer body remains LTR.
[ ] No double scroll problem on mobile.
[ ] Ishraq is collapsed by default.
[ ] Copy reference works.
[ ] Copy Quran passage works.
[ ] Copy tafseer quote works.
[ ] Save locally works.
[ ] Source, language, coverage, and range type are visible.
[ ] No mojibake text appears.
[ ] No risky Unicode chevrons appear.
[ ] Surah 112:1 does not show Bismillah attached to the ayah text in Tafseer preview.
```

---

## 6. Definition of Done

This integrated pack is done when:

```text
[ ] git status shows only expected patch files before commit.
[ ] pnpm --filter @noor/web build is green.
[ ] Browser QA is green on desktop.
[ ] Browser QA is green on mobile responsive view.
[ ] Tafseer page body feels like a knowledge reading surface.
[ ] Floating navigator carries the navigation workload.
[ ] Teaching workflow is available but not noisy.
[ ] Source awareness is clear.
[ ] RTL typography rules are respected.
```

