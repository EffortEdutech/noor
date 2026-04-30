import { NoorCard } from '@noor/ui';
import { NOOR_CDN_PROMOTION } from '../lib/content-pipeline';

export function CdnPromotionCard() {
  return (
    <NoorCard>
      <div className="noor-row">
        <span className="noor-badge gold">CDN promotion</span>
        <span className="noor-badge emerald">Environment handoff</span>
      </div>

      <h2>{NOOR_CDN_PROMOTION.label}</h2>
      <p className="noor-subtitle">
        Generate a repeatable promotion bundle after the published CDN URL passes smoke testing. The bundle gives you the exact NEXT_PUBLIC environment values to paste into local .env.local or Vercel.
      </p>

      <div className="noor-divider" />

      <div className="noor-mini-grid">
        <div className="noor-stat"><strong>Default base</strong><span>{NOOR_CDN_PROMOTION.defaultPromotionBase}</span></div>
        <div className="noor-stat"><strong>Fallback base</strong><span>{NOOR_CDN_PROMOTION.fallbackPromotionBase}</span></div>
        <div className="noor-stat"><strong>Promotion root</strong><span>{NOOR_CDN_PROMOTION.promotionRoot}</span></div>
      </div>

      <div className="noor-divider" />

      <div className="noor-stack">
        {NOOR_CDN_PROMOTION.steps.map((step) => (
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
        Generated files: <code>{NOOR_CDN_PROMOTION.generatedEnvFile}</code>, <code>{NOOR_CDN_PROMOTION.generatedPromotionFile}</code>, <code>{NOOR_CDN_PROMOTION.generatedChecklistFile}</code>
      </p>
      <p className="noor-subtitle">
        Commands: {NOOR_CDN_PROMOTION.commands.map((command) => <code key={command}> {command} </code>)}
      </p>
      <p className="noor-subtitle">
        Environment keys: {NOOR_CDN_PROMOTION.envKeys.map((key) => <code key={key}> {key} </code>)}
      </p>
    </NoorCard>
  );
}
