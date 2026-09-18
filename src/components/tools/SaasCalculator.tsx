'use client';

import { useMemo, useState } from 'react';
import { Input } from '@/components/ui/input';
import Panel from './Panel';
import { calculateSaas, formatUsd } from '@/lib/tools/models';

const HEALTH_STYLES = {
  healthy: { text: 'text-viridian', label: 'Healthy — ≥ 3' },
  watch: { text: 'text-ink', label: 'Watch — 1 to 3' },
  unsustainable: { text: 'text-destructive', label: 'Unsustainable — < 1' },
} as const;

function Field({
  label,
  suffix,
  value,
  onChange,
  min = 0,
  step = 1,
  max,
}: {
  label: string;
  suffix?: string;
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  step?: number;
}) {
  return (
    <label className="block">
      <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-ink/45">
        {label}
        {suffix ? ` (${suffix})` : ''}
      </span>
      <Input
        type="number"
        inputMode="decimal"
        value={Number.isFinite(value) ? value : ''}
        min={min}
        max={max}
        step={step}
        onChange={(event) => {
          const parsed = Number.parseFloat(event.target.value);
          onChange(Number.isFinite(parsed) ? parsed : 0);
        }}
        className="mt-2 h-11 font-mono text-[13px] tabular-nums"
      />
    </label>
  );
}

export default function SaasCalculator() {
  const [price, setPrice] = useState(50);
  const [marginPct, setMarginPct] = useState(80);
  const [churnPct, setChurnPct] = useState(3);
  const [cac, setCac] = useState(300);
  const [subscribers, setSubscribers] = useState(200);
  const [growthPct, setGrowthPct] = useState(4);

  const result = useMemo(
    () =>
      calculateSaas({
        price: Math.max(0, price),
        grossMarginPct: marginPct,
        monthlyChurnPct: churnPct,
        cac: Math.max(0, cac),
        subscribers: Math.max(0, Math.round(subscribers)),
        netGrowthPct: growthPct,
      }),
    [price, marginPct, churnPct, cac, subscribers, growthPct]
  );

  const health = HEALTH_STYLES[result.health];
  const maxMrr = Math.max(...result.projection.map((p) => p.mrr), result.mrr, 1);
  const finalMrr = result.projection[result.projection.length - 1]?.mrr ?? result.mrr;

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-1 gap-5 lg:grid-cols-[minmax(0,2fr)_minmax(0,3fr)]">
        {/* Inputs */}
        <Panel label="Your numbers">
          <div className="grid grid-cols-2 gap-x-4 gap-y-5">
            <Field label="Monthly price" suffix="$" value={price} onChange={setPrice} step={5} />
            <Field label="Gross margin" suffix="%" value={marginPct} onChange={setMarginPct} max={100} />
            <Field label="Monthly churn" suffix="%" value={churnPct} onChange={setChurnPct} step={0.5} />
            <Field label="CAC" suffix="$" value={cac} onChange={setCac} step={25} />
            <Field label="Subscribers" value={subscribers} onChange={setSubscribers} step={10} />
            <Field label="Net growth / mo" suffix="%" value={growthPct} onChange={setGrowthPct} step={0.5} />
          </div>
          <p className="mt-5 border-t border-ink/10 pt-4 font-mono text-[10px] uppercase tracking-[0.15em] leading-relaxed text-ink/40">
            Net growth = new subscribers − churned, as % of the current base
          </p>
        </Panel>

        {/* Headline ratio */}
        <Panel label="LTV : CAC" accent="bg-viridian">
          <div className="flex flex-wrap items-end justify-between gap-x-8 gap-y-4">
            <p className={`font-serif text-5xl font-light leading-none tracking-tight tabular-nums sm:text-6xl ${health.text}`}>
              {Number.isFinite(result.ltvToCac) ? result.ltvToCac.toFixed(1) : '∞'}
            </p>
            <p className={`font-mono text-[11px] uppercase tracking-[0.18em] ${health.text}`}>
              {health.label}
            </p>
          </div>
          <div className="mt-6 grid grid-cols-2 gap-x-6 gap-y-4 border-t border-ink/10 pt-5 sm:grid-cols-4">
            <Metric label="LTV" value={formatUsd(result.ltv)} />
            <Metric label="CAC" value={formatUsd(cac)} />
            <Metric
              label="CAC payback"
              value={
                Number.isFinite(result.cacPaybackMonths)
                  ? `${result.cacPaybackMonths.toFixed(1)} mo`
                  : '—'
              }
            />
            <Metric label="MRR" value={formatUsd(result.mrr)} />
            <Metric label="ARR" value={formatUsd(result.arr)} />
            <Metric label="ARPU / mo" value={formatUsd(result.arpu)} />
          </div>
        </Panel>
      </div>

      {/* 12-month projection — plain CSS bars, no chart library */}
      <Panel label={`Projected MRR — next ${result.projection.length} months`}>
        <div className="flex items-end gap-1.5 sm:gap-2" style={{ height: 120 }} role="img"
          aria-label={`MRR projected to grow from ${formatUsd(result.mrr)} to ${formatUsd(finalMrr)} per month over twelve months`}>
          {result.projection.map((point, index) => {
            const isLast = index === result.projection.length - 1;
            return (
              <div key={point.month} className="flex h-full flex-1 flex-col justify-end">
                <div
                  className={`w-full border-t ${isLast ? 'border-viridian bg-viridian/25' : 'border-ink/30 bg-ink/10'}`}
                  style={{ height: `${Math.max(2, (point.mrr / maxMrr) * 100)}%` }}
                  title={`Month ${point.month} — ${formatUsd(point.mrr)}`}
                />
              </div>
            );
          })}
        </div>
        <div className="mt-2 flex items-center justify-between font-mono text-[10px] uppercase tracking-[0.15em] text-ink/40">
          <span>M1 · {formatUsd(result.projection[0]?.mrr ?? 0)}</span>
          <span aria-hidden="true">—</span>
          <span>M12 · {formatUsd(finalMrr)}</span>
        </div>
        <p className="mt-4 border-t border-ink/10 pt-4 text-[13px] leading-relaxed text-ink/55">
          Each bar compounds the net growth rate for one more month. {formatUsd(result.mrr)}{' '}
          today becomes about {formatUsd(finalMrr)} MRR at month 12 under these
          assumptions.
        </p>
      </Panel>
    </div>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-ink/45">{label}</p>
      <p className="mt-1.5 font-mono text-[15px] tabular-nums text-ink">{value}</p>
    </div>
  );
}
