import { NoorCard } from '@noor/ui';

const reviewActions = {
  version: '0.26.7',
  label: 'ilm-mate review workflow actions',
  actionsRoot: 'content-pipeline/review/ilm-mate-v1/actions',
  status: 'blocked',
  productionApproved: false,
  domains: ['Quran', 'Tafseer', 'Hadith'],
  commands: ['pnpm ilm:review-actions', 'pnpm check:ilm-review-actions'],
  outputs: ['review-actions-register.json', 'review-actions-register.md', 'review-actions-register.csv', 'review-evidence-register.json', 'review-evidence-register.md', 'review-evidence-register.csv'],
  controls: ['Source identity', 'License or written redistribution permission', 'Attribution wording', 'Checksum / integrity plan', 'Scholarly reviewer sign-off', 'Production promotion approval']
};

export function IlmMateReviewActionsCard() {
  return (
    <NoorCard>
      <div className="noor-row">
        <span className="noor-badge gold">ilm-mate review actions</span>
        <span className="noor-badge emerald">Sprint 26.7</span>
      </div>
      <h2>{reviewActions.label}</h2>
      <p className="noor-subtitle">
        Convert the Sprint 26.6 review console into a practical evidence workflow for Quran,
        tafseer and hadith reviewers. This remains a blocked staging workflow and does not promote
        migrated ilm-mate content to production CDN.
      </p>
      <div className="noor-divider" />
      <div className="noor-mini-grid">
        <div className="noor-stat"><strong>Version</strong><span>{reviewActions.version}</span></div>
        <div className="noor-stat"><strong>Status</strong><span>{reviewActions.status}</span></div>
        <div className="noor-stat"><strong>Production approval</strong><span>{String(reviewActions.productionApproved)}</span></div>
      </div>
      <div className="noor-divider" />
      <p className="noor-subtitle"><strong>Domains:</strong> {reviewActions.domains.map((domain) => <code key={domain}> {domain} </code>)}</p>
      <p className="noor-subtitle"><strong>Actions output:</strong> <code>{reviewActions.actionsRoot}</code></p>
      <p className="noor-subtitle"><strong>Commands:</strong> {reviewActions.commands.map((command) => <code key={command}> {command} </code>)}</p>
      <p className="noor-subtitle"><strong>Outputs:</strong> {reviewActions.outputs.map((file) => <code key={file}> {file} </code>)}</p>
      <p className="noor-subtitle"><strong>Evidence controls:</strong> {reviewActions.controls.map((control) => <code key={control}> {control} </code>)}</p>
      <div className="noor-divider" />
      <p className="noor-subtitle">
        Sprint 26.7 creates evidence registers and reviewer action states only. Production promotion
        remains blocked until all evidence is complete and explicitly approved.
      </p>
    </NoorCard>
  );
}
