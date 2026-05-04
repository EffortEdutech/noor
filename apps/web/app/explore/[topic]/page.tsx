import Link from 'next/link';
import { notFound } from 'next/navigation';
import {
  KnowledgeSettingsPanel,
  NoorCard,
  SourceConnectionsPanel
} from '@noor/ui';
import { getNoorSearchTypeLabel, searchNoorLocal, type NoorSearchResult, type NoorSearchType } from '@noor/search';
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

const pageStyle = {
  display: 'flex',
  flexDirection: 'column',
  gap: 14,
  paddingBottom: 80
} as const;

const titleStyle = {
  margin: 0,
  color: '#0f172a',
  fontSize: 22,
  fontWeight: 800,
  letterSpacing: '-0.02em'
} as const;

const subtitleStyle = {
  margin: '6px 0 0',
  color: '#64748b',
  fontSize: 13,
  lineHeight: 1.6
} as const;

function ResultList({ results, fallbackHref }: { results: NoorSearchResult[]; fallbackHref: string }) {
  if (results.length === 0) {
    return (
      <NoorCard variant="soft" className="noor-empty-guidance-card">
        <span className="noor-badge gold">No connected result yet</span>
        <p className="noor-subtitle">Use Explore search for a wider doorway while the production content grows.</p>
      </NoorCard>
    );
  }

  return (
    <div className="noor-source-row-list">
      {results.map((result) => (
        <NoorCard key={`${result.type}-${result.id}`} className="noor-source-row-card">
          <div className="noor-row">
            <span className="noor-badge emerald">{getNoorSearchTypeLabel(result.type)}</span>
            <span className="noor-reference">{result.reference}</span>
          </div>
          <div>
            <strong>{result.title}</strong>
            {result.sourceLabel ? <p className="noor-muted noor-small">{result.sourceLabel}</p> : null}
          </div>
          <p className="noor-subtitle">{result.excerpt}</p>
          <div className="noor-card-actions">
            <Link className="noor-button" href={result.href ?? fallbackHref}>Open source</Link>
          </div>
        </NoorCard>
      ))}
    </div>
  );
}

export default async function GuidanceTopicPage({ params }: { params: Promise<{ topic: string }> }) {
  const { topic: topicParam } = await params;
  const topic = getGuidanceTopic(topicParam);
  if (!topic) notFound();

  const results = searchNoorLocal(topic.searchQuery, {
    types: SOURCE_ORDER,
    topic: topic.id,
    limit: 12
  });

  const quranResults = results.filter((result) => result.type === 'quran').slice(0, 4);
  const tafseerResults = results.filter((result) => result.type === 'tafseer').slice(0, 4);
  const hadithResults = results.filter((result) => result.type === 'hadith').slice(0, 4);
  const relatedTopics = GUIDANCE_TOPIC_DETAILS.filter((item) => item.id !== topic.id).slice(0, 4);

  return (
    <main className="noor-page noor-learning-page" style={pageStyle}>
      <div>
        <h1 style={titleStyle}>{topic.label}</h1>
        <p style={subtitleStyle}>Learn this topic one layer at a time. Open a section only when you are ready.</p>
      </div>

      <KnowledgeSettingsPanel
        title={`${topic.label} learning path`}
        subtitle="The detail is hidden first so the topic does not become a long knowledge dump."
        sections={[
          {
            id: 'topic-begin',
            icon: topic.arabic,
            title: 'Need and intention',
            summary: topic.prompt,
            chips: ['Begin', 'Intention', 'Today'],
            children: (
              <div className="noor-topic-focus-panel">
                <span className="noor-topic-prompt-icon">{topic.arabic}</span>
                <div>
                  <h2>{topic.label}</h2>
                  <p>{topic.description}</p>
                  <div className="noor-study-note"><strong>Intention:</strong> {topic.intention}</div>
                  <div className="noor-study-note"><strong>Today:</strong> {topic.dailyPractice}</div>
                </div>
              </div>
            )
          },
          {
            id: 'topic-quran',
            icon: '📖',
            title: 'Quran foundation',
            summary: 'Begin with the ayah before explanation or application.',
            chips: ['Foundation', 'Ayah first'],
            actionHref: topic.quranHref,
            actionLabel: 'Open reader',
            children: <ResultList results={quranResults} fallbackHref={topic.quranHref} />
          },
          {
            id: 'topic-tafseer',
            icon: '🪔',
            title: 'Tafseer insight',
            summary: 'Read explanation after the ayah so the topic has context.',
            chips: ['Understanding', 'Context'],
            actionHref: topic.tafseerHref,
            actionLabel: 'Open Tafseer',
            children: <ResultList results={tafseerResults} fallbackHref={topic.tafseerHref} />
          },
          {
            id: 'topic-hadith',
            icon: '🌙',
            title: 'Hadith guidance',
            summary: 'Move from knowledge into Prophetic character and practice.',
            chips: ['Sunnah', 'Application'],
            actionHref: topic.hadithHref,
            actionLabel: 'Open Hadith',
            children: <ResultList results={hadithResults} fallbackHref={topic.hadithHref} />
          },
          {
            id: 'topic-reflect',
            icon: '✍️',
            title: 'Reflect and save one action',
            summary: topic.responsePrompt,
            chips: ['Reflection', 'Action'],
            children: <GuidanceTopicJourneyClient topic={topic} />
          },
          {
            id: 'topic-continue',
            icon: '🧭',
            title: 'Continue carefully',
            summary: 'Open related topics only after the current topic feels clear.',
            chips: ['Connections', 'Related topics'],
            children: (
              <div className="noor-clean-stack">
                <SourceConnectionsPanel
                  compact
                  title="Connections"
                  subtitle="Where this topic can continue next."
                  connections={[
                    { label: 'Quran', title: 'Read the foundation', description: 'Return to the ayah and read slowly.', href: topic.quranHref },
                    { label: 'Tafseer', title: 'Understand the context', description: 'Open explanation only after reading.', href: topic.tafseerHref },
                    { label: 'Hadith', title: 'Apply through Sunnah', description: 'Reflect with Prophetic guidance.', href: topic.hadithHref }
                  ]}
                />
                <div className="noor-topic-row-list compact">
                  {relatedTopics.map((item) => (
                    <Link key={item.id} className="noor-topic-row" href={item.exploreHref}>
                      <span className="noor-topic-prompt-icon">{item.arabic}</span>
                      <span>
                        <strong>{item.label}</strong>
                        <small>{item.prompt}</small>
                      </span>
                      <em>{item.description}</em>
                    </Link>
                  ))}
                </div>
              </div>
            )
          }
        ]}
      />
    </main>
  );
}
