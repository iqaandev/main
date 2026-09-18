'use client';

import { useMemo, useState } from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import Panel from './Panel';
import Segmented from './Segmented';
import CopyButton from './CopyButton';
import { useDebouncedValue } from './useDebouncedValue';
import { byteLength, downloadText, formatBytes } from './utils';
import {
  JSON_TOKEN_CLASS,
  locateJsonError,
  tokenizeJson,
} from '@/lib/tools/json-highlight';

const SAMPLE = `{
  "order": 1042,
  "customer": { "name": "Amina Al-Rashid", "tier": "gold", "active": true },
  "items": [
    { "sku": "IQAAN-01", "qty": 2, "price": 149.5, "tags": ["software", "studio"] },
    { "sku": "IQAAN-02", "qty": 1, "price": 0, "note": null }
  ],
  "currency": "SAR",
  "placedAt": "2026-09-18T09:30:00Z"
}`;

function collectStats(node: unknown, depth = 1): { keys: number; depth: number } {
  if (Array.isArray(node)) {
    let keys = 0;
    let max = depth;
    for (const item of node) {
      const result = collectStats(item, depth + 1);
      keys += result.keys;
      max = Math.max(max, result.depth);
    }
    return { keys, depth: max };
  }
  if (node !== null && typeof node === 'object') {
    let keys = 0;
    let max = depth;
    for (const value of Object.values(node)) {
      keys += 1;
      const result = collectStats(value, depth + 1);
      keys += result.keys;
      max = Math.max(max, result.depth);
    }
    return { keys, depth: max };
  }
  return { keys: 0, depth };
}

export default function JsonFormatter() {
  const [input, setInput] = useState('');
  const [mode, setMode] = useState<'format' | 'minify'>('format');
  const [indent, setIndent] = useState<'2' | '4'>('2');
  const debounced = useDebouncedValue(input, 180);

  const parsed = useMemo(() => {
    if (debounced.trim() === '') return { state: 'empty' as const };
    try {
      return { state: 'ok' as const, value: JSON.parse(debounced) as unknown };
    } catch (error) {
      return {
        state: 'error' as const,
        message: error instanceof Error ? error.message : String(error),
      };
    }
  }, [debounced]);

  const output = useMemo(() => {
    if (parsed.state !== 'ok') return '';
    return JSON.stringify(parsed.value, null, mode === 'format' ? Number(indent) : 0);
  }, [parsed, mode, indent]);

  const stats = useMemo(() => {
    if (parsed.state !== 'ok') return null;
    const { keys, depth } = collectStats(parsed.value);
    return { bytes: byteLength(output), keys, depth };
  }, [parsed, output]);

  const tokens = useMemo(
    () => (output && mode === 'format' ? tokenizeJson(output) : []),
    [output, mode]
  );

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center gap-4">
        <Segmented
          ariaLabel="Output mode"
          value={mode}
          onChange={setMode}
          options={[
            { value: 'format', label: 'Format' },
            { value: 'minify', label: 'Minify' },
          ]}
        />
        {mode === 'format' && (
          <Select value={indent} onValueChange={(value) => setIndent(value as '2' | '4')}>
            <SelectTrigger size="sm" aria-label="Indentation" className="w-[130px] font-mono text-[11px] uppercase tracking-[0.12em]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="2">2 spaces</SelectItem>
              <SelectItem value="4">4 spaces</SelectItem>
            </SelectContent>
          </Select>
        )}
      </div>

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
        <Panel
          label="Input"
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
            placeholder="Paste JSON here…"
            aria-label="JSON input"
            spellCheck={false}
            className="min-h-[320px] resize-y rounded-none border-0 font-mono text-[13px] leading-relaxed shadow-none focus-visible:ring-0"
          />
        </Panel>

        <Panel
          label="Output"
          actions={
            parsed.state === 'ok' ? (
              <>
                <CopyButton value={() => output} ariaLabel="Copy formatted JSON" />
                <button
                  type="button"
                  onClick={() => downloadText('data.json', output, 'application/json')}
                  className="cursor-pointer font-mono text-[11px] uppercase tracking-[0.15em] text-ink/45 transition-colors duration-300 hover:text-ink"
                >
                  Download .json
                </button>
              </>
            ) : null
          }
          bodyClassName="p-0"
        >
          {parsed.state === 'empty' && (
            <p className="flex min-h-[320px] items-center justify-center px-6 text-sm italic text-ink/40">
              Output appears here as you type.
            </p>
          )}

          {parsed.state === 'error' && (
            <div className="min-h-[320px] space-y-3 p-6">
              <p className="flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.15em] text-destructive">
                <span aria-hidden="true" className="inline-block h-[5px] w-[5px] rotate-45 bg-destructive" />
                Invalid JSON
              </p>
              {(() => {
                const located = locateJsonError(debounced, parsed.message);
                return (
                  <>
                    <p className="text-sm text-ink/70">{located.friendly}</p>
                    {located.snippet && (
                      <p className="break-all rounded-md border border-ink/10 bg-ink/[0.03] px-4 py-3 font-mono text-[12px] leading-relaxed text-ink/60">
                        {located.snippet}
                      </p>
                    )}
                    <p className="text-[13px] leading-relaxed text-ink/45">
                      Common culprits: a trailing comma, an unescaped quote, or
                      text that is not wrapped in double quotes.
                    </p>
                  </>
                );
              })()}
            </div>
          )}

          {parsed.state === 'ok' && (
            <>
              <pre
                aria-label="Formatted JSON output"
                className="max-h-[420px] min-h-[320px] overflow-auto p-6 font-mono text-[13px] leading-relaxed text-ink"
              >
                <code>
                  {mode === 'format'
                    ? tokens.map((token, i) => (
                        <span key={i} className={JSON_TOKEN_CLASS[token.type]}>
                          {token.text}
                        </span>
                      ))
                    : output}
                </code>
              </pre>
              <div className="flex flex-wrap items-center gap-x-6 gap-y-2 border-t border-ink/10 bg-ink/[0.02] px-6 py-3 font-mono text-[11px] uppercase tracking-[0.12em] text-ink/50">
                <span className="flex items-center gap-2">
                  <span aria-hidden="true" className="inline-block h-[5px] w-[5px] rotate-45 bg-viridian" />
                  Valid
                </span>
                {stats && (
                  <>
                    <span>{formatBytes(stats.bytes)}</span>
                    <span>{stats.keys} keys</span>
                    <span>depth {stats.depth}</span>
                  </>
                )}
              </div>
            </>
          )}
        </Panel>
      </div>

      <p className="font-mono text-[10px] uppercase tracking-[0.15em] text-ink/40">
        Processed in your browser — nothing is uploaded.
      </p>
    </div>
  );
}
