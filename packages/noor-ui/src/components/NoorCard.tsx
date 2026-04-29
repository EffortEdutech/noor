import type { ReactNode } from 'react';

export function NoorCard({
  children,
  className = '',
  variant = 'default'
}: {
  children: ReactNode;
  className?: string;
  variant?: 'default' | 'soft' | 'gold';
}) {
  const variantClass = variant === 'soft' ? 'is-soft' : variant === 'gold' ? 'is-gold' : '';
  return <article className={`noor-card ${variantClass} ${className}`.trim()}>{children}</article>;
}
