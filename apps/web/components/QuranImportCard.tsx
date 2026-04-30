import { NoorCard } from '@noor/ui';
import { NOOR_QURAN_IMPORTER } from '../lib/content-pipeline';

export function QuranImportCard() {
  return (
    <NoorCard>
      <div className="noor-row">
        <span className="noor-badge gold">Quran importer</span>
        <span className="noor-badge emerald">Sprint 20</span>
      </div>

      <h2>{NOOR_QURAN_IMPORTER.label}</h2>
      <p className="noor-subtitle">
        Build the first Quran import adapter without bypassing source governance. Sprint 20 proves the import contract using a fixture only; production Quran text remains blocked until a verified source is approved.
      </p>

      <div className="noor-divider" />

      <div className="noor-mini-grid">
        <div className="noor-stat"><strong>Adapter</strong><span>{NOOR_QURAN_IMPORTER.adapterId}</span></div>
        <div className="noor-stat"><strong>Sample</strong><span>{NOOR_QURAN_IMPORTER.sampleSource}</span></div>
        <div className="noor-stat"><strong>Output</strong><span>{NOOR_QURAN_IMPORTER.outputRoot}</span></div>
      </div>

      <div className="noor-divider" />

      <div className="noor-stack">
        {NOOR_QURAN_IMPORTER.steps.map((step) => (
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
        Commands: {NOOR_QURAN_IMPORTER.commands.map((command) => <code key={command}> {command} </code>)}
      </p>
      <p className="noor-subtitle">
        Production gate: {NOOR_QURAN_IMPORTER.productionGate.length} required checks before this adapter can be used with real Quran source data.
      </p>
      <p className="noor-subtitle">
        Report: <code>{NOOR_QURAN_IMPORTER.generatedReport}</code>
      </p>
    </NoorCard>
  );
}
