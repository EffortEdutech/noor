import { NoorCard, PageHeader } from '@noor/ui';
import { NOOR_RELEASE_NOTES } from '../../lib/release-notes';

export default function ChangelogPage() {
  return (
    <main className="noor-page">
      <PageHeader
        kicker="Changelog"
        title="NOOR release history"
        subtitle="A human-readable record of NOOR foundation changes, aligned with version.json and GitHub release tags."
      />

      <NoorCard>
        <span className="noor-badge gold">Release flow</span>
        <h2>How NOOR releases work</h2>
        <p className="noor-subtitle">
          When a new version is pushed to main, GitHub Actions checks the app and creates a GitHub Release for that version if the tag does not already exist.
        </p>
        <div className="noor-divider" />
        <code>pnpm check:release</code>
      </NoorCard>

      {NOOR_RELEASE_NOTES.map((release) => (
        <NoorCard key={release.version}>
          <span className="noor-badge">v{release.version}</span>
          <h2>{release.title}</h2>
          <p className="noor-subtitle">Released: {release.date}</p>
          <p>{release.summary}</p>
          <ul className="noor-clean-list">
            {release.highlights.map((highlight) => (
              <li key={highlight}>✓ {highlight}</li>
            ))}
          </ul>
        </NoorCard>
      ))}
    </main>
  );
}
