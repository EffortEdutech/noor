'use client';

import type { JourneySummary } from '@noor/content';
import { NoorCard } from '@noor/ui';
import { formatRelativeNoorDate } from '../lib/local-store';
import { useJourneyProgress } from '../lib/use-journey-progress';

function ProgressBar({ percent }: { percent: number }) {
  return (
    <div
      aria-label={`Journey progress ${percent}%`}
      style={{
        height: 8,
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

export function JourneyList({ journeys }: { journeys: JourneySummary[] }) {
  const { getJourneyProgress, getJourneyPercent } = useJourneyProgress();

  return (
    <section className="noor-grid">
      {journeys.map((journey) => {
        const progress = getJourneyProgress(journey.id);
        const percent = getJourneyPercent(journey.id);

        return (
          <a key={journey.id} href={`/journeys/${journey.slug}`}>
            <NoorCard className="noor-link-card">
              <div className="noor-row">
                <span className="noor-badge gold">
                  {journey.icon} {journey.difficulty}
                </span>
                <span className="noor-reference">{journey.estimatedMinutes} min</span>
              </div>

              <div>
                <h2 style={{ margin: '0 0 8px' }}>{journey.title}</h2>
                <p className="noor-subtitle">{journey.subtitle}</p>
              </div>

              <div className="noor-row" style={{ justifyContent: 'flex-start', gap: 6 }}>
                {journey.tags.slice(0, 4).map((tag) => (
                  <span className="noor-badge" key={`${journey.id}-${tag}`}>
                    #{tag}
                  </span>
                ))}
              </div>

              <ProgressBar percent={percent} />

              <div className="noor-row">
                <span className="noor-muted noor-small">
                  {progress
                    ? `${progress.completedStepIds.length}/${journey.stepCount} steps · ${formatRelativeNoorDate(progress.updatedAt)}`
                    : `${journey.stepCount} guided steps`}
                </span>
                <span className="noor-button secondary">{progress ? 'Continue' : 'Start'}</span>
              </div>
            </NoorCard>
          </a>
        );
      })}
    </section>
  );
}
