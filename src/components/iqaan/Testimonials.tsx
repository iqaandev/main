'use client';

import { useRef } from 'react';
import { motion, useInView, Variants } from 'framer-motion';
import { Star } from 'lucide-react';

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

const featured = {
  name: 'Sarah Chen',
  title: 'CTO of TechVenture',
  initials: 'SC',
  rating: 5,
  quote:
    'IQAAN transformed our legacy systems into a modern, scalable platform. The new system handles 10x our previous load with zero downtime.',
};

const testimonials = [
  {
    name: 'Marcus Rodriguez',
    title: 'CEO of DataSphere',
    initials: 'MR',
    rating: 5,
    quote:
      'The best decision we made. On time, on budget, outstanding quality — our user base grew 300% in the first quarter after launch.',
  },
  {
    name: 'Emily Watson',
    title: 'VP Engineering at CloudNine',
    initials: 'EW',
    rating: 5,
    quote:
      "IQAAN doesn't just write code — they become true partners in your success. Their product thinking helped us avoid costly mistakes and ship faster.",
  },
];

const reveal: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.12, duration: 0.85, ease: EASE },
  }),
};

function Stars({ count }: { count: number }) {
  return (
    <div
      className="flex items-center gap-1"
      role="img"
      aria-label={`${count} out of 5 stars`}
    >
      {Array.from({ length: count }).map((_, i) => (
        <Star
          key={i}
          aria-hidden="true"
          className="h-3 w-3 fill-gold text-gold"
          strokeWidth={1}
        />
      ))}
    </div>
  );
}

function Monogram({ initials }: { initials: string }) {
  return (
    <span
      aria-hidden="true"
      className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-ink/20 font-serif text-sm tracking-wider text-ink"
    >
      {initials}
    </span>
  );
}

export default function Testimonials() {
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: '-100px' });

  const visible = isInView ? 'visible' : 'hidden';

  return (
    <section
      ref={sectionRef}
      aria-label="Client voices"
      className="border-t border-ink/10 py-24 md:py-32"
    >
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, ease: EASE }}
        >
          <p className="font-mono text-[11px] uppercase tracking-[0.25em] text-ink/50">
            05 — Client voices
          </p>
          <h2 className="mt-6 text-balance font-serif text-4xl font-light leading-[1.05] tracking-tight text-ink sm:text-5xl lg:text-6xl">
            In their <em className="italic text-viridian">words</em>.
          </h2>
        </motion.div>

        {/* Featured pull-quote */}
        <motion.figure
          custom={0}
          variants={reveal}
          initial="hidden"
          animate={visible}
          className="mt-16 border-b border-ink/10 pb-16 md:mt-20 md:pb-20"
        >
          <Stars count={featured.rating} />
          <blockquote className="mt-8 max-w-4xl">
            <p className="text-balance font-serif text-2xl font-light leading-[1.25] tracking-tight text-ink sm:text-3xl lg:text-4xl">
              <span
                aria-hidden="true"
                className="mr-2 align-top font-serif text-gold"
              >
                &ldquo;
              </span>
              {featured.quote}
              <span aria-hidden="true" className="font-serif text-gold">
                &rdquo;
              </span>
            </p>
          </blockquote>
          <figcaption className="mt-10 flex items-center gap-4">
            <Monogram initials={featured.initials} />
            <div>
              <p className="font-medium text-ink">{featured.name}</p>
              <p className="mt-0.5 font-mono text-[11px] uppercase tracking-[0.15em] text-ink/50">
                {featured.title}
              </p>
            </div>
          </figcaption>
        </motion.figure>

        {/* Two quieter cards */}
        <div className="grid gap-8 pt-16 md:grid-cols-2 md:gap-12 md:pt-20">
          {testimonials.map((t, i) => (
            <motion.figure
              key={t.name}
              custom={i + 1}
              variants={reveal}
              initial="hidden"
              animate={visible}
              className="rounded-sm border border-ink/10 bg-card p-8 md:p-10"
            >
              <Stars count={t.rating} />
              <blockquote className="mt-6">
                <p className="font-serif text-lg font-light leading-relaxed text-ink/90 sm:text-xl">
                  &ldquo;{t.quote}&rdquo;
                </p>
              </blockquote>
              <figcaption className="mt-8 flex items-center gap-4 border-t border-ink/10 pt-6">
                <Monogram initials={t.initials} />
                <div>
                  <p className="font-medium text-ink">{t.name}</p>
                  <p className="mt-0.5 font-mono text-[11px] uppercase tracking-[0.15em] text-ink/50">
                    {t.title}
                  </p>
                </div>
              </figcaption>
            </motion.figure>
          ))}
        </div>
      </div>
    </section>
  );
}
