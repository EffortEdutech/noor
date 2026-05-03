import Link from 'next/link';
import { NOOR_GUIDANCE_TOPIC_JOURNEYS } from '@noor/search';
import { NoorCard, PageHeader } from '@noor/ui';
import { SearchPanel } from '../../components/SearchPanel';

export default function ExplorePage() {
  return (
    <main className="noor-page">
      <PageHeader
        kicker="Explore"
        title="Discover guidance by need, topic, and source."
        subtitle="Begin with what your heart is asking for today. Choose a prompt, open a guided topic path, then continue into Quran reading, tafseer understanding, or Hadith reflection."
      />

      <section className="noor-guidance-path-grid" aria-label="Explore guidance journey">
        <NoorCard variant="gold" className="noor-explore-journey-card">
          <span className="noor-badge emerald">Start with a need</span>
          <h2>What are you seeking today?</h2>
          <p className="noor-subtitle">
            Explore mercy, patience, rizq, intention, protection, prayer, repentance and more. NOOR keeps the path connected to reading, understanding and reflection.
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

      <section className="noor-stack" aria-label="Guided topic paths">
        <div className="noor-section-heading">
          <div>
            <span className="noor-kicker">Guided topic paths</span>
            <h2>Open a topic journey</h2>
          </div>
          <p className="noor-subtitle">
            Each topic gives you a simple Explore-to-Reader path: read, understand, reflect, then respond.
          </p>
        </div>

        <div className="noor-topic-detail-grid">
          {NOOR_GUIDANCE_TOPIC_JOURNEYS.map((topic) => (
            <Link key={topic.id} className="noor-topic-detail-card" href={`/explore/${topic.id}`}>
              <span className="noor-topic-prompt-icon">{topic.arabicKeyword}</span>
              <strong>{topic.label}</strong>
              <span>{topic.prompt}</span>
              <small>{topic.summary}</small>
              <em>Open guided path →</em>
            </Link>
          ))}
        </div>
      </section>

      <SearchPanel />
    </main>
  );
}
