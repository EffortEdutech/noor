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
type ResultActionStatus = 'copied' | 'saved' | 'cleared' | '';

const TALAB_RESULTS_STORAGE_KEY = 'noor.talab.results.v1';
const TALAB_RESULTS_LIMIT = 20;

type SavedTalabResult = {
  id: string;
  savedAt: string;
  reference: string;
  surface: AiSourceContext['surface'];
  mode: AiActionMode;
  outputLanguage: string;
  writingStyle: AiWritingStyle;
  text: string;
  sourcesUsed: string[];
};

function getActionLabel(mode: AiActionMode) {
  return AI_ACTIONS.find((action) => action.mode === mode)?.label ?? 'Generate';
}

async function copyText(text: string) {
  if (typeof navigator !== 'undefined' && navigator.clipboard?.writeText) {
    await navigator.clipboard.writeText(text);
    return true;
  }

  if (typeof document === 'undefined') return false;

  const textArea = document.createElement('textarea');
  textArea.value = text;
  textArea.setAttribute('readonly', 'true');
  textArea.style.position = 'fixed';
  textArea.style.left = '-9999px';
  document.body.appendChild(textArea);
  textArea.select();

  try {
    document.execCommand('copy');
    return true;
  } finally {
    document.body.removeChild(textArea);
  }
}

function buildResultExportText({
  context,
  result
}: {
  context: AiSourceContext;
  result: AiReflectionResponse;
}) {
  return [
    'Talab an-Noor',
    '',
    `Action: ${getActionLabel(result.mode)}`,
    `Reference: ${cleanNoorUiText(context.reference)}`,
    `Surface: ${context.surface}`,
    `Language: ${cleanNoorUiText(result.outputLanguage)}`,
    `Writing style: ${getAiWritingStyleLabel(result.writingStyle)}`,
    '',
    'Generated note:',
    result.text,
    '',
    'Sources used:',
    ...(result.sourcesUsed.length ? result.sourcesUsed.map((source) => `- ${cleanNoorUiText(source)}`) : ['- No source list returned.']),
    '',
    'Governance reminder:',
    'This is AI-assisted reflection or teaching preparation from supplied NOOR context. It is not tafseer, not fatwa, and not a substitute for qualified scholarship.'
  ].join('\n');
}

function readSavedResults(): SavedTalabResult[] {
  if (typeof window === 'undefined') return [];

  try {
    const raw = window.localStorage.getItem(TALAB_RESULTS_STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as SavedTalabResult[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function saveTalabResult(context: AiSourceContext, result: AiReflectionResponse) {
  if (typeof window === 'undefined') return;

  const nextItem: SavedTalabResult = {
    id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    savedAt: new Date().toISOString(),
    reference: cleanNoorUiText(context.reference),
    surface: context.surface,
    mode: result.mode,
    outputLanguage: result.outputLanguage,
    writingStyle: result.writingStyle,
    text: result.text,
    sourcesUsed: result.sourcesUsed.map(cleanNoorUiText)
  };

  const next = [nextItem, ...readSavedResults()].slice(0, TALAB_RESULTS_LIMIT);
  window.localStorage.setItem(TALAB_RESULTS_STORAGE_KEY, JSON.stringify(next));
}

export function AiSourceAssistant({ context, compact = false, variant = 'tafseer' }: AiSourceAssistantProps) {
  const { preferences } = usePlatformPreferences();
  const [languageSelection, setLanguageSelection] = useState<LanguageSelection>('settings');
  const [styleSelection, setStyleSelection] = useState<StyleSelection>('settings');
  const [activeMode, setActiveMode] = useState<AiActionMode | null>(null);
  const [result, setResult] = useState<AiReflectionResponse | null>(null);
  const [error, setError] = useState('');
  const [resultActionStatus, setResultActionStatus] = useState<ResultActionStatus>('');

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

  const resultExportText = useMemo(() => {
    if (!result) return '';
    return buildResultExportText({ context, result });
  }, [context, result]);

  function setTimedResultActionStatus(status: ResultActionStatus) {
    setResultActionStatus(status);
    window.setTimeout(() => setResultActionStatus(''), 1600);
  }

  async function generate(mode: AiActionMode) {
    setActiveMode(mode);
    setError('');
    setResult(null);
    setResultActionStatus('');

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

  async function handleCopyResult() {
    if (!resultExportText) return;

    try {
      const copied = await copyText(resultExportText);
      if (!copied) throw new Error('Copy unavailable.');
      setTimedResultActionStatus('copied');
    } catch {
      setError('Copy failed. Please select and copy manually.');
    }
  }

  function handleSaveResult() {
    if (!result) return;

    try {
      saveTalabResult(context, result);
      setTimedResultActionStatus('saved');
    } catch {
      setError('Save failed on this device.');
    }
  }

  function handleClearResult() {
    setResult(null);
    setError('');
    setTimedResultActionStatus('cleared');
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
            Generate reflection, Ishraq notes, or a lesson plan from the selected Quran, tafseer, and supplied related sources only.
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
      {resultActionStatus ? (
        <p className={styles.copyStatus}>
          {resultActionStatus === 'copied'
            ? 'Talab result copied.'
            : resultActionStatus === 'saved'
              ? 'Talab result saved locally.'
              : 'Talab result cleared.'}
        </p>
      ) : null}

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

          <div className={styles.resultActions} aria-label="Talab result actions">
            <button type="button" onClick={handleCopyResult}>
              Copy Talab result
            </button>
            <button type="button" onClick={handleSaveResult}>
              Save locally
            </button>
            <button type="button" onClick={handleClearResult}>
              Clear
            </button>
          </div>

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
