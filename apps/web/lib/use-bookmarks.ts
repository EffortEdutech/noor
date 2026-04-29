'use client';

import type { BookmarkItem } from '@noor/content';
import { useCallback, useEffect, useState } from 'react';
import { NOOR_BOOKMARKS_EVENT, readBookmarks, removeBookmark } from './local-store';

export function useBookmarks() {
  const [bookmarks, setBookmarks] = useState<BookmarkItem[]>([]);

  const refresh = useCallback(() => {
    setBookmarks(readBookmarks());
  }, []);

  useEffect(() => {
    refresh();

    window.addEventListener(NOOR_BOOKMARKS_EVENT, refresh);
    window.addEventListener('storage', refresh);

    return () => {
      window.removeEventListener(NOOR_BOOKMARKS_EVENT, refresh);
      window.removeEventListener('storage', refresh);
    };
  }, [refresh]);

  const remove = useCallback((id: string) => {
    setBookmarks(removeBookmark(id));
  }, []);

  return {
    bookmarks,
    bookmarkCount: bookmarks.length,
    refresh,
    remove
  };
}
