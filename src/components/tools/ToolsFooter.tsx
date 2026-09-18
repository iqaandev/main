import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

function GoldDiamond({ className = '' }: { className?: string }) {
  return (
    <span
      aria-hidden="true"
      className={`inline-block h-[8px] w-[8px] rotate-45 bg-gold ${className}`}
    />
  );
}

/**
 * Dark-ink bookend for the tools section — a quiet sibling of the main
 * footer, with the privacy line and a lead-gen CTA back to the studio.
 */
export default function ToolsFooter() {
  return (
    <footer className="mt-auto bg-ink text-paper">
      <div className="mx-auto max-w-7xl px-6 py-14 md:py-16 lg:px-8">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-2 md:items-start">
          {/* Brand + privacy line */}
          <div>
            <div className="space-y-3">
              <p className="font-serif text-3xl font-light tracking-tight text-paper">
                IQAAN
                <GoldDiamond className="ms-1.5 align-[0.14em]" />
              </p>
              <p lang="ar" dir="rtl" className="font-serif text-lg leading-none text-gold-bright">
                إيقان
              </p>
            </div>
            <p className="mt-6 max-w-sm text-sm leading-relaxed text-paper/60">
              Every tool on this page runs entirely in your browser — nothing
              is uploaded.
            </p>
          </div>

          {/* CTA */}
          <div className="md:justify-self-end md:text-end">
            <Link
              href="/#contact"
              className="group inline-flex items-center gap-3 rounded-full border border-paper/25 px-6 py-3 text-sm text-paper/85 transition-colors duration-300 hover:border-gold hover:text-gold"
            >
              Need a custom tool built for your business? Let&rsquo;s talk
              <ArrowRight className="slide-x h-4 w-4 transition-[transform,color] duration-500" />
            </Link>
          </div>
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-3 border-t border-paper/15 pt-7 font-mono text-[10px] uppercase tracking-[0.18em] text-paper/45 sm:flex-row sm:text-[11px]">
          <p>&copy; 2026 IQAAN — All rights reserved</p>
          <p aria-hidden="true" className="flex items-center gap-3">
            <span className="inline-block h-[5px] w-[5px] rotate-45 bg-gold/70" />
            Software, built with conviction
          </p>
        </div>
      </div>
    </footer>
  );
}
