import type { SurahContent } from '../types';
import { DEMO_SURAH_INDEX } from './surah-index';

const surah = (number: number) => {
  const found = DEMO_SURAH_INDEX.find((entry) => entry.number === number);
  if (!found) throw new Error(`Missing demo surah index entry: ${number}`);
  return found;
};

export const DEMO_SURAH_CONTENT: Record<number, SurahContent> = {
  1: {
    surah: surah(1),
    ayahs: [
      {
        surah: 1,
        ayah: 1,
        key: '1:1',
        arabic: 'بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ',
        translations: {
          en: 'In the name of Allah, the Most Compassionate, the Most Merciful.',
          ms: 'Dengan nama Allah Yang Maha Pemurah lagi Maha Penyayang.'
        }
      },
      {
        surah: 1,
        ayah: 2,
        key: '1:2',
        arabic: 'الْحَمْدُ لِلَّهِ رَبِّ الْعَالَمِينَ',
        translations: {
          en: 'All praise is for Allah, Lord of all worlds.',
          ms: 'Segala puji bagi Allah, Tuhan seluruh alam.'
        }
      },
      {
        surah: 1,
        ayah: 3,
        key: '1:3',
        arabic: 'الرَّحْمَٰنِ الرَّحِيمِ',
        translations: {
          en: 'The Most Compassionate, the Most Merciful.',
          ms: 'Yang Maha Pemurah lagi Maha Penyayang.'
        }
      },
      {
        surah: 1,
        ayah: 4,
        key: '1:4',
        arabic: 'مَالِكِ يَوْمِ الدِّينِ',
        translations: {
          en: 'Master of the Day of Recompense.',
          ms: 'Pemilik Hari Pembalasan.'
        }
      },
      {
        surah: 1,
        ayah: 5,
        key: '1:5',
        arabic: 'إِيَّاكَ نَعْبُدُ وَإِيَّاكَ نَسْتَعِينُ',
        translations: {
          en: 'You alone we worship, and You alone we ask for help.',
          ms: 'Hanya kepada-Mu kami menyembah dan hanya kepada-Mu kami memohon pertolongan.'
        }
      },
      {
        surah: 1,
        ayah: 6,
        key: '1:6',
        arabic: 'اهْدِنَا الصِّرَاطَ الْمُسْتَقِيمَ',
        translations: {
          en: 'Guide us to the straight path.',
          ms: 'Tunjukilah kami jalan yang lurus.'
        }
      },
      {
        surah: 1,
        ayah: 7,
        key: '1:7',
        arabic: 'صِرَاطَ الَّذِينَ أَنْعَمْتَ عَلَيْهِمْ غَيْرِ الْمَغْضُوبِ عَلَيْهِمْ وَلَا الضَّالِّينَ',
        translations: {
          en: 'The path of those You have blessed, not of those who incur anger, nor of those who are astray.',
          ms: 'Jalan orang-orang yang telah Engkau beri nikmat, bukan jalan mereka yang dimurkai dan bukan pula mereka yang sesat.'
        }
      }
    ]
  },
  112: {
    surah: surah(112),
    ayahs: [
      {
        surah: 112,
        ayah: 1,
        key: '112:1',
        arabic: 'قُلْ هُوَ اللَّهُ أَحَدٌ',
        translations: { en: 'Say, He is Allah, One.', ms: 'Katakanlah: Dialah Allah Yang Maha Esa.' }
      },
      {
        surah: 112,
        ayah: 2,
        key: '112:2',
        arabic: 'اللَّهُ الصَّمَدُ',
        translations: { en: 'Allah, the Eternal Refuge.', ms: 'Allah tempat bergantung segala sesuatu.' }
      },
      {
        surah: 112,
        ayah: 3,
        key: '112:3',
        arabic: 'لَمْ يَلِدْ وَلَمْ يُولَدْ',
        translations: { en: 'He neither begets nor is born.', ms: 'Dia tidak beranak dan tidak pula diperanakkan.' }
      },
      {
        surah: 112,
        ayah: 4,
        key: '112:4',
        arabic: 'وَلَمْ يَكُن لَّهُ كُفُوًا أَحَدٌ',
        translations: { en: 'And there is none comparable to Him.', ms: 'Dan tidak ada sesuatu pun yang setara dengan-Nya.' }
      }
    ]
  },
  113: {
    surah: surah(113),
    ayahs: [
      {
        surah: 113,
        ayah: 1,
        key: '113:1',
        arabic: 'قُلْ أَعُوذُ بِرَبِّ الْفَلَقِ',
        translations: {
          en: 'Say, I seek refuge in the Lord of daybreak.',
          ms: 'Katakanlah: Aku berlindung kepada Tuhan yang menguasai subuh.'
        }
      },
      {
        surah: 113,
        ayah: 2,
        key: '113:2',
        arabic: 'مِن شَرِّ مَا خَلَقَ',
        translations: {
          en: 'From the evil of what He created.',
          ms: 'Daripada kejahatan makhluk yang Dia ciptakan.'
        }
      },
      {
        surah: 113,
        ayah: 3,
        key: '113:3',
        arabic: 'وَمِن شَرِّ غَاسِقٍ إِذَا وَقَبَ',
        translations: {
          en: 'And from the evil of darkness when it settles.',
          ms: 'Dan daripada kejahatan malam apabila telah gelap gelita.'
        }
      },
      {
        surah: 113,
        ayah: 4,
        key: '113:4',
        arabic: 'وَمِن شَرِّ النَّفَّاثَاتِ فِي الْعُقَدِ',
        translations: {
          en: 'And from the evil of those who blow upon knots.',
          ms: 'Dan daripada kejahatan para peniup pada ikatan-ikatan.'
        }
      },
      {
        surah: 113,
        ayah: 5,
        key: '113:5',
        arabic: 'وَمِن شَرِّ حَاسِدٍ إِذَا حَسَدَ',
        translations: {
          en: 'And from the evil of an envier when he envies.',
          ms: 'Dan daripada kejahatan orang yang dengki apabila dia dengki.'
        }
      }
    ]
  },
  114: {
    surah: surah(114),
    ayahs: [
      {
        surah: 114,
        ayah: 1,
        key: '114:1',
        arabic: 'قُلْ أَعُوذُ بِرَبِّ النَّاسِ',
        translations: {
          en: 'Say, I seek refuge in the Lord of mankind.',
          ms: 'Katakanlah: Aku berlindung kepada Tuhan manusia.'
        }
      },
      {
        surah: 114,
        ayah: 2,
        key: '114:2',
        arabic: 'مَلِكِ النَّاسِ',
        translations: {
          en: 'The Sovereign of mankind.',
          ms: 'Raja manusia.'
        }
      },
      {
        surah: 114,
        ayah: 3,
        key: '114:3',
        arabic: 'إِلَٰهِ النَّاسِ',
        translations: {
          en: 'The God of mankind.',
          ms: 'Sembahan manusia.'
        }
      },
      {
        surah: 114,
        ayah: 4,
        key: '114:4',
        arabic: 'مِن شَرِّ الْوَسْوَاسِ الْخَنَّاسِ',
        translations: {
          en: 'From the evil of the retreating whisperer.',
          ms: 'Daripada kejahatan pembisik yang bersembunyi.'
        }
      },
      {
        surah: 114,
        ayah: 5,
        key: '114:5',
        arabic: 'الَّذِي يُوَسْوِسُ فِي صُدُورِ النَّاسِ',
        translations: {
          en: 'Who whispers into the hearts of mankind.',
          ms: 'Yang membisikkan ke dalam dada manusia.'
        }
      },
      {
        surah: 114,
        ayah: 6,
        key: '114:6',
        arabic: 'مِنَ الْجِنَّةِ وَالنَّاسِ',
        translations: {
          en: 'From among jinn and mankind.',
          ms: 'Daripada kalangan jin dan manusia.'
        }
      }
    ]
  }
};
