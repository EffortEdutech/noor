import type { ReactNode } from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { NoorCard, SourceConnectionsPanel } from '@noor/ui';
import { getNoorSearchTypeLabel, searchNoorLocal, type NoorSearchResult, type NoorSearchType } from '@noor/search';
import { GuidanceTopicJourneyClient } from '../../../components/GuidanceTopicJourneyClient';
import { UniversalKnowledgeBar } from '../../../components/UniversalKnowledgeBar';
import { GUIDANCE_TOPIC_DETAILS, getGuidanceTopic } from '../../../lib/guidance-topics';

export function generateStaticParams() {
  return GUIDANCE_TOPIC_DETAILS.map((topic) => ({ topic: topic.id }));
}

export async function generateMetadata({ params }: { params: Promise<{ topic: string }> }) {
  const { topic: topicParam } = await params;
  const topic = getGuidanceTopic(topicParam);
  return { title: topic ? `${topic.label} guidance · NOOR` : 'Guidance topic · NOOR' };
}

const SOURCE_ORDER: NoorSearchType[] = ['quran', 'tafseer', 'hadith'];

function LearningSection({
  icon,
  title,
  summary,
  preview,
  children,
  defaultOpen = false
}: {
  icon: ReactNode;
  title: string;
  summary: string;
  preview: string[];
  children: ReactNode;
  defaultOpen?: boolean;
}) {
  return (
    <details className="noor-learning-section" open={defaultOpen}>
      <summary>
        <span className="noor-learning-icon" aria-hidden="true">{icon}</span>
        <span className="noor-learning-summary-main">
          <strong>{title}</strong>
          <span>{summary}</span>
          <span className="noor-learning-preview">
            {preview.map((item) => <em key={item}>{item}</em>)}
          </span>
        </span>
        <span className="noor-learning-chevron" aria-hidden="true">▸</span>
      </summary>
      <div className="noor-learning-body">{children}</div>
    </details>
  );
}

function ResultList({ results, fallbackHref }: { results: NoorSearchResult[]; fallbackHref: string }) {
  if (results.length === 0) {
    return (
      <NoorCard variant="soft" className="noor-source-row-card">
        <span className="noor-badge gold">No direct result yet</span>
        <p>Use the wider Explore search while the reviewed production content grows.</p>
        <div className="noor-card-actions">
          <Link className="noor-button secondary" href={fallbackHref}>Open related source</Link>
        </div>
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
          <p>{result.excerpt}</p>
          <div className="noor-card-actions">
            <Link className="noor-button secondary" href={result.href ?? fallbackHref}>Open source</Link>
          </div>
        </NoorCard>
      ))}
    </div>
  );
}

function RelatedTopicRow({ topic }: { topic: (typeof GUIDANCE_TOPIC_DETAILS)[number] }) {
  return (
    <Link className="noor-learning-action-row" href={topic.exploreHref}>
      <span className="noor-row-symbol" aria-hidden="true">{topic.arabic}</span>
      <span className="noor-learning-action-copy">
        <strong>{topic.label}</strong>
        <p>{topic.prompt}</p>
      </span>
      <span className="noor-learning-action-pill">Open</span>
    </Link>
  );
}

export default async function GuidanceTopicPage({ params }: { params: Promise<{ topic: string }> }) {
  const { topic: topicParam } = await params;
  const topic = getGuidanceTopic(topicParam);
  if (!topic) notFound();

  const results = searchNoorLocal(topic.searchQuery, { types: SOURCE_ORDER, topic: topic.id, limit: 12 });
  const quranResults = results.filter((result) => result.type === 'quran').slice(0, 4);
  const tafseerResults = results.filter((result) => result.type === 'tafseer').slice(0, 4);
  const hadithResults = results.filter((result) => result.type === 'hadith').slice(0, 4);
  const relatedTopics = GUIDANCE_TOPIC_DETAILS.filter((item) => item.id !== topic.id).slice(0, 4);

  return (
    <main className="noor-page noor-learning-page">
      <header className="noor-production-header">
        <span className="noor-kicker">Guided topic</span>
        <h1>{topic.label}</h1>
        <p>
          This page is a curated knowledge path: need, Quran foundation, tafseer understanding, Hadith guidance,
          reflection, then continuation.
        </p>
      </header>

      <UniversalKnowledgeBar
        defaultValue={topic.label}
        title={`Search within ${topic.label}`}
        subtitle="Use a related word, question, Quran reference or Hadith keyword to reshape the path."
      />

      <section className="noor-learning-intro" aria-label="Topic recommendation">
        <div>
          <span className="noor-kicker">Knowledge path</span>
          <h2>Begin with Quran. Understand with tafseer. Reflect with Hadith.</h2>
          <p>{topic.prompt}</p>
        </div>
        <a className="noor-button primary" href={topic.quranHref}>Open Quran</a>
      </section>

      <section className="noor-learning-list" aria-label={`${topic.label} learning sections`}>
        <LearningSection
          icon={topic.arabic}
          title="Need and intention"
          summary="Clarify why this topic matters before opening source material."
          preview={["Begin", "Intention", "Today"]}
          defaultOpen
        >
          <div className="noor-feature-panel">
            <span className="noor-symbol-badge" aria-hidden="true">{topic.arabic}</span>
            <div>
              <h2>{topic.label}</h2>
              <p>{topic.description}</p>
              <div className="noor-study-note"><strong>Intention:</strong> {topic.intention}</div>
              <div className="noor-study-note"><strong>Today:</strong> {topic.dailyPractice}</div>
            </div>
          </div>
        </LearningSection>

        <LearningSection
          icon="📖"
          title="Quran foundation"
          summary="Start with the ayah. Tafseer and Hadith should support the Quran, not replace it."
          preview={["Ayah first", "Foundation"]}
        >
          <ResultList results={quranResults} fallbackHref={topic.quranHref} />
          <div className="noor-card-actions"><Link className="noor-button secondary" href={topic.quranHref}>Open Quran reader</Link></div>
        </LearningSection>

        <LearningSection
          icon="🪔"
          title="Tafseer understanding"
          summary="Open explanation after the ayah so the topic has meaning and context."
          preview={["Meaning", "Context"]}
        >
          <ResultList results={tafseerResults} fallbackHref={topic.tafseerHref} />
          <div className="noor-card-actions"><Link className="noor-button secondary" href={topic.tafseerHref}>Open Tafseer</Link></div>
        </LearningSection>

        <LearningSection
          icon="🌙"
          title="Hadith guidance"
          summary="Move from understanding into Prophetic guidance and practical character."
          preview={["Sunnah", "Practice"]}
        >
          <ResultList results={hadithResults} fallbackHref={topic.hadithHref} />
          <div className="noor-card-actions"><Link className="noor-button secondary" href={topic.hadithHref}>Open Hadith</Link></div>
        </LearningSection>

        <LearningSection
          icon="✍️"
          title="Reflect and save one action"
          summary="End with one personal response so the page has completion, not endless scrolling."
          preview={["Reflection", "Action"]}
        >
          <GuidanceTopicJourneyClient topic={topic} />
        </LearningSection>

        <LearningSection
          icon="🧭"
          title="Continue carefully"
          summary="Only open related topics after this topic feels clear."
          preview={["Connections", "Related topics"]}
        >
          <SourceConnectionsPanel
            compact
            title="Connections"
            subtitle="Use these only when you are ready to continue from this topic."
            connections={[
              { label: 'Quran', title: 'Read the foundation', description: 'Return to the ayah and read slowly.', href: topic.quranHref },
              { label: 'Tafseer', title: 'Understand the context', description: 'Open explanation after the reading.', href: topic.tafseerHref },
              { label: 'Hadith', title: 'Apply through Sunnah', description: 'Reflect with Prophetic guidance.', href: topic.hadithHref }
            ]}
          />
          <div className="noor-learning-action-list">
            {relatedTopics.map((item) => <RelatedTopicRow key={item.id} topic={item} />)}
          </div>
        </LearningSection>
      </section>
    </main>
  );
}
