'use client';

import { useRef } from 'react';
import { motion, useInView, Variants } from 'framer-motion';
import { useLocale } from '@/i18n/LocaleProvider';

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

const reveal: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.12, duration: 0.9, ease: EASE },
  }),
};

export default function Manifesto() {
  const { t } = useLocale();
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: '-100px' });

  const visible = isInView ? 'visible' : 'hidden';
  const statement = t.manifesto.statement;

  return (
    <section
      id="studio"
      ref={sectionRef}
      aria-label={t.manifesto.ariaLabel}
      className="scroll-mt-20 bg-ink-deep py-28 text-paper md:py-36"
    >
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        {/* header row — statement + Arabic wordmark */}
        <div className="grid gap-12 lg:grid-cols-[1fr_auto] lg:items-end">
          <div>
            <motion.p
              custom={0}
              variants={reveal}
              initial="hidden"
              animate={visible}
              className="font-mono text-[11px] uppercase tracking-[0.25em] text-gold-bright"
            >
              {t.manifesto.eyebrow}
            </motion.p>

            <motion.h2
              custom={1}
              variants={reveal}
              initial="hidden"
              animate={visible}
              className="mt-8 max-w-4xl text-balance font-serif text-3xl font-light leading-[1.15] tracking-tight text-paper sm:text-4xl lg:text-[3.4rem] lg:leading-[1.08]"
            >
              {statement.lead}
              <em className="italic text-gold-bright">{statement.accent}</em>
              {statement.tail}
            </motion.h2>
          </div>

          {/* Arabic wordmark — heritage mark, gold. Native in AR mode;
              under EN it carries the Latin gloss beneath. */}
          <motion.div
            custom={2}
            variants={reveal}
            initial="hidden"
            animate={visible}
            className="flex items-center gap-5 lg:pb-3"
          >
            <span
              lang="ar"
              dir="rtl"
              className="font-serif text-3xl leading-none text-gold-bright sm:text-4xl"
            >
              إيقان
            </span>
            <span
              aria-hidden="true"
              className="h-10 w-px bg-paper/20"
            />
            <p dir="ltr" className="font-mono text-[10px] uppercase leading-relaxed tracking-[0.2em] text-paper/50">
              {t.manifesto.glossTop}
              <br />
              {t.manifesto.glossBottom}
            </p>
          </motion.div>
        </div>

        {/* principles — hairline grid */}
        <div className="mt-16 grid gap-10 sm:grid-cols-3 md:mt-24 md:gap-12">
          {t.manifesto.principles.map((principle, i) => (
            <motion.div
              key={principle.title}
              custom={i + 1}
              variants={reveal}
              initial="hidden"
              animate={visible}
              className="border-t border-paper/15 pt-8"
            >
              <p
                aria-hidden="true"
                className="font-mono text-[10px] tracking-[0.25em] text-paper/40"
              >
                0{i + 1}
              </p>
              <h3 className="mt-4 font-serif text-xl font-normal tracking-tight text-paper sm:text-2xl">
                {principle.title}
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-paper/60">
                {principle.line}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
