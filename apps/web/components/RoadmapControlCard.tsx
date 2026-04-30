import { NoorCard } from '@noor/ui';
import { NOOR_MASTER_ROADMAP } from '../lib/roadmap';

function getBadgeClass(status: string) {
  if (status === 'complete') return 'noor-badge emerald';
  if (status === 'current' || status === 'next') return 'noor-badge gold';
  return 'noor-badge';
}

export function RoadmapControlCard() {
  return (
    <NoorCard>
      <div className="noor-row">
        <span className="noor-badge gold">Roadmap</span>
        <span className="noor-badge emerald">{NOOR_MASTER_ROADMAP.currentSprint.sprint}</span>
      </div>

      <h2>{NOOR_MASTER_ROADMAP.label}</h2>
      <p className="noor-subtitle">
        A visible release control center so NOOR always knows what is complete, what is current and what comes next.
      </p>

      <div className="noor-divider" />

      <div className="noor-mini-grid">
        <div className="noor-stat"><strong>Phase</strong><span>{NOOR_MASTER_ROADMAP.currentPhase}</span></div>
        <div className="noor-stat"><strong>Generated output</strong><span>{NOOR_MASTER_ROADMAP.generatedRoot}</span></div>
        <div className="noor-stat"><strong>Next sprint</strong><span>{NOOR_MASTER_ROADMAP.futureSprints[0].sprint}</span></div>
      </div>

      <div className="noor-divider" />

      <div className="noor-stack">
        <div className="noor-card is-soft">
          <div className="noor-row">
            <strong>{NOOR_MASTER_ROADMAP.currentSprint.sprint} · {NOOR_MASTER_ROADMAP.currentSprint.title}</strong>
            <span className={getBadgeClass(NOOR_MASTER_ROADMAP.currentSprint.status)}>{NOOR_MASTER_ROADMAP.currentSprint.status}</span>
          </div>
          <p className="noor-subtitle">{NOOR_MASTER_ROADMAP.currentSprint.objective}</p>
        </div>

        {NOOR_MASTER_ROADMAP.futureSprints.slice(0, 4).map((sprint) => (
          <div className="noor-card is-soft" key={sprint.sprint}>
            <div className="noor-row">
              <strong>{sprint.sprint} · {sprint.title}</strong>
              <span className={getBadgeClass(sprint.status)}>{sprint.status}</span>
            </div>
            <p className="noor-subtitle">{sprint.objective}</p>
          </div>
        ))}
      </div>

      <div className="noor-divider" />

      <p className="noor-subtitle">
        Commands: {NOOR_MASTER_ROADMAP.commands.map((command) => <code key={command}> {command} </code>)}
      </p>
      <p className="noor-subtitle">
        Docs: {NOOR_MASTER_ROADMAP.docs.map((doc) => <code key={doc}> {doc} </code>)}
      </p>
    </NoorCard>
  );
}
