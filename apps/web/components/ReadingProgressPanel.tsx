'use client';

import { NoorCard } from '@noor/ui';
import { formatRelativeNoorDate } from '../lib/local-store';
import { useReadingProgress } from '../lib/use-reading-progress';

export function ReadingProgressPanel() {
  const { progress, stats, history } = useReadingProgress();

  return (
    <NoorCard>
      <div className="noor-row">
        <div>
          <span className="noor-kicker">Your light</span>
          <h2 style={{ margin: '8px 0 0' }}>Local progress</h2>
        </div>
        <span className="noor-badge gold">Saved on this device</span>
      </div>

      <div className="noor-mini-grid" style={{ marginTop: 14 }}>
        <div className="noor-stat">
          <strong>{stats.bookmarkCount}</strong>
          <span>Bookmarks</span>
        </div>
        <div className="noor-stat">
          <strong>{stats.readingSessions}</strong>
          <span>Reading points</span>
        </div>
        <div className="noor-stat">
          <strong>{progress ? progress.key : '—'}</strong>
          <span>{progress ? formatRelativeNoorDate(progress.updatedAt) : 'No reading yet'}</span>
        </div>
      </div>

      {history.length > 0 ? (
        <div className="noor-divider" />
      ) : null}

      {history.slice(0, 3).map((item) => (
        <a key={item.sessionId} href={item.href} className="noor-history-item">
          <span>
            <strong>{item.title}</strong>
            <small>{item.subtitle ?? item.key}</small>
          </span>
          <small>{formatRelativeNoorDate(item.updatedAt)}</small>
        </a>
      ))}
    </NoorCard>
  );
}
