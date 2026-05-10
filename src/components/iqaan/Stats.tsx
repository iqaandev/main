'use client';

import { useEffect, useRef, useState } from 'react';
import { motion, useInView } from 'framer-motion';
import { FolderCheck, Globe, Shield, Users } from 'lucide-react';

interface StatItem {
  icon: React.ReactNode;
  value: number;
  suffix: string;
  label: string;
  decimals: number;
}

const stats: StatItem[] = [
  {
    icon: <FolderCheck className="h-6 w-6 text-primary" />,
    value: 500,
    suffix: '+',
    label: 'Projects Delivered',
    decimals: 0,
  },
  {
    icon: <Globe className="h-6 w-6 text-primary" />,
    value: 200,
    suffix: '+',
    label: 'Global Clients',
    decimals: 0,
  },
  {
    icon: <Shield className="h-6 w-6 text-primary" />,
    value: 99.9,
    suffix: '%',
    label: 'Uptime Guarantee',
    decimals: 1,
  },
  {
    icon: <Users className="h-6 w-6 text-primary" />,
    value: 50,
    suffix: '+',
    label: 'Expert Engineers',
    decimals: 0,
  },
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

      // ease-out cubic
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

function StatCard({
  stat,
  index,
  isLast,
}: {
  stat: StatItem;
  index: number;
  isLast: boolean;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-50px' });
  const count = useCountUp(stat.value, isInView, 2000, stat.decimals);

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
      transition={{ duration: 0.6, delay: index * 0.15, ease: 'easeOut' }}
      className={`flex flex-col items-center gap-3 text-center px-4 py-4 ${
        !isLast ? 'border-r border-border/30' : ''
      }`}
    >
      <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
        {stat.icon}
      </div>

      <span className="text-4xl md:text-5xl lg:text-6xl font-bold bg-gradient-to-r from-primary via-primary/80 to-primary/60 bg-clip-text text-transparent">
        {count}
        {stat.suffix}
      </span>

      <span className="text-muted-foreground text-sm md:text-base uppercase tracking-wider">
        {stat.label}
      </span>
    </motion.div>
  );
}

export default function Stats() {
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: '-100px' });

  return (
    <section
      ref={sectionRef}
      className="w-full py-16 md:py-20 bg-gradient-to-r from-background via-card to-background"
    >
      <motion.div
        initial={{ opacity: 0 }}
        animate={isInView ? { opacity: 1 } : { opacity: 0 }}
        transition={{ duration: 0.5 }}
        className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8"
      >
        <div className="grid grid-cols-2 lg:grid-cols-4">
          {stats.map((stat, index) => (
            <StatCard
              key={stat.label}
              stat={stat}
              index={index}
              isLast={index === stats.length - 1}
            />
          ))}
        </div>
      </motion.div>
    </section>
  );
}
