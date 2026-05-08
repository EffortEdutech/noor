'use client';

import type { ReactNode, TouchEvent } from 'react';
import Link from 'next/link';
import { useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { TAFSEER_LAST_VISIT_KEY } from '../lib/knowledge-last-visit';
import styles from './TafseerSingleReader.module.css';

type TafseerLastVisit = {
  href: string;
  title: string;
  subtitle?: string;
};

export function TafseerSingleReader({
  children,
  lastVisit,
  previousHref,
  nextHref,
  position,
  total
}: {
  children: ReactNode;
  lastVisit: TafseerLastVisit;
  previousHref?: string;
  nextHref?: string;
  position: number;
  total: number;
}) {
  const router = useRouter();
  const touchStartX = useRef<number | null>(null);
  const touchStartY = useRef<number | null>(null);

  useEffect(() => {
    try {
      window.localStorage.setItem(TAFSEER_LAST_VISIT_KEY, JSON.stringify({
        ...lastVisit,
        updatedAt: new Date().toISOString()
      }));
    } catch {
      // Ignore blocked storage.
    }
  }, [lastVisit]);

  function handleTouchStart(event: TouchEvent<HTMLElement>) {
    const touch = event.changedTouches[0];
    touchStartX.current = touch.clientX;
    touchStartY.current = touch.clientY;
  }

  function handleTouchEnd(event: TouchEvent<HTMLElement>) {
    if (touchStartX.current === null || touchStartY.current === null) return;

    const touch = event.changedTouches[0];
    const deltaX = touch.clientX - touchStartX.current;
    const deltaY = touch.clientY - touchStartY.current;
    touchStartX.current = null;
    touchStartY.current = null;

    if (Math.abs(deltaX) < 54 || Math.abs(deltaX) < Math.abs(deltaY) * 1.35) return;

    if (deltaX < 0 && nextHref) router.push(nextHref);
    if (deltaX > 0 && previousHref) router.push(previousHref);
  }

  return (
    <section
      className={styles.shell}
      aria-label={`Tafseer ${position} of ${total}`}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      <nav className={styles.stepNav} aria-label="Tafseer step navigation">
        {previousHref ? (
          <Link className={styles.stepButton} href={previousHref} aria-label="Previous Tafseer">
            <span aria-hidden="true">&lt;</span>
          </Link>
        ) : (
          <span className={styles.stepButton} data-disabled="true" aria-hidden="true">&lt;</span>
        )}

        <span className={styles.position}>Tafseer {position} of {total}</span>

        {nextHref ? (
          <Link className={styles.stepButton} href={nextHref} aria-label="Next Tafseer">
            <span aria-hidden="true">&gt;</span>
          </Link>
        ) : (
          <span className={styles.stepButton} data-disabled="true" aria-hidden="true">&gt;</span>
        )}
      </nav>

      <div className={styles.cardSurface}>
        {children}
      </div>
    </section>
  );
}
