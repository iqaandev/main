'use client';

import { useRef } from 'react';
import { motion, useInView, Variants } from 'framer-motion';

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

const principles = [
  {
    title: 'Precision over pace',
    line: 'We would rather ship it right than ship it first. Deadlines serve the work.',
  },
  {
    title: 'Design is not decoration',
    line: 'Structure, flow, and clarity are designed from the first commit — never applied at the end.',
  },
  {
    title: 'Own the outcome',
    line: 'Accountability does not end at launch. We answer to the numbers, and to the people behind them.',
  },
];

const reveal: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.12, duration: 0.9, ease: EASE },
  }),
};

export default function Manifesto() {
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: '-100px' });

  const visible = isInView ? 'visible' : 'hidden';

  return (
    <section
      id="studio"
      ref={sectionRef}
      aria-label="The IQAAN Standard"
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
              03 — The IQAAN Standard
            </motion.p>

            <motion.h2
              custom={1}
              variants={reveal}
              initial="hidden"
              animate={visible}
              className="mt-8 max-w-4xl text-balance font-serif text-3xl font-light leading-[1.15] tracking-tight text-paper sm:text-4xl lg:text-[3.4rem] lg:leading-[1.08]"
            >
              We believe software is a craft. Every decision — architectural,
              visual, human — is made with{' '}
              <em className="italic text-gold-bright">conviction</em>, or not
              at all.
            </motion.h2>
          </div>

          {/* Arabic wordmark — heritage mark, gold */}
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
              className="text-3xl leading-none text-gold-bright sm:text-4xl"
            >
              إيقان
            </span>
            <span
              aria-hidden="true"
              className="h-10 w-px bg-paper/20"
            />
            <p className="font-mono text-[10px] uppercase leading-relaxed tracking-[0.2em] text-paper/50">
              iʿqān
              <br />
              deep conviction
            </p>
          </motion.div>
        </div>

        {/* principles — hairline grid */}
        <div className="mt-16 grid gap-10 sm:grid-cols-3 md:mt-24 md:gap-12">
          {principles.map((principle, i) => (
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
