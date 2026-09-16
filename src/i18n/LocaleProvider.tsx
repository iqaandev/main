'use client';

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useSyncExternalStore,
  type ReactNode,
} from 'react';
import { dictionaries, type Dictionary, type Locale } from './dictionaries';

const STORAGE_KEY = 'iqaan-locale';
const LOCALE_CHANGE_EVENT = 'iqaan-locale-change';

/* ─── localStorage as an external store (useSyncExternalStore) ───────────
   The prerendered HTML is always EN; after hydration React adopts the
   persisted client snapshot without a hydration mismatch, and without
   setState-inside-effect. */

function subscribe(onStoreChange: () => void) {
  window.addEventListener(LOCALE_CHANGE_EVENT, onStoreChange);
  window.addEventListener('storage', onStoreChange);
  return () => {
    window.removeEventListener(LOCALE_CHANGE_EVENT, onStoreChange);
    window.removeEventListener('storage', onStoreChange);
  };
}

/* In-memory mirror so the toggle still works when localStorage is
   unavailable (private mode); persistence then simply doesn't survive. */
let memoryLocale: Locale | null = null;

function getSnapshot(): Locale {
  if (memoryLocale) return memoryLocale;
  try {
    return window.localStorage.getItem(STORAGE_KEY) === 'ar' ? 'ar' : 'en';
  } catch {
    return 'en';
  }
}

function getServerSnapshot(): Locale {
  return 'en';
}

/** The persisted locale — 'en' during SSR/prerender, then the stored value. */
export function usePersistedLocale(): Locale {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}

function writeLocale(locale: Locale) {
  memoryLocale = locale;
  try {
    window.localStorage.setItem(STORAGE_KEY, locale);
  } catch {
    /* keep the in-memory mirror only */
  }
  window.dispatchEvent(new Event(LOCALE_CHANGE_EVENT));
}

function applyToDocument(locale: Locale) {
  document.documentElement.lang = locale;
  document.documentElement.dir = locale === 'ar' ? 'rtl' : 'ltr';
}

/* ─── Context ──────────────────────────────────────────────────────────── */

interface LocaleContextValue {
  locale: Locale;
  dir: 'ltr' | 'rtl';
  t: Dictionary;
  setLocale: (locale: Locale) => void;
  toggleLocale: () => void;
}

const LocaleContext = createContext<LocaleContextValue | null>(null);

export function LocaleProvider({ children }: { children: ReactNode }) {
  const locale = usePersistedLocale();

  useEffect(() => {
    applyToDocument(locale);
  }, [locale]);

  const setLocale = useCallback((next: Locale) => {
    writeLocale(next);
  }, []);

  const toggleLocale = useCallback(() => {
    writeLocale(locale === 'en' ? 'ar' : 'en');
  }, [locale]);

  const value = useMemo<LocaleContextValue>(
    () => ({
      locale,
      dir: locale === 'ar' ? 'rtl' : 'ltr',
      t: dictionaries[locale],
      setLocale,
      toggleLocale,
    }),
    [locale, setLocale, toggleLocale]
  );

  return <LocaleContext.Provider value={value}>{children}</LocaleContext.Provider>;
}

export function useLocale(): LocaleContextValue {
  const ctx = useContext(LocaleContext);
  if (!ctx) {
    throw new Error('useLocale must be used within a LocaleProvider');
  }
  return ctx;
}
