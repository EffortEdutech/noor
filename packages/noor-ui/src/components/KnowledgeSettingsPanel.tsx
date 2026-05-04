'use client';

import { type CSSProperties, type ReactNode, useMemo, useState } from 'react';

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

function getInitialOpenId(items: KnowledgeSettingsPanelItem[], defaultOpenId?: string) {
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
  singleOpen = false,
  className = ''
}: KnowledgeSettingsPanelProps) {
  const panelItems = useMemo(() => items ?? sections ?? [], [items, sections]);
  const [openIds, setOpenIds] = useState<string[]>(() => {
    const initial = getInitialOpenId(panelItems, defaultOpenId);
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
    <section className={className} style={S.panel}>
      {title || subtitle ? (
        <div style={S.pageHeader}>
          {title ? <h2 style={S.pageTitle}>{title}</h2> : null}
          {subtitle ? <p style={S.pageSub}>{subtitle}</p> : null}
        </div>
      ) : null}

      <div style={S.list}>
        {panelItems.map((item) => {
          const isOpen = openIds.includes(item.id);
          const content = item.content ?? item.children;
          const href = item.actionHref ?? item.href;
          const previewItems = getPreviewItems(item);
          const summary = item.summary ?? item.description ?? '';

          return (
            <section key={item.id} style={{ ...S.accordion, ...(isOpen ? S.accordionOpen : null) }}>
              <button
                type="button"
                onClick={() => toggleItem(item.id)}
                aria-expanded={isOpen}
                aria-controls={`noor-knowledge-section-${item.id}`}
                style={S.accordionButton}
              >
                <span aria-hidden="true" style={S.accordionIcon}>{item.icon ?? '📘'}</span>

                <span style={S.accordionTextBlock}>
                  <span style={S.accordionTitle}>{item.title}</span>
                  {summary ? <span style={S.accordionDesc}>{summary}</span> : null}
                  {!isOpen && previewItems.length > 0 ? (
                    <span style={S.previewWrap}>
                      {previewItems.map((preview) => (
                        <span key={`${item.id}-${String(preview)}`} style={S.previewPill}>{preview}</span>
                      ))}
                    </span>
                  ) : null}
                </span>

                <span aria-hidden="true" style={S.accordionChevron}>{isOpen ? '▾' : '▸'}</span>
              </button>

              {isOpen ? (
                <div id={`noor-knowledge-section-${item.id}`} style={S.accordionBody}>
                  {content ? <div style={S.contentInner}>{content}</div> : null}
                  {href ? (
                    <div style={S.actionRow}>
                      <a href={href} style={S.primaryButton}>{item.actionLabel ?? 'Open'}</a>
                    </div>
                  ) : null}
                </div>
              ) : null}
            </section>
          );
        })}
      </div>
    </section>
  );
}

const S: Record<string, CSSProperties> = {
  panel: {
    display: 'flex',
    flexDirection: 'column',
    gap: 14,
    width: '100%',
    color: '#0f172a'
  },
  pageHeader: {
    display: 'flex',
    flexDirection: 'column',
    gap: 4,
    padding: '0 2px 2px'
  },
  pageTitle: {
    margin: 0,
    color: '#0f172a',
    fontSize: 22,
    fontWeight: 800,
    letterSpacing: '-0.02em'
  },
  pageSub: {
    margin: '6px 0 0',
    color: '#475569',
    fontSize: 13.5,
    lineHeight: 1.6
  },
  list: {
    display: 'flex',
    flexDirection: 'column',
    gap: 14
  },
  accordion: {
    backgroundColor: '#ffffff',
    border: '1px solid #d8e1ec',
    borderRadius: 20,
    boxShadow: '0 8px 22px rgba(15, 23, 42, 0.045)',
    overflow: 'hidden'
  },
  accordionOpen: {
    borderColor: '#b8c7d9',
    boxShadow: '0 14px 34px rgba(15, 23, 42, 0.075)'
  },
  accordionButton: {
    display: 'grid',
    gridTemplateColumns: '42px minmax(0, 1fr) 20px',
    alignItems: 'start',
    gap: 14,
    width: '100%',
    padding: '20px 22px',
    border: 0,
    backgroundColor: '#ffffff',
    color: '#0f172a',
    textAlign: 'left',
    cursor: 'pointer',
    font: 'inherit'
  },
  accordionIcon: {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: 42,
    minWidth: 42,
    height: 42,
    borderRadius: 14,
    backgroundColor: '#eef6f4',
    border: '1px solid #d8e1ec',
    color: '#0f172a',
    fontSize: 22,
    lineHeight: 1,
    overflow: 'hidden'
  },
  accordionTextBlock: {
    display: 'flex',
    flexDirection: 'column',
    gap: 8,
    minWidth: 0
  },
  accordionTitle: {
    display: 'block',
    color: '#0f172a',
    fontSize: 20,
    fontWeight: 800,
    lineHeight: 1.22,
    letterSpacing: '-0.02em'
  },
  accordionDesc: {
    display: 'block',
    color: '#475569',
    fontSize: 13.5,
    lineHeight: 1.65,
    maxWidth: 760
  },
  previewWrap: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 2
  },
  previewPill: {
    display: 'inline-flex',
    alignItems: 'center',
    minHeight: 32,
    padding: '7px 11px',
    border: '1px solid #d8e1ec',
    borderRadius: 999,
    backgroundColor: '#f8fafc',
    color: '#334155',
    fontSize: 13,
    fontWeight: 650,
    lineHeight: 1.2
  },
  accordionChevron: {
    marginTop: 7,
    color: '#64748b',
    fontSize: 18,
    fontWeight: 800,
    lineHeight: 1,
    textAlign: 'right'
  },
  accordionBody: {
    borderTop: '1px solid #e5edf6',
    backgroundColor: '#ffffff',
    color: '#0f172a'
  },
  contentInner: {
    display: 'flex',
    flexDirection: 'column',
    gap: 12,
    padding: '18px 22px 22px',
    color: '#0f172a'
  },
  actionRow: {
    display: 'flex',
    justifyContent: 'flex-start',
    padding: '0 22px 22px'
  },
  primaryButton: {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 40,
    padding: '9px 14px',
    borderRadius: 12,
    backgroundColor: '#0f766e',
    border: '1px solid #0f766e',
    color: '#ffffff',
    fontSize: 13,
    fontWeight: 750,
    textDecoration: 'none'
  }
};
