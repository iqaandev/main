import Link from 'next/link';
import type { Article, ArticleBlock } from '@/lib/insights/registry';
import { formatDateLong, getArticle } from '@/lib/insights/registry';
import { getTool, SITE_URL } from '@/lib/tools/registry';
import ToolsHeader from '@/components/tools/ToolsHeader';
import ToolsFooter from '@/components/tools/ToolsFooter';

const fade =
  'animate-in fade-in slide-in-from-bottom-3 duration-500 fill-mode-both motion-reduce:animate-none';

function ToolCta({ toolSlug, line }: { toolSlug: string; line?: string }) {
  const tool = getTool(toolSlug);
  if (!tool) return null;
  return (
    <div className="not-prose my-10 border border-ink/15 bg-ink/[0.02] p-6 sm:p-8">
      <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-ink/45 sm:text-[11px]">
        Try it
      </p>
      <Link
        href={`/tools/${tool.slug}`}
        className="group mt-4 flex items-baseline justify-between gap-6"
      >
        <span className="font-serif text-xl font-normal tracking-tight text-ink transition-colors group-hover:text-viridian sm:text-2xl">
          {line ?? `Run your own numbers — ${tool.name}`}
        </span>
        <span
          aria-hidden="true"
          className="mt-1 h-px w-8 shrink-0 self-center bg-gold transition-all duration-500 group-hover:w-12"
        />
      </Link>
    </div>
  );
}

function Block({ block }: { block: ArticleBlock }) {
  switch (block.type) {
    case 'p':
      return (
        <p className="mt-6 text-[16px] leading-[1.85] text-ink/75 sm:text-[17px]">
          {block.text}
        </p>
      );
    case 'h2':
      return (
        <h2 className="mt-14 border-t border-ink/10 pt-8 font-serif text-2xl font-normal tracking-tight text-ink sm:text-3xl">
          {block.text}
        </h2>
      );
    case 'h3':
      return (
        <h3 className="mt-10 font-serif text-xl font-normal tracking-tight text-ink">
          {block.text}
        </h3>
      );
    case 'ul':
      return (
        <ul className="mt-6 space-y-3.5">
          {block.items.map((item) => (
            <li
              key={item.slice(0, 48)}
              className="flex gap-3.5 text-[16px] leading-[1.75] text-ink/75"
            >
              <span
                aria-hidden="true"
                className="mt-[11px] h-[5px] w-[5px] shrink-0 rotate-45 bg-gold"
              />
              {item}
            </li>
          ))}
        </ul>
      );
    case 'quote':
      return (
        <blockquote className="my-12 border-s-2 border-gold ps-6 sm:ps-8">
          <p className="font-serif text-xl font-light italic leading-relaxed tracking-tight text-ink/85 sm:text-2xl">
            {block.text}
          </p>
        </blockquote>
      );
    case 'stat':
      return (
        <figure className="my-12 border-y border-ink/10 py-10 text-center">
          <span className="block font-serif text-5xl font-light tracking-tight text-ink sm:text-6xl">
            {block.value}
          </span>
          <figcaption className="mx-auto mt-4 max-w-md font-mono text-[10px] uppercase leading-relaxed tracking-[0.18em] text-ink/50 sm:text-[11px]">
            {block.caption}
          </figcaption>
        </figure>
      );
    case 'cta':
      return <ToolCta toolSlug={block.tool} />;
    default:
      return null;
  }
}

/**
 * Editorial shell for an Insight article: header, breadcrumb, title
 * block with standfirst and meta, the body blocks, related tools and
 * articles, then the dark-ink footer bookend with its studio CTA.
 */
export default function ArticleLayout({ article }: { article: Article }) {
  const relatedTools = article.relatedTools
    .map((slug) => getTool(slug))
    .filter((tool) => tool !== undefined);
  const relatedArticles = article.relatedArticles.filter((slug) =>
    Boolean(getArticle(slug))
  );

  const articleJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: article.title,
    description: article.description,
    datePublished: article.publishedISO,
    dateModified: article.publishedISO,
    author: { '@type': 'Organization', name: 'IQAAN', url: SITE_URL },
    publisher: { '@type': 'Organization', name: 'IQAAN', url: SITE_URL },
    mainEntityOfPage: `${SITE_URL}/insights/${article.slug}`,
  };

  return (
    <div className="paper-grain flex min-h-screen flex-col">
      <script
        type="application/ld+json"
        // Static content from the registry, prerendered for crawlers.
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }}
      />
      <ToolsHeader />

      <main className="flex-1">
        <article className="mx-auto max-w-3xl px-6 pt-16 pb-24 md:pt-20 lg:px-8">
          <nav aria-label="Breadcrumb" className={fade}>
            <ol className="flex flex-wrap items-center gap-x-2 font-mono text-[11px] uppercase tracking-[0.18em] text-ink/45">
              <li>
                <Link href="/" className="transition-colors hover:text-ink">
                  IQAAN
                </Link>
              </li>
              <li aria-hidden="true" className="text-gold/70">/</li>
              <li>
                <Link href="/insights" className="transition-colors hover:text-ink">
                  Insights
                </Link>
              </li>
              <li aria-hidden="true" className="text-gold/70">/</li>
              <li aria-current="page" className="max-w-[240px] truncate text-ink/70">
                {article.titleTag}
              </li>
            </ol>
          </nav>

          <header className={`mt-8 ${fade}`}>
            <p className="font-mono text-[11px] uppercase tracking-[0.25em] text-ink/50">
              Insights — {article.category}
            </p>
            <h1 className="mt-6 text-balance font-serif text-4xl font-light leading-[1.08] tracking-tight text-ink sm:text-5xl">
              {article.title}
            </h1>
            <p className="mt-6 max-w-2xl font-serif text-lg font-light italic leading-relaxed text-ink/70 sm:text-xl">
              {article.dek}
            </p>
            <p className="mt-8 flex flex-wrap items-center gap-x-4 gap-y-1 font-mono text-[10px] uppercase tracking-[0.2em] text-ink/45 sm:text-[11px]">
              <span>{formatDateLong(article.publishedISO)}</span>
              <span aria-hidden="true" className="h-px w-6 bg-ink/25" />
              <span>{article.readingMinutes} min read</span>
              <span aria-hidden="true" className="h-px w-6 bg-ink/25" />
              <span>IQAAN Studio</span>
            </p>
          </header>

          <div className={`mt-12 ${fade}`}>
            {article.body.map((block, index) => (
              <Block key={`${block.type}-${index}`} block={block} />
            ))}
          </div>

          {relatedTools.length > 0 && (
            <section aria-label="Related tools" className="mt-20">
              <p className="font-mono text-[11px] uppercase tracking-[0.25em] text-ink/50">
                Run the numbers
              </p>
              <div className="mt-6">
                {relatedTools.map((tool) => (
                  <Link
                    key={tool!.slug}
                    href={`/tools/${tool!.slug}`}
                    className="group flex items-baseline justify-between gap-6 border-t border-ink/10 py-6 transition-colors duration-300 hover:bg-ink/[0.03]"
                  >
                    <span className="font-serif text-lg font-normal tracking-tight text-ink transition-colors group-hover:text-viridian sm:text-xl">
                      {tool!.name}
                    </span>
                    <span className="hidden max-w-sm text-right text-sm leading-relaxed text-ink/55 sm:block">
                      {tool!.short}
                    </span>
                  </Link>
                ))}
                <div aria-hidden="true" className="border-t border-ink/10" />
              </div>
            </section>
          )}

          {relatedArticles.length > 0 && (
            <section aria-label="Keep reading" className="mt-14">
              <p className="font-mono text-[11px] uppercase tracking-[0.25em] text-ink/50">
                Keep reading
              </p>
              <div className="mt-6">
                {relatedArticles.map((entry) => (
                  <KeepReadingRow key={entry.slug} slug={entry.slug} />
                ))}
                <div aria-hidden="true" className="border-t border-ink/10" />
              </div>
            </section>
          )}
        </article>
      </main>

      <ToolsFooter />
    </div>
  );
}

/* Resolved inside the row to keep this file self-contained. */
function KeepReadingRow({ slug }: { slug: string }) {
  const article = getArticle(slug);
  if (!article) return null;
  return (
    <Link
      href={`/insights/${article.slug}`}
      className="group flex items-baseline justify-between gap-6 border-t border-ink/10 py-6 transition-colors duration-300 hover:bg-ink/[0.03]"
    >
      <span className="font-serif text-lg font-normal tracking-tight text-ink transition-colors group-hover:text-viridian sm:text-xl">
        {article.title}
      </span>
      <span className="hidden shrink-0 font-mono text-[10px] uppercase tracking-[0.15em] text-ink/45 sm:block">
        {article.readingMinutes} min
      </span>
    </Link>
  );
}

