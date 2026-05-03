import Link from 'next/link';
import { notFound } from 'next/navigation';
import {
  getNoorGuidanceTopicJourney,
  getNoorSearchTypeLabel,
  NOOR_GUIDANCE_TOPIC_JOURNEYS,
  searchNoorLocal,
  type NoorSearchResult,
  type NoorSearchType
} from '@noor/search';
import { NoorCard, PageHeader } from '@noor/ui';

type GuidanceTopicPageProps = {
  params?: Promise<{
    topic?: string;
  }>;
};

const JOURNEY_SOURCE_ORDER: NoorSearchType[] = ['quran', 'tafseer', 'hadith'];

export function generateStaticParams() {
  return NOOR_GUIDANCE_TOPIC_JOURNEYS.map((topic) => ({ topic: topic.id }));
}

function getGroupedResults(results: NoorSearchResult[]) {
  return JOURNEY_SOURCE_ORDER.map((type) => ({
    type,
    title: getNoorSearchTypeLabel(type),
    results: results.filter((result) => result.type === type)
  })).filter((group) => group.results.length > 0);
}

function getResultActionLabel(type: NoorSearchType) {
  if (type === 'tafseer') return 'Open Tafseer understanding';
  if (type === 'hadith') return 'Open Hadith reader';
  return 'Open Quran reader';
}

export default async function GuidanceTopicPage({ params }: GuidanceTopicPageProps) {
  const resolvedParams = (await params) ?? {};
  const topicId = resolvedParams.topic?.toLowerCase();
  const topic = topicId ? getNoorGuidanceTopicJourney(topicId) : undefined;

  if (!topic) {
    notFound();
  }

  const results = searchNoorLocal(topic.label, {
    types: JOURNEY_SOURCE_ORDER,
    topic: topic.id,
    limit: 9
  });
  const groupedResults = getGroupedResults(results);

  return (
    <main className="noor-page">
      <PageHeader
        kicker="Guided topic path"
        title={`${topic.label}: from seeking to reading.`}
        subtitle={topic.summary}
      />

      <section className="noor-topic-journey-hero-grid" aria-label={`${topic.label} guidance journey`}>
        <NoorCard variant="gold" className="noor-topic-journey-hero-card">
          <span className="noor-topic-prompt-icon">{topic.arabicKeyword}</span>
          <span className="noor-badge emerald">Explore-to-Reader Journey</span>
          <h2>{topic.prompt}</h2>
          <p className="noor-subtitle">{topic.question}</p>
          <div className="noor-card-actions" style={{ marginTop: 16 }}>
            <Link className="noor-button" href={`/explore?topic=${encodeURIComponent(topic.id)}`}>
              Search this topic
            </Link>
            <Link className="noor-button secondary" href="/explore">
              Back to Explore
            </Link>
          </div>
        </NoorCard>

        <NoorCard variant="soft" className="noor-topic-response-card">
          <span className="noor-kicker">Respond today</span>
          <h2>One small action</h2>
          <p className="noor-subtitle">{topic.action}</p>
          <div className="noor-divider" />
          <span className="noor-badge gold">Read → Understand → Reflect → Respond</span>
        </NoorCard>
      </section>

      <section className="noor-stack" aria-label="Reader path">
        <div className="noor-section-heading">
          <div>
            <span className="noor-kicker">Reader path</span>
            <h2>Continue without losing context</h2>
          </div>
          <p className="noor-subtitle">
            Start with the Quran, continue into explanation, then reflect with Hadith reminders before choosing a personal response.
          </p>
        </div>

        <div className="noor-topic-reader-path">
          {topic.readerSteps.map((step, index) => (
            <NoorCard key={step.id} className="noor-topic-reader-step">
              <span className="noor-badge emerald">Step {index + 1}</span>
              <span className="noor-kicker">{step.label}</span>
              <h3>{step.title}</h3>
              <p className="noor-subtitle">{step.body}</p>
              <Link className="noor-button secondary" href={step.href}>
                {step.actionLabel}
              </Link>
            </NoorCard>
          ))}
        </div>
      </section>

      <section className="noor-stack" aria-label={`${topic.label} source entry points`}>
        <div className="noor-section-heading">
          <div>
            <span className="noor-kicker">Source entry points</span>
            <h2>Open the strongest available matches</h2>
          </div>
          <p className="noor-subtitle">
            These cards reuse the same guidance discovery search so the topic path stays connected to Quran, Tafseer and Hadith.
          </p>
        </div>

        {groupedResults.length > 0 ? (
          groupedResults.map((group) => (
            <section className="noor-result-group" key={group.type}>
              <div className="noor-result-group-header">
                <div>
                  <span className="noor-badge emerald">{group.title}</span>
                  <h2>{group.results.length} entry point{group.results.length === 1 ? '' : 's'}</h2>
                </div>
              </div>

              <div className="noor-grid">
                {group.results.map((result) => (
                  <NoorCard key={`${result.type}-${result.id}`} className="noor-link-card noor-explore-result-card">
                    <div className="noor-row">
                      <span className="noor-badge emerald">{getNoorSearchTypeLabel(result.type)}</span>
                      <span className="noor-reference">{result.reference}</span>
                    </div>
                    <div>
                      <strong>{result.title}</strong>
                      {result.sourceLabel ? <p className="noor-muted">{result.sourceLabel}</p> : null}
                    </div>
                    <p className="noor-subtitle">{result.excerpt}</p>
                    <Link className="noor-button" href={result.href ?? `/explore?topic=${encodeURIComponent(topic.id)}`}>
                      {getResultActionLabel(result.type)}
                    </Link>
                  </NoorCard>
                ))}
              </div>
            </section>
          ))
        ) : (
          <NoorCard className="noor-empty-guidance-card">
            <span className="noor-badge gold">No direct match yet</span>
            <h3>Begin from the reader path</h3>
            <p className="noor-subtitle">
              The topic path is still useful even when the current starter content has limited matches. Start with the reader path and return as more reviewed content is added.
            </p>
          </NoorCard>
        )}
      </section>
    </main>
  );
}
