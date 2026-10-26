import type { Status } from '@/lib/types';

const MAP: Record<Status, { label: string; classes: string }> = {
  prototype: { label: 'Prototype', classes: 'bg-brand-100 text-brand-700' },
  'mvp-plan': { label: 'MVP plan', classes: 'bg-saffron-100 text-saffron-600' },
  future: { label: 'Future', classes: 'bg-ink-100 text-ink-400' },
  mocked: { label: 'Mocked', classes: 'bg-terracotta-100 text-terracotta-500' },
};

export default function StatusBadge({ status, className = '' }: { status: Status; className?: string }) {
  const m = MAP[status] ?? MAP.future;
  return (
    <span className={`chip ${m.classes} ${className}`} aria-label={`Status: ${m.label}`}>
      {m.label}
    </span>
  );
}
