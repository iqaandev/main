'use client';

import { useMemo, useState } from 'react';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import Panel from './Panel';
import CopyButton from './CopyButton';
import { useDebouncedValue } from './useDebouncedValue';
import { downloadText } from './utils';
import { JSON_TOKEN_CLASS, tokenizeJson } from '@/lib/tools/json-highlight';

/* ─── RFC 4180-ish parser (hand-rolled) ──────────────────────────────── */

const DELIMS = [',', ';', '\t'];

export function detectDelimiter(text: string): string {
  let inQuotes = false;
  const counts: Record<string, number> = { ',': 0, ';': 0, '\t': 0 };
  for (const char of text) {
    if (char === '"') inQuotes = !inQuotes;
    else if (!inQuotes && char in counts) counts[char]++;
  }
  return DELIMS.reduce((best, d) => (counts[d] > counts[best] ? d : best), ',');
}

export function parseCsv(text: string, delimiter: string): string[][] {
  const rows: string[][] = [];
  let row: string[] = [];
  let field = '';
  let inQuotes = false;

  for (let i = 0; i < text.length; i++) {
    const char = text[i];
    if (inQuotes) {
      if (char === '"') {
        if (text[i + 1] === '"') {
          field += '"';
          i++;
        } else {
          inQuotes = false;
        }
      } else {
        field += char;
      }
    } else if (char === '"') {
      inQuotes = true;
    } else if (char === delimiter) {
      row.push(field);
      field = '';
    } else if (char === '\n') {
      row.push(field);
      rows.push(row);
      row = [];
      field = '';
    } else if (char === '\r') {
      if (text[i + 1] === '\n') i++; // CRLF handled at \n
      else {
        row.push(field);
        rows.push(row);
        row = [];
        field = '';
      }
    } else {
      field += char;
    }
  }
  if (field !== '' || row.length > 0) {
    row.push(field);
    rows.push(row);
  }
  return rows.filter((r) => r.length > 1 || r[0] !== '');
}

function coerce(value: string): string | number | boolean | null {
  if (value === '') return '';
  if (value === 'true') return true;
  if (value === 'false') return false;
  if (value === 'null') return null;
  if (/^-?\d+(\.\d+)?([eE][+-]?\d+)?$/.test(value)) return Number(value);
  return value;
}

function csvToJson(rows: string[][], headers: boolean): unknown[] {
  if (!headers) return rows.map((row) => row.map(coerce));
  const [headerRow, ...dataRows] = rows;
  const keys = headerRow.map((key, i) => (key.trim() === '' ? `column_${i + 1}` : key.trim()));
  return dataRows.map((row) => {
    const record: Record<string, unknown> = {};
    keys.forEach((key, i) => {
      record[key] = coerce(row[i] ?? '');
    });
    return record;
  });
}

/** One-level flatten: objects → dot columns, arrays → JSON strings. */
function flattenRow(row: Record<string, unknown>): Record<string, string> {
  const flat: Record<string, string> = {};
  for (const [key, value] of Object.entries(row)) {
    if (value !== null && typeof value === 'object' && !Array.isArray(value)) {
      for (const [nestedKey, nestedValue] of Object.entries(value as Record<string, unknown>)) {
        flat[`${key}.${nestedKey}`] =
          nestedValue !== null && typeof nestedValue === 'object'
            ? JSON.stringify(nestedValue)
            : String(nestedValue ?? '');
      }
    } else if (Array.isArray(value)) {
      flat[key] = JSON.stringify(value);
    } else {
      flat[key] = value === null || value === undefined ? '' : String(value);
    }
  }
  return flat;
}

function jsonToCsv(data: unknown, delimiter: string): string {
  const quote = (value: string) => {
    const needs = value.includes(delimiter) || value.includes('"') || /[\n\r]/.test(value);
    return needs ? `"${value.replace(/"/g, '""')}"` : value;
  };

  let records: Record<string, unknown>[];
  if (Array.isArray(data)) {
    if (data.every((item) => item !== null && typeof item === 'object' && !Array.isArray(item))) {
      records = data as Record<string, unknown>[];
    } else {
      // Array of primitives → single column
      records = (data as unknown[]).map((item) => ({ value: item }));
    }
  } else if (data !== null && typeof data === 'object') {
    records = [data as Record<string, unknown>];
  } else {
    records = [{ value: data }];
  }

  const flatRows = records.map((record) => flattenRow(record));
  const columns: string[] = [];
  for (const flat of flatRows) {
    for (const key of Object.keys(flat)) {
      if (!columns.includes(key)) columns.push(key);
    }
  }
  const esc = (v: string) => v.replace(/"/g, '""').replace(/\n/g, '\\n');
  const lines = [
    columns.map((c) => quote(esc(c))).join(delimiter),
    ...flatRows.map((flat) =>
      columns.map((column) => quote(esc(flat[column] ?? ''))).join(delimiter)
    ),
  ];
  return lines.join('\n');
}

function csvToMarkdown(rows: string[][]): string {
  if (rows.length === 0) return '';
  const escape = (value: string) => value.replace(/\|/g, '\\|').replace(/\n/g, ' ');
  const [header, ...body] = rows;
  const width = Math.max(...rows.map((r) => r.length));
  const pad = (cells: string[]) => [...cells, ...Array(width - cells.length).fill('')];
  return [
    `| ${pad(header).map(escape).join(' | ')} |`,
    `| ${Array(width).fill('---').join(' | ')} |`,
    ...body.map((row) => `| ${pad(row).map(escape).join(' | ')} |`),
  ].join('\n');
}

const SAMPLE_CSV = `order,customer,city,total,notes
1042,"Al-Rashid, Amina","Riyadh",299.0,"Said ""ship it Friday"" — priority"
1043,Jonas Weber,Berlin,149.5,
1044,"Chen, Wei","Taipei",0,"Multi
line note"`;

const SAMPLE_JSON = `[
  { "order": 1042, "customer": "Amina Al-Rashid", "city": "Riyadh", "total": 299.0, "tags": ["priority"] },
  { "order": 1043, "customer": { "name": "Jonas Weber", "tier": "gold" }, "city": "Berlin", "total": 149.5, "tags": [] }
]`;

const HIGHLIGHT_CAP = 50000;

export default function CsvConverter() {
  const [mode, setMode] = useState<'to-json' | 'to-csv' | 'to-markdown'>('to-json');
  const [input, setInput] = useState('');
  const [headers, setHeaders] = useState(true);
  const [delimiter, setDelimiter] = useState<',' | ';' | '\t'>(',');
  const debounced = useDebouncedValue(input, 180);

  const result = useMemo(() => {
    if (debounced.trim() === '') return { state: 'empty' as const };

    if (mode === 'to-csv') {
      try {
        const data = JSON.parse(debounced);
        return { state: 'ok' as const, output: jsonToCsv(data, delimiter), rows: Array.isArray(data) ? data.length : 1 };
      } catch (error) {
        return {
          state: 'error' as const,
          message:
            error instanceof Error
              ? `Invalid JSON — ${error.message}`
              : 'The input is not valid JSON.',
        };
      }
    }

    const detected = detectDelimiter(debounced);
    const rows = parseCsv(debounced, mode === 'to-markdown' ? detected : delimiter === undefined ? detected : delimiter);
    if (rows.length === 0) return { state: 'empty' as const };

    if (mode === 'to-markdown') {
      return { state: 'ok' as const, output: csvToMarkdown(rows), rows: rows.length - 1 };
    }

    const json = csvToJson(rows, headers);
    const text = JSON.stringify(json, null, 2);
    return {
      state: 'ok' as const,
      output: text,
      rows: json.length,
      tokens: text.length <= HIGHLIGHT_CAP ? tokenizeJson(text) : null,
      delimiter: detected,
    };
  }, [debounced, mode, headers, delimiter]);

  const jsonTokens = 'tokens' in result && result.tokens ? result.tokens : null;
  const maxCols = useMemo(() => {
    if (debounced.trim() === '' || mode === 'to-csv') return 0;
    const rows = parseCsv(debounced, detectDelimiter(debounced));
    return rows.reduce((max, row) => Math.max(max, row.length), 0);
  }, [debounced, mode]);

  const fileInfo: Record<typeof mode, { name: string; mime: string }> = {
    'to-json': { name: 'data.json', mime: 'application/json' },
    'to-csv': { name: 'data.csv', mime: 'text/csv' },
    'to-markdown': { name: 'table.md', mime: 'text/markdown' },
  };

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <Tabs value={mode} onValueChange={(value) => setMode(value as typeof mode)}>
          <TabsList>
            <TabsTrigger value="to-json" className="font-mono text-[11px] uppercase tracking-[0.12em]">
              CSV → JSON
            </TabsTrigger>
            <TabsTrigger value="to-csv" className="font-mono text-[11px] uppercase tracking-[0.12em]">
              JSON → CSV
            </TabsTrigger>
            <TabsTrigger value="to-markdown" className="font-mono text-[11px] uppercase tracking-[0.12em]">
              CSV → Markdown
            </TabsTrigger>
          </TabsList>
        </Tabs>

        {mode === 'to-json' && (
          <div className="flex items-center gap-3">
            <Switch id="csv-headers" checked={headers} onCheckedChange={setHeaders} />
            <Label
              htmlFor="csv-headers"
              className="cursor-pointer font-mono text-[10px] uppercase tracking-[0.15em] text-ink/55"
            >
              First row is headers
            </Label>
          </div>
        )}

        {mode === 'to-csv' && (
          <div className="flex items-center gap-3">
            <Label
              htmlFor="csv-delim"
              className="font-mono text-[10px] uppercase tracking-[0.15em] text-ink/55"
            >
              Delimiter
            </Label>
            <div role="group" aria-label="Output delimiter" className="flex overflow-hidden rounded-md border border-ink/15">
              {(
                [
                  { value: ',', label: ',' },
                  { value: ';', label: ';' },
                  { value: '\t', label: '⇥' },
                ] as const
              ).map((option) => (
                <button
                  key={option.value}
                  type="button"
                  aria-pressed={delimiter === option.value}
                  onClick={() => setDelimiter(option.value)}
                  className={`h-8 w-9 cursor-pointer font-mono text-[13px] transition-colors duration-300 ${
                    delimiter === option.value
                      ? 'bg-ink text-paper'
                      : 'text-ink/55 hover:bg-ink/5 hover:text-ink'
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
        <Panel
          label={mode === 'to-csv' ? 'JSON input' : 'CSV input'}
          actions={
            <>
              <button
                type="button"
                onClick={() => setInput(mode === 'to-csv' ? SAMPLE_JSON : SAMPLE_CSV)}
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
              mode === 'to-csv'
                ? 'Paste JSON — an array of objects works best…'
                : 'Paste CSV — quoted fields, semicolons and tabs all welcome…'
            }
            aria-label={mode === 'to-csv' ? 'JSON input' : 'CSV input'}
            spellCheck={false}
            className="min-h-[300px] resize-y rounded-none border-0 font-mono text-[13px] leading-relaxed shadow-none focus-visible:ring-0"
          />
        </Panel>

        <Panel
          label={
            mode === 'to-json' ? 'JSON output' : mode === 'to-csv' ? 'CSV output' : 'Markdown output'
          }
          actions={
            result.state === 'ok' ? (
              <>
                <CopyButton value={() => result.output} />
                <button
                  type="button"
                  onClick={() =>
                    downloadText(fileInfo[mode].name, result.output, fileInfo[mode].mime)
                  }
                  className="cursor-pointer font-mono text-[11px] uppercase tracking-[0.15em] text-ink/45 transition-colors duration-300 hover:text-ink"
                >
                  Download
                </button>
              </>
            ) : null
          }
          bodyClassName="p-0"
        >
          {result.state === 'empty' && (
            <p className="flex min-h-[300px] items-center justify-center px-6 text-sm italic text-ink/40">
              The converted result appears here as you type.
            </p>
          )}
          {result.state === 'error' && (
            <div className="flex min-h-[300px] flex-col justify-center gap-2 p-6">
              <p className="flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.15em] text-destructive">
                <span aria-hidden="true" className="inline-block h-[5px] w-[5px] rotate-45 bg-destructive" />
                Cannot convert
              </p>
              <p className="break-all text-sm leading-relaxed text-ink/70">{result.message}</p>
            </div>
          )}
          {result.state === 'ok' && (
            <>
              <pre className="max-h-[380px] min-h-[300px] overflow-auto whitespace-pre-wrap break-words p-6 font-mono text-[13px] leading-relaxed text-ink">
                {jsonTokens
                  ? jsonTokens.map((token, i) => (
                      <span key={i} className={JSON_TOKEN_CLASS[token.type]}>
                        {token.text}
                      </span>
                    ))
                  : result.output}
              </pre>
              <p className="border-t border-ink/10 bg-ink/[0.02] px-6 py-3 font-mono text-[11px] uppercase tracking-[0.12em] text-ink/50">
                {mode === 'to-markdown'
                  ? `${result.rows} data rows · ${maxCols} columns`
                  : mode === 'to-csv'
                    ? `${result.rows} records flattened`
                    : `${result.rows} rows · ${maxCols} columns${'delimiter' in result && result.delimiter ? ` · delimiter “${result.delimiter === '\t' ? '⇥' : result.delimiter}”` : ''}`}
              </p>
            </>
          )}
        </Panel>
      </div>
    </div>
  );
}
