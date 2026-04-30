import { NoorCard } from '@noor/ui';
import { NOOR_TAFSEER_IMPORTER } from '../lib/content-pipeline';

export function TafseerImportCard() {
  return (
    <NoorCard>
      <div className="noor-row">
        <span className="noor-badge gold">Tafseer importer</span>
        <span className="noor-badge emerald">Sprint 22</span>
      </div>

      <h2>{NOOR_TAFSEER_IMPORTER.label}</h2>
      <p className="noor-subtitle">
        Build the first tafseer import adapter without bypassing source governance. Sprint 22 proves the tafseer book and per-surah route contract using a fixture only; production tafseer remains blocked until an approved source and reviewer sign-off are complete.
      </p>

      <div className="noor-divider" />

      <div className="noor-mini-grid">
        <div className="noor-stat"><strong>Adapter</strong><span>{NOOR_TAFSEER_IMPORTER.adapterId}</span></div>
        <div className="noor-stat"><strong>Sample</strong><span>{NOOR_TAFSEER_IMPORTER.sampleSource}</span></div>
        <div className="noor-stat"><strong>Output</strong><span>{NOOR_TAFSEER_IMPORTER.outputRoot}</span></div>
      </div>

      <div className="noor-divider" />

      <div className="noor-stack">
        {NOOR_TAFSEER_IMPORTER.steps.map((step) => (
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
        Commands: {NOOR_TAFSEER_IMPORTER.commands.map((command) => <code key={command}> {command} </code>)}
      </p>
      <p className="noor-subtitle">
        Production gate: {NOOR_TAFSEER_IMPORTER.productionGate.length} required checks before this adapter can be used with real tafseer source data.
      </p>
      <p className="noor-subtitle">
        Report: <code>{NOOR_TAFSEER_IMPORTER.generatedReport}</code>
      </p>
    </NoorCard>
  );
}
