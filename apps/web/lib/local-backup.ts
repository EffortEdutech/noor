import {
  NOOR_BOOKMARKS_EVENT,
  NOOR_BOOKMARKS_KEY,
  NOOR_JOURNEY_PROGRESS_EVENT,
  NOOR_JOURNEY_PROGRESS_KEY,
  NOOR_READING_HISTORY_KEY,
  NOOR_READING_PROGRESS_EVENT,
  NOOR_READING_PROGRESS_KEY,
  emitNoorEvent
} from './local-store';
import {
  NOOR_READER_PREFERENCES_EVENT,
  NOOR_READER_PREFERENCES_KEY
} from './reader-preferences';

export const NOOR_LOCAL_BACKUP_SCHEMA = 'noor.local-backup.v1';
export const NOOR_RECENT_SEARCHES_KEY = 'noor.search.recent.v1';

export const NOOR_LOCAL_BACKUP_KEYS = [
  NOOR_BOOKMARKS_KEY,
  NOOR_READING_PROGRESS_KEY,
  NOOR_READING_HISTORY_KEY,
  NOOR_JOURNEY_PROGRESS_KEY,
  NOOR_READER_PREFERENCES_KEY,
  NOOR_RECENT_SEARCHES_KEY
] as const;

export type NoorLocalBackupKey = (typeof NOOR_LOCAL_BACKUP_KEYS)[number];

export type NoorLocalBackup = {
  schema: typeof NOOR_LOCAL_BACKUP_SCHEMA;
  exportedAt: string;
  appVersion: string;
  origin: string;
  items: Partial<Record<NoorLocalBackupKey, unknown>>;
};

export type NoorLocalBackupSummary = {
  keysPresent: number;
  approxBytes: number;
  bookmarkCount: number;
  readingHistoryCount: number;
  journeyCount: number;
  recentSearchCount: number;
  hasReaderPreferences: boolean;
};

function hasBrowserStorage() {
  return typeof window !== 'undefined' && typeof window.localStorage !== 'undefined';
}

function safeParse<T>(raw: string | null, fallback: T): T {
  if (!raw) return fallback;

  try {
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

function emitAllLocalDataEvents() {
  emitNoorEvent(NOOR_BOOKMARKS_EVENT);
  emitNoorEvent(NOOR_READING_PROGRESS_EVENT);
  emitNoorEvent(NOOR_JOURNEY_PROGRESS_EVENT);
  emitNoorEvent(NOOR_READER_PREFERENCES_EVENT);
}

export function readNoorBackupSummary(): NoorLocalBackupSummary {
  if (!hasBrowserStorage()) {
    return {
      keysPresent: 0,
      approxBytes: 0,
      bookmarkCount: 0,
      readingHistoryCount: 0,
      journeyCount: 0,
      recentSearchCount: 0,
      hasReaderPreferences: false
    };
  }

  const rawByKey = NOOR_LOCAL_BACKUP_KEYS.map((key) => [key, window.localStorage.getItem(key)] as const);
  const keysPresent = rawByKey.filter(([, raw]) => raw !== null).length;
  const approxBytes = rawByKey.reduce((total, [, raw]) => total + (raw?.length ?? 0), 0);

  const bookmarks = safeParse<unknown[]>(window.localStorage.getItem(NOOR_BOOKMARKS_KEY), []);
  const history = safeParse<unknown[]>(window.localStorage.getItem(NOOR_READING_HISTORY_KEY), []);
  const journeyMap = safeParse<Record<string, unknown>>(window.localStorage.getItem(NOOR_JOURNEY_PROGRESS_KEY), {});
  const recentSearches = safeParse<unknown[]>(window.localStorage.getItem(NOOR_RECENT_SEARCHES_KEY), []);

  return {
    keysPresent,
    approxBytes,
    bookmarkCount: Array.isArray(bookmarks) ? bookmarks.length : 0,
    readingHistoryCount: Array.isArray(history) ? history.length : 0,
    journeyCount: journeyMap && typeof journeyMap === 'object' ? Object.keys(journeyMap).length : 0,
    recentSearchCount: Array.isArray(recentSearches) ? recentSearches.length : 0,
    hasReaderPreferences: window.localStorage.getItem(NOOR_READER_PREFERENCES_KEY) !== null
  };
}

export function createNoorLocalBackup(appVersion: string): NoorLocalBackup {
  const items: NoorLocalBackup['items'] = {};

  if (hasBrowserStorage()) {
    for (const key of NOOR_LOCAL_BACKUP_KEYS) {
      const raw = window.localStorage.getItem(key);
      if (raw !== null) items[key] = safeParse<unknown>(raw, raw);
    }
  }

  return {
    schema: NOOR_LOCAL_BACKUP_SCHEMA,
    exportedAt: new Date().toISOString(),
    appVersion,
    origin: typeof window !== 'undefined' ? window.location.origin : 'server',
    items
  };
}

export function stringifyNoorLocalBackup(backup: NoorLocalBackup) {
  return `${JSON.stringify(backup, null, 2)}\n`;
}

export function downloadTextFile(filename: string, text: string) {
  if (typeof window === 'undefined') return;

  const blob = new Blob([text], { type: 'application/json;charset=utf-8' });
  const url = window.URL.createObjectURL(blob);
  const anchor = document.createElement('a');

  anchor.href = url;
  anchor.download = filename;
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
  window.URL.revokeObjectURL(url);
}

export function importNoorLocalBackup(rawJson: string) {
  if (!hasBrowserStorage()) {
    return { importedKeys: 0, skippedKeys: NOOR_LOCAL_BACKUP_KEYS.length };
  }

  const parsed = JSON.parse(rawJson) as Partial<NoorLocalBackup>;
  if (parsed.schema !== NOOR_LOCAL_BACKUP_SCHEMA || !parsed.items || typeof parsed.items !== 'object') {
    throw new Error('Invalid NOOR backup file.');
  }

  let importedKeys = 0;
  let skippedKeys = 0;

  for (const key of NOOR_LOCAL_BACKUP_KEYS) {
    if (Object.prototype.hasOwnProperty.call(parsed.items, key)) {
      window.localStorage.setItem(key, JSON.stringify(parsed.items[key]));
      importedKeys += 1;
    } else {
      skippedKeys += 1;
    }
  }

  emitAllLocalDataEvents();
  return { importedKeys, skippedKeys };
}

export function clearNoorLocalData() {
  if (!hasBrowserStorage()) return 0;

  let removedKeys = 0;
  for (const key of NOOR_LOCAL_BACKUP_KEYS) {
    if (window.localStorage.getItem(key) !== null) removedKeys += 1;
    window.localStorage.removeItem(key);
  }

  emitAllLocalDataEvents();
  return removedKeys;
}

export function makeNoorBackupFilename() {
  const stamp = new Date().toISOString().slice(0, 10);
  return `noor-local-backup-${stamp}.json`;
}
