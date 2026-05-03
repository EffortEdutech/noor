import {
  DEMO_HADITH_ITEMS,
  DEMO_JOURNEYS,
  DEMO_SURAH_CONTENT,
  DEMO_TAFSEER_ENTRIES
} from '@noor/content';

export type NoorSearchType = 'quran' | 'tafseer' | 'hadith' | 'journey';

export type NoorSearchTopic = {
  id: string;
  label: string;
  query: string;
  description: string;
  tags: string[];
};

export type NoorSearchResult = {
  id: string;
  type: NoorSearchType;
  title: string;
  excerpt: string;
  reference: string;
  href?: string;
  sourceLabel?: string;
  tags: string[];
  matchedFields: string[];
  score: number;
};

export type NoorSearchOptions = {
  types?: NoorSearchType[];
  limit?: number;
  topic?: string;
};

export type NoorSearchIndexEntry = Omit<NoorSearchResult, 'matchedFields' | 'score'> & {
  searchText: Record<string, string | undefined>;
  priority: number;
};

type SearchCandidate = NoorSearchIndexEntry;

export const NOOR_SEARCH_TYPES: { id: NoorSearchType; label: string; description: string }[] = [
  { id: 'quran', label: 'Quran', description: 'Ayah text, translation, transliteration and surah names.' },
  { id: 'tafseer', label: 'Tafseer', description: 'Explanation entries and tags.' },
  { id: 'hadith', label: 'Hadith', description: 'Hadith translations, narrator, source and tags.' },
  { id: 'journey', label: 'Journey', description: 'Guided learning paths, steps and reflection prompts.' }
];

export const NOOR_SEARCH_TOPICS: NoorSearchTopic[] = [
  {
    id: 'mercy',
    label: 'Mercy',
    query: 'mercy rahman rahim pemurah mengasihani compassion forgiveness hope',
    description: 'Allah’s mercy, compassion, forgiveness and hope.',
    tags: ['mercy', 'rahman', 'rahim', 'forgiveness']
  },
  {
    id: 'patience',
    label: 'Patience',
    query: 'patience sabr steadfast trial hardship difficulty endurance trust',
    description: 'Steadiness during hardship, testing and delay.',
    tags: ['patience', 'sabr', 'steadfastness', 'trial']
  },
  {
    id: 'rizq',
    label: 'Rizq',
    query: 'rizq provision sustenance wealth livelihood trust gratitude effort',
    description: 'Provision, livelihood, gratitude, effort and trust in Allah.',
    tags: ['rizq', 'provision', 'sustenance', 'trust']
  },
  {
    id: 'intention',
    label: 'Intention',
    query: 'intention niat niyyah sincerity actions deeds heart worship',
    description: 'The heart behind every action and act of worship.',
    tags: ['intention', 'niyyah', 'sincerity']
  },
  {
    id: 'protection',
    label: 'Protection',
    query: 'protection refuge falaq nas evil safety remembrance shelter',
    description: 'Seeking refuge, safety and protection from evil.',
    tags: ['protection', 'refuge', 'remembrance']
  },
  {
    id: 'prayer',
    label: 'Prayer',
    query: 'prayer salah solat dua supplication worship guidance straight path',
    description: 'Prayer, du‘a, worship, guidance and nearness to Allah.',
    tags: ['prayer', 'salah', 'dua', 'worship']
  },
  {
    id: 'repentance',
    label: 'Repentance',
    query: 'repentance tawbah taubah forgive forgiveness return mercy sin renewal',
    description: 'Returning to Allah with repentance, forgiveness and renewal.',
    tags: ['repentance', 'tawbah', 'forgiveness', 'return']
  },
  {
    id: 'guidance',
    label: 'Guidance',
    query: 'guide straight path jalan lurus hidayah prayer direction',
    description: 'Seeking guidance and the straight path.',
    tags: ['guidance', 'straight-path', 'hidayah']
  },
  {
    id: 'tawhid',
    label: 'Tawhid',
    query: 'one eternal refuge esa ikhlas foundations sincerity',
    description: 'Oneness of Allah and sincerity of faith.',
    tags: ['tawhid', 'ikhlas', 'oneness']
  }
];

function normalize(value: string | undefined) {
  return (value ?? '')
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^\p{L}\p{N}\s:.-]/gu, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function tokens(query: string) {
  return Array.from(new Set(normalize(query).split(' ').filter((token) => token.length >= 2)));
}

function fieldScore(fieldValue: string | undefined, queryTokens: string[], weight: number) {
  const value = normalize(fieldValue);
  if (!value) return 0;

  let score = 0;
  for (const token of queryTokens) {
    if (value === token) score += weight * 4;
    else if (value.startsWith(token)) score += weight * 3;
    else if (value.includes(token)) score += weight;
  }
  return score;
}

function buildCandidates(): SearchCandidate[] {
  const candidates: SearchCandidate[] = [];

  for (const surah of Object.values(DEMO_SURAH_CONTENT)) {
    for (const ayah of surah.ayahs) {
      candidates.push({
        id: ayah.key,
        type: 'quran',
        title: `${surah.surah.nameTransliteration} ${ayah.ayah}`,
        excerpt: ayah.translations.en ?? ayah.translations.ms ?? ayah.arabic,
        reference: ayah.key,
        href: `/learn/quran/${ayah.surah}#ayah-${ayah.ayah}`,
        sourceLabel: `${surah.surah.nameEnglish} · ${surah.surah.revelation}`,
        tags: [
          surah.surah.slug,
          surah.surah.nameTransliteration.toLowerCase(),
          surah.surah.revelation
        ],
        priority: 4,
        searchText: {
          title: `${surah.surah.nameTransliteration} ${surah.surah.nameEnglish}`,
          reference: ayah.key,
          arabic: ayah.arabic,
          transliteration: ayah.transliteration,
          english: ayah.translations.en,
          malay: ayah.translations.ms,
          tags: surah.surah.slug
        }
      });
    }
  }

  for (const entry of DEMO_TAFSEER_ENTRIES) {
    candidates.push({
      id: entry.id,
      type: 'tafseer',
      title: entry.title,
      excerpt: entry.body,
      reference: `${entry.surah}:${entry.fromAyah}-${entry.toAyah}`,
      href: `/learn/tafseer?surah=${entry.surah}#ayah-${entry.fromAyah}`,
      sourceLabel: entry.sourceLabel,
      tags: entry.tags,
      priority: 3,
      searchText: {
        title: entry.title,
        body: entry.body,
        tags: entry.tags.join(' '),
        source: entry.sourceLabel,
        reference: `${entry.surah}:${entry.fromAyah}-${entry.toAyah}`
      }
    });
  }

  for (const collectionItems of Object.values(DEMO_HADITH_ITEMS)) {
    for (const hadith of collectionItems) {
      const firstTopic = hadith.tags[0];
      const params = new URLSearchParams({ mode: 'reflect' });
      if (firstTopic) params.set('topic', firstTopic.toLowerCase());

      candidates.push({
        id: hadith.id,
        type: 'hadith',
        title: `Hadith ${hadith.number}`,
        excerpt: hadith.translations.en ?? hadith.translations.ms ?? '',
        reference: hadith.sourceLabel,
        href: `/learn/hadith?${params.toString()}#hadith-reader`,
        sourceLabel: hadith.narrator ? `Narrator: ${hadith.narrator}` : hadith.sourceLabel,
        tags: hadith.tags,
        priority: 2,
        searchText: {
          title: `Hadith ${hadith.number}`,
          narrator: hadith.narrator,
          arabic: hadith.arabic,
          english: hadith.translations.en,
          malay: hadith.translations.ms,
          source: hadith.sourceLabel,
          tags: hadith.tags.join(' ')
        }
      });
    }
  }

  for (const journey of DEMO_JOURNEYS) {
    candidates.push({
      id: journey.id,
      type: 'journey',
      title: journey.title,
      excerpt: journey.description,
      reference: `${journey.stepCount} steps · ${journey.estimatedMinutes} min`,
      href: `/journeys/${journey.slug}`,
      sourceLabel: journey.theme,
      tags: journey.tags,
      priority: 3,
      searchText: {
        title: `${journey.title} ${journey.subtitle}`,
        body: journey.description,
        tags: journey.tags.join(' '),
        source: journey.theme,
        steps: journey.steps
          .map((step) => [step.title, step.body, step.reference, step.prompt, step.tags.join(' ')].join(' '))
          .join(' ')
      }
    });
  }

  return candidates;
}

function scoreCandidate(candidate: SearchCandidate, queryTokens: string[]) {
  const weightedFields: Array<[string, string | undefined, number]> = [
    ['title', candidate.searchText.title, 8],
    ['reference', candidate.searchText.reference, 7],
    ['tags', candidate.searchText.tags, 6],
    ['english', candidate.searchText.english, 5],
    ['malay', candidate.searchText.malay, 5],
    ['transliteration', candidate.searchText.transliteration, 4],
    ['body', candidate.searchText.body, 4],
    ['steps', candidate.searchText.steps, 4],
    ['source', candidate.searchText.source, 3],
    ['narrator', candidate.searchText.narrator, 3],
    ['arabic', candidate.searchText.arabic, 2]
  ];

  let score = candidate.priority;
  const matchedFields: string[] = [];

  for (const [fieldName, fieldValue, weight] of weightedFields) {
    const field = fieldScore(fieldValue, queryTokens, weight);
    if (field > 0) {
      score += field;
      matchedFields.push(fieldName);
    }
  }

  return { score, matchedFields };
}

function runSearchCandidates(
  candidates: SearchCandidate[],
  query: string,
  options: NoorSearchOptions = {}
): NoorSearchResult[] {
  const q = query.trim();
  const queryTokens = tokens(q);
  if (queryTokens.length === 0) return [];

  const allowedTypes = new Set(options.types ?? NOOR_SEARCH_TYPES.map((item) => item.id));
  const limit = options.limit ?? 18;
  const topic = options.topic ? NOOR_SEARCH_TOPICS.find((item) => item.id === options.topic) : undefined;
  const topicTokens = topic ? tokens(topic.query) : [];
  const activeTokens = Array.from(new Set([...queryTokens, ...topicTokens]));

  return candidates
    .filter((candidate) => allowedTypes.has(candidate.type))
    .map((candidate) => {
      const { score, matchedFields } = scoreCandidate(candidate, activeTokens);
      return {
        id: candidate.id,
        type: candidate.type,
        title: candidate.title,
        excerpt: candidate.excerpt,
        reference: candidate.reference,
        href: candidate.href,
        sourceLabel: candidate.sourceLabel,
        tags: candidate.tags,
        matchedFields,
        score
      };
    })
    .filter((result) => result.score > 0 && result.matchedFields.length > 0)
    .sort((a, b) => b.score - a.score || a.title.localeCompare(b.title))
    .slice(0, limit);
}

export function getNoorSearchTypeLabel(type: NoorSearchType) {
  return NOOR_SEARCH_TYPES.find((item) => item.id === type)?.label ?? type;
}

export function searchNoorLocal(query: string, options: NoorSearchOptions = {}): NoorSearchResult[] {
  return runSearchCandidates(buildCandidates(), query, options);
}

export function searchNoorIndex(
  query: string,
  index: NoorSearchIndexEntry[],
  options: NoorSearchOptions = {}
): NoorSearchResult[] {
  return runSearchCandidates(index, query, options);
}

export function getNoorSearchSuggestions(query: string, limit = 6) {
  const q = normalize(query);
  if (!q) return NOOR_SEARCH_TOPICS.slice(0, limit);

  return NOOR_SEARCH_TOPICS
    .filter((topic) => {
      const joined = normalize([topic.label, topic.query, topic.description, topic.tags.join(' ')].join(' '));
      return joined.includes(q);
    })
    .slice(0, limit);
}

export type NoorGuidanceJourneyStep = {
  id: 'quran' | 'tafseer' | 'hadith';
  label: string;
  title: string;
  body: string;
  href: string;
  actionLabel: string;
};

export type NoorGuidanceTopicJourney = {
  id: string;
  label: string;
  arabicKeyword: string;
  prompt: string;
  summary: string;
  question: string;
  action: string;
  suggestedSearches: string[];
  readerSteps: NoorGuidanceJourneyStep[];
};

function buildTopicReaderSteps(topicId: string, quranHref: string, tafseerHref: string): NoorGuidanceJourneyStep[] {
  const encodedTopic = encodeURIComponent(topicId);
  return [
    {
      id: 'quran',
      label: 'Read',
      title: 'Begin with the Quran',
      body: 'Start by reading slowly. Let the ayah set the direction before moving into explanation or reflection.',
      href: quranHref,
      actionLabel: 'Open Quran reader'
    },
    {
      id: 'tafseer',
      label: 'Understand',
      title: 'Continue with Tafseer',
      body: 'Read the explanation so the topic is understood with care, context and humility.',
      href: tafseerHref,
      actionLabel: 'Open Tafseer understanding'
    },
    {
      id: 'hadith',
      label: 'Reflect',
      title: 'Reflect with Hadith',
      body: 'Move into Prophetic reminders and choose one action that can be practiced today.',
      href: '/learn/hadith?mode=reflect&topic=' + encodedTopic + '#hadith-reader',
      actionLabel: 'Open Hadith reader'
    }
  ];
}

export const NOOR_GUIDANCE_TOPIC_JOURNEYS: NoorGuidanceTopicJourney[] = [
  {
    id: 'mercy',
    label: 'Mercy',
    arabicKeyword: 'رحمة',
    prompt: 'When I need hope in Allah’s mercy',
    summary: 'A guided path for hope, compassion, forgiveness and returning to Allah.',
    question: 'Where do I need to remember that Allah’s mercy is wider than my fear?',
    action: 'Make one sincere du‘a for mercy, then show mercy to one person before the day ends.',
    suggestedSearches: ['mercy', 'forgiveness', 'hope'],
    readerSteps: buildTopicReaderSteps('mercy', '/learn/quran/1#ayah-1', '/learn/tafseer?surah=1#ayah-1')
  },
  {
    id: 'patience',
    label: 'Patience',
    arabicKeyword: 'صبر',
    prompt: 'When I am tested and need sabr',
    summary: 'A guided path for hardship, steadiness, trials and trust.',
    question: 'What test needs patience from me today instead of panic or complaint?',
    action: 'Name the test, pause before reacting, and make one patient choice with your words or actions.',
    suggestedSearches: ['patience', 'sabr', 'trial'],
    readerSteps: buildTopicReaderSteps('patience', '/learn/quran', '/learn/tafseer')
  },
  {
    id: 'rizq',
    label: 'Rizq',
    arabicKeyword: 'رزق',
    prompt: 'When I worry about provision',
    summary: 'A guided path for sustenance, trust, gratitude and effort.',
    question: 'Where can I combine trust in Allah with honest effort today?',
    action: 'Write one blessing you already have, then take one responsible step toward your work or provision.',
    suggestedSearches: ['rizq', 'provision', 'gratitude'],
    readerSteps: buildTopicReaderSteps('rizq', '/learn/quran', '/learn/tafseer')
  },
  {
    id: 'intention',
    label: 'Intention',
    arabicKeyword: 'نية',
    prompt: 'When I want to purify my intention',
    summary: 'A guided path for sincerity, deeds, worship and the heart.',
    question: 'Which action today needs to be returned from people’s praise back to Allah?',
    action: 'Renew your intention quietly before one task, and avoid announcing it unless there is benefit.',
    suggestedSearches: ['intention', 'sincerity', 'heart'],
    readerSteps: buildTopicReaderSteps('intention', '/learn/quran/112', '/learn/tafseer?surah=112')
  },
  {
    id: 'protection',
    label: 'Protection',
    arabicKeyword: 'حفظ',
    prompt: 'When I seek refuge and safety',
    summary: 'A guided path for refuge, remembrance, evil and safety.',
    question: 'What fear should I bring back to Allah through refuge and remembrance?',
    action: 'Read a short protection reminder and make one du‘a for safety with presence.',
    suggestedSearches: ['protection', 'refuge', 'remembrance'],
    readerSteps: buildTopicReaderSteps('protection', '/learn/quran/113#ayah-1', '/learn/tafseer?surah=113#ayah-1')
  },
  {
    id: 'prayer',
    label: 'Prayer',
    arabicKeyword: 'صلاة',
    prompt: 'When I want to return to prayer',
    summary: 'A guided path for salah, du‘a, guidance and nearness.',
    question: 'Which prayer can I improve today through presence, timing or humility?',
    action: 'Choose one prayer today to perform more slowly, with one du‘a after it.',
    suggestedSearches: ['prayer', 'salah', 'dua'],
    readerSteps: buildTopicReaderSteps('prayer', '/learn/quran/1#ayah-5', '/learn/tafseer?surah=1#ayah-5')
  },
  {
    id: 'repentance',
    label: 'Repentance',
    arabicKeyword: 'توبة',
    prompt: 'When I want to come back to Allah',
    summary: 'A guided path for tawbah, forgiveness, humility and renewal.',
    question: 'What can I leave, repair or ask forgiveness for today?',
    action: 'Make sincere istighfar, stop one harmful action, and repair one right if you are able.',
    suggestedSearches: ['repentance', 'tawbah', 'forgiveness'],
    readerSteps: buildTopicReaderSteps('repentance', '/learn/quran/1#ayah-3', '/learn/tafseer?surah=1#ayah-3')
  }
];

export function getNoorGuidanceTopicJourney(topicId: string) {
  const normalized = topicId.trim().toLowerCase();
  return NOOR_GUIDANCE_TOPIC_JOURNEYS.find((topic) => topic.id === normalized);
}

