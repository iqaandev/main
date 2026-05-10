'use client';

import { useRef, useState } from 'react';
import { motion, useInView } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { ArrowRight, Send, MessageSquare } from 'lucide-react';

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

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
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
  };

  return (
    <section
      id="contact"
      ref={sectionRef}
      className="relative overflow-hidden py-20 md:py-32"
    >
      {/* Background gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-background to-primary/5" />

      {/* Decorative gradient orbs */}
      <motion.div
        className="pointer-events-none absolute -left-32 top-20 h-96 w-96 rounded-full bg-primary/20 blur-3xl"
        initial={{ opacity: 0, scale: 0.5 }}
        animate={isInView ? { opacity: 1, scale: 1 } : {}}
        transition={{ duration: 1.2, ease: 'easeOut' }}
      />
      <motion.div
        className="pointer-events-none absolute -right-32 top-40 h-80 w-80 rounded-full bg-emerald-500/15 blur-3xl"
        initial={{ opacity: 0, scale: 0.5 }}
        animate={isInView ? { opacity: 1, scale: 1 } : {}}
        transition={{ duration: 1.2, ease: 'easeOut', delay: 0.2 }}
      />
      <motion.div
        className="pointer-events-none absolute -bottom-24 left-1/2 h-72 w-72 -translate-x-1/2 rounded-full bg-primary/15 blur-3xl"
        initial={{ opacity: 0, scale: 0.5 }}
        animate={isInView ? { opacity: 1, scale: 1 } : {}}
        transition={{ duration: 1.2, ease: 'easeOut', delay: 0.4 }}
      />

      <div className="relative z-10 mx-auto max-w-4xl px-4 sm:px-6">
        {/* Hero CTA Block */}
        <div className="mb-16 text-center md:mb-20">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, ease: 'easeOut' }}
          >
            <span className="mb-4 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-4 py-1.5 text-sm font-medium text-primary">
              <MessageSquare className="h-4 w-4" />
              Get in Touch
            </span>
          </motion.div>

          <motion.h2
            className="mt-6 text-3xl font-bold leading-tight tracking-tight md:text-4xl lg:text-5xl"
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, ease: 'easeOut', delay: 0.1 }}
          >
            Ready to Build Something{' '}
            <span className="bg-gradient-to-r from-primary to-emerald-400 bg-clip-text text-transparent">
              Extraordinary
            </span>
            ?
          </motion.h2>

          <motion.p
            className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground md:text-xl"
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, ease: 'easeOut', delay: 0.2 }}
          >
            Let&apos;s discuss how IQAAN can transform your ideas into powerful
            digital solutions. Schedule a free consultation with our experts
            today.
          </motion.p>

          <motion.div
            className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row"
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, ease: 'easeOut', delay: 0.3 }}
          >
            <Button
              size="lg"
              className="min-w-[220px] gap-2 text-base shadow-lg shadow-primary/25 transition-shadow hover:shadow-xl hover:shadow-primary/30"
            >
              Schedule a Consultation
              <ArrowRight className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="min-w-[220px] text-base transition-colors hover:bg-primary/10 hover:text-primary"
            >
              View Our Work
            </Button>
          </motion.div>
        </div>

        {/* Contact Form */}
        <motion.div
          className="relative rounded-2xl border border-border/50 bg-card/60 p-6 shadow-2xl shadow-black/10 backdrop-blur-xl sm:p-8 md:p-10"
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, ease: 'easeOut', delay: 0.4 }}
        >
          {/* Form decorative accent */}
          <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent" />

          <div className="mb-8 text-center">
            <h3 className="text-xl font-semibold tracking-tight md:text-2xl">
              Send Us a Message
            </h3>
            <p className="mt-2 text-sm text-muted-foreground">
              Fill out the form below and we&apos;ll get back to you within 24
              hours.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="grid gap-5 sm:grid-cols-2">
              {/* Name Field */}
              <div className="space-y-2">
                <Label
                  htmlFor="name"
                  className="text-sm font-medium text-muted-foreground"
                >
                  Full Name
                </Label>
                <Input
                  id="name"
                  type="text"
                  placeholder="John Doe"
                  required
                  value={formData.name}
                  onChange={handleChange}
                  className="border-border/50 bg-background/50 text-foreground placeholder:text-muted-foreground/50 focus-visible:ring-primary/50"
                />
              </div>

              {/* Email Field */}
              <div className="space-y-2">
                <Label
                  htmlFor="email"
                  className="text-sm font-medium text-muted-foreground"
                >
                  Email Address
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="john@example.com"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  className="border-border/50 bg-background/50 text-foreground placeholder:text-muted-foreground/50 focus-visible:ring-primary/50"
                />
              </div>
            </div>

            {/* Company Field */}
            <div className="space-y-2">
              <Label
                htmlFor="company"
                className="text-sm font-medium text-muted-foreground"
              >
                Company
              </Label>
              <Input
                id="company"
                type="text"
                placeholder="Your Company Inc."
                value={formData.company}
                onChange={handleChange}
                className="border-border/50 bg-background/50 text-foreground placeholder:text-muted-foreground/50 focus-visible:ring-primary/50"
              />
            </div>

            {/* Message Field */}
            <div className="space-y-2">
              <Label
                htmlFor="message"
                className="text-sm font-medium text-muted-foreground"
              >
                Message
              </Label>
              <Textarea
                id="message"
                placeholder="Tell us about your project, goals, and timeline..."
                required
                rows={5}
                value={formData.message}
                onChange={handleChange}
                className="min-h-[120px] resize-none border-border/50 bg-background/50 text-foreground placeholder:text-muted-foreground/50 focus-visible:ring-primary/50"
              />
            </div>

            {/* Submit Button */}
            <div className="pt-2">
              <Button
                type="submit"
                disabled={isSubmitting}
                size="lg"
                className="w-full gap-2 text-base shadow-lg shadow-primary/25 transition-all hover:shadow-xl hover:shadow-primary/30 disabled:opacity-70 sm:w-auto"
              >
                {isSubmitting ? (
                  <>
                    <motion.span
                      animate={{ rotate: 360 }}
                      transition={{
                        duration: 1,
                        repeat: Infinity,
                        ease: 'linear',
                      }}
                      className="inline-block h-4 w-4 rounded-full border-2 border-current border-t-transparent"
                    />
                    Sending...
                  </>
                ) : (
                  <>
                    Send Message
                    <Send className="h-4 w-4" />
                  </>
                )}
              </Button>
            </div>
          </form>
        </motion.div>
      </div>
    </section>
  );
}
