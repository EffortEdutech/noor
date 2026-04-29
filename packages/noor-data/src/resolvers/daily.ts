import { DEMO_HADITH_ITEMS, DEMO_SURAH_CONTENT } from '@noor/content';

export async function getDailyNoorContent() {
  const allAyahs = Object.values(DEMO_SURAH_CONTENT).flatMap((surah) => surah.ayahs);
  const allHadith = DEMO_HADITH_ITEMS['demo-nawawi'];
  const daySeed = Math.floor(Date.now() / 86_400_000);

  return {
    dateKey: new Date().toISOString().slice(0, 10),
    ayah: allAyahs[daySeed % allAyahs.length],
    hadith: allHadith[daySeed % allHadith.length]
  };
}
