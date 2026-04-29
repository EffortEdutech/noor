import { PageHeader } from '@noor/ui';
import { SearchPanel } from '../../components/SearchPanel';

export default function ExplorePage() {
  return (
    <main className="noor-page">
      <PageHeader
        kicker="Explore"
        title="Search across Quran, Tafseer and Hadith."
        subtitle="Sprint 4 upgrades Explore with ranked local search, content filters, quick topics, suggestions and recent searches. The same contract can later connect to the full CDN search index."
      />
      <SearchPanel />
    </main>
  );
}
