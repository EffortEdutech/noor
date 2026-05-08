import { SearchPanel } from '../../components/SearchPanel';

export default function ExplorePage() {
  return (
    <main className="noor-page noor-learning-page noor-explore-v2-page">
      <header className="noor-production-header noor-explore-v2-header">
        <span className="noor-kicker">Explore</span>
        <h1>What knowledge are you seeking?</h1>
        <p>
          Search a need, topic, question or reference. NOOR arranges the strongest matches as Quran foundation,
          tafseer understanding and Hadith guidance.
        </p>
      </header>

      <SearchPanel />
    </main>
  );
}
