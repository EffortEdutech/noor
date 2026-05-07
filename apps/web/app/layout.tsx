import type { Metadata, Viewport } from 'next';
import './globals.css';
import { ClientShell } from '@/components/ClientShell';

const noorAppIcon = '/icons/noor-mark.svg';

export const metadata: Metadata = {
  title: 'NOOR — Daily Islamic Companion',
  description: 'Read Quran, understand Tafseer, discover Hadith, and continue your daily journey.',
  manifest: '/manifest.json',
  icons: {
    icon: [{ url: noorAppIcon, type: 'image/svg+xml' }],
    shortcut: [noorAppIcon],
    apple: [{ url: noorAppIcon, type: 'image/svg+xml' }]
  }
};

export const viewport: Viewport = {
  themeColor: '#071014',
  width: 'device-width',
  initialScale: 1
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <ClientShell>{children}</ClientShell>
      </body>
    </html>
  );
}
