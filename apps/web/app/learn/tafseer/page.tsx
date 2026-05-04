import Link from 'next/link';
import { getTafseerEntries, getTafseerIndex } from '@noor/data';
import { NoorCard, PageHeader, SourceConnectionsPanel } from '@noor/ui';
import { getServerNoorContentSource } from '../../../lib/runtime-content-source';

export const dynamic = 'force-dynamic';

type SearchParamValue = string | string[] | undefined;

type TafseerPageProps = {
  searchParams?: Promise<Record<string, SearchParamValue>>;
};

function firstValue(value: SearchParamValue): string | undefined {
  if (Array.isArray(value)) return value[0];
  return value;
}

function parseSurah(value: SearchParamValue): number | undefined {
  const raw = firstValue(value);
  if (!raw) return undefined;
  const parsed = Number.parseInt(raw, 10);
  if (!Number.isFinite(parsed) || parsed < 1 || parsed > 114) return undefined;
  return parsed;
}

function buildTafseerHref(bookId: string, surah: number) {
  const params = new URLSearchParams({
    book: bookId,
    surah: String(surah)
  });

  return `/learn/tafseer?${params.toString()}`;
}

function getPrimaryTopic(tags: string[]) {
  return tags.find((tag) => tag.trim().length > 1)?.toLowerCase() ?? 'guidance';
}

export default async function TafseerPage({ searchParams }: TafseerPageProps) {
  const params = (await searchParams) ?? {};
  const contentSource = await getServerNoorContentSource();
  const books = await getTafseerIndex({ source: contentSource });

  const selectedBookId = firstValue(params.book);
  const selectedBook = books.find((book) => book.id === selectedBookId) ?? books[0];
  const selectedSurah = parseSurah(params.surah) ?? selectedBook?.firstSurah ?? 1;
  const entries = selectedBook
    ? await getTafseerEntries(selectedBook.id, selectedSurah, { source: contentSource })
    : [];

  const availableSurahs = selectedBook?.availableSurahs?.length
    ? selectedBook.availableSurahs
    : [selectedSurah];

  return (
    <main className="noor-page">
      <PageHeader
        kicker="Tafseer"
        title="Understand the Quran."
        subtitle="Tafseer helps explain the ayat you are reading. Use this library for browsing, or open a Surah and switch the Quran reader to Study mode."
      />

      <section className="noor-hero-grid">
        <NoorCard variant="gold" className="noor-link-card">
          <span className="noor-badge emerald">Best experience</span>
          <h2>Study tafseer inside the Quran reader</h2>
          <p className="noor-subtitle">
            Open a Surah, choose Study mode, then read the tafseer note beside the ayah context.
          </p>
          <Link className="noor-button" href="/learn/quran/1">Open Quran Study mode</Link>
        </NoorCard>

        <NoorCard variant="soft" className="noor-tafseer-workflow-card">
          <span className="noor-kicker">Tafseer study workflow</span>
          <h2>Read → Understand → Respond</h2>
          <p className="noor-subtitle">
            Start with the ayah, read the explanation, then choose one action, du‘a, correction, or gratitude to carry into the day.
          </p>
        </NoorCard>
      </section>

      <section className="noor-hero-grid">
        <NoorCard variant="soft">
          <span className="noor-kicker">Browse tafseer</span>
          <h2>{selectedBook?.label ?? 'No Tafseer book found'}</h2>
          <p className="noor-subtitle">
            Showing Surah {selectedSurah}. Choose another book or Surah below when available.
          </p>
        </NoorCard>

        <NoorCard>
          <span className="noor-kicker">How to benefit</span>
          <p className="noor-subtitle">
            The tafseer library is for deeper browsing. For daily reading, the clearest path is still Quran reader → Study mode → Understand this ayah.
          </p>
        </NoorCard>
      </section>

      <section className="noor-grid">
        {books.map((book) => (
          <NoorCard key={book.id} className="noor-link-card">
            <span className="noor-badge gold">{book.language}</span>
            <h2>{book.label}</h2>
            <p className="noor-subtitle">Surahs: {book.surahCount} · Entries: {book.entryCount}</p>
            <p className="noor-subtitle">Coverage: {book.firstSurah}–{book.lastSurah}</p>
            <Link className="noor-button secondary" href={buildTafseerHref(book.id, book.firstSurah)}>
              Open this tafseer
            </Link>
          </NoorCard>
        ))}
      </section>

      {selectedBook ? (
        <section className="noor-card noor-stack">
          <div>
            <span className="noor-badge gold">Choose Surah</span>
            <h2>{selectedBook.label}</h2>
            <p className="noor-subtitle">
              Select a Surah available in this source. Each entry should support understanding, not replace direct Quran reading.
            </p>
          </div>

          <div className="noor-row" style={{ gap: '0.5rem', flexWrap: 'wrap' }}>
            {availableSurahs.slice(0, 114).map((surah) => (
              <Link
                key={`${selectedBook.id}-${surah}`}
                className={`noor-button ${surah === selectedSurah ? 'primary' : 'secondary'}`}
                href={buildTafseerHref(selectedBook.id, surah)}
              >
                {surah}
              </Link>
            ))}
          </div>
        </section>
      ) : null}

      <section className="noor-stack">
        {entries.length === 0 ? (
          <NoorCard>
            <span className="noor-badge">No entries</span>
            <h2>No Tafseer entries found for this selection</h2>
            <p className="noor-subtitle">
              Try another book or Surah. Future content cycles can improve tafseer coverage and language support.
            </p>
          </NoorCard>
        ) : null}

        {entries.map((entry, index) => {
          const primaryTopic = getPrimaryTopic(entry.tags);

          return (
            <NoorCard key={`${entry.id}-${index}`} className="noor-tafseer-entry">
              <div className="noor-row">
                <span className="noor-badge gold">Understand this passage</span>
                <span className="noor-reference">{entry.surah}:{entry.fromAyah}-{entry.toAyah}</span>
              </div>
              <h2>{entry.title}</h2>
              <div className="noor-understanding-flow" aria-label="Read, understand, respond workflow">
                <div>
                  <strong>Read</strong>
                  <span>Surah {entry.surah}</span>
                </div>
                <div>
                  <strong>Understand</strong>
                  <span>{entry.sourceLabel}</span>
                </div>
                <div>
                  <strong>Respond</strong>
                  <span>One action today</span>
                </div>
              </div>
              <p className="noor-subtitle">{entry.body}</p>

              <SourceConnectionsPanel
                compact
                subtitle="This tafseer explains an ayah or passage. Continue back to Quran context, related topic, or Hadith reminders."
                connections={[
                  {
                    label: 'Quran',
                    badge: 'Quran',
                    title: 'Read in Quran context',
                    description: `Open Surah ${entry.surah} from ayah ${entry.fromAyah}.`,
                    href: `/learn/quran/${entry.surah}#ayah-${entry.fromAyah}`
                  },
                  {
                    label: 'Topic',
                    badge: 'Topic',
                    title: `Explore ${primaryTopic}`,
                    description: 'Search Quran, Tafseer and Hadith together through this theme.',
                    href: `/explore?topic=${encodeURIComponent(primaryTopic)}`
                  },
                  {
                    label: 'Hadith',
                    badge: 'Hadith',
                    title: 'Find related Hadith reminders',
                    description: 'Continue from explanation into Prophetic application.',
                    href: `/learn/hadith?mode=reflect&topic=${encodeURIComponent(primaryTopic)}#hadith-reader`
                  }
                ]}
              />

              <div className="noor-card-actions" style={{ marginTop: 14 }}>
                <Link className="noor-button secondary" href={`/learn/quran/${entry.surah}#ayah-${entry.fromAyah}`}>
                  Read in Quran context
                </Link>
              </div>
            </NoorCard>
          );
        })}
      </section>
    </main>
  );
}
