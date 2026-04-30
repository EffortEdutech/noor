import { NoorCard } from '@noor/ui';
import { NOOR_SOURCE_INTAKE } from '../lib/content-pipeline';

export function SourceIntakeCard() {
  return (
    <NoorCard>
      <div className="noor-row">
        <span className="noor-badge gold">Source intake</span>
        <span className="noor-badge emerald">Sprint 19</span>
      </div>

      <h2>{NOOR_SOURCE_INTAKE.label}</h2>
      <p className="noor-subtitle">
        Prepare real Quran, tafseer and hadith source candidates before importer work starts. These records keep licensing, attribution and reviewer requirements visible before any source can be promoted.
      </p>

      <div className="noor-divider" />

      <div className="noor-mini-grid">
        <div className="noor-stat"><strong>Templates</strong><span>{NOOR_SOURCE_INTAKE.templateRoot}</span></div>
        <div className="noor-stat"><strong>Registry</strong><span>{NOOR_SOURCE_INTAKE.candidateRegistry}</span></div>
        <div className="noor-stat"><strong>Audit</strong><span>{NOOR_SOURCE_INTAKE.generatedAuditFile}</span></div>
      </div>

      <div className="noor-divider" />

      <div className="noor-stack">
        {NOOR_SOURCE_INTAKE.steps.map((step) => (
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
        Required domains: {NOOR_SOURCE_INTAKE.requiredDomains.map((domain) => <code key={domain}> {domain} </code>)}
      </p>
      <p className="noor-subtitle">
        Commands: {NOOR_SOURCE_INTAKE.commands.map((command) => <code key={command}> {command} </code>)}
      </p>
      <p className="noor-subtitle">
        Sprint 19 is intake only. It does not import real production text and it does not approve any source automatically.
      </p>
    </NoorCard>
  );
}
