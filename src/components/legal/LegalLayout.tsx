import type { ReactNode } from 'react';
import Link from 'next/link';
import type { LegalDocument } from '@/lib/legal';
import ToolsHeader from '@/components/tools/ToolsHeader';

function GoldDiamond({ className = '' }: { className?: string }) {
  return (
    <span
      aria-hidden="true"
      className={`inline-block h-[7px] w-[7px] rotate-45 bg-gold ${className}`}
    />
  );
}

/**
 * Editorial shell for the legal pages: site nav header, prose in the
 * paper/ink system, and a quiet hairline footer. Static by design —
 * the entire document is prerendered for crawlers.
 */
export default function LegalLayout({ doc }: { doc: LegalDocument }) {
  return (
    <div className="paper-grain flex min-h-screen flex-col">
      <ToolsHeader />

      <main className="flex-1">
        <div className="mx-auto max-w-3xl px-6 pt-16 pb-24 md:pt-20 lg:px-8">
          <nav aria-label="Breadcrumb">
            <ol className="flex flex-wrap items-center gap-x-2 font-mono text-[11px] uppercase tracking-[0.18em] text-ink/45">
              <li>
                <Link href="/" className="transition-colors hover:text-ink">
                  IQAAN
                </Link>
              </li>
              <li aria-hidden="true" className="text-gold/70">/</li>
              <li aria-current="page" className="text-ink/70">
                {doc.title}
              </li>
            </ol>
          </nav>

          <h1 className="mt-8 text-balance font-serif text-4xl font-light leading-[1.05] tracking-tight text-ink sm:text-5xl">
            {doc.title}
          </h1>
          <p className="mt-4 font-mono text-[11px] uppercase tracking-[0.2em] text-ink/45">
            Last updated — {doc.updated}
          </p>
          <p className="mt-8 text-base leading-[1.8] text-ink/70">{doc.intro}</p>

          <div className="mt-12 space-y-10">
            {doc.sections.map((section) => (
              <section key={section.heading}>
                <h2 className="font-serif text-xl font-normal tracking-tight text-ink sm:text-2xl">
                  {section.heading}
                </h2>
                {section.paragraphs.map((paragraph) => (
                  <p
                    key={paragraph.slice(0, 40)}
                    className="mt-4 text-[15px] leading-[1.8] text-ink/70"
                  >
                    {paragraph}
                  </p>
                ))}
                {section.list && (
                  <ul className="mt-4 space-y-3">
                    {section.list.map((item) => (
                      <li
                        key={item.slice(0, 40)}
                        className="flex gap-3 text-[15px] leading-[1.7] text-ink/70"
                      >
                        <span
                          aria-hidden="true"
                          className="mt-[9px] h-[5px] w-[5px] shrink-0 rotate-45 bg-gold"
                        />
                        {item}
                      </li>
                    ))}
                  </ul>
                )}
              </section>
            ))}
          </div>

          <p className="mt-14 border-t border-ink/10 pt-6 text-[15px] leading-[1.8] text-ink/60">
            Questions about this document?{' '}
            <a
              href={`mailto:${doc.contactEmail}`}
              className="text-ink underline underline-offset-4 transition-colors hover:text-viridian"
            >
              {doc.contactEmail}
            </a>
          </p>
        </div>
      </main>

      <footer className="border-t border-ink/10">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-8 lg:px-8">
          <span className="font-serif text-lg font-light tracking-tight text-ink">
            IQAAN
            <GoldDiamond className="ms-1.5 align-[0.14em]" />
          </span>
          <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-ink/45">
            © 2026 IQAAN — All rights reserved
          </p>
        </div>
      </footer>
    </div>
  );
}
