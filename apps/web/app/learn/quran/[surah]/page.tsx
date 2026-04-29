import { getSurahContent, getTafseerEntries } from '@noor/data';
import { AyahCard, NoorCard, PageHeader } from '@noor/ui';
import { notFound } from 'next/navigation';

export default async function SurahReaderPage({ params }: { params: Promise<{ surah: string }> }) {
  const { surah: surahParam } = await params;
  const surahNumber = Number(surahParam);
  const content = await getSurahContent(surahNumber);

  if (!content) notFound();

  const tafseer = await getTafseerEntries('demo-tafseer', surahNumber);

  return (
    <main className="noor-page">
      <PageHeader
        kicker="Quran reader"
        title={content.surah.nameTransliteration}
        subtitle={`${content.surah.nameEnglish} · ${content.surah.revelation} · ${content.surah.ayahCount} ayat`}
      />

      <NoorCard variant="soft">
        <div className="noor-row">
          <span className="noor-badge emerald">Arabic</span>
          <span className="noor-badge gold">English + Malay</span>
          <span className="noor-badge">Transliteration</span>
        </div>
        <p className="noor-subtitle" style={{ marginTop: 12 }}>
          This page is powered by <code>@noor/data</code>, not hardcoded page content.
        </p>
      </NoorCard>

      <section className="noor-stack">
        {content.ayahs.map((ayah) => {
          const tafseerForAyah = tafseer.find(
            (entry) => ayah.ayah >= entry.fromAyah && ayah.ayah <= entry.toAyah
          );
          return <AyahCard key={ayah.key} ayah={ayah} tafseer={tafseerForAyah} />;
        })}
      </section>
    </main>
  );
}
