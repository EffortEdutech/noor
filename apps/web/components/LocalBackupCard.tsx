'use client';

import { NoorCard } from '@noor/ui';
import { useEffect, useMemo, useState } from 'react';
import { NOOR_APP_VERSION } from '../lib/app-version';
import {
  clearNoorLocalData,
  createNoorLocalBackup,
  downloadTextFile,
  importNoorLocalBackup,
  makeNoorBackupFilename,
  readNoorBackupSummary,
  stringifyNoorLocalBackup,
  type NoorLocalBackupSummary
} from '../lib/local-backup';

type BackupMessage = {
  tone: 'ok' | 'warn';
  text: string;
};

const emptySummary: NoorLocalBackupSummary = {
  keysPresent: 0,
  approxBytes: 0,
  bookmarkCount: 0,
  readingHistoryCount: 0,
  journeyCount: 0,
  recentSearchCount: 0,
  hasReaderPreferences: false
};

function formatBytes(value: number) {
  if (value < 1024) return `${value} B`;
  return `${(value / 1024).toFixed(1)} KB`;
}

export function LocalBackupCard() {
  const [summary, setSummary] = useState<NoorLocalBackupSummary>(emptySummary);
  const [message, setMessage] = useState<BackupMessage | null>(null);

  const refresh = () => setSummary(readNoorBackupSummary());

  useEffect(() => {
    refresh();
  }, []);

  const backupText = useMemo(
    () => stringifyNoorLocalBackup(createNoorLocalBackup(NOOR_APP_VERSION)),
    [summary]
  );

  function handleDownloadBackup() {
    downloadTextFile(makeNoorBackupFilename(), backupText);
    setMessage({ tone: 'ok', text: 'Backup downloaded as JSON.' });
    refresh();
  }

  async function handleCopyBackup() {
    try {
      await navigator.clipboard.writeText(backupText);
      setMessage({ tone: 'ok', text: 'Backup JSON copied to clipboard.' });
    } catch {
      setMessage({ tone: 'warn', text: 'Clipboard access was blocked. Use Download backup instead.' });
    }
  }

  async function handleImportFile(file?: File) {
    if (!file) return;

    try {
      const raw = await file.text();
      const result = importNoorLocalBackup(raw);
      refresh();
      setMessage({
        tone: 'ok',
        text: `Imported ${result.importedKeys} local data section${result.importedKeys === 1 ? '' : 's'}. Refreshing page...`
      });
      window.setTimeout(() => window.location.reload(), 650);
    } catch (error) {
      setMessage({
        tone: 'warn',
        text: error instanceof Error ? error.message : 'Could not import this backup file.'
      });
    }
  }

  function handleClearLocalData() {
    const confirmed = window.confirm(
      'Clear NOOR local bookmarks, reading progress, journey progress, reader preferences and recent searches from this browser?'
    );
    if (!confirmed) return;

    const removed = clearNoorLocalData();
    refresh();
    setMessage({ tone: 'ok', text: `Cleared ${removed} local data section${removed === 1 ? '' : 's'}. Refreshing page...` });
    window.setTimeout(() => window.location.reload(), 650);
  }

  return (
    <NoorCard>
      <div className="noor-row">
        <div>
          <span className="noor-badge gold">Local data</span>
          <h2>Backup & restore</h2>
          <p className="noor-subtitle">
            Export this browser&apos;s NOOR bookmarks, reading progress, journey progress, reader preferences
            and recent searches before clearing cache or moving device.
          </p>
        </div>
        <span className="noor-badge emerald">{summary.keysPresent} saved section{summary.keysPresent === 1 ? '' : 's'}</span>
      </div>

      <div className="noor-mini-grid" style={{ marginTop: 16 }}>
        <div className="noor-stat">
          <strong>{summary.bookmarkCount}</strong>
          <span>Bookmarks</span>
        </div>
        <div className="noor-stat">
          <strong>{summary.readingHistoryCount}</strong>
          <span>Reading history items</span>
        </div>
        <div className="noor-stat">
          <strong>{summary.journeyCount}</strong>
          <span>Journeys started</span>
        </div>
        <div className="noor-stat">
          <strong>{summary.recentSearchCount}</strong>
          <span>Recent searches</span>
        </div>
      </div>

      <div className="noor-divider" />

      <div className="noor-row" style={{ justifyContent: 'flex-start' }}>
        <button className="noor-button" type="button" onClick={handleDownloadBackup}>
          Download backup
        </button>
        <button className="noor-button secondary" type="button" onClick={handleCopyBackup}>
          Copy JSON
        </button>
        <label className="noor-button secondary" style={{ cursor: 'pointer' }}>
          Import backup
          <input
            type="file"
            accept="application/json,.json"
            style={{ display: 'none' }}
            onChange={(event) => {
              void handleImportFile(event.target.files?.[0]);
              event.currentTarget.value = '';
            }}
          />
        </label>
        <button className="noor-button secondary" type="button" onClick={handleClearLocalData}>
          Clear local data
        </button>
      </div>

      <p className="noor-subtitle noor-small" style={{ marginTop: 12 }}>
        Approx backup size: {formatBytes(summary.approxBytes)} · Reader preferences:{' '}
        {summary.hasReaderPreferences ? 'saved' : 'default'} · Format: noor.local-backup.v1
      </p>

      {message ? (
        <p className={`noor-badge ${message.tone === 'ok' ? 'emerald' : 'gold'}`} style={{ marginTop: 12 }}>
          {message.text}
        </p>
      ) : null}
    </NoorCard>
  );
}
