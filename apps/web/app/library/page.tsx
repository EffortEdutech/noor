import { PageHeader } from '@noor/ui';
import { BookmarksPanel } from '../../components/BookmarksPanel';
import { JourneyProgressPanel } from '../../components/JourneyProgressPanel';
import { ReadingProgressPanel } from '../../components/ReadingProgressPanel';
import { ReflectionNotesPanel } from '../../components/ReflectionNotesPanel';

export default function LibraryPage() {
  return (
    <main className="noor-page">
      <PageHeader
        kicker="Library"
        title="Your saved light."
        subtitle="Return to the ayat, hadith, reflections, guidance paths and reading points you saved on this device."
      />
      <ReadingProgressPanel />
      <JourneyProgressPanel />
      <ReflectionNotesPanel />
      <BookmarksPanel />
    </main>
  );
}
