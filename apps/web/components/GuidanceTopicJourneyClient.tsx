'use client';

import { NoorCard } from '@noor/ui';
import { useEffect, useMemo, useState } from 'react';
import type { GuidanceTopicDetail } from '../lib/guidance-topics';
import {
  formatRelativeNoorDate,
  getGuidancePathCompletionPercent,
  readGuidancePathMap,
  saveGuidancePathProgress,
  saveReflectionNote,
  type GuidancePathProgress
} from '../lib/local-store';

export function GuidanceTopicJourneyClient({ topic }: { topic: GuidanceTopicDetail }) {
  const stepIds = useMemo(() => topic.steps.map((step) => step.id), [topic.steps]);
  const [completedStepIds, setCompletedStepIds] = useState<string[]>([]);
  const [note, setNote] = useState('');
  const [action, setAction] = useState('');
  const [status, setStatus] = useState('');
  const [progress, setProgress] = useState<GuidancePathProgress | null>(null);

  useEffect(() => {
    const saved = readGuidancePathMap()[topic.id] ?? null;
    setProgress(saved);
    setCompletedStepIds(saved?.completedStepIds ?? []);
  }, [topic.id]);

  function persist(nextCompletedStepIds: string[], nextReflection = note) {
    const next = saveGuidancePathProgress({
      topicId: topic.id,
      topicLabel: topic.label,
      href: topic.exploreHref,
      completedStepIds: nextCompletedStepIds,
      stepIds,
      intention: topic.intention,
      lastReflection: nextReflection.trim() || progress?.lastReflection
    });
    setProgress(next);
  }

  function toggleStep(stepId: string) {
    const nextCompletedStepIds = completedStepIds.includes(stepId)
      ? completedStepIds.filter((id) => id !== stepId)
      : [...completedStepIds, stepId];

    setCompletedStepIds(nextCompletedStepIds);
    persist(nextCompletedStepIds);
    setStatus('Journey progress saved.');
    window.setTimeout(() => setStatus(''), 1600);
  }

  function saveReflection() {
    const trimmed = note.trim();
    if (!trimmed) {
      setStatus('Write a short reflection first.');
      return;
    }

    saveReflectionNote({
      topicId: topic.id,
      topicLabel: topic.label,
      prompt: topic.responsePrompt,
      note: trimmed,
      action,
      sourceHref: topic.exploreHref,
      sourceLabel: `${topic.label} guidance path`
    });

    const nextCompletedStepIds = Array.from(new Set([...completedStepIds, 'respond-today']));
    setCompletedStepIds(nextCompletedStepIds);
    persist(nextCompletedStepIds, trimmed);
    setNote('');
    setAction('');
    setStatus('Reflection saved to your Library.');
    window.setTimeout(() => setStatus(''), 2200);
  }

  const completion = getGuidancePathCompletionPercent(progress);

  return (
    <section className="noor-guidance-journey-client" aria-label={`${topic.label} saved guidance path`}>
      <NoorCard variant="gold" className="noor-guidance-save-card">
        <div className="noor-row">
          <span className="noor-badge emerald">Save this path</span>
          <span className="noor-reference">{completion}% complete</span>
        </div>
        <h2>{topic.label}: read, understand, reflect, respond</h2>
        <p className="noor-subtitle">{topic.intention}</p>
        {progress ? (
          <p className="noor-muted noor-small">Last updated: {formatRelativeNoorDate(progress.updatedAt)}</p>
        ) : null}
      </NoorCard>

      <NoorCard variant="soft" className="noor-guidance-step-tracker">
        <span className="noor-kicker">Journey tracker</span>
        <div className="noor-guidance-checklist">
          {topic.steps.map((step) => {
            const checked = completedStepIds.includes(step.id);
            return (
              <button
                key={step.id}
                type="button"
                className="noor-guidance-check-item"
                data-checked={checked}
                onClick={() => toggleStep(step.id)}
              >
                <span>{checked ? '✓' : '○'}</span>
                <strong>{step.label}</strong>
                <small>{step.helper}</small>
              </button>
            );
          })}
        </div>
      </NoorCard>

      <NoorCard className="noor-reflection-composer">
        <span className="noor-badge gold">Reflection note</span>
        <h3>{topic.responsePrompt}</h3>
        <label className="noor-form-field">
          <span className="noor-kicker">My reflection</span>
          <textarea
            className="noor-input noor-reflection-textarea"
            value={note}
            onChange={(event) => setNote(event.target.value)}
            placeholder="Write one sincere line you want to remember..."
          />
        </label>
        <label className="noor-form-field">
          <span className="noor-kicker">One action today</span>
          <input
            className="noor-input"
            value={action}
            onChange={(event) => setAction(event.target.value)}
            placeholder={topic.dailyPractice}
          />
        </label>
        <div className="noor-card-actions">
          <button className="noor-button" type="button" onClick={saveReflection}>
            Save reflection
          </button>
          <a className="noor-button secondary" href="/library">
            Open Library
          </a>
        </div>
        {status ? <p className="noor-copy-status">{status}</p> : null}
      </NoorCard>
    </section>
  );
}
