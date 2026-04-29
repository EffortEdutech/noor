import { PageHeader } from '@noor/ui';
import { BookmarksPanel } from '../../components/BookmarksPanel';

export default function LibraryPage() {
  return (
    <main className="noor-page">
      <PageHeader
        kicker="Library"
        title="Your saved light."
        subtitle="Bookmarks are stored locally in this starter pack using browser localStorage. IndexedDB can replace this in the next sprint."
      />
      <BookmarksPanel />
    </main>
  );
}
