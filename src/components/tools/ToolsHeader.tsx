import Link from 'next/link';

function GoldDiamond({ className = '' }: { className?: string }) {
  return (
    <span
      aria-hidden="true"
      className={`inline-block h-[7px] w-[7px] rotate-45 bg-gold ${className}`}
    />
  );
}

/**
 * Shared header for every /tools page — lives outside the home page's
 * LocaleProvider. Wordmark returns to the studio site; no locale toggle
 * in this release.
 */
export default function ToolsHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-ink/10 bg-paper/90 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6 lg:px-8">
        <Link
          href="/"
          className="group flex items-center gap-3 transition-opacity hover:opacity-70"
          aria-label="IQAAN — back to the studio site"
        >
          <span className="font-serif text-2xl font-light tracking-tight text-ink">
            IQAAN
            <GoldDiamond className="ms-1.5 align-[0.14em]" />
          </span>
        </Link>

        <nav aria-label="Tools" className="flex items-center gap-6 sm:gap-8">
          <Link
            href="/tools"
            className="group relative py-2 font-mono text-[11px] uppercase tracking-[0.18em] text-ink/60 transition-colors duration-300 hover:text-ink"
          >
            Tools
            <span
              aria-hidden="true"
              className="absolute -bottom-0.5 start-0 h-px w-0 bg-gold transition-all duration-500 group-hover:w-full"
            />
          </Link>
          <Link
            href="/"
            className="group flex items-center gap-2 py-2 font-mono text-[11px] uppercase tracking-[0.18em] text-ink/50 transition-colors duration-300 hover:text-ink"
          >
            <span
              aria-hidden="true"
              className="hidden h-px w-4 bg-ink/25 transition-all duration-500 sm:block group-hover:w-6"
            />
            Back to site
          </Link>
        </nav>
      </div>
    </header>
  );
}
