'use client';

import { useRef } from 'react';
import { motion, useInView, Variants } from 'framer-motion';
import { Star } from 'lucide-react';
import { useLocale } from '@/i18n/LocaleProvider';

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

const reveal: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.12, duration: 0.85, ease: EASE },
  }),
};

function Stars({ count, label }: { count: number; label: string }) {
  return (
    <div
      className="flex items-center gap-1"
      role="img"
      aria-label={label}
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
  const { t } = useLocale();
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: '-100px' });

  const visible = isInView ? 'visible' : 'hidden';
  const heading = t.testimonials.heading;
  const featured = t.testimonials.featured;

  return (
    <section
      ref={sectionRef}
      aria-label={t.testimonials.ariaLabel}
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
            {t.testimonials.eyebrow}
          </p>
          <h2 className="mt-6 text-balance font-serif text-4xl font-light leading-[1.05] tracking-tight text-ink sm:text-5xl lg:text-6xl">
            {heading.lead}
            <em className="italic text-viridian">{heading.accent}</em>
            {heading.tail}
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
          <Stars
            count={5}
            label={t.testimonials.starsAria(5)}
          />
          <blockquote className="mt-8 max-w-4xl">
            <p className="text-balance font-serif text-2xl font-light leading-[1.25] tracking-tight text-ink sm:text-3xl lg:text-4xl">
              <span
                aria-hidden="true"
                className="me-2 align-top font-serif text-gold"
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
          {t.testimonials.items.map((testimonial, i) => (
            <motion.figure
              key={testimonial.name}
              custom={i + 1}
              variants={reveal}
              initial="hidden"
              animate={visible}
              className="rounded-sm border border-ink/10 bg-card p-8 md:p-10"
            >
              <Stars
                count={5}
                label={t.testimonials.starsAria(5)}
              />
              <blockquote className="mt-6">
                <p className="font-serif text-lg font-light leading-relaxed text-ink/90 sm:text-xl">
                  &ldquo;{testimonial.quote}&rdquo;
                </p>
              </blockquote>
              <figcaption className="mt-8 flex items-center gap-4 border-t border-ink/10 pt-6">
                <Monogram initials={testimonial.initials} />
                <div>
                  <p className="font-medium text-ink">{testimonial.name}</p>
                  <p className="mt-0.5 font-mono text-[11px] uppercase tracking-[0.15em] text-ink/50">
                    {testimonial.title}
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
