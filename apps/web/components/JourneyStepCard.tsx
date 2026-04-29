'use client';

import type { Journey, JourneyStep } from '@noor/content';
import { NoorCard } from '@noor/ui';
import { useJourneyProgress } from '../lib/use-journey-progress';

function contentTypeLabel(type: JourneyStep['contentType']) {
  const labels: Record<JourneyStep['contentType'], string> = {
    ayah: 'Quran',
    hadith: 'Hadith',
    tafseer: 'Tafseer',
    reflection: 'Reflection',
    action: 'Action'
  };
  return labels[type];
}

export function JourneyStepCard({
  journey,
  step,
  index
}: {
  journey: Journey;
  step: JourneyStep;
  index: number;
}) {
  const { isStepComplete, toggleStep } = useJourneyProgress();
  const completed = isStepComplete(journey.id, step.id);

  return (
    <NoorCard variant={completed ? 'gold' : undefined}>
      <div className="noor-row">
        <div className="noor-row" style={{ justifyContent: 'flex-start' }}>
          <span className="noor-badge emerald">Step {index + 1}</span>
          <span className="noor-badge">{contentTypeLabel(step.contentType)}</span>
        </div>
        <span className="noor-reference">{step.minutes} min</span>
      </div>

      <div style={{ marginTop: 12 }}>
        <h2 style={{ margin: '0 0 8px' }}>{step.title}</h2>
        <p className="noor-subtitle">{step.body}</p>
      </div>

      {step.reference ? (
        <p className="noor-reference" style={{ margin: '14px 0 0' }}>
          {step.reference}
        </p>
      ) : null}

      {step.prompt ? (
        <div className="noor-card is-soft" style={{ marginTop: 14 }}>
          <span className="noor-badge gold">Reflection prompt</span>
          <p className="noor-subtitle" style={{ marginTop: 10 }}>{step.prompt}</p>
        </div>
      ) : null}

      <div className="noor-row" style={{ justifyContent: 'flex-start', gap: 6, marginTop: 14 }}>
        {step.tags.slice(0, 4).map((tag) => (
          <span className="noor-badge" key={`${step.id}-${tag}`}>
            #{tag}
          </span>
        ))}
      </div>

      <div className="noor-row" style={{ marginTop: 14 }}>
        <button
          className={completed ? 'noor-button' : 'noor-button secondary'}
          type="button"
          onClick={() =>
            toggleStep({
              journeyId: journey.id,
              journeyTitle: journey.title,
              href: `/journeys/${journey.slug}`,
              stepId: step.id,
              stepIds: journey.steps.map((item) => item.id),
              totalSteps: journey.steps.length
            })
          }
        >
          {completed ? 'Completed ✓' : 'Mark complete'}
        </button>

        {step.href ? (
          <a className="noor-button secondary" href={step.href}>
            Open reference
          </a>
        ) : null}
      </div>
    </NoorCard>
  );
}
