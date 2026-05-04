export type NoorSourceConnection = {
  label: string;
  title: string;
  description: string;
  href?: string;
  badge?: string;
};

export type SourceConnectionsPanelProps = {
  title?: string;
  subtitle?: string;
  connections: NoorSourceConnection[];
  compact?: boolean;
};

export function SourceConnectionsPanel({
  title = 'Connections',
  subtitle = 'Continue from this source into related Quran, Tafseer, Hadith, topics or practice.',
  connections,
  compact = false
}: SourceConnectionsPanelProps) {
  const visibleConnections = connections.filter((item) => item.title && item.description);

  if (visibleConnections.length === 0) return null;

  return (
    <section className={`noor-source-connections${compact ? ' compact' : ''}`} aria-label={title}>
      <div className="noor-source-connections-header">
        <div>
          <span className="noor-kicker">{title}</span>
          <p className="noor-subtitle">{subtitle}</p>
        </div>
      </div>

      <div className="noor-source-connection-grid">
        {visibleConnections.map((connection, index) => {
          const content = (
            <>
              <span className="noor-badge emerald">{connection.badge ?? connection.label}</span>
              <strong>{connection.title}</strong>
              <span>{connection.description}</span>
            </>
          );

          if (connection.href) {
            return (
              <a
                key={`${connection.label}-${index}`}
                className="noor-source-connection-card"
                href={connection.href}
              >
                {content}
              </a>
            );
          }

          return (
            <div key={`${connection.label}-${index}`} className="noor-source-connection-card">
              {content}
            </div>
          );
        })}
      </div>
    </section>
  );
}
