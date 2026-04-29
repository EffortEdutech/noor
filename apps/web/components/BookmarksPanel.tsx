'use client';

import { NoorCard } from '@noor/ui';
import type { BookmarkItem } from '@noor/content';
import { useEffect, useState } from 'react';

const STORAGE_KEY = 'noor.bookmarks.v1';

export function BookmarksPanel() {
  const [bookmarks, setBookmarks] = useState<BookmarkItem[]>([]);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      setBookmarks(raw ? JSON.parse(raw) : []);
    } catch {
      setBookmarks([]);
    }
  }, []);

  if (bookmarks.length === 0) {
    return (
      <NoorCard>
        <p className="noor-subtitle">No bookmarks yet. Open a Quran ayah and tap Save.</p>
      </NoorCard>
    );
  }

  return (
    <div className="noor-stack">
      {bookmarks.map((item) => (
        <NoorCard key={item.id}>
          <div className="noor-row">
            <span className="noor-badge gold">{item.type}</span>
            <span className="noor-reference">{item.reference}</span>
          </div>
          <p className="noor-subtitle">{item.title}</p>
        </NoorCard>
      ))}
    </div>
  );
}
