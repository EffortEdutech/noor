import { getSurahContent, getTafseerEntries } from '@noor/data';
import { NoorCard, PageHeader } from '@noor/ui';
import { notFound } from 'next/navigation';
import { AyahStudyCard } from '../../../../components/AyahStudyCard';
import { ReaderPreferencesPanel } from '../../../../components/ReaderPreferencesPanel';
import { ReadingProgressPanel } from '../../../../components/ReadingProgressPanel';
import { getServerNoorContentSource } from '../../../../lib/runtime-content-source';

export const dynamic = 'force-dynamic';

export default async function SurahReaderPage({ params }: { params: Promise<{ surah: string }> }) {
  const { surah: surahParam } = await params;
  const surahNumber = Number(surahParam);
  const contentSource = await getServerNoorContentSource();
  const content = await getSurahContent(surahNumber, { source: contentSource });

  if (!content) notFound();

  const tafseer = await getTafseerEntries('demo-tafseer', surahNumber, { source: contentSource });

  return (
    <main className="noor-page">
      <PageHeader
        kicker="Quran reader"
        title={content.surah.nameTransliteration}
        subtitle={`${content.surah.nameEnglish} · ${content.surah.revelation} · ${content.surah.ayahCount} ayat · Source: ${contentSource}`}
      />

      <section className="noor-grid">
        <NoorCard variant="soft">
          <div className="noor-row">
            <span className="noor-badge emerald">Arabic</span>
            <span className="noor-badge gold">English + Malay</span>
            <span className="noor-badge">Reader preferences</span>
          </div>
          <p className="noor-subtitle" style={{ marginTop: 12 }}>
            Tap <strong>Mark current</strong> on any ayah. NOOR will remember that exact reading point locally on this device.
          </p>
        </NoorCard>

        <ReadingProgressPanel />
      </section>

      <ReaderPreferencesPanel compact />

      <section className="noor-stack">
        {content.ayahs.map((ayah) => {
          const tafseerForAyah = tafseer.find(
            (entry) => ayah.ayah >= entry.fromAyah && ayah.ayah <= entry.toAyah
          );
          return (
            <AyahStudyCard
              key={ayah.key}
              ayah={ayah}
              tafseer={tafseerForAyah}
              surahTitle={content.surah.nameTransliteration}
            />
          );
        })}
      </section>
    </main>
  );
}
