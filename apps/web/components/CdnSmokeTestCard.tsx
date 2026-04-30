import { NoorCard } from '@noor/ui';
import { NOOR_CDN_SMOKE_TESTING } from '../lib/content-pipeline';

export function CdnSmokeTestCard() {
  return (
    <NoorCard>
      <div className="noor-row">
        <span className="noor-badge gold">CDN smoke test</span>
        <span className="noor-badge emerald">Promotion gate</span>
      </div>

      <h2>{NOOR_CDN_SMOKE_TESTING.label}</h2>
      <p className="noor-subtitle">
        Validate the generated publish pack locally, then smoke-test the published GitHub Pages or jsDelivr URL before switching NOOR into external CDN mode.
      </p>

      <div className="noor-divider" />

      <div className="noor-mini-grid">
        <div className="noor-stat"><strong>Local target</strong><span>{NOOR_CDN_SMOKE_TESTING.defaultLocalTarget}</span></div>
        <div className="noor-stat"><strong>GitHub Pages target</strong><span>{NOOR_CDN_SMOKE_TESTING.githubPagesBase}</span></div>
        <div className="noor-stat"><strong>jsDelivr target</strong><span>{NOOR_CDN_SMOKE_TESTING.jsDelivrBase}</span></div>
      </div>

      <div className="noor-divider" />

      <div className="noor-stack">
        {NOOR_CDN_SMOKE_TESTING.steps.map((step) => (
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
        Required resolver paths: {NOOR_CDN_SMOKE_TESTING.requiredResolverPaths.map((path) => <code key={path}> {path} </code>)}
      </p>
      <p className="noor-subtitle">
        Commands: {NOOR_CDN_SMOKE_TESTING.commands.map((command) => <code key={command}> {command} </code>)}
      </p>
    </NoorCard>
  );
}
