import { NoorCard } from '@noor/ui';
import { NOOR_SCHOLARLY_REVIEW_CONSOLE } from '../lib/content-pipeline';

export function ScholarlyReviewConsoleCard() {
  return (
    <NoorCard>
      <div className="noor-row">
        <span className="noor-badge gold">Scholarly review</span>
        <span className="noor-badge emerald">Sprint 24</span>
      </div>

      <h2>{NOOR_SCHOLARLY_REVIEW_CONSOLE.label}</h2>
      <p className="noor-subtitle">
        Keep Quran, tafseer and hadith production approval visible without silently approving any content.
        Sprint 24 records reviewer evidence requirements and keeps every production gate blocked until sign-off is complete.
      </p>

      <div className="noor-divider" />

      <div className="noor-mini-grid">
        <div className="noor-stat"><strong>Console</strong><span>{NOOR_SCHOLARLY_REVIEW_CONSOLE.consoleId}</span></div>
        <div className="noor-stat"><strong>Registry</strong><span>{NOOR_SCHOLARLY_REVIEW_CONSOLE.reviewRegistry}</span></div>
        <div className="noor-stat"><strong>Audit</strong><span>{NOOR_SCHOLARLY_REVIEW_CONSOLE.generatedAuditFile}</span></div>
      </div>

      <div className="noor-divider" />

      <div className="noor-stack">
        {NOOR_SCHOLARLY_REVIEW_CONSOLE.steps.map((step) => (
          <div className="noor-card is-soft" key={step.id}>
            <div className="noor-row">
              <strong>{step.label}</strong>
              <span className={step.status === 'ready' ? 'noor-badge emerald' : 'noor-badge gold'}>{step.status}</span>
            </div>
            <p className="noor-subtitle">{step.note}</p>
          </div>
        ))}
      </div>

      <div className="noor-divider" />

      <p className="noor-subtitle">
        Required domains: {NOOR_SCHOLARLY_REVIEW_CONSOLE.requiredDomains.map((domain) => <code key={domain}> {domain} </code>)}
      </p>
      <p className="noor-subtitle">
        Required evidence: {NOOR_SCHOLARLY_REVIEW_CONSOLE.requiredEvidence.map((item) => <code key={item}> {item} </code>)}
      </p>
      <p className="noor-subtitle">
        Commands: {NOOR_SCHOLARLY_REVIEW_CONSOLE.commands.map((command) => <code key={command}> {command} </code>)}
      </p>
      <p className="noor-subtitle">
        Sprint 24 is a review-control layer only. It does not approve, replace or publish sacred content.
      </p>
    </NoorCard>
  );
}
