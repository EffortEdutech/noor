import type { Journey } from '../types';

export const DEMO_JOURNEYS: Journey[] = [
  {
    id: 'journey-foundations-of-noor',
    slug: 'foundations-of-noor',
    title: 'Foundations of NOOR',
    subtitle: 'A gentle 5-step path to begin with Quran, intention, tawhid and reflection.',
    description:
      'Start NOOR with a small daily rhythm: read one ayah, connect the meaning, save one reminder and act with intention.',
    difficulty: 'beginner',
    estimatedMinutes: 18,
    stepCount: 5,
    theme: 'Daily beginning',
    icon: '🌙',
    tags: ['beginner', 'quran', 'intention', 'tawhid', 'reflection'],
    steps: [
      {
        id: 'start-with-bismillah',
        title: 'Start with Bismillah',
        body:
          'Begin by reading Al-Fatihah 1:1 slowly. Let the opening remind you that every good journey starts by seeking Allah’s help and mercy.',
        contentType: 'ayah',
        reference: 'Al-Fatihah 1:1',
        href: '/learn/quran/1#ayah-1',
        minutes: 3,
        prompt: 'What is one task today that you want to begin with Bismillah?',
        tags: ['bismillah', 'mercy', 'al-fatihah']
      },
      {
        id: 'remember-your-intention',
        title: 'Remember your intention',
        body:
          'Review the demo hadith on intention. The goal is not only to read more, but to read with a heart that wants guidance.',
        contentType: 'hadith',
        reference: 'Hadith 1 · Intention',
        href: '/learn/hadith',
        minutes: 4,
        prompt: 'Write one sincere intention for your learning journey.',
        tags: ['intention', 'niyyah', 'ikhlas']
      },
      {
        id: 'hold-to-tawhid',
        title: 'Hold to tawhid',
        body:
          'Read Surah Al-Ikhlas. This short surah anchors the heart in the oneness of Allah and keeps learning centred.',
        contentType: 'ayah',
        reference: 'Al-Ikhlas 112',
        href: '/learn/quran/112',
        minutes: 4,
        prompt: 'Which phrase from Al-Ikhlas strengthens your heart today?',
        tags: ['tawhid', 'ikhlas', 'surah']
      },
      {
        id: 'seek-guidance',
        title: 'Ask for guidance',
        body:
          'Return to Al-Fatihah 1:6. “Guide us to the straight path” is a daily dua for knowledge, character and action.',
        contentType: 'ayah',
        reference: 'Al-Fatihah 1:6',
        href: '/learn/quran/1#ayah-6',
        minutes: 3,
        prompt: 'Where do you need guidance most today?',
        tags: ['guidance', 'straight-path', 'dua']
      },
      {
        id: 'carry-one-light',
        title: 'Carry one light',
        body:
          'Save one ayah or hadith into your Library. Your Library becomes your personal collection of reminders.',
        contentType: 'action',
        reference: 'NOOR Library',
        href: '/library',
        minutes: 4,
        prompt: 'Choose one saved reminder and turn it into one small action.',
        tags: ['library', 'bookmark', 'action']
      }
    ]
  },
  {
    id: 'journey-prayer-and-guidance',
    slug: 'prayer-and-guidance',
    title: 'Prayer and Guidance',
    subtitle: 'A short path around Al-Fatihah, worship, help and the straight path.',
    description:
      'Use Al-Fatihah as a daily framework: praise, worship, asking for help, and seeking guidance.',
    difficulty: 'basic',
    estimatedMinutes: 14,
    stepCount: 4,
    theme: 'Daily salah reflection',
    icon: '🕋',
    tags: ['prayer', 'guidance', 'al-fatihah', 'dua'],
    steps: [
      {
        id: 'praise-the-lord',
        title: 'Begin with praise',
        body:
          'Read Al-Fatihah 1:2 and notice how the surah begins by praising Allah, Lord of all worlds.',
        contentType: 'ayah',
        reference: 'Al-Fatihah 1:2',
        href: '/learn/quran/1#ayah-2',
        minutes: 3,
        prompt: 'Name one blessing you want to thank Allah for today.',
        tags: ['praise', 'gratitude', 'al-fatihah']
      },
      {
        id: 'worship-and-help',
        title: 'Worship and seek help',
        body:
          'Read Al-Fatihah 1:5. This ayah joins worship and reliance: “You alone we worship, and You alone we ask for help.”',
        contentType: 'ayah',
        reference: 'Al-Fatihah 1:5',
        href: '/learn/quran/1#ayah-5',
        minutes: 4,
        prompt: 'What is one area where you need Allah’s help today?',
        tags: ['worship', 'reliance', 'help']
      },
      {
        id: 'ask-for-the-path',
        title: 'Ask for the straight path',
        body:
          'Read Al-Fatihah 1:6 and turn it into a personal dua before your next task.',
        contentType: 'ayah',
        reference: 'Al-Fatihah 1:6',
        href: '/learn/quran/1#ayah-6',
        minutes: 3,
        prompt: 'What decision needs guidance?',
        tags: ['guidance', 'dua', 'straight-path']
      },
      {
        id: 'review-your-reading',
        title: 'Review your progress',
        body:
          'Open Today or Library and check your reading point. The aim is small consistency, not pressure.',
        contentType: 'action',
        reference: 'Today + Library',
        href: '/today',
        minutes: 4,
        prompt: 'What is the next small reading habit you can repeat tomorrow?',
        tags: ['habit', 'progress', 'consistency']
      }
    ]
  },
  {
    id: 'journey-protection-and-remembrance',
    slug: 'protection-and-remembrance',
    title: 'Protection and Remembrance',
    subtitle: 'A simple path to remember refuge, mercy and daily protection.',
    description:
      'Build the habit of seeking refuge and keeping the heart close to Allah through short reminders.',
    difficulty: 'beginner',
    estimatedMinutes: 12,
    stepCount: 4,
    theme: 'Remembrance',
    icon: '🛡️',
    tags: ['protection', 'refuge', 'mercy', 'remembrance'],
    steps: [
      {
        id: 'seek-refuge',
        title: 'Seek refuge',
        body:
          'Explore the topic of protection. Later, this journey can connect directly to Al-Falaq and An-Nas when their full text is added to the CDN dataset.',
        contentType: 'reflection',
        reference: 'Protection topic',
        href: '/explore',
        minutes: 3,
        prompt: 'What worry do you want to entrust to Allah today?',
        tags: ['protection', 'refuge', 'trust']
      },
      {
        id: 'remember-mercy',
        title: 'Remember mercy',
        body:
          'Read Al-Fatihah 1:3 and let the names Ar-Rahman and Ar-Rahim soften the heart.',
        contentType: 'ayah',
        reference: 'Al-Fatihah 1:3',
        href: '/learn/quran/1#ayah-3',
        minutes: 3,
        prompt: 'Where can you show mercy to someone today?',
        tags: ['mercy', 'rahman', 'rahim']
      },
      {
        id: 'practice-compassion',
        title: 'Practice compassion',
        body:
          'Review the demo hadith on mercy. Knowledge becomes light when it changes how we treat people.',
        contentType: 'hadith',
        reference: 'Hadith 2 · Mercy',
        href: '/learn/hadith',
        minutes: 3,
        prompt: 'Who can you treat more gently today?',
        tags: ['mercy', 'character', 'compassion']
      },
      {
        id: 'save-a-protection-reminder',
        title: 'Save a reminder',
        body:
          'Save one reminder into Library, then return to it when the day feels heavy.',
        contentType: 'action',
        reference: 'NOOR Library',
        href: '/library',
        minutes: 3,
        prompt: 'Which reminder should be your “protection note” today?',
        tags: ['library', 'bookmark', 'remembrance']
      }
    ]
  }
];
