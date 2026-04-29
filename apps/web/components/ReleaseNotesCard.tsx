import { NoorCard } from '@noor/ui';
import { NOOR_RELEASE_NOTES, getCurrentReleaseNote } from '../lib/release-notes';

export function ReleaseNotesCard() {
  const current = getCurrentReleaseNote();
  const previous = NOOR_RELEASE_NOTES.slice(1, 4);

  return (
    <NoorCard>
      <div className="noor-row" style={{ alignItems: 'flex-start' }}>
        <div>
          <span className="noor-badge gold">Release</span>
          <h2>Release notes</h2>
          <p className="noor-subtitle">
            Track what changed in NOOR and confirm that the visible version, version.json and changelog stay aligned.
          </p>
        </div>
        <a className="noor-button subtle" href="/changelog">
          Open changelog
        </a>
      </div>

      <div className="noor-divider" />

      <section>
        <p className="noor-subtitle">Current release</p>
        <h3 style={{ margin: '4px 0' }}>v{current.version} · {current.title}</h3>
        <p className="noor-subtitle">{current.date}</p>
        <p>{current.summary}</p>
        <ul className="noor-clean-list">
          {current.highlights.map((highlight) => (
            <li key={highlight}>✓ {highlight}</li>
          ))}
        </ul>
      </section>

      {previous.length > 0 ? (
        <>
          <div className="noor-divider" />
          <p className="noor-subtitle">Recent releases</p>
          <div className="noor-stack compact">
            {previous.map((release) => (
              <div key={release.version} className="noor-mini-card">
                <strong>v{release.version}</strong>
                <p>{release.title}</p>
              </div>
            ))}
          </div>
        </>
      ) : null}
    </NoorCard>
  );
}
