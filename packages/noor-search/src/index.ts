import {
  DEMO_HADITH_ITEMS,
  DEMO_SURAH_CONTENT,
  DEMO_TAFSEER_ENTRIES
} from '@noor/content';

export type NoorSearchType = 'quran' | 'tafseer' | 'hadith';

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

type SearchCandidate = Omit<NoorSearchResult, 'matchedFields' | 'score'> & {
  searchText: Record<string, string | undefined>;
  priority: number;
};

export const NOOR_SEARCH_TYPES: { id: NoorSearchType; label: string; description: string }[] = [
  { id: 'quran', label: 'Quran', description: 'Ayah text, translation, transliteration and surah names.' },
  { id: 'tafseer', label: 'Tafseer', description: 'Explanation entries and tags.' },
  { id: 'hadith', label: 'Hadith', description: 'Hadith translations, narrator, source and tags.' }
];

export const NOOR_SEARCH_TOPICS: NoorSearchTopic[] = [
  {
    id: 'mercy',
    label: 'Mercy',
    query: 'mercy rahman rahim pemurah mengasihani',
    description: 'Allah’s mercy and compassion.',
    tags: ['mercy', 'rahman', 'rahim']
  },
  {
    id: 'guidance',
    label: 'Guidance',
    query: 'guide straight path jalan lurus hidayah',
    description: 'Seeking guidance and the straight path.',
    tags: ['guidance', 'straight-path']
  },
  {
    id: 'tawhid',
    label: 'Tawhid',
    query: 'one eternal refuge esa ikhlas',
    description: 'Oneness of Allah and sincerity of faith.',
    tags: ['tawhid', 'ikhlas']
  },
  {
    id: 'intention',
    label: 'Intention',
    query: 'intention niat actions deeds',
    description: 'The heart behind every action.',
    tags: ['intention', 'niyyah']
  },
  {
    id: 'protection',
    label: 'Protection',
    query: 'protection refuge falaq nas evil',
    description: 'Seeking refuge and protection.',
    tags: ['protection', 'refuge']
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
      href: `/learn/quran/${entry.surah}#ayah-${entry.fromAyah}`,
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
      candidates.push({
        id: hadith.id,
        type: 'hadith',
        title: `Hadith ${hadith.number}`,
        excerpt: hadith.translations.en ?? hadith.translations.ms ?? '',
        reference: hadith.sourceLabel,
        href: '/learn/hadith',
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

export function getNoorSearchTypeLabel(type: NoorSearchType) {
  return NOOR_SEARCH_TYPES.find((item) => item.id === type)?.label ?? type;
}

export function searchNoorLocal(query: string, options: NoorSearchOptions = {}): NoorSearchResult[] {
  const q = query.trim();
  const queryTokens = tokens(q);
  if (queryTokens.length === 0) return [];

  const allowedTypes = new Set(options.types ?? NOOR_SEARCH_TYPES.map((item) => item.id));
  const limit = options.limit ?? 18;
  const topic = options.topic ? NOOR_SEARCH_TOPICS.find((item) => item.id === options.topic) : undefined;
  const topicTokens = topic ? tokens(topic.query) : [];
  const activeTokens = Array.from(new Set([...queryTokens, ...topicTokens]));

  return buildCandidates()
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
