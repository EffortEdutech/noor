'use client';

import type { CSSProperties } from 'react';
import { useCallback, useEffect, useRef, useState } from 'react';
import { NOOR_APP_VERSION } from '../lib/app-version';

type BeforeInstallPromptEvent = Event & {
  readonly platforms?: string[];
  readonly userChoice: Promise<{ outcome: 'accepted' | 'dismissed'; platform: string }>;
  prompt: () => Promise<void>;
};

type NavigatorWithStandalone = Navigator & { standalone?: boolean };

declare global {
  interface WindowEventMap {
    beforeinstallprompt: BeforeInstallPromptEvent;
  }
}

type PwaNotice = 'install' | 'update' | 'offline-ready' | 'dev-disabled' | null;

const cardStyle: CSSProperties = {
  position: 'fixed',
  left: '50%',
  bottom: 92,
  zIndex: 60,
  width: 'min(calc(100% - 24px), 720px)',
  transform: 'translateX(-50%)',
  border: '1px solid rgba(216, 183, 90, 0.34)',
  borderRadius: 22,
  background: 'rgba(7, 16, 20, 0.94)',
  boxShadow: '0 24px 70px rgba(0,0,0,0.38)',
  backdropFilter: 'blur(20px)',
  padding: 14,
  display: 'grid',
  gap: 10
};

const rowStyle: CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  gap: 12,
  flexWrap: 'wrap'
};

const titleStyle: CSSProperties = {
  margin: 0,
  fontWeight: 800,
  color: '#f4efe2'
};

const textStyle: CSSProperties = {
  margin: '4px 0 0',
  color: '#a8b0aa',
  lineHeight: 1.5,
  fontSize: 13
};

export function PwaLifecycleManager() {
  const registrationRef = useRef<ServiceWorkerRegistration | null>(null);
  const refreshingRef = useRef(false);
  const [installPrompt, setInstallPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [notice, setNotice] = useState<PwaNotice>(null);
  const [isStandalone, setIsStandalone] = useState(false);
  const [dismissedNotice, setDismissedNotice] = useState<PwaNotice>(null);

  const refreshForUpdate = useCallback(() => {
    const waitingWorker = registrationRef.current?.waiting;

    if (waitingWorker) {
      waitingWorker.postMessage({ type: 'SKIP_WAITING' });
      return;
    }

    window.location.reload();
  }, []);

  const installApp = useCallback(async () => {
    if (!installPrompt) return;

    await installPrompt.prompt();
    await installPrompt.userChoice;
    setInstallPrompt(null);
    setNotice(null);
  }, [installPrompt]);

  useEffect(() => {
    const standalone =
      window.matchMedia('(display-mode: standalone)').matches ||
      (navigator as NavigatorWithStandalone).standalone === true;
    setIsStandalone(standalone);

    const handleInstallPrompt = (event: BeforeInstallPromptEvent) => {
      event.preventDefault();
      setInstallPrompt(event);
      setNotice((current) => (current === 'update' ? current : 'install'));
    };

    const handleInstalled = () => {
      setInstallPrompt(null);
      setNotice(null);
      setIsStandalone(true);
    };

    window.addEventListener('beforeinstallprompt', handleInstallPrompt);
    window.addEventListener('appinstalled', handleInstalled);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleInstallPrompt);
      window.removeEventListener('appinstalled', handleInstalled);
    };
  }, []);

  useEffect(() => {
    if (!('serviceWorker' in navigator)) return;

    const pwaEnabledInDev = process.env.NEXT_PUBLIC_NOOR_PWA_IN_DEV === 'true';
    const shouldRegister = process.env.NODE_ENV === 'production' || pwaEnabledInDev;

    if (!shouldRegister) {
      setNotice((current) => current ?? 'dev-disabled');
      return;
    }

    const onControllerChange = () => {
      if (refreshingRef.current) return;
      refreshingRef.current = true;
      window.location.reload();
    };

    navigator.serviceWorker.addEventListener('controllerchange', onControllerChange);

    navigator.serviceWorker
      .register('/sw.js')
      .then((registration) => {
        registrationRef.current = registration;

        if (registration.waiting && navigator.serviceWorker.controller) {
          setNotice('update');
        }

        registration.addEventListener('updatefound', () => {
          const installingWorker = registration.installing;
          if (!installingWorker) return;

          installingWorker.addEventListener('statechange', () => {
            if (installingWorker.state !== 'installed') return;

            if (navigator.serviceWorker.controller) {
              setNotice('update');
            } else {
              setNotice((current) => (current === 'install' ? current : 'offline-ready'));
            }
          });
        });

        const updateTimer = window.setInterval(() => {
          registration.update().catch(() => undefined);
        }, 60 * 60 * 1000);

        return () => window.clearInterval(updateTimer);
      })
      .catch(() => undefined);

    return () => {
      navigator.serviceWorker.removeEventListener('controllerchange', onControllerChange);
    };
  }, []);

  const visibleNotice = notice === dismissedNotice ? null : notice;

  if (!visibleNotice) return null;

  if (visibleNotice === 'dev-disabled') {
    return (
      <aside style={cardStyle} aria-live="polite">
        <div style={rowStyle}>
          <div>
            <p style={titleStyle}>PWA test mode is disabled in dev</p>
            <p style={textStyle}>
              Run <code>pnpm build</code> then <code>pnpm start</code> to test install, offline cache and update prompts.
            </p>
          </div>
          <button className="noor-button secondary" type="button" onClick={() => setDismissedNotice('dev-disabled')}>
            Hide
          </button>
        </div>
      </aside>
    );
  }

  if (visibleNotice === 'update') {
    return (
      <aside style={cardStyle} aria-live="polite">
        <div style={rowStyle}>
          <div>
            <p style={titleStyle}>A new NOOR update is ready</p>
            <p style={textStyle}>Refresh to load the latest local-first version. Current app version: v{NOOR_APP_VERSION}.</p>
          </div>
          <div className="noor-card-actions">
            <button className="noor-button" type="button" onClick={refreshForUpdate}>
              Refresh now
            </button>
            <button className="noor-button secondary" type="button" onClick={() => setDismissedNotice('update')}>
              Later
            </button>
          </div>
        </div>
      </aside>
    );
  }

  if (visibleNotice === 'install' && installPrompt && !isStandalone) {
    return (
      <aside style={cardStyle} aria-live="polite">
        <div style={rowStyle}>
          <div>
            <p style={titleStyle}>Install NOOR on this device</p>
            <p style={textStyle}>Open NOOR like an app, keep your local bookmarks, and prepare for offline reading.</p>
          </div>
          <div className="noor-card-actions">
            <button className="noor-button" type="button" onClick={installApp}>
              Install
            </button>
            <button className="noor-button secondary" type="button" onClick={() => setDismissedNotice('install')}>
              Not now
            </button>
          </div>
        </div>
      </aside>
    );
  }

  if (visibleNotice === 'offline-ready') {
    return (
      <aside style={cardStyle} aria-live="polite">
        <div style={rowStyle}>
          <div>
            <p style={titleStyle}>NOOR is ready for offline use</p>
            <p style={textStyle}>The core app shell has been cached locally on this device.</p>
          </div>
          <button className="noor-button secondary" type="button" onClick={() => setDismissedNotice('offline-ready')}>
            Alhamdulillah
          </button>
        </div>
      </aside>
    );
  }

  return null;
}
