export type GuidanceTopicId =
  | 'mercy'
  | 'patience'
  | 'rizq'
  | 'intention'
  | 'protection'
  | 'prayer'
  | 'repentance';

export type GuidanceTopicStep = {
  id: string;
  label: string;
  helper: string;
  href: string;
};

export type GuidanceTopicDetail = {
  id: GuidanceTopicId;
  label: string;
  arabic: string;
  prompt: string;
  description: string;
  searchQuery: string;
  intention: string;
  dailyPractice: string;
  responsePrompt: string;
  quranHref: string;
  tafseerHref: string;
  hadithHref: string;
  exploreHref: string;
  steps: GuidanceTopicStep[];
};

function topicSteps(topic: {
  id: GuidanceTopicId;
  quranHref: string;
  tafseerHref: string;
  hadithHref: string;
  exploreHref: string;
}): GuidanceTopicStep[] {
  return [
    {
      id: 'read-quran',
      label: 'Read Quran',
      helper: 'Begin with the ayah and read it slowly in context.',
      href: topic.quranHref
    },
    {
      id: 'understand-tafseer',
      label: 'Understand Tafseer',
      helper: 'Open the explanation and ask what Allah is teaching you.',
      href: topic.tafseerHref
    },
    {
      id: 'reflect-hadith',
      label: 'Reflect with Hadith',
      helper: 'Connect the topic to Prophetic guidance and character.',
      href: topic.hadithHref
    },
    {
      id: 'respond-today',
      label: 'Respond today',
      helper: 'Save one reflection and one action for your day.',
      href: topic.exploreHref
    }
  ];
}

const baseTopics: Omit<GuidanceTopicDetail, 'steps'>[] = [
  {
    id: 'mercy',
    label: 'Mercy',
    arabic: 'رحمة',
    prompt: 'When I need hope in Allah’s mercy',
    description: 'For hope, compassion, forgiveness and returning to Allah with a softer heart.',
    searchQuery: 'mercy rahman rahim compassion forgiveness hope',
    intention: 'I will return to Allah with hope, not despair.',
    dailyPractice: 'Show mercy to one person today, even in a small private way.',
    responsePrompt: 'Where do I need to receive mercy, and where can I show mercy today?',
    quranHref: '/learn/quran/1#ayah-3',
    tafseerHref: '/learn/tafseer?surah=1#ayah-3',
    hadithHref: '/learn/hadith?mode=reflect&topic=mercy#hadith-reader',
    exploreHref: '/explore/mercy'
  },
  {
    id: 'patience',
    label: 'Patience',
    arabic: 'صبر',
    prompt: 'When I am tested and need sabr',
    description: 'For hardship, delay, pressure and learning to stay steady with Allah.',
    searchQuery: 'patience sabr steadfast trial hardship trust help',
    intention: 'I will take the next right step without giving up.',
    dailyPractice: 'Pause before reacting once today, then choose the calmer response.',
    responsePrompt: 'What test is asking me to grow in patience right now?',
    quranHref: '/learn/quran/1#ayah-5',
    tafseerHref: '/learn/tafseer?surah=1#ayah-5',
    hadithHref: '/learn/hadith?mode=reflect&topic=patience#hadith-reader',
    exploreHref: '/explore/patience'
  },
  {
    id: 'rizq',
    label: 'Rizq',
    arabic: 'رزق',
    prompt: 'When I worry about provision',
    description: 'For sustenance, effort, gratitude and trust when provision feels tight.',
    searchQuery: 'rizq provision sustenance livelihood trust gratitude effort',
    intention: 'I will work responsibly and trust the Provider.',
    dailyPractice: 'Name one provision already present today and thank Allah for it.',
    responsePrompt: 'What part of rizq am I trying to control instead of entrusting to Allah?',
    quranHref: '/learn/quran/1#ayah-2',
    tafseerHref: '/learn/tafseer?surah=1#ayah-2',
    hadithHref: '/learn/hadith?mode=reflect&topic=rizq#hadith-reader',
    exploreHref: '/explore/rizq'
  },
  {
    id: 'intention',
    label: 'Intention',
    arabic: 'نية',
    prompt: 'When I want to purify my intention',
    description: 'For sincerity, deeds, worship and checking the heart before action.',
    searchQuery: 'intention niyyah sincerity actions deeds heart worship',
    intention: 'I will begin again for Allah, not for praise.',
    dailyPractice: 'Before one task today, quietly renew your intention.',
    responsePrompt: 'What action needs a cleaner intention before I continue?',
    quranHref: '/learn/quran/1#ayah-5',
    tafseerHref: '/learn/tafseer?surah=1#ayah-5',
    hadithHref: '/learn/hadith?mode=reflect&topic=intention#hadith-reader',
    exploreHref: '/explore/intention'
  },
  {
    id: 'protection',
    label: 'Protection',
    arabic: 'حفظ',
    prompt: 'When I seek refuge and safety',
    description: 'For seeking refuge, safety, remembrance and protection from evil.',
    searchQuery: 'protection refuge falaq nas evil safety remembrance shelter',
    intention: 'I will seek refuge in Allah before fear controls me.',
    dailyPractice: 'Read one protection surah slowly and make du‘a for safety.',
    responsePrompt: 'What fear do I need to place under Allah’s protection?',
    quranHref: '/learn/quran/113#ayah-1',
    tafseerHref: '/learn/tafseer?surah=113#ayah-1',
    hadithHref: '/learn/hadith?mode=reflect&topic=protection#hadith-reader',
    exploreHref: '/explore/protection'
  },
  {
    id: 'prayer',
    label: 'Prayer',
    arabic: 'صلاة',
    prompt: 'When I want to return to prayer',
    description: 'For salah, du‘a, guidance, nearness and asking Allah for help.',
    searchQuery: 'prayer salah solat dua supplication worship guidance straight path',
    intention: 'I will return to Allah through prayer one step at a time.',
    dailyPractice: 'Protect one prayer time today and arrive to it earlier than usual.',
    responsePrompt: 'What would make my next prayer more present and sincere?',
    quranHref: '/learn/quran/1#ayah-6',
    tafseerHref: '/learn/tafseer?surah=1#ayah-6',
    hadithHref: '/learn/hadith?mode=reflect&topic=prayer#hadith-reader',
    exploreHref: '/explore/prayer'
  },
  {
    id: 'repentance',
    label: 'Repentance',
    arabic: 'توبة',
    prompt: 'When I want to come back to Allah',
    description: 'For tawbah, forgiveness, renewal and returning after mistakes.',
    searchQuery: 'repentance tawbah forgive forgiveness return mercy sin renewal',
    intention: 'I will come back to Allah today without delay.',
    dailyPractice: 'Make istighfar slowly, then repair one small thing you can repair.',
    responsePrompt: 'What is one honest step of return I can take today?',
    quranHref: '/learn/quran/1#ayah-3',
    tafseerHref: '/learn/tafseer?surah=1#ayah-3',
    hadithHref: '/learn/hadith?mode=reflect&topic=repentance#hadith-reader',
    exploreHref: '/explore/repentance'
  }
];

export const GUIDANCE_TOPIC_DETAILS: GuidanceTopicDetail[] = baseTopics.map((topic) => ({
  ...topic,
  steps: topicSteps(topic)
}));

export function getGuidanceTopic(topicId: string | undefined) {
  return GUIDANCE_TOPIC_DETAILS.find((topic) => topic.id === topicId);
}

export function getDailyGuidanceTopic(date = new Date()) {
  const daySeed = Math.floor(date.getTime() / 86_400_000);
  return GUIDANCE_TOPIC_DETAILS[daySeed % GUIDANCE_TOPIC_DETAILS.length];
}
