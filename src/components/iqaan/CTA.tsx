'use client';

import { useRef, useState } from 'react';
import { motion, useInView, Variants } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { ArrowRight, LoaderCircle } from 'lucide-react';

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
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: '-100px' });

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    message: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setSubmitted(false);
    setFormData((prev) => ({
      ...prev,
      [e.target.id]: e.target.value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate form submission
    await new Promise((resolve) => setTimeout(resolve, 1500));

    setIsSubmitting(false);
    setFormData({ name: '', email: '', company: '', message: '' });
    setSubmitted(true);
  };

  return (
    <section
      id="contact"
      ref={sectionRef}
      aria-label="Contact"
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
            06 — Start
          </p>
          <h2 className="mt-6 text-balance font-serif text-4xl font-light leading-[1.05] tracking-tight text-ink sm:text-5xl lg:text-6xl">
            Let&rsquo;s build something{' '}
            <em className="italic text-viridian">worth believing in</em>.
          </h2>
          <p className="mt-6 max-w-xl text-sm leading-relaxed text-ink/60 sm:text-base">
            Tell us what you&rsquo;re building. The first consultation is free,
            and we reply to every message.
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
            Send a message
          </h3>
          <p className="mt-2 font-mono text-[10px] uppercase tracking-[0.2em] text-ink/45 sm:text-[11px]">
            We reply within 24 hours
          </p>

          <form onSubmit={handleSubmit} className="mt-10 space-y-10">
            <div className="grid gap-10 sm:grid-cols-2">
              <div className="space-y-2.5">
                <Label htmlFor="name" className={labelClass}>
                  Name
                </Label>
                <Input
                  id="name"
                  type="text"
                  placeholder="Jane Cooper"
                  required
                  autoComplete="name"
                  value={formData.name}
                  onChange={handleChange}
                  className={fieldClass}
                />
              </div>

              <div className="space-y-2.5">
                <Label htmlFor="email" className={labelClass}>
                  Email
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="jane@company.com"
                  required
                  autoComplete="email"
                  value={formData.email}
                  onChange={handleChange}
                  className={fieldClass}
                />
              </div>
            </div>

            <div className="space-y-2.5">
              <Label htmlFor="company" className={labelClass}>
                Company
              </Label>
              <Input
                id="company"
                type="text"
                placeholder="Company Inc."
                autoComplete="organization"
                value={formData.company}
                onChange={handleChange}
                className={fieldClass}
              />
            </div>

            <div className="space-y-2.5">
              <Label htmlFor="message" className={labelClass}>
                Message
              </Label>
              <Textarea
                id="message"
                placeholder="What are you building, and when does it need to ship?"
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
                    Sending
                    <LoaderCircle className="h-4 w-4 animate-spin" />
                  </>
                ) : (
                  <>
                    Send message
                    <ArrowRight className="h-4 w-4" />
                  </>
                )}
              </Button>

              {submitted && (
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.6 }}
                  className="font-mono text-[11px] uppercase tracking-[0.15em] text-viridian"
                  role="status"
                >
                  Thank you — we&rsquo;ll be in touch within 24 hours.
                </motion.p>
              )}
            </div>
          </form>
        </motion.div>
      </div>
    </section>
  );
}
