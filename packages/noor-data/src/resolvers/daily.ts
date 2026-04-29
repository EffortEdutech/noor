import { DEMO_HADITH_ITEMS, DEMO_SURAH_CONTENT } from '@noor/content';

export async function getDailyNoorContent() {
  const fatihah = DEMO_SURAH_CONTENT[1];
  const allAyahs = fatihah.ayahs;
  const allHadith = DEMO_HADITH_ITEMS['demo-nawawi'];
  const daySeed = Math.floor(Date.now() / 86_400_000);

  return {
    ayah: allAyahs[daySeed % allAyahs.length],
    hadith: allHadith[daySeed % allHadith.length]
  };
}
