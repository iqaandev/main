'use client';

import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { Code2, Cloud, Rocket, CheckCircle2, ArrowRight } from 'lucide-react';

const services = [
  {
    icon: Code2,
    title: 'Custom Software Development',
    description:
      'We architect and build bespoke software solutions that perfectly align with your unique business requirements. From enterprise systems to consumer applications, our code powers innovation.',
    features: [
      'Enterprise Applications',
      'API Development & Integration',
      'Legacy System Modernization',
      'Microservices Architecture',
    ],
  },
  {
    icon: Cloud,
    title: 'SaaS Platform Development',
    description:
      'Build scalable, multi-tenant SaaS platforms that grow with your business. We handle everything from subscription management to real-time analytics.',
    features: [
      'Multi-tenant Architecture',
      'Subscription Management',
      'Real-time Analytics',
      'Auto-scaling Infrastructure',
    ],
  },
  {
    icon: Rocket,
    title: 'Product Engineering',
    description:
      'Transform your vision into market-ready products. Our product engineering team combines technical excellence with user-centric design thinking.',
    features: [
      'MVP Development',
      'UI/UX Design',
      'Quality Assurance',
      'DevOps & CI/CD',
    ],
  },
];

const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.15,
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

export default function Services() {
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: '-100px' });

  return (
    <section id="services" className="py-20 md:py-28" ref={sectionRef}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          className="text-center mb-16 md:mb-20"
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, ease: 'easeOut' }}
        >
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-foreground mb-4">
            Our Core Services
          </h2>
          {/* Gradient Accent Line */}
          <div className="mx-auto mb-6 h-1 w-24 rounded-full bg-gradient-to-r from-primary via-emerald-400 to-primary" />
          <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
            End-to-end software solutions tailored to accelerate your business
            growth
          </p>
        </motion.div>

        {/* Service Cards Grid */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8"
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? 'visible' : 'hidden'}
        >
          {services.map((service) => {
            const Icon = service.icon;

            return (
              <motion.div
                key={service.title}
                variants={cardVariants}
                whileHover={{ scale: 1.03, y: -4 }}
                transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                className="group relative bg-card border border-border/50 rounded-2xl p-6 md:p-8 transition-colors duration-300 hover:border-primary/50 hover:shadow-[0_0_30px_rgba(16,185,129,0.08)]"
              >
                {/* Icon */}
                <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-xl bg-primary/10">
                  <Icon className="h-7 w-7 text-primary" strokeWidth={1.8} />
                </div>

                {/* Title */}
                <h3 className="mb-3 text-xl font-semibold tracking-tight text-foreground">
                  {service.title}
                </h3>

                {/* Description */}
                <p className="mb-6 text-sm leading-relaxed text-muted-foreground">
                  {service.description}
                </p>

                {/* Features List */}
                <ul className="mb-8 space-y-3">
                  {service.features.map((feature) => (
                    <li
                      key={feature}
                      className="flex items-start gap-3 text-sm text-muted-foreground"
                    >
                      <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-primary/70" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>

                {/* Learn More */}
                <a
                  href="#"
                  className="inline-flex items-center gap-2 text-sm font-medium text-primary transition-colors hover:text-primary/80"
                >
                  Learn More
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </a>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
