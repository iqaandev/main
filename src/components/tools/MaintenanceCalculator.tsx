'use client';

import { useMemo, useState } from 'react';
import { Input } from '@/components/ui/input';
import Panel from './Panel';
import Segmented from './Segmented';
import {
  MODELS,
  calculateMaintenance,
  formatUsd,
  type AppSize,
  type Compliance,
  type MaintenanceInput,
  type ReleaseCadence,
  type SupportLevel,
  type TechAge,
  type UsersTier,
} from '@/lib/tools/models';

const BASE_HOURS = MODELS.maintenance.baseHours;

function Choice<T extends string>({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: T;
  onChange: (value: T) => void;
  options: { value: T; label: string }[];
}) {
  return (
    <div>
      <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-ink/45">{label}</p>
      <div className="mt-3">
        <Segmented ariaLabel={label} value={value} onChange={onChange} options={options} />
      </div>
    </div>
  );
}

export default function MaintenanceCalculator() {
  const [size, setSize] = useState<AppSize>('medium');
  const [age, setAge] = useState<TechAge>('current');
  const [users, setUsers] = useState<UsersTier>('moderate');
  const [compliance, setCompliance] = useState<Compliance>('none');
  const [support, setSupport] = useState<SupportLevel>('business');
  const [cadence, setCadence] = useState<ReleaseCadence>('monthly');
  const [buildCost, setBuildCost] = useState(120_000);

  const input: MaintenanceInput = useMemo(
    () => ({
      size,
      age,
      users,
      compliance,
      support,
      cadence,
      originalBuildCost: Number.isFinite(buildCost) && buildCost > 0 ? buildCost : undefined,
    }),
    [size, age, users, compliance, support, cadence, buildCost]
  );

  const result = useMemo(() => calculateMaintenance(input), [input]);

  return (
    <div className="grid grid-cols-1 gap-5 lg:grid-cols-[minmax(0,11fr)_minmax(0,9fr)]">
      {/* ── Inputs ─────────────────────────────────────────────────── */}
      <Panel label="Your application">
        <div className="space-y-5">
          <Choice
            label="Application size"
            value={size}
            onChange={setSize}
            options={[
              { value: 'small', label: 'Small' },
              { value: 'medium', label: 'Medium' },
              { value: 'large', label: 'Large' },
            ]}
          />
          <Choice
            label="Technology age"
            value={age}
            onChange={setAge}
            options={[
              { value: 'current', label: 'Current' },
              { value: 'aging', label: 'Aging' },
              { value: 'legacy', label: 'Legacy' },
            ]}
          />
          <Choice
            label="Monthly active users"
            value={users}
            onChange={setUsers}
            options={[
              { value: 'light', label: 'Light' },
              { value: 'moderate', label: 'Moderate' },
              { value: 'heavy', label: 'Heavy' },
            ]}
          />
          <Choice
            label="Compliance"
            value={compliance}
            onChange={setCompliance}
            options={[
              { value: 'none', label: 'None' },
              { value: 'standard', label: 'Standard' },
              { value: 'regulated', label: 'Regulated' },
            ]}
          />
          <Choice
            label="Support expectation"
            value={support}
            onChange={setSupport}
            options={[
              { value: 'business', label: 'Business hours' },
              { value: 'nextDay', label: 'Next day' },
              { value: 'always', label: '24×7 SLA' },
            ]}
          />
          <Choice
            label="Release cadence"
            value={cadence}
            onChange={setCadence}
            options={[
              { value: 'monthly', label: 'Monthly' },
              { value: 'biweekly', label: 'Bi-weekly' },
              { value: 'continuous', label: 'Continuous' },
            ]}
          />
          <div className="border-t border-ink/10 pt-5">
            <label className="block max-w-xs">
              <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-ink/45">
                Original build cost ($, optional)
              </span>
              <Input
                type="number"
                inputMode="numeric"
                min={0}
                step={5000}
                value={Number.isFinite(buildCost) ? buildCost : ''}
                onChange={(event) => {
                  const parsed = Number.parseFloat(event.target.value);
                  setBuildCost(Number.isFinite(parsed) ? parsed : 0);
                }}
                className="mt-2 h-11 font-mono text-[13px] tabular-nums"
              />
            </label>
            <p className="mt-2 font-mono text-[10px] uppercase tracking-[0.12em] text-ink/40">
              Powers the 15–20%-of-build industry benchmark below
            </p>
          </div>
        </div>
      </Panel>

      {/* ── Result ─────────────────────────────────────────────────── */}
      <div className="space-y-5 lg:sticky lg:top-24 lg:self-start">
        <Panel label="Estimated retainer" accent="bg-viridian">
          <p className="font-serif text-4xl font-light leading-[1.05] tracking-tight text-ink tabular-nums sm:text-5xl">
            {formatUsd(result.low)} <span className="text-ink/35">–</span>{' '}
            {formatUsd(result.high)}
          </p>
          <p className="mt-4 font-mono text-[11px] uppercase tracking-[0.15em] text-ink/50">
            Per month · ≈ {result.hours.toFixed(1)} hours × $85/h · ≈{' '}
            {formatUsd(result.annual)} / year
          </p>
        </Panel>

        <Panel label="How the hours stack up">
          <div>
            <div className="flex items-baseline justify-between border-t-ink/10 py-2.5">
              <p className="text-[13px] text-ink/80">
                Baseline — {size === 'small' ? 'small' : size === 'medium' ? 'medium' : 'large'}{' '}
                application
              </p>
              <p className="font-mono text-[12px] tabular-nums text-ink/75">
                {BASE_HOURS[size]} h/mo
              </p>
            </div>
            {result.factors.map((factor) => (
              <div
                key={factor.label}
                className="flex items-baseline justify-between gap-x-4 border-t border-ink/10 py-2.5"
              >
                <p className="text-[13px] text-ink/80">{factor.label}</p>
                <p className="font-mono text-[12px] tabular-nums text-ink/75">
                  ×{factor.value.toFixed(2)}
                </p>
              </div>
            ))}
            <div className="mt-1 flex items-baseline justify-between border-t-2 border-ink/70 pt-3">
              <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-ink/60">
                Total hours / month
              </p>
              <p className="font-mono text-[13px] tabular-nums text-ink">
                {result.hours.toFixed(1)} h
              </p>
            </div>
          </div>
        </Panel>

        {/* Industry benchmark — hairline comparison */}
        <Panel label="Industry benchmark">
          {result.benchmark ? (
            <div>
              <p className="text-[13px] leading-relaxed text-ink/65">
                The oft-quoted benchmark —{' '}
                <span className="text-ink">15–20% of the original build cost per year</span>{' '}
                — puts a {formatUsd(buildCost)} build at:
              </p>
              <div className="mt-4 flex items-baseline justify-between border-t border-ink/10 py-2.5">
                <p className="font-mono text-[11px] uppercase tracking-[0.15em] text-ink/50">
                  Benchmark range
                </p>
                <p className="font-mono text-[12px] tabular-nums text-ink/75">
                  {formatUsd(result.benchmark.low)} – {formatUsd(result.benchmark.high)} / mo
                </p>
              </div>
              <div className="flex items-baseline justify-between border-t border-ink/10 py-2.5">
                <p className="font-mono text-[11px] uppercase tracking-[0.15em] text-ink/50">
                  This estimate
                </p>
                <p className="font-mono text-[12px] tabular-nums text-viridian">
                  {formatUsd(result.low)} – {formatUsd(result.high)} / mo
                </p>
              </div>
              <p className="mt-3 border-t border-ink/10 pt-3 text-[13px] leading-relaxed text-ink/55">
                {result.high < result.benchmark.low
                  ? 'Your setup prices below the benchmark — usually a sign of modest scope or a healthy, current codebase.'
                  : result.low > result.benchmark.high
                    ? 'Above the benchmark — legacy technology, heavy compliance, or a 24×7 commitment will do that.'
                    : 'In line with the benchmark — a healthy place to be.'}
              </p>
            </div>
          ) : (
            <p className="text-[13px] leading-relaxed text-ink/55">
              Enter your original build cost to compare this estimate against
              the industry rule of thumb — typically 15–20% of the build cost
              per year.
            </p>
          )}
        </Panel>
      </div>
    </div>
  );
}
