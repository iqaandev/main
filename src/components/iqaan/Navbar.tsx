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
import { useLocale } from '@/i18n/LocaleProvider';

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

function GoldDiamond({ className = '' }: { className?: string }) {
  return (
    <span
      aria-hidden="true"
      className={`inline-block h-[7px] w-[7px] rotate-45 bg-gold ${className}`}
    />
  );
}

function Wordmark({ className = '' }: { className?: string }) {
  const { locale } = useLocale();

  if (locale === 'ar') {
    return (
      <span
        lang="ar"
        className={`font-serif text-[28px] font-bold leading-none text-ink ${className}`}
      >
        إيقان
        <GoldDiamond className="ms-1.5 align-[0.1em]" />
      </span>
    );
  }

  return (
    <span className={`font-serif text-2xl font-light tracking-tight text-ink ${className}`}>
      IQAAN
      <GoldDiamond className="ms-1.5 align-[0.14em]" />
    </span>
  );
}

function LocaleToggle({
  className = '',
  onDark = false,
}: {
  className?: string;
  onDark?: boolean;
}) {
  const { t, locale, toggleLocale } = useLocale();

  return (
    <button
      type="button"
      onClick={toggleLocale}
      aria-label={t.nav.toggleAria}
      className={`group flex items-center gap-2 py-2 font-mono text-[11px] uppercase tracking-[0.18em] transition-colors duration-300 ${
        onDark
          ? 'text-paper/70 hover:text-paper'
          : 'text-ink/60 hover:text-ink'
      } ${className}`}
    >
      <GoldDiamond className="h-[5px] w-[5px] opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
      <span lang={locale === 'en' ? 'ar' : undefined}>{t.nav.toggle}</span>
      <span
        aria-hidden="true"
        className={`h-px w-4 transition-all duration-500 group-hover:w-6 group-hover:bg-gold ${
          onDark ? 'bg-paper/30' : 'bg-ink/30'
        }`}
      />
    </button>
  );
}

export default function Navbar() {
  const { t, dir } = useLocale();
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
    // Real routes (e.g. /tools) navigate normally; in-page anchors smooth-scroll.
    if (href.startsWith('/')) {
      setMobileOpen(false);
      return;
    }
    e.preventDefault();
    const target = document.querySelector(href);
    if (target) {
      target.scrollIntoView({ behavior: 'smooth' });
    }
    setMobileOpen(false);
  };

  const goToContact = () => {
    document
      .querySelector('#contact')
      ?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <motion.header
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.7, ease: EASE }}
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-500 ${
        scrolled
          ? 'border-b border-ink/10 bg-paper/90 backdrop-blur-md'
          : 'border-b border-transparent bg-transparent'
      }`}
    >
      <nav
        aria-label={t.nav.ariaPrimary}
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
            aria-label={t.nav.ariaBackToTop}
          >
            <Wordmark />
          </a>

          {/* Desktop navigation */}
          <div className="hidden items-center gap-8 md:flex">
            {t.nav.links.map((link) => (
              <a
                key={link.label}
                href={link.href}
                onClick={(e) => handleNavClick(e, link.href)}
                className="group relative py-2 font-mono text-[11px] uppercase tracking-[0.18em] text-ink/60 transition-colors duration-300 hover:text-ink"
              >
                {link.label}
                <span
                  aria-hidden="true"
                  className="absolute -bottom-0.5 start-0 h-px w-0 bg-gold transition-all duration-500 group-hover:w-full"
                />
              </a>
            ))}

            <LocaleToggle className="ms-2" />

            <Button
              size="default"
              className="ms-2 cursor-pointer rounded-full bg-ink px-5 font-normal text-paper transition-colors duration-300 hover:bg-viridian"
              onClick={goToContact}
            >
              {t.nav.cta}
              <ArrowRight className="h-3.5 w-3.5 rtl:-scale-x-100" />
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
                  aria-label={t.nav.ariaOpen}
                >
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>

              <SheetContent
                side={dir === 'rtl' ? 'left' : 'right'}
                className={`w-[320px] border-paper/10 bg-ink p-0 text-paper sm:w-[360px] ${
                  dir === 'rtl' ? 'border-r' : 'border-l'
                }`}
              >
                <SheetTitle className="sr-only">{t.nav.ariaMenuTitle}</SheetTitle>

                <div className="flex items-center justify-between border-b border-paper/10 px-8 py-6">
                  <Wordmark className="text-paper" />
                </div>

                <nav aria-label={t.nav.ariaMobile} className="flex h-full flex-col px-8 py-10">
                  <ul className="space-y-2">
                    {t.nav.links.map((link, i) => (
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
                            {String(i + 1).padStart(2, '0')}
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
                        goToContact();
                      }}
                    >
                      {t.nav.cta}
                      <ArrowRight className="h-4 w-4 rtl:-scale-x-100" />
                    </Button>
                    <div className="mt-6 flex justify-center">
                      <LocaleToggle onDark />
                    </div>
                    <p className="mt-5 text-center font-mono text-[10px] uppercase tracking-[0.2em] text-paper/40">
                      {t.nav.menuTagline}
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
