'use client';

import type { ReactNode } from 'react';
import { useState } from 'react';
import styles from './SettingsTabs.module.css';

export type SettingsTabSection = {
  id: string;
  label: string;
  eyebrow: string;
  title: string;
  description: string;
  children: ReactNode;
};

export function SettingsTabs({
  sections,
  defaultTab = sections[0]?.id
}: {
  sections: SettingsTabSection[];
  defaultTab?: string;
}) {
  const [activeTab, setActiveTab] = useState(defaultTab);

  const activeSection = sections.find((section) => section.id === activeTab) ?? sections[0];

  return (
    <section className={styles.shell} aria-label="Settings sections">
      <nav className={styles.tabList} role="tablist" aria-label="Settings tabs">
        {sections.map((section) => (
          <button
            key={section.id}
            type="button"
            role="tab"
            aria-selected={activeSection.id === section.id}
            aria-controls={`settings-panel-${section.id}`}
            id={`settings-tab-${section.id}`}
            data-active={activeSection.id === section.id}
            onClick={() => setActiveTab(section.id)}
          >
            <span>{section.eyebrow}</span>
            <strong>{section.label}</strong>
          </button>
        ))}
      </nav>

      <div className={styles.panels}>
        {sections.map((section) => {
          const active = activeSection.id === section.id;

          return (
            <section
              key={section.id}
              id={`settings-panel-${section.id}`}
              role="tabpanel"
              aria-labelledby={`settings-tab-${section.id}`}
              hidden={!active}
              className={styles.panel}
            >
              <header className={styles.panelHeader}>
                <span>{section.eyebrow}</span>
                <h2>{section.title}</h2>
                <p>{section.description}</p>
              </header>
              <div className={styles.panelBody}>{section.children}</div>
            </section>
          );
        })}
      </div>
    </section>
  );
}
