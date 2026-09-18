'use client';

import { useMemo, useRef, useState } from 'react';
import { ArrowUpDown } from 'lucide-react';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import Panel from './Panel';
import CopyButton from './CopyButton';
import Segmented from './Segmented';
import { useDebouncedValue } from './useDebouncedValue';
import { byteLength, formatBytes } from './utils';

/* UTF-8 safe conversion — never btoa on a raw string. */
function bytesToBase64(bytes: Uint8Array): string {
  let binary = '';
  const chunk = 0x8000;
  for (let i = 0; i < bytes.length; i += chunk) {
    binary += String.fromCharCode(...bytes.subarray(i, i + chunk));
  }
  return btoa(binary);
}

function base64ToBytes(value: string): Uint8Array {
  const normalized = value.replace(/-/g, '+').replace(/_/g, '/').replace(/=+$/, '');
  if (!/^[A-Za-z0-9+/]*$/.test(normalized)) {
    throw new Error('The input contains characters that are not valid Base64.');
  }
  const padded = normalized + '='.repeat((4 - (normalized.length % 4)) % 4);
  const binary = atob(padded);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
  return bytes;
}

function toUrlSafe(value: string): string {
  return value.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

const SAMPLE = 'IQAAN — software, built with conviction. برمجيات تُبنى باليقين ✓';

export default function Base64Tool() {
  const [direction, setDirection] = useState<'encode' | 'decode'>('encode');
  const [input, setInput] = useState('');
  const [urlSafe, setUrlSafe] = useState(false);
  const [file, setFile] = useState<{ name: string; size: number; base64: string } | null>(null);
  const fileInput = useRef<HTMLInputElement>(null);
  const debounced = useDebouncedValue(input, 160);

  const result = useMemo(() => {
    if (debounced.trim() === '') return { state: 'empty' as const };
    try {
      if (direction === 'encode') {
        const bytes = new TextEncoder().encode(debounced);
        const base64 = bytesToBase64(bytes);
        return { state: 'ok' as const, output: urlSafe ? toUrlSafe(base64) : base64 };
      }
      const bytes = base64ToBytes(debounced.trim());
      const text = new TextDecoder('utf-8', { fatal: true }).decode(bytes);
      return { state: 'ok' as const, output: text };
    } catch (error) {
      return {
        state: 'error' as const,
        message:
          error instanceof Error
            ? error.message
            : 'This input could not be converted.',
      };
    }
  }, [debounced, direction, urlSafe]);

  const swapDirection = () => {
    if (result.state === 'ok') setInput(result.output);
    else setInput('');
    setDirection(direction === 'encode' ? 'decode' : 'encode');
  };

  const handleFile = (selected: File | null) => {
    if (!selected) {
      setFile(null);
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      const dataUrl = String(reader.result ?? '');
      const base64 = dataUrl.slice(dataUrl.indexOf(',') + 1);
      setFile({ name: selected.name, size: selected.size, base64 });
    };
    reader.onerror = () => setFile(null);
    reader.readAsDataURL(selected);
  };

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center gap-x-8 gap-y-4">
        <Segmented
          ariaLabel="Conversion direction"
          value={direction}
          onChange={setDirection}
          options={[
            { value: 'encode', label: 'Text → Base64' },
            { value: 'decode', label: 'Base64 → Text' },
          ]}
        />
        <button
          type="button"
          onClick={swapDirection}
          className="inline-flex cursor-pointer items-center gap-2 font-mono text-[11px] uppercase tracking-[0.15em] text-ink/45 transition-colors duration-300 hover:text-ink"
        >
          <ArrowUpDown aria-hidden="true" className="h-3.5 w-3.5" />
          Swap direction
        </button>
        <div className="flex items-center gap-3">
          <Switch
            id="base64-urlsafe"
            checked={urlSafe}
            onCheckedChange={setUrlSafe}
            aria-label="URL-safe alphabet (- and _ instead of + and /)"
          />
          <Label
            htmlFor="base64-urlsafe"
            className="cursor-pointer font-mono text-[10px] uppercase tracking-[0.15em] text-ink/55"
          >
            URL-safe alphabet
          </Label>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
        <Panel
          label={direction === 'encode' ? 'Text' : 'Base64'}
          actions={
            <>
              <button
                type="button"
                onClick={() => setInput(SAMPLE)}
                className="cursor-pointer font-mono text-[11px] uppercase tracking-[0.15em] text-ink/45 transition-colors duration-300 hover:text-ink"
              >
                Load sample
              </button>
              <button
                type="button"
                onClick={() => setInput('')}
                className="cursor-pointer font-mono text-[11px] uppercase tracking-[0.15em] text-ink/45 transition-colors duration-300 hover:text-ink"
              >
                Clear
              </button>
            </>
          }
          bodyClassName="p-0"
        >
          <Textarea
            value={input}
            onChange={(event) => setInput(event.target.value)}
            placeholder={
              direction === 'encode'
                ? 'Type or paste text — any language, emoji included…'
                : 'Paste a Base64 string (standard or URL-safe)…'
            }
            aria-label={direction === 'encode' ? 'Text input' : 'Base64 input'}
            spellCheck={false}
            className="min-h-[240px] resize-y rounded-none border-0 font-mono text-[13px] leading-relaxed shadow-none focus-visible:ring-0"
          />
        </Panel>

        <Panel
          label={direction === 'encode' ? 'Base64' : 'Text'}
          actions={result.state === 'ok' ? <CopyButton value={() => result.output} /> : null}
          bodyClassName="p-0"
        >
          {result.state === 'empty' && (
            <p className="flex min-h-[240px] items-center justify-center px-6 text-sm italic text-ink/40">
              {direction === 'encode'
                ? 'The Base64 encoding appears here.'
                : 'The decoded text appears here.'}
            </p>
          )}
          {result.state === 'error' && (
            <div className="flex min-h-[240px] flex-col justify-center gap-2 p-6">
              <p className="flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.15em] text-destructive">
                <span aria-hidden="true" className="inline-block h-[5px] w-[5px] rotate-45 bg-destructive" />
                Cannot convert
              </p>
              <p className="text-sm text-ink/70">{result.message}</p>
              {direction === 'decode' && (
                <p className="text-[13px] text-ink/45">
                  Check for truncated strings or stray characters — valid Base64
                  uses A–Z, a–z, 0–9, +, /, - and _ only.
                </p>
              )}
            </div>
          )}
          {result.state === 'ok' && (
            <pre className="max-h-[360px] min-h-[240px] overflow-auto whitespace-pre-wrap break-all p-6 font-mono text-[13px] leading-relaxed text-ink">
              {result.output}
            </pre>
          )}
          {result.state === 'ok' && direction === 'encode' && (
            <p className="border-t border-ink/10 bg-ink/[0.02] px-6 py-3 font-mono text-[11px] uppercase tracking-[0.12em] text-ink/50">
              {byteLength(input)} bytes in · {result.output.length} chars out
            </p>
          )}
        </Panel>
      </div>

      {/* File → Base64 */}
      <Panel label="File → Base64">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
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
              aria-label="Choose a file to encode"
              onChange={(event) => handleFile(event.target.files?.[0] ?? null)}
            />
            {file ? (
              <p className="font-mono text-[11px] uppercase tracking-[0.12em] text-ink/55">
                <span className="text-ink">{file.name}</span> · {formatBytes(file.size)}
              </p>
            ) : (
              <p className="font-mono text-[11px] uppercase tracking-[0.12em] text-ink/40">
                Read locally with FileReader — nothing is uploaded.
              </p>
            )}
          </div>
          {file && (
            <div className="flex items-center gap-5">
              <CopyButton value={() => file.base64} label="Copy Base64" />
              <CopyButton
                value={() => `data:application/octet-stream;base64,${file.base64}`}
                label="Copy data URL"
              />
            </div>
          )}
        </div>
        {file && (
          <p className="mt-4 break-all rounded-md border border-ink/10 bg-ink/[0.03] px-4 py-3 font-mono text-[12px] leading-relaxed text-ink/60">
            {file.base64.slice(0, 400)}
            {file.base64.length > 400 ? '…' : ''}
          </p>
        )}
      </Panel>
    </div>
  );
}
