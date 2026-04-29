'use client';

import { NoorCard } from '@noor/ui';
import { formatRelativeNoorDate } from '../lib/local-store';
import { useReadingProgress } from '../lib/use-reading-progress';

export function ContinueReadingCard() {
  const { progress, lastReadLabel } = useReadingProgress();

  if (!progress) {
    return (
      <NoorCard variant="gold" className="noor-link-card">
        <div className="noor-row">
          <span className="noor-badge emerald">Continue Reading</span>
          <span className="noor-reference">Local-first</span>
        </div>
        <h2 style={{ margin: 0 }}>Begin your NOOR journey</h2>
        <p className="noor-subtitle">
          Open the Quran reader and mark an ayah as your current reading point. NOOR will remember it on this device.
        </p>
        <a className="noor-button" href="/learn/quran/1">Start with Al-Fatihah</a>
      </NoorCard>
    );
  }

  return (
    <NoorCard variant="gold" className="noor-link-card">
      <div className="noor-row">
        <span className="noor-badge emerald">Continue Reading</span>
        <span className="noor-reference">{lastReadLabel}</span>
      </div>
      <div>
        <h2 style={{ margin: '0 0 6px' }}>{progress.title}</h2>
        <p className="noor-subtitle">{progress.subtitle ?? progress.key}</p>
      </div>
      <div className="noor-card-actions">
        <a className="noor-button" href={progress.href}>Resume</a>
        <span className="noor-muted noor-small">Last saved: {formatRelativeNoorDate(progress.updatedAt)}</span>
      </div>
    </NoorCard>
  );
}
