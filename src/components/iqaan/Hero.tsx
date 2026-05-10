'use client';

import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { ArrowRight, Play, Code2, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';

/* ─── floating stat data ─── */
const floatingStats = [
  { value: '500+', label: 'Projects Delivered', icon: Code2, position: 'top-[15%] left-[8%]' },
  { value: '99.9%', label: 'Uptime Guaranteed', icon: Zap, position: 'top-[25%] right-[10%]' },
  { value: '24/7', label: 'Support Available', icon: Play, position: 'bottom-[20%] left-[12%]' },
];

/* ─── animation helpers ─── */
const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.18, duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94] },
  }),
};

const floatVariant = {
  hidden: { opacity: 0, scale: 0.7 },
  visible: (i: number) => ({
    opacity: 1,
    scale: 1,
    transition: { delay: 0.8 + i * 0.25, duration: 0.6, ease: 'easeOut' },
  }),
};

/* ─── component ─── */
export default function Hero() {
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: '-80px' });

  return (
    <section
      ref={sectionRef}
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
    >
      {/* ── background image ── */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: 'url(/images/hero-bg.png)' }}
        aria-hidden="true"
      />

      {/* ── dark gradient overlay ── */}
      <div
        className="absolute inset-0 bg-gradient-to-b from-black/90 via-black/70 to-transparent"
        aria-hidden="true"
      />

      {/* ── grid pattern overlay ── */}
      <div className="grid-bg absolute inset-0" aria-hidden="true" />

      {/* ── floating animated stats ── */}
      {floatingStats.map((stat, i) => {
        const Icon = stat.icon;
        return (
          <motion.div
            key={stat.label}
            custom={i}
            variants={floatVariant}
            initial="hidden"
            animate={isInView ? 'visible' : 'hidden'}
            className={`absolute hidden lg:flex items-center gap-3 rounded-full border border-white/10 bg-white/5 backdrop-blur-md px-5 py-3 shadow-lg ${stat.position}`}
            style={{
              animation: `float${i + 1} 6s ease-in-out infinite`,
              animationDelay: `${i * 2}s`,
            }}
          >
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-emerald-500/20">
              <Icon className="h-4 w-4 text-emerald-400" />
            </div>
            <div className="flex flex-col leading-tight">
              <span className="text-gradient text-lg font-bold tracking-tight">{stat.value}</span>
              <span className="text-[11px] text-white/50 font-medium">{stat.label}</span>
            </div>
          </motion.div>
        );
      })}

      {/* ── main content ── */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        {/* badge */}
        <motion.div custom={0} variants={fadeUp} initial="hidden" animate={isInView ? 'visible' : 'hidden'}>
          <span className="inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-4 py-1.5 text-sm font-medium text-emerald-400 backdrop-blur-sm">
            <Zap className="h-3.5 w-3.5" />
            Trusted by Industry Leaders Worldwide
          </span>
        </motion.div>

        {/* heading */}
        <motion.h1
          custom={1}
          variants={fadeUp}
          initial="hidden"
          animate={isInView ? 'visible' : 'hidden'}
          className="mx-auto mt-8 max-w-5xl text-4xl font-extrabold leading-[1.1] tracking-tight text-white md:text-5xl lg:text-6xl xl:text-7xl"
        >
          We Build{' '}
          <span className="text-gradient">Software</span>
          {' '}That Powers Tomorrow
        </motion.h1>

        {/* subheading */}
        <motion.p
          custom={2}
          variants={fadeUp}
          initial="hidden"
          animate={isInView ? 'visible' : 'hidden'}
          className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-white/60 sm:text-xl"
        >
          IQAAN delivers world-class custom software development, cutting-edge SaaS platforms,
          and premium product solutions that transform businesses and drive exponential growth.
        </motion.p>

        {/* CTA buttons */}
        <motion.div
          custom={3}
          variants={fadeUp}
          initial="hidden"
          animate={isInView ? 'visible' : 'hidden'}
          className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center"
        >
          <Button
            size="lg"
            className="group min-w-[200px] rounded-full bg-emerald-500 px-8 py-6 text-base font-semibold text-white shadow-lg shadow-emerald-500/25 transition-all hover:bg-emerald-400 hover:shadow-emerald-400/30 hover:scale-[1.03] active:scale-[0.98]"
          >
            Start Your Project
            <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Button>

          <Button
            variant="outline"
            size="lg"
            className="group min-w-[200px] rounded-full border-white/20 bg-transparent px-8 py-6 text-base font-semibold text-white backdrop-blur-sm transition-all hover:border-white/40 hover:bg-white/10 hover:scale-[1.03] active:scale-[0.98]"
          >
            <Play className="mr-2 h-4 w-4 text-emerald-400" />
            Explore Services
          </Button>
        </motion.div>

        {/* trust line */}
        <motion.p
          custom={4}
          variants={fadeUp}
          initial="hidden"
          animate={isInView ? 'visible' : 'hidden'}
          className="mt-8 flex items-center justify-center gap-4 text-sm text-white/30"
        >
          <span className="h-px w-12 bg-white/20" />
          No credit card required &middot; Free consultation
          <span className="h-px w-12 bg-white/20" />
        </motion.p>
      </div>

      {/* ── keyframe styles for floating animation ── */}
      <style jsx global>{`
        @keyframes float1 {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-14px); }
        }
        @keyframes float2 {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-18px); }
        }
        @keyframes float3 {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-12px); }
        }

        .text-gradient {
          background: linear-gradient(135deg, #34d399 0%, #6ee7b7 50%, #a7f3d0 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .grid-bg {
          background-size: 60px 60px;
          background-image:
            linear-gradient(to right, rgba(255, 255, 255, 0.03) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(255, 255, 255, 0.03) 1px, transparent 1px);
        }
      `}</style>
    </section>
  );
}
