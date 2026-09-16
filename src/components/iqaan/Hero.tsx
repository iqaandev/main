'use client';

import { useRef } from 'react';
import { motion, useInView, Variants } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { ArrowRight, Sparkle } from 'lucide-react';

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

const rise: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: 0.15 + i * 0.12, duration: 0.9, ease: EASE },
  }),
};

export default function Hero() {
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: '-80px' });

  const visible = isInView ? 'visible' : 'hidden';

  return (
    <section
      id="top"
      ref={sectionRef}
      aria-label="Introduction"
      className="relative flex min-h-svh flex-col items-center justify-center overflow-hidden px-6 pb-28 pt-32 text-center"
    >
      {/* faint hairline frame — a quiet nod to the printed page */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-6 inset-y-6 hidden border border-ink/8 md:block lg:inset-x-12"
      />

      <div className="relative max-w-5xl">
        {/* signature ornament */}
        <motion.div
          custom={0}
          variants={rise}
          initial="hidden"
          animate={visible}
          className="mb-10 flex justify-center"
        >
          <Sparkle
            aria-hidden="true"
            className="h-5 w-5 animate-rotate-slow fill-gold text-gold motion-reduce:animate-none"
          />
        </motion.div>

        {/* eyebrow */}
        <motion.p
          custom={1}
          variants={rise}
          initial="hidden"
          animate={visible}
          className="font-mono text-[11px] uppercase tracking-[0.25em] text-ink/50 sm:text-xs"
        >
          Software &amp; Product Studio
        </motion.p>

        {/* headline */}
        <motion.h1
          custom={2}
          variants={rise}
          initial="hidden"
          animate={visible}
          className="mt-8 text-balance font-serif text-[clamp(3rem,8vw,6.5rem)] font-light leading-[1.02] tracking-tight text-ink"
        >
          Software, built
          <br />
          with{' '}
          <em className="relative inline-block italic text-viridian">
            conviction
            <span
              aria-hidden="true"
              className="absolute -bottom-1 left-0 h-px w-full -rotate-1 bg-gold sm:-bottom-2"
            />
          </em>
          .
        </motion.h1>

        {/* subline */}
        <motion.p
          custom={3}
          variants={rise}
          initial="hidden"
          animate={visible}
          className="mx-auto mt-8 max-w-xl text-balance text-base leading-relaxed text-ink/65 sm:text-lg"
        >
          IQAAN designs and engineers custom software, SaaS platforms, and
          products — for companies that refuse to ship the ordinary.
        </motion.p>

        {/* calls to action */}
        <motion.div
          custom={4}
          variants={rise}
          initial="hidden"
          animate={visible}
          className="mt-12 flex flex-col items-center justify-center gap-5 sm:flex-row sm:gap-8"
        >
          <Button
            size="lg"
            className="min-w-[220px] cursor-pointer rounded-full bg-viridian px-8 font-normal text-paper transition-colors duration-300 hover:bg-ink"
            onClick={() => {
              document
                .querySelector('#contact')
                ?.scrollIntoView({ behavior: 'smooth' });
            }}
          >
            Start your project
            <ArrowRight className="h-4 w-4" />
          </Button>

          <a
            href="#services"
            onClick={(e) => {
              e.preventDefault();
              document
                .querySelector('#services')
                ?.scrollIntoView({ behavior: 'smooth' });
            }}
            className="group relative py-2 text-sm font-medium text-ink underline-offset-8 hover:text-viridian"
          >
            Explore services
            <span
              aria-hidden="true"
              className="absolute bottom-0 left-0 h-px w-full origin-left scale-x-100 bg-ink/30 transition-colors duration-300 group-hover:bg-viridian"
            />
          </a>
        </motion.div>

        {/* trust line */}
        <motion.div
          custom={5}
          variants={rise}
          initial="hidden"
          animate={visible}
          className="mt-16 flex items-center justify-center gap-4"
        >
          <span aria-hidden="true" className="h-px w-10 bg-ink/20 sm:w-16" />
          <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-ink/50 sm:text-[11px]">
            Trusted by teams on four continents &middot; Free consultation
          </p>
          <span aria-hidden="true" className="h-px w-10 bg-ink/20 sm:w-16" />
        </motion.div>
      </div>
    </section>
  );
}
