/*
 * IQAAN Tools v2 — business decision models.
 *
 * Every pricing assumption, rate constant, and multiplier used by the seven
 * business tools lives in the single MODELS object below, commented, so the
 * studio can re-tune the numbers without touching a single component.
 *
 * All figures are USD, derived from IQAAN's project history and public cloud
 * list prices (2026 ballpark). They are estimation aids — every tool page
 * says so honestly and points to a firm quote path.
 */

/* ────────────────────────────────────────────────────────────────────────
 * Shared formatting helpers (presentation only, no assumptions in here)
 * ──────────────────────────────────────────────────────────────────────── */

const usd = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  maximumFractionDigits: 0,
});

/** $48,000 → "$48k"; $1,250,000 → "$1.25M" — used for large serif headlines. */
export function formatK(value: number): string {
  if (!Number.isFinite(value)) return '—';
  if (Math.abs(value) >= 1_000_000) {
    const m = value / 1_000_000;
    return `$${m >= 10 ? m.toFixed(1) : m.toFixed(2).replace(/0$/, '')}M`;
  }
  if (Math.abs(value) >= 1_000) {
    const k = value / 1_000;
    return `$${k >= 10 ? Math.round(k) : k.toFixed(1).replace(/\.0$/, '')}k`;
  }
  return usd.format(Math.round(value));
}

/** Full US currency with no decimals — used in hairline tables. */
export function formatUsd(value: number): string {
  if (!Number.isFinite(value)) return '—';
  return usd.format(Math.round(value));
}

/* ════════════════════════════════════════════════════════════════════════
 * THE MODELS — one exported object, commented per constant.
 * ════════════════════════════════════════════════════════════════════════ */

export const MODELS = {
  /* ── 1. Software Project Cost Estimator ──────────────────────────────
   * Baseline builds for a small focused team (PM + design + 2–3 devs + QA)
   * delivering a production-quality "typical" product at standard pace.
   */
  projectCost: {
    /** Base build cost (USD) per platform before scope, features, dials. */
    platformBase: {
      web: 25_000, // responsive web application
      mobile: 30_000, // single native-style app (one store)
      desktop: 35_000, // cross-platform desktop application
    },
    /** Web + mobile bought together share much of the design/API work. */
    comboDiscount: 0.8,
    /** Scope multiplies the platform base. */
    scopeMultiplier: {
      mvp: 0.6, // core flows only, intentionally rough edges
      full: 1.4, // complete product: settings, states, edge cases, polish
      internal: 0.5, // internal tool, no marketing surface, forgiving UX
    },
    /** Flat cost adds (USD) per selected feature. */
    featureAdd: {
      auth: 3_500, // accounts, login, password reset, session handling
      payments: 6_000, // checkout or subscription billing with a provider
      dashboards: 8_000, // reporting views, charts, aggregated data
      admin: 6_000, // internal admin panel over users and content
      integrations: 4_000, // third-party APIs (CRM, email, maps, ERP…)
      ai: 12_000, // AI features: model integration, prompts, eval, UI
      realtime: 7_000, // realtime / messaging: sockets, presence, sync
      files: 3_000, // file upload, storage, and delivery pipeline
    },
    /** Multiplicative dials applied after base + features. */
    complexityMultiplier: { simple: 0.85, typical: 1.0, complex: 1.4 },
    designMultiplier: { functional: 0.9, custom: 1.0, award: 1.25 },
    timelineMultiplier: { relaxed: 0.95, standard: 1.0, aggressive: 1.3 },
    /** Estimate honesty: present a range, not a false-precision point. */
    rangeSpread: { low: 0.8, high: 1.2 },
    /**
     * Billable output per developer per MONTH (≈ $104/h × 173h — a studio
     * blended rate). Duration = total ÷ (devs × this), converted to weeks.
     */
    monthlyBurnPerDev: 18_000,
    /** One developer per ~$60k of build; teams clamp to 2–6 developers. */
    devLoadThreshold: 60_000,
    minDevs: 2,
    maxDevs: 6,
    /** Weeks per month used when converting the burn-rate duration to weeks. */
    weeksPerMonth: 4.33,
  },

  /* ── 3. SaaS Unit Economics Calculator ───────────────────────────────
   * Standard SaaS formulas; the only "constant" is the 12-month horizon.
   */
  saas: {
    /** Projection horizon for the MRR bar strip (months). */
    projectionMonths: 12,
  },

  /* ── 4. Tech Stack Advisor ───────────────────────────────────────────
   * Six curated stacks, scored per answer. Scores are studio judgement:
   * fit-to-team beats theoretical elegance. See recommendStack() for the
   * two deliberate edge-case overrides (mobile shortlist, AI weighting).
   */
  stackAdvisor: {
    scores: {
      // Q1 — what are you building
      building: {
        content: { next: 4, rails: 1 },
        webapp: { next: 3, rails: 1, django: 1, laravel: 1 },
        ecommerce: { laravel: 3, rails: 1, next: 1 },
        saas: { next: 3, rails: 2, django: 1 },
        mobile: { reactNative: 2, flutter: 2 },
        ai: { django: 4, next: 1 },
      },
      // Q2 — expected scale
      scale: {
        hundreds: { next: 2, flutter: 1 },
        thousands: { next: 1, rails: 1, django: 1, laravel: 1 },
        tensThousands: { next: 1, django: 2, rails: 1 },
        millions: { next: 1, django: 2 },
      },
      // Q3 — time to market
      time: {
        asap: { next: 2, rails: 2, flutter: 1, laravel: 1 },
        balanced: { next: 1, rails: 1, django: 1 },
        norush: { next: 1, django: 1, laravel: 1, rails: 1 },
      },
      // Q4 — team background
      background: {
        javascript: { next: 3, reactNative: 3 },
        python: { django: 4, flutter: 1 },
        php: { laravel: 4 },
        none: { next: 1, flutter: 1, rails: 1 },
      },
      // Q5 — is SEO critical
      seo: {
        yes: { next: 4 },
        no: { rails: 1, django: 1, reactNative: 1, flutter: 1 },
      },
      // Q6 — budget posture
      budget: {
        lean: { next: 2, laravel: 1, flutter: 1 },
        normal: { next: 1, rails: 1, django: 1 },
      },
    },
    /** Deliberate overrides, applied after raw scoring. */
    rules: {
      /** Mobile projects choose between exactly two stacks, by team. */
      mobileShortlist: ['reactNative', 'flutter'],
      /** JS teams keep React Native; greenfield teams get Flutter's
       * single-language onboarding; Python/PHP teams lean Flutter too. */
      mobileBackgroundNudge: { javascript: 'reactNative', none: 'flutter', python: 'flutter', php: 'flutter' },
      /** AI products are Python-weighted: Django regardless of JS comfort. */
      aiPreferred: 'django',
    },
  },

  /* ── 5. Cloud Cost Estimator ─────────────────────────────────────────
   * Public cloud list prices, 2026 ballpark (AWS/GCP/Azure typical tiers,
   * blended). Real bills vary by region, reservations, and egress deals.
   */
  cloudCost: {
    /** Object storage, $/GB/month. */
    storagePerGb: 0.023,
    /** Egress bandwidth, $/GB delivered. */
    bandwidthPerGb: 0.09,
    /** Compute tiers: a fixed monthly base… */
    computeBase: { serverless: 15, small: 40, medium: 120, large: 400 },
    /** …plus $/user/month scaling with workload weight per tier. */
    computePerUser: { serverless: 0.002, small: 0.01, medium: 0.04, large: 0.15 },
    /** CDN edge delivery $/GB — typically offsets pricier origin egress. */
    cdnPerGb: 0.02,
    /** Managed database: base + $/user/month for the managed instance. */
    managedDbBase: 15,
    managedDbPerUser: 0.004,
    /** Media processing (transcoding, thumbnails): base + $/user/month. */
    mediaBase: 10,
    mediaPerUser: 0.008,
    /** Daily backups: flat floor plus a share of the storage bill. */
    backupFloor: 5,
    backupStorageShare: 0.25,
    /** Estimate honesty: ±10% around the computed monthly figure. */
    rangeSpread: { low: 0.9, high: 1.1 },
  },

  /* ── 6. Maintenance Cost Calculator ──────────────────────────────────
   * Hours × blended-rate model. Base hours/month is the retainer a healthy
   * application of each size actually consumes.
   */
  maintenance: {
    /** Baseline hours per month by application size. */
    baseHours: { small: 8, medium: 24, large: 60 },
    /** Older stacks burn more hours for the same outcome. */
    ageMultiplier: { current: 1.0, aging: 1.3, legacy: 1.8 },
    /** More users → more monitoring, incidents, and support surface. */
    usersMultiplier: { light: 1.0, moderate: 1.15, heavy: 1.3 },
    /** Compliance work: audits, logging, access reviews, documentation. */
    complianceMultiplier: { none: 1.0, standard: 1.15, regulated: 1.5 },
    /** Support expectations price the response commitment, not the hours. */
    supportMultiplier: { business: 1.0, nextDay: 1.3, always: 2.0 },
    /** Faster release cadence needs more automation and verification. */
    cadenceMultiplier: { monthly: 0.9, biweekly: 1.0, continuous: 1.2 },
    /** Blended studio rate (USD/hour) across PM/dev/QA time. */
    blendedRate: 85,
    /** Estimate honesty: ±15% around the computed monthly figure. */
    rangeSpread: { low: 0.85, high: 1.15 },
    /** Industry benchmark: annual maintenance as a share of build cost. */
    benchmark: { low: 0.15, high: 0.2 },
  },

  /* ── 7. Project ROI Calculator ───────────────────────────────────────
   * Payback and ROI over a 3-year window; no discounting at this scale —
   * the decision is go/no-go, not treasury precision.
   */
  roi: {
    /** Cumulative bar strip horizon (months). */
    horizonMonths: 36,
    /** ROI reporting window (years). */
    windowYears: 3,
  },
} as const;

/* ────────────────────────────────────────────────────────────────────────
 * 1. Software Project Cost Estimator
 * ──────────────────────────────────────────────────────────────────────── */

export type Platform = 'web' | 'mobile' | 'webMobile' | 'desktop';
export type Scope = 'mvp' | 'full' | 'internal';
export type Complexity = 'simple' | 'typical' | 'complex';
export type DesignLevel = 'functional' | 'custom' | 'award';
export type Timeline = 'relaxed' | 'standard' | 'aggressive';
export type FeatureId = keyof typeof MODELS.projectCost.featureAdd;

export interface ProjectCostInput {
  platform: Platform;
  scope: Scope;
  features: FeatureId[];
  complexity: Complexity;
  design: DesignLevel;
  timeline: Timeline;
}

export interface CostLine {
  label: string;
  detail: string;
  amount: number;
}

export interface ProjectCostResult {
  /** Platform base after the scope multiplier. */
  base: number;
  scopeMultiplier: number;
  /** Base + all selected features, before the dials. */
  subtotal: number;
  total: number;
  low: number;
  high: number;
  /** Itemised hairline-table rows (base, features, dial adjustments). */
  lines: CostLine[];
  /** Team shape, e.g. 1 PM, 1 design, 3 devs, 1 QA. */
  team: { role: string; count: number }[];
  devs: number;
  weeks: number;
}

export function calculateProjectCost(input: ProjectCostInput): ProjectCostResult {
  const m = MODELS.projectCost;

  // Platform base — web+mobile bundles both platforms at a discount.
  const base =
    input.platform === 'webMobile'
      ? (m.platformBase.web + m.platformBase.mobile) * m.comboDiscount
      : m.platformBase[input.platform === 'web' ? 'web' : input.platform];

  const scopeMultiplier = m.scopeMultiplier[input.scope];
  const baseAdjusted = base * scopeMultiplier;

  const lines: CostLine[] = [
    {
      label: 'Platform base',
      detail:
        input.platform === 'webMobile'
          ? `Web + Mobile bundle (−${Math.round((1 - m.comboDiscount) * 100)}%) × ${scopeLabel(input.scope)} scope`
          : `${platformLabel(input.platform)} base × ${scopeLabel(input.scope)} scope`,
      amount: baseAdjusted,
    },
  ];

  let subtotal = baseAdjusted;
  for (const id of input.features) {
    const add = m.featureAdd[id];
    subtotal += add;
    lines.push({ label: featureLabel(id), detail: 'Feature add', amount: add });
  }

  // Multiplicative dials, applied in sequence to the running subtotal.
  const dials: { label: string; value: number; key: Complexity | DesignLevel | Timeline }[] = [
    { label: 'Complexity', value: m.complexityMultiplier[input.complexity], key: input.complexity },
    { label: 'Design level', value: m.designMultiplier[input.design], key: input.design },
    { label: 'Timeline', value: m.timelineMultiplier[input.timeline], key: input.timeline },
  ];
  let total = subtotal;
  for (const dial of dials) {
    const before = total;
    total *= dial.value;
    lines.push({
      label: dial.label,
      detail: `${dialKeyLabel(dial.key)} ×${dial.value.toFixed(2)}`,
      amount: total - before,
    });
  }

  // Duration & team: one developer per ~$60k of build, clamped to 2–6.
  const devs = Math.min(
    m.maxDevs,
    Math.max(m.minDevs, Math.ceil(total / m.devLoadThreshold))
  );
  // Burn-rate duration: how many months the budget funds this team, in weeks.
  const weeks = Math.ceil((total / (devs * m.monthlyBurnPerDev)) * m.weeksPerMonth);
  const designers =
    input.design === 'functional' ? 0 : input.design === 'custom' ? 1 : 2;

  const team = [
    { role: 'Product / project', count: 1 },
    { role: 'Design', count: designers },
    { role: 'Engineering', count: devs },
    { role: 'QA', count: 1 },
  ];

  return {
    base: baseAdjusted,
    scopeMultiplier,
    subtotal,
    total,
    low: total * m.rangeSpread.low,
    high: total * m.rangeSpread.high,
    lines,
    team,
    devs,
    weeks,
  };
}

export function platformLabel(platform: Platform): string {
  return {
    web: 'Web app',
    mobile: 'Mobile app',
    webMobile: 'Web + Mobile',
    desktop: 'Desktop',
  }[platform];
}

function scopeLabel(scope: Scope): string {
  return { mvp: 'MVP', full: 'full product', internal: 'internal tool' }[scope];
}

function dialKeyLabel(key: string): string {
  return {
    simple: 'Simple', typical: 'Typical', complex: 'Complex',
    functional: 'Functional', custom: 'Custom design', award: 'Award-grade',
    relaxed: 'Relaxed', standard: 'Standard', aggressive: 'Aggressive',
  }[key] ?? key;
}

export function featureLabel(id: FeatureId): string {
  return {
    auth: 'Accounts & auth',
    payments: 'Payments / subscriptions',
    dashboards: 'Dashboards & analytics',
    admin: 'Admin panel',
    integrations: 'Third-party integrations',
    ai: 'AI features',
    realtime: 'Realtime / messaging',
    files: 'File storage',
  }[id];
}

/* ────────────────────────────────────────────────────────────────────────
 * 2. MVP Feature Prioritizer (RICE-style without the Reach)
 * ──────────────────────────────────────────────────────────────────────── */

export interface PrioritizedFeature {
  id: string;
  name: string;
  impact: number; // 1–5 — how much it moves the core metric
  confidence: number; // 1–5 — how sure you are of that impact
  effort: number; // 1–5 — build cost (5 = heaviest)
  score: number; // (impact × confidence) / effort
}

export function scoreFeature(feature: {
  impact: number;
  confidence: number;
  effort: number;
}): number {
  // Effort is a 1–5 dial, never zero — division is always safe.
  const effort = Math.max(1, Math.min(5, feature.effort));
  return (feature.impact * feature.confidence) / effort;
}

/** Seed list shown on first load so the tool teaches itself. */
export const MVP_SEED: Omit<PrioritizedFeature, 'score'>[] = [
  { id: 'seed-accounts', name: 'User accounts', impact: 4, confidence: 4, effort: 3 },
  { id: 'seed-payments', name: 'Payments', impact: 5, confidence: 3, effort: 4 },
  { id: 'seed-admin', name: 'Admin dashboard', impact: 3, confidence: 4, effort: 3 },
  { id: 'seed-email', name: 'Email notifications', impact: 2, confidence: 4, effort: 1 },
];

/* ────────────────────────────────────────────────────────────────────────
 * 3. SaaS Unit Economics Calculator
 * ──────────────────────────────────────────────────────────────────────── */

export interface SaasInput {
  price: number; // $/month per subscriber
  grossMarginPct: number; // % of revenue kept after delivery costs
  monthlyChurnPct: number; // % of subscribers lost per month
  cac: number; // $ to acquire one subscriber
  subscribers: number; // current count
  netGrowthPct: number; // net monthly subscriber growth (new − churned), %
}

export interface SaasResult {
  mrr: number;
  arr: number;
  arpu: number;
  /** LTV = price × margin ÷ churn (months of margin a subscriber pays). */
  ltv: number;
  ltvToCac: number;
  /** CAC payback in months = CAC ÷ monthly gross profit per subscriber. */
  cacPaybackMonths: number;
  /** Subscribers × MRR for each of the next 12 months (index 0 = month 1). */
  projection: { month: number; mrr: number }[];
  health: 'healthy' | 'watch' | 'unsustainable';
}

export function calculateSaas(input: SaasInput): SaasResult {
  const margin = clampPct(input.grossMarginPct) / 100;
  const churn = Math.max(0.0001, clampPct(input.monthlyChurnPct) / 100);
  const netGrowth = clampPct(input.netGrowthPct) / 100;
  const cac = Math.max(0, input.cac);
  const subscribers = Math.max(0, input.subscribers);

  const grossProfitPerUser = input.price * margin;
  const ltv = grossProfitPerUser / churn;
  const ltvToCac = cac > 0 ? ltv / cac : Number.POSITIVE_INFINITY;

  const projection = Array.from({ length: MODELS.saas.projectionMonths }, (_, i) => {
    // Net growth already nets churn out; compounding is straightforward.
    const count = subscribers * Math.pow(1 + netGrowth, i + 1);
    return { month: i + 1, mrr: count * input.price };
  });

  return {
    mrr: subscribers * input.price,
    arr: subscribers * input.price * 12,
    arpu: subscribers > 0 ? (subscribers * input.price) / subscribers : input.price,
    ltv,
    ltvToCac,
    cacPaybackMonths: grossProfitPerUser > 0 ? cac / grossProfitPerUser : Number.POSITIVE_INFINITY,
    projection,
    health: ltvToCac >= 3 ? 'healthy' : ltvToCac >= 1 ? 'watch' : 'unsustainable',
  };
}

function clampPct(value: number): number {
  if (!Number.isFinite(value)) return 0;
  return Math.min(100, Math.max(0, value));
}

/* ────────────────────────────────────────────────────────────────────────
 * 4. Tech Stack Advisor
 * ──────────────────────────────────────────────────────────────────────── */

export type StackId = 'next' | 'django' | 'laravel' | 'rails' | 'reactNative' | 'flutter';

export interface StackLayer {
  name: string;
  reason: string;
}

export interface StackProfile {
  id: StackId;
  label: string;
  frontend: StackLayer;
  backend: StackLayer;
  database: StackLayer;
  hosting: StackLayer;
  why: string[];
  alternative: string;
}

/** The six curated stacks the advisor recommends between. */
export const STACKS: Record<StackId, StackProfile> = {
  next: {
    id: 'next',
    label: 'Next.js + Postgres',
    frontend: { name: 'Next.js (React)', reason: 'SSR/SSG — fast first paint and shareable pages' },
    backend: { name: 'Next.js route handlers + server actions', reason: 'One codebase for UI and API' },
    database: { name: 'PostgreSQL', reason: 'Relational default; scales with you' },
    hosting: { name: 'Managed platform (Vercel/Render)', reason: 'Zero-ops deploys, preview environments' },
    why: [
      'Best-in-class SEO story — pages render on the server for crawlers and social cards.',
      'One language and one repo from landing page to API keeps small teams fast.',
      'The largest hiring pool in frontend today — React skills are everywhere.',
    ],
    alternative: 'If your team lives in Python or PHP, a classic monolith (Django/Laravel) trades some frontend polish for a backend you already know.',
  },
  django: {
    id: 'django',
    label: 'Django + Postgres',
    frontend: { name: 'Django templates + htmx (or React where needed)', reason: 'Server-rendered by default, JS only where it earns its keep' },
    backend: { name: 'Django (Python)', reason: 'Batteries-included admin, auth, and ORM' },
    database: { name: 'PostgreSQL', reason: 'Django\u2019s best-served pairing' },
    hosting: { name: 'Managed containers (Railway/Fly.io)', reason: 'Simple Python runtime, easy scaling' },
    why: [
      'Python is the lingua franca of data and AI — models, scripts, and APIs share one language.',
      'The built-in admin panel saves weeks on any data-heavy back office.',
      'Mature, boring, documented — a decade of answers for every problem you will hit.',
    ],
    alternative: 'If SEO matters intensely and you have JS strength, Next.js gives you finer control over rendering and page performance.',
  },
  laravel: {
    id: 'laravel',
    label: 'Laravel + MySQL',
    frontend: { name: 'Blade + Livewire (or Inertia/React)', reason: 'Server-rendered pages with islands of interactivity' },
    backend: { name: 'Laravel (PHP)', reason: 'Elegant ORM, queues, billing, and mail out of the box' },
    database: { name: 'MySQL', reason: 'Ubiquitous hosting, battle-tested at commerce scale' },
    hosting: { name: 'Laravel Forge + VPS', reason: 'Cheap, predictable, fully controlled' },
    why: [
      'The fastest route to billing, subscriptions, and e-commerce workflows in any framework.',
      'Runs cheaply on ordinary hosting — lean budget posture is comfortable here.',
      'First-class ecosystem (Cashier, Nova, Scout) so you write less plumbing.',
    ],
    alternative: 'If you expect heavy custom frontend work, Laravel + Inertia + React is a stepping stone — or go full Next.js.',
  },
  rails: {
    id: 'rails',
    label: 'Ruby on Rails + Postgres',
    frontend: { name: 'Hotwire (Turbo + Stimulus)', reason: 'App-like feel without an SPA build chain' },
    backend: { name: 'Ruby on Rails', reason: 'Convention over configuration — decisions already made' },
    database: { name: 'PostgreSQL', reason: 'Rails\u2019 default for good reason' },
    hosting: { name: 'Heroku-style PaaS or Kamal on VPS', reason: 'Deploy in an afternoon' },
    why: [
      'The original productivity framework — MVPs and internal tools ship remarkably fast.',
      'Hotwire delivers interactivity without a separate frontend codebase.',
      'Strong, senior hiring pool; conventions make handovers painless.',
    ],
    alternative: 'If your team is JavaScript-first, Next.js covers the same ground with skills you already have.',
  },
  reactNative: {
    id: 'reactNative',
    label: 'React Native + Node',
    frontend: { name: 'React Native (Expo)', reason: 'iOS + Android from one React codebase' },
    backend: { name: 'Node.js (Express/TS)', reason: 'One language — TS — across app and API' },
    database: { name: 'PostgreSQL', reason: 'Solid relational core behind the API' },
    hosting: { name: 'Managed platform + EAS Update', reason: 'Over-the-air updates without store review' },
    why: [
      'JavaScript teams reuse people, patterns, and even code between web and mobile.',
      'Expo smooths builds, updates, and device APIs into a single toolchain.',
      'Near-native performance for business apps; native modules when you truly need them.',
    ],
    alternative: 'If the team has no JavaScript at all, Flutter offers one language, excellent tooling, and very consistent UI across platforms.',
  },
  flutter: {
    id: 'flutter',
    label: 'Flutter + Firebase',
    frontend: { name: 'Flutter (Dart)', reason: 'Pixel-consistent UI on iOS, Android, and web' },
    backend: { name: 'Firebase (Auth, Firestore, Functions)', reason: 'Backend assembled, not built' },
    database: { name: 'Cloud Firestore', reason: 'Realtime sync with zero servers' },
    hosting: { name: 'Firebase + Google Cloud', reason: 'Auth, analytics, crash reporting in one console' },
    why: [
      'Fastest path from idea to both stores for teams without platform experience.',
      'One language (Dart) renders identically everywhere — fewer platform surprises.',
      'Firebase removes backend work entirely — ideal for lean, ASAP launches.',
    ],
    alternative: 'As the product grows, many teams graduate Firestore to Postgres behind an API — plan that migration before the data model hardens.',
  },
};

export type BuildingGoal = 'content' | 'webapp' | 'ecommerce' | 'saas' | 'mobile' | 'ai';
export type ScaleLevel = 'hundreds' | 'thousands' | 'tensThousands' | 'millions';
export type TimeToMarket = 'asap' | 'balanced' | 'norush';
export type TeamBackground = 'javascript' | 'python' | 'php' | 'none';
export type SeoCritical = 'yes' | 'no';
export type BudgetPosture = 'lean' | 'normal';

export interface StackAnswers {
  building: BuildingGoal;
  scale: ScaleLevel;
  time: TimeToMarket;
  background: TeamBackground;
  seo: SeoCritical;
  budget: BudgetPosture;
}

export interface StackRecommendation {
  stack: StackProfile;
  runnerUp: StackProfile | null;
  scores: { id: StackId; label: string; score: number }[];
}

/** Score all six stacks from the six answers, then apply edge-case rules. */
export function recommendStack(answers: StackAnswers): StackRecommendation {
  const s = MODELS.stackAdvisor.scores;
  const tally: Record<StackId, number> = {
    next: 0, django: 0, laravel: 0, rails: 0, reactNative: 0, flutter: 0,
  };

  const answerPerQuestion = [
    s.building[answers.building],
    s.scale[answers.scale],
    s.time[answers.time],
    s.background[answers.background],
    s.seo[answers.seo],
    s.budget[answers.budget],
  ];
  for (const perStack of answerPerQuestion) {
    for (const [id, points] of Object.entries(perStack ?? {})) {
      tally[id as StackId] += points;
    }
  }

  // Rule 1 — mobile is a two-horse race decided by team background.
  if (answers.building === 'mobile') {
    const nudge = MODELS.stackAdvisor.rules.mobileBackgroundNudge[answers.background];
    tally[nudge] += 1;
    for (const id of Object.keys(tally) as StackId[]) {
      if (!MODELS.stackAdvisor.rules.mobileShortlist.includes(id)) {
        tally[id] = -1; // excluded from the podium
      }
    }
  }

  // Rule 2 — AI products ride the Python ecosystem regardless of comfort.
  if (answers.building === 'ai') {
    tally[MODELS.stackAdvisor.rules.aiPreferred] += 10;
  }

  const ranked = (Object.keys(tally) as StackId[])
    .map((id) => ({ id, label: STACKS[id].label, score: tally[id] }))
    .sort((a, b) => b.score - a.score || a.label.localeCompare(b.label));

  return {
    stack: STACKS[ranked[0].id],
    runnerUp: ranked[1].score >= 0 ? STACKS[ranked[1].id] : null,
    scores: ranked,
  };
}

/* ────────────────────────────────────────────────────────────────────────
 * 5. Cloud Cost Estimator
 * ──────────────────────────────────────────────────────────────────────── */

export type ComputeTier = 'serverless' | 'small' | 'medium' | 'large';
export type CloudExtra = 'cdn' | 'managedDb' | 'media' | 'backups';

export interface CloudCostInput {
  monthlyActiveUsers: number;
  storagePerUserGb: number;
  bandwidthPerUserGb: number;
  computeTier: ComputeTier;
  extras: CloudExtra[];
}

export interface CloudCostResult {
  lines: { label: string; detail: string; amount: number }[];
  monthly: number;
  low: number;
  high: number;
  annual: number;
}

export function calculateCloudCost(input: CloudCostInput): CloudCostResult {
  const m = MODELS.cloudCost;
  const users = Math.max(0, input.monthlyActiveUsers);
  const storageGb = Math.max(0, input.storagePerUserGb) * users;
  const bandwidthGb = Math.max(0, input.bandwidthPerUserGb) * users;

  const compute =
    m.computeBase[input.computeTier] + m.computePerUser[input.computeTier] * users;

  const lines = [
    {
      label: 'Compute',
      detail: `${computeTierLabel(input.computeTier)} tier — base + $${m.computePerUser[input.computeTier]}/user`,
      amount: compute,
    },
    {
      label: 'Storage',
      detail: `${formatUnits(storageGb)} GB × $${m.storagePerGb}/GB`,
      amount: storageGb * m.storagePerGb,
    },
    {
      label: 'Bandwidth',
      detail: `${formatUnits(bandwidthGb)} GB × $${m.bandwidthPerGb}/GB`,
      amount: bandwidthGb * m.bandwidthPerGb,
    },
  ];

  let monthly = compute + storageGb * m.storagePerGb + bandwidthGb * m.bandwidthPerGb;

  const extraLines: { label: string; detail: string; amount: number }[] = [];
  for (const extra of input.extras) {
    let line: { label: string; detail: string; amount: number };
    if (extra === 'cdn') {
      line = {
        label: 'CDN',
        detail: `Edge delivery — ${formatUnits(bandwidthGb)} GB × $${m.cdnPerGb}/GB`,
        amount: bandwidthGb * m.cdnPerGb,
      };
    } else if (extra === 'managedDb') {
      line = {
        label: 'Managed database',
        detail: `$${m.managedDbBase} base + $${m.managedDbPerUser}/user`,
        amount: m.managedDbBase + m.managedDbPerUser * users,
      };
    } else if (extra === 'media') {
      line = {
        label: 'Media processing',
        detail: `$${m.mediaBase} base + $${m.mediaPerUser}/user`,
        amount: m.mediaBase + m.mediaPerUser * users,
      };
    } else {
      line = {
        label: 'Daily backups',
        detail: `${Math.round(m.backupStorageShare * 100)}% of storage, $${m.backupFloor} floor`,
        amount: Math.max(m.backupFloor, storageGb * m.storagePerGb * m.backupStorageShare),
      };
    }
    extraLines.push(line);
    monthly += line.amount;
  }

  return {
    lines: [...lines, ...extraLines],
    monthly,
    low: monthly * m.rangeSpread.low,
    high: monthly * m.rangeSpread.high,
    annual: monthly * 12,
  };
}

function computeTierLabel(tier: ComputeTier): string {
  return { serverless: 'Serverless', small: 'Small', medium: 'Medium', large: 'Large' }[tier];
}

/** 12,500 → "12.5k" for compact unit readouts. */
function formatUnits(value: number): string {
  if (value >= 1_000_000) return `${(value / 1_000_000).toFixed(1)}M`;
  if (value >= 1_000) return `${(value / 1_000).toFixed(1)}k`;
  return `${Math.round(value * 10) / 10}`;
}

/**
 * Log-scale mapping for the MAU slider: position 0–1 → 100–1M users.
 * Presentation stays honest across four orders of magnitude.
 */
export function sliderToUsers(position: number): number {
  const t = Math.min(1, Math.max(0, position));
  return Math.round(Math.pow(10, 2 + t * 4));
}

export function usersToSlider(users: number): number {
  const t = (Math.log10(Math.max(100, users)) - 2) / 4;
  return Math.min(1, Math.max(0, t));
}

export function formatUsers(users: number): string {
  if (users >= 1_000_000) return '1M';
  if (users >= 1_000) return `${Math.round(users / 100) / 10}k`;
  return String(users);
}

/* ────────────────────────────────────────────────────────────────────────
 * 6. Maintenance Cost Calculator
 * ──────────────────────────────────────────────────────────────────────── */

export type AppSize = 'small' | 'medium' | 'large';
export type TechAge = 'current' | 'aging' | 'legacy';
export type UsersTier = 'light' | 'moderate' | 'heavy';
export type Compliance = 'none' | 'standard' | 'regulated';
export type SupportLevel = 'business' | 'nextDay' | 'always';
export type ReleaseCadence = 'monthly' | 'biweekly' | 'continuous';

export interface MaintenanceInput {
  size: AppSize;
  age: TechAge;
  users: UsersTier;
  compliance: Compliance;
  support: SupportLevel;
  cadence: ReleaseCadence;
  /** Optional original build cost (USD) — powers the benchmark comparison. */
  originalBuildCost?: number;
}

export interface MaintenanceResult {
  hours: number;
  monthly: number;
  low: number;
  high: number;
  annual: number;
  factors: { label: string; value: number }[];
  benchmark: { low: number; high: number } | null;
}

export function calculateMaintenance(input: MaintenanceInput): MaintenanceResult {
  const m = MODELS.maintenance;

  const factors = [
    { label: 'Technology age', value: m.ageMultiplier[input.age] },
    { label: 'Active users', value: m.usersMultiplier[input.users] },
    { label: 'Compliance', value: m.complianceMultiplier[input.compliance] },
    { label: 'Support level', value: m.supportMultiplier[input.support] },
    { label: 'Release cadence', value: m.cadenceMultiplier[input.cadence] },
  ];

  const combined = factors.reduce((acc, f) => acc * f.value, 1);
  const hours = m.baseHours[input.size] * combined;
  const monthly = hours * m.blendedRate;

  const benchmark =
    input.originalBuildCost && input.originalBuildCost > 0
      ? {
          low: (input.originalBuildCost * m.benchmark.low) / 12,
          high: (input.originalBuildCost * m.benchmark.high) / 12,
        }
      : null;

  return {
    hours,
    monthly,
    low: monthly * m.rangeSpread.low,
    high: monthly * m.rangeSpread.high,
    annual: monthly * 12,
    factors,
    benchmark,
  };
}

/* ────────────────────────────────────────────────────────────────────────
 * 7. Project ROI Calculator
 * ──────────────────────────────────────────────────────────────────────── */

export interface RoiInput {
  investment: number; // one-time $ (build, licences, rollout)
  ongoingCostPerYear: number; // $ per year (hosting, licences, maintenance)
  hoursSavedPerMonth: number;
  loadedHourlyRate: number; // $ — salary × burden, what an hour truly costs
  newRevenuePerMonth: number;
  costsAvoidedPerMonth: number;
}

export interface RoiResult {
  monthlyBenefit: number; // hours + revenue + avoidance
  monthlyNet: number; // benefit − ongoing cost / 12
  netBenefitPerYear: number;
  /** investment ÷ monthlyNet — the honest payback clock. */
  paybackMonths: number | null; // null when it never pays back
  roi3yrPct: number; // (36-month net gain ÷ investment) × 100
  cumulative: number[]; // running total after each month, length 36
}

export function calculateRoi(input: RoiInput): RoiResult {
  const investment = Math.max(0, input.investment);
  const monthlyOngoing = Math.max(0, input.ongoingCostPerYear) / 12;

  const monthlyBenefit =
    Math.max(0, input.hoursSavedPerMonth) * Math.max(0, input.loadedHourlyRate) +
    Math.max(0, input.newRevenuePerMonth) +
    Math.max(0, input.costsAvoidedPerMonth);
  const monthlyNet = monthlyBenefit - monthlyOngoing;

  const paybackMonths =
    monthlyNet > 0 ? investment / monthlyNet : null;

  const cumulative = Array.from(
    { length: MODELS.roi.horizonMonths },
    (_, i) => (i + 1) * monthlyNet - investment
  );

  const threeYearGain = monthlyNet * 12 * MODELS.roi.windowYears - investment;
  const roi3yrPct = investment > 0 ? (threeYearGain / investment) * 100 : 0;

  return {
    monthlyBenefit,
    monthlyNet,
    netBenefitPerYear: monthlyNet * 12,
    paybackMonths,
    roi3yrPct,
    cumulative,
  };
}
