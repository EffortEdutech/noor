'use client';

import { NoorCard } from '@noor/ui';
import { AI_WRITING_STYLE_OPTIONS, getAiWritingStyleLabel, type AiWritingStyle } from '../lib/ai/types';
import type { AiAssistantStatus } from '../lib/ai/status';
import { getLanguageLabel, usePlatformPreferences } from '../lib/platform-preferences';

export function AiSettingsPanel({ status }: { status: AiAssistantStatus }) {
  const { preferences, updatePreferences } = usePlatformPreferences();

  return (
    <NoorCard>
      <div className="noor-row">
        <span className="noor-badge gold">AI assistant</span>
        <span className={status.configured ? 'noor-badge emerald' : 'noor-badge gold'}>
          {status.configured ? 'Configured' : 'Missing server key'}
        </span>
      </div>

      <h2>OpenAI reflection and teaching assistant</h2>
      <p className="noor-subtitle">
        Talab an-Noor generates reflection, Ishraq notes, and lesson preparation from supplied Quran, tafseer, and related-source context. It does not generate independent tafseer or fatwa.
      </p>

      <div className="noor-divider" />

      <div className="noor-mini-grid">
        <div className="noor-stat">
          <strong>{status.provider}</strong>
          <span>Provider</span>
        </div>
        <div className="noor-stat">
          <strong>{status.model}</strong>
          <span>Server model from OPENAI_MODEL</span>
        </div>
        <div className="noor-stat">
          <strong>{getLanguageLabel(preferences.aiOutputLanguage)}</strong>
          <span>Default AI output language</span>
        </div>
        <div className="noor-stat">
          <strong>{getAiWritingStyleLabel(preferences.aiWritingStyle)}</strong>
          <span>Default AI writing style</span>
        </div>
      </div>

      <div className="noor-divider" />

      <label className="noor-form-field">
        <span className="noor-reference">Default AI writing style</span>
        <select
          className="noor-input"
          value={preferences.aiWritingStyle}
          onChange={(event) => updatePreferences({ aiWritingStyle: event.target.value as AiWritingStyle })}
        >
          {AI_WRITING_STYLE_OPTIONS.map((style) => (
            <option value={style.id} key={style.id}>
              {style.label}
            </option>
          ))}
        </select>
        <small className="noor-muted">
          {AI_WRITING_STYLE_OPTIONS.find((style) => style.id === preferences.aiWritingStyle)?.helper}
        </small>
      </label>

      <div className="noor-divider" />

      <div className="noor-card is-soft">
        <h3>Server environment setup</h3>
        <p className="noor-subtitle">
          Add the key only on the server, either in local <code>apps/web/.env.local</code> or in Vercel Environment Variables.
        </p>
        <pre className="noor-code-block">{`OPENAI_API_KEY=your_key_later
OPENAI_MODEL=gpt-4o-mini`}</pre>
        <p className="noor-subtitle">
          Never create <code>NEXT_PUBLIC_OPENAI_API_KEY</code>. Public environment variables are exposed to the browser.
        </p>
      </div>

      <div className="noor-divider" />

      <div className="noor-card is-soft">
        <h3>Locked governance rule</h3>
        <p className="noor-subtitle">
          NOOR AI is an assistant for reflection and Ishraqaration. It is not a mufti, not a scholar, and not an independent tafseer source. Kitab Style controls expression only and must never change meaning.
        </p>
      </div>
    </NoorCard>
  );
}

