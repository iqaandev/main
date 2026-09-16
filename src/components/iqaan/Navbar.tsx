'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetTitle,
} from '@/components/ui/sheet';
import { Menu, ArrowRight } from 'lucide-react';

const navLinks = [
  { label: 'Services', href: '#services', index: '01' },
  { label: 'Products', href: '#products', index: '02' },
  { label: 'Studio', href: '#studio', index: '03' },
  { label: 'Process', href: '#process', index: '04' },
];

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

function Wordmark({ className = '' }: { className?: string }) {
  return (
    <span className={`font-serif text-2xl font-light tracking-tight text-ink ${className}`}>
      IQAAN
      <span
        aria-hidden="true"
        className="ml-1.5 inline-block h-[7px] w-[7px] rotate-45 bg-gold align-[0.14em]"
      />
    </span>
  );
}

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    const target = document.querySelector(href);
    if (target) {
      target.scrollIntoView({ behavior: 'smooth' });
    }
    setMobileOpen(false);
  };

  return (
    <motion.header
      initial={{ y: -40, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.8, ease: EASE }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled
          ? 'border-b border-ink/10 bg-paper/90 backdrop-blur-md'
          : 'border-b border-transparent bg-transparent'
      }`}
    >
      <nav
        aria-label="Primary"
        className="mx-auto max-w-7xl px-6 lg:px-8"
      >
        <div className="flex h-16 items-center justify-between sm:h-20">
          {/* Wordmark */}
          <a
            href="#top"
            onClick={(e) => {
              e.preventDefault();
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="transition-opacity hover:opacity-70"
            aria-label="IQAAN — back to top"
          >
            <Wordmark />
          </a>

          {/* Desktop navigation */}
          <div className="hidden items-center gap-8 md:flex">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                onClick={(e) => handleNavClick(e, link.href)}
                className="group relative py-2 font-mono text-[11px] uppercase tracking-[0.18em] text-ink/60 transition-colors duration-300 hover:text-ink"
              >
                {link.label}
                <span
                  aria-hidden="true"
                  className="absolute -bottom-0.5 left-0 h-px w-0 bg-gold transition-all duration-500 group-hover:w-full"
                />
              </a>
            ))}

            <Button
              size="default"
              className="ml-2 cursor-pointer rounded-full bg-ink px-5 font-normal text-paper transition-colors duration-300 hover:bg-viridian"
              onClick={() => {
                document
                  .querySelector('#contact')
                  ?.scrollIntoView({ behavior: 'smooth' });
              }}
            >
              Start a project
              <ArrowRight className="h-3.5 w-3.5" />
            </Button>
          </div>

          {/* Mobile menu */}
          <div className="flex md:hidden">
            <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
              <SheetTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-ink hover:bg-ink/5"
                  aria-label="Open navigation menu"
                >
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>

              <SheetContent
                side="right"
                className="flex w-[320px] flex-col border-l border-paper/10 bg-ink p-0 text-paper sm:w-[360px]"
              >
                <SheetTitle className="sr-only">Navigation menu</SheetTitle>

                <div className="flex items-center justify-between border-b border-paper/10 px-8 py-6">
                  <Wordmark className="text-paper" />
                </div>

                <nav aria-label="Mobile" className="flex flex-1 flex-col px-8 py-10">
                  <ul className="space-y-2">
                    {navLinks.map((link, i) => (
                      <motion.li
                        key={link.label}
                        initial={{ opacity: 0, y: 16 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.1 + i * 0.08, ease: EASE }}
                      >
                        <a
                          href={link.href}
                          onClick={(e) => handleNavClick(e, link.href)}
                          className="group flex items-baseline gap-5 border-b border-paper/10 py-5"
                        >
                          <span className="font-mono text-[11px] tracking-[0.2em] text-gold">
                            {link.index}
                          </span>
                          <span className="font-serif text-3xl font-light tracking-tight text-paper transition-colors group-hover:text-gold">
                            {link.label}
                          </span>
                        </a>
                      </motion.li>
                    ))}
                  </ul>

                  <motion.div
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.45, ease: EASE }}
                    className="mt-auto pt-10"
                  >
                    <Button
                      size="lg"
                      className="w-full cursor-pointer rounded-full bg-paper font-normal text-ink hover:bg-gold"
                      onClick={() => {
                        setMobileOpen(false);
                        document
                          .querySelector('#contact')
                          ?.scrollIntoView({ behavior: 'smooth' });
                      }}
                    >
                      Start a project
                      <ArrowRight className="h-4 w-4" />
                    </Button>
                    <p className="mt-6 text-center font-mono text-[10px] uppercase tracking-[0.2em] text-paper/40">
                      Software, built with conviction
                    </p>
                  </motion.div>
                </nav>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </nav>
    </motion.header>
  );
}
