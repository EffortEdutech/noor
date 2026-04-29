import { PageHeader } from '@noor/ui';
import { SearchPanel } from '../../components/SearchPanel';

export default function ExplorePage() {
  return (
    <main className="noor-page">
      <PageHeader
        kicker="Explore"
        title="Search across light."
        subtitle="Sprint 2 includes local demo search. Later this becomes the full Quran, Tafseer, Hadith and topic index."
      />
      <SearchPanel />
    </main>
  );
}
