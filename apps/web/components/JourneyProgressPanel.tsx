'use client';

import { NoorCard } from '@noor/ui';
import { formatRelativeNoorDate, getJourneyCompletionPercent } from '../lib/local-store';
import { useJourneyProgress } from '../lib/use-journey-progress';

export function JourneyProgressPanel() {
  const { progressItems } = useJourneyProgress();

  if (progressItems.length === 0) {
    return (
      <NoorCard>
        <div className="noor-row">
          <div>
            <span className="noor-kicker">Journeys</span>
            <h2 style={{ margin: '8px 0 0' }}>No journey progress yet</h2>
          </div>
          <span className="noor-badge gold">Sprint 5</span>
        </div>
        <p className="noor-subtitle" style={{ marginTop: 12 }}>
          Start a guided journey and your completed steps will appear here.
        </p>
        <a className="noor-button" href="/journeys" style={{ marginTop: 14 }}>
          Open Journeys
        </a>
      </NoorCard>
    );
  }

  return (
    <NoorCard>
      <div className="noor-row">
        <div>
          <span className="noor-kicker">Journeys</span>
          <h2 style={{ margin: '8px 0 0' }}>Guided path progress</h2>
        </div>
        <span className="noor-badge gold">{progressItems.length} active</span>
      </div>

      <div className="noor-divider" />

      <div className="noor-stack">
        {progressItems.map((item) => {
          const percent = getJourneyCompletionPercent(item);
          return (
            <a key={item.journeyId} href={item.href} className="noor-history-item">
              <span>
                <strong>{item.journeyTitle}</strong>
                <small>
                  {item.completedStepIds.length}/{item.totalSteps} steps · {percent}% complete
                </small>
              </span>
              <small>{formatRelativeNoorDate(item.updatedAt)}</small>
            </a>
          );
        })}
      </div>
    </NoorCard>
  );
}
