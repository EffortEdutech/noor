import { NOOR_NAV_ITEMS } from '@noor/config';
import type { ReactNode } from 'react';

function isActive(currentPath: string, href: string) {
  if (href === '/today') return currentPath === '/' || currentPath.startsWith('/today');
  return currentPath.startsWith(href);
}

export function AppShell({ children, currentPath }: { children: ReactNode; currentPath: string }) {
  return (
    <div className="noor-app-shell">
      <div className="noor-app-frame">
        <header className="noor-topbar">
          <a className="noor-brand" href="/today" aria-label="NOOR home">
            <span className="noor-mark" aria-hidden="true">
              <img className="noor-mark-img" src="/icons/noor-mark.svg?v=noor-app-mark" alt="" width="42" height="42" />
            </span>
            <span>
              <span className="noor-brand-title">NOOR</span>
              <span className="noor-brand-subtitle">Daily Islamic Companion</span>
            </span>
          </a>
          <nav className="noor-topbar-actions" aria-label="Utility navigation">
            <div id="noor-knowledge-nav-slot" className="noor-topbar-knowledge-slot" />
            <div id="noor-quran-reader-mode-slot" className="noor-topbar-mode-slot" />
            <a className="noor-badge" href="/settings">Settings</a>
          </nav>
        </header>

        {children}

        <div className="noor-bottom-nav-wrap">
          <nav className="noor-bottom-nav" aria-label="Main navigation">
            {NOOR_NAV_ITEMS.map((item) => (
              <a key={item.href} href={item.href} data-active={isActive(currentPath, item.href)}>
                <span className="noor-nav-icon">{item.icon}</span>
                <span>{item.label}</span>
              </a>
            ))}
          </nav>
        </div>
      </div>
    </div>
  );
}
