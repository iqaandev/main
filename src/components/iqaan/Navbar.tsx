'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetClose,
} from '@/components/ui/sheet';
import { Menu, X, ArrowRight } from 'lucide-react';

const navLinks = [
  { label: 'Services', href: '#services' },
  { label: 'Products', href: '#products' },
  { label: 'About', href: '#about' },
  { label: 'Process', href: '#process' },
];

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

  const handleMobileClose = () => {
    setMobileOpen(false);
  };

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ease-out ${
        scrolled
          ? 'bg-background/80 backdrop-blur-xl border-b border-border/50 shadow-lg shadow-black/5'
          : 'bg-transparent'
      }`}
    >
      <nav className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 sm:h-20 items-center justify-between">
          {/* Logo */}
          <motion.a
            href="#"
            onClick={(e) => {
              e.preventDefault();
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="flex items-center gap-0 group"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <span className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-emerald-400 via-emerald-500 to-emerald-600 bg-clip-text text-transparent tracking-tight">
              IQAAN
            </span>
            <span className="text-2xl sm:text-3xl font-light text-muted-foreground tracking-tight">
              .com
            </span>
          </motion.a>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-1">
            <AnimatePresence>
              {navLinks.map((link, index) => (
                <motion.a
                  key={link.label}
                  href={link.href}
                  onClick={(e) => handleNavClick(e, link.href)}
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.1 + index * 0.05 }}
                  className="relative px-4 py-2 text-sm font-medium text-muted-foreground transition-colors duration-300 hover:text-primary rounded-lg group"
                >
                  {link.label}
                  <span className="absolute bottom-0 left-1/2 -translate-x-1/2 h-0.5 w-0 bg-primary rounded-full transition-all duration-300 group-hover:w-6" />
                </motion.a>
              ))}
            </AnimatePresence>

            {/* Desktop CTA */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4, delay: 0.4 }}
              className="ml-4"
            >
              <Button
                size="default"
                className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold px-6 py-2 rounded-full shadow-lg shadow-primary/25 hover:shadow-primary/40 transition-all duration-300 hover:scale-105 active:scale-95 cursor-pointer"
              >
                Get Started
                <ArrowRight className="ml-2 h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5" />
              </Button>
            </motion.div>
          </div>

          {/* Mobile Hamburger */}
          <div className="flex md:hidden items-center">
            <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
              <SheetTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="relative text-muted-foreground hover:text-primary transition-colors duration-300 rounded-lg cursor-pointer"
                  aria-label="Open navigation menu"
                >
                  <motion.div
                    whileHover={{ rotate: 90 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Menu className="h-6 w-6" />
                  </motion.div>
                </Button>
              </SheetTrigger>

              <SheetContent
                side="right"
                className="w-[300px] sm:w-[360px] bg-background/95 backdrop-blur-xl border-l border-border/50 p-0"
              >
                {/* Mobile Sheet Header */}
                <div className="flex items-center justify-between p-6 border-b border-border/50">
                  <span className="text-xl font-bold bg-gradient-to-r from-emerald-400 via-emerald-500 to-emerald-600 bg-clip-text text-transparent">
                    IQAAN
                    <span className="font-light text-muted-foreground">.com</span>
                  </span>
                  <SheetClose asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="rounded-lg text-muted-foreground hover:text-primary transition-colors cursor-pointer"
                      aria-label="Close navigation menu"
                    >
                      <X className="h-5 w-5" />
                    </Button>
                  </SheetClose>
                </div>

                {/* Mobile Nav Links */}
                <div className="flex flex-col p-6 gap-2">
                  {navLinks.map((link, index) => (
                    <motion.a
                      key={link.label}
                      href={link.href}
                      onClick={(e) => handleNavClick(e, link.href)}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3, delay: 0.05 + index * 0.07 }}
                      className="flex items-center justify-between px-4 py-3.5 text-base font-medium text-muted-foreground hover:text-primary hover:bg-primary/5 rounded-xl transition-all duration-300 group"
                    >
                      {link.label}
                      <ArrowRight className="h-4 w-4 opacity-0 -translate-x-2 transition-all duration-300 group-hover:opacity-100 group-hover:translate-x-0" />
                    </motion.a>
                  ))}

                  {/* Mobile CTA */}
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: 0.35 }}
                    className="mt-4 pt-4 border-t border-border/50"
                  >
                    <Button
                      size="lg"
                      className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold rounded-xl shadow-lg shadow-primary/25 hover:shadow-primary/40 transition-all duration-300 cursor-pointer"
                      onClick={handleMobileClose}
                    >
                      Get Started
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </motion.div>
                </div>

                {/* Mobile Footer */}
                <div className="absolute bottom-0 left-0 right-0 p-6 border-t border-border/50">
                  <p className="text-xs text-muted-foreground/60 text-center">
                    &copy; {new Date().getFullYear()} IQAAN.com &mdash; All rights reserved.
                  </p>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </nav>
    </motion.header>
  );
}
