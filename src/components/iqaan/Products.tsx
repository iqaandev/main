'use client';

import { useRef } from 'react';
import { motion, useInView, Variants } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { useLocale } from '@/i18n/LocaleProvider';

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

const reveal: Variants = {
  hidden: { opacity: 0, y: 28 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.12, duration: 0.85, ease: EASE },
  }),
};

/* Analytics Pro — abstract bar + line chart, paper frame on an ink body */
const chartBars = [34, 52, 41, 66, 48, 78, 58, 88];
const linePoints = chartBars
  .map((h, i) => `${(i + 0.5) * 12.5},${100 - h}`)
  .join(' ');

function AnalyticsMockup() {
  return (
    <div className="animate-float motion-reduce:animate-none" aria-hidden="true">
      <div className="overflow-hidden rounded-lg border border-ink/15 bg-paper">
        {/* browser chrome */}
        <div className="flex items-center gap-1.5 border-b border-ink/10 px-4 py-3">
          <span className="h-2 w-2 rounded-full bg-ink/15" />
          <span className="h-2 w-2 rounded-full bg-ink/15" />
          <span className="h-2 w-2 rounded-full bg-ink/15" />
          <span className="ms-3 h-3.5 flex-1 rounded-full bg-ink/[0.05]" />
        </div>

        {/* chart body */}
        <div className="bg-ink p-6 sm:p-8">
          <div className="mb-6 flex items-center justify-between">
            <div className="h-2.5 w-24 rounded-sm bg-paper/20" />
            <div className="h-2.5 w-10 rounded-sm bg-gold/80" />
          </div>

          <div className="relative flex h-40 items-end gap-2 sm:h-52 sm:gap-3">
            {chartBars.map((height, i) => (
              <div
                key={i}
                style={{ height: `${height}%` }}
                className={`flex-1 rounded-t-[2px] transition-colors ${
                  i === 5
                    ? 'bg-viridian'
                    : i === 7
                      ? 'bg-gold/90'
                      : 'bg-paper/25'
                }`}
              />
            ))}
            <svg
              className="pointer-events-none absolute inset-0 h-full w-full"
              viewBox="0 0 100 100"
              preserveAspectRatio="none"
            >
              <polyline
                points={linePoints}
                fill="none"
                stroke="var(--gold-bright)"
                strokeWidth="1.5"
                vectorEffect="non-scaling-stroke"
                strokeLinecap="round"
                strokeLinejoin="round"
                opacity="0.9"
              />
            </svg>
          </div>

          <div className="mt-5 flex gap-2 border-t border-paper/10 pt-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <div
                key={i}
                className={`h-1.5 flex-1 rounded-full ${
                  i === 7 ? 'bg-gold/60' : 'bg-paper/15'
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

/* CloudOps — abstract node topology, ink lines and dots on paper */
const nodes = [
  { x: 200, y: 140, r: 14, kind: 'center' },
  { x: 78, y: 66, r: 7, kind: 'ink' },
  { x: 318, y: 58, r: 7, kind: 'gold' },
  { x: 342, y: 200, r: 9, kind: 'ink' },
  { x: 92, y: 216, r: 9, kind: 'ink' },
  { x: 232, y: 32, r: 5, kind: 'viridian' },
  { x: 36, y: 140, r: 5, kind: 'viridian' },
  { x: 280, y: 252, r: 7, kind: 'gold' },
] as const;

const links: [number, number][] = [
  [0, 1],
  [0, 2],
  [0, 3],
  [0, 4],
  [0, 5],
  [0, 6],
  [0, 7],
  [1, 6],
  [2, 3],
  [4, 7],
];

function CloudOpsMockup() {
  return (
    <div className="animate-float motion-reduce:animate-none" aria-hidden="true">
      <div className="overflow-hidden rounded-lg border border-ink/15 bg-paper">
        {/* browser chrome */}
        <div className="flex items-center gap-1.5 border-b border-ink/10 px-4 py-3">
          <span className="h-2 w-2 rounded-full bg-ink/15" />
          <span className="h-2 w-2 rounded-full bg-ink/15" />
          <span className="h-2 w-2 rounded-full bg-ink/15" />
          <span className="ms-3 h-3.5 flex-1 rounded-full bg-ink/[0.05]" />
        </div>

        {/* topology body */}
        <div className="p-6 sm:p-8">
          <div className="mb-6 flex items-center justify-between">
            <div className="h-2.5 w-24 rounded-sm bg-ink/15" />
            <div className="h-2.5 w-10 rounded-sm bg-viridian/50" />
          </div>

          <svg
            viewBox="0 0 400 280"
            className="h-40 w-full sm:h-52"
            role="presentation"
          >
            {/* orbit */}
            <circle
              cx="200"
              cy="140"
              r="108"
              fill="none"
              stroke="var(--ink)"
              strokeOpacity="0.15"
              strokeWidth="1"
              strokeDasharray="3 5"
            />
            {/* links */}
            {links.map(([a, b], i) => (
              <line
                key={i}
                x1={nodes[a].x}
                y1={nodes[a].y}
                x2={nodes[b].x}
                y2={nodes[b].y}
                stroke="var(--ink)"
                strokeOpacity="0.25"
                strokeWidth="1"
              />
            ))}
            {/* nodes */}
            {nodes.map((n, i) =>
              n.kind === 'center' ? (
                <g key={i}>
                  <circle cx={n.x} cy={n.y} r={n.r + 8} fill="var(--viridian)" fillOpacity="0.12" />
                  <circle cx={n.x} cy={n.y} r={n.r} fill="var(--viridian)" />
                  <circle cx={n.x} cy={n.y} r={n.r - 5} fill="none" stroke="var(--paper)" strokeOpacity="0.7" strokeWidth="1" />
                </g>
              ) : (
                <circle
                  key={i}
                  cx={n.x}
                  cy={n.y}
                  r={n.r}
                  fill={
                    n.kind === 'gold'
                      ? 'var(--gold)'
                      : n.kind === 'viridian'
                        ? 'var(--viridian)'
                        : 'none'
                  }
                  stroke={
                    n.kind === 'ink' ? 'var(--ink)' : 'none'
                  }
                  strokeOpacity="0.8"
                  strokeWidth="1.25"
                />
              )
            )}
          </svg>

          <div className="mt-5 flex gap-2 border-t border-ink/10 pt-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <div
                key={i}
                className={`h-1.5 flex-1 rounded-full ${
                  i === 2 ? 'bg-viridian/50' : 'bg-ink/10'
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

const mockups = [<AnalyticsMockup key="analytics" />, <CloudOpsMockup key="cloudops" />];

export default function Products() {
  const { t } = useLocale();
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: '-100px' });

  const heading = t.products.heading;

  return (
    <section
      id="products"
      ref={sectionRef}
      aria-label={t.products.ariaLabel}
      className="scroll-mt-20 border-t border-ink/10 py-24 md:py-32"
    >
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, ease: EASE }}
        >
          <p className="font-mono text-[11px] uppercase tracking-[0.25em] text-ink/50">
            {t.products.eyebrow}
          </p>
          <h2 className="mt-6 text-balance font-serif text-4xl font-light leading-[1.05] tracking-tight text-ink sm:text-5xl lg:text-6xl">
            {heading.lead}
            <em className="italic text-viridian">{heading.accent}</em>
            {heading.tail}
          </h2>
          {t.products.intro ? (
            <p className="mt-5 max-w-md text-sm leading-relaxed text-ink/60 sm:text-base">
              {t.products.intro}
            </p>
          ) : null}
        </motion.div>

        {/* Product splits */}
        <div className="mt-16 space-y-24 md:mt-24 md:space-y-32">
          {t.products.items.map((product, i) => (
            <div
              key={product.title}
              className="grid items-center gap-12 lg:grid-cols-2 lg:gap-20"
            >
              {/* visual */}
              <motion.div
                custom={0}
                variants={reveal}
                initial="hidden"
                animate={isInView ? 'visible' : 'hidden'}
                className={i % 2 === 1 ? 'lg:order-2' : ''}
              >
                {mockups[i]}
              </motion.div>

              {/* copy */}
              <motion.div
                custom={1}
                variants={reveal}
                initial="hidden"
                animate={isInView ? 'visible' : 'hidden'}
                className={i % 2 === 1 ? 'lg:order-1' : ''}
              >
                <p className="flex items-center gap-3 font-mono text-[11px] uppercase tracking-[0.25em] text-ink/50">
                  <span
                    aria-hidden="true"
                    className="h-[5px] w-[5px] rotate-45 bg-gold"
                  />
                  {product.label}
                </p>
                <h3 className="mt-5 font-serif text-3xl font-light tracking-tight text-ink sm:text-4xl">
                  {product.title}
                </h3>
                <p className="mt-5 max-w-md text-sm leading-relaxed text-ink/60 sm:text-base">
                  {product.description}
                </p>

                <ul className="mt-8 flex flex-wrap items-center gap-x-3 gap-y-2">
                  {product.features.map((feature, j) => (
                    <li
                      key={feature}
                      className="flex items-center gap-3 font-mono text-[10px] uppercase tracking-[0.15em] text-ink/55 sm:text-[11px]"
                    >
                      {j > 0 && (
                        <span
                          aria-hidden="true"
                          className="h-[4px] w-[4px] rotate-45 bg-gold/70"
                        />
                      )}
                      {feature}
                    </li>
                  ))}
                </ul>

                <a
                  href="#contact"
                  onClick={(e) => {
                    e.preventDefault();
                    document
                      .querySelector('#contact')
                      ?.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="group mt-10 inline-flex items-center gap-2 text-sm font-medium text-ink underline-offset-8 hover:text-viridian"
                >
                  <span className="border-b border-ink/25 pb-0.5 transition-colors duration-300 group-hover:border-viridian">
                    {t.products.explore}
                  </span>
                  <ArrowRight className="slide-x h-4 w-4 transition-[transform,color] duration-500" />
                </a>
              </motion.div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
