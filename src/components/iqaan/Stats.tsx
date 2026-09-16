'use client';

import { useEffect, useRef, useState } from 'react';
import { motion, useInView } from 'framer-motion';

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

interface StatItem {
  value: number;
  suffix: string;
  label: string;
  decimals: number;
}

const stats: StatItem[] = [
  { value: 500, suffix: '+', label: 'Projects Delivered', decimals: 0 },
  { value: 200, suffix: '+', label: 'Global Clients', decimals: 0 },
  { value: 99.9, suffix: '%', label: 'Uptime Guarantee', decimals: 1 },
  { value: 50, suffix: '+', label: 'Expert Engineers', decimals: 0 },
];

/* responsive hairline dividers for the 2×2 → 1×4 stat grid */
const cellBorders = [
  '',
  'border-l border-ink/10',
  'border-t border-ink/10 lg:border-l lg:border-t-0',
  'border-l border-t border-ink/10 lg:border-t-0',
];

function useCountUp(
  target: number,
  isInView: boolean,
  duration: number = 2000,
  decimals: number = 0
) {
  const [count, setCount] = useState(0);
  const frameRef = useRef<number | null>(null);
  const startTimeRef = useRef<number | null>(null);

  useEffect(() => {
    if (!isInView) return;

    const animate = (timestamp: number) => {
      if (startTimeRef.current === null) {
        startTimeRef.current = timestamp;
      }

      const elapsed = timestamp - startTimeRef.current;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);

      setCount(Number((eased * target).toFixed(decimals)));

      if (progress < 1) {
        frameRef.current = requestAnimationFrame(animate);
      }
    };

    frameRef.current = requestAnimationFrame(animate);

    return () => {
      if (frameRef.current !== null) {
        cancelAnimationFrame(frameRef.current);
      }
      startTimeRef.current = null;
    };
  }, [isInView, target, duration, decimals]);

  return count;
}

function StatCell({ stat, index }: { stat: StatItem; index: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-50px' });
  const count = useCountUp(stat.value, isInView, 2000, stat.decimals);

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 24 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 24 }}
      transition={{ duration: 0.8, delay: index * 0.1, ease: EASE }}
      className={`px-6 py-12 text-center md:py-16 ${cellBorders[index]}`}
    >
      <p className="font-serif text-5xl font-light leading-none tracking-tight text-ink md:text-6xl lg:text-7xl">
        {count}
        <span className="text-viridian">{stat.suffix}</span>
      </p>
      <p className="mt-5 font-mono text-[10px] uppercase tracking-[0.22em] text-ink/50 sm:text-[11px]">
        {stat.label}
      </p>
    </motion.div>
  );
}

export default function Stats() {
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: '-100px' });

  return (
    <section
      ref={sectionRef}
      aria-label="Studio statistics"
      className="py-20 md:py-28"
    >
      <motion.div
        initial={{ opacity: 0 }}
        animate={isInView ? { opacity: 1 } : { opacity: 0 }}
        transition={{ duration: 0.6 }}
        className="mx-auto max-w-6xl px-6 lg:px-8"
      >
        <div className="grid grid-cols-2 border-y border-ink/10 lg:grid-cols-4">
          {stats.map((stat, index) => (
            <StatCell key={stat.label} stat={stat} index={index} />
          ))}
        </div>
      </motion.div>
    </section>
  );
}
