'use client';

import { useMemo, useState } from 'react';
import { useReadingProgress } from '../lib/use-reading-progress';

export function MarkReadingProgressButton({
  surah,
  ayah,
  ayahKey,
  title,
  subtitle,
  href
}: {
  surah: number;
  ayah: number;
  ayahKey: string;
  title: string;
  subtitle?: string;
  href: string;
}) {
  const { progress, markCurrent } = useReadingProgress();
  const isCurrent = progress?.key === ayahKey;
  const [justSaved, setJustSaved] = useState(false);

  const label = useMemo(() => {
    if (justSaved || isCurrent) return 'Current ✓';
    return 'Mark current';
  }, [isCurrent, justSaved]);

  function handleClick() {
    markCurrent({
      surah,
      ayah,
      key: ayahKey,
      title,
      subtitle,
      href
    });
    setJustSaved(true);
    window.setTimeout(() => setJustSaved(false), 1400);
  }

  return (
    <button className="noor-button secondary" type="button" onClick={handleClick}>
      {label}
    </button>
  );
}
