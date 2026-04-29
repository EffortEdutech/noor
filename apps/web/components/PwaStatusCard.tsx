'use client';

import { NoorCard } from '@noor/ui';
import { useEffect, useState } from 'react';
import { NOOR_APP_VERSION } from '../lib/app-version';

type PwaStatus = {
  serviceWorker: string;
  displayMode: string;
  online: string;
  version: string;
};

type NavigatorWithStandalone = Navigator & { standalone?: boolean };

function getDisplayMode() {
  if (typeof window === 'undefined') return 'Checking';

  if (window.matchMedia('(display-mode: standalone)').matches || (navigator as NavigatorWithStandalone).standalone) {
    return 'Installed / standalone';
  }

  if (window.matchMedia('(display-mode: browser)').matches) return 'Browser tab';
  return 'Browser';
}

export function PwaStatusCard() {
  const [status, setStatus] = useState<PwaStatus>({
    serviceWorker: 'Checking',
    displayMode: 'Checking',
    online: 'Checking',
    version: `v${NOOR_APP_VERSION}`
  });

  useEffect(() => {
    let active = true;

    const refresh = async () => {
      const serviceWorker = 'serviceWorker' in navigator
        ? navigator.serviceWorker.controller
          ? 'Active and controlling this page'
          : 'Supported, waiting for page reload/control'
        : 'Not supported by this browser';

      let version = `v${NOOR_APP_VERSION}`;
      try {
        const response = await fetch(`/version.json?ts=${Date.now()}`, { cache: 'no-store' });
        if (response.ok) {
          const payload = (await response.json()) as { version?: string; label?: string };
          version = payload.version ? `v${payload.version}${payload.label ? ` · ${payload.label}` : ''}` : version;
        }
      } catch {
        version = `${version} · local fallback`;
      }

      if (!active) return;

      setStatus({
        serviceWorker,
        displayMode: getDisplayMode(),
        online: navigator.onLine ? 'Online' : 'Offline',
        version
      });
    };

    refresh();

    window.addEventListener('online', refresh);
    window.addEventListener('offline', refresh);
    navigator.serviceWorker?.addEventListener('controllerchange', refresh);

    return () => {
      active = false;
      window.removeEventListener('online', refresh);
      window.removeEventListener('offline', refresh);
      navigator.serviceWorker?.removeEventListener('controllerchange', refresh);
    };
  }, []);

  return (
    <NoorCard variant="soft">
      <span className="noor-badge">PWA</span>
      <h2>Install & offline status</h2>
      <div className="noor-divider" />
      <p className="noor-subtitle"><strong>Version:</strong> {status.version}</p>
      <p className="noor-subtitle"><strong>Service worker:</strong> {status.serviceWorker}</p>
      <p className="noor-subtitle"><strong>Display mode:</strong> {status.displayMode}</p>
      <p className="noor-subtitle"><strong>Network:</strong> {status.online}</p>
      <p className="noor-subtitle">
        For full local PWA testing, run <code>pnpm build</code> followed by <code>pnpm start</code>, then open localhost:3200.
      </p>
    </NoorCard>
  );
}
