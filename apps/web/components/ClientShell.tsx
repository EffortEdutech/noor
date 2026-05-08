'use client';

import { AppShell } from '@noor/ui';
import { usePathname } from 'next/navigation';
import { KnowledgeTopNav } from './KnowledgeTopNav';
import { PwaLifecycleManager } from './PwaLifecycleManager';

export function ClientShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <AppShell currentPath={pathname}>
      {children}
      <KnowledgeTopNav currentPath={pathname} />
      <PwaLifecycleManager />
    </AppShell>
  );
}
