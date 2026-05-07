'use client';

import { NoorCard } from '@noor/ui';
import { useEffect, useMemo, useState } from 'react';
import { getAiWritingStyleLabel } from '../lib/ai/types';
import { formatRelativeNoorDate } from '../lib/local-store';
import {
  clearTalabResults,
  deleteTalabResult,
  downloadTalabTextFile,
  NOOR_TALAB_RESULTS_EVENT,
  readTalabResults,
  slugifyTalabFilePart,
  type TalabSavedResult
} from '../lib/talab-store';
import styles from './TalabSavedResultsPanel.module.css';

type ModeFilter = 'all' | TalabSavedResult['mode'];
type SurfaceFilter = 'all' | TalabSavedResult['surface'];

function getModeLabel(mode: TalabSavedResult['mode']) {
  if (mode === 'reflection') return 'Reflection';
  if (mode === 'teaching-notes') return 'Ishraq notes';
  return 'Lesson';
}

function buildSavedResultText(item: TalabSavedResult) {
  return [
    'Talab an-Noor',
    '',
    `Action: ${getModeLabel(item.mode)}`,
    `Reference: ${item.reference}`,
    `Surface: ${item.surface}`,
    `Language: ${item.outputLanguage}`,
    `Writing style: ${getAiWritingStyleLabel(item.writingStyle)}`,
    `Saved: ${item.savedAt}`,
    '',
    'Saved note:',
    item.text,
    '',
    'Sources used:',
    ...(item.sourcesUsed.length ? item.sourcesUsed.map((source) => `- ${source}`) : ['- No source list returned.']),
    '',
    'Governance reminder:',
    'This is AI-assisted reflection or teaching preparation from supplied NOOR context. It is not tafseer, not fatwa, and not a substitute for qualified scholarship.'
  ].join('\n');
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

function itemMatchesSearch(item: TalabSavedResult, query: string) {
  const normalized = query.trim().toLowerCase();
  if (!normalized) return true;

  return [
    item.reference,
    item.outputLanguage,
    item.surface,
    getModeLabel(item.mode),
    getAiWritingStyleLabel(item.writingStyle),
    item.text,
    ...item.sourcesUsed
  ].some((value) => value.toLowerCase().includes(normalized));
}

export function TalabSavedResultsPanel({ limit }: { limit?: number }) {
  const [items, setItems] = useState<TalabSavedResult[]>([]);
  const [status, setStatus] = useState('');
  const [query, setQuery] = useState('');
  const [modeFilter, setModeFilter] = useState<ModeFilter>('all');
  const [surfaceFilter, setSurfaceFilter] = useState<SurfaceFilter>('all');

  function refresh() {
    setItems(readTalabResults());
  }

  function setTimedStatus(nextStatus: string) {
    setStatus(nextStatus);
    window.setTimeout(() => setStatus(''), 2200);
  }

  useEffect(() => {
    refresh();

    function onStorage(event: StorageEvent) {
      if (event.key === 'noor.talab.results.v1') refresh();
    }

    window.addEventListener(NOOR_TALAB_RESULTS_EVENT, refresh);
    window.addEventListener('storage', onStorage);

    return () => {
      window.removeEventListener(NOOR_TALAB_RESULTS_EVENT, refresh);
      window.removeEventListener('storage', onStorage);
    };
  }, []);

  const filteredItems = useMemo(() => {
    return items.filter((item) => {
      if (modeFilter !== 'all' && item.mode !== modeFilter) return false;
      if (surfaceFilter !== 'all' && item.surface !== surfaceFilter) return false;
      return itemMatchesSearch(item, query);
    });
  }, [items, modeFilter, query, surfaceFilter]);

  const visibleItems = useMemo(
    () => (typeof limit === 'number' ? filteredItems.slice(0, limit) : filteredItems),
    [filteredItems, limit]
  );

  const latestSaved = items[0];

  async function handleCopy(item: TalabSavedResult) {
    const copied = await copyText(buildSavedResultText(item));
    setTimedStatus(copied ? 'Talab note copied.' : 'Copy unavailable.');
  }

  function handleDownload(item: TalabSavedResult) {
    const filename = [
      'talab-an-noor',
      slugifyTalabFilePart(item.reference),
      item.mode,
      item.savedAt.slice(0, 10)
    ].join('-') + '.txt';

    const downloaded = downloadTalabTextFile(filename, buildSavedResultText(item));
    setTimedStatus(downloaded ? 'Download started.' : 'Download unavailable.');
  }

  function handleRemove(id: string) {
    deleteTalabResult(id);
    refresh();
    setTimedStatus('Saved Talab note removed.');
  }

  function handleClearAll() {
    clearTalabResults();
    refresh();
    setTimedStatus('Saved Talab library cleared.');
  }

  function handleResetFilters() {
    setQuery('');
    setModeFilter('all');
    setSurfaceFilter('all');
  }

  return (
    <NoorCard className={styles.card}>
      <div className={styles.header}>
        <div>
          <span className="noor-badge emerald">Talab an-Noor</span>
          <h2>Saved Talab notes</h2>
          <p>
            Reflections, Ishraq notes, and lessons saved in this browser from Quran and Tafseer study.
          </p>
        </div>
        <div className={styles.countBadge}>
          <strong>{items.length}</strong>
          <span>saved</span>
        </div>
      </div>

      {latestSaved ? (
        <div className={styles.latest}>
          <span>Latest saved</span>
          <strong>{latestSaved.reference}</strong>
          <small>{getModeLabel(latestSaved.mode)} | {formatRelativeNoorDate(latestSaved.savedAt)}</small>
        </div>
      ) : null}

      <div className={styles.filters} aria-label="Saved Talab note filters">
        <label>
          <span>Search</span>
          <input
            type="search"
            value={query}
            placeholder="Search reference, note, source..."
            onChange={(event) => setQuery(event.target.value)}
          />
        </label>

        <label>
          <span>Type</span>
          <select value={modeFilter} onChange={(event) => setModeFilter(event.target.value as ModeFilter)}>
            <option value="all">All types</option>
            <option value="reflection">Reflection</option>
            <option value="teaching-notes">Ishraq notes</option>
            <option value="lesson">Lesson</option>
          </select>
        </label>

        <label>
          <span>Source</span>
          <select value={surfaceFilter} onChange={(event) => setSurfaceFilter(event.target.value as SurfaceFilter)}>
            <option value="all">Quran and Tafseer</option>
            <option value="quran">Quran Reader</option>
            <option value="tafseer">Tafseer</option>
          </select>
        </label>

        <button type="button" onClick={handleResetFilters}>
          Reset
        </button>
      </div>

      <div className={styles.resultSummary}>
        Showing {visibleItems.length} of {filteredItems.length} matched notes.
      </div>

      {status ? <p className={styles.status} role="status" aria-live="polite">{status}</p> : null}

      {items.length === 0 ? (
        <div className={styles.empty}>
          <strong>No Talab note saved yet.</strong>
          <p>Generate a reflection, Ishraq note, or lesson, then choose Save in browser. Saved notes will appear here on this device.</p>
        </div>
      ) : visibleItems.length === 0 ? (
        <div className={styles.empty}>
          <strong>No saved Talab notes match these filters.</strong>
          <p>Try another search, or reset the filters.</p>
        </div>
      ) : (
        <div className={styles.list}>
          {visibleItems.map((item) => (
            <article key={item.id} className={styles.item}>
              <div className={styles.itemHead}>
                <div>
                  <span className={styles.modeBadge}>{getModeLabel(item.mode)}</span>
                  <strong>{item.reference}</strong>
                </div>
                <span>{formatRelativeNoorDate(item.savedAt)}</span>
              </div>

              <div className={styles.meta}>
                <span>{item.outputLanguage}</span>
                <span>{getAiWritingStyleLabel(item.writingStyle)}</span>
                <span>{item.surface === 'quran' ? 'Quran Reader' : 'Tafseer'}</span>
              </div>

              <p className={styles.preview}>{item.text.length > 520 ? `${item.text.slice(0, 520).trim()}...` : item.text}</p>

              <details className={styles.sources}>
                <summary>Sources used</summary>
                <ul>
                  {item.sourcesUsed.map((source) => (
                    <li key={source}>{source}</li>
                  ))}
                </ul>
              </details>

              <div className={styles.actions}>
                <button type="button" onClick={() => handleCopy(item)}>
                  Copy
                </button>
                <button type="button" onClick={() => handleDownload(item)}>
                  Download .txt
                </button>
                {item.sourceHref ? (
                  <a href={item.sourceHref}>
                    Reopen source
                  </a>
                ) : null}
                <button type="button" onClick={() => handleRemove(item.id)}>
                  Remove
                </button>
              </div>
            </article>
          ))}
        </div>
      )}

      {items.length > 0 ? (
        <div className={styles.footerActions}>
          <button type="button" onClick={handleClearAll}>
            Clear saved Talab notes
          </button>
        </div>
      ) : null}
    </NoorCard>
  );
}
