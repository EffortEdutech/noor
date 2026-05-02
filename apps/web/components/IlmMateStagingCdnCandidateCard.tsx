import { NoorCard } from '@noor/ui';

const stagingCandidate = {
  version: '0.27.7',
  label: 'ilm-mate staging CDN candidate pack',
  outputRoot: 'content-pipeline/review/ilm-mate-v1/staging-cdn-candidate',
  candidateRoot: 'content-pipeline/publish/ilm-mate-v1-staging-cdn/noor-cdn',
  targetRepo: 'EffortEdutech/noor-cdn',
  targetBranch: 'staging-ilm-mate-v1',
  status: 'staging-candidate-ready',
  domainsReadyForStaging: '3/3',
  canPushNoorCdnStaging: true,
  canPushNoorCdnMain: false,
  productionApproved: false,
  canPromoteToProduction: false,
  commands: [
    'pnpm ilm:staging-cdn-candidate',
    'pnpm check:ilm-staging-cdn-candidate'
  ]
};

export function IlmMateStagingCdnCandidateCard() {
  return (
    <NoorCard>
      <div className="noor-row">
        <span className="noor-badge gold">ilm-mate staging CDN candidate</span>
        <span className="noor-badge emerald">Sprint 27.7</span>
      </div>
      <h2>{stagingCandidate.label}</h2>
      <p className="noor-subtitle">
        Generate a staging-only CDN candidate pack from the migrated ilm-mate content after all
        non-production evidence is accepted for staging. This does not approve production.
      </p>
      <div className="noor-divider" />
      <div className="noor-mini-grid">
        <div className="noor-stat"><strong>Version</strong><span>{stagingCandidate.version}</span></div>
        <div className="noor-stat"><strong>Domains ready</strong><span>{stagingCandidate.domainsReadyForStaging}</span></div>
        <div className="noor-stat"><strong>Staging push</strong><span>{String(stagingCandidate.canPushNoorCdnStaging)}</span></div>
        <div className="noor-stat"><strong>Main push</strong><span>{String(stagingCandidate.canPushNoorCdnMain)}</span></div>
        <div className="noor-stat"><strong>Status</strong><span>{stagingCandidate.status}</span></div>
        <div className="noor-stat"><strong>Can promote</strong><span>{String(stagingCandidate.canPromoteToProduction)}</span></div>
      </div>
      <div className="noor-divider" />
      <p className="noor-subtitle">
        <strong>Target:</strong> <code>{stagingCandidate.targetRepo}</code> branch{' '}
        <code>{stagingCandidate.targetBranch}</code>
      </p>
      <p className="noor-subtitle">
        <strong>Candidate:</strong> <code>{stagingCandidate.candidateRoot}</code>
      </p>
      <p className="noor-subtitle">
        <strong>Report:</strong> <code>{stagingCandidate.outputRoot}</code>
      </p>
      <p className="noor-subtitle">
        <strong>Commands:</strong>{' '}
        {stagingCandidate.commands.map((command) => <code key={command}> {command} </code>)}
      </p>
      <div className="noor-divider" />
      <p className="noor-subtitle">
        Sprint 27.7 allows only a separate <code>noor-cdn/staging-ilm-mate-v1</code> branch candidate.
        <code> noor-cdn/main </code> remains blocked.
      </p>
    </NoorCard>
  );
}
