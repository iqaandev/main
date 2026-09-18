'use client';

import { useMemo, useState } from 'react';
import { Input } from '@/components/ui/input';
import Panel from './Panel';
import CopyButton from './CopyButton';
import { useDebouncedValue } from './useDebouncedValue';

/* ─── Field definitions ──────────────────────────────────────────────── */

type FieldKind = 'minute' | 'hour' | 'dom' | 'month' | 'dow';

interface FieldDef {
  kind: FieldKind;
  label: string;
  min: number;
  max: number;
  names?: string[];
}

const MONTH_NAMES = ['jan', 'feb', 'mar', 'apr', 'may', 'jun', 'jul', 'aug', 'sep', 'oct', 'nov', 'dec'];
const DOW_NAMES = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'];

const FIELDS: FieldDef[] = [
  { kind: 'minute', label: 'Minute', min: 0, max: 59 },
  { kind: 'hour', label: 'Hour', min: 0, max: 23 },
  { kind: 'dom', label: 'Day of month', min: 1, max: 31 },
  { kind: 'month', label: 'Month', min: 1, max: 12, names: MONTH_NAMES },
  { kind: 'dow', label: 'Day of week', min: 0, max: 7, names: DOW_NAMES },
];

interface ParsedField {
  values: Set<number>;
  /** True unless the field is a plain * (or ?) — drives the dom/dow OR rule. */
  restricted: boolean;
}

function resolveToken(token: string, def: FieldDef): number {
  const lower = token.toLowerCase();
  if (def.names) {
    const index = def.names.indexOf(lower);
    if (index !== -1) {
      return def.kind === 'month' ? index + 1 : index; // dow: sun=0…sat=6
    }
  }
  if (!/^\d+$/.test(lower)) {
    throw new Error(`“${token}” is not a valid ${def.label.toLowerCase()} value`);
  }
  const value = Number(lower);
  if (def.kind === 'dow' && value === 7) return 0; // 7 == Sunday
  if (value < def.min || value > def.max) {
    throw new Error(`${def.label} must be between ${def.min} and ${def.max}`);
  }
  return value;
}

export function parseCronField(raw: string, def: FieldDef): ParsedField {
  const field = raw.trim().toLowerCase();
  if (field === '' || field === '?' || field === '*') {
    const values = new Set<number>();
    for (let v = def.min; v <= def.max; v++) values.add(def.kind === 'dow' && v === 7 ? 0 : v);
    return { values, restricted: false };
  }

  const values = new Set<number>();
  for (const term of field.split(',')) {
    const match = term.match(/^(\*|\?|[a-z0-9]+(?:-[a-z0-9]+)?)(?:\/(\d+))?$/);
    if (!match) throw new Error(`“${term}” is not valid cron syntax`);

    const step = match[2] ? Number(match[2]) : 1;
    if (step < 1) throw new Error('Steps must be 1 or greater');

    let from: number;
    let to: number;
    if (match[1] === '*' || match[1] === '?') {
      from = def.min;
      to = def.kind === 'dow' ? 6 : def.max;
    } else {
      const [start, end] = match[1].split('-');
      from = resolveToken(start, def);
      to = end !== undefined ? resolveToken(end, def) : step > 1 ? def.max : from;
      if (end !== undefined && from > to) {
        throw new Error(`Range ${term} runs backwards`);
      }
    }

    for (let v = from; v <= to; v += step) values.add(v);
  }

  return { values, restricted: true };
}

/* ─── Plain-English description ─────────────────────────────────────── */

function nameValue(kind: FieldKind, value: number): string {
  if (kind === 'month') return new Date(2026, value - 1, 1).toLocaleString('en', { month: 'long' });
  if (kind === 'dow') return new Date(2026, 8, 13 + value).toLocaleString('en', { weekday: 'long' }); // Sep 13 2026 is a Sunday
  return String(value);
}

function joinList(items: string[]): string {
  if (items.length <= 2) return items.join(' and ');
  return `${items.slice(0, -1).join(', ')} and ${items[items.length - 1]}`;
}

function describeField(def: FieldKind, parsed: ParsedField, raw: string): string {
  const sorted = [...parsed.values].sort((a, b) => a - b);
  const isAll = !parsed.restricted;

  const stepMatch = raw.trim().match(/^\*\/(\d+)$/);
  if (isAll) {
    switch (def) {
      case 'minute': return 'every minute';
      case 'hour': return 'every hour';
      case 'dom': return 'every day of the month';
      case 'month': return 'every month';
      case 'dow': return 'every day of the week';
    }
  }
  if (stepMatch && sorted.length > 1) {
    const n = stepMatch[1];
    switch (def) {
      case 'minute': return `every ${n} minutes`;
      case 'hour': return `every ${n} hours`;
      case 'dom': return `every ${n} days of the month`;
      case 'month': return `every ${n} months`;
      case 'dow': return `every ${n} days of the week`;
    }
  }

  const named = sorted.map((v) => nameValue(def, v));
  const single = sorted.length === 1;
  const contiguous = sorted.length > 1 && sorted.every((v, i) => i === 0 || v === sorted[i - 1] + 1);

  if (def === 'dow' && sorted.length === 5 && sorted[0] === 1 && sorted[4] === 5) return 'on weekdays';
  if (def === 'dow' && sorted.length === 2 && sorted[0] === 0 && sorted[1] === 6) return 'on weekends';

  const list = joinList(named);
  switch (def) {
    case 'minute': return single ? `at minute ${list}` : `at minutes ${list}`;
    case 'hour': return single ? `past hour ${list}` : contiguous ? `past every hour from ${named[0]} to ${named[named.length - 1]}` : `past hours ${list}`;
    case 'dom': return single ? `on day ${list} of the month` : contiguous ? `on days ${named[0]} through ${named[named.length - 1]} of the month` : `on days ${list} of the month`;
    case 'month': return single ? `in ${list}` : contiguous ? `from ${named[0]} to ${named[named.length - 1]}` : `in ${list}`;
    case 'dow': return single ? `on ${list}` : contiguous ? `on ${named[0]} through ${named[named.length - 1]}` : `on ${list}`;
  }
  return list;
}

function explainCron(fields: string[], parsed: ParsedField[]): string {
  const [minute, hour, dom, month, dow] = parsed;

  const segments: string[] = [];
  const minuteSorted = [...minute.values].sort((a, b) => a - b);
  const hourSorted = [...hour.values].sort((a, b) => a - b);
  const bothSingle = minuteSorted.length === 1 && hourSorted.length === 1;

  if (bothSingle) {
    segments.push(
      `at ${String(hourSorted[0]).padStart(2, '0')}:${String(minuteSorted[0]).padStart(2, '0')}`
    );
  } else {
    segments.push(describeField('minute', minute, fields[0]));
    if (hour.restricted || hourSorted.length !== 24) segments.push(describeField('hour', hour, fields[1]));
  }
  segments.push(describeField('dom', dom, fields[2]));
  segments.push(describeField('month', month, fields[3]));
  segments.push(describeField('dow', dow, fields[4]));

  let sentence = segments.join(', ');
  sentence = sentence.charAt(0).toUpperCase() + sentence.slice(1) + '.';
  if (dom.restricted && dow.restricted) {
    sentence += ' (Both day fields are set — cron runs when either matches.)';
  }
  return sentence;
}

/* ─── Next-run search (bounded to one year) ─────────────────────────── */

const MAX_SEARCH_MINUTES = 366 * 24 * 60;

function computeNextRuns(parsed: ParsedField[], count = 5): { runs: Date[]; exhausted: boolean } {
  const [minute, hour, dom, month, dow] = parsed;
  const runs: Date[] = [];

  const cursor = new Date();
  cursor.setSeconds(0, 0);
  cursor.setMinutes(cursor.getMinutes() + 1);

  const start = cursor.getTime();
  let searched = 0;

  while (runs.length < count && searched < MAX_SEARCH_MINUTES) {
    if (
      minute.values.has(cursor.getMinutes()) &&
      hour.values.has(cursor.getHours()) &&
      month.values.has(cursor.getMonth() + 1)
    ) {
      const dayOk = dom.values.has(cursor.getDate());
      const weekOk = dow.values.has(cursor.getDay());
      const dayMatches =
        dom.restricted && dow.restricted ? dayOk || weekOk : dayOk && weekOk;
      if (dayMatches) runs.push(new Date(cursor));
    }
    cursor.setMinutes(cursor.getMinutes() + 1);
    searched++;
  }

  return { runs, exhausted: searched >= MAX_SEARCH_MINUTES };
}

/* ─── Component ──────────────────────────────────────────────────────── */

const PRESETS: { label: string; fields: string[] }[] = [
  { label: 'Every 5 minutes', fields: ['*/5', '*', '*', '*', '*'] },
  { label: 'Hourly', fields: ['0', '*', '*', '*', '*'] },
  { label: 'Daily at 02:30', fields: ['30', '2', '*', '*', '*'] },
  { label: 'Weekdays at 09:00', fields: ['0', '9', '*', '*', '1-5'] },
  { label: 'Monthly on the 1st', fields: ['0', '0', '1', '*', '*'] },
  { label: 'Sundays at midnight', fields: ['0', '0', '*', '*', '0'] },
];

function tzLabel(): string {
  try {
    const zone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    const offset = -new Date().getTimezoneOffset();
    const sign = offset >= 0 ? '+' : '−';
    const hh = String(Math.floor(Math.abs(offset) / 60)).padStart(2, '0');
    const mm = String(Math.abs(offset) % 60).padStart(2, '0');
    return `${zone} (UTC${sign}${hh}:${mm})`;
  } catch {
    return 'local time';
  }
}

export default function CronExplainer() {
  const [fields, setFields] = useState(['*/5', '*', '*', '*', '*']);
  const debounced = useDebouncedValue(fields, 150);
  const timezone = useMemo(() => tzLabel(), []);

  const analysis = useMemo(() => {
    const parsed: ParsedField[] = [];
    const errors: (string | null)[] = [];
    for (let i = 0; i < FIELDS.length; i++) {
      try {
        parsed.push(parseCronField(debounced[i] ?? '', FIELDS[i]));
        errors.push(null);
      } catch (error) {
        parsed.push(null as unknown as ParsedField);
        errors.push(error instanceof Error ? error.message : 'Invalid field');
      }
    }
    const valid = errors.every((e) => e === null);
    if (!valid) return { valid: false as const, errors };
    return {
      valid: true as const,
      errors,
      sentence: explainCron(debounced, parsed),
      next: computeNextRuns(parsed),
    };
  }, [debounced]);

  const expression = fields.join(' ');
  const hasError = !analysis.valid;

  return (
    <div className="space-y-5">
      <Panel label="Expression">
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
          {FIELDS.map((def, i) => {
            const error = !analysis.valid ? analysis.errors[i] : null;
            return (
              <div key={def.kind}>
                <label
                  htmlFor={`cron-${def.kind}`}
                  className="font-mono text-[10px] uppercase tracking-[0.15em] text-ink/50"
                >
                  {def.label}
                  <span className="ms-1 text-ink/35">
                    {def.min}–{def.max}
                    {def.names ? ' or names' : ''}
                  </span>
                </label>
                <Input
                  id={`cron-${def.kind}`}
                  value={fields[i]}
                  spellCheck={false}
                  aria-invalid={error ? true : undefined}
                  onChange={(event) =>
                    setFields(fields.map((f, j) => (j === i ? event.target.value : f)))
                  }
                  className="mt-2 h-10 font-mono text-[13px]"
                />
                {error && <p className="mt-1.5 text-[12px] text-destructive">{error}</p>}
              </div>
            );
          })}
        </div>

        <div className="mt-6 flex flex-wrap items-center justify-between gap-3 border-t border-ink/10 pt-5">
          <p className="font-mono text-[13px] tracking-wide text-ink">
            <span className="select-all">{expression}</span>
          </p>
          <CopyButton value={() => expression} ariaLabel="Copy cron expression" />
        </div>

        <div className="mt-5 flex flex-wrap items-center gap-2">
          <span className="me-1 font-mono text-[10px] uppercase tracking-[0.15em] text-ink/45">
            Presets
          </span>
          {PRESETS.map((preset) => (
            <button
              key={preset.label}
              type="button"
              onClick={() => setFields(preset.fields)}
              className="cursor-pointer rounded-full border border-ink/15 px-3.5 py-1.5 font-mono text-[10px] uppercase tracking-[0.12em] text-ink/60 transition-colors duration-300 hover:border-ink/40 hover:text-ink"
            >
              {preset.label}
            </button>
          ))}
        </div>
      </Panel>

      <Panel label="Plain English" accent="bg-gold">
        {analysis.valid ? (
          <p className="font-serif text-xl font-light italic leading-relaxed tracking-tight text-ink/85 sm:text-2xl">
            {analysis.sentence}
          </p>
        ) : (
          <p className="text-sm leading-relaxed text-ink/55">
            Fix the highlighted fields above and the plain-English translation
            appears here.
          </p>
        )}
      </Panel>

      <Panel
        label="Next 5 runs"
        actions={
          <span className="font-mono text-[10px] uppercase tracking-[0.15em] text-ink/45">
            {timezone}
          </span>
        }
      >
        {analysis.valid ? (
          analysis.next.runs.length > 0 ? (
            <ol className="divide-y divide-ink/10">
              {analysis.next.runs.map((run) => (
                <li key={run.getTime()} className="flex items-baseline gap-4 py-3 first:pt-0 last:pb-0">
                  <span className="font-mono text-[11px] text-gold">
                    {String(run.toLocaleString('en', { weekday: 'short' }))}
                  </span>
                  <span className="font-mono text-[13px] text-ink/80">
                    {run.toLocaleString('en', { dateStyle: 'medium', timeStyle: 'short' })}
                  </span>
                </li>
              ))}
            </ol>
          ) : (
            <p className="text-sm leading-relaxed text-ink/55">
              This expression never matches within the next year — the day of
              month and month fields may describe an impossible date (the 31st
              of February, for instance).
            </p>
          )
        ) : (
          <p className="text-sm italic text-ink/40">Next run times appear once the expression is valid.</p>
        )}
        {analysis.valid && analysis.next.exhausted && analysis.next.runs.length > 0 && (
          <p className="mt-4 border-t border-ink/10 pt-4 text-[13px] leading-relaxed text-ink/45">
            Only {analysis.next.runs.length} occurrence{analysis.next.runs.length === 1 ? '' : 's'}
            exist within the next year.
          </p>
        )}
        {analysis.valid && !analysis.next.exhausted && analysis.next.runs.length > 0 && (
          <p className="mt-4 border-t border-ink/10 pt-4 text-[13px] leading-relaxed text-ink/45">
            Searched minute by minute in your timezone, bounded to one year ahead.
          </p>
        )}
      </Panel>
    </div>
  );
}
