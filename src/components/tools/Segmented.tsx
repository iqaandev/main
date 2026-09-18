'use client';

/**
 * Small segmented control for mode toggles (Format/Minify, s/ms, v4/v7).
 * Mono labels, hairline border, ink pill for the active segment.
 */
export default function Segmented<T extends string>({
  value,
  onChange,
  options,
  ariaLabel,
  className = '',
}: {
  value: T;
  onChange: (value: T) => void;
  options: { value: T; label: string }[];
  ariaLabel: string;
  className?: string;
}) {
  return (
    <div
      role="group"
      aria-label={ariaLabel}
      className={`inline-flex overflow-hidden rounded-md border border-ink/15 ${className}`}
    >
      {options.map((option) => {
        const active = option.value === value;
        return (
          <button
            key={option.value}
            type="button"
            aria-pressed={active}
            onClick={() => onChange(option.value)}
            className={`cursor-pointer px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.15em] transition-colors duration-300 ${
              active
                ? 'bg-ink text-paper'
                : 'bg-transparent text-ink/55 hover:bg-ink/5 hover:text-ink'
            } ${options.indexOf(option) > 0 ? 'border-s border-ink/15' : ''}`}
          >
            {option.label}
          </button>
        );
      })}
    </div>
  );
}
