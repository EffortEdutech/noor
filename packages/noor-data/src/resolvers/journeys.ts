import { DEMO_JOURNEYS, type Journey, type JourneySummary } from '@noor/content';

function toSummary(journey: Journey): JourneySummary {
  const { steps, ...summary } = journey;
  return {
    ...summary,
    stepCount: steps.length,
    estimatedMinutes: steps.reduce((total, step) => total + step.minutes, 0)
  };
}

export async function getJourneyIndex(): Promise<JourneySummary[]> {
  return DEMO_JOURNEYS.map(toSummary);
}

export async function getJourneyContent(slug: string): Promise<Journey | null> {
  const journey = DEMO_JOURNEYS.find((item) => item.slug === slug || item.id === slug);
  if (!journey) return null;

  return {
    ...journey,
    stepCount: journey.steps.length,
    estimatedMinutes: journey.steps.reduce((total, step) => total + step.minutes, 0)
  };
}

export async function getFeaturedJourney(): Promise<JourneySummary> {
  return toSummary(DEMO_JOURNEYS[0]);
}
