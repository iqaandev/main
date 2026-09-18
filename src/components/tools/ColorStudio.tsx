'use client';

import { useMemo, useState } from 'react';
import { ArrowUpDown } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import Panel from './Panel';
import CopyButton from './CopyButton';

/* ─── Color math — no dependencies ───────────────────────────────────── */

interface Rgb {
  r: number;
  g: number;
  b: number;
}

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

function normalizeHex(input: string): string | null {
  const trimmed = input.trim().replace(/^#/, '');
  if (/^[0-9a-fA-F]{3}$/.test(trimmed)) {
    return `#${trimmed
      .split('')
      .map((c) => c + c)
      .join('')
      .toLowerCase()}`;
  }
  if (/^[0-9a-fA-F]{6}$/.test(trimmed)) return `#${trimmed.toLowerCase()}`;
  return null;
}

function hexToRgb(hex: string): Rgb {
  const value = hex.replace('#', '');
  return {
    r: parseInt(value.slice(0, 2), 16),
    g: parseInt(value.slice(2, 4), 16),
    b: parseInt(value.slice(4, 6), 16),
  };
}

function rgbToHex({ r, g, b }: Rgb): string {
  return `#${[r, g, b]
    .map((c) => clamp(Math.round(c), 0, 255).toString(16).padStart(2, '0'))
    .join('')}`;
}

function rgbToHsl({ r, g, b }: Rgb): { h: number; s: number; l: number } {
  const rn = r / 255;
  const gn = g / 255;
  const bn = b / 255;
  const max = Math.max(rn, gn, bn);
  const min = Math.min(rn, gn, bn);
  const l = (max + min) / 2;
  let h = 0;
  let s = 0;
  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case rn:
        h = ((gn - bn) / d + (gn < bn ? 6 : 0)) * 60;
        break;
      case gn:
        h = ((bn - rn) / d + 2) * 60;
        break;
      default:
        h = ((rn - gn) / d + 4) * 60;
    }
  }
  return { h: Math.round(h), s: Math.round(s * 100), l: Math.round(l * 100) };
}

function hslToRgb(h: number, s: number, l: number): Rgb {
  const sn = s / 100;
  const ln = l / 100;
  const c = (1 - Math.abs(2 * ln - 1)) * sn;
  const hp = ((h % 360) + 360) % 360;
  const x = c * (1 - Math.abs(((hp / 60) % 2) - 1));
  const m = ln - c / 2;
  const [rn, gn, bn] =
    hp < 60 ? [c, x, 0] : hp < 120 ? [x, c, 0] : hp < 180 ? [0, c, x] : hp < 240 ? [0, x, c] : hp < 300 ? [x, 0, c] : [c, 0, x];
  return { r: (rn + m) * 255, g: (gn + m) * 255, b: (bn + m) * 255 };
}

function rgbString({ r, g, b }: Rgb): string {
  return `rgb(${Math.round(r)}, ${Math.round(g)}, ${Math.round(b)})`;
}

function hslString(hsl: { h: number; s: number; l: number }): string {
  return `hsl(${hsl.h}, ${hsl.s}%, ${hsl.l}%)`;
}

/* WCAG 2.x relative luminance + contrast ratio */
function relativeLuminance({ r, g, b }: Rgb): number {
  const channel = (c: number) => {
    const v = c / 255;
    return v <= 0.04045 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
  };
  return 0.2126 * channel(r) + 0.7152 * channel(g) + 0.0722 * channel(b);
}

function contrastRatio(a: Rgb, b: Rgb): number {
  const la = relativeLuminance(a);
  const lb = relativeLuminance(b);
  const [lighter, darker] = la >= lb ? [la, lb] : [lb, la];
  return (lighter + 0.05) / (darker + 0.05);
}

/* ─── Component ──────────────────────────────────────────────────────── */

const DEFAULT_BASE: Rgb = { r: 66, g: 107, b: 91 }; // ≈ the studio viridian

function Swatch({
  rgb,
  onAdopt,
  size = 'md',
}: {
  rgb: Rgb;
  onAdopt?: (rgb: Rgb) => void;
  size?: 'md' | 'lg';
}) {
  const hex = rgbToHex(rgb);
  const contrastOnSwatch = contrastRatio(rgb, { r: 255, g: 255, b: 255 }) > contrastRatio(rgb, { r: 0, g: 0, b: 0 }) ? '#ffffff' : '#101614';
  const className = `relative flex w-full items-end justify-center overflow-hidden rounded-md border border-ink/10 ${
    size === 'lg' ? 'h-44' : 'h-20'
  }`;

  if (!onAdopt) {
    return (
      <div className={className} style={{ backgroundColor: hex }}>
        <span
          className="mb-2 font-mono text-[11px] uppercase tracking-[0.12em] opacity-80"
          style={{ color: contrastOnSwatch }}
        >
          {hex}
        </span>
      </div>
    );
  }

  return (
    <button
      type="button"
      onClick={() => onAdopt(rgb)}
      title={`${hex} — click to adopt as base`}
      aria-label={`Adopt ${hex} as the base color`}
      className={`group ${className} cursor-pointer transition-transform duration-300 hover:scale-[1.03] focus-visible:scale-[1.03] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-viridian motion-reduce:transition-none motion-reduce:hover:scale-100`}
      style={{ backgroundColor: hex }}
    >
      <span
        className="mb-2 font-mono text-[11px] uppercase tracking-[0.12em] opacity-80"
        style={{ color: contrastOnSwatch }}
      >
        {hex}
      </span>
    </button>
  );
}

export default function ColorStudio() {
  const [base, setBase] = useState<Rgb>(DEFAULT_BASE);
  const [hexInput, setHexInput] = useState(rgbToHex(DEFAULT_BASE));
  const [hexError, setHexError] = useState<string | null>(null);
  const [fg, setFg] = useState<Rgb>({ r: 250, g: 250, b: 247 }); // paper
  const [bg, setBg] = useState<Rgb>({ r: 26, g: 38, b: 34 }); // ink

  const baseHsl = useMemo(() => rgbToHsl(base), [base]);

  const adoptBase = (next: Rgb) => {
    setBase(next);
    setHexInput(rgbToHex(next));
    setHexError(null);
  };

  const onHexChange = (raw: string) => {
    setHexInput(raw);
    const normalized = normalizeHex(raw);
    if (normalized) {
      setBase(hexToRgb(normalized));
      setHexError(null);
    } else if (raw.trim() === '') {
      setHexError('Enter a hex value like #1a2622.');
    } else {
      setHexError('Not a valid hex color — 3 or 6 hex digits.');
    }
  };

  const setRgbChannel = (channel: 'r' | 'g' | 'b', value: number) => {
    const next = { ...base, [channel]: clamp(value, 0, 255) };
    adoptBase(next);
  };

  const setHslValue = (channel: 'h' | 's' | 'l', value: number) => {
    const next = { ...baseHsl, [channel]: channel === 'h' ? ((value % 360) + 360) % 360 : clamp(value, 0, 100) };
    adoptBase(hslToRgb(next.h, next.s, next.l));
  };

  const harmonies: { label: string; colors: Rgb[] }[] = useMemo(() => {
    const { h, s, l } = baseHsl;
    const at = (dh: number, dl = 0): Rgb => hslToRgb(h + dh, s, clamp(l + dl, 4, 96));
    return [
      { label: 'Complementary', colors: [base, at(180)] },
      { label: 'Analogous', colors: [at(-30), base, at(30)] },
      { label: 'Triadic', colors: [at(120), base, at(240)] },
      {
        label: 'Monochrome',
        colors: [at(0, 34), at(0, 17), base, at(0, -17), at(0, -34)],
      },
    ];
  }, [base, baseHsl]);

  const ratio = useMemo(() => contrastRatio(fg, bg), [fg, bg]);
  const badges: { label: string; threshold: number; pass: boolean }[] = [
    { label: 'AA · normal text', threshold: 4.5, pass: ratio >= 4.5 },
    { label: 'AAA · normal text', threshold: 7, pass: ratio >= 7 },
    { label: 'AA · large text', threshold: 3, pass: ratio >= 3 },
    { label: 'AAA · large text', threshold: 4.5, pass: ratio >= 4.5 },
  ];

  const numberInput = (
    id: string,
    label: string,
    value: number,
    min: number,
    max: number,
    onChange: (value: number) => void
  ) => (
    <div>
      <Label htmlFor={id} className="font-mono text-[10px] uppercase tracking-[0.15em] text-ink/45">
        {label}
      </Label>
      <Input
        id={id}
        type="number"
        min={min}
        max={max}
        value={Math.round(value)}
        onChange={(event) => {
          const next = Number(event.target.value);
          if (!Number.isNaN(next)) onChange(next);
        }}
        className="mt-1.5 h-9 font-mono text-[12px]"
      />
    </div>
  );

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-1 gap-5 lg:grid-cols-[1fr_1.2fr]">
        {/* Base color */}
        <Panel label="Base color" accent="bg-viridian">
          <Swatch rgb={base} size="lg" />
          <div className="mt-5">
            <Label htmlFor="cs-hex" className="font-mono text-[10px] uppercase tracking-[0.15em] text-ink/45">
              Hex
            </Label>
            <div className="mt-1.5 flex items-center gap-3">
              <input
                type="color"
                value={rgbToHex(base)}
                onChange={(event) => adoptBase(hexToRgb(event.target.value))}
                aria-label="Pick base color"
                className="h-10 w-12 cursor-pointer rounded-md border border-ink/15 bg-transparent p-1"
              />
              <Input
                id="cs-hex"
                value={hexInput}
                onChange={(event) => onHexChange(event.target.value)}
                placeholder="#1a2622"
                spellCheck={false}
                aria-invalid={hexError ? true : undefined}
                className="h-10 font-mono text-[13px]"
              />
            </div>
            {hexError && <p className="mt-1.5 text-[12px] text-destructive">{hexError}</p>}
          </div>

          <div className="mt-5 grid grid-cols-3 gap-3">
            {numberInput('cs-r', 'R · 0–255', base.r, 0, 255, (v) => setRgbChannel('r', v))}
            {numberInput('cs-g', 'G · 0–255', base.g, 0, 255, (v) => setRgbChannel('g', v))}
            {numberInput('cs-b', 'B · 0–255', base.b, 0, 255, (v) => setRgbChannel('b', v))}
          </div>
          <div className="mt-4 grid grid-cols-3 gap-3">
            {numberInput('cs-h', 'H · 0–360', baseHsl.h, 0, 360, (v) => setHslValue('h', v))}
            {numberInput('cs-s', 'S · 0–100', baseHsl.s, 0, 100, (v) => setHslValue('s', v))}
            {numberInput('cs-l', 'L · 0–100', baseHsl.l, 0, 100, (v) => setHslValue('l', v))}
          </div>
        </Panel>

        {/* Values + harmonies */}
        <div className="space-y-5">
          <Panel label="Current values">
            <dl className="divide-y divide-ink/10">
              {[
                { label: 'Hex', value: rgbToHex(base) },
                { label: 'RGB', value: rgbString(base) },
                { label: 'HSL', value: hslString(baseHsl) },
              ].map((row) => (
                <div key={row.label} className="flex items-center justify-between gap-4 py-3 first:pt-0 last:pb-0">
                  <dt className="font-mono text-[11px] uppercase tracking-[0.15em] text-ink/45">
                    {row.label}
                  </dt>
                  <dd className="flex items-center gap-4">
                    <span className="select-all font-mono text-[13px] text-ink/85">{row.value}</span>
                    <CopyButton value={() => row.value} ariaLabel={`Copy ${row.label} value`} />
                  </dd>
                </div>
              ))}
            </dl>
          </Panel>

          <Panel label="Harmonies — click a swatch to adopt">
            <div className="space-y-4">
              {harmonies.map((harmony) => (
                <div key={harmony.label}>
                  <p className="font-mono text-[10px] uppercase tracking-[0.15em] text-ink/45">
                    {harmony.label}
                  </p>
                  <div className="mt-2 grid grid-cols-5 gap-2">
                    {harmony.colors.map((color, i) => (
                      <Swatch key={`${harmony.label}-${i}`} rgb={color} onAdopt={adoptBase} />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </Panel>
        </div>
      </div>

      {/* Contrast checker */}
      <Panel label="WCAG contrast checker" accent="bg-gold">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-[1fr_auto] md:items-center">
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            {(
              [
                { id: 'fg', label: 'Foreground', color: fg, setColor: setFg },
                { id: 'bg', label: 'Background', color: bg, setColor: setBg },
              ] as const
            ).map(({ id, label, color, setColor }) => (
              <div key={id}>
                <Label htmlFor={`cc-${id}`} className="font-mono text-[10px] uppercase tracking-[0.15em] text-ink/45">
                  {label}
                </Label>
                <div className="mt-1.5 flex items-center gap-3">
                  <input
                    type="color"
                    value={rgbToHex(color)}
                    onChange={(event) => setColor(hexToRgb(event.target.value))}
                    aria-label={`Pick ${label.toLowerCase()} color`}
                    className="h-10 w-12 cursor-pointer rounded-md border border-ink/15 bg-transparent p-1"
                  />
                  <Input
                    id={`cc-${id}`}
                    value={rgbToHex(color)}
                    onChange={(event) => {
                      const normalized = normalizeHex(event.target.value);
                      if (normalized) setColor(hexToRgb(normalized));
                    }}
                    spellCheck={false}
                    className="h-10 font-mono text-[13px]"
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="flex items-center gap-5 md:flex-col md:gap-3 md:pe-2 md:text-center">
            <button
              type="button"
              onClick={() => {
                setFg(bg);
                setBg(fg);
              }}
              aria-label="Swap foreground and background"
              className="inline-flex cursor-pointer items-center gap-2 font-mono text-[10px] uppercase tracking-[0.15em] text-ink/45 transition-colors duration-300 hover:text-ink"
            >
              <ArrowUpDown aria-hidden="true" className="h-3.5 w-3.5" />
              Swap
            </button>
            <p className="font-serif text-5xl font-light tabular-nums tracking-tight text-ink">
              {ratio.toFixed(2)}
              <span className="ms-1 font-mono text-sm text-ink/45">:1</span>
            </p>
          </div>
        </div>

        {/* Preview + badges */}
        <div className="mt-6 grid grid-cols-1 gap-5 border-t border-ink/10 pt-6 sm:grid-cols-2">
          <div
            className="flex min-h-[110px] flex-col items-center justify-center gap-1.5 rounded-md border border-ink/10 p-5"
            style={{ backgroundColor: rgbToHex(bg), color: rgbToHex(fg) }}
          >
            <p className="text-lg font-semibold">The quick brown fox jumps</p>
            <p className="text-[13px]">
              Large text is 18.7px bold or 24px regular and above.
            </p>
            <p className="font-mono text-[10px] uppercase tracking-[0.15em] opacity-70">
              {rgbToHex(fg)} on {rgbToHex(bg)}
            </p>
          </div>
          <ul className="grid grid-cols-1 gap-2.5 sm:grid-cols-2 sm:content-center">
            {badges.map((badge) => (
              <li
                key={badge.label}
                className={`flex items-center justify-between gap-3 rounded-md border px-4 py-3 font-mono text-[10px] uppercase tracking-[0.12em] ${
                  badge.pass
                    ? 'border-viridian/40 bg-viridian/10 text-viridian'
                    : 'border-destructive/35 bg-destructive/5 text-destructive'
                }`}
              >
                {badge.label}
                <span aria-hidden="true" className="text-[13px]">
                  {badge.pass ? '✓' : '✕'}
                </span>
                <span className="sr-only">{badge.pass ? 'pass' : 'fail'}</span>
              </li>
            ))}
          </ul>
        </div>
      </Panel>
    </div>
  );
}
