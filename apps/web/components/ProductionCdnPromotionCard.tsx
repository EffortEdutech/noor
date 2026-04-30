import { NoorCard } from '@noor/ui';
import { NOOR_PRODUCTION_CDN_PROMOTION } from '../lib/production-cdn-promotion';

function badgeFor(status: string) {
  if (status === 'ready') return 'noor-badge emerald';
  if (status === 'manual') return 'noor-badge gold';
  return 'noor-badge';
}

export function ProductionCdnPromotionCard() {
  return (
    <NoorCard>
      <div className="noor-row">
        <span className="noor-badge gold">Production CDN</span>
        <span className="noor-badge emerald">Sprint 25</span>
      </div>
      <h2>{NOOR_PRODUCTION_CDN_PROMOTION.label}</h2>
      <p className="noor-subtitle">Sprint 25 creates the production CDN v1 promotion candidate, but keeps runtime defaults on bundled content until scholarly review allows promotion.</p>
      <div className="noor-divider" />
      <div className="noor-mini-grid">
        <div className="noor-stat"><strong>Promotion</strong><span>{NOOR_PRODUCTION_CDN_PROMOTION.promotionId}</span></div>
        <div className="noor-stat"><strong>Runtime default</strong><span>{NOOR_PRODUCTION_CDN_PROMOTION.defaultRuntimeSource}</span></div>
        <div className="noor-stat"><strong>Output</strong><span>{NOOR_PRODUCTION_CDN_PROMOTION.generatedPromotionFile}</span></div>
      </div>
      <div className="noor-divider" />
      <div className="noor-stack">
        {NOOR_PRODUCTION_CDN_PROMOTION.steps.map((step) => (
          <div className="noor-card is-soft" key={step.id}>
            <div className="noor-row"><strong>{step.label}</strong><span className={badgeFor(step.status)}>{step.status}</span></div>
            <p className="noor-subtitle">{step.note}</p>
          </div>
        ))}
      </div>
      <div className="noor-divider" />
      <p className="noor-subtitle">Commands: {NOOR_PRODUCTION_CDN_PROMOTION.commands.map((command) => <code key={command}> {command} </code>)}</p>
      <p className="noor-subtitle">Preferred external base: <code>{NOOR_PRODUCTION_CDN_PROMOTION.preferredExternalBase}</code></p>
    </NoorCard>
  );
}
