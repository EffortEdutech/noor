import { NoorCard } from '@noor/ui';

const evidenceIntake = {
  version: '0.26.9',
  label: 'ilm-mate evidence intake pack',
  outputRoot: 'content-pipeline/review/ilm-mate-v1/evidence-intake',
  status: 'blocked',
  productionApproved: false,
  canPromoteToProduction: false,
  forms: 18,
  domains: ['Quran', 'Tafseer', 'Hadith'],
  commands: ['pnpm ilm:evidence-intake', 'pnpm check:ilm-evidence-intake'],
  outputs: [
    'evidence-intake-pack.json',
    'evidence-intake-pack.md',
    'reviewer-submission-forms.json',
    'reviewer-submission-forms.csv',
    'templates/quran-evidence-submission-template.md',
    'templates/tafseer-evidence-submission-template.md',
    'templates/hadith-evidence-submission-template.md'
  ]
};

export function IlmMateEvidenceIntakeCard() {
  return (
    <NoorCard>
      <div className="noor-row">
        <span className="noor-badge gold">ilm-mate evidence intake</span>
        <span className="noor-badge emerald">Sprint 26.9</span>
      </div>
      <h2>{evidenceIntake.label}</h2>
      <p className="noor-subtitle">
        Prepare reviewer submission templates for the missing Quran, tafseer and hadith evidence
        items. This is an intake pack only: it does not approve production and does not publish to
        the NOOR CDN repository.
      </p>
      <div className="noor-divider" />
      <div className="noor-mini-grid">
        <div className="noor-stat"><strong>Version</strong><span>{evidenceIntake.version}</span></div>
        <div className="noor-stat"><strong>Status</strong><span>{evidenceIntake.status}</span></div>
        <div className="noor-stat"><strong>Forms</strong><span>{evidenceIntake.forms}</span></div>
        <div className="noor-stat"><strong>Production approved</strong><span>{String(evidenceIntake.productionApproved)}</span></div>
        <div className="noor-stat"><strong>Can promote</strong><span>{String(evidenceIntake.canPromoteToProduction)}</span></div>
      </div>
      <div className="noor-divider" />
      <p className="noor-subtitle"><strong>Domains:</strong> {evidenceIntake.domains.map((domain) => <code key={domain}> {domain} </code>)}</p>
      <p className="noor-subtitle"><strong>Output:</strong> <code>{evidenceIntake.outputRoot}</code></p>
      <p className="noor-subtitle"><strong>Commands:</strong> {evidenceIntake.commands.map((command) => <code key={command}> {command} </code>)}</p>
      <p className="noor-subtitle"><strong>Outputs:</strong> {evidenceIntake.outputs.map((file) => <code key={file}> {file} </code>)}</p>
      <div className="noor-divider" />
      <p className="noor-subtitle">
        Sprint 26.9 helps collect evidence. Production promotion remains blocked until a later
        explicit approval and promotion sprint.
      </p>
    </NoorCard>
  );
}
