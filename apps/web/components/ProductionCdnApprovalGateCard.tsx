import { NoorCard } from '@noor/ui';
import { NOOR_PRODUCTION_CDN_APPROVAL_GATE } from '../lib/production-cdn-approval-gate';

function badgeFor(status: string) {
  if (status === 'approved') return 'noor-badge emerald';
  if (status === 'passed') return 'noor-badge emerald';
  if (status === 'next') return 'noor-badge gold';
  return 'noor-badge';
}

export function ProductionCdnApprovalGateCard() {
  return (
    <NoorCard>
      <div className="noor-row">
        <span className="noor-badge gold">Production CDN</span>
        <span className="noor-badge emerald">{NOOR_PRODUCTION_CDN_APPROVAL_GATE.sprint}</span>
      </div>
      <h2>{NOOR_PRODUCTION_CDN_APPROVAL_GATE.label}</h2>
      <p className="noor-subtitle">
        Sprint 27.13 records explicit approval for production promotion, while keeping the actual noor-cdn/main promotion for Sprint 27.14.
      </p>
      <div className="noor-divider" />
      <div className="noor-mini-grid">
        <div className="noor-stat"><strong>Source</strong><span>{NOOR_PRODUCTION_CDN_APPROVAL_GATE.sourceBranch}</span></div>
        <div className="noor-stat"><strong>Target</strong><span>{NOOR_PRODUCTION_CDN_APPROVAL_GATE.targetBranch}</span></div>
        <div className="noor-stat"><strong>Promotion executed</strong><span>{NOOR_PRODUCTION_CDN_APPROVAL_GATE.productionPromotionExecuted ? 'yes' : 'no'}</span></div>
      </div>
      <div className="noor-divider" />
      <div className="noor-stack">
        {NOOR_PRODUCTION_CDN_APPROVAL_GATE.steps.map((step) => (
          <div className="noor-card is-soft" key={step.id}>
            <div className="noor-row"><strong>{step.label}</strong><span className={badgeFor(step.status)}>{step.status}</span></div>
            <p className="noor-subtitle">{step.note}</p>
          </div>
        ))}
      </div>
      <div className="noor-divider" />
      <p className="noor-subtitle">Approval report: <code>{NOOR_PRODUCTION_CDN_APPROVAL_GATE.approvalReport}</code></p>
      <p className="noor-subtitle">
        Commands: {NOOR_PRODUCTION_CDN_APPROVAL_GATE.commands.map((command) => <code key={command}> {command} </code>)}
      </p>
    </NoorCard>
  );
}
