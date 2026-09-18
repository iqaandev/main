/*
 * IQAAN Tools registry — single source of truth for the /tools hub,
 * tool routes, metadata, and the sitemap. Seven business decision tools
 * for founders, product owners, and businesses scoping software.
 * Content is English-only this release; the nav label is translated in
 * both dictionaries.
 */

export type ToolCategory = 'Estimator' | 'Planner' | 'Advisor' | 'Calculator';

export interface ToolFaq {
  q: string;
  a: string;
}

export interface Tool {
  /** URL slug under /tools/ */
  slug: string;
  /** Slugs of related tools surfaced as cross-links on the tool page */
  related: string[];
  /** Display name — also the H1 and the <title> lead */
  name: string;
  /** One-sentence subtitle under the H1, and the hub row description */
  short: string;
  /** 2–3 keyword-rich sentences — used as the meta description */
  description: string;
  /** 2–3 paragraphs for the on-page "About this tool" SEO block */
  longDescription: string[];
  faq: ToolFaq[];
  category: ToolCategory;
}

/** Canonical site origin — used by sitemap.ts, robots.txt and OG metadata. */
export const SITE_URL = 'https://iqaan.com';

export const tools: Tool[] = [
  {
    slug: 'project-cost-estimator',
    related: ['roi-calculator', 'maintenance-calculator', 'mvp-prioritizer'],
    name: 'Software Project Cost Estimator',
    short:
      'Estimate what your software project costs to build — platform, features, complexity, design, and timeline priced live into a budget range.',
    description:
      'Free software project cost estimator. Price a web, mobile, or desktop build in seconds — platform base, per-feature costs, complexity, design level, and timeline dials produce a realistic budget range, team shape, and duration. Private, client-side, no signup.',
    longDescription: [
      'Answer six questions the way an estimator at a studio actually would: which platform, what scope, which features, how complex, how much design, and how aggressive the timeline. Every dial re-prices the estimate instantly into an honest range — never a false-precision single number — because real quotes move with the same inputs. The model behind it is calibrated on delivered projects, and every rate constant is documented, not hidden.',
      'Beyond the headline budget you get the working assumptions a delivery lead would sketch: an itemized breakdown table from platform base to timeline adjustment, a suggested team shape across product, design, engineering, and QA, and a duration estimate derived from how many developers the budget can honestly support. Change the timeline to aggressive and watch both price and team react — speed is bought with parallelism, not discounts.',
      'The estimator runs entirely in your browser with no account and no server. Nothing you enter is uploaded, and nothing is remembered between visits. When the number looks plausible, the honest next step is a conversation — IQAAN turns ranges like these into firm, itemized quotes within 48 hours.',
    ],
    faq: [
      {
        q: 'How much does it cost to build an app?',
        a: 'A focused MVP starts around $15k–$30k; a full production product with payments, dashboards, and custom design typically lands between $60k and $150k. The estimator prices your exact combination — platform, features, complexity, design level, and timeline — into a range in seconds.',
      },
      {
        q: 'How is this different from a quote?',
        a: 'It is an estimate: a calibrated model of typical rates and effort, blind to your specific context. A quote is a commitment — itemized, signed, and backed by a team. Use this to budget and sanity-check; then IQAAN delivers a firm, itemized quote within 48 hours.',
      },
      {
        q: 'Why does the aggressive timeline increase the price?',
        a: 'Compressing a schedule means more developers working in parallel, tighter coordination, and schedule risk absorbed by the studio — the model prices that at a 30% premium. Relaxed timelines get a small discount because sequencing one team steadily is the cheapest way to build.',
      },
      {
        q: 'What is the range based on?',
        a: 'The point estimate applies studio-calibrated base rates, feature costs, and multipliers; the presented range is ±20% around it. Any estimator that gives you one number to the dollar is guessing with more decimals.',
      },
    ],
    category: 'Estimator',
  },
  {
    slug: 'mvp-prioritizer',
    related: ['project-cost-estimator'],
    name: 'MVP Feature Prioritizer',
    short:
      'Score features by impact × confidence ÷ effort, drag the cut line between v1 and later, and copy a ready-to-paste MVP scope.',
    description:
      'Free MVP feature prioritizer. Score every feature on impact, confidence, and effort with live sliders, watch the list re-sort by value, set the v1 cut line, and copy a clean scope summary — RICE-style scoring, entirely in your browser.',
    longDescription: [
      'The classic MVP failure is building everything and shipping nothing. This prioritizer applies a simplified RICE score — impact × confidence ÷ effort — with three 1-to-5 sliders per feature. The list re-sorts live as you score, so the debate stops being opinions and becomes arithmetic everyone can see.',
      'The cut line is the honest part: slide it until the v1 scope is something you would actually dare to ship. Everything above the line is your MVP; everything below is explicitly later. One click copies a plain-text scope summary — "MVP scope — v1: a, b, c. Later: d, e." — ready for a spec, a deck, or a message to your team.',
      'Scoring happens entirely client-side; your roadmap never leaves your machine. It seeds with four common features so the mechanics teach themselves — replace them with your own and the ordering logic stays the same.',
    ],
    faq: [
      {
        q: 'What is the scoring formula?',
        a: 'Score = impact × confidence ÷ effort, each rated 1–5. Impact is how much the feature moves your core metric, confidence is how sure you are of that estimate, and effort is build cost. Dividing by effort is what makes cheap high-value features float to the top.',
      },
      {
        q: 'How many features should ship in v1?',
        a: 'Fewer than feels comfortable. A useful heuristic: if the v1 column would take longer than a quarter or needs more than one sentence to justify to a customer, move the cut line up. The slider exists precisely so you can feel the trade-off.',
      },
      {
        q: 'Is this RICE?',
        a: 'It is RICE with the Reach term removed — impact × confidence ÷ effort. Reach matters when comparing features across different user segments; for a first MVP with no users yet, the three remaining terms carry the signal.',
      },
      {
        q: 'Can I share the prioritized list with my team?',
        a: 'Yes — the copy button produces a plain-text summary of the v1 and later scopes in score order, ready to paste into any document, ticket, or chat.',
      },
    ],
    category: 'Planner',
  },
  {
    slug: 'saas-calculator',
    related: ['roi-calculator', 'tech-stack-advisor'],
    name: 'SaaS Unit Economics Calculator',
    short:
      'Compute LTV, LTV:CAC, CAC payback, MRR, ARR, and a 12-month MRR projection — the numbers that decide if your SaaS works.',
    description:
      'Free SaaS unit economics calculator. Work out LTV, the LTV:CAC ratio, CAC payback months, ARPU, MRR, and ARR from price, margin, churn, and growth — with a 12-month projected MRR chart. All client-side, nothing uploaded.',
    longDescription: [
      'Growth without unit economics is a leaky bucket with better marketing. Six inputs — price, gross margin, monthly churn, CAC, subscriber count, and net growth — drive the whole model: lifetime value, the LTV:CAC ratio with an honest health verdict, CAC payback in months, and the MRR/ARR/ARPU snapshot you will be asked for at every board meeting.',
      'The projection strip compounds your net growth rate over twelve months and draws it as twelve plain bars, so the difference between 3% and 6% monthly growth stops being abstract. The formulas are standard and stated openly: LTV = price × margin ÷ churn, payback = CAC ÷ monthly gross profit per subscriber. No hockey sticks, no dark arts.',
      'Everything computes locally in your browser. Your pricing and churn numbers are nobody\u2019s business but yours — which is exactly why this tool makes no network calls at all.',
    ],
    faq: [
      {
        q: 'What is a good LTV:CAC ratio?',
        a: 'The convention: 3:1 or better is healthy — you earn back three times what a customer costs to acquire. Between 1 and 3 is watch territory; below 1 you are paying more for customers than they ever return, which no volume of growth fixes. The calculator color-codes all three zones live.',
      },
      {
        q: 'How is LTV calculated here?',
        a: 'LTV = (price × gross margin) ÷ monthly churn. With a $50 plan at 80% margin and 3% monthly churn, a customer is worth about $1,333 in gross profit — 50 × 0.8 ÷ 0.03. Margin matters: revenue you never keep is not lifetime value.',
      },
      {
        q: 'What counts as CAC payback?',
        a: 'CAC payback = CAC ÷ gross profit per subscriber per month. A $300 CAC against $40 of monthly gross profit pays back in 7.5 months. Under 12 months is generally considered healthy; over 24 and cash flow becomes the strategy.',
      },
      {
        q: 'Does the projection account for churn?',
        a: 'Yes — enter your net monthly growth (new subscribers minus churned, as a percentage of the current base) and the strip compounds that rate across twelve months. Using net growth keeps the model honest about what churn quietly subtracts.',
      },
    ],
    category: 'Calculator',
  },
  {
    slug: 'tech-stack-advisor',
    related: ['cloud-cost-estimator', 'saas-calculator'],
    name: 'Tech Stack Advisor',
    short:
      'Answer six questions — product, scale, deadline, team, SEO, budget — and get a recommended stack with honest reasoning and an alternative.',
    description:
      'Free tech stack advisor for founders. Six guided questions about your product, scale, timeline, team background, SEO, and budget produce a recommended frontend, backend, database, and hosting stack — with reasoning you can defend. Fully client-side.',
    longDescription: [
      'Choosing a stack is where most software projects quietly go wrong — not because anyone picked a bad technology, but because they picked a technology foreign to the people who must ship it. This advisor walks six questions, one at a time, and scores your answers against six curated, boring-in-the-good-way stacks: Next.js + Postgres, Django, Laravel, Rails, React Native + Node, and Flutter + Firebase.',
      'The result is an editorial card, not a wall of logos: frontend, backend, database, and hosting rows, each with a one-line reason; two or three bullets on why the choice fits your specific answers; and — because no recommendation is universal — an honest note about when to prefer the runner-up instead. Mobile projects are scored strictly between React Native and Flutter by team background, and AI products lean Python by design.',
      'The whole questionnaire runs in your browser — no account, no tracking, no email gate. Keyboard players can fly through it with number keys and arrows.',
    ],
    faq: [
      {
        q: 'How does the advisor choose a stack?',
        a: 'Each answer adds points to the stacks it suits, across six dimensions: what you are building, expected scale, time to market, team background, SEO criticality, and budget posture. The highest total wins; the scoring matrix is a documented model, not a vibe. Mobile projects are deliberately shortlisted to React Native vs Flutter, decided by your team\u2019s background.',
      },
      {
        q: 'Why does team background matter so much?',
        a: 'Because stacks are hiring and velocity decisions in disguise. A JavaScript team ships faster on Next.js or React Native; a Python team should rarely be talked out of Django; a PHP team already owns half of Laravel\u2019s mental model. The best stack is overwhelmingly the one your people can drive hard.',
      },
      {
        q: 'Which stacks can it recommend?',
        a: 'Six curated options: Next.js + Postgres, Django + Postgres, Laravel + MySQL, Rails + Postgres, React Native + Node, and Flutter + Firebase. Deliberately mainstream choices with large talent pools and a decade of answers — exotic stacks make poor defaults.',
      },
      {
        q: 'Is the recommendation binding?',
        a: 'No — treat it as a strong default and a conversation starter. Every result card includes an honest alternative note describing when the runner-up is the better call. IQAAN validates stack fit against your actual requirements before anything is built.',
      },
    ],
    category: 'Advisor',
  },
  {
    slug: 'cloud-cost-estimator',
    related: ['tech-stack-advisor', 'project-cost-estimator'],
    name: 'Cloud Cost Estimator',
    short:
      'Estimate your monthly cloud bill — compute, storage, bandwidth, and extras — from users and per-user workload, at public list prices.',
    description:
      'Free cloud cost estimator. Model your monthly AWS/GCP/Azure bill from monthly active users, storage and bandwidth per user, compute tier, and CDN, database, media, and backup options — a full breakdown table and annual figure, 2026 ballpark pricing.',
    longDescription: [
      'Cloud bills scale with users, and "it is basically free at our size" is how surprise invoices are born. Start from monthly active users on a log slider from 100 to a million, add per-user storage and bandwidth, pick a compute tier, and toggle the extras real products accumulate — CDN, managed database, media processing, daily backups.',
      'The model uses public cloud list prices as a 2026 ballpark: $0.023/GB storage, $0.09/GB egress, and compute tiers from a $15 serverless floor to heavy dedicated workloads, each scaling per user. The breakdown table shows every line so you can see which assumption is actually driving the total — usually bandwidth — and the headline is a range, because real bills vary with region, reservations, and egress agreements.',
      'Estimates run entirely client-side. Nothing is uploaded, and the numbers you model stay between you and your browser.',
    ],
    faq: [
      {
        q: 'Whose prices does this use?',
        a: 'Public list prices from the major clouds (AWS, GCP, Azure), blended into a 2026 ballpark: object storage at $0.023/GB-month, egress at $0.09/GB, and documented per-tier compute rates. Reserved instances, committed-use discounts, and egress deals can cut real bills by 30–60% — the range shown is list, not negotiated.',
      },
      {
        q: 'Why is bandwidth usually the biggest line?',
        a: 'Egress is the cloud\u2019s quietest profit center: media-heavy products can move gigabytes per user per month, and $0.09/GB compounds fast at scale. A CDN moves delivery to the edge at a fraction of origin egress — toggle it on and watch the bandwidth line react.',
      },
      {
        q: 'How do I pick a compute tier?',
        a: 'Serverless suits spiky or light workloads (forms, APIs, cron jobs); Small fits typical web apps; Medium is for constant background work, queues, or search; Large is for heavy processing, video, or ML inference. When in doubt, estimate one tier up — compute is the line most often renegotiated.',
      },
      {
        q: 'Does the estimate include my engineer\u2019s time?',
        a: 'No — this is infrastructure only. Running infrastructure also costs engineering time (patching, monitoring, incidents); the managed database option prices part of that away. For the full picture, pair this with the maintenance calculator.',
      },
    ],
    category: 'Estimator',
  },
  {
    slug: 'maintenance-calculator',
    related: ['project-cost-estimator', 'roi-calculator'],
    name: 'Maintenance Cost Calculator',
    short:
      'Price the monthly retainer your application actually needs — size, technology age, compliance, support level, and release cadence, benchmarked honestly.',
    description:
      'Free software maintenance cost calculator. Estimate monthly upkeep from application size, technology age, users, compliance, support expectation, and release cadence — hours × blended rate, compared against the 15–20%-of-build-cost industry benchmark.',
    longDescription: [
      'Software is not a purchase; it is a pet. This calculator prices the ongoing care a healthy application needs: a baseline hours budget by size, multiplied honestly for technology age, user load, compliance burden, support expectation, and release cadence — then priced at a blended studio rate with the hours shown, not hidden.',
      'The industry rule of thumb says maintenance runs 15–20% of the original build cost per year. Enter what your build cost and the calculator renders both numbers side by side, so you can see whether your setup prices above or below the benchmark — and why. Legacy code, regulated industries, and 24×7 commitments push estimates up the scale; a current stack with modest scope pulls them down.',
      'Everything is computed in your browser. No account, no tracking, and nothing about your systems leaves your machine.',
    ],
    faq: [
      {
        q: 'How much does software maintenance cost per month?',
        a: 'A small, current application typically needs $700–$1,700/month; a typical medium product runs $2,000–$5,000; large or legacy platforms with SLAs can exceed $15,000/month. The calculator prices your exact combination of size, technology age, users, compliance, support, and release cadence.',
      },
      {
        q: 'What is the 15–20% benchmark?',
        a: 'A widely cited industry norm: annual maintenance costs 15–20% of the original build price — a $120k build implies $18k–$24k a year, or $1.5k–$2k a month. It is a sanity check, not a law; the calculator shows your estimate and the benchmark side by side.',
      },
      {
        q: 'Why does legacy technology cost more to maintain?',
        a: 'Older stacks carry expired dependencies, scarce specialists, missing documentation, and regressions hiding behind every change — the model prices that at 1.8× the hours of a current stack. Often the honest answer is not a bigger retainer but a staged modernization.',
      },
      {
        q: 'What does a 24×7 SLA actually price?',
        a: 'The commitment, not the hours: someone must be reachable at 3 a.m., which means rotation, paging infrastructure, and on-call premiums. The model doubles the retainer versus business-hours support even though average weekly hours barely move.',
      },
    ],
    category: 'Estimator',
  },
  {
    slug: 'roi-calculator',
    related: ['project-cost-estimator', 'saas-calculator', 'maintenance-calculator'],
    name: 'Project ROI Calculator',
    short:
      'Will the project pay for itself? Investment vs hours saved, revenue, and avoided costs — payback period, 3-year ROI, and a 36-month break-even chart.',
    description:
      'Free project ROI calculator. Enter investment, ongoing costs, staff hours saved, new revenue, and costs avoided to get net yearly benefit, payback period in months, 3-year ROI, and a 36-month cumulative break-even chart. Client-side and private.',
    longDescription: [
      'Every internal tool, automation, or custom build lives or dies by one question: when does it pay for itself? This calculator takes the one-time investment, ongoing yearly costs, and the three benefit streams projects actually produce — staff hours saved at a loaded hourly rate, new revenue, and costs avoided — and computes the honest arithmetic.',
      'The outputs are the three numbers a decision-maker needs: net benefit per year, payback period in months (the headline), and 3-year ROI, color-coded so a value-destroying project cannot hide. The 36-month strip draws cumulative position month by month — bars below the dashed line still pay off the investment, viridian bars are months of real return.',
      'The model is deliberately undiscounted and transparent: at this horizon the decision is go or no-go, not treasury precision. All math runs in your browser; your business case never leaves your machine.',
    ],
    faq: [
      {
        q: 'How is payback period calculated?',
        a: 'Payback = one-time investment ÷ monthly net benefit, where net benefit is hours saved × loaded rate + new revenue + costs avoided − ongoing monthly costs. A $60,000 investment returning $5,000 a month pays back in exactly 12 months.',
      },
      {
        q: 'What is a loaded hourly rate?',
        a: 'The fully burdened cost of an hour: salary plus benefits, taxes, equipment, and overhead — typically 1.5–2× the wage. Using the wage instead of the loaded rate quietly halves your savings, which is how business cases die in year two.',
      },
      {
        q: 'What ROI should a project clear?',
        a: 'A positive 3-year ROI is the floor, not the bar — most organizations want internal projects to clear roughly 2–3× over three years to justify the distraction. Anything paying back beyond 36 months on this chart deserves a harder look.',
      },
      {
        q: 'Why no discount rate or NPV?',
        a: 'At a 3-year horizon with typical software projects, discounting moves the answer by single-digit percents while burying the intuition. This tool optimizes for the go/no-go decision; your finance team can NPV the survivors.',
      },
    ],
    category: 'Calculator',
  },
];

export function getTool(slug: string): Tool | undefined {
  return tools.find((tool) => tool.slug === slug);
}
