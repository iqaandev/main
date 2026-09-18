'use client';

import { useEffect, useRef, useState } from 'react';
import { Check, Copy } from 'lucide-react';
import { copyText } from './utils';

/**
 * Quiet mono copy button with a check-mark success state (~1.5s).
 * `value` may be a getter so the copy always grabs fresh output.
 */
export default function CopyButton({
  value,
  label = 'Copy',
  ariaLabel,
  className = '',
}: {
  value: string | (() => string);
  label?: string;
  ariaLabel?: string;
  className?: string;
}) {
  const [copied, setCopied] = useState(false);
  const timer = useRef<number | null>(null);

  useEffect(() => {
    return () => {
      if (timer.current) window.clearTimeout(timer.current);
    };
  }, []);

  const handleCopy = async () => {
    const text = typeof value === 'function' ? value() : value;
    const ok = await copyText(text);
    if (!ok) return;
    setCopied(true);
    if (timer.current) window.clearTimeout(timer.current);
    timer.current = window.setTimeout(() => setCopied(false), 1500);
  };

  return (
    <button
      type="button"
      onClick={handleCopy}
      aria-label={ariaLabel ?? `${label} to clipboard`}
      className={`inline-flex cursor-pointer items-center gap-1.5 font-mono text-[11px] uppercase tracking-[0.15em] transition-colors duration-300 ${
        copied ? 'text-viridian' : 'text-ink/45 hover:text-ink'
      } ${className}`}
    >
      {copied ? (
        <Check aria-hidden="true" className="h-3.5 w-3.5" />
      ) : (
        <Copy aria-hidden="true" className="h-3.5 w-3.5" />
      )}
      {copied ? 'Copied' : label}
    </button>
  );
}
