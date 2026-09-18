'use client';

import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { tools } from '@/lib/tools/registry';

const fade =
  'animate-in fade-in slide-in-from-bottom-3 duration-500 fill-mode-both motion-reduce:animate-none';

/**
 * Editorial index of the ten tools — hairline-divided rows in the manner
 * of the Services section: mono index, serif name, quiet description,
 * category tag, arrow on hover with a 3% ink tint.
 */
export default function ToolsIndex() {
  return (
    <main className="flex-1">
      <div className="mx-auto max-w-7xl px-6 pt-16 pb-24 md:pt-24 lg:px-8">
        {/* Header */}
        <div className={fade}>
          <p className="font-mono text-[11px] uppercase tracking-[0.25em] text-ink/50">
            Tools
          </p>
          <h1 className="mt-6 text-balance font-serif text-4xl font-light leading-[1.05] tracking-tight text-ink sm:text-5xl lg:text-6xl">
            Ten tools, built with{' '}
            <em className="italic text-viridian">conviction</em>.
          </h1>
          <p className="mt-6 max-w-2xl text-base leading-relaxed text-ink/60">
            Free, fast, and private developer utilities. Everything runs
            entirely in your browser — no uploads, no accounts, no tracking.
          </p>
        </div>

        {/* Index rows */}
        <div className={`mt-16 ${fade}`}>
          {tools.map((tool, i) => (
            <Link
              key={tool.slug}
              href={`/tools/${tool.slug}`}
              aria-label={`${tool.name} — ${tool.short}`}
              className={`group grid grid-cols-1 gap-x-10 gap-y-3 px-4 py-8 transition-colors duration-500 hover:bg-ink/[0.03] sm:px-6 md:grid-cols-[4.5rem_1fr_10rem_2.5rem] md:items-baseline md:py-10 ${
                i > 0 ? 'border-t border-ink/10' : ''
              }`}
            >
              {/* index numeral */}
              <span
                aria-hidden="true"
                className="font-serif text-3xl font-light leading-none text-ink/25 transition-colors duration-500 group-hover:text-gold md:text-4xl"
              >
                {String(i + 1).padStart(2, '0')}
              </span>

              {/* name + description */}
              <div>
                <h2 className="font-serif text-xl font-normal tracking-tight text-ink transition-colors duration-500 group-hover:text-viridian sm:text-2xl">
                  {tool.name}
                </h2>
                <p className="mt-2 max-w-xl text-sm leading-relaxed text-ink/60">
                  {tool.short}
                </p>
              </div>

              {/* category tag */}
              <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-ink/45">
                {tool.category}
              </p>

              {/* arrow */}
              <span
                aria-hidden="true"
                className="hidden items-center justify-end md:flex"
              >
                <ArrowRight className="slide-x h-5 w-5 text-ink/30 transition-[transform,color] duration-500 group-hover:text-viridian" />
              </span>
            </Link>
          ))}

          {/* closing rule */}
          <div aria-hidden="true" className="border-t border-ink/10" />
        </div>
      </div>
    </main>
  );
}
