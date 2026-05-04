import type { ReactNode } from 'react';
import Link from 'next/link';
import { SearchPanel } from '../../components/SearchPanel';
import { UniversalKnowledgeBar } from '../../components/UniversalKnowledgeBar';
import { GUIDANCE_TOPIC_DETAILS } from '../../lib/guidance-topics';

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

function ActionRow({
  icon,
  title,
  description,
  href,
  actionLabel
}: {
  icon: ReactNode;
  title: string;
  description: string;
  href: string;
  actionLabel: string;
}) {
  const content = (
    <>
      <span className="noor-row-symbol" aria-hidden="true">{icon}</span>
      <span className="noor-learning-action-copy">
        <strong>{title}</strong>
        <p>{description}</p>
      </span>
      <span className="noor-learning-action-pill">{actionLabel}</span>
    </>
  );

  if (href.startsWith('#')) return <a className="noor-learning-action-row" href={href}>{content}</a>;
  return <Link className="noor-learning-action-row" href={href}>{content}</Link>;
}

export default function ExplorePage() {
  return (
    <main className="noor-page noor-learning-page">
      <header className="noor-production-header">
        <span className="noor-kicker">Explore</span>
        <h1>Choose one way to begin.</h1>
        <p>
          Explore should not behave like a wall of content. Start with a need, a known reference, or a slow topic browse.
        </p>
      </header>

      <section className="noor-learning-intro" aria-label="Explore recommendation">
        <div>
          <span className="noor-kicker">Recommended</span>
          <h2>Use a guided topic when you know the need but not the source.</h2>
          <p>
            NOOR will then organise the path as Quran foundation, tafseer understanding, hadith guidance, and one reflection.
          </p>
        </div>
        <a className="noor-button primary" href="/explore/patience">Open Patience</a>
      </section>

      <section className="noor-learning-list" aria-label="Explore choices">
        <LearningSection
          icon="🧭"
          title="Start with a need"
          summary="Use this when you are looking for guidance but do not know which Surah, tafseer or hadith to open."
          preview={["Recommended", "Topic path"]}
          defaultOpen
        >
          <div className="noor-learning-action-list">
            <ActionRow
              icon="صبر"
              title="Open a guided topic"
              description="Choose a human need such as patience, mercy, rizq, prayer or repentance. NOOR will arrange the sources in learning order."
              href="/explore/patience"
              actionLabel="Start"
            />
            <ActionRow
              icon="رحمة"
              title="Browse mercy and hope"
              description="Use this when the user needs reassurance before reading deeper source material."
              href="/explore/mercy"
              actionLabel="Open"
            />
            <ActionRow
              icon="رزق"
              title="Browse rizq and reliance"
              description="Use this when the question is about provision, effort, trust and patience."
              href="/explore/rizq"
              actionLabel="Open"
            />
          </div>
        </LearningSection>

        <div id="explore-search">
          <LearningSection
            icon="🔎"
            title="Search or jump directly"
            summary="Use this when you already know a Surah, ayah number, topic word, or hadith keyword."
            preview={["2:255", "Al-Kahf", "sabr", "intention"]}
          >
            <UniversalKnowledgeBar
              title="Search across NOOR"
              subtitle="Try a reference like 2:255, a Surah name, or a topic such as sabr, mercy, prayer or repentance."
            />
            <SearchPanel />
          </LearningSection>
        </div>

        <div id="explore-topics">
          <LearningSection
            icon="☰"
            title="Browse guided topics"
            summary="Open the topic list only when you want to compare available paths."
            preview={["Topic by topic", "Slow browse"]}
          >
            <div className="noor-learning-action-list">
              {GUIDANCE_TOPIC_DETAILS.map((topic) => (
                <ActionRow
                  key={topic.id}
                  icon={topic.arabic}
                  title={topic.label}
                  description={topic.prompt}
                  href={topic.exploreHref}
                  actionLabel="Open"
                />
              ))}
            </div>
          </LearningSection>
        </div>
      </section>
    </main>
  );
}
