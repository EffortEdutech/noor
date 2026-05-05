# Sprint 28.6A.2 Hotfix — Chevron CSS Triangle Fix

## Problem

The Unicode disclosure arrows rendered as broken mojibake text, for example `â–...`.

## Fix

This patch removes reliance on Unicode arrows. The icon is now drawn with CSS borders:

- collapsed: right-facing triangle
- opened: down-facing triangle

The original text inside the chevron span is hidden with `font-size: 0`, so any broken character does not show.
