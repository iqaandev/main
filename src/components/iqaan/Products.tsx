'use client';

import Image from 'next/image';
import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import { ArrowRight, BarChart3, CloudCog } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

const products = [
  {
    title: 'IQAAN Analytics Pro',
    description:
      'Enterprise-grade analytics platform that transforms raw data into actionable insights with real-time dashboards, AI-powered predictions, and automated reporting.',
    features: ['Real-time Dashboards', 'AI Predictions', 'Custom Reports', 'Data Pipeline'],
    image: '/images/saas-product.png',
    icon: BarChart3,
    reverse: false,
  },
  {
    title: 'IQAAN CloudOps',
    description:
      'Comprehensive cloud management platform that simplifies infrastructure, automates deployments, and provides end-to-end visibility across your entire cloud ecosystem.',
    features: ['Auto Scaling', 'Cost Optimization', 'Multi-cloud Support', 'Security Compliance'],
    image: '/images/team.png',
    icon: CloudCog,
    reverse: true,
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
  hidden: { opacity: 0, y: 60 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.7,
      ease: [0.22, 1, 0.36, 1],
    },
  },
};

const imageVariants = {
  hidden: { opacity: 0, scale: 0.9, x: -30 },
  visible: {
    opacity: 1,
    scale: 1,
    x: 0,
    transition: {
      duration: 0.7,
      ease: [0.22, 1, 0.36, 1],
      delay: 0.15,
    },
  },
};

const contentVariants = {
  hidden: { opacity: 0, x: 30 },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.7,
      ease: [0.22, 1, 0.36, 1],
      delay: 0.25,
    },
  },
};

const imageVariantsReverse = {
  hidden: { opacity: 0, scale: 0.9, x: 30 },
  visible: {
    opacity: 1,
    scale: 1,
    x: 0,
    transition: {
      duration: 0.7,
      ease: [0.22, 1, 0.36, 1],
      delay: 0.15,
    },
  },
};

const contentVariantsReverse = {
  hidden: { opacity: 0, x: -30 },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.7,
      ease: [0.22, 1, 0.36, 1],
      delay: 0.25,
    },
  },
};

const badgeVariants = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: (i: number) => ({
    opacity: 1,
    scale: 1,
    transition: {
      duration: 0.4,
      ease: [0.22, 1, 0.36, 1],
      delay: 0.4 + i * 0.08,
    },
  }),
};

export default function Products() {
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: '-100px' });

  return (
    <section id="products" className="py-24 px-4 sm:px-6 lg:px-8" ref={sectionRef}>
      <div className="max-w-7xl mx-auto">
        {/* Section Heading */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="text-center mb-16"
        >
          <Badge variant="outline" className="mb-4">
            Products
          </Badge>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-foreground mb-4">
            Our SaaS Products
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Ready-to-deploy solutions built for scale
          </p>
        </motion.div>

        {/* Product Cards */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? 'visible' : 'hidden'}
          className="space-y-16"
        >
          {products.map((product) => {
            const Icon = product.icon;

            return (
              <motion.div
                key={product.title}
                variants={cardVariants}
                className="bg-card border border-border/50 rounded-2xl overflow-hidden"
              >
                <div
                  className={`grid grid-cols-1 lg:grid-cols-2 gap-0 ${
                    product.reverse ? 'lg:[direction:rtl]' : ''
                  }`}
                >
                  {/* Image Side */}
                  <motion.div
                    variants={product.reverse ? imageVariantsReverse : imageVariants}
                    className="relative p-6 sm:p-8 lg:p-10 flex items-center justify-center"
                  >
                    <div className="relative w-full max-w-md aspect-[4/3]">
                      {/* Subtle glow effect */}
                      <div
                        className={`absolute inset-0 rounded-2xl bg-primary/10 blur-3xl ${
                          product.reverse ? 'translate-x-4' : '-translate-x-4'
                        }`}
                      />
                      <div
                        className={`relative w-full h-full rounded-2xl overflow-hidden shadow-2xl border border-border/30`}
                      >
                        <Image
                          src={product.image}
                          alt={product.title}
                          fill
                          className="object-cover"
                          sizes="(max-width: 1024px) 100vw, 50vw"
                        />
                      </div>
                    </div>
                  </motion.div>

                  {/* Content Side */}
                  <motion.div
                    variants={product.reverse ? contentVariantsReverse : contentVariants}
                    className={`p-6 sm:p-8 lg:p-10 flex flex-col justify-center ${
                      product.reverse ? 'lg:[direction:ltr]' : ''
                    }`}
                  >
                    <div className="flex items-center gap-3 mb-4">
                      <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-primary/10">
                        <Icon className="w-5 h-5 text-primary" />
                      </div>
                    </div>

                    <h3 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground mb-4">
                      {product.title}
                    </h3>

                    <p className="text-muted-foreground leading-relaxed mb-6">
                      {product.description}
                    </p>

                    {/* Feature Badges */}
                    <div className="flex flex-wrap gap-2 mb-8">
                      {product.features.map((feature, i) => (
                        <motion.span
                          key={feature}
                          custom={i}
                          variants={badgeVariants}
                          className="rounded-full bg-primary/10 text-primary text-xs px-3 py-1 font-medium"
                        >
                          {feature}
                        </motion.span>
                      ))}
                    </div>

                    <div>
                      <Button variant="default" size="lg" className="group">
                        Explore Product
                        <ArrowRight className="ml-2 w-4 h-4 transition-transform group-hover:translate-x-1" />
                      </Button>
                    </div>
                  </motion.div>
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
