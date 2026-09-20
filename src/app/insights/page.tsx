import type { Metadata } from 'next';
import InsightsIndex from '@/components/insights/InsightsIndex';
import { OG_IMAGES } from '@/lib/seo';

export const metadata: Metadata = {
  title: 'Insights on Software, Product & Cost — IQAAN',
  description:
    'Essays on software cost, MVP scope, and the SaaS metrics that decide survival — each paired with a free calculator you can run yourself. From the IQAAN studio.',
  keywords: [
    'software development cost',
    'how to scope an mvp',
    'ltv cac ratio',
    'saas metrics',
    'software budgeting',
  ],
  openGraph: {
    title: 'Insights on Software, Product & Cost — IQAAN',
    description:
      'Essays on software cost, MVP scope, and SaaS unit economics — each paired with a free calculator.',
    siteName: 'IQAAN',
    type: 'website',
    images: OG_IMAGES,
  },
};

export default function InsightsHubPage() {
  return <InsightsIndex />;
}
