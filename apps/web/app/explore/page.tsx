import Link from 'next/link';
import { NoorCard, PageHeader } from '@noor/ui';
import { SearchPanel } from '../../components/SearchPanel';
import { GUIDANCE_TOPIC_DETAILS } from '../../lib/guidance-topics';

export default function ExplorePage() {
  return (
    <main className="noor-page">
      <PageHeader
        kicker="Explore"
        title="Discover guidance by need, topic, and source."
        subtitle="Begin with what your heart is asking for today. Choose a prompt, search in simple words, then continue into Quran reading, tafseer understanding, Hadith reflection, or a saved topic journey."
      />

      <section className="noor-guidance-path-grid" aria-label="Explore guidance journey">
        <NoorCard variant="gold" className="noor-explore-journey-card">
          <span className="noor-badge emerald">Start with a need</span>
          <h2>What are you seeking today?</h2>
          <p className="noor-subtitle">
            Explore mercy, patience, rizq, intention, protection, prayer, repentance and more. NOOR keeps the path connected to Quran, Tafseer and Hadith.
          </p>
        </NoorCard>

        <NoorCard variant="soft">
          <span className="noor-kicker">Read with context</span>
          <p className="noor-subtitle">
            Results are grouped so you can move from ayah, to explanation, to Hadith reminder without losing your place.
          </p>
          <div className="noor-card-actions" style={{ marginTop: 14 }}>
            <Link className="noor-button secondary" href="/learn/quran">
              Quran reader
            </Link>
            <Link className="noor-button secondary" href="/learn/tafseer">
              Tafseer
            </Link>
            <Link className="noor-button secondary" href="/learn/hadith">
              Hadith
            </Link>
          </div>
        </NoorCard>
      </section>

      <section className="noor-stack" aria-label="Guidance topic journeys">
        <div className="noor-section-heading">
          <div>
            <span className="noor-kicker">Guided topic journeys</span>
            <h2>Open a complete path, not only a search result</h2>
          </div>
          <Link className="noor-button secondary" href="/today">Continue from dashboard</Link>
        </div>

        <div className="noor-topic-journey-grid">
          {GUIDANCE_TOPIC_DETAILS.map((topic) => (
            <Link key={topic.id} className="noor-topic-journey-card" href={topic.exploreHref}>
              <span className="noor-topic-prompt-icon">{topic.arabic}</span>
              <strong>{topic.label}</strong>
              <span>{topic.prompt}</span>
              <small>{topic.description}</small>
            </Link>
          ))}
        </div>
      </section>

      <SearchPanel />
    </main>
  );
}
