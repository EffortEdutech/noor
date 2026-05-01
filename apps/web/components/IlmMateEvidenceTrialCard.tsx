import { NoorCard } from '@noor/ui';

const evidenceTrial = {
  version: '0.27.2',
  label: 'ilm-mate evidence update trial',
  outputRoot: 'content-pipeline/review/ilm-mate-v1/evidence-records/trial',
  status: 'blocked',
  productionApproved: false,
  canPromoteToProduction: false,
  trialRecords: 3,
  acceptedForStaging: 0,
  commands: [
    'pnpm ilm:evidence-trial',
    'pnpm ilm:evidence:list -- --status=submitted',
    'pnpm check:ilm-evidence-trial'
  ]
};

export function IlmMateEvidenceTrialCard() {
  return (
    <NoorCard>
      <div className="noor-row">
        <span className="noor-badge gold">ilm-mate evidence trial</span>
        <span className="noor-badge emerald">Sprint 27.2</span>
      </div>
      <h2>{evidenceTrial.label}</h2>
      <p className="noor-subtitle">
        Submit three sample source-identity evidence records through the Sprint 27.1 workflow.
        This proves the editable review record process without accepting evidence for staging or publishing CDN content.
      </p>
      <div className="noor-divider" />
      <div className="noor-mini-grid">
        <div className="noor-stat"><strong>Version</strong><span>{evidenceTrial.version}</span></div>
        <div className="noor-stat"><strong>Trial records</strong><span>{evidenceTrial.trialRecords}</span></div>
        <div className="noor-stat"><strong>Accepted for staging</strong><span>{evidenceTrial.acceptedForStaging}</span></div>
        <div className="noor-stat"><strong>Status</strong><span>{evidenceTrial.status}</span></div>
        <div className="noor-stat"><strong>Production approved</strong><span>{String(evidenceTrial.productionApproved)}</span></div>
        <div className="noor-stat"><strong>Can promote</strong><span>{String(evidenceTrial.canPromoteToProduction)}</span></div>
      </div>
      <div className="noor-divider" />
      <p className="noor-subtitle">
        <strong>Output:</strong> <code>{evidenceTrial.outputRoot}</code>
      </p>
      <p className="noor-subtitle">
        <strong>Commands:</strong>{' '}
        {evidenceTrial.commands.map((command) => <code key={command}> {command} </code>)}
      </p>
      <div className="noor-divider" />
      <p className="noor-subtitle">
        This sprint marks sample records as <code>submitted</code> only. Reviewer acceptance and CDN promotion remain separate future gates.
      </p>
    </NoorCard>
  );
}
