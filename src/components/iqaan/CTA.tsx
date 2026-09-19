'use client';

import { useRef, useState } from 'react';
import { motion, useInView, Variants } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { ArrowRight, LoaderCircle } from 'lucide-react';
import { useLocale } from '@/i18n/LocaleProvider';
import { submitToWeb3Forms } from '@/lib/forms';

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

const reveal: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.1, duration: 0.85, ease: EASE },
  }),
};

/* minimal underlined fields — mono labels, hairline rules, quiet focus */
const fieldClass =
  'h-11 rounded-none border-0 border-b border-ink/25 bg-transparent px-0 shadow-none rounded-t-none text-base text-ink placeholder:text-ink/35 focus-visible:border-ink focus-visible:ring-0 focus-visible:ring-offset-0 md:text-sm';

const labelClass =
  'font-mono text-[10px] uppercase tracking-[0.2em] text-ink/55 sm:text-[11px]';

export default function CTA() {
  const { t, locale } = useLocale();
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: '-100px' });

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    message: '',
  });
  const [status, setStatus] = useState<
    'idle' | 'sending' | 'success' | 'error'
  >('idle');
  const isSubmitting = status === 'sending';

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setStatus('idle');
    setFormData((prev) => ({
      ...prev,
      [e.target.id]: e.target.value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (isSubmitting) return;
    setStatus('sending');

    const delivered = await submitToWeb3Forms({
      subject: 'New project inquiry — iqaan.com',
      from_name: 'IQAAN Website',
      name: formData.name,
      email: formData.email,
      company: formData.company || '—',
      message: formData.message,
      locale,
    });

    if (delivered) {
      setFormData({ name: '', email: '', company: '', message: '' });
      setStatus('success');
    } else {
      setStatus('error');
    }
  };

  const heading = t.cta.heading;

  return (
    <section
      id="contact"
      ref={sectionRef}
      aria-label={t.cta.ariaLabel}
      className="scroll-mt-20 border-t border-ink/10 py-24 md:py-32"
    >
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        {/* Statement */}
        <motion.div
          custom={0}
          variants={reveal}
          initial="hidden"
          animate={isInView ? 'visible' : 'hidden'}
          className="max-w-3xl"
        >
          <p className="font-mono text-[11px] uppercase tracking-[0.25em] text-ink/50">
            {t.cta.eyebrow}
          </p>
          <h2 className="mt-6 text-balance font-serif text-4xl font-light leading-[1.05] tracking-tight text-ink sm:text-5xl lg:text-6xl">
            {heading.lead}
            <em className="italic text-viridian">{heading.accent}</em>
            {heading.tail}
          </h2>
          <p className="mt-6 max-w-xl text-sm leading-relaxed text-ink/60 sm:text-base">
            {t.cta.sub}
          </p>
        </motion.div>

        {/* Form */}
        <motion.div
          custom={1}
          variants={reveal}
          initial="hidden"
          animate={isInView ? 'visible' : 'hidden'}
          className="mt-16 max-w-2xl md:mt-20"
        >
          <h3 className="font-serif text-2xl font-normal tracking-tight text-ink sm:text-3xl">
            {t.cta.formHeading}
          </h3>
          <p className="mt-2 font-mono text-[10px] uppercase tracking-[0.2em] text-ink/45 sm:text-[11px]">
            {t.cta.formNote}
          </p>

          <form onSubmit={handleSubmit} className="mt-10 space-y-10">
            {/* Honeypot — hidden from humans, catches bots (Web3Forms) */}
            <input
              type="checkbox"
              name="botcheck"
              tabIndex={-1}
              autoComplete="off"
              className="hidden"
              aria-hidden="true"
            />
            <div className="grid gap-10 sm:grid-cols-2">
              <div className="space-y-2.5">
                <Label htmlFor="name" className={labelClass}>
                  {t.cta.labels.name}
                </Label>
                <Input
                  id="name"
                  type="text"
                  placeholder={t.cta.placeholders.name}
                  required
                  autoComplete="name"
                  value={formData.name}
                  onChange={handleChange}
                  className={fieldClass}
                />
              </div>

              <div className="space-y-2.5">
                <Label htmlFor="email" className={labelClass}>
                  {t.cta.labels.email}
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder={t.cta.placeholders.email}
                  required
                  autoComplete="email"
                  dir="ltr"
                  value={formData.email}
                  onChange={handleChange}
                  className={`${fieldClass} text-start`}
                />
              </div>
            </div>

            <div className="space-y-2.5">
              <Label htmlFor="company" className={labelClass}>
                {t.cta.labels.company}
              </Label>
              <Input
                id="company"
                type="text"
                placeholder={t.cta.placeholders.company}
                autoComplete="organization"
                value={formData.company}
                onChange={handleChange}
                className={fieldClass}
              />
            </div>

            <div className="space-y-2.5">
              <Label htmlFor="message" className={labelClass}>
                {t.cta.labels.message}
              </Label>
              <Textarea
                id="message"
                placeholder={t.cta.placeholders.message}
                required
                rows={4}
                value={formData.message}
                onChange={handleChange}
                className="min-h-[110px] resize-none rounded-none border-0 border-b border-ink/25 bg-transparent px-0 py-2 text-base shadow-none placeholder:text-ink/35 focus-visible:border-ink focus-visible:ring-0 md:text-sm"
              />
            </div>

            <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
              <Button
                type="submit"
                disabled={isSubmitting}
                size="lg"
                className="cursor-pointer rounded-full bg-viridian px-8 font-normal text-paper transition-colors duration-300 hover:bg-ink disabled:opacity-60"
              >
                {isSubmitting ? (
                  <>
                    {t.cta.sending}
                    <LoaderCircle className="h-4 w-4 animate-spin" />
                  </>
                ) : (
                  <>
                    {t.cta.submit}
                    <ArrowRight className="h-4 w-4 rtl:-scale-x-100" />
                  </>
                )}
              </Button>

              {status === 'success' && (
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.6 }}
                  className="font-mono text-[11px] uppercase tracking-[0.15em] text-viridian"
                  role="status"
                >
                  {t.cta.success}
                </motion.p>
              )}
              {status === 'error' && (
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.6 }}
                  role="alert"
                  className="font-mono text-[11px] uppercase tracking-[0.15em] text-destructive"
                >
                  {t.cta.error}{' '}
                  <a
                    href="mailto:hello@iqaan.com"
                    className="underline underline-offset-4 hover:text-ink"
                  >
                    {t.cta.errorDirect}
                  </a>
                </motion.p>
              )}
            </div>
          </form>
        </motion.div>
      </div>
    </section>
  );
}
