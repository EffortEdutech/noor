import { PageHeader } from '@noor/ui';
import { SearchPanel } from '../../components/SearchPanel';

export default function ExplorePage() {
  return (
    <main className="noor-page">
      <PageHeader
        kicker="Explore"
        title="Find guidance by topic."
        subtitle="Search Quran, Tafseer and Hadith together. Try mercy, patience, intention, protection, prayer or any reminder you need today."
      />
      <SearchPanel />
    </main>
  );
}
