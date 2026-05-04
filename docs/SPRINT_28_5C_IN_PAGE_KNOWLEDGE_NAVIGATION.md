# Sprint 28.5C — In-Page Knowledge Navigation & Dopamine UX

**Project:** NOOR  
**Focus:** GUI and knowledge navigation only  
**Purpose:** Make knowledge-heavy pages immediately understandable before the user scrolls.

---

## 1. Problem

The current NOOR UI has useful knowledge, but too many sections compete on every page.

The user may ask:

```text
What is inside this page?
Where should I start?
Why am I seeing these cards?
What is the best order?
What is optional?
```

This creates cognitive load. It is not a dopamine-friendly guidance experience.

---

## 2. Product Principle

```text
NOOR does not show knowledge all at once.
NOOR delivers knowledge in a guided order.
```

Bottom navigation moves between main areas.

In-page navigation guides the user through the knowledge inside that page.

---

## 3. New Page Pattern

Every major page should follow:

```text
1. Page purpose
2. Page compass
3. Recommended next step
4. Primary focus content
5. Source-role sections
6. Reflection / completion
7. Optional continuation
```

---

## 4. Knowledge Roles

NOOR should label knowledge by role:

| Role | Meaning |
|---|---|
| Quran | Foundation |
| Tafseer | Understanding |
| Hadith | Prophetic application |
| Reflection | Personal response |
| Related Topics | Optional continuation |

---

## 5. New Component

### `KnowledgePageCompass`

This component answers:

```text
What is inside this page?
What sections exist?
What is the recommended next step?
```

It is not a main navigation bar. It is a page-level knowledge map.

---

## 6. Pages Updated

```text
[ ] /today
[ ] /explore
[ ] /explore/[topic]
```

### `/today`

Reframed as:

```text
Continue → Daily → Reflect → Deeper
```

### `/explore`

Reframed as a decision screen:

```text
Need → Question → Reference
```

### `/explore/[topic]`

Reframed as a knowledge delivery path:

```text
Begin → Quran → Tafseer → Hadith → Reflect → Continue
```

---

## 7. Acceptance Checklist

```text
[ ] User knows what is inside the page without scrolling.
[ ] User sees one recommended next step.
[ ] Page sections are visible near the top.
[ ] Quran, Tafseer and Hadith are presented by role.
[ ] Primary content appears before optional content.
[ ] Related topics are visually secondary.
[ ] Reflection gives the page a completion loop.
[ ] Bottom navigation remains only for main pages.
```

---

## 8. Out of Scope

```text
[ ] More content
[ ] CDN work
[ ] Importers
[ ] Review/admin changes
[ ] Authentication
[ ] Git workflow changes
```

---

## 9. Sprint Statement

Sprint 28.5C turns NOOR from a scroll of knowledge into a guided page experience where the user feels:

```text
I know where I am.
I know what is inside.
I know what to open first.
I know what is optional.
I can complete one small guidance loop.
```
