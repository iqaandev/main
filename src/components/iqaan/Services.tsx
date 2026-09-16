'use client';

import { useRef } from 'react';
import { motion, useInView, Variants } from 'framer-motion';
import { ArrowRight } from 'lucide-react';

const services = [
  {
    index: '01',
    title: 'Custom Software Development',
    description:
      'Bespoke systems shaped around the way you work — from enterprise applications to the APIs that hold them together.',
    features: [
      'Enterprise Applications',
      'API Development & Integration',
      'Legacy Modernization',
      'Microservices Architecture',
    ],
  },
  {
    index: '02',
    title: 'SaaS Platform Development',
    description:
      'Multi-tenant platforms engineered to grow with you — from first user to global scale.',
    features: [
      'Multi-tenant Architecture',
      'Subscription Management',
      'Real-time Analytics',
      'Auto-scaling Infrastructure',
    ],
  },
  {
    index: '03',
    title: 'Product Engineering',
    description:
      'From first sketch to shipped product — engineering and design practiced as one discipline.',
    features: [
      'MVP Development',
      'UI/UX Design',
      'Quality Assurance',
      'DevOps & CI/CD',
    ],
  },
];

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

const rowVariants: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.1, duration: 0.8, ease: EASE },
  }),
};

export default function Services() {
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: '-100px' });

  return (
    <section
      id="services"
      ref={sectionRef}
      aria-label="Services"
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
            01 — Services
          </p>
          <h2 className="mt-6 text-balance font-serif text-4xl font-light leading-[1.05] tracking-tight text-ink sm:text-5xl lg:text-6xl">
            Three ways we <em className="italic text-viridian">build</em>.
          </h2>
        </motion.div>

        {/* Index rows */}
        <div className="mt-16 md:mt-20">
          {services.map((service, i) => (
            <motion.a
              key={service.title}
              href="#contact"
              aria-label={`Start a project — ${service.title}`}
              onClick={(e) => {
                e.preventDefault();
                document
                  .querySelector('#contact')
                  ?.scrollIntoView({ behavior: 'smooth' });
              }}
              custom={i}
              variants={rowVariants}
              initial="hidden"
              animate={isInView ? 'visible' : 'hidden'}
              className={`group grid grid-cols-1 gap-x-10 gap-y-5 px-4 py-10 transition-colors duration-500 hover:bg-ink/[0.03] sm:px-6 md:grid-cols-[5rem_1fr_2rem] md:py-12 lg:grid-cols-[7rem_1fr_19rem_3rem] ${
                i > 0 ? 'border-t border-ink/10' : ''
              }`}
            >
              {/* index numeral */}
              <span
                aria-hidden="true"
                className="font-serif text-4xl font-light leading-none text-ink/25 transition-colors duration-500 group-hover:text-gold md:pt-2 md:text-5xl"
              >
                {service.index}
              </span>

              {/* title + description */}
              <div>
                <h3 className="font-serif text-2xl font-normal tracking-tight text-ink sm:text-3xl">
                  {service.title}
                </h3>
                <p className="mt-3 max-w-md text-sm leading-relaxed text-ink/60 sm:text-base">
                  {service.description}
                </p>

                {/* features — revealed under on smaller screens */}
                <ul className="mt-5 flex flex-wrap items-center gap-x-3 gap-y-2 lg:hidden">
                  {service.features.map((feature, j) => (
                    <li
                      key={feature}
                      className="flex items-center gap-3 font-mono text-[10px] uppercase tracking-[0.15em] text-ink/50"
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
              </div>

              {/* features — quiet mono list on the right (desktop) */}
              <ul className="hidden list-none space-y-2.5 lg:block">
                {service.features.map((feature) => (
                  <li
                    key={feature}
                    className="font-mono text-[11px] uppercase leading-relaxed tracking-[0.15em] text-ink/50"
                  >
                    {feature}
                  </li>
                ))}
              </ul>

              {/* sliding arrow */}
              <span className="hidden items-center justify-end md:flex lg:col-start-4">
                <ArrowRight
                  aria-hidden="true"
                  className="h-5 w-5 text-ink/30 transition-all duration-500 group-hover:translate-x-1.5 group-hover:text-viridian"
                />
              </span>
            </motion.a>
          ))}

          {/* closing rule */}
          <div aria-hidden="true" className="border-t border-ink/10" />
        </div>
      </div>
    </section>
  );
}
