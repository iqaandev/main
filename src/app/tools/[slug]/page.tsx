import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getTool, tools, type Tool } from '@/lib/tools/registry';
import ToolLayout from '@/components/tools/ToolLayout';
import { OG_IMAGES } from '@/lib/seo';
import ProjectCostEstimator from '@/components/tools/ProjectCostEstimator';
import MvpPrioritizer from '@/components/tools/MvpPrioritizer';
import SaasCalculator from '@/components/tools/SaasCalculator';
import TechStackAdvisor from '@/components/tools/TechStackAdvisor';
import CloudCostEstimator from '@/components/tools/CloudCostEstimator';
import MaintenanceCalculator from '@/components/tools/MaintenanceCalculator';
import RoiCalculator from '@/components/tools/RoiCalculator';
import type { ComponentType } from 'react';

const toolComponents: Record<string, ComponentType> = {
  'project-cost-estimator': ProjectCostEstimator,
  'mvp-prioritizer': MvpPrioritizer,
  'saas-calculator': SaasCalculator,
  'tech-stack-advisor': TechStackAdvisor,
  'cloud-cost-estimator': CloudCostEstimator,
  'maintenance-calculator': MaintenanceCalculator,
  'roi-calculator': RoiCalculator,
};

export function generateStaticParams() {
  return tools.map((tool) => ({ slug: tool.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const tool = getTool(slug);
  if (!tool) return {};
  return {
    title: `${tool.name} — Free Online Tool | IQAAN Tools`,
    description: tool.description,
    keywords: [tool.name.toLowerCase(), ...tool.short.split(' ').slice(0, 4).map((w) => w.toLowerCase()), 'free online tool'],
    openGraph: {
      title: `${tool.name} — Free Online Tool | IQAAN Tools`,
      description: tool.description,
      siteName: 'IQAAN',
      type: 'website',
      images: OG_IMAGES,
    },
  };
}

export default async function ToolPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const tool: Tool | undefined = getTool(slug);
  if (!tool) notFound();

  const ToolComponent = toolComponents[slug];
  if (!ToolComponent) notFound();

  const faqJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: tool.faq.map((item) => ({
      '@type': 'Question',
      name: item.q,
      acceptedAnswer: {
        '@type': 'Answer',
        text: item.a,
      },
    })),
  };

  return (
    <ToolLayout tool={tool}>
      <script
        type="application/ld+json"
        // Static content from the registry, prerendered for crawlers.
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
      <ToolComponent />
    </ToolLayout>
  );
}
