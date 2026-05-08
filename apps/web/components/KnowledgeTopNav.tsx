'use client';

import { useEffect, useMemo, useState } from 'react';
import { createPortal } from 'react-dom';
import {
  HADITH_LAST_VISIT_KEY,
  QURAN_LAST_VISIT_KEY,
  TAFSEER_LAST_VISIT_KEY,
  type KnowledgeLastVisit
} from '../lib/knowledge-last-visit';
import styles from './KnowledgeTopNav.module.css';

type KnowledgeTarget = {
  key: string;
  label: string;
  href: string;
  lastKey: string;
};

const TARGETS: KnowledgeTarget[] = [
  { key: 'quran', label: 'Quran', href: '/learn/quran', lastKey: QURAN_LAST_VISIT_KEY },
  { key: 'tafseer', label: 'Tafseer', href: '/learn/tafseer', lastKey: TAFSEER_LAST_VISIT_KEY },
  { key: 'hadith', label: 'Hadith', href: '/learn/hadith', lastKey: HADITH_LAST_VISIT_KEY }
];

function readLastVisit(key: string): KnowledgeLastVisit | null {
  try {
    const value = window.localStorage.getItem(key);
    if (!value) return null;
    const parsed = JSON.parse(value) as Partial<KnowledgeLastVisit>;
    return parsed.href && parsed.title ? {
      href: parsed.href,
      title: parsed.title,
      subtitle: parsed.subtitle,
      updatedAt: parsed.updatedAt
    } : null;
  } catch {
    return null;
  }
}

export function KnowledgeTopNav({ currentPath }: { currentPath: string }) {
  const [slot, setSlot] = useState<HTMLElement | null>(null);
  const [open, setOpen] = useState(false);
  const [lastVisits, setLastVisits] = useState<Record<string, KnowledgeLastVisit | null>>({});

  useEffect(() => {
    setSlot(document.getElementById('noor-knowledge-nav-slot'));
    return () => setSlot(null);
  }, []);

  useEffect(() => {
    setLastVisits(Object.fromEntries(TARGETS.map((target) => [target.key, readLastVisit(target.lastKey)])));
  }, [currentPath]);

  useEffect(() => {
    function handleEscape(event: KeyboardEvent) {
      if (event.key === 'Escape') setOpen(false);
    }

    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, []);

  const activeLabel = useMemo(() => {
    return TARGETS.find((target) => currentPath.startsWith(target.href))?.label ?? 'Sources';
  }, [currentPath]);

  if (!slot) return null;

  return createPortal(
    <div className={styles.wrap} data-open={open ? 'true' : 'false'}>
      <button
        type="button"
        className={styles.trigger}
        onClick={() => setOpen((value) => !value)}
        aria-expanded={open}
        aria-label="Open Quran, Tafseer and Hadith navigation"
      >
        <span aria-hidden="true" />
        <strong>{activeLabel}</strong>
      </button>

      {open ? (
        <>
          <div className={styles.scrim} onClick={() => setOpen(false)} aria-hidden="true" />
          <section className={styles.panel} role="dialog" aria-modal="true" aria-label="Knowledge sources">
            <header>
              <span className="noor-kicker">Knowledge sources</span>
              <h2>Switch without losing your place</h2>
            </header>

            <div className={styles.list}>
              {TARGETS.map((target) => {
                const lastVisit = lastVisits[target.key];
                return (
                  <a
                    key={target.key}
                    href={lastVisit?.href ?? target.href}
                    data-active={currentPath.startsWith(target.href)}
                    onClick={() => setOpen(false)}
                  >
                    <strong>{target.label}</strong>
                    <span>{lastVisit?.title ?? `Open ${target.label}`}</span>
                    {lastVisit?.subtitle ? <small>{lastVisit.subtitle}</small> : null}
                  </a>
                );
              })}
            </div>
          </section>
        </>
      ) : null}
    </div>,
    slot
  );
}
