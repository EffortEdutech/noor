import Link from 'next/link';
import { NoorCard, PageHeader } from '@noor/ui';
import { SearchPanel } from '../../components/SearchPanel';

export default function ExplorePage() {
  return (
    <main className="noor-page">
      <PageHeader
        kicker="Explore"
        title="Discover guidance by need, topic, and source."
        subtitle="Begin with what your heart is asking for today. Choose a prompt, search in simple words, then continue into Quran reading, tafseer understanding, or Hadith reflection."
      />

      <section className="noor-guidance-path-grid" aria-label="Explore guidance journey">
        <NoorCard variant="gold" className="noor-explore-journey-card">
          <span className="noor-badge emerald">Start with a need</span>
          <h2>What are you seeking today?</h2>
          <p className="noor-subtitle">
            Explore mercy, patience, rizq, intention, protection, prayer, repentance and more. NOOR will keep the path connected to verified texts.
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

      <SearchPanel />
    </main>
  );
}
