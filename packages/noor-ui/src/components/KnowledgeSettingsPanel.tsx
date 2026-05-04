'use client';

import { type ReactNode, useMemo, useState } from 'react';

export type KnowledgeSettingsPanelItem = {
  id: string;
  title: string;
  summary?: string;
  description?: string;
  icon?: ReactNode;
  eyebrow?: string;
  badge?: string;
  chips?: Array<string | number>;
  meta?: Array<string | number>;
  previewItems?: Array<string | number>;
  href?: string;
  actionHref?: string;
  actionLabel?: string;
  content?: ReactNode;
  children?: ReactNode;
  defaultOpen?: boolean;
};

export type KnowledgeSettingsPanelProps = {
  title?: string;
  subtitle?: string;
  items?: KnowledgeSettingsPanelItem[];
  sections?: KnowledgeSettingsPanelItem[];
  defaultOpenId?: string;
  singleOpen?: boolean;
  className?: string;
};

function getInitialOpen(items: KnowledgeSettingsPanelItem[], defaultOpenId?: string) {
  if (defaultOpenId && items.some((item) => item.id === defaultOpenId)) return defaultOpenId;
  return items.find((item) => item.defaultOpen)?.id ?? null;
}

function getPreviewItems(item: KnowledgeSettingsPanelItem) {
  const values = item.previewItems ?? item.chips ?? item.meta ?? [];
  const label = item.eyebrow ?? item.badge;
  return label ? [label, ...values] : values;
}

export function KnowledgeSettingsPanel({
  title,
  subtitle,
  items,
  sections,
  defaultOpenId,
  singleOpen = true,
  className = ''
}: KnowledgeSettingsPanelProps) {
  const panelItems = useMemo(() => items ?? sections ?? [], [items, sections]);
  const [openIds, setOpenIds] = useState<string[]>(() => {
    const initial = getInitialOpen(panelItems, defaultOpenId);
    return initial ? [initial] : [];
  });

  if (panelItems.length === 0) return null;

  function toggleItem(id: string) {
    setOpenIds((current) => {
      const isOpen = current.includes(id);
      if (singleOpen) return isOpen ? [] : [id];
      return isOpen ? current.filter((itemId) => itemId !== id) : [...current, id];
    });
  }

  return (
    <section className={`noor-learning-panel ${className}`.trim()}>
      {title || subtitle ? (
        <div className="noor-production-header">
          {title ? <h1>{title}</h1> : null}
          {subtitle ? <p>{subtitle}</p> : null}
        </div>
      ) : null}

      <div className="noor-learning-list">
        {panelItems.map((item) => {
          const isOpen = openIds.includes(item.id);
          const content = item.content ?? item.children;
          const href = item.actionHref ?? item.href;
          const preview = getPreviewItems(item);
          const summary = item.summary ?? item.description ?? '';

          return (
            <section key={item.id} className="noor-learning-section" data-open={isOpen ? 'true' : 'false'}>
              <button
                type="button"
                className="noor-learning-panel-button"
                onClick={() => toggleItem(item.id)}
                aria-expanded={isOpen}
                aria-controls={`noor-knowledge-section-${item.id}`}
              >
                <span className="noor-learning-icon" aria-hidden="true">{item.icon ?? '📘'}</span>
                <span className="noor-learning-summary-main">
                  <strong>{item.title}</strong>
                  {summary ? <span>{summary}</span> : null}
                  {!isOpen && preview.length > 0 ? (
                    <span className="noor-learning-preview">
                      {preview.map((value) => <em key={`${item.id}-${String(value)}`}>{value}</em>)}
                    </span>
                  ) : null}
                </span>
                <span
                  className="noor-learning-status"
                  data-symbol={isOpen ? '▾' : '▸'}
                  aria-hidden="true"
                >
                  {isOpen ? 'Close' : 'Open'}
                </span>
              </button>

              {isOpen ? (
                <div id={`noor-knowledge-section-${item.id}`} className="noor-learning-body">
                  {content}
                  {href ? <a className="noor-button secondary" href={href}>{item.actionLabel ?? 'Open'}</a> : null}
                </div>
              ) : null}
            </section>
          );
        })}
      </div>
    </section>
  );
}
