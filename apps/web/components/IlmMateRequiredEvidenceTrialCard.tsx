import { NoorCard } from '@noor/ui';

const requiredEvidenceTrial = {
  version: '0.27.5',
  label: 'ilm-mate required evidence submission trial',
  outputRoot: 'content-pipeline/review/ilm-mate-v1/required-evidence-trial',
  records: 12,
  domainsReadyForReviewerDecision: '3/3',
  domainsReadyForStaging: '0/3',
  canPushNoorCdnStaging: false,
  canPushNoorCdnMain: false,
  status: 'blocked',
  productionApproved: false,
  canPromoteToProduction: false,
  commands: [
    'pnpm ilm:required-evidence-trial',
    'pnpm check:ilm-required-evidence-trial',
    'pnpm ilm:evidence:list -- --status=submitted'
  ]
};

export function IlmMateRequiredEvidenceTrialCard() {
  return (
    <NoorCard>
      <div className="noor-row">
        <span className="noor-badge gold">ilm-mate required evidence</span>
        <span className="noor-badge emerald">Sprint 27.5</span>
      </div>
      <h2>{requiredEvidenceTrial.label}</h2>
      <p className="noor-subtitle">
        Submit the remaining non-production evidence records into the review workflow. This is a trial
        submission only; it does not accept evidence for staging and does not allow CDN publication.
      </p>
      <div className="noor-divider" />
      <div className="noor-mini-grid">
        <div className="noor-stat"><strong>Version</strong><span>{requiredEvidenceTrial.version}</span></div>
        <div className="noor-stat"><strong>Submitted records</strong><span>{requiredEvidenceTrial.records}</span></div>
        <div className="noor-stat"><strong>Ready for reviewer decision</strong><span>{requiredEvidenceTrial.domainsReadyForReviewerDecision}</span></div>
        <div className="noor-stat"><strong>Domains ready for staging</strong><span>{requiredEvidenceTrial.domainsReadyForStaging}</span></div>
        <div className="noor-stat"><strong>Staging push</strong><span>{String(requiredEvidenceTrial.canPushNoorCdnStaging)}</span></div>
        <div className="noor-stat"><strong>Main push</strong><span>{String(requiredEvidenceTrial.canPushNoorCdnMain)}</span></div>
        <div className="noor-stat"><strong>Status</strong><span>{requiredEvidenceTrial.status}</span></div>
        <div className="noor-stat"><strong>Can promote</strong><span>{String(requiredEvidenceTrial.canPromoteToProduction)}</span></div>
      </div>
      <div className="noor-divider" />
      <p className="noor-subtitle">
        <strong>Output:</strong> <code>{requiredEvidenceTrial.outputRoot}</code>
      </p>
      <p className="noor-subtitle">
        <strong>Commands:</strong>{' '}
        {requiredEvidenceTrial.commands.map((command) => <code key={command}> {command} </code>)}
      </p>
      <div className="noor-divider" />
      <p className="noor-subtitle">
        Next sprint should review these submitted records and decide whether they can become
        <code> accepted-for-staging</code>. Until then, <code>noor-cdn</code> remains unchanged.
      </p>
    </NoorCard>
  );
}
