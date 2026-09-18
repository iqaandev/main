'use client';

import {
  Twitter,
  Linkedin,
  Github,
  Mail,
  MapPin,
  Phone,
  ArrowRight,
} from 'lucide-react';
import { useLocale } from '@/i18n/LocaleProvider';

const socialLinks = [
  { icon: Twitter, href: '#', label: 'Twitter' },
  { icon: Linkedin, href: '#', label: 'LinkedIn' },
  { icon: Github, href: '#', label: 'GitHub' },
  { icon: Mail, href: 'mailto:hello@iqaan.com', label: 'Email' },
];

function GoldDiamond({ className = '' }: { className?: string }) {
  return (
    <span
      aria-hidden="true"
      className={`inline-block h-[8px] w-[8px] rotate-45 bg-gold ${className}`}
    />
  );
}

function BrandLockup() {
  const { locale, t } = useLocale();

  if (locale === 'ar') {
    /* Bilingual lockup — إيقان large in Amiri, IQAAN in mono beneath */
    return (
      <div className="space-y-3">
        <p lang="ar" className="font-serif text-4xl font-bold leading-none text-paper">
          إيقان
          <GoldDiamond className="ms-2 align-[0.1em]" />
        </p>
        <p dir="ltr" className="font-mono text-[11px] uppercase tracking-[0.3em] text-paper/50">
          {t.footer.brandLatin}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <p className="font-serif text-3xl font-light tracking-tight text-paper">
        IQAAN
        <GoldDiamond className="ms-1.5 align-[0.14em]" />
      </p>
      <p lang="ar" dir="rtl" className="font-serif text-lg leading-none text-gold-bright">
        إيقان
      </p>
    </div>
  );
}

export default function Footer() {
  const { t } = useLocale();

  return (
    <footer className="mt-auto bg-ink text-paper">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        {/* Main footer grid */}
        <div className="grid grid-cols-1 gap-12 py-16 sm:grid-cols-2 md:py-20 lg:grid-cols-[1.4fr_1fr_1fr_1.2fr] lg:gap-10">
          {/* Brand */}
          <div className="space-y-8">
            <BrandLockup />

            <p className="max-w-xs text-sm leading-relaxed text-paper/60">
              {t.footer.tagline}
            </p>

            {/* Social — quiet hairline circles */}
            <div className="flex items-center gap-3">
              {socialLinks.map(({ icon: Icon, href, label }) => (
                <a
                  key={label}
                  href={href}
                  aria-label={label}
                  className="flex h-9 w-9 items-center justify-center rounded-full border border-paper/25 text-paper/70 transition-colors duration-300 hover:border-gold hover:text-gold"
                >
                  <Icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Services */}
          <nav aria-label={t.footer.columns.services}>
            <h3 className="font-mono text-[10px] uppercase tracking-[0.25em] text-paper/45 sm:text-[11px]">
              {t.footer.columns.services}
            </h3>
            <ul className="mt-6 space-y-3.5">
              {t.footer.serviceLinks.map((link) => (
                <li key={link}>
                  <a
                    href="#services"
                    className="text-sm text-paper/65 transition-colors duration-300 hover:text-gold"
                  >
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          {/* Company */}
          <nav aria-label={t.footer.columns.company}>
            <h3 className="font-mono text-[10px] uppercase tracking-[0.25em] text-paper/45 sm:text-[11px]">
              {t.footer.columns.company}
            </h3>
            <ul className="mt-6 space-y-3.5">
              {t.footer.companyLinks.map((link) => (
                <li key={link}>
                  <a
                    href={
                      link === 'Developer Tools' || link === 'أدوات المطورين'
                        ? '/tools'
                        : '#studio'
                    }
                    className="text-sm text-paper/65 transition-colors duration-300 hover:text-gold"
                  >
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          {/* Contact + newsletter */}
          <div className="space-y-10">
            <div>
              <h3 className="font-mono text-[10px] uppercase tracking-[0.25em] text-paper/45 sm:text-[11px]">
                {t.footer.columns.contact}
              </h3>
              <ul className="mt-6 space-y-3.5">
                <li className="flex items-center gap-3 text-sm text-paper/65">
                  <Mail className="h-3.5 w-3.5 shrink-0 text-gold" />
                  <a
                    href="mailto:hello@iqaan.com"
                    dir="ltr"
                    className="transition-colors duration-300 hover:text-gold"
                  >
                    {t.footer.contact.email}
                  </a>
                </li>
                <li className="flex items-center gap-3 text-sm text-paper/65">
                  <Phone className="h-3.5 w-3.5 shrink-0 text-gold" />
                  <a
                    href="tel:+15551234567"
                    dir="ltr"
                    className="transition-colors duration-300 hover:text-gold"
                  >
                    {t.footer.contact.phone}
                  </a>
                </li>
                <li className="flex items-center gap-3 text-sm text-paper/65">
                  <MapPin className="h-3.5 w-3.5 shrink-0 text-gold" />
                  <span>{t.footer.contact.location}</span>
                </li>
              </ul>
            </div>

            {/* Newsletter */}
            <div>
              <label
                htmlFor="newsletter-email"
                className="font-mono text-[10px] uppercase tracking-[0.25em] text-paper/45 sm:text-[11px]"
              >
                {t.footer.newsletter}
              </label>
              <form
                className="mt-4 flex items-end gap-3"
                onSubmit={(e) => e.preventDefault()}
              >
                <input
                  id="newsletter-email"
                  type="email"
                  placeholder="your@email.com"
                  dir="ltr"
                  className="w-full border-b border-paper/25 bg-transparent py-2 text-sm text-paper outline-none transition-colors placeholder:text-paper/35 focus:border-gold"
                />
                <button
                  type="submit"
                  aria-label={t.footer.newsletterAria}
                  className="group flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-paper/25 text-paper/70 transition-colors duration-300 hover:border-gold hover:text-gold"
                >
                  <ArrowRight className="slide-x h-4 w-4 transition-[transform,color] duration-500" />
                </button>
              </form>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="flex flex-col items-center justify-between gap-4 border-t border-paper/15 py-7 font-mono text-[10px] uppercase tracking-[0.18em] text-paper/45 sm:flex-row sm:text-[11px]">
          <p>{t.footer.copyright}</p>
          <div className="flex flex-wrap items-center justify-center gap-6">
            {t.footer.bottomLinks.map((link) => (
              <a
                key={link}
                href="#"
                className="transition-colors duration-300 hover:text-gold"
              >
                {link}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
