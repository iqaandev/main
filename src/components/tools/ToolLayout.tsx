import type { ReactNode } from 'react';
import Link from 'next/link';
import { SITE_URL, type Tool, tools } from '@/lib/tools/registry';
import ToolsHeader from './ToolsHeader';
import ToolsFooter from './ToolsFooter';

const fade =
  'animate-in fade-in slide-in-from-bottom-3 duration-500 fill-mode-both motion-reduce:animate-none';

/**
 * Shared page structure for every tool: header, breadcrumb path, editorial
 * title block, the tool itself, the "About this tool" prose and FAQ (all
 * static markup, so the SEO content is present in the prerendered HTML),
 * related-tool cross-links, then the dark-ink footer bookend.
 */
export default function ToolLayout({
  tool,
  children,
}: {
  tool: Tool;
  children: ReactNode;
}) {
  const related = tool.related
    .map((slug) => tools.find((entry) => entry.slug === slug))
    .filter((entry): entry is Tool => Boolean(entry));

  const breadcrumbJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'IQAAN', item: SITE_URL },
      { '@type': 'ListItem', position: 2, name: 'Tools', item: `${SITE_URL}/tools` },
      {
        '@type': 'ListItem',
        position: 3,
        name: tool.name,
        item: `${SITE_URL}/tools/${tool.slug}`,
      },
    ],
  };

  return (
    <div className="paper-grain flex min-h-screen flex-col">
      <script
        type="application/ld+json"
        // Static content from the registry, prerendered for crawlers.
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <ToolsHeader />

      <main className="flex-1">
        <div className="mx-auto max-w-5xl px-6 pt-16 pb-24 md:pt-20 lg:px-8">
          {/* Breadcrumb path — IQAAN / Tools / <tool> */}
          <nav aria-label="Breadcrumb" className={fade}>
            <ol className="flex flex-wrap items-center gap-x-2 gap-y-1 font-mono text-[11px] uppercase tracking-[0.18em] text-ink/45">
              <li>
                <Link href="/" className="transition-colors hover:text-ink">
                  IQAAN
                </Link>
              </li>
              <li aria-hidden="true" className="text-gold/70">
                /
              </li>
              <li>
                <Link href="/tools" className="transition-colors hover:text-ink">
                  Tools
                </Link>
              </li>
              <li aria-hidden="true" className="text-gold/70">
                /
              </li>
              <li aria-current="page" className="text-ink/70">
                {tool.name}
              </li>
            </ol>
          </nav>

          {/* Title block */}
          <div className={`mt-8 ${fade}`}>
            <p className="font-mono text-[11px] uppercase tracking-[0.25em] text-ink/50">
              IQAAN Tools — {tool.category}
            </p>
            <h1 className="mt-6 text-balance font-serif text-4xl font-light leading-[1.05] tracking-tight text-ink sm:text-5xl">
              {tool.name}
            </h1>
            <p className="mt-5 max-w-2xl text-base leading-relaxed text-ink/60">
              {tool.short}
            </p>
          </div>

          {/* The tool itself */}
          <div className={`mt-12 ${fade}`}>{children}</div>

          {/* About this tool — static, indexable prose */}
          <section aria-label={`About ${tool.name}`} className={`mt-20 ${fade}`}>
            <p className="font-mono text-[11px] uppercase tracking-[0.25em] text-ink/50">
              About this tool
            </p>
            <p className="mt-6 max-w-3xl font-serif text-xl font-light italic leading-relaxed tracking-tight text-ink/80 sm:text-2xl">
              {tool.short}
            </p>
            <div className="mt-6 max-w-3xl space-y-5">
              {tool.longDescription.map((paragraph) => (
                <p key={paragraph.slice(0, 40)} className="text-[15px] leading-[1.8] text-ink/70">
                  {paragraph}
                </p>
              ))}
            </div>
          </section>

          {/* FAQ — hairline-divided, static for crawlers */}
          <section aria-label="Frequently asked questions" className={`mt-16 ${fade}`}>
            <p className="font-mono text-[11px] uppercase tracking-[0.25em] text-ink/50">
              Frequently asked questions
            </p>
            <div className="mt-8">
              {tool.faq.map((item) => (
                <div key={item.q} className="border-t border-ink/10 py-7">
                  <h2 className="font-serif text-lg font-normal leading-snug tracking-tight text-ink sm:text-xl">
                    {item.q}
                  </h2>
                  <p className="mt-3 max-w-3xl text-[15px] leading-[1.8] text-ink/65">
                    {item.a}
                  </p>
                </div>
              ))}
              <div aria-hidden="true" className="border-t border-ink/10" />
            </div>
          </section>

          {/* Related tools — cross-links within the toolset */}
          {related.length > 0 && (
            <section aria-label="Related tools" className={`mt-16 ${fade}`}>
              <p className="font-mono text-[11px] uppercase tracking-[0.25em] text-ink/50">
                Related tools
              </p>
              <div className="mt-8">
                {related.map((entry) => (
                  <Link
                    key={entry.slug}
                    href={`/tools/${entry.slug}`}
                    className="group flex items-baseline justify-between gap-6 border-t border-ink/10 py-6 transition-colors duration-300 hover:bg-ink/[0.03]"
                  >
                    <span className="font-serif text-lg font-normal tracking-tight text-ink transition-colors group-hover:text-viridian sm:text-xl">
                      {entry.name}
                    </span>
                    <span className="hidden max-w-sm text-right text-sm leading-relaxed text-ink/55 sm:block">
                      {entry.short}
                    </span>
                  </Link>
                ))}
                <div aria-hidden="true" className="border-t border-ink/10" />
              </div>
            </section>
          )}
        </div>
      </main>

      <ToolsFooter />
    </div>
  );
}
