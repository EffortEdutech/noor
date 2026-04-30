import { NoorCard } from '@noor/ui';
import { NOOR_SOURCE_GOVERNANCE } from '../lib/content-pipeline';

export function SourceGovernanceCard() {
  return (
    <NoorCard>
      <div className="noor-row">
        <span className="noor-badge gold">Source governance</span>
        <span className="noor-badge emerald">Production gate</span>
      </div>

      <h2>{NOOR_SOURCE_GOVERNANCE.label}</h2>
      <p className="noor-subtitle">
        Keep demo content safe, visible and blocked from production until each Quran, tafseer and hadith source has verified licensing, attribution and scholarly sign-off.
      </p>

      <div className="noor-divider" />

      <div className="noor-mini-grid">
        <div className="noor-stat"><strong>Registry</strong><span>{NOOR_SOURCE_GOVERNANCE.sourceRegistry}</span></div>
        <div className="noor-stat"><strong>Audit JSON</strong><span>{NOOR_SOURCE_GOVERNANCE.generatedAuditFile}</span></div>
        <div className="noor-stat"><strong>Audit MD</strong><span>{NOOR_SOURCE_GOVERNANCE.generatedAuditMarkdown}</span></div>
      </div>

      <div className="noor-divider" />

      <div className="noor-stack">
        {NOOR_SOURCE_GOVERNANCE.steps.map((step) => (
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
        Required domains: {NOOR_SOURCE_GOVERNANCE.requiredDomains.map((domain) => <code key={domain}> {domain} </code>)}
      </p>
      <p className="noor-subtitle">
        Commands: {NOOR_SOURCE_GOVERNANCE.commands.map((command) => <code key={command}> {command} </code>)}
      </p>
      <p className="noor-subtitle">
        Note: <code>pnpm source:gate</code> is expected to fail while the source registry contains demo-only content. That failure protects NOOR from accidental production promotion.
      </p>
    </NoorCard>
  );
}
