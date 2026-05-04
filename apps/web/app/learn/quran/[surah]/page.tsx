import { getSurahContent, getSurahIndex, getTafseerEntries } from '@noor/data';
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

  return <QuranReadingExperience content={content} tafseer={tafseer} allSurahs={surahs} />;
}
