'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import type { AiSourceContext } from '../lib/ai/types';
import { AiSourceAssistant } from './AiSourceAssistant';
import styles from './TafseerTeachingActions.module.css';

type CopyTarget = 'reference' | 'quran' | 'quote' | 'save' | null;

type TafseerTeachingActionsProps = {
  reference: string;
  quranPassage: string;
  tafseerQuote: string;
  quranHref: string;
  teachingTitle: string;
  keyPhrase: string;
  lessonNote: string;
  saveKey: string;
  aiContext?: AiSourceContext;
};

async function copyText(text: string) {
  if (typeof navigator !== 'undefined' && navigator.clipboard?.writeText) {
    await navigator.clipboard.writeText(text);
    return;
  }

  const textArea = document.createElement('textarea');
  textArea.value = text;
  textArea.setAttribute('readonly', 'true');
  textArea.style.position = 'fixed';
  textArea.style.left = '-9999px';
  document.body.appendChild(textArea);
  textArea.select();
  document.execCommand('copy');
  document.body.removeChild(textArea);
}

function getSavedPayload(props: TafseerTeachingActionsProps) {
  return {
    type: 'tafseer',
    reference: props.reference,
    quranPassage: props.quranPassage,
    tafseerQuote: props.tafseerQuote,
    title: props.teachingTitle,
    savedAt: new Date().toISOString()
  };
}

export function TafseerTeachingActions(props: TafseerTeachingActionsProps) {
  const [copied, setCopied] = useState<CopyTarget>(null);
  const [error, setError] = useState<string | null>(null);

  const preparedNote = useMemo(() => {
    return [
      props.teachingTitle,
      '',
      `Reference: ${props.reference}`,
      '',
      'Key ayah phrase:',
      props.keyPhrase,
      '',
      'Lesson note:',
      props.lessonNote
    ].join('\n');
  }, [props]);

  async function handleCopy(target: CopyTarget, text: string) {
    setError(null);
    try {
      await copyText(text);
      setCopied(target);
      window.setTimeout(() => setCopied(null), 1600);
    } catch {
      setError('Copy failed. Please select and copy manually.');
    }
  }

  function saveLocally() {
    setError(null);
    try {
      const payload = getSavedPayload(props);
      window.localStorage.setItem(`noor:${props.saveKey}`, JSON.stringify(payload));
      setCopied('save');
      window.setTimeout(() => setCopied(null), 1600);
    } catch {
      setError('Save failed on this device.');
    }
  }

  return (
    <section className={styles.actions} aria-label="Tafseer Talab an-Noor actions">
      <div className={styles.compactActions}>
        <button type="button" onClick={() => handleCopy('reference', props.reference)}>
          {copied === 'reference' ? 'Reference copied' : 'Copy reference'}
        </button>
        <button type="button" onClick={() => handleCopy('quran', props.quranPassage)} disabled={!props.quranPassage}>
          {copied === 'quran' ? 'Quran copied' : 'Copy Quran passage'}
        </button>
        <button type="button" onClick={() => handleCopy('quote', props.tafseerQuote)}>
          {copied === 'quote' ? 'Quote copied' : 'Copy tafseer quote'}
        </button>
        <Link href={props.quranHref}>Open Quran context</Link>
        <button type="button" onClick={saveLocally}>
          {copied === 'save' ? 'Saved locally' : 'Save locally'}
        </button>
      </div>

      <details className={styles.teachingPrep}>
        <summary>Open Talab an-Noor</summary>
        <div className={styles.prepGrid}>
          <section>
            <span>Main point</span>
            <p>{props.teachingTitle}</p>
          </section>
          <section dir="rtl" lang="ar" className={styles.keyPhrase}>
            <span>Key ayah phrase</span>
            <p>{props.keyPhrase}</p>
          </section>
          <section>
            <span>Lesson note</span>
            <p>{props.lessonNote}</p>
          </section>
        </div>

        {props.aiContext ? (
          <AiSourceAssistant context={props.aiContext} compact variant="tafseer" />
        ) : null}

        <div className={styles.prepActions}>
          <button type="button" onClick={() => handleCopy('quote', preparedNote)}>
            Copy Ishraq note
          </button>
        </div>
      </details>

      {error ? <p className={styles.error}>{error}</p> : null}
    </section>
  );
}

