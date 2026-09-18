'use client';

import { useEffect, useMemo, useState } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import Panel from './Panel';
import CopyButton from './CopyButton';
import Segmented from './Segmented';

/* ─── Timezone helpers (Intl-based, no libraries) ─────────────────────── */

function getPartsInZone(ms: number, timeZone: string): Record<string, string> {
  const formatter = new Intl.DateTimeFormat('en-CA', {
    timeZone,
    hourCycle: 'h23',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  });
  const parts: Record<string, string> = {};
  for (const part of formatter.formatToParts(new Date(ms))) {
    if (part.type !== 'literal') parts[part.type] = part.value;
  }
  return parts;
}

function zoneOffsetMs(ms: number, timeZone: string): number {
  const p = getPartsInZone(ms, timeZone);
  const asUtc = Date.UTC(+p.year, +p.month - 1, +p.day, +p.hour, +p.minute, +p.second);
  return asUtc - ms;
}

/** Wall-clock string "YYYY-MM-DDTHH:MM[:SS]" interpreted in `timeZone`. */
function zonedWallTimeToMs(wall: string, timeZone: string): number {
  const normalized = wall.length === 16 ? `${wall}:00` : wall;
  const guess = Date.parse(`${normalized}Z`);
  if (Number.isNaN(guess)) return NaN;
  return guess - zoneOffsetMs(guess, timeZone);
}

function isoInZone(ms: number, timeZone: string): string {
  const p = getPartsInZone(ms, timeZone);
  const offset = zoneOffsetMs(ms, timeZone);
  const sign = offset >= 0 ? '+' : '-';
  const abs = Math.abs(offset) / 60000;
  const oh = String(Math.floor(abs / 60)).padStart(2, '0');
  const om = String(Math.floor(abs % 60)).padStart(2, '0');
  return `${p.year}-${p.month}-${p.day}T${p.hour}:${p.minute}:${p.second}${sign}${oh}:${om}`;
}

function humanInZone(ms: number, timeZone: string): string {
  return new Intl.DateTimeFormat('en', {
    timeZone,
    weekday: 'short',
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hourCycle: 'h23',
  }).format(new Date(ms));
}

function relativeTime(target: number, now: number): string {
  const rtf = new Intl.RelativeTimeFormat('en', { numeric: 'auto' });
  const diff = (target - now) / 1000;
  const abs = Math.abs(diff);
  if (abs < 60) return rtf.format(Math.round(diff), 'second');
  if (abs < 3600) return rtf.format(Math.round(diff / 60), 'minute');
  if (abs < 86400) return rtf.format(Math.round(diff / 3600), 'hour');
  if (abs < 2592000) return rtf.format(Math.round(diff / 86400), 'day');
  if (abs < 31536000) return rtf.format(Math.round(diff / 2592000), 'month');
  return rtf.format(Math.round(diff / 31536000), 'year');
}

function timeZones(): string[] {
  let local = 'Local';
  try {
    local = Intl.DateTimeFormat().resolvedOptions().timeZone;
  } catch {
    /* keep fallback */
  }
  try {
    const all = Intl.supportedValuesOf('timeZone') as string[];
    return all.includes(local) ? all : [local, ...all];
  } catch {
    return [local, 'UTC'];
  }
}

type FieldId = 'unix' | 'iso' | 'human';

export default function TimestampConverter() {
  const [ms, setMs] = useState<number | null>(() => Date.now());
  const [draft, setDraft] = useState<{ id: FieldId; value: string } | null>(null);
  const [unit, setUnit] = useState<'s' | 'ms'>('s');
  const [timeZone, setTimeZone] = useState<string>(() => {
    try {
      return Intl.DateTimeFormat().resolvedOptions().timeZone;
    } catch {
      return 'UTC';
    }
  });
  const [errors, setErrors] = useState<Partial<Record<FieldId, string>>>({});

  const [now, setNow] = useState(() => Date.now());
  useEffect(() => {
    const id = window.setInterval(() => setNow(Date.now()), 1000);
    return () => window.clearInterval(id);
  }, []);

  const zones = useMemo(() => timeZones(), []);

  /* Displayed strings are derived from the instant; the field being typed
     in shows its raw draft until another field takes over. */
  const display = (id: FieldId): string => {
    if (draft?.id === id) return draft.value;
    if (ms === null) return '';
    if (id === 'unix') return unit === 's' ? String(Math.floor(ms / 1000)) : String(ms);
    if (id === 'iso') return isoInZone(ms, timeZone);
    const p = getPartsInZone(ms, timeZone);
    return `${p.year}-${p.month}-${p.day}T${p.hour}:${p.minute}`;
  };
  const unixStr = display('unix');
  const isoStr = display('iso');
  const humanStr = display('human');

  const applyMs = (value: number, field: FieldId) => {
    setMs(value);
    setErrors({ ...errors, [field]: undefined });
  };

  const applyError = (field: FieldId, message: string) => {
    setErrors({ ...errors, [field]: message });
  };

  const onUnixChange = (raw: string) => {
    setDraft({ id: 'unix', value: raw });
    const trimmed = raw.trim();
    if (trimmed === '') {
      applyError('unix', 'Enter a number — seconds or milliseconds.');
      return;
    }
    if (!/^-?\d+$/.test(trimmed)) {
      applyError('unix', 'Unix timestamps are plain integers, like 1760000000.');
      return;
    }
    const value = Number(trimmed);
    // Sensible guess: 10 digits is seconds, 13 digits is milliseconds.
    let result = NaN;
    if (unit === 's') result = value > 1e11 ? value : value * 1000;
    else result = value >= 1e9 && value < 1e11 ? value * 1000 : value;
    if (Math.abs(result) > 8.64e15) {
      applyError('unix', 'That number is outside the representable date range.');
      return;
    }
    applyMs(result, 'unix');
  };

  const onIsoChange = (raw: string) => {
    setDraft({ id: 'iso', value: raw });
    const trimmed = raw.trim();
    if (trimmed === '') {
      applyError('iso', 'Enter an ISO 8601 string, like 2026-09-18T14:30:00Z.');
      return;
    }
    let parsed = Date.parse(trimmed);
    if (Number.isNaN(parsed) && /^\d{4}-\d{2}-\d{2}([T ]\d{2}:\d{2}(:\d{2})?)?$/.test(trimmed)) {
      // Zoneless ISO — interpret in the selected timezone.
      const wall = trimmed.replace(' ', 'T');
      const withTime = wall.length === 10 ? `${wall}T00:00` : wall;
      parsed = zonedWallTimeToMs(withTime, timeZone);
    }
    if (Number.isNaN(parsed)) {
      applyError('iso', 'Not a recognized ISO 8601 date-time.');
      return;
    }
    applyMs(parsed, 'iso');
  };

  const onHumanChange = (raw: string) => {
    setDraft({ id: 'human', value: raw });
    if (raw === '') {
      applyError('human', 'Pick a date and time.');
      return;
    }
    const parsed = zonedWallTimeToMs(raw, timeZone);
    if (Number.isNaN(parsed)) {
      applyError('human', 'Could not read that date and time.');
      return;
    }
    applyMs(parsed, 'human');
  };

  const useNow = () => {
    setDraft(null);
    setErrors({});
    setMs(Date.now());
  };

  const unixNowSeconds = Math.floor(now / 1000);
  const zoneOffset = zoneOffsetMs(now, timeZone);
  const zoneOffsetLabel = `UTC${zoneOffset >= 0 ? '+' : '−'}${String(Math.floor(Math.abs(zoneOffset) / 60000 / 60)).padStart(2, '0')}:${String(Math.round((Math.abs(zoneOffset) / 60000) % 60)).padStart(2, '0')}`;

  const inputClass = 'h-11 font-mono text-[13px]';
  const errorText = (field: FieldId) =>
    errors[field] ? <p className="mt-1.5 text-[12px] text-destructive">{errors[field]}</p> : null;

  return (
    <div className="space-y-5">
      {/* Live now ticker */}
      <div className="flex flex-wrap items-center justify-between gap-x-8 gap-y-3 rounded-md border border-ink/10 bg-card px-5 py-4">
        <p className="flex items-center gap-3 font-mono text-[13px] text-ink/80">
          <span
            aria-hidden="true"
            className="inline-block h-[7px] w-[7px] animate-pulse rounded-[1px] rotate-45 bg-gold motion-reduce:animate-none"
          />
          <span className="text-[10px] uppercase tracking-[0.2em] text-ink/45">Now</span>
          <span className="select-all tabular-nums">{unixNowSeconds}</span>
        </p>
        <div className="flex flex-wrap items-center gap-6">
          <p className="font-mono text-[11px] text-ink/50">
            {humanInZone(now, timeZone)} <span className="text-ink/40">{zoneOffsetLabel}</span>
          </p>
          <CopyButton value={() => String(unixNowSeconds)} label="Copy unix" />
          <button
            type="button"
            onClick={useNow}
            className="cursor-pointer rounded-full bg-ink px-4 py-2 font-mono text-[10px] uppercase tracking-[0.15em] text-paper transition-colors duration-300 hover:bg-viridian"
          >
            Set to now
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
        {/* Unix */}
        <Panel
          label="Unix timestamp"
          actions={
            <Segmented
              ariaLabel="Unix unit"
              value={unit}
              onChange={(value) => {
                setUnit(value);
                setEdited(null);
              }}
              options={[
                { value: 's', label: 's' },
                { value: 'ms', label: 'ms' },
              ]}
            />
          }
        >
          <Label htmlFor="ts-unix" className="sr-only">
            Unix timestamp
          </Label>
          <Input
            id="ts-unix"
            value={unixStr}
            onChange={(event) => onUnixChange(event.target.value)}
            placeholder="1760000000"
            spellCheck={false}
            inputMode="numeric"
            aria-invalid={errors.unix ? true : undefined}
            className={inputClass}
          />
          {errorText('unix')}
          {ms !== null && !errors.unix && (
            <p className="mt-3 font-mono text-[11px] uppercase tracking-[0.12em] text-ink/45">
              {relativeTime(ms, now)}
            </p>
          )}
        </Panel>

        {/* ISO */}
        <Panel label="ISO 8601">
          <Label htmlFor="ts-iso" className="sr-only">
            ISO 8601 date-time
          </Label>
          <Input
            id="ts-iso"
            value={isoStr}
            onChange={(event) => onIsoChange(event.target.value)}
            placeholder="2026-09-18T14:30:00+03:00"
            spellCheck={false}
            aria-invalid={errors.iso ? true : undefined}
            className={inputClass}
          />
          {errorText('iso')}
          {ms !== null && !errors.iso && (
            <p className="mt-3 font-mono text-[11px] uppercase tracking-[0.12em] text-ink/45">
              {relativeTime(ms, now)}
            </p>
          )}
        </Panel>

        {/* Human */}
        <Panel label="Human readable">
          <Label htmlFor="ts-human" className="sr-only">
            Human readable local date and time
          </Label>
          <input
            id="ts-human"
            type="datetime-local"
            value={humanStr}
            onChange={(event) => onHumanChange(event.target.value)}
            aria-invalid={errors.human ? true : undefined}
            className="h-11 w-full rounded-md border border-input bg-transparent px-3 font-mono text-[13px] outline-none transition-[color,box-shadow] focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:border-destructive"
          />
          {errorText('human')}
          {ms !== null && !errors.human && (
            <p className="mt-3 font-mono text-[11px] uppercase tracking-[0.12em] text-ink/45">
              {relativeTime(ms, now)}
            </p>
          )}
        </Panel>
      </div>

      {/* Timezone */}
      <Panel label="Timezone">
        <div className="flex flex-wrap items-center gap-x-6 gap-y-3">
          <select
            value={timeZone}
            onChange={(event) => {
              setTimeZone(event.target.value);
              setEdited(null);
            }}
            aria-label="Display timezone"
            className="h-9 max-w-full cursor-pointer rounded-md border border-ink/15 bg-transparent px-3 font-mono text-[12px] text-ink/75 outline-none transition-colors focus-visible:border-ring"
          >
            {zones.map((zone) => (
              <option key={zone} value={zone}>
                {zone}
              </option>
            ))}
          </select>
          <p className="text-[13px] text-ink/50">
            All displayed times are rendered in{' '}
            <span className="font-mono text-ink/75">{timeZone}</span> ({zoneOffsetLabel}) —
            the instant itself never changes.
          </p>
        </div>
      </Panel>
    </div>
  );
}
