'use client';

import { AppShell } from '@noor/ui';
import { usePathname } from 'next/navigation';
import { PwaLifecycleManager } from './PwaLifecycleManager';

export function ClientShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <AppShell currentPath={pathname}>
      {children}
      <PwaLifecycleManager />
    </AppShell>
  );
}
