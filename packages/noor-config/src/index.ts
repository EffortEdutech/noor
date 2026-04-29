export const NOOR_APP = {
  name: 'NOOR',
  repo: 'https://github.com/EffortEdutech/noor',
  oldRepo: 'https://github.com/EffortEdutech/muslim-companion-poc',
  localPort: 3200,
  tagline: 'Your daily Islamic companion'
} as const;

export const NOOR_NAV_ITEMS = [
  { label: 'Today', href: '/today', icon: '🌙' },
  { label: 'Learn', href: '/learn', icon: '📖' },
  { label: 'Explore', href: '/explore', icon: '🔎' },
  { label: 'Studio', href: '/studio', icon: '✨' },
  { label: 'Library', href: '/library', icon: '🔖' }
] as const;
