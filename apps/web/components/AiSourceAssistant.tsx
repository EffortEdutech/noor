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
import { downloadTalabTextFile, saveTalabResult, slugifyTalabFilePart } from '../lib/talab-store';
import styles from './AiSourceAssistant.module.css';

type AiSourceAssistantProps = {
  context: AiSourceContext;
  compact?: boolean;
  variant?: 'quran' | 'tafseer';
};

type LanguageSelection = 'settings' | NoorLanguageCode;
type StyleSelection = 'settings' | AiWritingStyle;
type ResultActionStatus = 'copied' | 'saved' | 'downloaded' | 'cleared' | '';

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

function buildResultExportText({ context, result }: { context: AiSourceContext; result: AiReflectionResponse }) {
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

function renderTranslationRows(context: AiSourceContext) {
  const translations = context.translations?.filter((item) => item.text.trim()) ?? [];

  if (!translations.length) return <p className={styles.emptySource}>No translation supplied for this passage.</p>;

  return translations.map((translation) => (
    <p key={`${translation.language}-${translation.text.slice(0, 18)}`} className={styles.translationRow}>
      <strong>{cleanNoorUiText(translation.language)}</strong>
      <span>{cleanNoorUiText(translation.text)}</span>
    </p>
  ));
}

function SourceDrawers({ context }: { context: AiSourceContext }) {
  return (
    <div className={styles.sourceDrawers} aria-label="Talab an-Noor source material">
      <details>
        <summary>Quran passage</summary>
        <p className={styles.arabicSource} lang="ar" dir="rtl">{context.arabic}</p>
      </details>

      <details>
        <summary>Meaning translation</summary>
        <div className={styles.translationList}>{renderTranslationRows(context)}</div>
      </details>

      <details open={context.surface === 'quran'}>
        <summary>Tafseer source sent to AI</summary>
        {context.tafseer ? (
          <article className={styles.tafseerSource}>
            <div className={styles.sourceMeta}>
              <strong>{cleanNoorUiText(context.tafseer.sourceLabel)}</strong>
              <span>{context.tafseer.reference ? cleanNoorUiText(context.tafseer.reference) : 'Selected passage'}</span>
              {context.tafseer.language ? <span>{cleanNoorUiText(context.tafseer.language)}</span> : null}
            </div>
            {context.tafseer.title ? <h4>{cleanNoorUiText(context.tafseer.title)}</h4> : null}
            <p>{cleanNoorUiText(context.tafseer.body)}</p>
          </article>
        ) : (
          <p className={styles.emptySource}>No tafseer source is supplied for this passage yet.</p>
        )}
      </details>
    </div>
  );
}

function getStatusMessage(status: ResultActionStatus) {
  if (status === 'copied') return 'Talab result copied.';
  if (status === 'saved') return 'Saved in browser. Open Library to view it.';
  if (status === 'downloaded') return 'Talab result download started.';
  if (status === 'cleared') return 'Talab result cleared.';
  return '';
}

export function AiSourceAssistant({ context, compact = false, variant = 'tafseer' }: AiSourceAssistantProps) {
  const { preferences } = usePlatformPreferences();
  const [languageSelection, setLanguageSelection] = useState<LanguageSelection>('settings');
  const [styleSelection, setStyleSelection] = useState<StyleSelection>('settings');
  const [activeMode, setActiveMode] = useState<AiActionMode | null>(null);
  const [result, setResult] = useState<AiReflectionResponse | null>(null);
  const [error, setError] = useState('');
  const [resultActionStatus, setResultActionStatus] = useState<ResultActionStatus>('');

  const outputLanguageCode = languageSelection === 'settings' ? preferences.aiOutputLanguage : languageSelection;
  const writingStyle = styleSelection === 'settings' ? preferences.aiWritingStyle : styleSelection;
  const outputLanguageLabel = getLanguageLabel(outputLanguageCode);
  const outputDirection = getLanguageDirection(outputLanguageCode);
  const sourcesGathered = useMemo(() => summarizeSourcesGathered(context), [context]);
  const contextSummary = useMemo(() => sourcesGathered.map(cleanNoorUiText).join(' | '), [sourcesGathered]);
  const resultExportText = useMemo(() => (result ? buildResultExportText({ context, result }) : ''), [context, result]);

  function setTimedResultActionStatus(status: ResultActionStatus) {
    setResultActionStatus(status);
    window.setTimeout(() => setResultActionStatus(''), 2600);
  }

  async function generate(mode: AiActionMode) {
    setActiveMode(mode);
    setError('');
    setResult(null);
    setResultActionStatus('');

    try {
      const response = await fetch('/api/ai/reflection', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mode, outputLanguage: outputLanguageLabel, writingStyle, context })
      });

      const data = (await response.json()) as AiReflectionResponse & { error?: string };
      if (!response.ok || !data.ok) throw new Error(data.error || data.warning || 'AI generation failed.');
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
      saveTalabResult({
        reference: cleanNoorUiText(context.reference),
        sourceHref: `${window.location.pathname}${window.location.search}${window.location.hash}`,
        surface: context.surface,
        mode: result.mode,
        outputLanguage: result.outputLanguage,
        writingStyle: result.writingStyle,
        text: result.text,
        sourcesUsed: result.sourcesUsed.map(cleanNoorUiText)
      });
      setTimedResultActionStatus('saved');
    } catch {
      setError('Save failed on this device.');
    }
  }

  function handleDownloadResult() {
    if (!resultExportText || !result) return;

    try {
      const filename = ['talab-an-noor', slugifyTalabFilePart(context.reference), result.mode, new Date().toISOString().slice(0, 10)].join('-') + '.txt';
      const downloaded = downloadTalabTextFile(filename, resultExportText);
      if (!downloaded) throw new Error('Download unavailable.');
      setTimedResultActionStatus('downloaded');
    } catch {
      setError('Download failed. Please copy the result manually.');
    }
  }

  function handleClearResult() {
    setResult(null);
    setError('');
    setTimedResultActionStatus('cleared');
  }

  return (
    <section className={`${styles.assistant} ${compact ? styles.compact : ''}`} aria-label="Talab an-Noor AI-assisted reflection and teaching preparation" data-variant={variant}>
      <div className={styles.header}>
        <div>
          <span>Talab an-Noor</span>
          <h3>{variant === 'quran' ? 'Study this ayah with source guidance' : 'Prepare from this tafseer'}</h3>
          <p>Generate reflection, Ishraq notes, or a lesson plan from the selected Quran, tafseer, and supplied related sources only.</p>
        </div>
        <div className={styles.selectGrid}>
          <label className={styles.languageSelect}>
            <span>Output language</span>
            <select value={languageSelection} onChange={(event) => setLanguageSelection(event.target.value as LanguageSelection)}>
              <option value="settings">Use Settings ({getLanguageLabel(preferences.aiOutputLanguage)})</option>
              {NOOR_LANGUAGE_OPTIONS.map((language) => <option value={language.code} key={language.code}>{language.label}</option>)}
            </select>
          </label>

          <label className={styles.languageSelect}>
            <span>Writing style</span>
            <select value={styleSelection} onChange={(event) => setStyleSelection(event.target.value as StyleSelection)}>
              <option value="settings">Use Settings ({getAiWritingStyleLabel(preferences.aiWritingStyle)})</option>
              {AI_WRITING_STYLE_OPTIONS.map((style) => <option value={style.id} key={style.id}>{style.label}</option>)}
            </select>
          </label>
        </div>
      </div>

      <div className={styles.sourcesGathered} aria-label="Sources gathered for AI">
        <strong>Sources gathered</strong>
        <p>{contextSummary}</p>
        {(context.relatedAyat?.length ?? 0) === 0 || (context.relatedHadith?.length ?? 0) === 0 ? <small>Missing related sources are labelled clearly. Talab an-Noor must not invent related ayat or hadith.</small> : null}
      </div>

      <SourceDrawers context={context} />

      <div className={styles.actions}>
        {AI_ACTIONS.map((action) => (
          <button key={action.mode} type="button" onClick={() => generate(action.mode)} disabled={Boolean(activeMode)} title={action.helper}>
            {activeMode === action.mode ? 'Generating...' : action.label}
          </button>
        ))}
      </div>

      {error ? <p className={styles.error}>{error}</p> : null}
      {resultActionStatus ? (
        <>
          <p className={styles.copyStatus} role="status" aria-live="polite">{getStatusMessage(resultActionStatus)}</p>
          <div className={styles.statusToast} role="status" aria-live="polite">
            <strong>{getStatusMessage(resultActionStatus)}</strong>
            {resultActionStatus === 'saved' ? <a href="/library">View in Library</a> : null}
          </div>
        </>
      ) : null}

      {result ? (
        <article className={styles.result} data-configured={result.configured ? 'true' : 'false'}>
          <div className={styles.resultHead}>
            <span>{getActionLabel(result.mode)}</span>
            <strong>{result.configured ? 'Generated' : 'Configuration needed'}</strong>
          </div>
          <p className={styles.resultMeta}>{result.outputLanguage} | {getAiWritingStyleLabel(result.writingStyle)}</p>
          {result.warning ? <p className={styles.warning}>{result.warning}</p> : null}
          <pre lang={outputLanguageCode} dir={outputDirection}>{result.text}</pre>

          <div className={styles.resultActions} aria-label="Talab result actions">
            <button type="button" onClick={handleCopyResult}>Copy Talab result</button>
            <button type="button" onClick={handleDownloadResult}>Download .txt</button>
            <button type="button" onClick={handleSaveResult}>Save in browser</button>
            <button type="button" onClick={handleClearResult}>Clear</button>
          </div>

          <details className={styles.sources}>
            <summary>Sources sent to AI</summary>
            <ul>{result.sourcesUsed.map((source) => <li key={source}>{cleanNoorUiText(source)}</li>)}</ul>
          </details>
        </article>
      ) : null}
    </section>
  );
}
