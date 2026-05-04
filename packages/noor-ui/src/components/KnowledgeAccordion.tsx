'use client';

import { useState, type ReactNode } from 'react';

export type KnowledgeAccordionSection = {
  id: string;
  kicker?: string;
  title: string;
  summary: string;
  children: ReactNode;
  defaultOpen?: boolean;
  actionHref?: string;
  actionLabel?: string;
};

export type KnowledgeAccordionProps = {
  title?: string;
  subtitle?: string;
  sections: KnowledgeAccordionSection[];
  mode?: 'single' | 'multiple';
};

export function KnowledgeAccordion({
  title = 'Knowledge sections',
  subtitle = 'Open one section, learn it, then continue to the next section when you are ready.',
  sections,
  mode = 'single'
}: KnowledgeAccordionProps) {
  const visibleSections = sections.filter((section) => section.id && section.title);
  const initialOpenId =
    visibleSections.find((section) => section.defaultOpen)?.id ?? visibleSections[0]?.id ?? '';
  const [openIds, setOpenIds] = useState<string[]>(() => (initialOpenId ? [initialOpenId] : []));

  function toggleSection(sectionId: string) {
    setOpenIds((current) => {
      const isOpen = current.includes(sectionId);
      if (mode === 'multiple') {
        return isOpen ? current.filter((id) => id !== sectionId) : [...current, sectionId];
      }

      return isOpen ? [] : [sectionId];
    });
  }

  if (visibleSections.length === 0) return null;

  return (
    <section className="noor-knowledge-accordion" aria-label={title}>
      <div className="noor-knowledge-accordion-intro">
        <span className="noor-kicker">Simple knowledge delivery</span>
        <h2>{title}</h2>
        <p className="noor-subtitle">{subtitle}</p>
      </div>

      <div className="noor-knowledge-accordion-list">
        {visibleSections.map((section, index) => {
          const isOpen = openIds.includes(section.id);
          const panelId = `${section.id}-knowledge-panel`;

          return (
            <article
              key={section.id}
              id={section.id}
              className="noor-knowledge-accordion-item noor-anchor-wrap"
              data-open={isOpen}
            >
              <button
                type="button"
                className="noor-knowledge-accordion-trigger"
                aria-expanded={isOpen}
                aria-controls={panelId}
                onClick={() => toggleSection(section.id)}
              >
                <span className="noor-knowledge-accordion-number">{index + 1}</span>
                <span className="noor-knowledge-accordion-copy">
                  <small>{section.kicker ?? 'Knowledge step'}</small>
                  <strong>{section.title}</strong>
                  <em>{section.summary}</em>
                </span>
                <span className="noor-knowledge-accordion-status">{isOpen ? 'Collapse' : 'Expand'}</span>
              </button>

              {isOpen ? (
                <div id={panelId} className="noor-knowledge-accordion-panel">
                  {section.children}
                  {section.actionHref ? (
                    <div className="noor-card-actions noor-knowledge-accordion-panel-actions">
                      <a className="noor-button" href={section.actionHref}>
                        {section.actionLabel ?? 'Continue'}
                      </a>
                    </div>
                  ) : null}
                </div>
              ) : null}
            </article>
          );
        })}
      </div>
    </section>
  );
}
