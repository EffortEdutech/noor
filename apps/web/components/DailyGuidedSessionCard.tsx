'use client';

import { NoorCard } from '@noor/ui';
import { useEffect, useState } from 'react';
import { GUIDANCE_TOPIC_DETAILS, getDailyGuidanceTopic, type GuidanceTopicDetail } from '../lib/guidance-topics';
import { saveGuidancePathProgress } from '../lib/local-store';

export function DailyGuidedSessionCard() {
  const [topic, setTopic] = useState<GuidanceTopicDetail>(GUIDANCE_TOPIC_DETAILS[0]);
  const [status, setStatus] = useState('');

  useEffect(() => {
    setTopic(getDailyGuidanceTopic());
  }, []);

  function startSession() {
    saveGuidancePathProgress({
      topicId: topic.id,
      topicLabel: topic.label,
      href: topic.exploreHref,
      completedStepIds: [],
      stepIds: topic.steps.map((step) => step.id),
      intention: topic.intention
    });
    setStatus('Daily session saved. Continue when ready.');
    window.setTimeout(() => setStatus(''), 1800);
  }

  return (
    <NoorCard variant="soft" className="noor-daily-session-card">
      <div className="noor-row">
        <span className="noor-badge gold">Daily guided session</span>
        <span className="noor-topic-prompt-icon">{topic.arabic}</span>
      </div>
      <h2>{topic.label}: one guided path for today</h2>
      <p className="noor-subtitle">{topic.prompt}. {topic.description}</p>
      <div className="noor-daily-session-steps" aria-label="Daily guided session steps">
        {topic.steps.map((step, index) => (
          <a key={step.id} href={step.href} className="noor-daily-session-step">
            <span>{index + 1}</span>
            <strong>{step.label}</strong>
            <small>{step.helper}</small>
          </a>
        ))}
      </div>
      <div className="noor-card-actions">
        <a className="noor-button" href={topic.exploreHref}>Open today’s path</a>
        <button className="noor-button secondary" type="button" onClick={startSession}>
          Save as current path
        </button>
      </div>
      {status ? <p className="noor-copy-status">{status}</p> : null}
    </NoorCard>
  );
}
