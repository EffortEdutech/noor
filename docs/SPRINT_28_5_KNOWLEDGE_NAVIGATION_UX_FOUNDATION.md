# Sprint 28.5 — NOOR Knowledge Navigation UX Foundation

## Purpose

Sprint 28.5 starts the new NOOR GUI/UX direction.

NOOR should not behave like three disconnected content shelves:

```text
Quran
Tafseer
Hadith
```

NOOR should guide the user through knowledge naturally:

```text
Need → Topic → Question → Reference → Source relationship → Reflection → Continuation
```

The product goal is to help users retrieve guidance by human intention while preserving the different structures of Quran, Tafseer and Hadith.

## Core principle

```text
Quran is the foundation.
Tafseer gives understanding.
Hadith gives Prophetic application.
Topics connect user needs.
Journeys guide long-term learning.
Library preserves personal growth.
```

The GUI should not ask only:

```text
Which database do you want?
```

It should ask:

```text
What guidance are you seeking?
```

## Sprint scope

This sprint is GUI and knowledge navigation only.

### Included

```text
[ ] Universal Knowledge Bar
[ ] Explore-first guidance entry
[ ] Source Connections Panel
[ ] Ayah connection model
[ ] Tafseer connection model
[ ] Hadith connection model
[ ] Topic/question/reference entry pattern
[ ] Source trust and continuation cues
```

### Not included

```text
[ ] No Git workflow change
[ ] No CDN publishing work
[ ] No importer work
[ ] No review console work
[ ] No production promotion work
[ ] No admin console work
[ ] No fatwa/chatbot feature
```

## Reference learning checklist

### Quran.com pattern

```text
[ ] Ayah-level actions
[ ] Translation selector
[ ] Tafseer access
[ ] Bookmark/share/copy
[ ] Clean reading mode
[ ] Audio later
```

### Tanzil pattern

```text
[ ] Precise Surah/Ayah reference lookup
[ ] Clean Quran text
[ ] Minimal distraction
[ ] Translation discipline
```

### Altafsir pattern

```text
[ ] Tafseer by source/book
[ ] Tafseer may be ayah-based
[ ] Tafseer may cover ayah ranges
[ ] Tafseer may be long-form
[ ] Compare tafseer later
```

### Sahih-Bukhari style pattern

```text
[ ] Collection → book → chapter → hadith
[ ] Narrator context
[ ] Stable reference
[ ] Chapter context
[ ] Topic relationship
```

### QUL/Tarteel resource review checklist

When reviewing QUL manually, prioritize resources that improve navigation:

```text
[ ] Quran text
[ ] Surah metadata
[ ] Ayah metadata
[ ] Juz/page/hizb metadata
[ ] Translation editions
[ ] Tafseer datasets
[ ] Word/root/morphology data
[ ] Audio metadata
[ ] License clarity
```

## User journey model

### Journey 1 — Need based

```text
User opens NOOR
→ "I feel anxious"
→ Topic page / Explore result
→ Quran foundation
→ Tafseer insight
→ Hadith guidance
→ Reflection / save
```

### Journey 2 — Reference based

```text
User enters 2:255
→ Ayah workspace
→ Translation
→ Tafseer
→ Related Hadith
→ Related topics
→ Save / share / continue
```

### Journey 3 — Hadith based

```text
User opens hadith about intention
→ Reads source/narrator
→ Sees topic connection
→ Opens related Quran/Tafseer
→ Converts into one action
```

### Journey 4 — Continuation based

```text
User returns tomorrow
→ Today screen
→ Continue reading / continue topic / continue reflection
```

## Screen checklist

### Explore

```text
[ ] Opens with "What guidance are you seeking?"
[ ] Has Universal Knowledge Bar
[ ] Supports topic, question, reference and source entry
[ ] Results grouped by Quran, Tafseer and Hadith
[ ] Result cards show next action
[ ] No random box grid
```

### Ayah workspace

```text
[ ] Arabic ayah is central
[ ] Translation is clear
[ ] Tafseer connection exists
[ ] Related Hadith connection exists
[ ] Topic connection exists
[ ] Save/copy/share available
[ ] User knows where to go next
```

### Tafseer workspace

```text
[ ] Shows source/book
[ ] Shows ayah/range coverage
[ ] Links back to Quran context
[ ] Links to related topic
[ ] Supports future compare tafseer
[ ] Trust/source label visible
```

### Hadith workspace

```text
[ ] Shows collection/source
[ ] Shows book/chapter when available
[ ] Shows narrator when available
[ ] Shows topic tags
[ ] Links to Explore/topic
[ ] Links conceptually back to Quran guidance
[ ] Supports Read/Reflect/Practise
```

### Connections Panel

```text
[ ] Ayah → Tafseer
[ ] Ayah → Hadith
[ ] Ayah → Topic
[ ] Tafseer → Quran context
[ ] Tafseer → Topic
[ ] Tafseer → Other tafseer later
[ ] Hadith → Topic
[ ] Hadith → Quran/Tafseer exploration
[ ] Hadith → Practice action
```

## Definition of done

```text
[ ] Universal Knowledge Bar appears in Explore
[ ] Universal Knowledge Bar appears in Today
[ ] Ayah cards expose source relationship navigation
[ ] Tafseer entries expose source relationship navigation
[ ] Hadith cards expose source relationship navigation
[ ] CSS supports new navigation components
[ ] Documentation exists
[ ] Typecheck passes
[ ] Build passes
```

## Manual testing

```text
[ ] Open /today
[ ] Use Knowledge Bar with "2:255"
[ ] Use Knowledge Bar with "patience"
[ ] Open /explore
[ ] Search "mercy"
[ ] Open Quran result
[ ] Confirm Ayah card shows Connections
[ ] Open /learn/tafseer
[ ] Confirm Tafseer entry shows Connections
[ ] Open /learn/hadith
[ ] Confirm Hadith card shows Connections
```

## Guardrail

If a new screen looks like a simple grid of source boxes, pause and redesign.

Every screen must answer:

```text
What is the user trying to seek, understand, continue, connect, save, or practise?
```
