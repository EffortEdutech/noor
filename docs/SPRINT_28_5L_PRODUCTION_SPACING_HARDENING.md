# Sprint 28.5L — Production Spacing and Readable Section Hardening

## Purpose

This hotfix corrects the production UI execution after the learning accordion work. The issue was not only one page. Several components had class names that were no longer covered after the theme reset, causing text to run together, boxes to collide, and icon badges to become unreadable.

## Fixed Areas

- `/today`
- `/explore`
- `/explore/[topic]`
- `/learn`
- `/learn/quran`
- `/learn/quran/[surah]`
- Hadith cards
- Universal Knowledge Bar
- Daily guided session steps
- Source connection cards
- Native details expand indicators
- `KnowledgeSettingsPanel` expand indicators

## UI Rules Locked

1. White/light panels must use dark readable text.
2. Icon badges must never be yellow-on-yellow or low contrast.
3. Each knowledge row must have title, paragraph, and action separation.
4. Quick topic cards must not run together as continuous text.
5. Expand/collapse controls must visibly change state.
6. Component spacing must be global and consistent across learning pages.

## Test URLs

- `/today`
- `/explore`
- `/explore/patience`
- `/learn`
- `/learn/quran`
- `/learn/quran/32#ayah-15`
