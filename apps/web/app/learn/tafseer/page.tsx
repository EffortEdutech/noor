import Link from 'next/link';
import { getTafseerEntries, getTafseerIndex } from '@noor/data';
import { NoorCard, PageHeader } from '@noor/ui';
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
        title="Tafseer CDN library"
        subtitle={`Read Tafseer from the active runtime source: ${contentSource}.`}
      />

      <section className="noor-card noor-stack">
        <div className="noor-row" style={{ alignItems: 'center', justifyContent: 'space-between', gap: '1rem', flexWrap: 'wrap' }}>
          <div>
            <span className="noor-badge gold">Sprint 27.9.3</span>
            <h2>Tafseer book index</h2>
            <p className="noor-subtitle">
              This page now reads a Tafseer index from the CDN metadata folder, then loads the selected book and Surah through the NOOR data resolver.
            </p>
          </div>
          <div className="noor-row" style={{ gap: '0.5rem', flexWrap: 'wrap' }}>
            <span className="noor-badge">Books: {books.length}</span>
            <span className="noor-badge emerald">Selected Surah: {selectedSurah}</span>
          </div>
        </div>
      </section>

      <section className="noor-grid">
        {books.map((book) => (
          <NoorCard key={book.id}>
            <span className="noor-badge gold">{book.language}</span>
            <h2>{book.label}</h2>
            <p className="noor-subtitle">Book ID: {book.id}</p>
            <p className="noor-subtitle">Surahs: {book.surahCount} · Entries: {book.entryCount}</p>
            <p className="noor-subtitle">Coverage: {book.firstSurah}–{book.lastSurah}</p>
            <Link className="noor-button secondary" href={buildTafseerHref(book.id, book.firstSurah)}>
              Open Tafseer book
            </Link>
          </NoorCard>
        ))}
      </section>

      {selectedBook ? (
        <section className="noor-card noor-stack">
          <div>
            <span className="noor-badge gold">Selected book</span>
            <h2>{selectedBook.label}</h2>
            <p className="noor-subtitle">
              Choose a Surah available in this Tafseer source. Showing Surah {selectedSurah}.
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
              If you expected staging CDN data, regenerate metadata/tafseer-index.json, push it to noor-cdn staging, and restart the dev server with the raw GitHub staging URL.
            </p>
          </NoorCard>
        ) : null}

        {entries.map((entry, index) => (
          <NoorCard key={`${entry.id}-${index}`}>
            <div className="noor-row">
              <span className="noor-badge gold">{entry.sourceLabel}</span>
              <span className="noor-reference">{entry.surah}:{entry.fromAyah}-{entry.toAyah}</span>
            </div>
            <h2>{entry.title}</h2>
            <p className="noor-subtitle">{entry.body}</p>
          </NoorCard>
        ))}
      </section>
    </main>
  );
}
