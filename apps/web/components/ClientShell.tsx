'use client';

import { AppShell } from '@noor/ui';
import { usePathname } from 'next/navigation';

export function ClientShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  return <AppShell currentPath={pathname}>{children}</AppShell>;
}
