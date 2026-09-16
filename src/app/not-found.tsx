'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { dictionaries } from '@/i18n/dictionaries';
import { usePersistedLocale } from '@/i18n/LocaleProvider';

/*
 * The 404 page renders outside page.tsx, so it can't use LocaleProvider.
 * It reads the persisted locale directly via the same external store and
 * defaults to EN — mirroring the provider's behaviour for this one page.
 */
export default function NotFound() {
  const locale = usePersistedLocale();

  useEffect(() => {
    document.documentElement.lang = locale;
    document.documentElement.dir = locale === 'ar' ? 'rtl' : 'ltr';
  }, [locale]);

  const t = dictionaries[locale].notFound;

  return (
    <div className="flex min-h-svh flex-col items-center justify-center bg-background px-6 text-center">
      {locale === 'en' ? (
        <p className="font-mono text-[11px] uppercase tracking-[0.25em] text-ink/50">
          {t.eyebrow}
        </p>
      ) : null}
      <h1 className="mt-8 font-serif text-[clamp(5rem,18vw,10rem)] font-light leading-none tracking-tight text-ink">
        404
      </h1>
      <p className="mt-6 font-serif text-xl font-light italic tracking-tight text-ink/70 sm:text-2xl">
        {t.title}
      </p>
      <Link
        href="/"
        className="group mt-12 inline-flex items-center gap-2 rounded-full bg-ink px-7 py-3 text-sm font-medium text-paper transition-colors duration-300 hover:bg-viridian"
      >
        {t.home}
        <span
          aria-hidden="true"
          className="inline-block h-1.5 w-1.5 rotate-45 bg-gold transition-transform duration-500 group-hover:rotate-[135deg]"
        />
      </Link>
    </div>
  );
}
