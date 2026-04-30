import { NoorCard } from '@noor/ui';
import { NOOR_CDN_PUBLISHING } from '../lib/content-pipeline';

export function CdnPublishCard() {
  return (
    <NoorCard>
      <div className="noor-row">
        <span className="noor-badge gold">CDN publishing</span>
        <span className="noor-badge emerald">Zero-budget ready</span>
      </div>

      <h2>{NOOR_CDN_PUBLISHING.label}</h2>
      <p className="noor-subtitle">
        Generate a clean, checksum-tracked CDN publish folder that can be copied into a separate GitHub repository and served by GitHub Pages or jsDelivr.
      </p>

      <div className="noor-divider" />

      <div className="noor-mini-grid">
        <div className="noor-stat">
          <strong>Publish root</strong>
          <span>{NOOR_CDN_PUBLISHING.publishRoot}</span>
        </div>
        <div className="noor-stat">
          <strong>GitHub Pages</strong>
          <span>{NOOR_CDN_PUBLISHING.githubPagesBase}</span>
        </div>
        <div className="noor-stat">
          <strong>jsDelivr</strong>
          <span>{NOOR_CDN_PUBLISHING.jsDelivrBase}</span>
        </div>
      </div>

      <div className="noor-divider" />

      <div className="noor-stack">
        {NOOR_CDN_PUBLISHING.steps.map((step) => (
          <div className="noor-card is-soft" key={step.id}>
            <div className="noor-row">
              <strong>{step.label}</strong>
              <span className={step.status === 'ready' ? 'noor-badge emerald' : 'noor-badge gold'}>{step.status}</span>
            </div>
            <p className="noor-subtitle">{step.note}</p>
          </div>
        ))}
      </div>

      <div className="noor-divider" />

      <p className="noor-subtitle">
        Commands: {NOOR_CDN_PUBLISHING.commands.map((command) => <code key={command}> {command} </code>)}
      </p>
    </NoorCard>
  );
}
