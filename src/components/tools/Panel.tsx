import type { ReactNode } from 'react';
import { cn } from '@/lib/utils';

/**
 * Paper card with hairline border and a mono panel header.
 * No drop shadows — the design language is ink on paper.
 */
export default function Panel({
  label,
  accent,
  actions,
  children,
  className,
  bodyClassName,
}: {
  label?: string;
  /** Optional class for a small diamond accent before the label (e.g. 'bg-viridian'). */
  accent?: string;
  actions?: ReactNode;
  children: ReactNode;
  className?: string;
  bodyClassName?: string;
}) {
  return (
    <section className={cn('overflow-hidden rounded-md border border-ink/10 bg-card', className)}>
      {label !== undefined && (
        <header className="flex min-h-11 flex-wrap items-center justify-between gap-3 border-b border-ink/10 bg-ink/[0.02] px-5 py-2.5">
          <h2 className="flex items-center gap-2.5 font-mono text-[11px] uppercase tracking-[0.2em] text-ink/55">
            {accent && (
              <span aria-hidden="true" className={cn('inline-block h-[5px] w-[5px] rotate-45', accent)} />
            )}
            {label}
          </h2>
          {actions ? <div className="flex flex-wrap items-center gap-4">{actions}</div> : null}
        </header>
      )}
      <div className={cn('p-5 md:p-6', bodyClassName)}>{children}</div>
    </section>
  );
}
