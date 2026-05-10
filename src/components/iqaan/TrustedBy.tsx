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

const MarqueeRow = ({
  items,
  direction = 'left',
}: {
  items: string[];
  direction?: 'left' | 'right';
}) => {
  const duplicated = [...items, ...items];

  return (
    <div className="relative overflow-hidden w-full">
      {/* Fade edges */}
      <div className="absolute left-0 top-0 bottom-0 w-16 md:w-32 z-10 bg-gradient-to-r from-background to-transparent pointer-events-none" />
      <div className="absolute right-0 top-0 bottom-0 w-16 md:w-32 z-10 bg-gradient-to-l from-background to-transparent pointer-events-none" />

      <motion.div
        className="flex gap-5 md:gap-6 w-max"
        animate={{
          x: direction === 'left' ? ['0%', '-50%'] : ['-50%', '0%'],
        }}
        transition={{
          x: {
            repeat: Infinity,
            repeatType: 'loop',
            duration: 30,
            ease: 'linear',
          },
        }}
      >
        {duplicated.map((name, index) => (
          <div
            key={`${name}-${index}`}
            className="flex-shrink-0 flex items-center justify-center border border-border/30 rounded-xl px-6 py-3 sm:px-8 sm:py-4 bg-white/[0.02] backdrop-blur-sm hover:bg-white/[0.06] hover:border-border/50 transition-all duration-300"
          >
            <span className="text-sm sm:text-base md:text-lg font-semibold tracking-wide text-muted-foreground/70 whitespace-nowrap select-none">
              {name}
            </span>
          </div>
        ))}
      </motion.div>
    </div>
  );
};

export default function TrustedBy() {
  const row1 = companies.slice(0, 5);
  const row2 = companies.slice(5, 10);

  return (
    <section id="about" className="relative w-full">
      {/* Top separator */}
      <div className="w-full h-px bg-gradient-to-r from-transparent via-border/40 to-transparent" />

      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-20">
        {/* Header */}
        <div className="text-center mb-12 md:mb-16">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
            className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight text-white"
          >
            Trusted by Industry Leaders
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.6, ease: 'easeOut', delay: 0.15 }}
            className="mt-3 sm:mt-4 text-sm sm:text-base md:text-lg text-muted-foreground max-w-2xl mx-auto"
          >
            We partner with forward-thinking companies across the globe
          </motion.p>
        </div>

        {/* Marquee rows */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.8, ease: 'easeOut', delay: 0.3 }}
          className="flex flex-col gap-5 md:gap-6"
        >
          <MarqueeRow items={row1} direction="left" />
          <MarqueeRow items={row2} direction="right" />
        </motion.div>
      </div>

      {/* Bottom separator */}
      <div className="w-full h-px bg-gradient-to-r from-transparent via-border/40 to-transparent" />
    </section>
  );
}
