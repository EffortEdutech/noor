import { NoorCard } from '@noor/ui';

const stagingCdnPack = {
  version: '0.27.4',
  label: 'ilm-mate staging CDN publish pack gate',
  outputRoot: 'content-pipeline/review/ilm-mate-v1/staging-cdn-publish',
  targetRepo: 'EffortEdutech/noor-cdn',
  targetBranch: 'staging-ilm-mate-v1',
  status: 'blocked',
  domainsReadyForStaging: '0/3',
  canPushNoorCdnStaging: false,
  canPushNoorCdnMain: false,
  productionApproved: false,
  canPromoteToProduction: false,
  commands: [
    'pnpm ilm:staging-cdn-pack',
    'pnpm check:ilm-staging-cdn-pack',
    'pnpm ilm:evidence:list -- --status=accepted-for-staging'
  ]
};

export function IlmMateStagingCdnPackCard() {
  return (
    <NoorCard>
      <div className="noor-row">
        <span className="noor-badge gold">ilm-mate staging CDN</span>
        <span className="noor-badge emerald">Sprint 27.4</span>
      </div>
      <h2>{stagingCdnPack.label}</h2>
      <p className="noor-subtitle">
        Prepare the controlled staging CDN publish gate for migrated ilm-mate content.
        This card does not approve production and does not permit <code>noor-cdn/main</code> publication.
      </p>
      <div className="noor-divider" />
      <div className="noor-mini-grid">
        <div className="noor-stat"><strong>Version</strong><span>{stagingCdnPack.version}</span></div>
        <div className="noor-stat"><strong>Domains ready</strong><span>{stagingCdnPack.domainsReadyForStaging}</span></div>
        <div className="noor-stat"><strong>Staging push</strong><span>{String(stagingCdnPack.canPushNoorCdnStaging)}</span></div>
        <div className="noor-stat"><strong>Main push</strong><span>{String(stagingCdnPack.canPushNoorCdnMain)}</span></div>
        <div className="noor-stat"><strong>Status</strong><span>{stagingCdnPack.status}</span></div>
        <div className="noor-stat"><strong>Can promote</strong><span>{String(stagingCdnPack.canPromoteToProduction)}</span></div>
      </div>
      <div className="noor-divider" />
      <p className="noor-subtitle">
        <strong>Target:</strong> <code>{stagingCdnPack.targetRepo}</code> branch <code>{stagingCdnPack.targetBranch}</code>
      </p>
      <p className="noor-subtitle">
        <strong>Output:</strong> <code>{stagingCdnPack.outputRoot}</code>
      </p>
      <p className="noor-subtitle">
        <strong>Commands:</strong>{' '}
        {stagingCdnPack.commands.map((command) => <code key={command}> {command} </code>)}
      </p>
      <div className="noor-divider" />
      <p className="noor-subtitle">
        Current state remains blocked because each domain still needs accepted license, attribution,
        checksum/integrity and scholarly reviewer sign-off evidence before a staging CDN candidate can be pushed.
      </p>
    </NoorCard>
  );
}
