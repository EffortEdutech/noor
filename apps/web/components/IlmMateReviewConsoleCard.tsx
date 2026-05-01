import { NoorCard } from '@noor/ui';

const reviewConsole = {
  version: '0.26.6',
  label: 'ilm-mate migrated content review console',
  sourceRoot: 'content-pipeline/imported/ilm-mate-v1/noor-cdn',
  reviewRoot: 'content-pipeline/review/ilm-mate-v1',
  status: 'blocked',
  productionApproved: false,
  commands: ['pnpm ilm:review-console', 'pnpm check:ilm-review-console'],
  outputs: ['review-console.json', 'review-console.md', 'review-sample-queue.json', 'review-sample-queue.md', 'review-action-register.csv'],
  requiredEvidence: ['source identity', 'license or written redistribution permission', 'attribution wording', 'checksum/integrity plan', 'scholarly reviewer sign-off', 'production promotion approval']
};

export function IlmMateReviewConsoleCard() {
  return (
    <NoorCard>
      <div className="noor-row">
        <span className="noor-badge gold">ilm-mate migration review</span>
        <span className="noor-badge emerald">Sprint 26.6</span>
      </div>
      <h2>{reviewConsole.label}</h2>
      <p className="noor-subtitle">
        Generate a review queue from the Sprint 26.5 migrated staging output. This gives reviewers
        a visible Quran, tafseer and hadith sampling workflow while keeping production CDN promotion blocked.
      </p>
      <div className="noor-divider" />
      <div className="noor-mini-grid">
        <div className="noor-stat"><strong>Version</strong><span>{reviewConsole.version}</span></div>
        <div className="noor-stat"><strong>Status</strong><span>{reviewConsole.status}</span></div>
        <div className="noor-stat"><strong>Production approval</strong><span>{String(reviewConsole.productionApproved)}</span></div>
      </div>
      <div className="noor-divider" />
      <p className="noor-subtitle"><strong>Source:</strong> <code>{reviewConsole.sourceRoot}</code></p>
      <p className="noor-subtitle"><strong>Review output:</strong> <code>{reviewConsole.reviewRoot}</code></p>
      <div className="noor-divider" />
      <p className="noor-subtitle">Commands: {reviewConsole.commands.map((command) => <code key={command}> {command} </code>)}</p>
      <p className="noor-subtitle">Outputs: {reviewConsole.outputs.map((file) => <code key={file}> {file} </code>)}</p>
      <p className="noor-subtitle">Required evidence: {reviewConsole.requiredEvidence.map((item) => <code key={item}> {item} </code>)}</p>
      <div className="noor-divider" />
      <p className="noor-subtitle">Sprint 26.6 is a review-console layer only. It does not approve, replace or publish sacred content.</p>
    </NoorCard>
  );
}
