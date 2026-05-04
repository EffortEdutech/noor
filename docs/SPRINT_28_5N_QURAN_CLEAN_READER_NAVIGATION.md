# Sprint 28.5N — Quran Clean Reader Navigation

## Purpose

Fix the Quran reader UX so users do not need to move back and forth between the Surah list and the reader.

## Product Rule

The Quran reader should show the current or last-read Surah first. Surah and Ayah navigation should be hidden until the user taps the floating navigation button.

## Changes

- `/learn/quran` now displays the last visited Surah/Ayah from local storage.
- If there is no last visit, it displays Al-Fatihah Ayah 1.
- `/learn/quran/[surah]` saves the user’s current visible ayah as last visit.
- Floating Surah/Ayah navigation opens only on click/tap.
- Quran text remains the main visual focus.
- Surah list is moved into the floating navigator, not forced into the main page.

## Check

- Open `/learn/quran` with no prior reading. It should show Al-Fatihah.
- Open `/learn/quran/55#ayah-71`, scroll/read, then return to `/learn/quran`. It should show the last visited Surah/Ayah.
- On reader page, tap the floating Surah/Ayah button. Dropdown should open.
- Close it. The reader should return to a clean view.
