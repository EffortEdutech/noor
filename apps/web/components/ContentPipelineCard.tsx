import { NoorCard } from '@noor/ui';
import { NOOR_CONTENT_PIPELINE } from '../lib/content-pipeline';

export function ContentPipelineCard() {
  return (
    <NoorCard>
      <div className="noor-row">
        <span className="noor-badge gold">Content pipeline</span>
        <span className="noor-badge emerald">CDN-ready</span>
      </div>
      <h2>{NOOR_CONTENT_PIPELINE.label}</h2>
      <p className="noor-subtitle">
        NOOR now has a repeatable local source-to-CDN preparation path before we connect real production datasets.
      </p>

      <div className="noor-divider" />

      <div className="noor-mini-grid">
        <div className="noor-stat">
          <strong>Source</strong>
          <span>{NOOR_CONTENT_PIPELINE.sourceRoot}</span>
        </div>
        <div className="noor-stat">
          <strong>Public</strong>
          <span>{NOOR_CONTENT_PIPELINE.publicRoot}</span>
        </div>
        <div className="noor-stat">
          <strong>Base</strong>
          <span>{NOOR_CONTENT_PIPELINE.localCdnBase}</span>
        </div>
      </div>

      <div className="noor-divider" />

      <div className="noor-stack">
        {NOOR_CONTENT_PIPELINE.steps.map((step) => (
          <div className="noor-card is-soft" key={step.id}>
            <div className="noor-row">
              <strong>{step.label}</strong>
              <span className={step.status === 'ready' ? 'noor-badge emerald' : 'noor-badge'}>{step.status}</span>
            </div>
            <p className="noor-subtitle">{step.note}</p>
          </div>
        ))}
      </div>

      <div className="noor-divider" />
      <p className="noor-subtitle">
        Commands: {NOOR_CONTENT_PIPELINE.commands.map((command) => <code key={command}> {command} </code>)}
      </p>
    </NoorCard>
  );
}
