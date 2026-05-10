'use client';

import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
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
    <footer className="bg-card/50 border-t border-border/50 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Footer Grid */}
        <div className="py-12 md:py-16 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-12">
          {/* Column 1 - Brand */}
          <div className="space-y-6">
            {/* Logo */}
            <div className="text-2xl font-bold tracking-tight">
              <span className="bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                IQAAN
              </span>
              <span className="text-muted-foreground">.com</span>
            </div>

            {/* Tagline */}
            <p className="text-muted-foreground text-sm leading-relaxed max-w-xs">
              Building tomorrow&apos;s software, today.
            </p>

            {/* Social Icons */}
            <div className="flex items-center gap-3">
              {socialLinks.map(({ icon: Icon, href, label }) => (
                <a
                  key={label}
                  href={href}
                  aria-label={label}
                  className="w-9 h-9 rounded-full bg-secondary hover:bg-primary/20 hover:text-primary flex items-center justify-center transition-all"
                >
                  <Icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Column 2 - Services */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider mb-4">
              Services
            </h3>
            <ul className="space-y-3">
              {serviceLinks.map((link) => (
                <li key={link}>
                  <a
                    href="#"
                    className="text-muted-foreground text-sm hover:text-primary transition-colors"
                  >
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3 - Company */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider mb-4">
              Company
            </h3>
            <ul className="space-y-3">
              {companyLinks.map((link) => (
                <li key={link}>
                  <a
                    href="#"
                    className="text-muted-foreground text-sm hover:text-primary transition-colors"
                  >
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 4 - Contact */}
          <div className="space-y-6">
            <h3 className="text-sm font-semibold uppercase tracking-wider">
              Get in Touch
            </h3>

            <ul className="space-y-3">
              <li className="flex items-center gap-3 text-muted-foreground text-sm">
                <Mail className="w-4 h-4 shrink-0 text-primary/70" />
                <a
                  href="mailto:hello@iqaan.com"
                  className="hover:text-primary transition-colors"
                >
                  hello@iqaan.com
                </a>
              </li>
              <li className="flex items-center gap-3 text-muted-foreground text-sm">
                <Phone className="w-4 h-4 shrink-0 text-primary/70" />
                <a
                  href="tel:+15551234567"
                  className="hover:text-primary transition-colors"
                >
                  +1 (555) 123-4567
                </a>
              </li>
              <li className="flex items-start gap-3 text-muted-foreground text-sm">
                <MapPin className="w-4 h-4 shrink-0 text-primary/70 mt-0.5" />
                <span>San Francisco, CA</span>
              </li>
            </ul>

            {/* Newsletter Signup */}
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">
                Subscribe to our newsletter
              </p>
              <div className="flex gap-2">
                <Input
                  type="email"
                  placeholder="your@email.com"
                  className="bg-background border border-border rounded-lg h-9 text-sm placeholder:text-muted-foreground/60"
                />
                <Button
                  size="sm"
                  className="h-9 px-3 shrink-0 rounded-lg"
                >
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-border/50 py-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">
          <p>&copy; 2025 IQAAN.com. All rights reserved.</p>
          <div className="flex items-center gap-4">
            {bottomLinks.map((link) => (
              <a
                key={link}
                href="#"
                className="hover:text-primary transition-colors"
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
