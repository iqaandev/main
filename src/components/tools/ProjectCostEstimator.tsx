'use client';

import { useMemo, useState } from 'react';
import Panel from './Panel';
import Segmented from './Segmented';
import ToggleRow from './ToggleRow';
import {
  MODELS,
  calculateProjectCost,
  featureLabel,
  formatK,
  formatUsd,
  type Complexity,
  type DesignLevel,
  type FeatureId,
  type Platform,
  type Scope,
  type Timeline,
} from '@/lib/tools/models';

const FEATURES = Object.keys(MODELS.projectCost.featureAdd) as FeatureId[];

const PLATFORM_OPTIONS: { value: Platform; label: string }[] = [
  { value: 'web', label: 'Web' },
  { value: 'mobile', label: 'Mobile' },
  { value: 'webMobile', label: 'Web + Mobile' },
  { value: 'desktop', label: 'Desktop' },
];

export default function ProjectCostEstimator() {
  const [platform, setPlatform] = useState<Platform>('web');
  const [scope, setScope] = useState<Scope>('mvp');
  const [features, setFeatures] = useState<FeatureId[]>(['auth']);
  const [complexity, setComplexity] = useState<Complexity>('typical');
  const [design, setDesign] = useState<DesignLevel>('custom');
  const [timeline, setTimeline] = useState<Timeline>('standard');

  const result = useMemo(
    () =>
      calculateProjectCost({
        platform,
        scope,
        features,
        complexity,
        design,
        timeline,
      }),
    [platform, scope, features, complexity, design, timeline]
  );

  const toggleFeature = (id: FeatureId) => {
    setFeatures((current) =>
      current.includes(id) ? current.filter((f) => f !== id) : [...current, id]
    );
  };

  return (
    <div className="grid grid-cols-1 gap-5 lg:grid-cols-[minmax(0,11fr)_minmax(0,9fr)]">
      {/* ── Inputs ─────────────────────────────────────────────────── */}
      <div className="space-y-5">
        <Panel label="Platform">
          <Segmented
            ariaLabel="Platform"
            value={platform}
            onChange={setPlatform}
            options={PLATFORM_OPTIONS}
            className="flex-wrap"
          />
          <div className="mt-5">
            <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-ink/45">
              Project scope
            </p>
            <div className="mt-3">
              <Segmented
                ariaLabel="Project scope"
                value={scope}
                onChange={setScope}
                options={[
                  { value: 'mvp', label: 'MVP' },
                  { value: 'full', label: 'Full product' },
                  { value: 'internal', label: 'Internal tool' },
                ]}
              />
            </div>
          </div>
        </Panel>

        <Panel label={`Features — ${features.length} selected`}>
          <div className="-my-1">
            {FEATURES.map((id) => (
              <ToggleRow
                key={id}
                active={features.includes(id)}
                onToggle={() => toggleFeature(id)}
                label={featureLabel(id)}
                trailing={`+${formatK(MODELS.projectCost.featureAdd[id])}`}
              />
            ))}
          </div>
        </Panel>

        <Panel label="Dials">
          <div className="space-y-5">
            <Dial
              label="Complexity"
              value={complexity}
              onChange={setComplexity}
              options={[
                { value: 'simple', label: 'Simple' },
                { value: 'typical', label: 'Typical' },
                { value: 'complex', label: 'Complex' },
              ]}
            />
            <Dial
              label="Design level"
              value={design}
              onChange={setDesign}
              options={[
                { value: 'functional', label: 'Functional' },
                { value: 'custom', label: 'Custom' },
                { value: 'award', label: 'Award-grade' },
              ]}
            />
            <Dial
              label="Timeline"
              value={timeline}
              onChange={setTimeline}
              options={[
                { value: 'relaxed', label: 'Relaxed' },
                { value: 'standard', label: 'Standard' },
                { value: 'aggressive', label: 'Aggressive' },
              ]}
            />
          </div>
        </Panel>
      </div>

      {/* ── Result ─────────────────────────────────────────────────── */}
      <div className="space-y-5 lg:sticky lg:top-24 lg:self-start">
        <Panel label="Estimated budget" accent="bg-viridian">
          <p className="font-serif text-4xl font-light leading-[1.05] tracking-tight text-ink tabular-nums sm:text-5xl">
            {formatK(result.low)} <span className="text-ink/35">–</span>{' '}
            {formatK(result.high)}
          </p>
          <p className="mt-4 font-mono text-[11px] uppercase tracking-[0.15em] text-ink/50">
            Point estimate {formatUsd(result.total)} · ≈{result.weeks} weeks ·{' '}
            {result.devs} devs
          </p>
        </Panel>

        <Panel label="Breakdown">
          <div>
            {result.lines.map((line) => (
              <div
                key={line.label}
                className="grid grid-cols-[1fr_auto] items-baseline gap-x-4 border-t border-ink/10 py-2.5 first:border-t-0 first:pt-0"
              >
                <div className="min-w-0">
                  <p className="text-[13px] text-ink/80">{line.label}</p>
                  <p className="mt-0.5 truncate font-mono text-[10px] uppercase tracking-[0.12em] text-ink/40">
                    {line.detail}
                  </p>
                </div>
                <p
                  className={`font-mono text-[12px] tabular-nums ${
                    line.amount < 0 ? 'text-ink/45' : 'text-ink/75'
                  }`}
                >
                  {line.amount >= 0 ? '+' : '−'}
                  {formatUsd(Math.abs(line.amount))}
                </p>
              </div>
            ))}
            <div className="mt-1 flex items-baseline justify-between border-t-2 border-ink/70 pt-3">
              <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-ink/60">
                Total
              </p>
              <p className="font-mono text-[13px] tabular-nums text-ink">
                {formatUsd(result.total)}
              </p>
            </div>
          </div>
        </Panel>

        <Panel label="Suggested team & duration">
          <div className="flex flex-wrap items-baseline gap-x-6 gap-y-2">
            {result.team.map((member) => (
              <p key={member.role} className="font-serif text-lg text-ink/85">
                {member.count}{' '}
                <span className="font-mono text-[10px] uppercase tracking-[0.15em] text-ink/45">
                  {member.role}
                </span>
              </p>
            ))}
          </div>
          <p className="mt-4 border-t border-ink/10 pt-4 text-[13px] leading-relaxed text-ink/60">
            A focused team of this shape typically delivers the build in about{' '}
            <span className="font-mono text-ink/80">≈ {result.weeks} weeks</span>{' '}
            — faster timelines add parallel developers, not magic.
          </p>
        </Panel>
      </div>
    </div>
  );
}

function Dial<T extends string>({
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
