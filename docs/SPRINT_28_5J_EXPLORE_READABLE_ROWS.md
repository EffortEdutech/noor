# Sprint 28.5J — Explore Readable Rows Hotfix

Purpose: fix the expanded Explore section that appeared as run-on text, for example Arabic icon + title + description + action all touching each other.

This patch removes reliance on old CSS classes for the expanded Explore rows and uses inline layout styles so old `!important` CSS cannot turn the icons or text unreadable.

## Fixes

- No yellow-on-yellow icon pills.
- No run-on text.
- Each row has icon, title, paragraph description, and action pill.
- The user can understand each choice as a separate learning option.
- No new content or infrastructure work.
