'use client';

import { useMemo, useState } from 'react';
import { Input } from '@/components/ui/input';
import Panel from './Panel';
import Segmented from './Segmented';
import ToggleRow from './ToggleRow';
import RangeSlider from './RangeSlider';
import {
  MODELS,
  calculateCloudCost,
  formatUsd,
  formatUsers,
  sliderToUsers,
  usersToSlider,
  type CloudExtra,
  type ComputeTier,
} from '@/lib/tools/models';

const EXTRAS: { id: CloudExtra; label: string }[] = [
  { id: 'cdn', label: 'CDN' },
  { id: 'managedDb', label: 'Managed database' },
  { id: 'media', label: 'Media processing' },
  { id: 'backups', label: 'Daily backups' },
];

/** Breakdown-table row label for each extra (as produced by calculateCloudCost). */
const EXTRA_ROW: Record<CloudExtra, string> = {
  cdn: 'CDN',
  managedDb: 'Managed database',
  media: 'Media processing',
  backups: 'Daily backups',
};

export default function CloudCostEstimator() {
  const [sliderPos, setSliderPos] = useState(() => Math.round(usersToSlider(10_000) * 1000));
  const [storagePerUser, setStoragePerUser] = useState(1);
  const [bandwidthPerUser, setBandwidthPerUser] = useState(2);
  const [computeTier, setComputeTier] = useState<ComputeTier>('small');
  const [extras, setExtras] = useState<CloudExtra[]>(['cdn']);

  const users = sliderToUsers(sliderPos / 1000);

  const result = useMemo(
    () =>
      calculateCloudCost({
        monthlyActiveUsers: users,
        storagePerUserGb: storagePerUser,
        bandwidthPerUserGb: bandwidthPerUser,
        computeTier,
        extras,
      }),
    [users, storagePerUser, bandwidthPerUser, computeTier, extras]
  );

  const toggleExtra = (id: CloudExtra) =>
    setExtras((current) =>
      current.includes(id) ? current.filter((e) => e !== id) : [...current, id]
    );

  return (
    <div className="grid grid-cols-1 gap-5 lg:grid-cols-[minmax(0,11fr)_minmax(0,9fr)]">
      {/* ── Inputs ─────────────────────────────────────────────────── */}
      <div className="space-y-5">
        <Panel label="Workload">
          <div className="flex items-baseline justify-between gap-4">
            <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-ink/45">
              Monthly active users
            </p>
            <p className="font-serif text-3xl font-light tabular-nums text-ink">
              {formatUsers(users)}
            </p>
          </div>
          <div className="mt-3">
            <RangeSlider
              ariaLabel="Monthly active users, log scale from 100 to 1 million"
              value={sliderPos}
              onChange={setSliderPos}
              min={0}
              max={1000}
            />
          </div>
          <div className="mt-1 flex justify-between font-mono text-[10px] uppercase tracking-[0.15em] text-ink/40">
            <span>100</span>
            <span>10k</span>
            <span>1M</span>
          </div>

          <div className="mt-6 grid grid-cols-2 gap-4 border-t border-ink/10 pt-5">
            <NumField
              label="Storage / user"
              suffix="GB"
              value={storagePerUser}
              onChange={setStoragePerUser}
              step={0.5}
            />
            <NumField
              label="Bandwidth / user"
              suffix="GB/mo"
              value={bandwidthPerUser}
              onChange={setBandwidthPerUser}
              step={0.5}
            />
          </div>
        </Panel>

        <Panel label="Compute tier">
          <Segmented
            ariaLabel="Compute tier"
            value={computeTier}
            onChange={setComputeTier}
            options={[
              { value: 'serverless', label: 'Serverless' },
              { value: 'small', label: 'Small' },
              { value: 'medium', label: 'Medium' },
              { value: 'large', label: 'Large' },
            ]}
          />
          <p className="mt-4 font-mono text-[10px] uppercase tracking-[0.12em] leading-relaxed text-ink/40">
            Base ${MODELS.cloudCost.computeBase[computeTier]}/mo + $
            {MODELS.cloudCost.computePerUser[computeTier]} per user — heavier
            workloads cost more per head
          </p>
        </Panel>

        <Panel label={`Extras — ${extras.length} on`}>
          <div className="-my-1">
            {EXTRAS.map((extra) => (
              <ToggleRow
                key={extra.id}
                active={extras.includes(extra.id)}
                onToggle={() => toggleExtra(extra.id)}
                label={extra.label}
                trailing={
                  extras.includes(extra.id)
                    ? `+${formatUsd(
                        result.lines.find((line) => line.label === EXTRA_ROW[extra.id])
                          ?.amount ?? 0
                      )}`
                    : 'off'
                }
              />
            ))}
          </div>
        </Panel>
      </div>

      {/* ── Result ─────────────────────────────────────────────────── */}
      <div className="space-y-5 lg:sticky lg:top-24 lg:self-start">
        <Panel label="Estimated cloud bill" accent="bg-viridian">
          <p className="font-serif text-4xl font-light leading-[1.05] tracking-tight text-ink tabular-nums sm:text-5xl">
            {formatUsd(result.low)} <span className="text-ink/35">–</span>{' '}
            {formatUsd(result.high)}
          </p>
          <p className="mt-4 font-mono text-[11px] uppercase tracking-[0.15em] text-ink/50">
            Per month · ≈ {formatUsd(result.annual)} per year
          </p>
        </Panel>

        <Panel label="Monthly breakdown">
          <div>
            {result.lines.map((line) => (
              <div
                key={line.label}
                className="flex items-baseline justify-between gap-x-4 border-t border-ink/10 py-2.5 first:border-t-0 first:pt-0"
              >
                <div className="min-w-0">
                  <p className="text-[13px] text-ink/80">{line.label}</p>
                  <p className="mt-0.5 truncate font-mono text-[10px] uppercase tracking-[0.12em] text-ink/40">
                    {line.detail}
                  </p>
                </div>
                <p className="shrink-0 font-mono text-[12px] tabular-nums text-ink/75">
                  {formatUsd(line.amount)}
                </p>
              </div>
            ))}
            <div className="mt-1 flex items-baseline justify-between border-t-2 border-ink/70 pt-3">
              <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-ink/60">
                Total / month
              </p>
              <p className="font-mono text-[13px] tabular-nums text-ink">
                {formatUsd(result.monthly)}
              </p>
            </div>
          </div>
        </Panel>

        <p className="px-1 font-mono text-[10px] uppercase tracking-[0.15em] leading-relaxed text-ink/40">
          Public cloud list prices, 2026 ballpark. Real bills vary with region,
          reservations, committed-use discounts, and egress agreements — treat
          this as a planning range, not an invoice.
        </p>
      </div>
    </div>
  );
}

function NumField({
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
          onChange(Number.isFinite(parsed) ? Math.max(0, parsed) : 0);
        }}
        className="mt-2 h-11 font-mono text-[13px] tabular-nums"
      />
    </label>
  );
}
