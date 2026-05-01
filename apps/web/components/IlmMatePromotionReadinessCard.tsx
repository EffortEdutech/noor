import { NoorCard } from '@noor/ui';

const promotionReadiness = {
  version: '0.26.8',
  label: 'ilm-mate promotion readiness gate',
  outputRoot: 'content-pipeline/review/ilm-mate-v1/promotion-readiness',
  status: 'blocked',
  productionApproved: false,
  canPromoteToProduction: false,
  domains: ['Quran', 'Tafseer', 'Hadith'],
  commands: ['pnpm ilm:promotion-readiness', 'pnpm check:ilm-promotion-readiness'],
  outputs: ['promotion-readiness-report.json', 'promotion-readiness-report.md', 'promotion-readiness-domains.csv', 'promotion-readiness-evidence.csv']
};

export function IlmMatePromotionReadinessCard() {
  return (
    <NoorCard>
      <div className="noor-row">
        <span className="noor-badge gold">ilm-mate promotion readiness</span>
        <span className="noor-badge emerald">Sprint 26.8</span>
      </div>
      <h2>{promotionReadiness.label}</h2>
      <p className="noor-subtitle">
        Calculates whether migrated ilm-mate content has enough review evidence to become a future
        promotion candidate. This is a gate report only; it does not publish content and does not
        approve production CDN.
      </p>
      <div className="noor-divider" />
      <div className="noor-mini-grid">
        <div className="noor-stat"><strong>Version</strong><span>{promotionReadiness.version}</span></div>
        <div className="noor-stat"><strong>Status</strong><span>{promotionReadiness.status}</span></div>
        <div className="noor-stat"><strong>Production approval</strong><span>{String(promotionReadiness.productionApproved)}</span></div>
        <div className="noor-stat"><strong>Can promote</strong><span>{String(promotionReadiness.canPromoteToProduction)}</span></div>
      </div>
      <div className="noor-divider" />
      <p className="noor-subtitle"><strong>Domains:</strong> {promotionReadiness.domains.map((domain) => <code key={domain}> {domain} </code>)}</p>
      <p className="noor-subtitle"><strong>Output:</strong> <code>{promotionReadiness.outputRoot}</code></p>
      <p className="noor-subtitle"><strong>Commands:</strong> {promotionReadiness.commands.map((command) => <code key={command}> {command} </code>)}</p>
      <p className="noor-subtitle"><strong>Outputs:</strong> {promotionReadiness.outputs.map((file) => <code key={file}> {file} </code>)}</p>
      <div className="noor-divider" />
      <p className="noor-subtitle">
        Sprint 26.8 remains blocked by design. Production promotion needs a later explicit approval
        sprint after source, license, attribution, checksum and scholarly sign-off evidence is complete.
      </p>
    </NoorCard>
  );
}
