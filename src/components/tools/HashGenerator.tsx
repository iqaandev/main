'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { Textarea } from '@/components/ui/textarea';
import Panel from './Panel';
import CopyButton from './CopyButton';
import { useDebouncedValue } from './useDebouncedValue';
import { byteLength, formatBytes } from './utils';

const ALGOS = ['SHA-1', 'SHA-256', 'SHA-384', 'SHA-512'] as const;
type Algo = (typeof ALGOS)[number];

interface HashState {
  source: 'text' | 'file' | 'empty';
  label: string;
  digests: Partial<Record<Algo, string>> | null;
  error: string | null;
}

const SAMPLE = 'IQAAN — software, built with conviction.';

function toHex(buffer: ArrayBuffer): string {
  return [...new Uint8Array(buffer)]
    .map((byte) => byte.toString(16).padStart(2, '0'))
    .join('');
}

export default function HashGenerator() {
  const [text, setText] = useState('');
  const [file, setFile] = useState<{ name: string; bytes: Uint8Array } | null>(null);
  const [hashes, setHashes] = useState<HashState>({
    source: 'empty',
    label: '',
    digests: null,
    error: null,
  });
  const fileInput = useRef<HTMLInputElement>(null);

  const debouncedText = useDebouncedValue(text, 250);
  const debouncedFile = useDebouncedValue(file, 0);

  useEffect(() => {
    let cancelled = false;

    const run = async () => {
      if (debouncedFile) {
        try {
          const results = await Promise.all(
            ALGOS.map((algo) => crypto.subtle.digest(algo, debouncedFile.bytes))
          );
          if (cancelled) return;
          const digests: Partial<Record<Algo, string>> = {};
          ALGOS.forEach((algo, i) => {
            digests[algo] = toHex(results[i]);
          });
          setHashes({
            source: 'file',
            label: `${debouncedFile.name} · ${formatBytes(debouncedFile.bytes.byteLength)}`,
            digests,
            error: null,
          });
        } catch {
          if (!cancelled) {
            setHashes({
              source: 'file',
              label: debouncedFile.name,
              digests: null,
              error: 'The file could not be read for hashing.',
            });
          }
        }
        return;
      }

      if (debouncedText === '') {
        if (!cancelled) {
          setHashes({ source: 'empty', label: '', digests: null, error: null });
        }
        return;
      }

      try {
        const bytes = new TextEncoder().encode(debouncedText);
        const results = await Promise.all(
          ALGOS.map((algo) => crypto.subtle.digest(algo, bytes))
        );
        if (cancelled) return;
        const digests: Partial<Record<Algo, string>> = {};
        ALGOS.forEach((algo, i) => {
          digests[algo] = toHex(results[i]);
        });
        setHashes({
          source: 'text',
          label: `${byteLength(debouncedText)} bytes of text`,
          digests,
          error: null,
        });
      } catch {
        if (!cancelled) {
          setHashes({
            source: 'text',
            label: '',
            digests: null,
            error:
              'Hashing needs the Web Crypto API, which requires a secure context (https or localhost).',
          });
        }
      }
    };

    run();
    return () => {
      cancelled = true;
    };
  }, [debouncedText, debouncedFile]);

  const handleFile = (selected: File | null) => {
    if (!selected) {
      setFile(null);
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      const buffer = reader.result;
      if (buffer instanceof ArrayBuffer) {
        setFile({ name: selected.name, bytes: new Uint8Array(buffer) });
      }
    };
    reader.onerror = () => setFile(null);
    reader.readAsArrayBuffer(selected);
  };

  const sourceNote = useMemo(() => {
    if (hashes.source === 'empty') return 'No input yet';
    if (hashes.source === 'file') return `Hashing file · ${hashes.label}`;
    return `Hashing text · ${hashes.label}`;
  }, [hashes]);

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
        <Panel
          label="Text input"
          actions={
            !file && (
              <>
                <button
                  type="button"
                  onClick={() => setText(SAMPLE)}
                  className="cursor-pointer font-mono text-[11px] uppercase tracking-[0.15em] text-ink/45 transition-colors duration-300 hover:text-ink"
                >
                  Load sample
                </button>
                <button
                  type="button"
                  onClick={() => setText('')}
                  className="cursor-pointer font-mono text-[11px] uppercase tracking-[0.15em] text-ink/45 transition-colors duration-300 hover:text-ink"
                >
                  Clear
                </button>
              </>
            )
          }
          bodyClassName="p-0"
        >
          {file ? (
            <div className="flex min-h-[220px] flex-col items-center justify-center gap-3 p-6 text-center">
              <p className="font-mono text-[12px] uppercase tracking-[0.15em] text-viridian">
                File mode active
              </p>
              <p className="font-mono text-[13px] text-ink/70">
                {file.name} · {formatBytes(file.bytes.byteLength)}
              </p>
              <button
                type="button"
                onClick={() => setFile(null)}
                className="mt-2 cursor-pointer rounded-full border border-ink/20 px-4 py-2 font-mono text-[10px] uppercase tracking-[0.15em] text-ink/60 transition-colors duration-300 hover:border-ink/50 hover:text-ink"
              >
                Back to text
              </button>
            </div>
          ) : (
            <Textarea
              value={text}
              onChange={(event) => setText(event.target.value)}
              placeholder="Type or paste text — digests update as you type…"
              aria-label="Text to hash"
              spellCheck={false}
              className="min-h-[220px] resize-y rounded-none border-0 font-mono text-[13px] leading-relaxed shadow-none focus-visible:ring-0"
            />
          )}
        </Panel>

        <Panel label="File input" bodyClassName="flex items-center">
          <div className="flex flex-wrap items-center gap-4">
            <button
              type="button"
              onClick={() => fileInput.current?.click()}
              className="cursor-pointer rounded-full bg-ink px-5 py-2.5 font-mono text-[11px] uppercase tracking-[0.15em] text-paper transition-colors duration-300 hover:bg-viridian"
            >
              Choose a file
            </button>
            <input
              ref={fileInput}
              type="file"
              className="hidden"
              aria-label="Choose a file to hash"
              onChange={(event) => handleFile(event.target.files?.[0] ?? null)}
            />
            <p className="max-w-[220px] text-[13px] leading-relaxed text-ink/50">
              A file takes precedence over the text field. Read locally —
              nothing is uploaded.
            </p>
          </div>
        </Panel>
      </div>

      <Panel
        label="Digests — SHA-1 · SHA-256 · SHA-384 · SHA-512"
        accent="bg-viridian"
        actions={
          <span className="font-mono text-[10px] uppercase tracking-[0.15em] text-ink/45">
            {sourceNote}
          </span>
        }
      >
        {hashes.error && (
          <p className="flex items-center gap-2 text-[13px] text-destructive">
            <span aria-hidden="true" className="inline-block h-[5px] w-[5px] rotate-45 bg-destructive" />
            {hashes.error}
          </p>
        )}
        {!hashes.error && hashes.source === 'empty' && (
          <p className="py-6 text-center text-sm italic text-ink/40">
            Enter text or choose a file — all four digests compute simultaneously.
          </p>
        )}
        {!hashes.error && hashes.digests && (
          <dl className="divide-y divide-ink/10">
            {ALGOS.map((algo) => (
              <div
                key={algo}
                className="grid grid-cols-1 gap-2 py-4 first:pt-0 last:pb-0 sm:grid-cols-[7rem_1fr_auto] sm:items-center sm:gap-4"
              >
                <dt className="font-mono text-[12px] uppercase tracking-[0.12em] text-viridian">
                  {algo}
                </dt>
                <dd className="min-w-0 break-all font-mono text-[12px] leading-relaxed text-ink/75">
                  {hashes.digests[algo]}
                </dd>
                <CopyButton value={() => hashes.digests?.[algo] ?? ''} ariaLabel={`Copy ${algo} digest`} />
              </div>
            ))}
          </dl>
        )}
        {!hashes.error && hashes.source === 'file' && !hashes.digests && (
          <p className="py-6 text-center text-sm italic text-ink/40">Hashing file…</p>
        )}
      </Panel>

      <p className="font-mono text-[10px] uppercase tracking-[0.15em] text-ink/40">
        Computed natively with crypto.subtle — no MD5 (see FAQ below).
      </p>
    </div>
  );
}
