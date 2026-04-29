import type { HadithItem } from '@noor/content';
import { HadithCard } from './HadithCard';

export function DailyHadithCard({ hadith }: { hadith: HadithItem }) {
  return <HadithCard hadith={hadith} />;
}
