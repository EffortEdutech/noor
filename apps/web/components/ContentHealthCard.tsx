import type { ContentHealthReport } from '@noor/content';
import { NoorCard } from '@noor/ui';

function statusLabel(isHealthy: boolean) {
  return isHealthy ? 'Healthy' : 'Needs attention';
}

function severityClass(severity: 'info' | 'warning' | 'error') {
  if (severity === 'error') return 'noor-badge danger';
  if (severity === 'warning') return 'noor-badge gold';
  return 'noor-badge';
}

export function ContentHealthCard({ report }: { report: ContentHealthReport }) {
  const { manifest, summary } = report;

  return (
    <NoorCard variant="soft">
      <div className="noor-row">
        <span className={report.isHealthy ? 'noor-badge emerald' : 'noor-badge gold'}>
          Content {statusLabel(report.isHealthy)}
        </span>
        <span className="noor-reference">Manifest v{manifest.version}</span>
      </div>

      <h2>Content integrity</h2>
      <p className="noor-subtitle">
        {manifest.label}. This checks demo Quran coverage, tafseer links and hadith collection readiness before moving to external CDN data.
      </p>

      <div className="noor-divider" />

      <div className="noor-grid compact">
        <div>
          <p className="noor-reference">Surah content</p>
          <strong>{summary.surahContentCount}/{summary.surahIndexedCount}</strong>
        </div>
        <div>
          <p className="noor-reference">Ayah records</p>
          <strong>{summary.ayahContentCount}</strong>
        </div>
        <div>
          <p className="noor-reference">Tafseer entries</p>
          <strong>{summary.tafseerEntryCount}</strong>
        </div>
        <div>
          <p className="noor-reference">Hadith items</p>
          <strong>{summary.hadithItemCount}</strong>
        </div>
      </div>

      <div className="noor-divider" />

      <h3>Datasets</h3>
      <div className="noor-stack tight">
        {Object.values(manifest.datasets).map((dataset) => (
          <div className="noor-row" key={dataset.id}>
            <div>
              <strong>{dataset.label}</strong>
              <p className="noor-subtitle">{dataset.sourceLabel}</p>
            </div>
            <span className="noor-badge">{dataset.status}</span>
          </div>
        ))}
      </div>

      <div className="noor-divider" />

      <h3>Notes</h3>
      <div className="noor-stack tight">
        {report.issues.map((issue, index) => (
          <div className="noor-row" key={`${issue.area}-${issue.reference ?? index}-${issue.message}`}>
            <span className={severityClass(issue.severity)}>{issue.severity}</span>
            <p className="noor-subtitle" style={{ margin: 0, flex: 1 }}>
              <strong>{issue.area}:</strong> {issue.message}
            </p>
          </div>
        ))}
      </div>
    </NoorCard>
  );
}
