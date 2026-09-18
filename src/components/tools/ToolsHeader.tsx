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
 * Shared header for every /tools page — mirrors the studio site's navbar
 * (same links, same CTA) so tools feel part of one application. Lives
 * outside the home page's LocaleProvider; no locale toggle this release.
 */
const siteLinks = [
  { label: 'Services', href: '/#services' },
  { label: 'Products', href: '/#products' },
  { label: 'Studio', href: '/#studio' },
  { label: 'Process', href: '/#process' },
];

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

        <nav aria-label="Site and tools" className="flex items-center gap-6 sm:gap-8">
          {siteLinks.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              className="group relative hidden py-2 font-mono text-[11px] uppercase tracking-[0.18em] text-ink/60 transition-colors duration-300 hover:text-ink md:inline-flex"
            >
              {link.label}
              <span
                aria-hidden="true"
                className="absolute -bottom-0.5 start-0 h-px w-0 bg-gold transition-all duration-500 group-hover:w-full"
              />
            </Link>
          ))}
          <Link
            href="/tools"
            aria-current="true"
            className="group relative py-2 font-mono text-[11px] uppercase tracking-[0.18em] text-ink transition-colors duration-300"
          >
            Tools
            <span
              aria-hidden="true"
              className="absolute -bottom-0.5 start-0 h-px w-full bg-gold"
            />
          </Link>
          <Link
            href="/#contact"
            className="rounded-full bg-ink px-4 py-2 font-mono text-[11px] uppercase tracking-[0.15em] text-paper transition-colors duration-300 hover:bg-viridian sm:px-5"
          >
            Start a project
          </Link>
        </nav>
      </div>
    </header>
  );
}
