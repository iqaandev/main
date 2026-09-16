'use client';

import { motion } from 'framer-motion';

const companies = [
  'TechVenture',
  'DataSphere',
  'CloudNine',
  'FinanceHub',
  'MedTech Pro',
  'RetailGenius',
  'AutoDrive AI',
  'EduPlatform',
  'GreenEnergy Co',
  'BlockChain Inc',
];

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

function Diamond() {
  return (
    <span
      aria-hidden="true"
      className="mx-8 inline-block h-[5px] w-[5px] shrink-0 rotate-45 bg-gold/80 sm:mx-12"
    />
  );
}

export default function TrustedBy() {
  const names = [...companies, ...companies];

  return (
    <section aria-label="Trusted by" className="border-t border-ink/10 py-14 md:py-16">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.8, ease: EASE }}
          className="text-center font-mono text-[10px] uppercase tracking-[0.25em] text-ink/45 sm:text-[11px]"
        >
          Trusted by teams at
        </motion.p>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.9, delay: 0.2, ease: EASE }}
          className="mask-fade-x mt-8 overflow-hidden"
        >
          <div className="flex w-max animate-marquee items-center motion-reduce:animate-none">
            {names.map((name, index) => (
              <span key={`${name}-${index}`} className="flex items-center">
                <span className="select-none whitespace-nowrap font-serif text-xl font-normal tracking-tight text-ink/60 md:text-2xl">
                  {name}
                </span>
                <Diamond />
              </span>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
