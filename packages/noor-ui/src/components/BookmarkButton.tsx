'use client';

import type { BookmarkItem } from '@noor/content';
import { useEffect, useState } from 'react';

const STORAGE_KEY = 'noor.bookmarks.v1';

function readBookmarks(): BookmarkItem[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function writeBookmarks(items: BookmarkItem[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
}

export function BookmarkButton({ item }: { item: Omit<BookmarkItem, 'createdAt'> }) {
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    setSaved(readBookmarks().some((bookmark) => bookmark.id === item.id));
  }, [item.id]);

  function toggle() {
    const current = readBookmarks();
    const exists = current.some((bookmark) => bookmark.id === item.id);
    const next = exists
      ? current.filter((bookmark) => bookmark.id !== item.id)
      : [{ ...item, createdAt: new Date().toISOString() }, ...current];

    writeBookmarks(next);
    setSaved(!exists);
  }

  return (
    <button className="noor-button secondary" type="button" onClick={toggle}>
      {saved ? 'Saved ✓' : 'Save'}
    </button>
  );
}
