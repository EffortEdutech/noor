'use client';

import type { JourneySummary } from '@noor/content';
import { NoorCard } from '@noor/ui';
import { formatRelativeNoorDate, getJourneyCompletionPercent } from '../lib/local-store';
import { useJourneyProgress } from '../lib/use-journey-progress';

export function ContinueJourneyCard({ fallbackJourney }: { fallbackJourney: JourneySummary }) {
  const { progressItems } = useJourneyProgress();
  const latest = progressItems[0];

  if (latest) {
    const percent = getJourneyCompletionPercent(latest);

    return (
      <NoorCard variant="gold" className="noor-link-card">
        <div className="noor-row">
          <span className="noor-badge emerald">Continue Journey</span>
          <span className="noor-reference">{percent}% complete</span>
        </div>
        <div>
          <h2 style={{ margin: '0 0 6px' }}>{latest.journeyTitle}</h2>
          <p className="noor-subtitle">
            {latest.completedStepIds.length}/{latest.totalSteps} steps completed · {formatRelativeNoorDate(latest.updatedAt)}
          </p>
        </div>
        <a className="noor-button" href={latest.href}>Resume journey</a>
      </NoorCard>
    );
  }

  return (
    <NoorCard variant="gold" className="noor-link-card">
      <div className="noor-row">
        <span className="noor-badge emerald">Guided Journey</span>
        <span className="noor-reference">{fallbackJourney.estimatedMinutes} min</span>
      </div>
      <div>
        <h2 style={{ margin: '0 0 6px' }}>{fallbackJourney.title}</h2>
        <p className="noor-subtitle">{fallbackJourney.subtitle}</p>
      </div>
      <a className="noor-button" href={`/journeys/${fallbackJourney.slug}`}>Start journey</a>
    </NoorCard>
  );
}
