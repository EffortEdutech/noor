# Sprint 28.5B — Topic Page v1

**Project:** NOOR  
**Focus:** GUI and knowledge navigation only  
**Scope:** Topic page experience, not Git, CDN, importers, review workflow or infrastructure

---

## 1. Purpose

Sprint 28.5B turns topic pages into a guided knowledge path.

A topic page must not be a simple list of source cards. It must help the user move naturally through:

```text
Need → Quran foundation → Tafseer understanding → Hadith guidance → Reflection/action → Continue
```

This keeps NOOR aligned with the Sprint 28.5 knowledge navigation rule:

```text
Quran is the foundation.
Tafseer gives understanding.
Hadith gives Prophetic application.
Topics connect user needs.
Journeys guide long-term learning.
Library preserves personal growth.
```

---

## 2. In Scope

```text
[ ] Upgrade /explore/[topic] into Topic Page v1
[ ] Add Universal Knowledge Bar to topic pages
[ ] Add topic hero with intention and daily response
[ ] Add Topic Connections panel
[ ] Add source route: Quran → Tafseer → Hadith → Respond
[ ] Add Knowledge Stack sections
[ ] Add helpful empty states when a source has no linked result
[ ] Add related topic continuation
[ ] Preserve reflection/progress saving through GuidanceTopicJourneyClient
```

---

## 3. Out of Scope

```text
[ ] No CDN work
[ ] No importer work
[ ] No production promotion work
[ ] No review console changes
[ ] No Git automation
[ ] No AI fatwa/chatbot feature
[ ] No large data migration
```

---

## 4. Screen Structure

Each topic page should contain:

```text
1. Page header
2. Universal Knowledge Bar
3. Topic hero
4. Today’s response card
5. Topic Connections panel
6. Step path: Read Quran → Understand Tafseer → Reflect with Hadith → Respond
7. Knowledge Stack
   - Quran foundation
   - Tafseer insight
   - Hadith guidance
8. Reflection/progress tracker
9. Related topics
```

---

## 5. Acceptance Checklist

```text
[ ] /explore/patience opens a complete guided topic page
[ ] /explore/mercy opens a complete guided topic page
[ ] User sees Quran, Tafseer and Hadith as one connected path
[ ] User can begin with Quran from the topic page
[ ] User can open Tafseer from the topic page
[ ] User can open Hadith reflection from the topic page
[ ] User can save reflection/progress
[ ] Related topics are shown for continuation
[ ] Empty states guide the user instead of blocking them
[ ] The page does not feel like a grid of random cards
```

---

## 6. Test URLs

```text
http://localhost:3200/explore/patience
http://localhost:3200/explore/mercy
http://localhost:3200/explore/rizq
http://localhost:3200/explore/intention
http://localhost:3200/explore/protection
http://localhost:3200/explore/prayer
http://localhost:3200/explore/repentance
```

---

## 7. Done Definition

Sprint 28.5B is done when a beginner can enter through a life need such as patience, mercy or rizq and clearly know:

```text
What to read
What to understand
Which Hadith to reflect on
What action to take today
Where to continue next
```
