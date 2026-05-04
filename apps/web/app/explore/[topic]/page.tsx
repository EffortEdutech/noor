import Link from 'next/link';
import { notFound } from 'next/navigation';
import { NoorCard, PageHeader } from '@noor/ui';
import { getNoorSearchTypeLabel, searchNoorLocal, type NoorSearchType } from '@noor/search';
import { GuidanceTopicJourneyClient } from '../../../components/GuidanceTopicJourneyClient';
import { GUIDANCE_TOPIC_DETAILS, getGuidanceTopic } from '../../../lib/guidance-topics';

export function generateStaticParams() {
  return GUIDANCE_TOPIC_DETAILS.map((topic) => ({ topic: topic.id }));
}

export async function generateMetadata({ params }: { params: Promise<{ topic: string }> }) {
  const { topic: topicParam } = await params;
  const topic = getGuidanceTopic(topicParam);
  return {
    title: topic ? `${topic.label} guidance · NOOR` : 'Guidance topic · NOOR'
  };
}

const SOURCE_ORDER: NoorSearchType[] = ['quran', 'tafseer', 'hadith'];

export default async function GuidanceTopicPage({ params }: { params: Promise<{ topic: string }> }) {
  const { topic: topicParam } = await params;
  const topic = getGuidanceTopic(topicParam);
  if (!topic) notFound();

  const results = searchNoorLocal(topic.searchQuery, {
    types: SOURCE_ORDER,
    topic: topic.id,
    limit: 9
  });

  const groupedResults = SOURCE_ORDER.map((type) => ({
    type,
    label: getNoorSearchTypeLabel(type),
    results: results.filter((result) => result.type === type)
  })).filter((group) => group.results.length > 0);

  return (
    <main className="noor-page">
      <PageHeader
        kicker="Guidance topic"
        title={`${topic.label}: a path from need to action.`}
        subtitle={`${topic.prompt}. Move through Quran reading, tafseer understanding, Hadith reflection and one saved response for today.`}
      />

      <section className="noor-guidance-topic-hero-grid">
        <NoorCard variant="gold" className="noor-guidance-topic-hero">
          <span className="noor-topic-prompt-icon">{topic.arabic}</span>
          <h2>{topic.label}</h2>
          <p className="noor-subtitle">{topic.description}</p>
          <div className="noor-study-note">
            <strong>Intention:</strong> {topic.intention}
          </div>
        </NoorCard>

        <NoorCard variant="soft" className="noor-guidance-action-card">
          <span className="noor-kicker">Today’s response</span>
          <h2>Read, understand, reflect, respond.</h2>
          <p className="noor-subtitle">{topic.dailyPractice}</p>
          <div className="noor-card-actions">
            <Link className="noor-button" href={topic.quranHref}>Start with Quran</Link>
            <Link className="noor-button secondary" href="/explore">Back to Explore</Link>
          </div>
        </NoorCard>
      </section>

      <section className="noor-guidance-path-flow" aria-label={`${topic.label} guidance journey`}>
        {topic.steps.map((step, index) => (
          <Link key={step.id} href={step.href} className="noor-guidance-path-step">
            <span>{index + 1}</span>
            <strong>{step.label}</strong>
            <small>{step.helper}</small>
          </Link>
        ))}
      </section>

      <GuidanceTopicJourneyClient topic={topic} />

      <section className="noor-stack" aria-label={`${topic.label} connected guidance results`}>
        <div className="noor-section-heading">
          <div>
            <span className="noor-kicker">Connected guidance</span>
            <h2>Quran, Tafseer and Hadith for this topic</h2>
          </div>
          <Link className="noor-button secondary" href={`/explore?topic=${topic.id}`}>Search this topic</Link>
        </div>

        {groupedResults.length === 0 ? (
          <NoorCard className="noor-empty-guidance-card">
            <span className="noor-badge gold">No connected result yet</span>
            <p className="noor-subtitle">
              Use Explore search for a wider doorway into this topic while the production content grows.
            </p>
          </NoorCard>
        ) : null}

        {groupedResults.map((group) => (
          <section key={group.type} className="noor-result-group">
            <div className="noor-result-group-header">
              <div>
                <span className="noor-badge emerald">{group.label}</span>
                <h2>{group.results.length} reminder{group.results.length === 1 ? '' : 's'}</h2>
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
                  <div className="noor-card-actions">
                    <Link className="noor-button" href={result.href ?? `/explore?topic=${topic.id}`}>
                      Open
                    </Link>
                  </div>
                </NoorCard>
              ))}
            </div>
          </section>
        ))}
      </section>
    </main>
  );
}
