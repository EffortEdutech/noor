import { NoorCard } from '@noor/ui';

const stagingRuntime = {
  version: '0.27.9',
  label: 'noor-cdn staging runtime test',
  targetRepo: 'EffortEdutech/noor-cdn',
  targetBranch: 'staging-ilm-mate-v1',
  stagingBase: 'https://cdn.jsdelivr.net/gh/EffortEdutech/noor-cdn@staging-ilm-mate-v1/noor-cdn',
  reportPath: 'content-pipeline/review/ilm-mate-v1/noor-cdn-staging-runtime/staging-runtime-test-report.json',
  envTemplate: '.env.local.staging-ilm-mate-v1',
  canPushNoorCdnStaging: true,
  canPushNoorCdnMain: false,
  productionApproved: false,
  canPromoteToProduction: false,
  commands: [
    'pnpm cdn:staging-env',
    'pnpm cdn:test-staging',
    'pnpm check:cdn-staging-runtime'
  ]
};

export function NoorCdnStagingRuntimeTestCard() {
  return (
    <NoorCard>
      <div className="noor-row">
        <span className="noor-badge gold">noor-cdn staging runtime</span>
        <span className="noor-badge emerald">Sprint 27.9</span>
      </div>
      <h2>{stagingRuntime.label}</h2>
      <p className="noor-subtitle">
        Test the NOOR app against the separate <code>noor-cdn/staging-ilm-mate-v1</code> branch
        before any production CDN promotion. This validates runtime CDN loading only.
      </p>
      <div className="noor-divider" />
      <div className="noor-mini-grid">
        <div className="noor-stat"><strong>Version</strong><span>{stagingRuntime.version}</span></div>
        <div className="noor-stat"><strong>Target branch</strong><span>{stagingRuntime.targetBranch}</span></div>
        <div className="noor-stat"><strong>Staging test</strong><span>{String(stagingRuntime.canPushNoorCdnStaging)}</span></div>
        <div className="noor-stat"><strong>Main push</strong><span>{String(stagingRuntime.canPushNoorCdnMain)}</span></div>
        <div className="noor-stat"><strong>Production approved</strong><span>{String(stagingRuntime.productionApproved)}</span></div>
        <div className="noor-stat"><strong>Can promote</strong><span>{String(stagingRuntime.canPromoteToProduction)}</span></div>
      </div>
      <div className="noor-divider" />
      <p className="noor-subtitle">
        <strong>Staging base:</strong> <code>{stagingRuntime.stagingBase}</code>
      </p>
      <p className="noor-subtitle">
        <strong>Env template:</strong> <code>{stagingRuntime.envTemplate}</code>
      </p>
      <p className="noor-subtitle">
        <strong>Report:</strong> <code>{stagingRuntime.reportPath}</code>
      </p>
      <p className="noor-subtitle">
        <strong>Commands:</strong>{' '}
        {stagingRuntime.commands.map((command) => <code key={command}> {command} </code>)}
      </p>
      <div className="noor-divider" />
      <p className="noor-subtitle">
        Sprint 27.9 must not push <code>noor-cdn/main</code>. Production CDN remains blocked until a later explicit production approval sprint.
      </p>
    </NoorCard>
  );
}
