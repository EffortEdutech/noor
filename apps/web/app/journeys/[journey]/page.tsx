import { getJourneyContent, getJourneyIndex } from '@noor/data';
import { NoorCard, PageHeader } from '@noor/ui';
import { notFound } from 'next/navigation';
import { JourneyProgressSummary } from '../../../components/JourneyProgressSummary';
import { JourneyStepCard } from '../../../components/JourneyStepCard';

export async function generateStaticParams() {
  const journeys = await getJourneyIndex();
  return journeys.map((journey) => ({ journey: journey.slug }));
}

export default async function JourneyDetailPage({ params }: { params: Promise<{ journey: string }> }) {
  const { journey: journeyParam } = await params;
  const journey = await getJourneyContent(journeyParam);

  if (!journey) notFound();

  return (
    <main className="noor-page">
      <PageHeader
        kicker={`${journey.icon} ${journey.theme}`}
        title={journey.title}
        subtitle={journey.description}
      />

      <JourneyProgressSummary journey={journey} />

      <NoorCard variant="soft">
        <div className="noor-row">
          <span className="noor-badge gold">{journey.difficulty}</span>
          <span className="noor-reference">{journey.stepCount} steps · {journey.estimatedMinutes} min</span>
        </div>
        <div className="noor-row" style={{ justifyContent: 'flex-start', gap: 6, marginTop: 14 }}>
          {journey.tags.map((tag) => (
            <span className="noor-badge" key={`${journey.id}-${tag}`}>
              #{tag}
            </span>
          ))}
        </div>
      </NoorCard>

      <section className="noor-stack">
        {journey.steps.map((step, index) => (
          <JourneyStepCard key={step.id} journey={journey} step={step} index={index} />
        ))}
      </section>

      <NoorCard>
        <div className="noor-row">
          <div>
            <span className="noor-kicker">After this journey</span>
            <h2 style={{ margin: '8px 0 0' }}>Save one reminder</h2>
          </div>
          <span className="noor-badge emerald">Library</span>
        </div>
        <p className="noor-subtitle" style={{ marginTop: 12 }}>
          The best next step is to save one ayah or hadith into your Library and return to it later.
        </p>
        <a className="noor-button" href="/library" style={{ marginTop: 14 }}>
          Open Library
        </a>
      </NoorCard>
    </main>
  );
}
