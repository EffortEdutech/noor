import type { BookmarkItem } from '@noor/content';

export const NOOR_BOOKMARKS_KEY = 'noor.bookmarks.v1';
export const NOOR_READING_PROGRESS_KEY = 'noor.readingProgress.v1';
export const NOOR_READING_HISTORY_KEY = 'noor.readingHistory.v1';

export const NOOR_BOOKMARKS_EVENT = 'noor:bookmarks-updated';
export const NOOR_READING_PROGRESS_EVENT = 'noor:reading-progress-updated';

export type ReadingProgress = {
  surah: number;
  ayah: number;
  key: string;
  title: string;
  subtitle?: string;
  href: string;
  updatedAt: string;
  readCount: number;
};

export type ReadingHistoryItem = ReadingProgress & {
  sessionId: string;
};

export type NoorLightStats = {
  bookmarkCount: number;
  readingSessions: number;
  lastReadAt?: string;
};

function hasBrowserStorage() {
  return typeof window !== 'undefined' && typeof window.localStorage !== 'undefined';
}

export function safeReadJson<T>(key: string, fallback: T): T {
  if (!hasBrowserStorage()) return fallback;

  try {
    const raw = window.localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

export function safeWriteJson<T>(key: string, value: T) {
  if (!hasBrowserStorage()) return;
  window.localStorage.setItem(key, JSON.stringify(value));
}

export function emitNoorEvent(eventName: string) {
  if (typeof window === 'undefined') return;
  window.dispatchEvent(new CustomEvent(eventName));
}

export function readBookmarks(): BookmarkItem[] {
  return safeReadJson<BookmarkItem[]>(NOOR_BOOKMARKS_KEY, []);
}

export function writeBookmarks(items: BookmarkItem[]) {
  safeWriteJson(NOOR_BOOKMARKS_KEY, items);
  emitNoorEvent(NOOR_BOOKMARKS_EVENT);
}

export function removeBookmark(id: string) {
  const next = readBookmarks().filter((bookmark) => bookmark.id !== id);
  writeBookmarks(next);
  return next;
}

export function readReadingProgress(): ReadingProgress | null {
  return safeReadJson<ReadingProgress | null>(NOOR_READING_PROGRESS_KEY, null);
}

export function writeReadingProgress(progress: ReadingProgress) {
  safeWriteJson(NOOR_READING_PROGRESS_KEY, progress);
  emitNoorEvent(NOOR_READING_PROGRESS_EVENT);
}

export function readReadingHistory(): ReadingHistoryItem[] {
  return safeReadJson<ReadingHistoryItem[]>(NOOR_READING_HISTORY_KEY, []);
}

export function writeReadingHistory(items: ReadingHistoryItem[]) {
  safeWriteJson(NOOR_READING_HISTORY_KEY, items.slice(0, 50));
  emitNoorEvent(NOOR_READING_PROGRESS_EVENT);
}

export function recordReadingProgress(input: Omit<ReadingProgress, 'updatedAt' | 'readCount'>) {
  const current = readReadingProgress();
  const now = new Date().toISOString();
  const next: ReadingProgress = {
    ...input,
    updatedAt: now,
    readCount: current?.key === input.key ? current.readCount + 1 : 1
  };

  writeReadingProgress(next);

  const history = readReadingHistory();
  const deduped = history.filter((item) => item.key !== input.key);
  writeReadingHistory([
    {
      ...next,
      sessionId: `${input.key}-${Date.now()}`
    },
    ...deduped
  ]);

  return next;
}

export function getNoorLightStats(): NoorLightStats {
  const bookmarks = readBookmarks();
  const history = readReadingHistory();
  const progress = readReadingProgress();

  return {
    bookmarkCount: bookmarks.length,
    readingSessions: history.length,
    lastReadAt: progress?.updatedAt
  };
}

export function formatRelativeNoorDate(value?: string) {
  if (!value) return 'Not started yet';

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return 'Recently';

  const diffMs = Date.now() - date.getTime();
  const diffMinutes = Math.floor(diffMs / 60_000);

  if (diffMinutes < 1) return 'Just now';
  if (diffMinutes < 60) return `${diffMinutes} min ago`;

  const diffHours = Math.floor(diffMinutes / 60);
  if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;

  const diffDays = Math.floor(diffHours / 24);
  if (diffDays < 7) return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;

  return date.toLocaleDateString(undefined, {
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  });
}
