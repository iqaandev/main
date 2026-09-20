'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { articles, formatDateShort } from '@/lib/insights/registry';
import ToolsHeader from '@/components/tools/ToolsHeader';
import ToolsFooter from '@/components/tools/ToolsFooter';

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

export default function InsightsIndex() {
  return (
    <div className="paper-grain flex min-h-screen flex-col">
      <ToolsHeader />
      <main className="flex-1">
        <div className="mx-auto max-w-5xl px-6 pt-16 pb-24 md:pt-20 lg:px-8">
          <nav aria-label="Breadcrumb">
            <ol className="flex items-center gap-x-2 font-mono text-[11px] uppercase tracking-[0.18em] text-ink/45">
              <li>
                <Link href="/" className="transition-colors hover:text-ink">
                  IQAAN
                </Link>
              </li>
              <li aria-hidden="true" className="text-gold/70">/</li>
              <li aria-current="page" className="text-ink/70">
                Insights
              </li>
            </ol>
          </nav>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: EASE }}
            className="mt-8"
          >
            <p className="font-mono text-[11px] uppercase tracking-[0.25em] text-ink/50">
              Insights
            </p>
            <h1 className="mt-6 text-balance font-serif text-4xl font-light leading-[1.05] tracking-tight text-ink sm:text-5xl lg:text-6xl">
              Notes on building software,
              <br />
              priced <em className="italic text-viridian">honestly</em>.
            </h1>
            <p className="mt-6 max-w-xl text-base leading-relaxed text-ink/60 sm:text-lg">
              Essays on cost, scope, and the metrics that decide whether
              software becomes a business. No fluff — each one pairs with a
              calculator you can run yourself.
            </p>
          </motion.div>

          <div className="mt-16">
            {articles.map((article, index) => (
              <motion.div
                key={article.slug}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-60px' }}
                transition={{ duration: 0.6, delay: index * 0.08, ease: EASE }}
              >
                <Link
                  href={`/insights/${article.slug}`}
                  className="group grid grid-cols-1 gap-x-8 gap-y-3 border-t border-ink/10 py-8 transition-colors duration-300 hover:bg-ink/[0.03] sm:grid-cols-[130px_1fr_auto]"
                >
                  <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-ink/45">
                    {formatDateShort(article.publishedISO)}
                  </p>
                  <div>
                    <h2 className="text-balance font-serif text-xl font-normal leading-snug tracking-tight text-ink transition-colors group-hover:text-viridian sm:text-2xl">
                      {article.title}
                    </h2>
                    <p className="mt-2 max-w-xl text-sm leading-relaxed text-ink/55">
                      {article.dek}
                    </p>
                    <p className="mt-3 font-mono text-[10px] uppercase tracking-[0.2em] text-ink/40">
                      {article.category} · {article.readingMinutes} min read
                    </p>
                  </div>
                  <ArrowRight className="slide-x hidden h-4 w-4 self-center text-ink/40 transition-all duration-500 group-hover:text-viridian sm:block" />
                </Link>
              </motion.div>
            ))}
            <div aria-hidden="true" className="border-t border-ink/10" />
          </div>
        </div>
      </main>
      <ToolsFooter />
    </div>
  );
}
