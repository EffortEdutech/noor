import { getSurahIndex } from '@noor/data';
import { QuranLastVisitLanding } from '../../../components/QuranLastVisitLanding';
import { getServerNoorContentSource } from '../../../lib/runtime-content-source';

export const dynamic = 'force-dynamic';

export default async function QuranIndexPage() {
  const contentSource = await getServerNoorContentSource();
  const surahs = await getSurahIndex({ source: contentSource });

  return <QuranLastVisitLanding surahs={surahs} />;
}
