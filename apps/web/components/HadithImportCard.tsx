import { NoorCard } from '@noor/ui';
import { NOOR_HADITH_IMPORTER } from '../lib/content-pipeline';

export function HadithImportCard() {
  return (
    <NoorCard>
      <div className="noor-row">
        <span className="noor-badge gold">Hadith importer</span>
        <span className="noor-badge emerald">Sprint 23</span>
      </div>

      <h2>{NOOR_HADITH_IMPORTER.label}</h2>
      <p className="noor-subtitle">
        Build the first hadith import adapter without bypassing source governance. Sprint 23 proves the hadith collection and item route contract using a fixture only; production hadith remains blocked until an approved source and reviewer sign-off are complete.
      </p>

      <div className="noor-divider" />

      <div className="noor-mini-grid">
        <div className="noor-stat"><strong>Adapter</strong><span>{NOOR_HADITH_IMPORTER.adapterId}</span></div>
        <div className="noor-stat"><strong>Sample</strong><span>{NOOR_HADITH_IMPORTER.sampleSource}</span></div>
        <div className="noor-stat"><strong>Output</strong><span>{NOOR_HADITH_IMPORTER.outputRoot}</span></div>
      </div>

      <div className="noor-divider" />

      <div className="noor-stack">
        {NOOR_HADITH_IMPORTER.steps.map((step) => (
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
        Commands: {NOOR_HADITH_IMPORTER.commands.map((command) => <code key={command}> {command} </code>)}
      </p>
      <p className="noor-subtitle">
        Production gate: {NOOR_HADITH_IMPORTER.productionGate.length} required checks before this adapter can be used with real hadith source data.
      </p>
      <p className="noor-subtitle">
        Report: <code>{NOOR_HADITH_IMPORTER.generatedReport}</code>
      </p>
    </NoorCard>
  );
}
