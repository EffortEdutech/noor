# Sprint 28.5K — Production Learning Theme Reset

## Purpose

Fix the visual and learning-delivery problems caused by accumulated sprint CSS and inconsistent page layouts.

## Problems fixed

- Bright text on bright backgrounds.
- Yellow icons on yellow backgrounds.
- Expanded content running together without paragraph structure.
- Page sections using different visual systems.
- Colliding boxes and inconsistent spacing.
- Explore fixed partially while Today, Learn and Quran still used old styling.

## Pages included

- `/today`
- `/explore`
- `/explore/[topic]`
- `/learn`
- `/learn/quran`
- `/learn/quran/[surah]`

## UX principle

NOOR is a production learning platform. It must not dump knowledge onto the screen.

The user should see:

- where they are,
- what the page contains,
- what to open first,
- what is optional,
- and how to continue.

## Manual test checklist

- [ ] `/today` uses the same theme as `/explore`.
- [ ] `/explore` no longer has run-on rows such as `صبرOpen...`.
- [ ] Icons such as `صبر`, `2:255`, and `☰` are readable.
- [ ] `/explore/patience` uses the same learning-section style.
- [ ] `/learn` uses collapsed subject sections.
- [ ] `/learn/quran` hides the Surah list until expanded.
- [ ] `/learn/quran/32#ayah-15` opens with readable Quran text and floating navigator.
- [ ] No page has bright-on-bright or dark-on-dark text.
