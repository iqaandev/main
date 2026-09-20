/*
 * IQAAN Insights registry — single source of truth for the /insights hub,
 * article routes, metadata, and the sitemap. Articles are typed block
 * models rendered by ArticleLayout (no markdown dependency); each is
 * interlinked with the calculator it pairs with.
 * Content is English-only this release.
 */

export type ArticleCategory = 'Cost & Budgeting' | 'Product' | 'SaaS Metrics';

export type ArticleBlock =
  | { type: 'p'; text: string }
  | { type: 'h2'; text: string }
  | { type: 'h3'; text: string }
  | { type: 'ul'; items: string[] }
  | { type: 'quote'; text: string }
  | { type: 'stat'; value: string; caption: string }
  /** Inline tool CTA panel — `tool` is a slug from the tools registry. */
  | { type: 'cta'; tool: string };

export interface Article {
  /** URL slug under /insights/ */
  slug: string;
  /** Display title — the on-page H1 */
  title: string;
  /** Short title (≤60 chars) leading the <title> tag */
  titleTag: string;
  /** One-sentence standfirst under the H1 */
  dek: string;
  /** Meta description (≤160 chars) */
  description: string;
  /** Publication date, ISO — drives display dates and BlogPosting JSON-LD */
  publishedISO: string;
  /** Honest reading time, rounded from the body word count */
  readingMinutes: number;
  category: ArticleCategory;
  /** The article itself, as typed blocks */
  body: ArticleBlock[];
  /** Tool slugs surfaced as cross-links (inline CTAs + Related tools) */
  relatedTools: string[];
  /** Article slugs surfaced in "Keep reading" */
  relatedArticles: string[];
}

const MONTHS_LONG = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];
const MONTHS_SHORT = [
  'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
  'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec',
];

/** "2026-09-19" → "19 September 2026" (deterministic, no ICU dependency). */
export function formatDateLong(iso: string): string {
  const [y, m, d] = iso.split('-').map(Number);
  return `${d} ${MONTHS_LONG[m - 1]} ${y}`;
}

/** "2026-09-19" → "19 Sep 2026" — the mono index-row date. */
export function formatDateShort(iso: string): string {
  const [y, m, d] = iso.split('-').map(Number);
  return `${String(d).padStart(2, '0')} ${MONTHS_SHORT[m - 1]} ${y}`;
}

export const articles: Article[] = [
  /* ──────────────────────────────────────────────────────────────────── */
  {
    slug: 'software-development-cost-2026',
    title: 'How Much Does Custom Software Development Cost in 2026?',
    titleTag: 'How Much Does Custom Software Development Cost in 2026?',
    dek: 'No honest studio can quote a number from a paragraph — but the real price bands, what moves a project between them, and the invoice that follows launch are all knowable in advance.',
    description:
      'Custom software costs in 2026: honest price bands ($25k MVPs to $400k platforms), what drives them, the hidden maintenance invoice, and how to check any quote.',
    publishedISO: '2026-09-19',
    readingMinutes: 7,
    category: 'Cost & Budgeting',
    relatedTools: ['project-cost-estimator', 'maintenance-calculator', 'roi-calculator'],
    relatedArticles: ['how-to-scope-an-mvp', 'ltv-cac-ratio-explained'],
    body: [
      {
        type: 'p',
        text: 'Ask a software studio what custom development costs and you will hear the same two words everywhere: it depends. The answer is honest and useless. It depends on the wrong things — on who is asking and how eager they sound — when it should depend on a short list of variables you can name in advance: what you are building, how much of it, to what standard, how fast, and under which rules.',
      },
      {
        type: 'p',
        text: 'This article will not quote your project; nothing truthful can. It will do something more useful: show you the real price bands, what actually moves a project between them, the second invoice that arrives after launch, and how to pressure-test any quote you receive. The numbers are ballparks drawn from commonly cited industry rates — defensible, not destiny.',
      },
      { type: 'h2', text: 'The honest price bands' },
      {
        type: 'p',
        text: 'With scope unknown, a range is the most truthful unit of measurement. These bands assume a competent external team — a freelance collective or a studio — building for a commercial client in 2026:',
      },
      {
        type: 'ul',
        items: [
          'A simple MVP web application — one user role, a handful of screens, standard authentication, no payments: $25,000–$50,000.',
          'A typical production product — payments, dashboards, a real design system, an admin area, a few integrations: $60,000–$150,000.',
          'A complex platform — multi-sided markets, heavy realtime, web and mobile together, compliance obligations: $150,000–$400,000 and up.',
          'Mobile on top of web — add 20–40% over the web-only figure. Two platforms rarely double the work; the logic is shared, the interfaces are not.',
          'Enterprise and regulated contexts — healthcare, finance, government: multiply rather than add. Compliance does not scale; it compounds.',
        ],
      },
      {
        type: 'stat',
        value: '$60–150k',
        caption:
          'Where most funded first products land — the band a realistic v1 budget should be able to cover.',
      },
      {
        type: 'p',
        text: 'Within each band, the spread is not noise. It is the sum of everything below, priced. A $60k product and a $150k product can share a feature list and differ almost everywhere else.',
      },
      {
        type: 'p',
        text: 'Two cautions on reading the bands. First, a quote far below the band your project belongs to is not a bargain; it is usually a different project wearing the same name — cut scope, a junior team, or a provider planning to discover the real price alongside you. Second, the bands describe competent work at market rates. They say nothing about what your project should cost, only what projects shaped like it typically do.',
      },
      { type: 'cta', tool: 'project-cost-estimator' },
      { type: 'h2', text: 'What actually drives the number' },
      {
        type: 'p',
        text: 'Feature count is the least interesting cost driver. Two products with "twenty features" can be priced a continent apart. What matters is what the features touch:',
      },
      {
        type: 'ul',
        items: [
          'Authentication is solved work. Email-and-password or a social login is a week or two, including the edge cases.',
          'Payments are priced per ambition. One provider, one checkout flow is quick; subscriptions with proration, multi-currency, and invoicing edges are a project of their own.',
          'Realtime is expensive forever. Anything where two users must see the same truth within a second — presence, collaborative editing, dispatch — carries architecture cost for the life of the product, not just at build time.',
          'AI features are priced per integration. Calling a model API is an afternoon; evaluating outputs, guarding costs, and owning the failure modes is a project.',
          'Integrations are priced per depth. Reading from a well-documented API is trivial; synchronizing two systems of record that disagree about reality is where budgets go to die.',
        ],
      },
      { type: 'h3', text: 'The multipliers on top' },
      {
        type: 'ul',
        items: [
          'Design level. From a templated UI to a bespoke design system can swing the budget by a third.',
          'Compliance. SOC 2, HIPAA, and GDPR obligations add audits, documentation, and rework — commonly 25–50% on the workstreams they touch.',
          'Timeline. Compressing a schedule means more developers in parallel and schedule risk absorbed by the vendor. Aggressive timelines typically add 25–30% to the price. Speed is bought, not negotiated.',
          'Team seniority and region. Rates run from roughly $25–50/hour for offshore collectives through $75–125 for nearshore and mixed teams to $150–250+ for senior Western studios. Cheap hours that require twice as many are not cheap.',
        ],
      },
      {
        type: 'stat',
        value: '+25–30%',
        caption:
          'What compressing a schedule typically adds — speed is bought with parallelism, not discounts.',
      },
      { type: 'h3', text: 'Who does the work' },
      {
        type: 'p',
        text: 'The same specification priced by a freelancer collective, a mid-size studio, and a large consultancy can differ by three times — and the difference is not only margin. It is who writes the code, who owns the architecture, who answers at 2 a.m., and how much process arrives bundled with the hours. Collectives fit well-defined builds with an owner on your side. Studios fit products that will keep evolving after launch. Consultancies fit organizations that need the audit trail as much as the software. Priced honestly, each is the cheapest option for a different project.',
      },
      { type: 'h3', text: 'Where the money goes' },
      {
        type: 'p',
        text: 'A typical project budget splits in a predictable way. Discovery and design commonly take 15–20% — the phase that prices every other phase. The build itself is 50–60%. Testing and hardening take 10–15%, and deployment with launch support takes the remainder. When a quote shows 95% build and no testing line, the testing is still in the project; it has merely been hidden in the change orders.',
      },
      {
        type: 'p',
        text: 'The split explains why the cheapest phase to invest in is the first one. A week of discovery that kills a wrong assumption costs a week. The same assumption, discovered mid-build, costs its own build price plus the rework.',
      },
      { type: 'h2', text: 'The hidden second invoice' },
      {
        type: 'p',
        text: 'The build is not the price of software. The build is the down payment. Anything that stays alive accrues three costs that rarely appear on a proposal’s headline figure:',
      },
      {
        type: 'ul',
        items: [
          'Maintenance. The commonly cited norm is 15–20% of the original build cost, every year. Dependencies age, platforms move, and security patches do not negotiate.',
          'Infrastructure. Hosting, databases, email, monitoring, CDN. A modest product runs a few hundred dollars a month; the number scales with usage, not with your revenue.',
          'Iteration. The features version one taught you to want. Budget for them, or watch the product calcify on launch day.',
        ],
      },
      {
        type: 'quote',
        text: 'Treat the build cost as a down payment. The real price of software is paid every year after launch.',
      },
      {
        type: 'stat',
        value: '15–20%',
        caption:
          'Of the build cost, per year — the industry’s standing rule of thumb for keeping software alive.',
      },
      {
        type: 'p',
        text: 'A $120,000 build therefore implies roughly $1,500–$2,000 a month of ongoing care before infrastructure and before any new features. None of this is waste — it is the cost of software that keeps working while the world around it changes. The waste is budgeting as if the cost did not exist.',
      },
      { type: 'cta', tool: 'maintenance-calculator' },
      { type: 'h2', text: 'Why estimates go wrong' },
      {
        type: 'p',
        text: 'Most overruns are not estimation failures; they are scope failures wearing an estimator’s clothes. The recurring causes are few, and they rhyme:',
      },
      {
        type: 'ul',
        items: [
          'Scope creep with a nicer name. "Just one more screen" five times is not a change — it is a phase.',
          'Unstated integrations. The CRM, the accounting system, the legacy database nobody mentioned in discovery.',
          'Skipping discovery to save money. Discovery is the cheapest phase, and it is the one that prices every other phase.',
          'Estimates used as targets. A schedule the delivery team does not believe in becomes a deadline that quality pays for.',
        ],
      },
      {
        type: 'p',
        text: 'Healthy projects carry contingency — commonly 10–20%, named as such in the budget. A plan with zero contingency is not lean; it is optimistic, and optimism gets paid for at the change-order rate.',
      },
      { type: 'h2', text: 'How to sanity-check any quote' },
      {
        type: 'p',
        text: 'Whether the quote on your desk came from a three-person collective or a named consultancy, the same four questions protect you:',
      },
      {
        type: 'ul',
        items: [
          'Is it itemized? You should see phases, features, and rates. A single number is a mood, not a quote.',
          'Are the assumptions written down? Platform versions, integration scope, who provides design, content, and testing. Every unwritten assumption is a place a project can hide a change order.',
          'What is excluded? Testing depth, launch support, infrastructure, app-store submissions, post-launch fixes. Exclusions are the fine print of overruns.',
          'What does change cost? An hourly rate for change work and a change-request process, agreed before anyone is upset.',
        ],
      },
      {
        type: 'p',
        text: 'A studio that answers these four questions comfortably has priced projects before. One that bristles has been asked something new — which tells you something too.',
      },
      {
        type: 'p',
        text: 'Comparing quotes across vendors adds a fifth discipline: compare like for like. Lay the quotes side by side and map each line — the cheapest one almost always assumes less, excludes more, or both. The comparison that matters is not price against price; it is price against stated assumption, and the winner is the vendor whose assumptions you believe.',
      },
      { type: 'h2', text: 'When custom is the wrong answer' },
      {
        type: 'p',
        text: 'The honest frame is not build versus buy; it is build, buy, or configure. If a $50-per-seat SaaS product does 80% of the job, the custom build is a vanity purchase: you are paying build prices plus a permanent maintenance habit to avoid a subscription. Custom development earns its cost in exactly three situations:',
      },
      {
        type: 'ul',
        items: [
          'The workflow is your competitive advantage. Nobody sells software for a process only your company does well.',
          'The gap is structural, not cosmetic. Missing integrations and one-off automations are configuration; a missing core capability is a build.',
          'The economics compound. When seat-based pricing punishes your volume, owning the software is arithmetic, not pride.',
        ],
      },
      {
        type: 'p',
        text: 'Run the build-or-buy question with real numbers before falling in love with either answer. If none of the three situations applies to you, the subscription is not a compromise — it is the correct answer, and the money you did not spend is runway. And when the quote arrives, you now know what to ask of it.',
      },
      { type: 'cta', tool: 'roi-calculator' },
    ],
  },

  /* ──────────────────────────────────────────────────────────────────── */
  {
    slug: 'how-to-scope-an-mvp',
    title: 'How to Scope an MVP You Can Actually Ship',
    titleTag: 'How to Scope an MVP You Can Actually Ship',
    dek: 'Feature lists lie because meetings reward optimism. A scope you can ship comes from scoring, cutting, and timeboxing — the whole method, worked end to end.',
    description:
      'How to scope an MVP: score features with RICE, draw an honest cut line, protect the core loop, and timebox the build — worked through a real example.',
    publishedISO: '2026-09-12',
    readingMinutes: 6,
    category: 'Product',
    relatedTools: ['mvp-prioritizer', 'project-cost-estimator', 'tech-stack-advisor'],
    relatedArticles: ['software-development-cost-2026', 'ltv-cac-ratio-explained'],
    body: [
      {
        type: 'p',
        text: 'Every stalled product has the same origin story: a whiteboard, an enthusiastic room, and no adversary in sight. Every feature sounded essential. Sixteen features became "the product." Nine months later nothing had shipped, because sixteen features are not a product — they are a roadmap wearing a launch date.',
      },
      {
        type: 'p',
        text: 'The term MVP has been worn smooth by misuse. It does not mean a small version of everything. Minimum viable product means the smallest thing you can put in front of a real user that still teaches you whether the idea works. An MVP is a learning vehicle. You are not building less of the final product; you are building the instrument that tells you what the final product is.',
      },
      {
        type: 'p',
        text: 'The discipline pays twice. A small, shipped scope ships sooner — and it is the only scope that produces clean signal. Every extra feature in v1 muddies what later numbers mean: if booking, payments, and reminders all launched together and usage disappoints, which one failed? A cut scope answers its own question.',
      },
      { type: 'h2', text: 'Why feature lists lie' },
      {
        type: 'p',
        text: 'In a meeting, every feature defends itself with a plausible customer. Nobody argues against payments, or profiles, or export. But plausibility is not priority. The room conflates "a user would want this" with "the product dies without this," and the list grows until nobody can account for it. The list is not lying maliciously; it is aggregating optimism, which is worse, because everyone involved is sincere.',
      },
      { type: 'quote', text: 'Everything is essential in a meeting. Almost nothing is essential in a launch.' },
      { type: 'h2', text: 'Write down the question first' },
      {
        type: 'p',
        text: 'Before scoring anything, write the one question the MVP exists to answer — one sentence, with a number in it. "Will clinics pay $30 a month for a booking page that fills their empty slots?" is a question. "Validate the scheduling concept" is a mood. The sentence disciplines everything downstream: features that cannot touch the question do not get scored, however loud their advocates.',
      },
      {
        type: 'p',
        text: 'The sentence also defines what "minimum" means. Minimum is the cheapest honest test of the question — not the most featureless version imaginable. Sometimes the honest test needs more than you hoped. More often it needs dramatically less.',
      },
      { type: 'h2', text: 'Scoring beats opinions' },
      {
        type: 'p',
        text: 'The fix is not a stronger opinion. The fix is arithmetic. RICE — Reach, Impact, Confidence, Effort — turns "I feel strongly about this" into four numbers anyone at the table can challenge:',
      },
      {
        type: 'ul',
        items: [
          'Reach — how many users or prospects the feature touches in a quarter. Raw counts, not percentages.',
          'Impact — how hard it moves each of those users toward the behavior you need, on a rough scale from minimal to massive.',
          'Confidence — how sure you are of the estimate above. Evidence earns high confidence; a hunch does not.',
          'Effort — the person-weeks or person-months to build it. The denominator, which is the entire point.',
        ],
      },
      {
        type: 'p',
        text: 'Score = Reach × Impact × Confidence ÷ Effort. Dividing by effort is what makes cheap, high-value work float to the top and expensive ceremony sink to the bottom. For a first MVP with no users yet, reach is often uniform across candidates, and the three remaining terms carry the signal.',
      },
      { type: 'h3', text: 'A worked example' },
      {
        type: 'p',
        text: 'Say you are building a scheduling product for small clinics. The whiteboard holds four candidates: a self-serve booking page, online payment at booking, multi-practitioner team calendars, and an admin dashboard with exports. One thousand clinics are on the waitlist. Score them:',
      },
      {
        type: 'ul',
        items: [
          'Self-serve booking page — Reach 800, Impact 3, Confidence 90%, Effort 2 person-weeks: 800 × 3 × 0.9 ÷ 2 = 1,080.',
          'Payment at booking — Reach 800, Impact 2, Confidence 80%, Effort 3 person-weeks: 800 × 2 × 0.8 ÷ 3 ≈ 427.',
          'Team calendars — Reach 200, Impact 3, Confidence 70%, Effort 5 person-weeks: 200 × 3 × 0.7 ÷ 5 = 84.',
          'Admin dashboard with CSV export — Reach 20 (staff only), Impact 1, Confidence 100%, Effort 2 person-weeks: 20 × 1 × 1.0 ÷ 2 = 10.',
        ],
      },
      {
        type: 'p',
        text: 'The sort is not close. Booking beats payment 2.5 to 1 on value per week of effort. The dashboard — the feature most likely to be built first, because it is what the founders look at every morning — scores last by an order of magnitude. That is the arithmetic talking, and it is the reason scoring exists: it defends the product against the loudest person in the room, including when the loudest person is you.',
      },
      {
        type: 'p',
        text: 'Apply the cut line after the top two and the v1 writes itself: a booking page that works, with payment attached to it. Everything the clinics asked for — team views, exports, the dashboard — still exists, in v2, scored in daylight rather than fought over in the dark.',
      },
      { type: 'cta', tool: 'mvp-prioritizer' },
      { type: 'h2', text: 'The cut-line discipline' },
      {
        type: 'p',
        text: 'Scoring produces an order; the cut line produces a scope. Draw the line where the budget or the calendar runs out — not where enthusiasm does. Everything above the line is v1. Everything below it is v2, written down where the whole team can see it. A deferred list is not a failure; it is the plan. Version two exists for a reason, and the reason is version one shipping.',
      },
      {
        type: 'p',
        text: 'The test of a cut line: would you dare show what is above it to a paying stranger? If the answer is no, the scope is still a demo, not an MVP.',
      },
      { type: 'h2', text: 'What you must never cut — and what you safely can' },
      {
        type: 'p',
        text: 'Some omissions save two weeks; others just move the failure to launch day. The distinction matters more than the scoring:',
      },
      {
        type: 'ul',
        items: [
          'The core loop. The one path that delivers the product’s value must work end to end. Ugly is fine. Broken is not.',
          'Measurement. Analytics on the loop itself. Without instrumentation you run an experiment and read none of the results.',
          'Error states. Failures, empty screens, and the dead ends at the edge of the loop. Users forgive plain; they do not forgive silent data loss.',
        ],
      },
      {
        type: 'p',
        text: 'On measurement, one number is enough. Pick the single metric that answers your written question — bookings completed, payments made, invites accepted — and instrument it before launch week. Ten metrics tracked casually are worth less than one tracked honestly.',
      },
      {
        type: 'p',
        text: 'And the cuts that are almost always safe in v1:',
      },
      {
        type: 'ul',
        items: [
          'Admin polish. An internal tool can be functional and homely. Your team logs in every day out of necessity, not delight.',
          'Edge cases at the margins. The long tail of rare inputs can wait behind validation and a clear error message.',
          'Scale. Build for a hundred users, not a hundred thousand. Architecture you will need later is cheaper to buy later.',
        ],
      },
      { type: 'h2', text: 'Timeboxing and the walk-away test' },
      {
        type: 'p',
        text: 'Unscoped time is how MVPs die politely. Fix the calendar first — eight to twelve weeks is a common honest box for a scored, cut v1 — and let the scope negotiate against it, never the reverse. When the box overflows, the score order decides what leaves. The calendar is the one stakeholder that cannot be persuaded.',
      },
      {
        type: 'p',
        text: 'Then apply the walk-away test: name the date you would cancel the project rather than extend it. If no such date exists, you do not have a project; you have a habit. Writing the date down before the build starts is the cheapest schedule insurance available.',
      },
      { type: 'h3', text: 'Start from the stack up' },
      {
        type: 'p',
        text: 'One scoping input people forget: the stack is a scope decision. A framework your team already drives shrinks the effort estimate on every feature; an exotic one quietly doubles them. Choose boring, choose familiar — then score.',
      },
      { type: 'cta', tool: 'tech-stack-advisor' },
      { type: 'h2', text: 'Price the scope before you commit the calendar' },
      {
        type: 'p',
        text: 'A scored, cut scope has a third virtue: it can be priced. A sixteen-item feature list is unquotable; a v1 of four scored features with explicit deferrals is an estimator’s dream — and your budget’s. This is also the order a studio runs: scope, price, calendar. Reverse the order — pick a date, then discover what fits — and every number after it is negotiated fiction.',
      },
      { type: 'cta', tool: 'project-cost-estimator' },
    ],
  },

  /* ──────────────────────────────────────────────────────────────────── */
  {
    slug: 'ltv-cac-ratio-explained',
    title: 'LTV:CAC Explained: The One SaaS Metric That Predicts Survival',
    titleTag: 'LTV:CAC Explained: The Metric That Predicts Survival',
    dek: 'Most metrics measure motion; one division measures whether the business works. What LTV:CAC means, where it lies to you, and the arithmetic behind the 3:1 rule.',
    description:
      'LTV:CAC explained: the formulas, the 3:1 benchmark, where the ratio lies to you, and a worked example — the metric that predicts SaaS survival.',
    publishedISO: '2026-09-05',
    readingMinutes: 6,
    category: 'SaaS Metrics',
    relatedTools: ['saas-calculator', 'roi-calculator'],
    relatedArticles: ['software-development-cost-2026', 'how-to-scope-an-mvp'],
    body: [
      {
        type: 'p',
        text: 'SaaS dashboards encourage a particular illness: metric collection. Monthly signups, sessions, pipeline, NPS, follower counts — each defensible on its own, meaningless together. Most of them measure motion. Almost none of them measure whether the business works.',
      },
      {
        type: 'p',
        text: 'LTV:CAC is the exception. One division — lifetime value over customer acquisition cost — compresses pricing, retention, margin, and sales efficiency into a single verdict: are you earning your customers, or buying them? Companies die of the second condition while celebrating growth the whole way down.',
      },
      { type: 'h2', text: 'The two terms, defined properly' },
      {
        type: 'p',
        text: 'Lifetime value is the gross profit a customer generates before they leave — not the revenue. The standard formula: LTV = ARPU × gross margin ÷ churn. ARPU is monthly revenue per user. Gross margin is what survives hosting, support, and payment fees. Churn is the monthly rate at which customers leave. All three terms are commonly mis-measured, which we will get to.',
      },
      {
        type: 'p',
        text: 'Customer acquisition cost is the fully loaded cost of winning a customer: sales salaries and commissions, marketing spend, onboarding effort, and the tooling behind each, divided by customers won. CAC salaried away — a founder doing "free" sales — is the most popular way to flatter the ratio and mislead yourself.',
      },
      {
        type: 'p',
        text: 'One definitional trap deserves its own paragraph: gross margin is revenue minus the cost of serving the customer — hosting, support, payment fees, third-party licenses. It is not the cost of building the software; development sits below the line. Healthy SaaS gross margins typically run 70–85%, which is a large part of why the software business is worth being in — and a margin below 60% deserves a hard look before the ratio is computed at all.',
      },
      { type: 'h2', text: 'The benchmarks, and their limits' },
      {
        type: 'ul',
        items: [
          'Below 1 — you are buying revenue at a loss. Every customer makes the company poorer; growth accelerates the failure.',
          '1 to 3 — fragile. The model can work, but nothing has room to slip: not pricing, not retention, not sales efficiency.',
          '3 and above — healthy by the convention most operators and investors use. You earn back roughly three times what a customer costs.',
          'Above 5 — suspicious in the other direction, commonly read as under-investing in growth. If customers are that profitable, buy more of them.',
        ],
      },
      {
        type: 'stat',
        value: '3:1',
        caption:
          'The conventional healthy floor — earn back three times what a customer costs to acquire.',
      },
      {
        type: 'p',
        text: 'Treat the bands as heuristics, not laws. A blended 3.2 can hide a 6 in enterprise and a 1.1 in self-serve; segment before you celebrate. Industries differ too — a compliance tool with 2% monthly churn and a consumer app with 8% cannot share one bar.',
      },
      {
        type: 'p',
        text: 'Context sets the bar as well. A bootstrapped company cannot safely run the ratios a funded one can — there is no next round to absorb a slow payback. And an enterprise motion with a $40k CAC and 2% churn lives at ratios a self-serve product at $50 a month will never see. The benchmark is the opening of a conversation with your own numbers, not a verdict delivered from outside.',
      },
      { type: 'h2', text: 'Where the ratio lies' },
      {
        type: 'p',
        text: 'The formula is honest; the inputs rarely are. The four standard deceptions, in order of popularity:',
      },
      {
        type: 'ul',
        items: [
          'Churn measured badly. Logo churn understates loss when downgrades shrink revenue quietly; net revenue churn can hide it behind expansion. Pick a definition, state it, and keep it consistent.',
          'Margin without support costs. Hosting and payment fees are easy to include; the support headcount and the success team are commonly forgotten — inflating LTV by a quarter or more.',
          'CAC salaried away. If the founders sell and nobody charges those hours to acquisition, CAC looks magical — until the salaried salespeople arrive and the ratio tells the truth.',
          'Blending cohorts. A blended average mixes your cheapest early customers with your most expensive recent ones. Cohort it: the trend is the truth, the average is the marketing.',
        ],
      },
      { type: 'quote', text: 'The formula never lies. The inputs lie constantly.' },
      { type: 'h2', text: 'Payback period — the companion metric' },
      {
        type: 'p',
        text: 'LTV:CAC is a lifetime claim, and lifetimes are long and theoretical. CAC payback is the cash reality: how many months of gross profit it takes to earn back one customer’s acquisition cost. The commonly cited target is under 12 months. Beyond 24, growth consumes cash faster than customers return it, and no ratio can disguise that for long.',
      },
      {
        type: 'stat',
        value: '<12 mo',
        caption:
          'The commonly cited CAC payback target — months of gross profit to earn back one customer.',
      },
      {
        type: 'p',
        text: 'Read the two together. A healthy ratio with a slow payback says your economics work eventually and your runway does not. A mediocre ratio with a fast payback is often fundable: the machine pays for its own improvements.',
      },
      {
        type: 'p',
        text: 'Payback also converts the ratio into runway arithmetic. A $300 CAC paid back in 7.5 months means every dollar of sales spend returns within the year. The same CAC paid back over 24 months means funding each customer for two years before the first dollar of profit — same ratio, different company, depending on those months.',
      },
      { type: 'h2', text: 'The arithmetic, walked' },
      {
        type: 'p',
        text: 'One worked example, visibly. A $50-per-month plan at 80% gross margin, losing 3% of customers a month, acquired at $300:',
      },
      {
        type: 'ul',
        items: [
          'Monthly gross profit per customer: $50 × 0.8 = $40.',
          'Expected customer lifetime: 1 ÷ 0.03 ≈ 33.3 months.',
          'Lifetime value: $40 × 33.3 ≈ $1,333.',
          'LTV:CAC: $1,333 ÷ $300 ≈ 4.4.',
          'CAC payback: $300 ÷ $40 = 7.5 months.',
        ],
      },
      {
        type: 'stat',
        value: '4.4×',
        caption:
          'The worked example’s verdict — healthy by convention, with a 7.5-month payback.',
      },
      {
        type: 'p',
        text: 'Now change one input. At 6% churn, lifetime halves to about 16.7 months, LTV falls to roughly $667, and the ratio drops to 2.2 — from healthy to fragile on a single percentage point. Margin mis-measured by ten points moves the verdict similarly: at 70% margin the example falls to about 3.9; at 90% it rises to 5.0. The two inputs finance argues about annually swing the health verdict by a full band. That sensitivity is why churn is the first number to measure honestly and the last one to fudge.',
      },
      { type: 'cta', tool: 'saas-calculator' },
      { type: 'h2', text: 'Which lever to pull first' },
      {
        type: 'p',
        text: 'When the ratio disappoints, four levers move it: pricing, churn, margin, and sales efficiency. They are not equal, and the order matters:',
      },
      {
        type: 'ul',
        items: [
          'Pricing is the fastest lever. Raising price 10% lifts lifetime value directly, today, with no code — provided the market holds. Underpricing is the most common SaaS disease and the cheapest to treat.',
          'Churn is the strongest lever. Halving churn doubles lifetime value, and the effect compounds through every later cohort. It is also the slowest lever: it is earned through onboarding, reliability, and fit, one release at a time.',
          'Margin is the engineering lever. Cutting the infrastructure cost of serving each customer lifts lifetime value quietly and permanently — routinely the most overlooked work on the roadmap.',
          'Sales efficiency is the CAC side. Narrow the ideal customer profile, tighten the funnel, retire the demos that never close — ratio improvements that cost discipline rather than cash.',
        ],
      },
      {
        type: 'p',
        text: 'A rough order of attack: price first, because it is cheapest to test; churn second, because it compounds hardest; margin third, because it is permanent; and sales efficiency always.',
      },
      { type: 'h2', text: 'When to run a bad ratio on purpose' },
      {
        type: 'p',
        text: 'There are two defensible reasons to operate below 3:1. Both are temporary, and both are declared in advance rather than discovered later.',
      },
      {
        type: 'ul',
        items: [
          'Funded growth. When capital is cheap and the market is a race, buying customers at 2:1 with an improving trend can be the correct aggressive play — the ratio is the price of speed. The test is direction: payback shortening and churn falling mean the machine is being built, not just bought.',
          'Deliberate payback investment. Spending ahead on sales capacity or onboarding makes this quarter’s ratio ugly and next year’s healthy — if the spending is written down as an investment with a thesis, not absorbed as noise.',
        ],
      },
      {
        type: 'p',
        text: 'The distinction between a bad ratio chosen and a bad ratio discovered is usually visible in the spreadsheet. A chosen one has a dated plan to return above water — a churn target, a payback trend, a quarter named in advance. A discovered one has a growth deck.',
      },
      {
        type: 'p',
        text: 'What is not defensible is a bad ratio discovered rather than chosen. Run the numbers on purpose, or the market runs them for you — and none of this requires a finance team. The division is one line; the discipline is keeping the inputs honest.',
      },
      { type: 'cta', tool: 'roi-calculator' },
    ],
  },
];

export function getArticle(slug: string): Article | undefined {
  return articles.find((article) => article.slug === slug);
}
