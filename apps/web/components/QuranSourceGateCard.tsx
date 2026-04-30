import { NoorCard } from '@noor/ui';
import { NOOR_QURAN_SOURCE_GATE } from '../lib/content-pipeline';

export function QuranSourceGateCard() {
  return (
    <NoorCard>
      <div className="noor-row">
        <span className="noor-badge gold">Quran source gate</span>
        <span className="noor-badge emerald">Sprint 21</span>
      </div>

      <h2>{NOOR_QURAN_SOURCE_GATE.label}</h2>
      <p className="noor-subtitle">
        Lock the Quran production source decision before real import. Sprint 21 keeps the current candidate blocked and makes the exact approval requirements visible before any production Quran dataset can be promoted.
      </p>

      <div className="noor-divider" />

      <div className="noor-mini-grid">
        <div className="noor-stat"><strong>Selected candidate</strong><span>{NOOR_QURAN_SOURCE_GATE.selectedCandidateId}</span></div>
        <div className="noor-stat"><strong>Gate status</strong><span>{NOOR_QURAN_SOURCE_GATE.decision.status}</span></div>
        <div className="noor-stat"><strong>Approved</strong><span>{NOOR_QURAN_SOURCE_GATE.decision.approvedForProductionImport ? 'Yes' : 'No'}</span></div>
      </div>

      <div className="noor-divider" />

      <div className="noor-stack">
        {NOOR_QURAN_SOURCE_GATE.steps.map((step) => (
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
        Commands: {NOOR_QURAN_SOURCE_GATE.commands.map((command) => <code key={command}> {command} </code>)}
      </p>
      <p className="noor-subtitle">
        Gate requirements: {NOOR_QURAN_SOURCE_GATE.gateRequirements.length} manual checks before production Quran import.
      </p>
      <p className="noor-subtitle">
        Audit: <code>{NOOR_QURAN_SOURCE_GATE.generatedAuditFile}</code>
      </p>
    </NoorCard>
  );
}
