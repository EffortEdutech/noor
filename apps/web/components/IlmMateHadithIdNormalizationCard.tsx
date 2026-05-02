import { NoorCard } from '@noor/ui';

const hadithNormalization = {
  version: '0.27.9.1',
  label: 'Hadith collection ID normalization',
  status: 'staging hotfix',
  target: 'ilm-mate migrated Hadith collections',
  reportPath: 'content-pipeline/review/ilm-mate-v1/hadith-id-normalization/hadith-id-normalization-report.json',
  allowedTarget: 'noor-cdn/staging-ilm-mate-v1',
  blockedTargets: ['noor-cdn/main', 'production CDN'],
  commands: [
    'pnpm ilm:hadith:normalize-ids',
    'pnpm check:ilm-hadith-normalized-ids',
    'pnpm ilm:staging-cdn-candidate',
    'pnpm cdn:staging-git-safe'
  ]
};

export function IlmMateHadithIdNormalizationCard() {
  return (
    <NoorCard>
      <div className="noor-row">
        <span className="noor-badge gold">Hadith ID hotfix</span>
        <span className="noor-badge emerald">Sprint 27.9.1</span>
      </div>
      <h2>{hadithNormalization.label}</h2>
      <p className="noor-subtitle">
        Normalizes migrated ilm-mate Hadith collection IDs so every collection has a globally unique
        CDN folder and React key. This fixes duplicate IDs such as <code>all</code> and repeated numeric
        collection IDs before any production promotion.
      </p>
      <div className="noor-divider" />
      <div className="noor-mini-grid">
        <div className="noor-stat"><strong>Version</strong><span>{hadithNormalization.version}</span></div>
        <div className="noor-stat"><strong>Status</strong><span>{hadithNormalization.status}</span></div>
        <div className="noor-stat"><strong>Allowed target</strong><span>{hadithNormalization.allowedTarget}</span></div>
        <div className="noor-stat"><strong>Blocked</strong><span>{hadithNormalization.blockedTargets.join(', ')}</span></div>
      </div>
      <div className="noor-divider" />
      <p className="noor-subtitle">
        <strong>Report:</strong> <code>{hadithNormalization.reportPath}</code>
      </p>
      <p className="noor-subtitle">
        <strong>Commands:</strong>{' '}
        {hadithNormalization.commands.map((command) => <code key={command}> {command} </code>)}
      </p>
      <p className="noor-subtitle">
        Production CDN remains blocked. This sprint updates staging candidate content only.
      </p>
    </NoorCard>
  );
}
