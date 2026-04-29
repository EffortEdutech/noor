'use client';

import { NoorCard } from '@noor/ui';
import { useReaderPreferences } from '../lib/reader-preferences';

export function ReaderPreferencesPanel({ compact = false }: { compact?: boolean }) {
  const { preferences, updatePreferences, reset } = useReaderPreferences();

  return (
    <NoorCard variant={compact ? 'soft' : 'default'}>
      <div className="noor-row">
        <span className="noor-badge gold">Reader preferences</span>
        <button className="noor-button secondary" type="button" onClick={reset}>
          Reset
        </button>
      </div>

      {!compact ? (
        <p className="noor-subtitle" style={{ marginTop: 10 }}>
          These settings are saved locally on this device and applied immediately to the Quran reader.
        </p>
      ) : null}

      <div className="noor-divider" />

      <div className="noor-grid compact">
        <label className="noor-form-field">
          <span className="noor-reference">Translation view</span>
          <select
            className="noor-input"
            value={preferences.languageMode}
            onChange={(event) =>
              updatePreferences({
                languageMode: event.target.value as 'both' | 'en' | 'ms'
              })
            }
          >
            <option value="both">English + Malay</option>
            <option value="en">English only</option>
            <option value="ms">Malay only</option>
          </select>
        </label>

        <label className="noor-form-field">
          <span className="noor-reference">Arabic size</span>
          <select
            className="noor-input"
            value={preferences.arabicSize}
            onChange={(event) =>
              updatePreferences({
                arabicSize: event.target.value as 'compact' | 'comfortable' | 'large'
              })
            }
          >
            <option value="compact">Compact</option>
            <option value="comfortable">Comfortable</option>
            <option value="large">Large</option>
          </select>
        </label>
      </div>

      <div className="noor-divider" />

      <div className="noor-stack tight">
        <label className="noor-row" style={{ justifyContent: 'flex-start' }}>
          <input
            type="checkbox"
            checked={preferences.showTransliteration}
            onChange={(event) => updatePreferences({ showTransliteration: event.target.checked })}
          />
          <span>Show transliteration when available</span>
        </label>

        <label className="noor-row" style={{ justifyContent: 'flex-start' }}>
          <input
            type="checkbox"
            checked={preferences.showTafseer}
            onChange={(event) => updatePreferences({ showTafseer: event.target.checked })}
          />
          <span>Show tafseer notes in ayah cards</span>
        </label>

        <label className="noor-row" style={{ justifyContent: 'flex-start' }}>
          <input
            type="checkbox"
            checked={preferences.focusMode}
            onChange={(event) => updatePreferences({ focusMode: event.target.checked })}
          />
          <span>Focus mode card highlight</span>
        </label>
      </div>
    </NoorCard>
  );
}
