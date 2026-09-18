'use client';

import { useMemo, useState } from 'react';
import { Input } from '@/components/ui/input';
import Panel from './Panel';
import { calculateRoi, formatUsd } from '@/lib/tools/models';

function Field({
  label,
  suffix,
  value,
  onChange,
  step,
}: {
  label: string;
  suffix?: string;
  value: number;
  onChange: (value: number) => void;
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
        min={0}
        step={step}
        value={Number.isFinite(value) ? value : ''}
        onChange={(event) => {
          const parsed = Number.parseFloat(event.target.value);
          onChange(Number.isFinite(parsed) ? parsed : 0);
        }}
        className="mt-2 h-11 font-mono text-[13px] tabular-nums"
      />
    </label>
  );
}

export default function RoiCalculator() {
  const [investment, setInvestment] = useState(60_000);
  const [ongoingCost, setOngoingCost] = useState(6_000);
  const [hoursSaved, setHoursSaved] = useState(120);
  const [hourlyRate, setHourlyRate] = useState(35);
  const [newRevenue, setNewRevenue] = useState(500);
  const [costsAvoided, setCostsAvoided] = useState(500);

  const result = useMemo(
    () =>
      calculateRoi({
        investment,
        ongoingCostPerYear: ongoingCost,
        hoursSavedPerMonth: hoursSaved,
        loadedHourlyRate: hourlyRate,
        newRevenuePerMonth: newRevenue,
        costsAvoidedPerMonth: costsAvoided,
      }),
    [investment, ongoingCost, hoursSaved, hourlyRate, newRevenue, costsAvoided]
  );

  const { cumulative, paybackMonths } = result;
  const maxVal = Math.max(...cumulative, 0);
  const minVal = Math.min(...cumulative, 0);
  const span = maxVal - minVal || 1;
  // Zero-line position within the 128px strip (from the top).
  const zeroFromTop = (maxVal / span) * 100;
  const roiPositive = result.roi3yrPct >= 0;
  const horizon = cumulative.length;
  const beyondHorizon = paybackMonths !== null && paybackMonths > horizon;

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-1 gap-5 lg:grid-cols-[minmax(0,2fr)_minmax(0,3fr)]">
        {/* Inputs */}
        <Panel label="The investment">
          <div className="grid grid-cols-2 gap-x-4 gap-y-5">
            <Field label="One-time investment" suffix="$" value={investment} onChange={setInvestment} step={5000} />
            <Field label="Ongoing cost" suffix="$/yr" value={ongoingCost} onChange={setOngoingCost} step={1000} />
            <Field label="Hours saved" suffix="h/mo" value={hoursSaved} onChange={setHoursSaved} step={10} />
            <Field label="Loaded hourly rate" suffix="$" value={hourlyRate} onChange={setHourlyRate} step={5} />
            <Field label="New revenue" suffix="$/mo" value={newRevenue} onChange={setNewRevenue} step={100} />
            <Field label="Costs avoided" suffix="$/mo" value={costsAvoided} onChange={setCostsAvoided} step={100} />
          </div>
          <p className="mt-5 border-t border-ink/10 pt-4 font-mono text-[10px] uppercase tracking-[0.15em] leading-relaxed text-ink/40">
            Loaded rate = salary × burden — what an hour truly costs, not the
            wage
          </p>
        </Panel>

        {/* Headline payback + cards */}
        <div className="space-y-5">
          <Panel label="Payback period" accent="bg-viridian">
            <p
              className={`font-serif text-5xl font-light leading-none tracking-tight tabular-nums sm:text-6xl ${
                paybackMonths === null ? 'text-destructive' : 'text-ink'
              }`}
            >
              {paybackMonths === null ? 'Never' : `${Math.round(paybackMonths)} mo`}
            </p>
            <p className="mt-4 font-mono text-[11px] uppercase tracking-[0.15em] text-ink/50">
              {paybackMonths === null
                ? 'Monthly net benefit does not cover the investment'
                : beyondHorizon
                  ? `Break-even at month ${Math.ceil(paybackMonths)} — beyond the 36-month window`
                  : `Break-even at month ${Math.ceil(paybackMonths)} of ${horizon}`}
            </p>
          </Panel>

          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            <Panel label="Net benefit / year">
              <p
                className={`mt-1 font-mono text-2xl tabular-nums ${
                  result.netBenefitPerYear >= 0 ? 'text-ink' : 'text-destructive'
                }`}
              >
                {formatUsd(result.netBenefitPerYear)}
              </p>
              <p className="mt-3 font-mono text-[10px] uppercase tracking-[0.15em] text-ink/40">
                Benefit {formatUsd(result.monthlyBenefit)}/mo − ongoing{' '}
                {formatUsd(ongoingCost / 12)}/mo
              </p>
            </Panel>
            <Panel label="3-year ROI">
              <p
                className={`mt-1 font-mono text-2xl tabular-nums ${
                  roiPositive ? 'text-viridian' : 'text-destructive'
                }`}
              >
                {result.roi3yrPct >= 0 ? '+' : '−'}
                {Math.abs(Math.round(result.roi3yrPct)).toLocaleString('en-US')}%
              </p>
              <p className="mt-3 font-mono text-[10px] uppercase tracking-[0.15em] text-ink/40">
                Net gain vs investment over 36 months
              </p>
            </Panel>
          </div>
        </div>
      </div>

      {/* 36-month cumulative strip — pure CSS, viridian after break-even */}
      <Panel label="Cumulative return — 36 months">
        <div className="relative h-32" role="img"
          aria-label={`Cumulative net position over ${horizon} months, breaking even at month ${
            paybackMonths === null ? 'never' : Math.ceil(paybackMonths)
          }`}>
          {/* zero line */}
          <div
            aria-hidden="true"
            className="absolute left-0 right-0 border-t border-dashed border-ink/25"
            style={{ top: `${zeroFromTop}%` }}
          />
          <div className="absolute inset-0 flex items-stretch gap-px">
            {cumulative.map((value, index) => {
              const positive = value >= 0;
              const height = (Math.abs(value) / span) * 100;
              return (
                <div key={index} className="relative flex-1">
                  <div
                    className={`absolute w-full border-t ${
                      positive ? 'border-viridian bg-viridian/25' : 'border-ink/40 bg-ink/10'
                    }`}
                    style={
                      positive
                        ? { top: `${100 - zeroFromTop - height}%`, height: `${height}%` }
                        : { top: `${100 - zeroFromTop}%`, height: `${height}%` }
                    }
                    title={`Month ${index + 1} — ${formatUsd(value)} cumulative`}
                  />
                </div>
              );
            })}
          </div>
        </div>
        <div className="mt-2 flex items-center justify-between font-mono text-[10px] uppercase tracking-[0.15em] text-ink/40">
          <span>M1</span>
          {paybackMonths !== null && !beyondHorizon && (
            <span className="text-viridian">Break-even · M{Math.ceil(paybackMonths)}</span>
          )}
          <span>M{horizon}</span>
        </div>
        <p className="mt-4 border-t border-ink/10 pt-4 text-[13px] leading-relaxed text-ink/55">
          Bars below the dashed line are months still paying off the investment;
          viridian bars are months of positive return. No discounting applied —
          at this horizon the decision is go or no-go, not treasury precision.
        </p>
      </Panel>
    </div>
  );
}
