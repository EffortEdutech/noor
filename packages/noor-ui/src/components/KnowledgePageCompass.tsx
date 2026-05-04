export type KnowledgePageCompassStep = {
  id: string;
  label: string;
  description: string;
  href?: string;
  badge?: string;
};

export type KnowledgePageCompassRecommended = {
  label?: string;
  title: string;
  description: string;
  href?: string;
  actionLabel?: string;
};

export type KnowledgePageCompassProps = {
  kicker?: string;
  title: string;
  subtitle: string;
  steps: KnowledgePageCompassStep[];
  recommended?: KnowledgePageCompassRecommended;
  currentStepId?: string;
  compact?: boolean;
};

export function KnowledgePageCompass({
  kicker = 'Page compass',
  title,
  subtitle,
  steps,
  recommended,
  currentStepId,
  compact = false
}: KnowledgePageCompassProps) {
  const visibleSteps = steps.filter((step) => step.id && step.label);

  return (
    <section className={`noor-page-compass${compact ? ' compact' : ''}`} aria-label={title}>
      <div className="noor-page-compass-intro">
        <span className="noor-kicker">{kicker}</span>
        <h2>{title}</h2>
        <p className="noor-subtitle">{subtitle}</p>
      </div>

      <nav className="noor-page-compass-steps" aria-label="In-page knowledge navigation">
        {visibleSteps.map((step, index) => {
          const href = step.href ?? `#${step.id}`;
          const active = currentStepId === step.id;

          return (
            <a
              key={step.id}
              className="noor-page-compass-step"
              href={href}
              data-active={active}
            >
              <span className="noor-page-compass-step-index">{step.badge ?? index + 1}</span>
              <strong>{step.label}</strong>
              <small>{step.description}</small>
            </a>
          );
        })}
      </nav>

      {recommended ? (
        <div className="noor-page-compass-recommended">
          <span className="noor-badge gold">{recommended.label ?? 'Recommended next step'}</span>
          <div>
            <strong>{recommended.title}</strong>
            <p>{recommended.description}</p>
          </div>
          {recommended.href ? (
            <a className="noor-button" href={recommended.href}>
              {recommended.actionLabel ?? 'Start here'}
            </a>
          ) : null}
        </div>
      ) : null}
    </section>
  );
}
