'use client';

import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { Search, PenTool, Code, Rocket, LucideIcon } from 'lucide-react';

const steps: {
  number: string;
  title: string;
  description: string;
  icon: LucideIcon;
}[] = [
  {
    number: '01',
    title: 'Discovery & Strategy',
    description:
      'We dive deep into your business goals, user needs, and market landscape to craft a winning technical strategy.',
    icon: Search,
  },
  {
    number: '02',
    title: 'Design & Architecture',
    description:
      'Our designers and architects create intuitive interfaces and scalable system designs that stand the test of time.',
    icon: PenTool,
  },
  {
    number: '03',
    title: 'Development & Testing',
    description:
      'Agile development with continuous integration, rigorous testing, and transparent progress tracking.',
    icon: Code,
  },
  {
    number: '04',
    title: 'Launch & Scale',
    description:
      'Seamless deployment, monitoring, and ongoing optimization to ensure your product thrives in production.',
    icon: Rocket,
  },
];

const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.2,
    },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: 'easeOut',
    },
  },
};

export default function Process() {
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: '-100px' });

  return (
    <section id="process" ref={sectionRef} className="relative py-24 md:py-32 bg-background">
      {/* Horizontal gradient timeline line – desktop only */}
      <div className="hidden lg:block absolute top-1/2 left-0 right-0 h-[2px] -translate-y-1/2 pointer-events-none">
        <div className="w-full h-full bg-gradient-to-r from-primary to-primary/0" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16 md:mb-20"
        >
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight text-foreground">
            Our Development Process
          </h2>
          <p className="mt-4 text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
            A proven methodology that delivers results, every time
          </p>
        </motion.div>

        {/* Process Steps Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? 'visible' : 'hidden'}
          className="relative grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-6"
        >
          {/* Vertical timeline line – mobile & tablet only */}
          <div className="md:col-span-2 lg:hidden absolute top-0 bottom-0 left-[23px] w-[2px] pointer-events-none">
            <div className="w-full h-full bg-gradient-to-b from-primary to-primary/0" />
          </div>

          {steps.map((step, index) => {
            const Icon = step.icon;

            return (
              <motion.div
                key={step.number}
                variants={cardVariants}
                className="relative"
              >
                {/* Mobile / Tablet layout */}
                <div className="flex lg:hidden items-start gap-6">
                  {/* Timeline dot */}
                  <div className="relative z-10 flex-shrink-0 w-12 h-12 rounded-full bg-primary flex items-center justify-center shadow-lg shadow-primary/25">
                    <Icon className="w-5 h-5 text-primary-foreground" />
                  </div>

                  {/* Card */}
                  <div className="bg-card border border-border/50 rounded-2xl p-6 relative overflow-hidden flex-1 mb-8">
                    {/* Large step number watermark */}
                    <span className="absolute -top-2 -right-1 text-6xl font-bold text-primary/10 select-none pointer-events-none">
                      {step.number}
                    </span>

                    <p className="text-xs font-semibold uppercase tracking-wider text-primary mb-1">
                      Step {step.number}
                    </p>
                    <h3 className="text-xl font-semibold text-foreground mb-3">
                      {step.title}
                    </h3>
                    <p className="text-sm leading-relaxed text-muted-foreground">
                      {step.description}
                    </p>
                  </div>
                </div>

                {/* Desktop layout */}
                <div className="hidden lg:block">
                  <div className="bg-card border border-border/50 rounded-2xl p-8 relative overflow-hidden text-center h-full">
                    {/* Large step number watermark */}
                    <span className="absolute -top-4 -right-2 text-6xl font-bold text-primary/10 select-none pointer-events-none">
                      {step.number}
                    </span>

                    {/* Icon circle */}
                    <div className="relative z-10 mx-auto mb-6 w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center border-2 border-primary/20">
                      <Icon className="w-7 h-7 text-primary" />
                    </div>

                    <p className="text-xs font-semibold uppercase tracking-wider text-primary mb-2">
                      Step {step.number}
                    </p>
                    <h3 className="text-lg font-semibold text-foreground mb-3">
                      {step.title}
                    </h3>
                    <p className="text-sm leading-relaxed text-muted-foreground">
                      {step.description}
                    </p>
                  </div>

                  {/* Connector dot on the horizontal line */}
                  {index < steps.length - 1 && (
                    <div className="absolute top-1/2 -right-3 -translate-y-1/2 w-2 h-2 rounded-full bg-primary/40 z-10 hidden lg:block" />
                  )}
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
