'use client';

import type { Journey } from '@noor/content';
import { NoorCard } from '@noor/ui';
import { formatRelativeNoorDate } from '../lib/local-store';
import { useJourneyProgress } from '../lib/use-journey-progress';

function ProgressBar({ percent }: { percent: number }) {
  return (
    <div
      style={{
        height: 10,
        borderRadius: 999,
        overflow: 'hidden',
        background: 'rgba(255,255,255,0.08)',
        border: '1px solid var(--noor-line)'
      }}
    >
      <span
        style={{
          display: 'block',
          height: '100%',
          width: `${percent}%`,
          borderRadius: 999,
          background: 'linear-gradient(135deg, var(--noor-gold), var(--noor-emerald))'
        }}
      />
    </div>
  );
}

export function JourneyProgressSummary({ journey }: { journey: Journey }) {
  const { getJourneyProgress, getJourneyPercent, resetJourney } = useJourneyProgress();
  const progress = getJourneyProgress(journey.id);
  const percent = getJourneyPercent(journey.id);

  return (
    <NoorCard variant="gold">
      <div className="noor-row">
        <div>
          <span className="noor-kicker">Journey progress</span>
          <h2 style={{ margin: '8px 0 0' }}>
            {progress ? `${progress.completedStepIds.length}/${journey.steps.length} steps complete` : 'Not started yet'}
          </h2>
        </div>
        <span className="noor-badge emerald">{percent}%</span>
      </div>

      <div style={{ marginTop: 14 }}>
        <ProgressBar percent={percent} />
      </div>

      <div className="noor-row" style={{ marginTop: 14 }}>
        <span className="noor-muted noor-small">
          {progress ? `Last updated ${formatRelativeNoorDate(progress.updatedAt)}` : 'Mark one step complete to begin.'}
        </span>

        {progress ? (
          <button className="noor-button secondary" type="button" onClick={() => resetJourney(journey.id)}>
            Reset journey
          </button>
        ) : null}
      </div>
    </NoorCard>
  );
}
