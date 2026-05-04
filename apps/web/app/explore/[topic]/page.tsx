import Link from 'next/link';
import { notFound } from 'next/navigation';
import {
  NoorCard,
  PageHeader,
  SourceConnectionsPanel,
  type NoorSourceConnection
} from '@noor/ui';
import {
  getNoorSearchTypeLabel,
  searchNoorLocal,
  type NoorSearchResult,
  type NoorSearchType
} from '@noor/search';
import { GuidanceTopicJourneyClient } from '../../../components/GuidanceTopicJourneyClient';
import { UniversalKnowledgeBar } from '../../../components/UniversalKnowledgeBar';
import {
  GUIDANCE_TOPIC_DETAILS,
  getGuidanceTopic,
  type GuidanceTopicDetail
} from '../../../lib/guidance-topics';

export function generateStaticParams() {
  return GUIDANCE_TOPIC_DETAILS.map((topic) => ({ topic: topic.id }));
}

export async function generateMetadata({ params }: { params: Promise<{ topic: string }> }) {
  const { topic: topicParam } = await params;
  const topic = getGuidanceTopic(topicParam);
  return {
    title: topic ? `${topic.label} guidance path · NOOR` : 'Guidance topic · NOOR'
  };
}

const SOURCE_ORDER: NoorSearchType[] = ['quran', 'tafseer', 'hadith'];

function getSourceIntro(type: NoorSearchType) {
  if (type === 'quran') {
    return 'Begin with the Quran foundation. The ayah gives the direction before any explanation or reflection.';
  }

  if (type === 'tafseer') {
    return 'Then read tafseer for careful understanding, context and the meaning behind the passage.';
  }

  if (type === 'hadith') {
    return 'Then connect the topic to Prophetic guidance so knowledge becomes character and action.';
  }

  return 'Continue this guidance path.';
}

function getSourceAction(type: NoorSearchType) {
  if (type === 'quran') return 'Read ayah';
  if (type === 'tafseer') return 'Understand tafseer';
  if (type === 'hadith') return 'Reflect with hadith';
  return 'Open';
}

function getEmptySourceCopy(type: NoorSearchType, topic: GuidanceTopicDetail) {
  if (type === 'quran') {
    return `No Quran result is linked for ${topic.label} yet. Start from the recommended Quran doorway instead.`;
  }

  if (type === 'tafseer') {
    return `No tafseer result is linked for ${topic.label} yet. Open the tafseer workspace from the recommended doorway.`;
  }

  if (type === 'hadith') {
    return `No hadith result is linked for ${topic.label} yet. Open Hadith reflection mode and search this topic.`;
  }

  return 'No linked result yet.';
}

function getFallbackHref(type: NoorSearchType, topic: GuidanceTopicDetail) {
  if (type === 'quran') return topic.quranHref;
  if (type === 'tafseer') return topic.tafseerHref;
  if (type === 'hadith') return topic.hadithHref;
  return topic.exploreHref;
}

function buildGroupedResults(topic: GuidanceTopicDetail) {
  const results = searchNoorLocal(topic.searchQuery, {
    types: SOURCE_ORDER,
    topic: topic.id,
    limit: 18
  });

  return SOURCE_ORDER.map((type) => ({
    type,
    label: getNoorSearchTypeLabel(type),
    results: results.filter((result) => result.type === type).slice(0, 4)
  }));
}

function buildConnections(topic: GuidanceTopicDetail, groupedResults: ReturnType<typeof buildGroupedResults>): NoorSourceConnection[] {
  const quranCount = groupedResults.find((group) => group.type === 'quran')?.results.length ?? 0;
  const tafseerCount = groupedResults.find((group) => group.type === 'tafseer')?.results.length ?? 0;
  const hadithCount = groupedResults.find((group) => group.type === 'hadith')?.results.length ?? 0;

  return [
    {
      label: 'Quran',
      badge: 'Foundation',
      title: quranCount > 0 ? `${quranCount} Quran doorway${quranCount === 1 ? '' : 's'}` : 'Start with Quran',
      description: 'Read the ayah first so the topic begins with revelation, not opinion.',
      href: topic.quranHref
    },
    {
      label: 'Tafseer',
      badge: 'Understand',
      title: tafseerCount > 0 ? `${tafseerCount} tafseer insight${tafseerCount === 1 ? '' : 's'}` : 'Open tafseer context',
      description: 'Move from reading into careful explanation and context.',
      href: topic.tafseerHref
    },
    {
      label: 'Hadith',
      badge: 'Sunnah',
      title: hadithCount > 0 ? `${hadithCount} hadith reminder${hadithCount === 1 ? '' : 's'}` : 'Open Hadith reflection',
      description: 'Connect the topic to Prophetic practice and character.',
      href: topic.hadithHref
    },
    {
      label: 'Reflect',
      badge: 'Respond',
      title: 'Save one response today',
      description: topic.responsePrompt,
      href: `#topic-reflection-${topic.id}`
    }
  ];
}

function ResultPreviewCard({ result, type, topic }: { result: NoorSearchResult; type: NoorSearchType; topic: GuidanceTopicDetail }) {
  return (
    <NoorCard className="noor-topic-source-result-card">
      <div className="noor-row">
        <span className="noor-badge emerald">{getNoorSearchTypeLabel(result.type)}</span>
        <span className="noor-reference">{result.reference}</span>
      </div>
      <div className="noor-topic-result-body">
        <strong>{result.title}</strong>
        {result.sourceLabel ? <p className="noor-muted noor-small">{result.sourceLabel}</p> : null}
        <p className="noor-subtitle">{result.excerpt}</p>
      </div>
      <div className="noor-card-actions">
        <Link className="noor-button" href={result.href ?? getFallbackHref(type, topic)}>
          {getSourceAction(type)}
        </Link>
      </div>
    </NoorCard>
  );
}

function TopicSourceSection({
  type,
  label,
  results,
  topic
}: {
  type: NoorSearchType;
  label: string;
  results: NoorSearchResult[];
  topic: GuidanceTopicDetail;
}) {
  const primary = results[0];
  const supporting = results.slice(1, 4);

  return (
    <section className={`noor-topic-source-section noor-topic-source-${type}`} aria-label={`${label} for ${topic.label}`}>
      <div className="noor-topic-source-heading">
        <span className="noor-badge gold">{label}</span>
        <h2>{type === 'quran' ? 'Quran foundation' : type === 'tafseer' ? 'Tafseer insight' : 'Hadith guidance'}</h2>
        <p className="noor-subtitle">{getSourceIntro(type)}</p>
      </div>

      {primary ? (
        <ResultPreviewCard result={primary} type={type} topic={topic} />
      ) : (
        <NoorCard variant="soft" className="noor-topic-source-empty-card">
          <span className="noor-badge emerald">Helpful empty state</span>
          <p className="noor-subtitle">{getEmptySourceCopy(type, topic)}</p>
          <Link className="noor-button secondary" href={getFallbackHref(type, topic)}>
            {getSourceAction(type)}
          </Link>
        </NoorCard>
      )}

      {supporting.length > 0 ? (
        <div className="noor-topic-supporting-list" aria-label={`More ${label} links`}>
          {supporting.map((result) => (
            <Link key={`${result.type}-${result.id}`} href={result.href ?? getFallbackHref(type, topic)} className="noor-topic-supporting-link">
              <span>{result.reference}</span>
              <strong>{result.title}</strong>
            </Link>
          ))}
        </div>
      ) : null}
    </section>
  );
}

export default async function GuidanceTopicPage({ params }: { params: Promise<{ topic: string }> }) {
  const { topic: topicParam } = await params;
  const topic = getGuidanceTopic(topicParam);
  if (!topic) notFound();

  const groupedResults = buildGroupedResults(topic);
  const connections = buildConnections(topic, groupedResults);
  const relatedTopics = GUIDANCE_TOPIC_DETAILS.filter((item) => item.id !== topic.id).slice(0, 4);

  return (
    <main className="noor-page noor-topic-page-v1">
      <PageHeader
        kicker="Topic Page v1"
        title={`${topic.label}: guidance from need to response.`}
        subtitle={`${topic.prompt}. Start with Quran, understand through tafseer, connect to Hadith, then save one sincere response for today.`}
      />

      <UniversalKnowledgeBar
        defaultValue={topic.label.toLowerCase()}
        title={`Explore ${topic.label} through connected sources`}
        subtitle="Use this topic page as a guided route, or search another need, question, Quran reference, tafseer doorway or Hadith theme."
      />

      <section className="noor-topic-v1-hero-grid">
        <NoorCard variant="gold" className="noor-topic-v1-hero-card">
          <div className="noor-row">
            <span className="noor-topic-prompt-icon">{topic.arabic}</span>
            <span className="noor-badge emerald">Guided topic</span>
          </div>
          <h2>{topic.label}</h2>
          <p className="noor-subtitle">{topic.description}</p>
          <div className="noor-study-note">
            <strong>Intention:</strong> {topic.intention}
          </div>
          <div className="noor-card-actions">
            <Link className="noor-button" href={topic.quranHref}>Begin with Quran</Link>
            <Link className="noor-button secondary" href={topic.tafseerHref}>Understand Tafseer</Link>
            <Link className="noor-button secondary" href={topic.hadithHref}>Reflect with Hadith</Link>
          </div>
        </NoorCard>

        <NoorCard variant="soft" className="noor-topic-v1-response-card">
          <span className="noor-kicker">Today’s response</span>
          <h2>Turn knowledge into one action.</h2>
          <p className="noor-subtitle">{topic.dailyPractice}</p>
          <div className="noor-study-note">
            <strong>Reflection question:</strong> {topic.responsePrompt}
          </div>
          <Link className="noor-button" href={`#topic-reflection-${topic.id}`}>Write reflection</Link>
        </NoorCard>
      </section>

      <SourceConnectionsPanel
        title="Topic connections"
        subtitle="This page keeps the guidance path connected across Quran, Tafseer, Hadith and personal response."
        connections={connections}
      />

      <section className="noor-topic-v1-path" aria-label={`${topic.label} guidance route`}>
        {topic.steps.map((step, index) => (
          <Link key={step.id} href={step.href} className="noor-topic-v1-path-step">
            <span>{index + 1}</span>
            <strong>{step.label}</strong>
            <small>{step.helper}</small>
          </Link>
        ))}
      </section>

      <section className="noor-stack" aria-label={`${topic.label} guidance source stack`}>
        <div className="noor-section-heading">
          <div>
            <span className="noor-kicker">Knowledge stack</span>
            <h2>Quran foundation → Tafseer insight → Hadith guidance</h2>
          </div>
          <Link className="noor-button secondary" href={`/explore?topic=${topic.id}`}>Search wider</Link>
        </div>

        <div className="noor-topic-source-stack">
          {groupedResults.map((group) => (
            <TopicSourceSection
              key={group.type}
              type={group.type}
              label={group.label}
              results={group.results}
              topic={topic}
            />
          ))}
        </div>
      </section>

      <section id={`topic-reflection-${topic.id}`} className="noor-topic-reflection-anchor">
        <GuidanceTopicJourneyClient topic={topic} />
      </section>

      <section className="noor-stack" aria-label="Related guidance topics">
        <div className="noor-section-heading">
          <div>
            <span className="noor-kicker">Continue naturally</span>
            <h2>Related needs you may explore next</h2>
          </div>
          <Link className="noor-button secondary" href="/explore">All topics</Link>
        </div>
        <div className="noor-topic-related-grid">
          {relatedTopics.map((item) => (
            <Link key={item.id} className="noor-topic-related-card" href={item.exploreHref}>
              <span className="noor-topic-prompt-icon">{item.arabic}</span>
              <strong>{item.label}</strong>
              <small>{item.prompt}</small>
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}
