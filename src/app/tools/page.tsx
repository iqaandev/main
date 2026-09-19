import type { Metadata } from 'next';
import ToolsIndex from '@/components/tools/ToolsIndex';
import { OG_IMAGES } from '@/lib/seo';

export const metadata: Metadata = {
  title: 'Free Business Decision Tools for Software Builders — IQAAN Tools',
  description:
    'Seven free, privacy-first decision tools for founders and product owners: software project cost estimator, MVP feature prioritizer, SaaS unit economics calculator, tech stack advisor, cloud cost estimator, maintenance cost calculator, and project ROI calculator. Everything runs in your browser — nothing is uploaded.',
  keywords: [
    'software cost estimator',
    'app cost calculator',
    'mvp feature prioritizer',
    'saas unit economics calculator',
    'ltv cac calculator',
    'tech stack advisor',
    'cloud cost estimator',
    'software maintenance cost calculator',
    'project roi calculator',
    'business decision tools',
  ],
  openGraph: {
    title: 'Free Business Decision Tools for Software Builders — IQAAN Tools',
    description:
      'Seven free, privacy-first decision calculators for software budgets, scopes, stacks, and returns. Built with conviction by IQAAN.',
    siteName: 'IQAAN',
    type: 'website',
    images: OG_IMAGES,
  },
};

export default function ToolsHubPage() {
  return <ToolsIndex />;
}
