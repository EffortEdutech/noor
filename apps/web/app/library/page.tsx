import { PageHeader } from '@noor/ui';
import { BookmarksPanel } from '../../components/BookmarksPanel';
import { JourneyProgressPanel } from '../../components/JourneyProgressPanel';
import { ReadingProgressPanel } from '../../components/ReadingProgressPanel';

export default function LibraryPage() {
  return (
    <main className="noor-page">
      <PageHeader
        kicker="Library"
        title="Your saved light."
        subtitle="Bookmarks, reading progress and journey progress are stored locally on this device for the zero-budget starter phase."
      />
      <ReadingProgressPanel />
      <JourneyProgressPanel />
      <BookmarksPanel />
    </main>
  );
}
