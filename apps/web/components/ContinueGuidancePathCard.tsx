'use client';

import { NoorCard } from '@noor/ui';
import { useEffect, useState } from 'react';
import {
  formatRelativeNoorDate,
  getGuidancePathCompletionPercent,
  getLatestGuidancePath,
  NOOR_GUIDANCE_PATHS_EVENT,
  type GuidancePathProgress
} from '../lib/local-store';

export function ContinueGuidancePathCard() {
  const [latest, setLatest] = useState<GuidancePathProgress | null>(null);

  function refresh() {
    setLatest(getLatestGuidancePath());
  }

  useEffect(() => {
    refresh();
    window.addEventListener(NOOR_GUIDANCE_PATHS_EVENT, refresh);
    return () => window.removeEventListener(NOOR_GUIDANCE_PATHS_EVENT, refresh);
  }, []);

  if (!latest) {
    return (
      <NoorCard variant="gold" className="noor-link-card noor-continue-guidance-card">
        <div className="noor-row">
          <span className="noor-badge emerald">Continue Guidance</span>
          <span className="noor-reference">New</span>
        </div>
        <h2 style={{ margin: 0 }}>Choose a guidance topic</h2>
        <p className="noor-subtitle">
          Start from what your heart needs today, then move through Quran, tafseer, Hadith and a saved response.
        </p>
        <a className="noor-button" href="/explore">Open Explore</a>
      </NoorCard>
    );
  }

  const percent = getGuidancePathCompletionPercent(latest);

  return (
    <NoorCard variant="gold" className="noor-link-card noor-continue-guidance-card">
      <div className="noor-row">
        <span className="noor-badge emerald">Continue Guidance</span>
        <span className="noor-reference">{percent}% complete</span>
      </div>
      <div>
        <h2 style={{ margin: '0 0 6px' }}>{latest.topicLabel}</h2>
        <p className="noor-subtitle">
          {latest.completedStepIds.length}/{latest.totalSteps} steps completed · {formatRelativeNoorDate(latest.updatedAt)}
        </p>
      </div>
      {latest.lastReflection ? <p className="noor-muted noor-small">Last reflection: {latest.lastReflection}</p> : null}
      <a className="noor-button" href={latest.href}>Resume path</a>
    </NoorCard>
  );
}
