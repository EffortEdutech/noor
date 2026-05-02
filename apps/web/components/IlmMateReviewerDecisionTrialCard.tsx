import { NoorCard } from '@noor/ui';

const reviewerDecisionTrial = {
  version: '0.27.3',
  label: 'ilm-mate reviewer decision trial',
  outputRoot: 'content-pipeline/review/ilm-mate-v1/evidence-records/reviewer-decisions',
  status: 'blocked',
  productionApproved: false,
  canPromoteToProduction: false,
  trialRecordsReviewed: 3,
  acceptedForStaging: 3,
  domainsReadyForStaging: '0/3',
  commands: [
    'pnpm ilm:reviewer-decision-trial',
    'pnpm check:ilm-reviewer-decision-trial',
    'pnpm ilm:evidence:list -- --status=accepted-for-staging'
  ]
};

export function IlmMateReviewerDecisionTrialCard() {
  return (
    <NoorCard>
      <div className="noor-row">
        <span className="noor-badge gold">ilm-mate reviewer decision</span>
        <span className="noor-badge emerald">Sprint 27.3</span>
      </div>
      <h2>{reviewerDecisionTrial.label}</h2>
      <p className="noor-subtitle">
        Accept the three Sprint 27.2 source-identity sample submissions for staging review only.
        This proves reviewer decision handling while keeping production CDN promotion blocked.
      </p>
      <div className="noor-divider" />
      <div className="noor-mini-grid">
        <div className="noor-stat"><strong>Version</strong><span>{reviewerDecisionTrial.version}</span></div>
        <div className="noor-stat"><strong>Reviewed</strong><span>{reviewerDecisionTrial.trialRecordsReviewed}</span></div>
        <div className="noor-stat"><strong>Accepted for staging</strong><span>{reviewerDecisionTrial.acceptedForStaging}</span></div>
        <div className="noor-stat"><strong>Domains ready</strong><span>{reviewerDecisionTrial.domainsReadyForStaging}</span></div>
        <div className="noor-stat"><strong>Status</strong><span>{reviewerDecisionTrial.status}</span></div>
        <div className="noor-stat"><strong>Can promote</strong><span>{String(reviewerDecisionTrial.canPromoteToProduction)}</span></div>
      </div>
      <div className="noor-divider" />
      <p className="noor-subtitle">
        <strong>Output:</strong> <code>{reviewerDecisionTrial.outputRoot}</code>
      </p>
      <p className="noor-subtitle">
        <strong>Commands:</strong>{' '}
        {reviewerDecisionTrial.commands.map((command) => <code key={command}> {command} </code>)}
      </p>
      <div className="noor-divider" />
      <p className="noor-subtitle">
        Accepted for staging is not production approval. The <code>production_promotion_approval</code> records remain locked.
      </p>
    </NoorCard>
  );
}
