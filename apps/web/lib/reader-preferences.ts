

import { useCallback, useEffect, useState } from 'react';

export const NOOR_READER_PREFERENCES_KEY = 'noor.readerPreferences.v1';
export const NOOR_READER_PREFERENCES_EVENT = 'noor:reader-preferences-updated';

export type ReaderLanguageMode = 'both' | 'en' | 'ms';
export type ReaderArabicSize = 'compact' | 'comfortable' | 'large';

export type ReaderPreferences = {
  languageMode: ReaderLanguageMode;
  arabicSize: ReaderArabicSize;
  showTransliteration: boolean;
  showTafseer: boolean;
  focusMode: boolean;
};

export const DEFAULT_READER_PREFERENCES: ReaderPreferences = {
  languageMode: 'both',
  arabicSize: 'comfortable',
  showTransliteration: true,
  showTafseer: true,
  focusMode: false
};

function hasBrowserStorage() {
  return typeof window !== 'undefined' && typeof window.localStorage !== 'undefined';
}

function emitReaderPreferencesEvent() {
  if (typeof window === 'undefined') return;
  window.dispatchEvent(new CustomEvent(NOOR_READER_PREFERENCES_EVENT));
}

function normalizeReaderPreferences(value: Partial<ReaderPreferences> | null | undefined): ReaderPreferences {
  return {
    languageMode:
      value?.languageMode === 'en' || value?.languageMode === 'ms' || value?.languageMode === 'both'
        ? value.languageMode
        : DEFAULT_READER_PREFERENCES.languageMode,
    arabicSize:
      value?.arabicSize === 'compact' || value?.arabicSize === 'large' || value?.arabicSize === 'comfortable'
        ? value.arabicSize
        : DEFAULT_READER_PREFERENCES.arabicSize,
    showTransliteration:
      typeof value?.showTransliteration === 'boolean'
        ? value.showTransliteration
        : DEFAULT_READER_PREFERENCES.showTransliteration,
    showTafseer:
      typeof value?.showTafseer === 'boolean' ? value.showTafseer : DEFAULT_READER_PREFERENCES.showTafseer,
    focusMode: typeof value?.focusMode === 'boolean' ? value.focusMode : DEFAULT_READER_PREFERENCES.focusMode
  };
}

export function readReaderPreferences(): ReaderPreferences {
  if (!hasBrowserStorage()) return DEFAULT_READER_PREFERENCES;

  try {
    const raw = window.localStorage.getItem(NOOR_READER_PREFERENCES_KEY);
    if (!raw) return DEFAULT_READER_PREFERENCES;
    return normalizeReaderPreferences(JSON.parse(raw) as Partial<ReaderPreferences>);
  } catch {
    return DEFAULT_READER_PREFERENCES;
  }
}

export function writeReaderPreferences(value: ReaderPreferences) {
  if (!hasBrowserStorage()) return;

  window.localStorage.setItem(NOOR_READER_PREFERENCES_KEY, JSON.stringify(normalizeReaderPreferences(value)));
  emitReaderPreferencesEvent();
}

export function resetReaderPreferences() {
  if (!hasBrowserStorage()) return DEFAULT_READER_PREFERENCES;

  window.localStorage.removeItem(NOOR_READER_PREFERENCES_KEY);
  emitReaderPreferencesEvent();
  return DEFAULT_READER_PREFERENCES;
}

export function useReaderPreferences() {
  const [preferences, setPreferencesState] = useState<ReaderPreferences>(DEFAULT_READER_PREFERENCES);

  const refresh = useCallback(() => {
    setPreferencesState(readReaderPreferences());
  }, []);

  useEffect(() => {
    refresh();

    const onStorage = (event: StorageEvent) => {
      if (event.key === NOOR_READER_PREFERENCES_KEY) refresh();
    };

    window.addEventListener(NOOR_READER_PREFERENCES_EVENT, refresh);
    window.addEventListener('storage', onStorage);

    return () => {
      window.removeEventListener(NOOR_READER_PREFERENCES_EVENT, refresh);
      window.removeEventListener('storage', onStorage);
    };
  }, [refresh]);

  const setPreferences = useCallback((next: ReaderPreferences) => {
    const normalized = normalizeReaderPreferences(next);
    setPreferencesState(normalized);
    writeReaderPreferences(normalized);
  }, []);

  const updatePreferences = useCallback(
    (patch: Partial<ReaderPreferences>) => {
      setPreferences({
        ...preferences,
        ...patch
      });
    },
    [preferences, setPreferences]
  );

  const reset = useCallback(() => {
    const next = resetReaderPreferences();
    setPreferencesState(next);
  }, []);

  return {
    preferences,
    setPreferences,
    updatePreferences,
    reset
  };
}

export function getArabicFontSize(preference: ReaderArabicSize) {
  if (preference === 'compact') return 'clamp(24px, 5vw, 34px)';
  if (preference === 'large') return 'clamp(34px, 8vw, 56px)';
  return 'clamp(28px, 6vw, 42px)';
}
