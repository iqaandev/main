'use client';

import { useMemo, useState } from 'react';
import { Plus, X } from 'lucide-react';
import { Input } from '@/components/ui/input';
import Panel from './Panel';
import CopyButton from './CopyButton';
import RangeSlider from './RangeSlider';
import {
  MVP_SEED,
  scoreFeature,
  type PrioritizedFeature,
} from '@/lib/tools/models';

interface Feature extends Omit<PrioritizedFeature, 'score'> {
  score: number;
}

const withScore = (feature: Omit<PrioritizedFeature, 'score'>): Feature => ({
  ...feature,
  score: scoreFeature(feature),
});

const MAX_FEATURES = 24;

export default function MvpPrioritizer() {
  const [features, setFeatures] = useState<Feature[]>(() => MVP_SEED.map(withScore));
  const [draft, setDraft] = useState('');
  const [cut, setCut] = useState(2);

  // Live re-score and sort on every change — highest value first.
  const sorted = useMemo(
    () =>
      features
        .map((f) => ({ ...f, score: scoreFeature(f) }))
        .sort((a, b) => b.score - a.score),
    [features]
  );

  const cutIndex = Math.min(Math.max(0, cut), sorted.length);
  const v1 = sorted.slice(0, cutIndex);
  const later = sorted.slice(cutIndex);

  const summary =
    sorted.length === 0
      ? 'MVP scope — v1: (nothing yet). Later: (nothing yet).'
      : `MVP scope — v1: ${v1.length ? v1.map((f) => f.name).join(', ') : '—'}. Later: ${
          later.length ? later.map((f) => f.name).join(', ') : '—'
        }.`;

  const addFeature = () => {
    const name = draft.trim();
    if (!name || features.length >= MAX_FEATURES) return;
    setFeatures((current) => [
      ...current,
      withScore({ id: `f-${Date.now()}-${current.length}`, name, impact: 3, confidence: 3, effort: 3 }),
    ]);
    setDraft('');
  };

  const removeFeature = (id: string) => {
    setFeatures((current) => current.filter((f) => f.id !== id));
  };

  const update = (id: string, patch: Partial<Feature>) => {
    setFeatures((current) =>
      current.map((f) => (f.id === id ? { ...f, ...patch } : f))
    );
  };

  return (
    <div className="space-y-5">
      {/* Add + summary */}
      <Panel label={`Scope — ${sorted.length} feature${sorted.length === 1 ? '' : 's'}`}>
        <div className="flex items-center gap-3">
          <Input
            value={draft}
            onChange={(event) => setDraft(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === 'Enter') addFeature();
            }}
            placeholder="Add a feature — e.g. Offline mode"
            aria-label="New feature name"
            className="h-11 font-mono text-[13px]"
          />
          <button
            type="button"
            onClick={addFeature}
            disabled={!draft.trim() || features.length >= MAX_FEATURES}
            className="inline-flex h-11 shrink-0 cursor-pointer items-center gap-2 rounded-md bg-ink px-4 font-mono text-[10px] uppercase tracking-[0.15em] text-paper transition-colors duration-300 hover:bg-viridian disabled:cursor-not-allowed disabled:opacity-40"
          >
            <Plus className="h-3.5 w-3.5" aria-hidden="true" />
            Add
          </button>
        </div>

        <div className="mt-6 grid grid-cols-1 gap-5 border-t border-ink/10 pt-5 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-center">
          <div>
            <div className="flex items-baseline justify-between gap-4">
              <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-ink/45">
                Cut line
              </p>
              <p className="font-mono text-[11px] tabular-nums text-ink/70">
                v1 <span className="text-viridian">{v1.length}</span>
                <span className="text-ink/35"> / </span>
                later <span className="text-ink/45">{later.length}</span>
              </p>
            </div>
            <div className="mt-2">
              <RangeSlider
                ariaLabel="Features to ship in v1"
                value={cutIndex}
                onChange={setCut}
                min={0}
                max={Math.max(1, sorted.length)}
              />
            </div>
          </div>
          <CopyButton value={summary} label="Copy MVP scope" className="justify-self-end" />
        </div>
      </Panel>

      {/* Ranked list */}
      {sorted.length > 0 ? (
        <Panel label="Ranked by score — impact × confidence ÷ effort">
          <div className="space-y-2">
            {sorted.map((feature, index) => {
              const inV1 = index < cutIndex;
              return (
                <div key={feature.id}>
                  {/* Cut-line marker between v1 and later */}
                  {index === cutIndex && cutIndex > 0 && (
                    <div className="mb-2 flex items-center gap-3 py-2" aria-hidden="true">
                      <span className="h-[7px] w-[7px] rotate-45 bg-gold" />
                      <span className="h-px grow bg-ink/20" />
                      <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-ink/40">
                        Later
                      </span>
                      <span className="h-px grow bg-ink/20" />
                    </div>
                  )}
                  <div
                    className={`rounded-md border px-4 py-3.5 transition-colors duration-300 ${
                      inV1 ? 'border-ink/15 bg-card' : 'border-ink/10 bg-transparent'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-4">
                      <div className="flex min-w-0 items-baseline gap-3">
                        <span
                          aria-hidden="true"
                          className={`font-mono text-[10px] tabular-nums ${
                            inV1 ? 'text-viridian' : 'text-ink/30'
                          }`}
                        >
                          {String(index + 1).padStart(2, '0')}
                        </span>
                        <p
                          className={`truncate text-[14px] ${
                            inV1 ? 'text-ink' : 'text-ink/50'
                          }`}
                        >
                          {feature.name}
                        </p>
                        {!inV1 && (
                          <span className="hidden shrink-0 font-mono text-[9px] uppercase tracking-[0.18em] text-ink/35 sm:inline">
                            later
                          </span>
                        )}
                      </div>
                      <div className="flex shrink-0 items-center gap-3">
                        <span
                          className={`font-mono text-[15px] tabular-nums ${
                            inV1 ? 'text-viridian' : 'text-ink/45'
                          }`}
                        >
                          {feature.score.toFixed(1)}
                        </span>
                        <button
                          type="button"
                          onClick={() => removeFeature(feature.id)}
                          aria-label={`Remove ${feature.name}`}
                          className="cursor-pointer text-ink/30 transition-colors hover:text-destructive"
                        >
                          <X className="h-3.5 w-3.5" aria-hidden="true" />
                        </button>
                      </div>
                    </div>

                    <div className="mt-3 grid grid-cols-1 gap-x-6 gap-y-2.5 sm:grid-cols-3">
                      <ScoreSlider
                        label="Impact"
                        value={feature.impact}
                        onChange={(value) => update(feature.id, { impact: value })}
                        name={feature.name}
                      />
                      <ScoreSlider
                        label="Confidence"
                        value={feature.confidence}
                        onChange={(value) => update(feature.id, { confidence: value })}
                        name={feature.name}
                      />
                      <ScoreSlider
                        label="Effort"
                        value={feature.effort}
                        onChange={(value) => update(feature.id, { effort: value })}
                        name={feature.name}
                      />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </Panel>
      ) : (
        <Panel label="Ranked features">
          <p className="text-[13px] text-ink/50">
            Add your first feature above — the table scores and sorts as you type.
          </p>
        </Panel>
      )}
    </div>
  );
}

function ScoreSlider({
  label,
  value,
  onChange,
  name,
}: {
  label: string;
  value: number;
  onChange: (value: number) => void;
  name: string;
}) {
  return (
    <div className="flex items-center gap-3">
      <p className="w-[76px] shrink-0 font-mono text-[9px] uppercase tracking-[0.16em] text-ink/45">
        {label}
      </p>
      <div className="min-w-0 grow">
        <RangeSlider
          ariaLabel={`${label} for ${name}`}
          value={value}
          onChange={onChange}
          min={1}
          max={5}
        />
      </div>
      <p className="w-3 shrink-0 text-right font-mono text-[11px] tabular-nums text-ink/70">
        {value}
      </p>
    </div>
  );
}
