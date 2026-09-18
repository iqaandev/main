import type { ReactNode } from 'react';
import type { Tool } from '@/lib/tools/registry';
import ToolsHeader from './ToolsHeader';
import ToolsFooter from './ToolsFooter';

const fade =
  'animate-in fade-in slide-in-from-bottom-3 duration-500 fill-mode-both motion-reduce:animate-none';

/**
 * Shared page structure for every tool: header, editorial title block,
 * the tool itself, then the "About this tool" prose and FAQ (all static
 * markup, so the SEO content is present in the prerendered HTML), then
 * the dark-ink footer bookend.
 */
export default function ToolLayout({
  tool,
  children,
}: {
  tool: Tool;
  children: ReactNode;
}) {
  return (
    <div className="paper-grain flex min-h-screen flex-col">
      <ToolsHeader />

      <main className="flex-1">
        <div className="mx-auto max-w-5xl px-6 pt-16 pb-24 md:pt-20 lg:px-8">
          {/* Title block */}
          <div className={fade}>
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
        </div>
      </main>

      <ToolsFooter />
    </div>
  );
}
