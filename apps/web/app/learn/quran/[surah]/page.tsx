import { getSurahContent, getSurahIndex, getTafseerEntries } from '@noor/data';
import { PageHeader } from '@noor/ui';
import { notFound } from 'next/navigation';
import { QuranReadingExperience } from '../../../../components/QuranReadingExperience';
import { getServerNoorContentSource } from '../../../../lib/runtime-content-source';

export const dynamic = 'force-dynamic';

export default async function SurahReaderPage({ params }: { params: Promise<{ surah: string }> }) {
  const { surah: surahParam } = await params;
  const surahNumber = Number(surahParam);
  const contentSource = await getServerNoorContentSource();
  const [content, surahs] = await Promise.all([
    getSurahContent(surahNumber, { source: contentSource }),
    getSurahIndex({ source: contentSource })
  ]);

  if (!content) notFound();

  const tafseer = await getTafseerEntries('demo-tafseer', surahNumber, { source: contentSource });

  return (
    <main className="noor-page noor-reader-page noor-quran-reader-page">
      <PageHeader
        kicker="Quran reader"
        title={content.surah.nameTransliteration}
        subtitle={`${content.surah.nameEnglish} · ${content.surah.revelation} · ${content.surah.ayahCount} ayat`}
      />

      <QuranReadingExperience content={content} tafseer={tafseer} allSurahs={surahs} />
    </main>
  );
}
