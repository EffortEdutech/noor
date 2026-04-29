import type { SurahContent } from '../types';
import { DEMO_SURAH_INDEX } from './surah-index';

function surahMeta(number: number) {
  const surah = DEMO_SURAH_INDEX.find((item) => item.number === number);
  if (!surah) throw new Error(`Missing demo surah metadata: ${number}`);
  return surah;
}

export const DEMO_SURAH_CONTENT: Record<number, SurahContent> = {
  1: {
    surah: surahMeta(1),
    ayahs: [
      {
        surah: 1, ayah: 1, key: '1:1',
        arabic: 'بِسْمِ اللَّهِ الرَّحْمَـٰنِ الرَّحِيمِ',
        transliteration: 'Bismi Allāhi ar-Raḥmāni ar-Raḥīm',
        translations: { en: 'In the name of Allah, the Entirely Merciful, the Especially Merciful.', ms: 'Dengan nama Allah, Yang Maha Pemurah, lagi Maha Mengasihani.' }
      },
      {
        surah: 1, ayah: 2, key: '1:2',
        arabic: 'الْحَمْدُ لِلَّهِ رَبِّ الْعَالَمِينَ',
        transliteration: 'Al-ḥamdu lillāhi rabbi al-ʿālamīn',
        translations: { en: 'All praise is due to Allah, Lord of the worlds.', ms: 'Segala puji tertentu bagi Allah, Tuhan yang memelihara dan mentadbirkan sekalian alam.' }
      },
      {
        surah: 1, ayah: 3, key: '1:3',
        arabic: 'الرَّحْمَـٰنِ الرَّحِيمِ',
        transliteration: 'Ar-Raḥmāni ar-Raḥīm',
        translations: { en: 'The Entirely Merciful, the Especially Merciful.', ms: 'Yang Maha Pemurah, lagi Maha Mengasihani.' }
      },
      {
        surah: 1, ayah: 4, key: '1:4',
        arabic: 'مَالِكِ يَوْمِ الدِّينِ',
        transliteration: 'Māliki yawmi ad-dīn',
        translations: { en: 'Sovereign of the Day of Recompense.', ms: 'Yang Menguasai pemerintahan hari Pembalasan.' }
      },
      {
        surah: 1, ayah: 5, key: '1:5',
        arabic: 'إِيَّاكَ نَعْبُدُ وَإِيَّاكَ نَسْتَعِينُ',
        transliteration: 'Iyyāka naʿbudu wa iyyāka nastaʿīn',
        translations: { en: 'It is You we worship and You we ask for help.', ms: 'Engkaulah sahaja yang kami sembah, dan kepada Engkaulah sahaja kami memohon pertolongan.' }
      },
      {
        surah: 1, ayah: 6, key: '1:6',
        arabic: 'اهْدِنَا الصِّرَاطَ الْمُسْتَقِيمَ',
        transliteration: 'Ihdinā aṣ-ṣirāṭa al-mustaqīm',
        translations: { en: 'Guide us to the straight path.', ms: 'Tunjukilah kami jalan yang lurus.' }
      },
      {
        surah: 1, ayah: 7, key: '1:7',
        arabic: 'صِرَاطَ الَّذِينَ أَنْعَمْتَ عَلَيْهِمْ غَيْرِ الْمَغْضُوبِ عَلَيْهِمْ وَلَا الضَّالِّينَ',
        transliteration: 'Ṣirāṭa alladhīna anʿamta ʿalayhim ghayri al-maghḍūbi ʿalayhim wa lā aḍ-ḍāllīn',
        translations: { en: 'The path of those upon whom You have bestowed favor, not of those who have evoked anger or of those who are astray.', ms: 'Iaitu jalan orang-orang yang Engkau telah kurniakan nikmat kepada mereka, bukan jalan orang-orang yang Engkau murkai, dan bukan pula jalan orang-orang yang sesat.' }
      }
    ]
  },
  112: {
    surah: surahMeta(112),
    ayahs: [
      { surah: 112, ayah: 1, key: '112:1', arabic: 'قُلْ هُوَ اللَّهُ أَحَدٌ', transliteration: 'Qul huwa Allāhu aḥad', translations: { en: 'Say, He is Allah, [who is] One.', ms: 'Katakanlah: Dialah Allah, Yang Maha Esa.' } },
      { surah: 112, ayah: 2, key: '112:2', arabic: 'اللَّهُ الصَّمَدُ', transliteration: 'Allāhu aṣ-ṣamad', translations: { en: 'Allah, the Eternal Refuge.', ms: 'Allah Yang menjadi tumpuan sekalian makhluk.' } },
      { surah: 112, ayah: 3, key: '112:3', arabic: 'لَمْ يَلِدْ وَلَمْ يُولَدْ', transliteration: 'Lam yalid wa lam yūlad', translations: { en: 'He neither begets nor is born.', ms: 'Ia tiada beranak, dan Ia pula tidak diperanakkan.' } },
      { surah: 112, ayah: 4, key: '112:4', arabic: 'وَلَمْ يَكُن لَّهُ كُفُوًا أَحَدٌ', transliteration: 'Wa lam yakun lahu kufuwan aḥad', translations: { en: 'Nor is there to Him any equivalent.', ms: 'Dan tidak ada sesiapapun yang serupa denganNya.' } }
    ]
  }
};
