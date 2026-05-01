import { NoorCard } from '@noor/ui';

const evidenceUpdateHelper = {
  version: '0.27.1',
  label: 'ilm-mate evidence record update helper',
  outputRoot: 'content-pipeline/review/ilm-mate-v1/evidence-records/update-helper',
  status: 'blocked',
  productionApproved: false,
  canPromoteToProduction: false,
  commands: [
    'pnpm ilm:evidence-helper',
    'pnpm ilm:evidence:list',
    'pnpm ilm:evidence:update -- --id=<record-id> --status=submitted',
    'pnpm check:ilm-evidence-helper'
  ],
  allowedStatuses: [
    'draft',
    'not-submitted',
    'submitted',
    'under-review',
    'accepted-for-staging',
    'needs-more-information',
    'rejected'
  ]
};

export function IlmMateEvidenceUpdateHelperCard() {
  return (
    <NoorCard>
      <div className="noor-row">
        <span className="noor-badge gold">ilm-mate evidence helper</span>
        <span className="noor-badge emerald">Sprint 27.1</span>
      </div>
      <h2>{evidenceUpdateHelper.label}</h2>
      <p className="noor-subtitle">
        Safely update one Sprint 27 evidence record at a time from the command line.
        The helper syncs JSON and CSV review registers while keeping production promotion blocked.
      </p>
      <div className="noor-divider" />
      <div className="noor-mini-grid">
        <div className="noor-stat"><strong>Version</strong><span>{evidenceUpdateHelper.version}</span></div>
        <div className="noor-stat"><strong>Status</strong><span>{evidenceUpdateHelper.status}</span></div>
        <div className="noor-stat"><strong>Production approved</strong><span>{String(evidenceUpdateHelper.productionApproved)}</span></div>
        <div className="noor-stat"><strong>Can promote</strong><span>{String(evidenceUpdateHelper.canPromoteToProduction)}</span></div>
      </div>
      <div className="noor-divider" />
      <p className="noor-subtitle">
        <strong>Allowed statuses:</strong>{' '}
        {evidenceUpdateHelper.allowedStatuses.map((status) => <code key={status}> {status} </code>)}
      </p>
      <p className="noor-subtitle">
        <strong>Output:</strong> <code>{evidenceUpdateHelper.outputRoot}</code>
      </p>
      <p className="noor-subtitle">
        <strong>Commands:</strong>{' '}
        {evidenceUpdateHelper.commands.map((command) => <code key={command}> {command} </code>)}
      </p>
      <div className="noor-divider" />
      <p className="noor-subtitle">
        Production approval records remain locked. This helper can only update staging evidence records.
      </p>
    </NoorCard>
  );
}
