'use client';

import { useRef } from 'react';
import { motion, useInView, Variants } from 'framer-motion';

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

const steps = [
  {
    number: '01',
    title: 'Discovery & Strategy',
    description:
      'We learn your business, your users, and the problem worth solving — then chart the technical strategy.',
  },
  {
    number: '02',
    title: 'Design & Architecture',
    description:
      'Interfaces and systems designed together — intuitive to use, built to last.',
  },
  {
    number: '03',
    title: 'Development & Testing',
    description:
      'Agile builds with continuous integration, rigorous testing, and progress you can see.',
  },
  {
    number: '04',
    title: 'Launch & Scale',
    description:
      'Seamless deployment, constant monitoring, and the optimization production demands.',
  },
];

const stepVariants: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.1, duration: 0.8, ease: EASE },
  }),
};

export default function Process() {
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: '-100px' });

  return (
    <section
      id="process"
      ref={sectionRef}
      aria-label="Process"
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
            04 — Process
          </p>
          <h2 className="mt-6 text-balance font-serif text-4xl font-light leading-[1.05] tracking-tight text-ink sm:text-5xl lg:text-6xl">
            From first call to <em className="italic text-viridian">launch</em>.
          </h2>
        </motion.div>

        {/* Timeline — vertical hairline on mobile, hairline grid on desktop */}
        <ol className="relative mt-16 md:mt-24 md:grid md:grid-cols-4 md:gap-10">
          {/* vertical hairline */}
          <span
            aria-hidden="true"
            className="absolute bottom-2 left-0 top-2 w-px bg-ink/15 md:hidden"
          />

          {steps.map((step, i) => (
            <motion.li
              key={step.number}
              custom={i}
              variants={stepVariants}
              initial="hidden"
              animate={isInView ? 'visible' : 'hidden'}
              className="relative border-ink/15 pl-10 md:border-t md:pb-0 md:pl-0 md:pt-8 lg:pl-6"
            >
              {/* gold diamond marker on the timeline */}
              <span
                aria-hidden="true"
                className="absolute left-[-3.5px] top-2 h-[7px] w-[7px] rotate-45 bg-gold md:left-0 md:top-[-3.5px]"
              />

              <p className="font-serif text-4xl font-light leading-none text-ink/30">
                {step.number}
              </p>
              <h3 className="mt-5 font-serif text-xl font-normal tracking-tight text-ink sm:text-2xl">
                {step.title}
              </h3>
              <p className="mb-12 mt-3 text-sm leading-relaxed text-ink/60 md:mb-0">
                {step.description}
              </p>
            </motion.li>
          ))}
        </ol>
      </div>
    </section>
  );
}
