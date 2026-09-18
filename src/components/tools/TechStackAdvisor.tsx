'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { ArrowLeft, ArrowRight, RotateCcw } from 'lucide-react';
import Panel from './Panel';
import {
  recommendStack,
  type BudgetPosture,
  type BuildingGoal,
  type ScaleLevel,
  type SeoCritical,
  type StackAnswers,
  type TeamBackground,
  type TimeToMarket,
} from '@/lib/tools/models';

type Answers = Partial<StackAnswers>;

interface Question {
  id: keyof StackAnswers;
  title: string;
  hint: string;
  options: { value: string; label: string; sub?: string }[];
}

/* Questions are presentation; the scoring matrix lives in models.ts. */
const QUESTIONS: Question[] = [
  {
    id: 'building',
    title: 'What are you building?',
    hint: 'The shape of the product narrows the field first.',
    options: [
      { value: 'content', label: 'Content site' },
      { value: 'webapp', label: 'Web application' },
      { value: 'ecommerce', label: 'E-commerce' },
      { value: 'saas', label: 'SaaS platform' },
      { value: 'mobile', label: 'Mobile app' },
      { value: 'ai', label: 'AI product' },
    ],
  },
  {
    id: 'scale',
    title: 'Expected scale?',
    hint: 'Honest user counts — ambition can come later.',
    options: [
      { value: 'hundreds', label: 'Hundreds of users' },
      { value: 'thousands', label: 'Thousands' },
      { value: 'tensThousands', label: 'Tens of thousands' },
      { value: 'millions', label: 'Millions' },
    ],
  },
  {
    id: 'time',
    title: 'Time to market?',
    hint: 'Deadlines privilege batteries-included frameworks.',
    options: [
      { value: 'asap', label: 'ASAP' },
      { value: 'balanced', label: 'Balanced' },
      { value: 'norush', label: 'No rush' },
    ],
  },
  {
    id: 'background',
    title: "Team's strongest background?",
    hint: 'The best stack is one your team can actually drive.',
    options: [
      { value: 'javascript', label: 'JavaScript' },
      { value: 'python', label: 'Python' },
      { value: 'php', label: 'PHP' },
      { value: 'none', label: 'None yet' },
    ],
  },
  {
    id: 'seo',
    title: 'Is SEO critical?',
    hint: 'Search traffic demands server-rendered pages.',
    options: [
      { value: 'yes', label: 'Yes' },
      { value: 'no', label: 'No' },
    ],
  },
  {
    id: 'budget',
    title: 'Budget posture?',
    hint: 'Lean runs happily on boring, cheap infrastructure.',
    options: [
      { value: 'lean', label: 'Lean' },
      { value: 'normal', label: 'Normal' },
    ],
  },
];

const TOTAL_STEPS = QUESTIONS.length;

export default function TechStackAdvisor() {
  const [step, setStep] = useState(0); // 0..5 questions, 6 = result
  const [answers, setAnswers] = useState<Answers>({});
  const headingRef = useRef<HTMLHeadingElement>(null);

  const current = QUESTIONS[step];
  const isResult = step >= TOTAL_STEPS;
  const answered = (qid: keyof StackAnswers) => answers[qid] !== undefined;

  const select = useCallback(
    (qid: keyof StackAnswers, value: string) => {
      setAnswers((prev) => ({ ...prev, [qid]: value }));
      setStep((s) => Math.min(TOTAL_STEPS, s + 1));
    },
    []
  );

  const back = useCallback(() => setStep((s) => Math.max(0, s - 1)), []);
  const next = useCallback(
    () => setStep((s) => (current && answered(current.id) ? Math.min(TOTAL_STEPS, s + 1) : s)),
    [current, answered]
  );

  // Keyboard: digits choose, arrows navigate. Buttons keep native Enter/Space.
  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (isResult) return;
      const target = event.target as HTMLElement | null;
      if (target && ['INPUT', 'TEXTAREA', 'SELECT'].includes(target.tagName)) return;

      const digit = Number.parseInt(event.key, 10);
      if (!Number.isNaN(digit) && digit >= 1 && digit <= current.options.length) {
        event.preventDefault();
        select(current.id, current.options[digit - 1].value);
        return;
      }
      if (event.key === 'ArrowLeft') {
        event.preventDefault();
        back();
      } else if (event.key === 'ArrowRight' && answered(current.id)) {
        event.preventDefault();
        next();
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [current, isResult, select, back, next, answered]);

  // Move focus to the question when the step changes.
  useEffect(() => {
    headingRef.current?.focus();
  }, [step]);

  const recommendation = useMemo(
    () => (isResult ? recommendStack(answers as StackAnswers) : null),
    [isResult, answers]
  );

  return (
    <div className="space-y-5">
      {/* Progress */}
      <div className="flex items-center justify-between gap-6 rounded-md border border-ink/10 bg-card px-5 py-3.5">
        <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-ink/55">
          {String(Math.min(step + 1, TOTAL_STEPS)).padStart(2, '0')}{' '}
          <span className="text-ink/35">/ {String(TOTAL_STEPS).padStart(2, '0')}</span>
        </p>
        <div className="h-px max-w-xs grow bg-ink/15" aria-hidden="true">
          <div
            className="h-px bg-ink transition-all duration-500"
            style={{ width: `${(Math.min(step, TOTAL_STEPS) / TOTAL_STEPS) * 100}%` }}
          />
        </div>
        <p className="hidden font-mono text-[10px] uppercase tracking-[0.15em] text-ink/40 sm:block">
          Keys 1–{current ? current.options.length : 0} pick · ← back
        </p>
      </div>

      {!isResult && current ? (
        <Panel label={`Question ${step + 1}`}>
          <h3
            ref={headingRef}
            tabIndex={-1}
            className="font-serif text-2xl font-light tracking-tight text-ink outline-none sm:text-3xl"
          >
            {current.title}
          </h3>
          <p className="mt-2 text-[13px] text-ink/55">{current.hint}</p>

          <div className="mt-6 space-y-0" role="group" aria-label={current.title}>
            {current.options.map((option, index) => {
              const active = answers[current.id] === option.value;
              return (
                <button
                  key={option.value}
                  type="button"
                  aria-pressed={active}
                  onClick={() => select(current.id, option.value)}
                  className={`group flex w-full cursor-pointer items-center gap-4 border-t border-ink/10 py-3.5 text-left transition-colors duration-300 hover:bg-ink/[0.03] ${
                    active ? 'bg-ink/[0.03]' : ''
                  }`}
                >
                  <span
                    className={`w-5 shrink-0 font-mono text-[11px] tabular-nums transition-colors ${
                      active ? 'text-viridian' : 'text-ink/35'
                    }`}
                  >
                    {index + 1}
                  </span>
                  <span
                    className={`font-serif text-lg tracking-tight transition-colors ${
                      active ? 'text-viridian' : 'text-ink group-hover:text-ink'
                    }`}
                  >
                    {option.label}
                  </span>
                  {active && (
                    <span
                      aria-hidden="true"
                      className="ms-auto inline-block h-[7px] w-[7px] rotate-45 bg-viridian"
                    />
                  )}
                </button>
              );
            })}
          </div>

          <div className="mt-6 flex items-center justify-between border-t border-ink/10 pt-5">
            <button
              type="button"
              onClick={back}
              disabled={step === 0}
              className="inline-flex cursor-pointer items-center gap-2 font-mono text-[11px] uppercase tracking-[0.15em] text-ink/55 transition-colors hover:text-ink disabled:cursor-not-allowed disabled:opacity-30"
            >
              <ArrowLeft className="h-3.5 w-3.5" aria-hidden="true" />
              Back
            </button>
            <button
              type="button"
              onClick={next}
              disabled={!answered(current.id)}
              className="inline-flex cursor-pointer items-center gap-2 font-mono text-[11px] uppercase tracking-[0.15em] text-ink/55 transition-colors hover:text-ink disabled:cursor-not-allowed disabled:opacity-30"
            >
              Next
              <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
            </button>
          </div>
        </Panel>
      ) : (
        recommendation && (
          <Panel label="Recommended stack" accent="bg-viridian">
            <p className="font-serif text-3xl font-light leading-tight tracking-tight text-ink sm:text-4xl">
              {recommendation.stack.label}
            </p>

            <div className="mt-7">
              {(
                [
                  ['Frontend', recommendation.stack.frontend],
                  ['Backend', recommendation.stack.backend],
                  ['Database', recommendation.stack.database],
                  ['Hosting', recommendation.stack.hosting],
                ] as const
              ).map(([layerName, layer]) => (
                <div
                  key={layerName}
                  className="grid grid-cols-1 gap-x-6 gap-y-1 border-t border-ink/10 py-4 sm:grid-cols-[7rem_minmax(0,1fr)]"
                >
                  <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-ink/45">
                    {layerName}
                  </p>
                  <div>
                    <p className="font-serif text-lg tracking-tight text-ink">{layer.name}</p>
                    <p className="mt-1 font-mono text-[10px] uppercase tracking-[0.12em] text-ink/45">
                      {layer.reason}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6 border-t border-ink/10 pt-6">
              <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-ink/45">
                Why this fits
              </p>
              <ul className="mt-4 space-y-3">
                {recommendation.stack.why.map((bullet) => (
                  <li key={bullet.slice(0, 32)} className="flex items-start gap-3">
                    <span
                      aria-hidden="true"
                      className="mt-[7px] inline-block h-[6px] w-[6px] shrink-0 rotate-45 bg-gold"
                    />
                    <span className="text-[14px] leading-relaxed text-ink/75">{bullet}</span>
                  </li>
                ))}
              </ul>
            </div>

            <p className="mt-6 border-t border-ink/10 pt-5 font-serif text-[15px] font-light italic leading-relaxed text-ink/60">
              {recommendation.stack.alternative}
            </p>

            <div className="mt-6 flex flex-wrap items-center justify-between gap-4 border-t border-ink/10 pt-5">
              <p className="font-mono text-[10px] uppercase tracking-[0.15em] text-ink/40">
                Runner-up{recommendation.runnerUp ? ` — ${recommendation.runnerUp.label}` : ': none close'}
              </p>
              <button
                type="button"
                onClick={() => {
                  setAnswers({});
                  setStep(0);
                }}
                className="inline-flex cursor-pointer items-center gap-2 font-mono text-[11px] uppercase tracking-[0.15em] text-ink/55 transition-colors hover:text-ink"
              >
                <RotateCcw className="h-3.5 w-3.5" aria-hidden="true" />
                Start over
              </button>
            </div>
          </Panel>
        )
      )}
    </div>
  );
}
