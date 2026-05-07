'use client';

import { NoorCard } from '@noor/ui';
import { NOOR_LANGUAGE_OPTIONS, usePlatformPreferences, type NoorLanguageCode } from '../lib/platform-preferences';

function LanguageSelect({
  label,
  value,
  onChange,
  helper
}: {
  label: string;
  value: NoorLanguageCode;
  onChange: (value: NoorLanguageCode) => void;
  helper: string;
}) {
  return (
    <label className="noor-form-field">
      <span className="noor-reference">{label}</span>
      <select className="noor-input" value={value} onChange={(event) => onChange(event.target.value as NoorLanguageCode)}>
        {NOOR_LANGUAGE_OPTIONS.map((language) => (
          <option value={language.code} key={language.code}>
            {language.label} - {language.nativeLabel}
          </option>
        ))}
      </select>
      <small className="noor-muted">{helper}</small>
    </label>
  );
}

export function LanguageSettingsPanel() {
  const { preferences, updatePreferences, reset } = usePlatformPreferences();

  return (
    <NoorCard>
      <div className="noor-row">
        <span className="noor-badge gold">Multilanguage foundation</span>
        <button className="noor-button secondary" type="button" onClick={reset}>
          Reset language settings
        </button>
      </div>

      <h2>Language preferences</h2>
      <p className="noor-subtitle">
        These settings prepare NOOR for multilanguage learning. AI output uses this language by default. Interface translation can be expanded later using the same preference foundation.
      </p>

      <div className="noor-divider" />

      <div className="noor-grid">
        <LanguageSelect
          label="Interface language"
          value={preferences.interfaceLanguage}
          helper="Future default language for menus and platform labels."
          onChange={(value) => updatePreferences({ interfaceLanguage: value })}
        />
        <LanguageSelect
          label="Quran translation language"
          value={preferences.quranTranslationLanguage}
          helper="Preferred translation language where content exists."
          onChange={(value) => updatePreferences({ quranTranslationLanguage: value })}
        />
        <LanguageSelect
          label="Tafseer language"
          value={preferences.tafseerLanguage}
          helper="Preferred tafseer source language where coverage exists."
          onChange={(value) => updatePreferences({ tafseerLanguage: value })}
        />
        <LanguageSelect
          label="AI output language"
          value={preferences.aiOutputLanguage}
          helper="Default language for Generate Reflection, Generate Ishraq Notes, and Prepare Lesson."
          onChange={(value) => updatePreferences({ aiOutputLanguage: value })}
        />
        <LanguageSelect
          label="Fallback language"
          value={preferences.fallbackLanguage}
          helper="Used when preferred content language is unavailable."
          onChange={(value) => updatePreferences({ fallbackLanguage: value })}
        />
      </div>
    </NoorCard>
  );
}

