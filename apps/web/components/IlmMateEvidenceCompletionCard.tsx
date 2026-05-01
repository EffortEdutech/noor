import { NoorCard } from '@noor/ui';

const evidenceCompletion = {
  version: '0.27.0',
  label: 'ilm-mate evidence completion workflow',
  outputRoot: 'content-pipeline/review/ilm-mate-v1/evidence-records',
  status: 'blocked',
  productionApproved: false,
  canPromoteToProduction: false,
  records: 18,
  domains: ['Quran', 'Tafseer', 'Hadith'],
  commands: ['pnpm ilm:evidence-records', 'pnpm check:ilm-evidence-records'],
  outputs: [
    'evidence-completion-workflow.json',
    'evidence-completion-workflow.md',
    'evidence-completion-records.json',
    'evidence-completion-register.csv',
    'reviewer-decision-register.json',
    'reviewer-decision-register.csv',
    'editable-evidence-record-template.json'
  ]
};

export function IlmMateEvidenceCompletionCard() {
  return (
    <NoorCard>
      <div className="noor-row">
        <span className="noor-badge gold">ilm-mate evidence completion</span>
        <span className="noor-badge emerald">Sprint 27</span>
      </div>
      <h2>{evidenceCompletion.label}</h2>
      <p className="noor-subtitle">
        Convert reviewer submission templates into editable evidence records. Reviewers can mark
        items as submitted, under review, accepted for staging, rejected or needing more information.
        This remains a staging workflow only and does not approve production CDN publication.
      </p>
      <div className="noor-divider" />
      <div className="noor-mini-grid">
        <div className="noor-stat"><strong>Version</strong><span>{evidenceCompletion.version}</span></div>
        <div className="noor-stat"><strong>Status</strong><span>{evidenceCompletion.status}</span></div>
        <div className="noor-stat"><strong>Records</strong><span>{evidenceCompletion.records}</span></div>
        <div className="noor-stat"><strong>Production approved</strong><span>{String(evidenceCompletion.productionApproved)}</span></div>
        <div className="noor-stat"><strong>Can promote</strong><span>{String(evidenceCompletion.canPromoteToProduction)}</span></div>
      </div>
      <div className="noor-divider" />
      <p className="noor-subtitle"><strong>Domains:</strong> {evidenceCompletion.domains.map((domain) => <code key={domain}> {domain} </code>)}</p>
      <p className="noor-subtitle"><strong>Output:</strong> <code>{evidenceCompletion.outputRoot}</code></p>
      <p className="noor-subtitle"><strong>Commands:</strong> {evidenceCompletion.commands.map((command) => <code key={command}> {command} </code>)}</p>
      <p className="noor-subtitle"><strong>Outputs:</strong> {evidenceCompletion.outputs.map((file) => <code key={file}> {file} </code>)}</p>
      <div className="noor-divider" />
      <p className="noor-subtitle">
        Production approval records remain locked and blocked until a later explicit production
        promotion sprint.
      </p>
    </NoorCard>
  );
}
