'use client';

import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { Star, Quote } from 'lucide-react';

const testimonials = [
  {
    name: 'Sarah Chen',
    title: 'CTO of TechVenture',
    quote:
      'IQAAN transformed our legacy systems into a modern, scalable platform. Their team\'s technical expertise and dedication to quality exceeded all our expectations. The new system handles 10x our previous load with zero downtime.',
    rating: 5,
    initials: 'SC',
  },
  {
    name: 'Marcus Rodriguez',
    title: 'CEO of DataSphere',
    quote:
      'Working with IQAAN on our SaaS platform was the best decision we made. They delivered on time, within budget, and the product quality was outstanding. Our user base grew 300% in the first quarter post-launch.',
    rating: 5,
    initials: 'MR',
  },
  {
    name: 'Emily Watson',
    title: 'VP Engineering at CloudNine',
    quote:
      'The IQAAN team doesn\'t just write code — they become true partners in your success. Their product thinking and architectural expertise helped us avoid costly mistakes and ship faster.',
    rating: 5,
    initials: 'EW',
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
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

export default function Testimonials() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: '-100px' });

  return (
    <section ref={sectionRef} className="py-20 md:py-28 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight">
            What Our Clients Say
          </h2>
          <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
            Don&apos;t just take our word for it
          </p>
        </motion.div>

        {/* Testimonials Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? 'visible' : 'hidden'}
          className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8"
        >
          {testimonials.map((testimonial) => (
            <motion.div
              key={testimonial.name}
              variants={cardVariants}
              className="group bg-card border border-border/50 rounded-2xl p-6 md:p-8 transition-all duration-300 hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5"
            >
              {/* Star Rating */}
              <div className="flex gap-1 mb-6">
                {Array.from({ length: testimonial.rating }).map((_, i) => (
                  <Star
                    key={i}
                    className="w-5 h-5 fill-amber-400 text-amber-400"
                  />
                ))}
              </div>

              {/* Quote */}
              <div className="relative mb-8">
                <Quote className="text-3xl text-primary/30 font-serif mb-4" />
                <p className="text-base md:text-lg leading-relaxed text-foreground/90 italic">
                  {testimonial.quote}
                </p>
              </div>

              {/* Author Info */}
              <div className="flex items-center gap-4 pt-6 border-t border-border/50">
                <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-primary font-semibold text-sm shrink-0">
                  {testimonial.initials}
                </div>
                <div>
                  <p className="font-semibold text-foreground">
                    {testimonial.name}
                  </p>
                  <p className="text-muted-foreground text-sm">
                    {testimonial.title}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
