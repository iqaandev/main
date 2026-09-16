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

const socialLinks = [
  { icon: Twitter, href: '#', label: 'Twitter' },
  { icon: Linkedin, href: '#', label: 'LinkedIn' },
  { icon: Github, href: '#', label: 'GitHub' },
  { icon: Mail, href: 'mailto:hello@iqaan.com', label: 'Email' },
];

const serviceLinks = [
  'Custom Development',
  'SaaS Solutions',
  'Product Engineering',
  'Cloud Services',
  'Consulting',
];

const companyLinks = [
  'About Us',
  'Careers',
  'Blog',
  'Case Studies',
  'Contact',
];

const bottomLinks = ['Privacy Policy', 'Terms of Service', 'Cookie Policy'];

export default function Footer() {
  return (
    <footer className="mt-auto bg-ink text-paper">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        {/* Main footer grid */}
        <div className="grid grid-cols-1 gap-12 py-16 sm:grid-cols-2 md:py-20 lg:grid-cols-[1.4fr_1fr_1fr_1.2fr] lg:gap-10">
          {/* Brand */}
          <div className="space-y-8">
            <div>
              <p className="font-serif text-3xl font-light tracking-tight text-paper">
                IQAAN
                <span
                  aria-hidden="true"
                  className="ml-1.5 inline-block h-[8px] w-[8px] rotate-45 bg-gold align-[0.14em]"
                />
              </p>
              <p lang="ar" dir="rtl" className="mt-3 text-lg text-gold-bright">
                إيقان
              </p>
            </div>

            <p className="max-w-xs text-sm leading-relaxed text-paper/60">
              Software, built with conviction.
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
          <nav aria-label="Services">
            <h3 className="font-mono text-[10px] uppercase tracking-[0.25em] text-paper/45 sm:text-[11px]">
              Services
            </h3>
            <ul className="mt-6 space-y-3.5">
              {serviceLinks.map((link) => (
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
          <nav aria-label="Company">
            <h3 className="font-mono text-[10px] uppercase tracking-[0.25em] text-paper/45 sm:text-[11px]">
              Company
            </h3>
            <ul className="mt-6 space-y-3.5">
              {companyLinks.map((link) => (
                <li key={link}>
                  <a
                    href="#studio"
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
                Contact
              </h3>
              <ul className="mt-6 space-y-3.5">
                <li className="flex items-center gap-3 text-sm text-paper/65">
                  <Mail className="h-3.5 w-3.5 shrink-0 text-gold" />
                  <a
                    href="mailto:hello@iqaan.com"
                    className="transition-colors duration-300 hover:text-gold"
                  >
                    hello@iqaan.com
                  </a>
                </li>
                <li className="flex items-center gap-3 text-sm text-paper/65">
                  <Phone className="h-3.5 w-3.5 shrink-0 text-gold" />
                  <a
                    href="tel:+15551234567"
                    className="transition-colors duration-300 hover:text-gold"
                  >
                    +1 (555) 123-4567
                  </a>
                </li>
                <li className="flex items-center gap-3 text-sm text-paper/65">
                  <MapPin className="h-3.5 w-3.5 shrink-0 text-gold" />
                  <span>San Francisco, CA</span>
                </li>
              </ul>
            </div>

            {/* Newsletter */}
            <div>
              <label
                htmlFor="newsletter-email"
                className="font-mono text-[10px] uppercase tracking-[0.25em] text-paper/45 sm:text-[11px]"
              >
                Newsletter
              </label>
              <form
                className="mt-4 flex items-end gap-3"
                onSubmit={(e) => e.preventDefault()}
              >
                <input
                  id="newsletter-email"
                  type="email"
                  placeholder="your@email.com"
                  className="w-full border-b border-paper/25 bg-transparent py-2 text-sm text-paper outline-none transition-colors placeholder:text-paper/35 focus:border-gold"
                />
                <button
                  type="submit"
                  aria-label="Subscribe to newsletter"
                  className="group flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-paper/25 text-paper/70 transition-colors duration-300 hover:border-gold hover:text-gold"
                >
                  <ArrowRight className="h-4 w-4 transition-transform duration-500 group-hover:translate-x-0.5" />
                </button>
              </form>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="flex flex-col items-center justify-between gap-4 border-t border-paper/15 py-7 font-mono text-[10px] uppercase tracking-[0.18em] text-paper/45 sm:flex-row sm:text-[11px]">
          <p>&copy; 2026 IQAAN — All rights reserved</p>
          <div className="flex items-center gap-6">
            {bottomLinks.map((link) => (
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
