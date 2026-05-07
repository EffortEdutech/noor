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

export function TalabSavedResultsPanel({ limit }: { limit?: number }) {
  const [items, setItems] = useState<TalabSavedResult[]>([]);
  const [status, setStatus] = useState('');

  function refresh() {
    setItems(readTalabResults());
  }

  function setTimedStatus(nextStatus: string) {
    setStatus(nextStatus);
    window.setTimeout(() => setStatus(''), 1800);
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

  const visibleItems = useMemo(
    () => (typeof limit === 'number' ? items.slice(0, limit) : items),
    [items, limit]
  );

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

  return (
    <NoorCard className="noor-talab-results-panel">
      <div className="noor-row">
        <div>
          <span className="noor-badge emerald">Talab an-Noor</span>
          <h2>Saved Talab notes</h2>
        </div>
        <span className="noor-reference">{items.length} saved</span>
      </div>

      <p className="noor-subtitle">
        Reflections, Ishraq notes, and lessons saved in this browser from Quran and Tafseer study.
      </p>

      {status ? <p className="noor-copy-status" role="status" aria-live="polite">{status}</p> : null}

      {visibleItems.length === 0 ? (
        <p className="noor-subtitle">
          No Talab note saved yet. Generate a reflection, Ishraq note, or lesson, then choose Save in browser.
        </p>
      ) : (
        <div className="noor-reflection-note-list">
          {visibleItems.map((item) => (
            <article key={item.id} className="noor-reflection-note-item">
              <div className="noor-row">
                <span className="noor-badge gold">{getModeLabel(item.mode)}</span>
                <span className="noor-muted noor-small">{formatRelativeNoorDate(item.savedAt)}</span>
              </div>

              <strong>{item.reference}</strong>
              <small>
                {item.outputLanguage} | {getAiWritingStyleLabel(item.writingStyle)} | {item.surface}
              </small>
              <p>{item.text.length > 420 ? `${item.text.slice(0, 420).trim()}...` : item.text}</p>

              <details className="noor-source-details">
                <summary>Sources used</summary>
                <ul>
                  {item.sourcesUsed.map((source) => (
                    <li key={source}>{source}</li>
                  ))}
                </ul>
              </details>

              <div className="noor-card-actions">
                <button className="noor-button secondary" type="button" onClick={() => handleCopy(item)}>
                  Copy
                </button>
                <button className="noor-button secondary" type="button" onClick={() => handleDownload(item)}>
                  Download .txt
                </button>
                {item.sourceHref ? (
                  <a className="noor-button secondary" href={item.sourceHref}>
                    Reopen source
                  </a>
                ) : null}
                <button className="noor-button secondary" type="button" onClick={() => handleRemove(item.id)}>
                  Remove
                </button>
              </div>
            </article>
          ))}
        </div>
      )}

      {items.length > 0 ? (
        <div className="noor-card-actions">
          <button className="noor-button secondary" type="button" onClick={handleClearAll}>
            Clear saved Talab notes
          </button>
        </div>
      ) : null}
    </NoorCard>
  );
}
