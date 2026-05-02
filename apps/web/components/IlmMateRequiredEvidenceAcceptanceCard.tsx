import { NoorCard } from '@noor/ui';

const requiredEvidenceAcceptance = {
  version: '0.27.6',
  label: 'ilm-mate required evidence reviewer acceptance',
  outputRoot: 'content-pipeline/review/ilm-mate-v1/evidence-records/required-evidence-acceptance',
  reviewedRecords: 12,
  acceptedForStaging: 15,
  domainsReadyForStaging: '3/3',
  canPushNoorCdnStaging: true,
  canPushNoorCdnMain: false,
  status: 'blocked',
  productionApproved: false,
  canPromoteToProduction: false,
  commands: [
    'pnpm ilm:required-evidence-acceptance',
    'pnpm check:ilm-required-evidence-acceptance',
    'pnpm check:ilm-staging-cdn-pack'
  ]
};

export function IlmMateRequiredEvidenceAcceptanceCard() {
  return (
    <NoorCard>
      <div className="noor-row">
        <span className="noor-badge gold">ilm-mate evidence acceptance</span>
        <span className="noor-badge emerald">Sprint 27.6</span>
      </div>
      <h2>{requiredEvidenceAcceptance.label}</h2>
      <p className="noor-subtitle">
        Accept the remaining non-production evidence records for staging candidate review. This may unlock
        a future <code>noor-cdn</code> staging branch workflow, but it still blocks <code>noor-cdn/main</code>
        and production promotion.
      </p>
      <div className="noor-divider" />
      <div className="noor-mini-grid">
        <div className="noor-stat"><strong>Version</strong><span>{requiredEvidenceAcceptance.version}</span></div>
        <div className="noor-stat"><strong>Reviewed records</strong><span>{requiredEvidenceAcceptance.reviewedRecords}</span></div>
        <div className="noor-stat"><strong>Accepted for staging</strong><span>{requiredEvidenceAcceptance.acceptedForStaging}</span></div>
        <div className="noor-stat"><strong>Domains ready</strong><span>{requiredEvidenceAcceptance.domainsReadyForStaging}</span></div>
        <div className="noor-stat"><strong>Staging push</strong><span>{String(requiredEvidenceAcceptance.canPushNoorCdnStaging)}</span></div>
        <div className="noor-stat"><strong>Main push</strong><span>{String(requiredEvidenceAcceptance.canPushNoorCdnMain)}</span></div>
        <div className="noor-stat"><strong>Status</strong><span>{requiredEvidenceAcceptance.status}</span></div>
        <div className="noor-stat"><strong>Can promote</strong><span>{String(requiredEvidenceAcceptance.canPromoteToProduction)}</span></div>
      </div>
      <div className="noor-divider" />
      <p className="noor-subtitle">
        <strong>Output:</strong> <code>{requiredEvidenceAcceptance.outputRoot}</code>
      </p>
      <p className="noor-subtitle">
        <strong>Commands:</strong>{' '}
        {requiredEvidenceAcceptance.commands.map((command) => <code key={command}> {command} </code>)}
      </p>
      <div className="noor-divider" />
      <p className="noor-subtitle">
        Next sprint should prepare the actual staging CDN candidate package and copy workflow for
        <code> noor-cdn/staging-ilm-mate-v1</code>. Production <code>noor-cdn/main</code> remains blocked.
      </p>
    </NoorCard>
  );
}
