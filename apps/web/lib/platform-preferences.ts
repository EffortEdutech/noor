'use client';

import { useCallback, useEffect, useState } from 'react';
import { isAiWritingStyle, type AiWritingStyle } from './ai/types';

export const NOOR_PLATFORM_PREFERENCES_KEY = 'noor.platformPreferences.v1';
export const NOOR_PLATFORM_PREFERENCES_EVENT = 'noor:platform-preferences-updated';

export type NoorLanguageCode = 'en' | 'ms' | 'id' | 'ar' | 'ur' | 'ta' | 'zh';

export type PlatformPreferences = {
  interfaceLanguage: NoorLanguageCode;
  quranTranslationLanguage: NoorLanguageCode;
  tafseerLanguage: NoorLanguageCode;
  aiOutputLanguage: NoorLanguageCode;
  aiWritingStyle: AiWritingStyle;
  fallbackLanguage: NoorLanguageCode;
};

export const NOOR_LANGUAGE_OPTIONS: Array<{
  code: NoorLanguageCode;
  label: string;
  nativeLabel: string;
  direction: 'ltr' | 'rtl';
}> = [
  { code: 'en', label: 'English', nativeLabel: 'English', direction: 'ltr' },
  { code: 'ms', label: 'Malay', nativeLabel: 'Bahasa Melayu', direction: 'ltr' },
  { code: 'id', label: 'Indonesian', nativeLabel: 'Bahasa Indonesia', direction: 'ltr' },
  { code: 'ar', label: 'Arabic', nativeLabel: 'العربية', direction: 'rtl' },
  { code: 'ur', label: 'Urdu', nativeLabel: 'اردو', direction: 'rtl' },
  { code: 'ta', label: 'Tamil', nativeLabel: 'தமிழ்', direction: 'ltr' },
  { code: 'zh', label: 'Chinese', nativeLabel: '中文', direction: 'ltr' }
];

export const DEFAULT_PLATFORM_PREFERENCES: PlatformPreferences = {
  interfaceLanguage: 'en',
  quranTranslationLanguage: 'en',
  tafseerLanguage: 'en',
  aiOutputLanguage: 'en',
  aiWritingStyle: 'clear-modern',
  fallbackLanguage: 'en'
};

function hasBrowserStorage() {
  return typeof window !== 'undefined' && typeof window.localStorage !== 'undefined';
}

function isLanguageCode(value: unknown): value is NoorLanguageCode {
  return typeof value === 'string' && NOOR_LANGUAGE_OPTIONS.some((language) => language.code === value);
}

function normalizeLanguage(value: unknown, fallback: NoorLanguageCode): NoorLanguageCode {
  return isLanguageCode(value) ? value : fallback;
}

function normalizeWritingStyle(value: unknown): AiWritingStyle {
  return isAiWritingStyle(value) ? value : DEFAULT_PLATFORM_PREFERENCES.aiWritingStyle;
}

export function getLanguageLabel(language: NoorLanguageCode | string | undefined) {
  const option = NOOR_LANGUAGE_OPTIONS.find((item) => item.code === language);
  return option ? option.label : 'English';
}

export function getLanguageDirection(language: NoorLanguageCode | string | undefined) {
  const option = NOOR_LANGUAGE_OPTIONS.find((item) => item.code === language);
  return option?.direction ?? 'ltr';
}

function normalizePlatformPreferences(value: Partial<PlatformPreferences> | null | undefined): PlatformPreferences {
  return {
    interfaceLanguage: normalizeLanguage(value?.interfaceLanguage, DEFAULT_PLATFORM_PREFERENCES.interfaceLanguage),
    quranTranslationLanguage: normalizeLanguage(value?.quranTranslationLanguage, DEFAULT_PLATFORM_PREFERENCES.quranTranslationLanguage),
    tafseerLanguage: normalizeLanguage(value?.tafseerLanguage, DEFAULT_PLATFORM_PREFERENCES.tafseerLanguage),
    aiOutputLanguage: normalizeLanguage(value?.aiOutputLanguage, DEFAULT_PLATFORM_PREFERENCES.aiOutputLanguage),
    aiWritingStyle: normalizeWritingStyle(value?.aiWritingStyle),
    fallbackLanguage: normalizeLanguage(value?.fallbackLanguage, DEFAULT_PLATFORM_PREFERENCES.fallbackLanguage)
  };
}

function emitPlatformPreferencesEvent() {
  if (typeof window === 'undefined') return;
  window.dispatchEvent(new CustomEvent(NOOR_PLATFORM_PREFERENCES_EVENT));
}

export function readPlatformPreferences(): PlatformPreferences {
  if (!hasBrowserStorage()) return DEFAULT_PLATFORM_PREFERENCES;

  try {
    const raw = window.localStorage.getItem(NOOR_PLATFORM_PREFERENCES_KEY);
    if (!raw) return DEFAULT_PLATFORM_PREFERENCES;
    return normalizePlatformPreferences(JSON.parse(raw) as Partial<PlatformPreferences>);
  } catch {
    return DEFAULT_PLATFORM_PREFERENCES;
  }
}

export function writePlatformPreferences(value: PlatformPreferences) {
  if (!hasBrowserStorage()) return;

  window.localStorage.setItem(
    NOOR_PLATFORM_PREFERENCES_KEY,
    JSON.stringify(normalizePlatformPreferences(value))
  );
  emitPlatformPreferencesEvent();
}

export function resetPlatformPreferences() {
  if (!hasBrowserStorage()) return DEFAULT_PLATFORM_PREFERENCES;

  window.localStorage.removeItem(NOOR_PLATFORM_PREFERENCES_KEY);
  emitPlatformPreferencesEvent();
  return DEFAULT_PLATFORM_PREFERENCES;
}

export function usePlatformPreferences() {
  const [preferences, setPreferencesState] = useState<PlatformPreferences>(DEFAULT_PLATFORM_PREFERENCES);

  const refresh = useCallback(() => {
    setPreferencesState(readPlatformPreferences());
  }, []);

  useEffect(() => {
    refresh();

    const onStorage = (event: StorageEvent) => {
      if (event.key === NOOR_PLATFORM_PREFERENCES_KEY) refresh();
    };

    window.addEventListener(NOOR_PLATFORM_PREFERENCES_EVENT, refresh);
    window.addEventListener('storage', onStorage);

    return () => {
      window.removeEventListener(NOOR_PLATFORM_PREFERENCES_EVENT, refresh);
      window.removeEventListener('storage', onStorage);
    };
  }, [refresh]);

  const setPreferences = useCallback((next: PlatformPreferences) => {
    const normalized = normalizePlatformPreferences(next);
    setPreferencesState(normalized);
    writePlatformPreferences(normalized);
  }, []);

  const updatePreferences = useCallback(
    (patch: Partial<PlatformPreferences>) => {
      setPreferences({
        ...preferences,
        ...patch
      });
    },
    [preferences, setPreferences]
  );

  const reset = useCallback(() => {
    const next = resetPlatformPreferences();
    setPreferencesState(next);
  }, []);

  return {
    preferences,
    setPreferences,
    updatePreferences,
    reset
  };
}
