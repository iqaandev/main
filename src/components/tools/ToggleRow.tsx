'use client';

import { Check } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { ReactNode } from 'react';

/**
 * Hairline toggle row — square ink marker that fills when active.
 * Used for feature checklists and option toggles across the business tools.
 */
export default function ToggleRow({
  active,
  onToggle,
  label,
  trailing,
  className,
}: {
  active: boolean;
  onToggle: () => void;
  label: string;
  /** Right-aligned mono detail, e.g. "+$3.5k". */
  trailing?: ReactNode;
  className?: string;
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={active}
      onClick={onToggle}
      className={cn(
        'group flex w-full cursor-pointer items-center justify-between gap-4 border-t border-ink/10 px-1 py-3 text-left transition-colors duration-300 hover:bg-ink/[0.03]',
        className
      )}
    >
      <span className="flex min-w-0 items-center gap-3">
        <span
          aria-hidden="true"
          className={cn(
            'flex size-[18px] shrink-0 items-center justify-center border transition-colors duration-200',
            active ? 'border-ink bg-ink text-paper' : 'border-ink/25 bg-transparent text-transparent'
          )}
        >
          <Check className="h-3 w-3" strokeWidth={2.5} />
        </span>
        <span
          className={cn(
            'truncate text-[14px] transition-colors duration-200',
            active ? 'text-ink' : 'text-ink/55'
          )}
        >
          {label}
        </span>
      </span>
      {trailing !== undefined && (
        <span
          className={cn(
            'shrink-0 font-mono text-[11px] tabular-nums transition-colors duration-200',
            active ? 'text-viridian' : 'text-ink/35'
          )}
        >
          {trailing}
        </span>
      )}
    </button>
  );
}
