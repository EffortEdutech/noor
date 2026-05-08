export const QURAN_LAST_VISIT_KEY = 'noor.quran.lastVisit.v1';
export const TAFSEER_LAST_VISIT_KEY = 'noor.tafseer.lastVisit.v1';
export const HADITH_LAST_VISIT_KEY = 'noor.hadith.lastVisit.v1';

export type KnowledgeLastVisit = {
  href: string;
  title: string;
  subtitle?: string;
  updatedAt?: string;
};
