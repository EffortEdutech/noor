'use client';

import { useMemo, useState } from 'react';
import {
  getLanguageDirection,
  getLanguageLabel,
  NOOR_LANGUAGE_OPTIONS,
  type NoorLanguageCode,
  usePlatformPreferences
} from '../lib/platform-preferences';
import {
  AI_ACTIONS,
  AI_WRITING_STYLE_OPTIONS,
  getAiWritingStyleLabel,
  type AiActionMode,
  type AiReflectionResponse,
  type AiSourceContext,
  type AiWritingStyle
} from '../lib/ai/types';
import { cleanNoorUiText, summarizeSourcesGathered } from '../lib/ai/source-context';
import styles from './AiSourceAssistant.module.css';

type AiSourceAssistantProps = {
  context: AiSourceContext;
  compact?: boolean;
  variant?: 'quran' | 'tafseer';
};

type LanguageSelection = 'settings' | NoorLanguageCode;
type StyleSelection = 'settings' | AiWritingStyle;

function getActionLabel(mode: AiActionMode) {
  return AI_ACTIONS.find((action) => action.mode === mode)?.label ?? 'Generate';
}

export function AiSourceAssistant({ context, compact = false, variant = 'tafseer' }: AiSourceAssistantProps) {
  const { preferences } = usePlatformPreferences();
  const [languageSelection, setLanguageSelection] = useState<LanguageSelection>('settings');
  const [styleSelection, setStyleSelection] = useState<StyleSelection>('settings');
  const [activeMode, setActiveMode] = useState<AiActionMode | null>(null);
  const [result, setResult] = useState<AiReflectionResponse | null>(null);
  const [error, setError] = useState('');

  const outputLanguageCode = languageSelection === 'settings'
    ? preferences.aiOutputLanguage
    : languageSelection;

  const writingStyle = styleSelection === 'settings'
    ? preferences.aiWritingStyle
    : styleSelection;

  const outputLanguageLabel = getLanguageLabel(outputLanguageCode);
  const outputDirection = getLanguageDirection(outputLanguageCode);

  const sourcesGathered = useMemo(() => summarizeSourcesGathered(context), [context]);

  const contextSummary = useMemo(() => {
    return sourcesGathered.map(cleanNoorUiText).join(' | ');
  }, [sourcesGathered]);

  async function generate(mode: AiActionMode) {
    setActiveMode(mode);
    setError('');
    setResult(null);

    try {
      const response = await fetch('/api/ai/reflection', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          mode,
          outputLanguage: outputLanguageLabel,
          writingStyle,
          context
        })
      });

      const data = (await response.json()) as AiReflectionResponse & { error?: string };

      if (!response.ok || !data.ok) {
        throw new Error(data.error || data.warning || 'AI generation failed.');
      }

      setResult(data);
    } catch (generationError) {
      setError(generationError instanceof Error ? generationError.message : 'AI generation failed.');
    } finally {
      setActiveMode(null);
    }
  }

  return (
    <section
      className={`${styles.assistant} ${compact ? styles.compact : ''}`}
      aria-label="Talab an-Noor AI-assisted reflection and teaching preparation"
      data-variant={variant}
    >
      <div className={styles.header}>
        <div>
          <span>Talab an-Noor</span>
          <h3>{variant === 'quran' ? 'Study this ayah with source guidance' : 'Prepare from this tafseer'}</h3>
          <p>
            Generate reflection, teaching notes, or a lesson plan from the selected Quran, tafseer, and supplied related sources only.
          </p>
        </div>
        <div className={styles.selectGrid}>
          <label className={styles.languageSelect}>
            <span>Output language</span>
            <select
              value={languageSelection}
              onChange={(event) => setLanguageSelection(event.target.value as LanguageSelection)}
            >
              <option value="settings">Use Settings ({getLanguageLabel(preferences.aiOutputLanguage)})</option>
              {NOOR_LANGUAGE_OPTIONS.map((language) => (
                <option value={language.code} key={language.code}>
                  {language.label}
                </option>
              ))}
            </select>
          </label>

          <label className={styles.languageSelect}>
            <span>Writing style</span>
            <select
              value={styleSelection}
              onChange={(event) => setStyleSelection(event.target.value as StyleSelection)}
            >
              <option value="settings">Use Settings ({getAiWritingStyleLabel(preferences.aiWritingStyle)})</option>
              {AI_WRITING_STYLE_OPTIONS.map((style) => (
                <option value={style.id} key={style.id}>
                  {style.label}
                </option>
              ))}
            </select>
          </label>
        </div>
      </div>

      <div className={styles.sourcesGathered} aria-label="Sources gathered for AI">
        <strong>Sources gathered</strong>
        <p>{contextSummary}</p>
        {(context.relatedAyat?.length ?? 0) === 0 || (context.relatedHadith?.length ?? 0) === 0 ? (
          <small>Missing related sources are labelled clearly. Talab an-Noor must not invent related ayat or hadith.</small>
        ) : null}
      </div>

      <div className={styles.actions}>
        {AI_ACTIONS.map((action) => (
          <button
            key={action.mode}
            type="button"
            onClick={() => generate(action.mode)}
            disabled={Boolean(activeMode)}
            title={action.helper}
          >
            {activeMode === action.mode ? 'Generating...' : action.label}
          </button>
        ))}
      </div>

      {error ? <p className={styles.error}>{error}</p> : null}

      {result ? (
        <article className={styles.result} data-configured={result.configured ? 'true' : 'false'}>
          <div className={styles.resultHead}>
            <span>{getActionLabel(result.mode)}</span>
            <strong>{result.configured ? 'Generated' : 'Configuration needed'}</strong>
          </div>
          <p className={styles.resultMeta}>
            {result.outputLanguage} | {getAiWritingStyleLabel(result.writingStyle)}
          </p>
          {result.warning ? <p className={styles.warning}>{result.warning}</p> : null}
          <pre lang={outputLanguageCode} dir={outputDirection}>{result.text}</pre>
          <details className={styles.sources}>
            <summary>Sources sent to AI</summary>
            <ul>
              {result.sourcesUsed.map((source) => (
                <li key={source}>{cleanNoorUiText(source)}</li>
              ))}
            </ul>
          </details>
        </article>
      ) : null}
    </section>
  );
}
